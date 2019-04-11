---
title: "示例九 - 流水线示例(在线版)" 
---

Jenkinsfile in SCM 意为将 Jenkinsfile 文件本身作为源代码管理 (Source Control Management) 的一部分，因此可使用 `git clone`或者其他类似的命令都能够获取此 Jenkinsfile，根据该文件内的流水线配置信息快速构建工程内的 CI/CD 功能模块，比如阶段 (Stage)，步骤 (Step) 和任务 (Job)。因此，在代码仓库中应包含 Jenkinsfile。

## 目的

本示例演示如何通过 GitHub 仓库中的 Jenkinsfile 来创建流水线，流水线共包括 8 个阶段，最终将一个文档网站部署到 KubeSphere 集群中的开发环境 (Dev) 和生产环境 (Production) 且能够通过公网访问，这两个环境在底层的 Kubernetes 是以项目 (Namespace) 为单位进行资源隔离的

## 前提条件

- 本示例的代码仓库以 GitHub 和 DockerHub 为例，参考前确保已创建了 [GitHub](https://github.com/) 和 [DockerHub](http://www.dockerhub.com/) 账号。
- 已创建了企业空间和 DevOps 工程，若还未创建请参考 [管理员快速入门](https://docs.kubesphere.io/advanced-v2.0/zh-CN/quick-start/admin-quick-start)。
- 熟悉 Git 分支管理和版本控制相关的基础知识，详见 [Git 官方文档](https://git-scm.com/book/zh/v2)。

## 预估时间

30-50 分钟 (时间由于环境的网速等因素而有所不同) 。

## 操作示例

### 流水线概览

下面的流程图简单说明了整个 pipeline 的工作过程：

![scicd-pipeline-01](https://kubesphere-docs.pek3b.qingstor.com/png/cicd-pipeline-01.png)

> 流程说明：
>
> - **阶段一. Checkout SCM**: 拉取 GitHub 仓库代码
> - **阶段二. Unit test**: 单元测试，如果测试通过了才继续下面的任务
> - **阶段三. sonarQube analysis**：sonarQube 代码质量检测
> - **阶段四. Build & push snapshot image**: 根据行为策略中所选择分支来构建镜像，并将 tag 为 `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` 推送至 Harbor (其中 `$BUILD_NUMBER` 为 pipeline 活动列表的运行序号)。
> - **阶段五. Push latest image**: 将 master 分支打上 tag 为 latest，并推送至 Harbor。
> - **阶段六. Deploy to dev**: 将 master 分支部署到 Dev 环境，此阶段需要审核。
> - **阶段七. Push with tag**: 生成 tag 并 release 到 GitHub，并推送到 Harbor。
> - **阶段八. Deploy to production**: 将发布的 tag 部署到 Production 环境。

## 创建凭证

在 [管理员快速入门](https://docs.kubesphere.io/advanced-v2.0/zh-CN/quick-start/admin-quick-start) 中已给 project-regular 授予了 maintainer 的角色，因此使用 project-regular 登录 KubeSphere，进入已创建的 DevOps 工程，开始创建凭证。

本示例代码仓库中的 Jenkinsfile 需要用到 DockerHub、GitHub 和 Kubernetes (kubeconfig 用于访问接入正在运行的 Kubernetes 集群) 等一共 3 个凭证 (credentials) ，这 3 个凭证 ID 需要与 Jenkinsfile 中前三个环境变量的值一致，先依次创建这三个凭证。

> 注意：若用户的凭证信息如账号或密码中包含了 `@`，`$`这类特殊符号，可能在运行时无法识别而报错，这类情况需要用户在创建凭证时对密码进行 urlencode 编码，可通过一些第三方网站进行转换 (比如 `http://tool.chinaz.com/tools/urlencode.aspx`)，然后再将转换后的输出粘贴到对应的凭证信息中。

### 第一步：创建 DockerHub 凭证

1、进入之前创建的 DevOps 工程，在左侧的工程管理菜单下，点击 `凭证`，进入凭证管理界面。

![credential_page](https://kubesphere-docs.pek3b.qingstor.com/png/devops_credentials.png)

2、点击 **创建**，创建一个用于 DockerHub 登录的凭证；

- 凭证 ID：必填，此 ID 将用于仓库中的 Jenkinsfile，此处命名为 **dockerhub-id**
- 类型：选择 **账户凭证**
- 用户名：填写您个人的 DockerHub 的用户名
- token / 密码：您个人的 DockerHub 的密码
- 描述信息：介绍凭证，比如此处可以备注为 DockerHub 登录凭证

完成后点击 **确定**。

![Dockerhub 凭证](https://kubesphere-docs.pek3b.qingstor.com/png/dockerhub-credential.png)

### 第二步：创建 GitHub 凭证

同上，创建一个用于 GitHub 的凭证，凭证 ID 命名为 **github-id**，类型选择 `账户凭证`，输入您个人的 GitHub 用户名和密码，备注描述信息，完成后点击 **确定**。

### 第三步：创建 kubeconfig 凭证

同上，在 **凭证** 下点击 **创建**，创建一个类型为 `kubeconfig`的凭证，凭证 ID 命名为 **demo-kubeconfig**，完成后点击 **确定**。

> 说明：kubeconfig 类型的凭证用于访问接入正在运行的 Kubernetes 集群，在流水线部署步骤将用到该凭证。注意，此处的 Content 将自动获取当前 KubeSphere 中的 kubeconfig 文件内容，若部署至当前 KubeSphere 中则无需修改，若部署至其它 Kubernetes 集群，则需要将其 kubeconfig 文件的内容粘贴至 Content 中。

### 第四步：创建sonarQube凭证

同上，在 **凭证** 下点击 **创建**，创建一个类型为 `秘密文本`的凭证，凭证 ID 命名为 **sonar-token**，密钥 输入 soanr 上 Project 的 token 信息。完成后点击 **确定**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-id.png)

至此，4 个凭证已经创建完成，下一步需要在示例仓库中的 jenkinsfile 修改对应的四个凭证 ID 为用户自己创建的凭证 ID。

![凭证列表](https://kubesphere-docs.pek3b.qingstor.com/png/credential-list-demo.png)

## 修改 Jenkinsfile

### 第一步：Fork项目

登录 GitHub，将本示例用到的 GitHub 仓库 [devops-sample-s2i](https://github.com/kubesphere/devops-sample-s2i) Fork 至您个人的 GitHub。

![Fork 项目](https://kubesphere-docs.pek3b.qingstor.com/png/fork-repo.png)

### 第二步：修改 Jenkinsfile

Fork 至您个人的 GitHub 后，在 **根目录** 进入 **Jenkinsfile-online**。

![jenkins-online](https://kubesphere-docs.pek3b.qingstor.com/png/jenkinsonline.png)

在 GitHub UI 点击编辑图标，需要修改如下环境变量 (environment) 的值。

![image-20190409121802459](https://kubesphere-docs.pek3b.qingstor.com/png/env.png)

| 修改项                   | 值                     | 含义                                                         |
| :----------------------- | :--------------------- | :----------------------------------------------------------- |
| DOCKER\_CREDENTIAL\_ID     | dockerhub-id           | 填写创建凭证步骤中的 DockerHub 凭证 ID，用于登录您的 DockerHub |
| GITHUB\_CREDENTIAL\_ID     | github-id              | 填写创建凭证步骤中的 GitHub 凭证 ID，用于推送 tag 到 GitHub 仓库 |
| KUBECONFIG\_CREDENTIAL\_ID | demo-kubeconfig        | kubeconfig 凭证 ID，用于访问接入正在运行的 Kubernetes 集群   |
| REDISTRY                 | docker.io              | 默认为docker.io 域名，用于镜像的推送                         |
| NAMESPACE                | your-dockerhub-account | 替换为您的 DockerHub 账号名(它也可以是账户下的 Organization 名称) |
| GITHUB_ACCOUNT           | github_username               | GitHub用户名                                  |
| APP_NAME                 | devops-docs-sample     | 应用名称                                                     |
| SONAR\_CREDENTIAL\_ID | sonar-token            | 填写创建凭证步骤中的 sonarQube token凭证 ID，用于代码质量检测 |

修改以上的环境变量后，点击 **Commit changes**，将更新提交到当前的 master 分支。

![提交更新](https://kubesphere-docs.pek3b.qingstor.com/png/commit-jenkinsfile.png)

## 创建项目

CI/CD 流水线会根据示例项目的 [yaml 模板文件](<https://github.com/kubesphere/devops-sample-s2i/tree/master/deploy>)，最终将示例分别部署到 Dev 和 Production 这两个项目 (Namespace) 环境中，即 `kubesphere-sample-dev`和 `kubesphere-sample-prod`，这两个项目需要预先在控制台依次创建，参考如下步骤创建该项目。

### 第一步：填写项目信息

回到工作台，在之前创建的企业空间 (demo-workspace) 下，点击 **项目 → 创建**，创建一个 **资源型项目**，作为本示例的开发环境，填写该项目的基本信息，完成后点击 **下一步**。

- 名称：固定为 `kubesphere-sample-dev`，若需要修改项目名称则需在 [yaml 模板文件](<https://github.com/kubesphere/devops-sample-s2i/tree/master/deploy>) 中修改 namespace
- 别名：可自定义，比如 **开发环境**
- 描述信息：可简单介绍该项目，方便用户进一步了解

![dev](https://kubesphere-docs.pek3b.qingstor.com/png/dev.png)

### 第二步：高级设置

本示例暂无资源请求和限制，因此高级设置中无需修改默认值，点击 **创建**，项目可创建成功。

![dev-succ](https://kubesphere-docs.pek3b.qingstor.com/png/dev-succ.png)

### 创建第二个项目

同上，参考上一步创建一个名称为 `kubesphere-sample-prod` 的项目，作为生产环境。

高级配置设置如下。

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

5、验证通过后，右侧会列出此 Token 关联用户的所有代码库，选择其中一个带有 Jenkinsfile 的仓库。比如此处选择准备好的示例仓库 [devops-sample-s2i](https://github.com/kubesphere/devops-sample-s2i)，点击 **选择此仓库**，完成后点击 **下一步**。 

![image-20190409122653070](https://kubesphere-docs.pek3b.qingstor.com/png/image-20190409122653070.png)

### 第三步：高级设置

完成代码仓库相关设置后，进入高级设置页面，高级设置支持对流水线的构建记录、行为策略、定期扫描等设置的定制化，以下对用到的相关配置作简单释义。

1、构建设置中，勾选 `丢弃旧的构建`，此处的 **保留构建的天数** 和 **保持构建的最大个数** 默认为 -1。

![构建设置](https://kubesphere-docs.pek3b.qingstor.com/png/build-setting.png)

> 说明：
>
> 构建设置的保留构建的天数和保持构建的最大个数两个选项可以同时对构建进行作用，如果超出任一限制，则将丢弃超出该限制的任何构建。默认两个值为 -1，表示不自动删除构建。
>
> 丢弃旧的构建将确定何时应丢弃项目的构建记录。构建记录包括控制台输出，存档工件以及与特定构建相关的其他元数据。保持较少的构建可以节省 Jenkins 所使用的磁盘空间，我们提供了两个选项来确定应何时丢弃旧的构建：
>
> - 保留构建的天数：如果构建达到一定的天数，则丢弃构建。
> - 保留构建的个数：如果已经存在一定数量的构建，则丢弃最旧的构建。 这两个选项可以同时对构建进行作用，如果超出任一限制，则将丢弃超出该限制的任何构建。

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

3、默认的 **脚本路径** 为 **Jenkinsfile**，请将其修改为[**Jenkinsfile-online**](https://github.com/kubesphere/devops-sample-s2i/blob/master/Jenkinsfile-online)。

> 注：路径是 Jenkinsfile 在代码仓库的路径，表示它在示例仓库的根目录，若文件位置变动则需修改其脚本路径。

4、在 **扫描 Repo Trigger** 勾选 `如果没有扫描触发，则定期扫描`，扫描时间间隔可根据团队习惯设定，本示例设置为 `5 minutes`。

> 说明：定期扫描是设定一个周期让流水线周期性地扫描远程仓库，根据 **行为策略** 查看仓库有没有代码更新或新的 PR。
>
> Webhook 推送：
>
> Webhook 是一种高效的方式可以让流水线发现远程仓库的变化并自动触发新的运行，GitHub 和 Git (如 Gitlab) 触发 Jenkins 自动扫描应该以 Webhook 为主，以上一步在 KubeSphere 设置定期扫描为辅。在本示例中，可以通过手动运行流水线，如需设置自动扫描远端分支并触发运行，详见 [设置自动触发扫描 - GitHub SCM](https://docs.kubesphere.io/advanced-v2.0/zh-CN/devops/auto-trigger)。

完成高级设置后点击 **创建**。

![image-20190409132341041](https://kubesphere-docs.pek3b.qingstor.com/png/image-20190409132341041.png)

### 第四步：运行流水线

流水线创建后，点击浏览器的 **刷新** 按钮，可见一条自动触发远程分支后的运行记录。

1、点击右侧 **运行**，将根据上一步的 **行为策略** 自动扫描代码仓库中的分支，在弹窗选择需要构建流水线的 `master`分支，系统将根据输入的分支加载 Jenkinsfile-online (默认是根目录下的 Jenkinsfile)。

2、由于仓库的 Jenkinsfile-online 中 `TAG_NAME: defaultValue` 没有设置默认值，因此在这里的 `TAG_NAME` 可以输入一个 tag 编号，比如输入 v0.0.1。

3、点击 **确定**，将新生成一条流水线活动开始运行。

> 说明: tag 用于在 Github 和DockerHub 中分别生成带有 tag 的 release 和镜像。 注意: 在主动运行流水线以发布 release 时，`TAG_NAME` 不应与之前代码仓库中所存在的 `tag` 名称重复，如果重复会导致流水线的运行失败。

![运行流水线](https://kubesphere-docs.pek3b.qingstor.com/png/run-pipeline-demo1.png)

至此，流水线 已完成创建并开始运行。

> 注：点击 **分支** 切换到分支列表，查看流水线具体是基于哪些分支运行，这里的分支则取决于上一步 **行为策略** 的发现分支策略。

![查看流水线](https://kubesphere-docs.pek3b.qingstor.com/png/pipeline_scan.png)

### 第五步：审核流水线

为方便演示，此处默认用当前账户来审核，当流水线执行至 `input`步骤时状态将暂停，需要手动点击 **继续**，流水线才能继续运行。注意，在 Jenkinsfile-online 中分别定义了三个阶段 (stage) 用来部署至 Dev 环境和 Production 环境以及推送 tag，因此在流水线中依次需要对 `deploy to dev, push with tag, deploy to production`这三个阶段审核 `3`次，若不审核或点击 **终止** 则流水线将不会继续运行。

![审核流水线](https://kubesphere-docs.pek3b.qingstor.com/png/devops_input.png)

> 说明：在实际的开发生产场景下，可能需要更高权限的管理员或运维人员来审核流水线和镜像，并决定是否允许将其推送至代码或镜像仓库，以及部署至开发或生产环境。Jenkinsfile 中的 `input`步骤支持指定用户审核流水线，比如要指定用户名为 project-admin 的用户来审核，可以在 Jenkinsfile 的 input 函数中追加一个字段，如果是多个用户则通过逗号分隔，如下所示：

```groovy
···
input(id: 'release-image-with-tag', message: 'release image with tag?', submitter: 'project-admin,project-admin1')
···
```

## 查看流水线

1、点击流水线中 `活动`列表下当前正在运行的流水线序列号，页面展现了流水线中每一步骤的运行状态，注意，流水线刚创建时处于初始化阶段，可能仅显示日志窗口，待初始化 (约一分钟) 完成后即可看到流水线。黑色框标注了流水线的步骤名称，示例中流水线共 8 个 stage，分别在 [Jenkinsfile-online](https://github.com/kubesphere/devops-sample-s2i/blob/master/Jenkinsfile-online) 中被定义。

![stage](https://kubesphere-docs.pek3b.qingstor.com/png/stage.png)

2、当前页面中点击右上方的 `查看日志`，查看流水线运行日志。页面展示了每一步的具体日志、运行状态及时间等信息，点击左侧某个具体的阶段可展开查看其具体的日志。日志可下载至本地，如出现错误，下载至本地更便于分析定位问题。

![log](https://kubesphere-docs.pek3b.qingstor.com/png/log.png)

## 验证运行结果

若流水线的每一步都能执行成功，那么流水线最终 build 的 Docker 镜像也将被成功地 push 到 DockerHub 中，我们在 Jenkinsfile-online 中已经配置过 DockerHub，登录 DockerHub 查看镜像的 push 结果，可以看到 tag 为 snapshot、TAG_NAME(master-1)、latest 的镜像已经被 push 到 DockerHub，并且在 GitHub 中也生成了一个新的 tag 和 release。文档网站最终将以 deployment 和 service 分别部署到 KubeSphere 的 `kubesphere-sample-dev` 和 `kubesphere-sample-prod` 项目环境中。

| 环境       | 访问地址                               | 所在项目 (Namespace) | 部署 (Deployment) | 服务 (Service) |
| :--------- | :------------------------------------- | :------------------- | :---------------- | :------------- |
| Dev        | 公网 IP : 30861 (`${EIP}:${NODEPORT}`) | kubesphere-sample-dev       | ks-sample-dev     | ks-sample-dev  |
| Production | 公网 IP : 30961 (`${EIP}:${NODEPORT}`) | kubesphere-sample-prod      | ks-sample         | ks-sample      |

1、可通过 KubeSphere 回到项目列表，依次查看之前创建的两个项目中的部署和服务的状态。例如，以下查看 `kubesphere-sample-prod`项目下的部署。

进入该项目，在左侧的菜单栏点击 **工作负载 → 部署**，可以看到 ks-sample 已创建成功。正常情况下，部署的状态应该显示 **运行中**。

![deploy](https://kubesphere-docs.pek3b.qingstor.com/png/deploy.png)

2、在菜单栏中选择 **网络与服务 → 服务** 也可以查看对应创建的服务，可以看到该服务对外暴露的节点端口 (NodePort) 是 `30961`。

**查看服务** 

![service](https://kubesphere-docs.pek3b.qingstor.com/png/service.png)

3、查看推送到您个人的 DockerHub 中的镜像，可以看到 `devops-sample`就是 APP_NAME 的值，而 tag也是在 jenkinsfile-online 中定义的 tag。

![查看 DockerHub](https://kubesphere-docs.pek3b.qingstor.com/png/deveops-dockerhub.png)

4、点击 `release`，查看 Fork 到您个人 GitHub repo 中的 `v0.0.1`tag 和 release，它是由 jenkinsfile 中的 `push with tag`stage 生成的

5、若需要在外网访问，可能需要进行端口转发并开放防火墙，即可访问成功部署的文档网站示例的首页，以访问生产环境 ks-sample 服务的 `30960`端口为例。

例如，在 QingCloud 云平台上，如果使用了 VPC 网络，则需要将 KubeSphere 集群中的任意一台主机上暴露的节点端口 (NodePort) `30961`在 VPC 网络中添加端口转发规则，然后在防火墙放行该端口。

**添加端口转发规则**

![port](https://kubesphere-docs.pek3b.qingstor.com/png/port.png)

**防火墙添加下行规则**

![filewall](https://kubesphere-docs.pek3b.qingstor.com/png/filewall.png)

### 访问示例服务

在浏览器访问部署到 KubeSphere Dev 和 Production 环境的服务：

**Dev 环境**

访问 `http://127.0.0.1:30861/`或者 `http://EIP:30861/`。

**Prodcution 环境**

访问 `http://127.0.0.1:30961/`或者 `http://EIP:30961\`。

页面会出现 `Hello,World!`。

至此，结合 GitHub 和 DockerHub，在线环境下创建一个 Jenkinsfile in SCM 类型的流水线已经完成了，若创建过程中遇到问题，可参考 [常见问题](https://docs.kubesphere.io/advanced-v2.0/zh-CN/faq)。