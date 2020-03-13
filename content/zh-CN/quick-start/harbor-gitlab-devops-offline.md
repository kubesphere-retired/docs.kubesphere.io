---
title: "CI/CD 流水线示例 (离线版)"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere Installer 集成了 Harbor 和 GitLab，内置的 Harbor 和 GitLab 作为可选安装项，需在安装前进行配置开启安装。用户可以根据团队项目的需求来安装，方便对项目的镜像和代码进行管理，本文档适用于离线环境的流水线构建。

## 目的

本示例演示通过内置 GitLab 仓库中的 Jenkinsfile 来创建流水线，流水线共包含 7 个阶段，首先会将 GitLab 中的源码构建成镜像，然后推送到 Harbor 私有仓库，最终演示示例部署到 KubeSphere 集群中的开发环境 (Dev) 和生产环境 (Production) 且能够通过公网访问，这两个环境在底层的 Kubernetes 是以项目 (Namespace) 为单位进行资源隔离的。

## 前提条件

- 开启安装了 DevOps 功能组件，参考 [安装 DevOps 系统](../../installation/install-devops)；
- 本示例以 GitLab 和 Harbor 为例，请确保已安装 [内置 Harbor](../../installation/harbor-installation/) 和 [内置 GitLab](../../installation/gitlab-installation/)，已准备了基础镜像 `java:openjdk-8-jre-alpine`；
- 已创建了企业空间和 DevOps 工程并且创建了项目普通用户 `project-regular` 的账号，若还未创建请参考 [多租户管理快速入门](../admin-quick-start)；
- 使用项目管理员 `project-admin` 邀请项目普通用户 `project-regular` 加入 DevOps 工程并授予 `maintainer` 角色，若还未邀请请参考 [多租户管理快速入门 - 邀请成员](../admin-quick-start/#邀请成员)。
- 参考 [配置 ci 节点](../../system-settings/edit-system-settings/#如何配置-ci-节点进行构建) 为流水线选择执行构建的节点。


## 预估时间

30-50 分钟

## 操作示例

### 流水线概览

下面的流程图简单说明了流水线完整的工作过程：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190512155453.png)

> 流程说明：
>
> - **阶段一. Checkout SCM**: 拉取 GitLab 仓库代码
> - **阶段二. Unit test**: 单元测试，如果测试通过了才继续下面的任务
> - **阶段三. sonarQube analysis**：sonarQube 代码质量检测
> - **阶段四. Build & push snapshot image**: 根据行为策略中所选择分支来构建镜像，并将 tag 为 `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` 推送至 Harbor (其中 `$BUILD_NUMBER` 为 pipeline 活动列表的运行序号)。
> - **阶段五. Push latest image**: 将 master 分支打上 tag 为 latest，并推送至 Harbor。
> - **阶段六. Deploy to dev**: 将 master 分支部署到 Dev 环境，此阶段需要审核。
> - **阶段七. Push with tag**: 生成 tag 并 release 到 GitLab，并推送到 Harbor。
> - **阶段八. Deploy to production**: 将发布的 tag 部署到 Production 环境。

## 基础设置

### 第一步：修改 CoreDNS 配置

通过 CoreDNS 的 hosts 插件配置 KubeSphere 集群的 DNS 服务，使集群内部可通过 hostname 域名访问外部服务，参考 [修改系统配置 - 如何修改 CoreDNS 配置](../../system-settings/edit-system-settings)。

### 第二步：上传基础镜像到 Harbor

参考 [如何上传基础镜像到 Harbor](../../system-settings/push-img-harbor) 导入预先准备好的基础镜像 `java:openjdk-8-jre-alpine`。

## 创建凭证

使用项目普通用户 `project-regular` 登录 KubeSphere，进入已创建的 DevOps 工程，开始创建凭证。

1、本示例代码仓库中的 Jenkinsfile 需要用到 Harbor、GitLab 和 Kubernetes (kubeconfig 用于访问接入正在运行的 Kubernetes 集群) 等一共 3 个凭证 (credentials) ，参考 [创建凭证](../../devops/credential) 依次创建这三个凭证。

2、然后参考 [访问 SonarQube 并创建 Token](../../devops/sonarqube)，创建一个 Java 的 Token 并复制。

3、最后在 KubeSphere 中进入 `devops-demo` 的 DevOps 工程中，与上面步骤类似，在 **凭证** 下点击 **创建**，创建一个类型为 `秘密文本` 的凭证，凭证 ID 命名为 **sonar-token**，密钥为上一步复制的 token 信息，完成后点击 **确定**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-id.png)

至此，4 个凭证已经创建完成，下一步需要在示例仓库中的 jenkinsfile 修改对应的四个凭证 ID 为用户自己创建的凭证 ID。

![ce](https://kubesphere-docs.pek3b.qingstor.com/png/ce.png)

## 修改 Jenkinsfile

### 第一步：进入项目

1. 根据前提条件中的要求，现应已按照 [安装 GitLab](../../installation/gitlab-installation/) 要求正确将 GitHub 中的 [`devops-java-sample`](https://github.com/kubesphere/devops-java-sample) 导入到GitLab中。

> 注：若因网络限制，无法从 GitHub 导入，请自行 clone 至其他服务器，然后上传至 GitLab 仓库，仓库名称请保持一致。

![gitlab](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-succ.png)

2. 点击项目进入。

### 第二步：修改 Jenkinsfile

1、在 **根目录** 进入 **Jenkinsfile-on-prem**。

![jenkins](https://kubesphere-docs.pek3b.qingstor.com/png/jenkins.png)

2、在 GitLab UI 点击编辑 `Edit`，需要修改如下环境变量 (environment) 的值。

![edit](https://kubesphere-docs.pek3b.qingstor.com/png/edit.png)

| 修改项                   | 值                                   | 含义                                                         |
| :----------------------- | :----------------------------------- | :----------------------------------------------------------- |
| HARBOR\_CREDENTIAL\_ID     | harbor-id                            | 填写创建凭证步骤中的 Harbor 凭证 ID，用于登录您的 Harbor 仓库 |
| GITLAB\_CREDENTIAL\_ID     | gitlab-id                            | 填写创建凭证步骤中的 GitLab 凭证 ID，用于推送 tag 到 GitLab 仓库 |
| KUBECONFIG\_CREDENTIAL\_ID | demo-kubeconfig                      | kubeconfig 凭证 ID，用于访问接入正在运行的 Kubernetes 集群   |
| REGISTRY                 | harbor.devops.kubesphere.local:30280 | 默认为 Harbor 域名，用于镜像的推送                           |
| HARBOR_NAMESPACE         | library                              | 默认为 Harbor 下的 library 项目，可根据实际情况更改项目名称  |
| GITLAB_ACCOUNT           | admin1                               | GitLab用户，默认为admin1                                     |
| APP_NAME                 | devops-docs-sample                   | 应用名称                                                     |
| SONAR\_CREDENTIAL\_ID      | sonar-token                          | 填写创建凭证步骤中的 sonarQube token凭证 ID，用于代码质量检测 |

**注：`master` 分支 Jenkinsfile 中 `mvn` 命令的参数 `-o`，表示开启离线模式。本示例为适应某些环境下网络的干扰，以及避免在下载依赖时耗时太长，已事先完成相关依赖的下载，默认开启离线模式。示例仓库中的 `dependency` 分支主要用于缓存测试，离线环境中可忽略该分支的构建。**

## 创建两个项目

CI/CD 流水线会根据示例项目的 [yaml 模板文件](https://github.com/kubesphere/devops-java-sample/tree/master/deploy)，最终将示例分别部署到 Dev 和 Production 这两个项目 (Namespace) 环境中，项目名为 `kubesphere-sample-dev` 和 `kubesphere-sample-prod`，这两个项目需要预先在控制台依次创建，可参考 [基于Spring Boot项目构建流水线 - 创建项目](../devops-online/#创建项目) 进行创建。

![project](https://kubesphere-docs.pek3b.qingstor.com/png/project.png)

## 创建流水线

### 第一步：填写基本信息

1、进入已创建的 DevOps 工程，选择左侧菜单栏的 **流水线**，然后点击 **创建**。

![create-pipeline](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_create.png)

2、在弹出的窗口中，输入流水线的基本信息。

- 名称：为创建的流水线起一个简洁明了的名称，便于理解和搜索
- 描述信息：简单介绍流水线的主要特性，帮助进一步了解流水线的作用
- 代码仓库：点击选择代码仓库，代码仓库需已存在 Jenkinsfile

![basic_info](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_info.png)

### 第二步：添加 Git 仓库

1、点击代码仓库，以添加 GitLab 仓库为例。

![addrepo](https://kubesphere-docs.pek3b.qingstor.com/png/addrepo.png)

2、输入仓库URl，默认为`http://gitlab.devops.kubesphere.local:30080/admin1/devops-java-sample.git`，

注意：GitLab 中提供的 HTTP 和 SSH URI 有误。HTTP URI 需要手动加上端口号30080，SSH URI 需要手动加上协议 `ssh://` 和端口号：30090。

证书选择之前创建的 `gitlab-id`。

点击 「保存」 后进行下一步。

### 第三步：高级设置

完成代码仓库相关设置后，进入高级设置页面，高级设置支持对流水线的构建记录、行为策略、定期扫描等设置的定制化，以下对用到的相关配置作简单释义。

1、构建设置中，勾选 `丢弃旧的构建`，此处的 **保留分支的天数** 和 **保留分支的最大个数** 默认为 -1。

![丢弃旧的分支](https://pek3b.qingstor.com/kubesphere-docs/png/20190425224048.png)

> 说明：
>
> 分支设置的保留分支的天数和保持分支的最大个数两个选项可以同时对分支进行作用，只要某个分支的保留天数和个数不满足任何一个设置的条件，则将丢弃该分支。假设设置的保留天数和个数为 2 和 3，则分支的保留天数一旦超过 2 或者保留个数超过 3，则将丢弃该分支。默认两个值为 -1，表示不自动删除分支。
>
> 丢弃旧的分支将确定何时应丢弃项目的分支记录。分支记录包括控制台输出，存档工件以及与特定分支相关的其他元数据。保持较少的分支可以节省 Jenkins 所使用的磁盘空间，我们提供了两个选项来确定应何时丢弃旧的分支：
>
> - 保留分支的天数：如果分支达到一定的天数，则丢弃分支。
> - 保留分支的个数：如果已经存在一定数量的分支，则丢弃最旧的分支。

2、默认的 **脚本路径** 为 Jenkinsfile，需要修改为 `Jenkinsfile-on-prem`。

> 注：路径是 Jenkinsfile 在代码仓库的路径，表示它在示例仓库的根目录，若文件位置变动则需修改其脚本路径。

3、在 **扫描 Repo Trigger** 勾选 `如果没有扫描触发，则定期扫描`，扫描时间间隔可根据团队习惯设定，本示例设置为 `5 minutes`。

> 说明：定期扫描是设定一个周期让流水线周期性地扫描远程仓库，根据 **行为策略** 查看仓库有没有代码更新或新的 PR。
>
> Webhook 推送：
>
> Webhook 是一种高效的方式可以让流水线发现远程仓库的变化并自动触发新的运行，GitHub 和 Git (如 Gitlab) 触发 Jenkins 自动扫描应该以 Webhook 为主，以上一步在 KubeSphere 设置定期扫描为辅。在本示例中，可以通过手动运行流水线，如需设置自动扫描远端分支并触发运行，详见 [设置自动触发扫描 - GitHub SCM](../../devops/auto-trigger)。

完成高级设置后点击 **创建**。

![advance](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_advance-schedule-off.png)

### 第四步：运行流水线

流水线创建后，点击浏览器的 **刷新** 按钮，可见一条自动触发远程分支后的运行记录。

1、点击右侧 **运行**，将根据上一步的 **行为策略** 自动扫描代码仓库中的分支，在弹窗选择需要构建流水线的 `master`分支，系统将根据输入的分支加载 Jenkinsfile (此示例为根目录下的 Jenkinsfile-on-prem)。

2、由于仓库的 Jenkinsfile-on-prem 中 `TAG_NAME: defaultValue` 没有设置默认值，因此在这里的 `TAG_NAME` 可以输入一个 tag 编号，比如输入 v0.0.1。

3、点击 **确定**，将新生成一条流水线活动开始运行。

> 说明: tag 用于在 GitLab 和 Harbor 中分别生成带有 tag 的 release 和镜像。 注意: 在主动运行流水线以发布 release 时，`TAG_NAME` 不应与之前代码仓库中所存在的 `tag` 名称重复，如果重复会导致流水线的运行失败。

![运行流水线](https://kubesphere-docs.pek3b.qingstor.com/png/run-pipeline-demo1.png)

至此，流水线 已完成创建并开始运行。

> 注：点击 **分支** 切换到分支列表，查看流水线具体是基于哪些分支运行，这里的分支则取决于上一步 **行为策略** 的发现分支策略。

![查看流水线](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_scan.png)

### 第五步：审核流水线

为方便演示，此处默认用当前账户来审核，当流水线执行至 `input` 步骤时状态将暂停，需要手动点击 **继续**，流水线才能继续运行。注意，在 Jenkinsfile-on-prem 中分别定义了三个阶段 (stage) 用来部署至 Dev 环境和 Production 环境以及推送 tag，因此在流水线中依次需要对 `deploy to dev, push with tag, deploy to production`这三个阶段审核 `3`次，若不审核或点击 **终止** 则流水线将不会继续运行。

![审核流水线](https://kubesphere-docs.pek3b.qingstor.com/png/devops_input.png)

> 说明：在实际的开发生产场景下，可能需要更高权限的管理员或运维人员来审核流水线和镜像，并决定是否允许将其推送至代码或镜像仓库，以及部署至开发或生产环境。Jenkinsfile 中的 `input` 步骤支持指定用户审核流水线，比如要指定用户名为 project-admin 的用户来审核，可以在 Jenkinsfile 的 input 函数中追加一个字段，如果是多个用户则通过逗号分隔，如下所示：

```groovy
···
input(id: 'release-image-with-tag', message: 'release image with tag?', submitter: 'project-admin,project-admin1')
···
```

## 查看流水线

1、点击流水线中 `活动` 列表下当前正在运行的流水线序列号，页面展现了流水线中每一步骤的运行状态，注意，流水线刚创建时处于初始化阶段，可能仅显示日志窗口，待初始化 (约一分钟) 完成后即可看到流水线。黑色框标注了流水线的步骤名称，示例中流水线共 8 个 stage，分别在 [Jenkinsfile-on-prem](https://github.com/kubesphere/devops-java-sample/blob/master/Jenkinsfile-on-prem) 中被定义。

![stage](https://kubesphere-docs.pek3b.qingstor.com/png/stage.png)

2、当前页面中点击右上方的 `查看日志`，查看流水线运行日志。页面展示了每一步的具体日志、运行状态及时间等信息，点击左侧某个具体的阶段可展开查看其具体的日志。日志可下载至本地，如出现错误，下载至本地更便于分析定位问题。

![log](https://kubesphere-docs.pek3b.qingstor.com/png/log.png)

## 验证运行结果

1、若流水线执行成功，点击该流水线下的 `代码质量`，即可看到通过 sonarQube 的代码质量检测结果，如下图(仅供参考)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-result.png)

2、流水线最终 build 的 Docker 镜像也将被成功地 push 到 Harbor 中，我们在 Jenkinsfile-on-prem 中已经配置过 Harbor，登录 Harbor 查看镜像的 push 结果，可以看到 tag 为 snapshot、TAG_NAME(master-1)、latest 的镜像已经被 push 到 Harbor，并且在 GitLab 中也生成了一个新的 tag 和 release。示例网站最终将以 deployment 和 service 分别部署到 KubeSphere 的 `kubesphere-sample-dev` 和 `kubesphere-sample-prod` 项目环境中。

| 环境       | 访问地址                               | 所在项目 (Namespace) | 部署 (Deployment) | 服务 (Service) |
| :--------- | :------------------------------------- | :------------------- | :---------------- | :------------- |
| Dev        | 公网 IP : 30861 (`${EIP}:${NODEPORT}`) | kubesphere-sample-dev       | ks-sample-dev     | ks-sample-dev  |
| Production | 公网 IP : 30961 (`${EIP}:${NODEPORT}`) | kubesphere-sample-prod      | ks-sample         | ks-sample      |

3、可通过 KubeSphere 回到项目列表，依次查看之前创建的两个项目中的部署和服务的状态。例如，以下查看 `kubesphere-sample-prod` 项目下的部署。

进入该项目，在左侧的菜单栏点击 **工作负载 → 部署**，可以看到 ks-sample 已创建成功。正常情况下，部署的状态应该显示 **运行中**。

![deploy](https://kubesphere-docs.pek3b.qingstor.com/png/deploy.png)

4、在菜单栏中选择 **网络与服务 → 服务** 也可以查看对应创建的服务，可以看到该服务对外暴露的节点端口 (NodePort) 是 `30961`。

**查看服务**
![service](https://kubesphere-docs.pek3b.qingstor.com/png/service.png)

5、查看推送到您个人的 Harbor 中的镜像，可以看到 `devops-java-sample` 就是 APP_NAME 的值，而 tag也是在 Jenkinsfile-on-prem 中定义的 tag。

## 访问示例服务

在浏览器或通过后台命令访问部署到 KubeSphere Dev 和 Production 环境的服务：

**Dev 环境**

例如，浏览器访问 `http://192.168.0.20:30861/` (即 `http://IP:NodePort/`) 可访问到示例页面，或通过后台命令验证：

```bash
curl http://192.168.0.20:30861
Really appreaciate your star, that's the power of our life.
```

**Prodcution 环境**

同上可访问 `http://192.168.0.20:30961/` (即 `http://IP:NodePort/`) 。


至此，结合 GitLab 和 Harbor，在离线环境下创建一个 Jenkinsfile in SCM 类型的流水线已经完成了，若创建过程中遇到问题，可参考 [常见问题](../../devops/devops-faq)。
