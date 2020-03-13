---
title: "基于Spring Boot项目构建流水线"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

Jenkinsfile in SCM 意为将 Jenkinsfile 文件本身作为源代码管理 (Source Control Management) 的一部分，根据该文件内的流水线配置信息快速构建工程内的 CI/CD 功能模块，比如阶段 (Stage)，步骤 (Step) 和任务 (Job)。因此，在代码仓库中应包含 Jenkinsfile。

## 目的

本示例演示如何通过 GitHub 仓库中的 Jenkinsfile 来创建流水线，流水线共包括 8 个阶段，最终将演示示例部署到 KubeSphere 集群中的开发环境和生产环境且能够通过公网访问。
仓库中的 dependency 分支为缓存测试用例，测试方式与 master 分支类似，对 dependency 的多次构建可体现出利用缓存可以有效的提升构建速度。

## 前提条件

- 开启安装了 DevOps 功能组件，参考 [安装 DevOps 系统](../../installation/install-devops)；
- 本示例以 GitHub 和 DockerHub 为例，参考前确保已创建了 [GitHub](https://github.com/) 和 [DockerHub](http://www.dockerhub.com/) 账号；
- 已创建了企业空间和 DevOps 工程并且创建了项目普通用户 project-regular 的账号，若还未创建请参考 [多租户管理快速入门](../admin-quick-start)；
- 使用项目管理员 `project-admin` 邀请项目普通用户 `project-regular` 加入 DevOps 工程并授予 `maintainer` 角色，若还未邀请请参考 [多租户管理快速入门 - 邀请成员](../admin-quick-start/#邀请成员)。
- 参考 [配置 ci 节点](../../system-settings/edit-system-settings/#如何配置-ci-节点进行构建) 为流水线选择执行构建的节点。

## 视频教程

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/KS2.1_9-create-jenkinsfile-free-pipeline.mp4">
</video>

## 预估时间

30-50 分钟 (时间由于环境的网速等因素而有所不同) 。

## 操作示例

### 流水线概览

下面的流程图简单说明了流水线完整的工作过程：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190512155453.png)

> 流程说明：
>
> - **阶段一. Checkout SCM**: 拉取 GitHub 仓库代码
> - **阶段二. Unit test**: 单元测试，如果测试通过了才继续下面的任务
> - **阶段三. SonarQube analysis**：sonarQube 代码质量检测
> - **阶段四. Build & push snapshot image**: 根据行为策略中所选择分支来构建镜像，并将 tag 为 `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` 推送至 Harbor (其中 `$BUILD_NUMBER` 为 pipeline 活动列表的运行序号)。
> - **阶段五. Push latest image**: 将 master 分支打上 tag 为 latest，并推送至 DockerHub。
> - **阶段六. Deploy to dev**: 将 master 分支部署到 Dev 环境，此阶段需要审核。
> - **阶段七. Push with tag**: 生成 tag 并 release 到 GitHub，并推送到 DockerHub。
> - **阶段八. Deploy to production**: 将发布的 tag 部署到 Production 环境。

## 创建凭证

> 注意：
> - GitHub 账号或密码带有 "@" 这类特殊字符，需要创建凭证前对其进行 urlencode 编码，可通过一些 [第三方网站](http://tool.chinaz.com/tools/urlencode.aspx)进行转换，然后再将转换后的结果粘贴到对应的凭证信息中。
> - 这里需要创建的是凭证（Credential），不是密钥（Secret）。

在 [多租户管理快速入门](../zh-CN/quick-start/admin-quick-start) 中已给项目普通用户 project-regular 授予了 maintainer 的角色，因此使用 project-regular 登录 KubeSphere，进入已创建的 devops-demo 工程，开始创建凭证。

1、本示例代码仓库中的 Jenkinsfile 需要用到 **DockerHub、GitHub** 和 **kubeconfig** (kubeconfig 用于访问接入正在运行的 Kubernetes 集群) 等一共 3 个凭证 (credentials) ，参考 [创建凭证](../../devops/credential/#创建凭证) 依次创建这三个凭证。

2、然后参考 [访问 SonarQube 并创建 Token](../../devops/sonarqube)，创建一个 Java 的 Token 并复制。

3、最后在 KubeSphere 中进入 `devops-demo` 的 DevOps 工程中，与上面步骤类似，在 **凭证** 下点击 **创建**，创建一个类型为 `秘密文本` 的凭证，凭证 ID 命名为 **sonar-token**，密钥为上一步复制的 token 信息，完成后点击 **确定**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-id.png)

至此，4 个凭证已经创建完成，下一步需要在示例仓库中的 jenkinsfile 修改对应的四个凭证 ID 为用户自己创建的凭证 ID。

![](https://kubesphere-docs.pek3b.qingstor.com/png/credential-list-demo.png)

## 修改 Jenkinsfile

### 第一步：Fork项目

登录 GitHub，将本示例用到的 GitHub 仓库 [devops-java-sample](https://github.com/kubesphere/devops-java-sample) Fork 至您个人的 GitHub。

![](https://pek3b.qingstor.com/kubesphere-docs/png/fork-repo.png)

### 第二步：修改 Jenkinsfile

1、Fork 至您个人的 GitHub 后，在 **根目录** 进入 **Jenkinsfile-online**。

![jenkins-online](https://kubesphere-docs.pek3b.qingstor.com/png/jenkinsonline.png)

2、在 GitHub UI 点击编辑图标，需要修改如下环境变量 (environment) 的值。

![image-20190409121802459](https://kubesphere-docs.pek3b.qingstor.com/png/env.png)

| 修改项                   | 值                     | 含义                                                         |
| :----------------------- | :--------------------- | :----------------------------------------------------------- |
| DOCKER\_CREDENTIAL\_ID     | dockerhub-id           | 填写创建凭证步骤中的 DockerHub 凭证 ID，用于登录您的 DockerHub |
| GITHUB\_CREDENTIAL\_ID     | github-id              | 填写创建凭证步骤中的 GitHub 凭证 ID，用于推送 tag 到 GitHub 仓库 |
| KUBECONFIG\_CREDENTIAL\_ID | demo-kubeconfig        | kubeconfig 凭证 ID，用于访问接入正在运行的 Kubernetes 集群   |
| REGISTRY                 | docker.io              | 默认为 docker.io 域名，用于镜像的推送                         |
|DOCKERHUB_NAMESPACE|your-dockerhub-account| 替换为您的 DockerHub 账号名 <br> (它也可以是账户下的 Organization 名称)|
|GITHUB_ACCOUNT|your-github-account | 替换为您的 GitHub 账号名，例如 `https://github.com/kubesphere/` 则填写 `kubesphere` (它也可以是账户下的 Organization 名称) |
| APP_NAME                 | devops-java-sample     | 应用名称                                                     |
| SONAR\_CREDENTIAL\_ID | sonar-token            | 填写创建凭证步骤中的 SonarQube token凭证 ID，用于代码质量检测 |

**注：`master` 分支 Jenkinsfile 中 `mvn` 命令的参数 `-o`，表示开启离线模式。本示例为适应某些环境下网络的干扰，以及避免在下载依赖时耗时太长，已事先完成相关依赖的下载，默认开启离线模式。**

3、修改以上的环境变量后，点击 **Commit changes**，将更新提交到当前的 master 分支。

![提交更新](https://kubesphere-docs.pek3b.qingstor.com/png/commit-jenkinsfile.png)

4、若需要测试缓存，需要切换至 `dependency` 分支，对 `dependency` 分支下的 Jenkinsfile-online 做类似的修改，否则该分支的流水线将构建失败。

## 创建项目

CI/CD 流水线会根据示例项目的 [yaml 模板文件](<https://github.com/kubesphere/devops-java-sample/tree/master/deploy>)，最终将示例分别部署到 `kubesphere-sample-dev` 和 `kubesphere-sample-prod` 这两个项目 (Namespace) 环境中，这两个项目需要预先在控制台依次创建，参考如下步骤创建该项目。

### 第一步：创建第一个项目

> 提示：项目管理员 `project-admin` 账号已在 [多租户管理快速入门](../../quick-start/admin-quick-start) 中创建。

1、使用项目管理员 `project-admin` 账号登录 KubeSphere，在之前创建的企业空间 (demo-workspace) 下，点击 **项目 → 创建**，创建一个 **资源型项目**，作为本示例的开发环境，填写该项目的基本信息，完成后点击 **下一步**。


- 名称：固定为 `kubesphere-sample-dev`，若需要修改项目名称则需在 [yaml 模板文件](<https://github.com/kubesphere/devops-java-sample/tree/master/deploy>) 中修改 namespace
- 别名：可自定义，比如 **开发环境**
- 描述信息：可简单介绍该项目，方便用户进一步了解


2、本示例暂无资源请求和限制，因此高级设置中无需修改默认值，点击 **创建**，项目可创建成功。

### 第二步：邀请成员

第一个项目创建完后，还需要项目管理员 `project-admin` 邀请当前的项目普通用户 `project-regular` 进入 `kubesphere-sample-dev` 项目，进入「项目设置」→「项目成员」，点击「邀请成员」选择邀请 `project-regular` 并授予 `operator` 角色，若对此有疑问可参考 [多租户管理快速入门 - 邀请成员](../../quick-start/admin-quick-start/#邀请成员) 。

### 第三步：创建第二个项目

同上，参考以上两步创建一个名称为 `kubesphere-sample-prod` 的项目作为生产环境，并邀请普通用户 `project-regular` 进入 `kubesphere-sample-prod` 项目并授予 `operator` 角色。

> 说明：当 CI/CD 流水线后续执行成功后，在 `kubesphere-sample-dev` 和 `kubesphere-sample-prod` 项目中将看到流水线创建的部署 (Deployment) 和服务 (Service)。

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

### 第二步：添加仓库

1、点击代码仓库，以添加 Github 仓库为例。

2、点击弹窗中的 [获取 Token](https://github.com/settings/tokens/new?scopes=repo,read:user,user:email,write:repo_hook)。

![git_input](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_git_token.png)

3、在 GitHub 的 access token 页面填写 Token description，简单描述该 token，如 DevOps demo，在 Select scopes 中无需任何修改，点击 `Generate token`，GitHub 将生成一串字母和数字组成的 token 用于访问当前账户下的 GitHub repo。

![access-token](https://kubesphere-docs.pek3b.qingstor.com/png/access-token-screenshot.png)

4、复制生成的 token，在 KubeSphere Token 框中输入该 token 然后点击保存。

5、验证通过后，右侧会列出此 Token 关联用户的所有代码库，选择其中一个带有 Jenkinsfile 的仓库。比如此处选择准备好的示例仓库 [devops-java-sample](https://github.com/kubesphere/devops-java-sample)，点击 **选择此仓库**，完成后点击 **下一步**。

![image-20190409122653070](https://kubesphere-docs.pek3b.qingstor.com/png/image-20190409122653070.png)

### 第三步：高级设置

完成代码仓库相关设置后，进入高级设置页面，高级设置支持对流水线的构建记录、行为策略、定期扫描等设置的定制化，以下对用到的相关配置作简单释义。

1、分支设置中，勾选 `丢弃旧的分支`，此处的 **保留分支的天数** 和 **保留分支的最大个数** 默认为 -1。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat6b0ca0cf57ea9c1eaf44dbac633bb459.png)

> 说明：
>
> 分支设置的保留分支的天数和保持分支的最大个数两个选项可以同时对分支进行作用，只要某个分支的保留天数和个数不满足任何一个设置的条件，则将丢弃该分支。假设设置的保留天数和个数为 2 和 3，则分支的保留天数一旦超过 2 或者保留个数超过 3，则将丢弃该分支。默认两个值为 -1，表示将会丢弃已经被删除的分支。
>
> 丢弃旧的分支将确定何时应丢弃项目的分支记录。分支记录包括控制台输出，存档工件以及与特定分支相关的其他元数据。保持较少的分支可以节省 Jenkins 所使用的磁盘空间，我们提供了两个选项来确定应何时丢弃旧的分支：
>
> - 保留分支的天数：如果分支达到一定的天数，则丢弃分支。
> - 保留分支的个数：如果已经存在一定数量的分支，则丢弃最旧的分支。

2、行为策略中，KubeSphere 默认添加了三种策略。由于本示例还未用到 **从 Fork 仓库中发现 PR** 这条策略，此处可以删除该策略，点击右侧删除按钮。

![advance](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_advance-1.png)

> 说明：
>
> 支持添加三种类型的发现策略。需要说明的是，在 Jenkins 流水线被触发时，开发者提交的 PR (Pull Request) 也被视为一个单独的分支。
>
> 发现分支：
>
> - 排除也作为 PR 提交的分支：选择此项表示 CI 将不会扫描源分支 (比如 Origin 的 master branch)，也就是需要被 merge 的分支
> - 只有被提交为 PR 的分支：仅扫描 PR 分支
> - 所有分支：拉取的仓库 (origin) 中所有的分支
>
> 从原仓库中发现 PR：
>
> - PR 与目标分支合并后的源代码版本：一次发现操作，基于 PR 与目标分支合并后的源代码版本创建并运行流水线
> - PR 本身的源代码版本：一次发现操作，基于 PR 本身的源代码版本创建并运行流水线
> - 当 PR 被发现时会创建两个流水线，一个流水线使用 PR 本身的源代码版本，一个流水线使用 PR 与目标分支合并后的源代码版本：两次发现操作，将分别创建两条流水线，第一条流水线使用 PR 本身的源代码版本，第二条流水线使用 PR 与目标分支合并后的源代码版本

3、默认的 **脚本路径** 为 **Jenkinsfile**，请将其修改为 [**Jenkinsfile-online**](https://github.com/kubesphere/devops-java-sample/blob/master/Jenkinsfile-online)。

> 注：路径是 Jenkinsfile 在代码仓库的路径，表示它在示例仓库的根目录，若文件位置变动则需修改其脚本路径。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190505212550.png)

4、在 **扫描 Repo Trigger** 勾选 `如果没有扫描触发，则定期扫描`，扫描时间间隔可根据团队习惯设定，本示例设置为 `5 minutes`。

> 说明：定期扫描是设定一个周期让流水线周期性地扫描远程仓库，根据 **行为策略** 查看仓库有没有代码更新或新的 PR。
>
> Webhook 推送：
>
> Webhook 是一种高效的方式可以让流水线发现远程仓库的变化并自动触发新的运行，GitHub 和 Git (如 Gitlab) 触发 Jenkins 自动扫描应该以 Webhook 为主，以上一步在 KubeSphere 设置定期扫描为辅。在本示例中，可以通过手动运行流水线，如需设置自动扫描远端分支并触发运行，详见 [设置自动触发扫描 - GitHub SCM](/v2.0/zh-CN/devops/auto-trigger)。

完成高级设置后点击 **创建**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190505212814.png)

### 第四步：运行流水线

流水线创建后，点击浏览器的 **刷新** 按钮，可见两条自动触发远程分支后的运行记录，分别为 `master` 和 `dependency` 分支的构建记录。
![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatb68b13f091b9e9ec52ee3ff12dd5dd8e.png)

1、点击右侧 **运行**，将根据上一步的 **行为策略** 自动扫描代码仓库中的分支，在弹窗选择需要构建流水线的 `master`分支，系统将根据输入的分支加载 Jenkinsfile-online (默认是根目录下的 Jenkinsfile)。

2、由于仓库的 Jenkinsfile-online 中 `TAG_NAME: defaultValue` 没有设置默认值，因此在这里的 `TAG_NAME` 可以输入一个 tag 编号，比如输入 v0.0.1。

3、点击 **确定**，将新生成一条流水线活动开始运行。

> 说明: tag 用于在 Github 和DockerHub 中分别生成带有 tag 的 release 和镜像。 注意: 在主动运行流水线以发布 release 时，`TAG_NAME` 不应与之前代码仓库中所存在的 `tag` 名称重复，如果重复会导致流水线的运行失败。

![运行流水线](https://kubesphere-docs.pek3b.qingstor.com/png/run-pipeline-demo1.png)

至此，流水线 已完成创建并开始运行。

> 注：点击 **分支** 切换到分支列表，查看流水线具体是基于哪些分支运行，这里的分支则取决于上一步 **行为策略** 的发现分支策略。

![查看流水线](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_scan.png)

### 第五步：审核流水线

为方便演示，此处默认用当前账户来审核，当流水线执行至 `input` 步骤时状态将暂停，需要手动点击 **继续**，流水线才能继续运行。注意，在 Jenkinsfile-online 中分别定义了三个阶段 (stage) 用来部署至 Dev 环境和 Production 环境以及推送 tag，因此在流水线中依次需要对 `deploy to dev, push with tag, deploy to production` 这三个阶段审核 `3` 次，若不审核或点击 **终止** 则流水线将不会继续运行。

![审核流水线](https://kubesphere-docs.pek3b.qingstor.com/png/devops_input.png)

> 说明：在实际的开发生产场景下，可能需要更高权限的管理员或运维人员来审核流水线和镜像，并决定是否允许将其推送至代码或镜像仓库，以及部署至开发或生产环境。Jenkinsfile 中的 `input`步骤支持指定用户审核流水线，比如要指定用户名为 project-admin 的用户来审核，可以在 Jenkinsfile 的 input 函数中追加一个字段，如果是多个用户则通过逗号分隔，如下所示：

```groovy
···
input(id: 'release-image-with-tag', message: 'release image with tag?', submitter: 'project-admin,project-admin1')
···
```

## 查看流水线

1、点击流水线中 `活动` 列表下当前正在运行的流水线序列号，页面展现了流水线中每一步骤的运行状态，注意，流水线刚创建时处于初始化阶段，可能仅显示日志窗口，待初始化 (约一分钟) 完成后即可看到流水线。黑色框标注了流水线的步骤名称，示例中流水线共 8 个 stage，分别在 [Jenkinsfile-online](https://github.com/kubesphere/devops-java-sample/blob/master/Jenkinsfile-online) 中被定义。

![stage](https://kubesphere-docs.pek3b.qingstor.com/png/stage.png)

2、当前页面中点击右上方的 `查看日志`，查看流水线运行日志。页面展示了每一步的具体日志、运行状态及时间等信息，点击左侧某个具体的阶段可展开查看其具体的日志。日志可下载至本地，如出现错误，下载至本地更便于分析定位问题。

![log](https://kubesphere-docs.pek3b.qingstor.com/png/log.png)

## 验证运行结果

1、若流水线执行成功，点击该流水线下的 `代码质量`，即可看到通过 sonarQube 的代码质量检测结果，如下图(仅供参考)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-result.png)

2、流水线最终 build 的 Docker 镜像也将被成功地 push 到 DockerHub 中，我们在 Jenkinsfile-online 中已经配置过 DockerHub，登录 DockerHub 查看镜像的 push 结果，可以看到 tag 为 snapshot、TAG_NAME(master-1)、latest 的镜像已经被 push 到 DockerHub，并且在 GitHub 中也生成了一个新的 tag 和 release。演示示例页面最终将以 deployment 和 service 分别部署到 KubeSphere 的 `kubesphere-sample-dev` 和 `kubesphere-sample-prod` 项目环境中。

| 环境       | 访问地址                               | 所在项目 (Namespace) | 部署 (Deployment) | 服务 (Service) |
| :--------- | :------------------------------------- | :------------------- | :---------------- | :------------- |
| Dev        | `http://{$Virtual IP}:{$8080}` <br> 或者 `http://{$内网/公网 IP}:{$30861}` | kubesphere-sample-dev       | ks-sample-dev     | ks-sample-dev  |
| Production | `http://{$Virtual IP}:{$8080}` <br> 或者 `http://{$内网/公网 IP}:{$30961}`  | kubesphere-sample-prod      | ks-sample         | ks-sample      |

3、可通过 KubeSphere 回到项目列表，依次查看之前创建的两个项目中的部署和服务的状态。例如，以下查看 `kubesphere-sample-prod`项目下的部署。

进入该项目，在左侧的菜单栏点击 **工作负载 → 部署**，可以看到 ks-sample 已创建成功。正常情况下，部署的状态应该显示 **运行中**。

![sample](https://pek3b.qingstor.com/kubesphere-docs/png/20190426084733.png)

4、在菜单栏中选择 **网络与服务 → 服务** 也可以查看对应创建的服务，可以看到该服务的 Virtual IP 为 `10.233.42.3`，对外暴露的节点端口 (NodePort) 是 `30961`。

**查看服务**

![service](https://kubesphere-docs.pek3b.qingstor.com/png/service.png)

5、查看推送到您个人的 DockerHub 中的镜像，可以看到 `devops-java-sample`就是 APP_NAME 的值，而 tag 也是在 jenkinsfile-online 中定义的 tag。

![查看 DockerHub](https://kubesphere-docs.pek3b.qingstor.com/png/deveops-dockerhub.png)

6、点击 `release`，查看 Fork 到您个人 GitHub repo 中的 `v0.0.1` tag 和 release，它是由 jenkinsfile 中的 `push with tag` 生成的。

## 访问示例服务

若在内网环境访问部署的演示示例服务，可通过 SSH 登陆集群节点，或使用集群管理员登陆 KubeSphere 在 web kubectl 中输入以下命令验证访问，其中 Virtual IP 和节点端口 (NodePort) 可通过对应项目下的服务中查看：

**验证 Dev 环境的示例服务**

```shell
# curl {$Virtual IP}:{$Port} 或者 curl {$内网 IP}:{$NodePort}
curl 10.233.40.5:8080
Really appreaciate your star, that's the power of our life.
```

Virtual IP 在

**验证 Prodcution 环境的示例服务**

```shell
# curl {$Virtual IP}:{$Port} 或者 curl {$内网 IP}:{$NodePort}
curl 10.233.42.3:8080
Really appreaciate your star, that's the power of our life.
```

若两个服务都能访问成功，则说明流水线运行结果也是符合预期的。

> 提示：若需要在外网访问该服务，可能需要绑定公网 EIP 并配置端口转发和防火墙规则。在端口转发规则中将**内网端口**比如 30861 转发到**源端口** 30861，然后在防火墙开放这个**源端口**，保证外网流量可以通过该端口，外部才能够访问。例如在 QingCloud 云平台进行上述操作，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。

至此，基于 GitHub 和 DockerHub 的一个 Jenkinsfile in SCM 类型的流水线已经完成了，若创建过程中遇到问题，可参考 [常见问题](../../devops/devops-faq)。

## devops缓存测试

若希望测试该示例使用缓存后的提升效果，可在第一次自动触发的 `dependency` 分支构建完成后，再次手动触发 `dependency` 分支进行构建。

1、点击右侧 **运行**，将根据之前设置的 **行为策略** 自动扫描代码仓库中的分支，在弹窗选择需要构建流水线的 `dependency` 分支，系统将根据输入的分支加载 Jenkinsfile-online (默认是根目录下的 Jenkinsfile)。并且输入 `TAG_NAME`，点击确定。
![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatbdd81b896658a6958a1b315592db2306.png)

2、流水线开始运行，等待其构建完成。
![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatfcb5ea2d1f042a12f9120f234148ced6.png)

可发现，第二次构建利用了第一次构建时缓存的依赖，无需再次进行依赖下载。
