---
title: "示例一 - Jenkinsfile in SCM" 
---

Jenkinsfile in SCM 意为将 Jenkinsfile 文件本身作为源代码管理（Source Control Management）的一部分，因此可使用 `git clone` 或者其他类似的命令都能够获取此 Jenkinsfile，根据该文件内的流水线配置信息快速构建工程内的 CI/CD 功能模块，如阶段（Stage）、任务（Job）等。因此，在 GitHub 的代码仓库中应包含 Jenkinsfile。

本示例演示如何通过 GitHub 仓库中的 Jenkinsfile 来创建流水线，流水线共包括 8 个阶段，最终将一个文档网站部署到 KubeSphere 集群中的开发环境和产品环境且能够通过公网访问，那么这个流水线需要完成哪些流程呢？先通过一个流程图简单说明一下整个 pipeline 的工作流：

![流程图](/cicd-pipeline-01.svg)

> 流程说明：
> - **阶段一. Checkout SCM**: 拉取 GitHub 仓库代码
> - **阶段二. Get dependencies**: 通过包管理器 [yarn](https://yarnpkg.com/zh-Hans/) 安装项目的所有依赖
> - **阶段三. Unit test**: 单元测试，如果测试通过了才继续下面的任务
> - **阶段四. Build & push snapshot image**: 根据行为策略中所选择分支来构建镜像，并将 tag 为 `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` 推送至 DockerHub (其中 `$BUILD_NUMBER` 为 pipeline 活动列表的运行序号)。
> - **阶段五. Push latest image**: 将 master 分支打上 tag 为 latest，并推送至 DockerHub。
> - **阶段六. Deploy to dev**: 将 master 分支部署到 Dev 环境，此阶段需要审核。
> - **阶段七. Push with tag**: 生成 tag 并 release 到 GitHub，并推送到 DockerHub。
> - **阶段八. Deploy to production**: 将发布的 tag 部署到 Production 环境。

为演示方便，本示例就以添加本文档网站的 GitHub 仓库 [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) 为例，可预先将其 Fork 至您的代码仓库中，并修改环境变量为实际参数。

## 前提条件

- 本示例的代码仓库以 GitHub 和 DockerHub 为例，参考时前确保已创建了 [GitHub](https://github.com/) 和 [DockerHub](http://www.dockerhub.com/) 账号。
- 已创建了 DevOps 工程，若还未创建请参考 [创建 DevOps 工程](../devops-project)。

<!-- ## 演示视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="http://kubesphere-docs.pek3b.qingstor.com/video/cicd-demo-github.mp4">
</video> -->

## 创建凭证

本示例代码仓库中的 Jenkinsfile 需要 DockerHub、GitHub 和 Kubernetes (KubeConfig 用于访问接入正在运行的 Kubernetes 集群) 等一共 3 个凭证 (credentials) ，先依次创建这三个凭证。

### 第一步：创建 DockerHub 凭证

1、在左侧的工程管理菜单下。点击 `凭证管理`，进入凭证管理界面，界面会展示当前工程所需的所有可用凭证。

![credential_page](/devops_credentials.png)

2、点击创建按钮，创建一个用于 DockerHub 登录的凭证。

- 凭证 ID：必填，此 ID 将用于仓库中的 Jenkinsfile，可自定义，此处命名为 **dockerhub-id**。
- 类型：选择 **账户凭证**。
- 用户名/密码：输入您个人的 DockerHub 用户名和密码。
- 描述信息：介绍凭证，比如此处可以备注为 DockerHub 登录凭证。

![Dockerhub 凭证](/dockerhub-credential.png)

### 第二步：创建 GitHub 凭证

同上，创建一个用于 GitHub 的凭证，凭证 ID 命名为 **github-id**，类型选择 **账户凭证**，输入您个人的 GitHub 用户名和密码，备注描述信息。

### 第三步：创建 kubeconfig 凭证

创建一个类型为 **kubeconfig** 的凭证，凭证 ID 命名为 **demo-kubeconfig**，用于访问接入正在运行的 Kubernetes 集群，在流水线部署步骤将用到该凭证。注意，此处的 Content 将自动获取当前 KubeSphere 中的 kubeconfig 文件内容，若部署至当前 KubeSphere 中则无需修改，若部署至其它 Kubernetes 集群，则需要将其 kubeconfig 文件的内容粘贴至 Content 中。

至此，3 个凭证已经创建完成，下一步需要在示例仓库中修改对应的三个凭证 ID 为用户自己创建的凭证 ID。

![凭证列表](/credential-list-demo.png)

## 修改 Jenkinsfile

### 第一步：Fork 项目

将本示例用到的 GitHub 仓库 [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) Fork 至您个人的 GitHub。

![Fork 项目](/fork-repo.png)

### 第二步：修改 Jenkinsfile

Fork 至您个人的 GitHub 后，在 **根目录** 进入 **Jenkinsfile**， 在  GitHub UI 点击编辑图标，需要修改如下参数 (parameters) 和环境变量 (environment)，完成后提交更新到当前的 master 分支：

![修改 Jenkinsfile](/modify-jenkinsfile.png)

|修改项|值|含义|
|---|---|---|
|defaultValue|v0.0.1|用于生成 GitHub 和 DockerHub 的 tag|
|DOCKERHUB\_CREDENTIAL\_ID|dockerhub-id|上一步创建的 DockerHub 凭证 ID|
|GITHUB\_CREDENTIAL\_ID|github-id|上一步创建的 GitHub 凭证 ID|
|KUBECONFIG\_CREDENTIAL\_ID|demo-kubeconfig| KubeConfig 凭证 ID，用于访问接入正在运行的 Kubernetes 集群 |
|DOCKERHUB_ORG|your-dockerhub-account| 替换为您的 DockerHub 账号名 (组织名)|
|GITHUB_ORG|your-github-account | 替换为您的 GitHub 账号名 (组织名)
|APP_NAME|devops-docs-sample |应用名称|

```bash
      ···
parameters{
     string(name:'TAG_NAME',defaultValue: 'v0.0.1',description:'')
  }
environment {
    DOCKERHUB_CREDENTIAL_ID = 'dockerhub-id'
    GITHUB_CREDENTIAL_ID = 'github-id'
    KUBECONFIG_CREDENTIAL_ID = 'demo-kubeconfig'
    DOCKERHUB_ORG = 'your-dockerhub-account'
    GITHUB_ORG = 'your-github-account'
    APP_NAME = 'devops-docs-sample'
  }
      ···
```

## 创建流水线

参考以下步骤，创建并运行一个完整的流水线。

### 第一步：填写基本信息

1、进入已创建的 DevOps 工程，选择左侧 **流水线** 菜单项，然后点击 **创建流水线**。

![create-pipeline](/pipeline_create.png)

2、在弹出的窗口中，输入流水线的基本信息。
- 名称：为创建的流水线起一个简洁明了的名称，便于理解和搜索。
- 描述信息：简单介绍流水线的主要特性，帮助进一步了解流水线的作用。
- 代码仓库：点击选择代码仓库，代码仓库需已存在 Jenkinsfile。

![basic_info](/pipeline_info.png)

### 第二步：添加仓库

1、点击代码仓库，以添加 Github 仓库为例，并输入访问此仓库的 [Access Token](https://github.com/settings/tokens/new?scopes=repo,read:user,user:email,write:repo_hook)。
   
![git_input](/pipeline_git_token.png)

2、输入 Token 点击保存，验证通过后，右侧会列出此 Token 关联用户的所有代码库，选择其中一个带有 Jenkinsfile 的仓库，此处选择准备好的示例仓库 [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) 。
    
![git_select](/git_repo.png)

### 第三步：高级设置

完成代码仓库相关设置后，进入高级设置页面，高级设置支持对流水线的构建记录、行为策略、定期扫描等设置的定制化，以下对用到的相关配置作简单释义，完成设置后点击创建。

1、此处勾选 `丢弃旧的构建`。

**构建设置**

**丢弃旧的构建** 将确定何时应丢弃项目的构建记录。构建记录包括控制台输出，存档工件以及与特定构建相关的其他元数据。保持较少的构建可以节省 Jenkins 所使用的磁盘空间，我们提供了两个选项来确定应何时丢弃旧的构建：

- 保留构建的天数：如果构建达到一定的天数，则丢弃构建。 
- 保留构建的个数：如果已经存在一定数量的构建，则丢弃最旧的构建。 这两个选项可以同时对构建进行作用，如果超出任一限制，则将丢弃超出该限制的任何构建。

2、行为策略中，支持添加三种类型的发现策略。需要明白一点，在 Jenkins 流水线 trigger 时，开发者提交的 PR (Pull Request) 也被视为一个单独的分支。点击 **添加操作 → 发现分支** 选择 `排除也作为 PR 提交的分支`，再次点击 **添加操作 → 从原仓库中发现 PR** 选择 `将 PR 与目标分支合并的版本`。

**发现分支**

- 排除也作为 PR 提交的分支：选择此项表示 CI 将不会扫描源分支 (比如 Origin 的 master branch)，也就是需要被 merge 的分支。
- 只有被提交为 PR 的分支：仅扫描 PR 分支
- 所有分支：拉取的仓库 (origin) 中所有的分支

**从原仓库中发现 PR**

- 发现 PR 与目标分支 merge 后的源代码版本：一次发现操作，找到要合并到当前目标分支的 Pull Request。
- 当前 PR 的版本：一次发现操作，找到相对于其自己修改的 Pull Request。
- 同时发现 PR 的版本与将 PR 与目标分支合并的版本：两次发现操作，第一次找到要合并到当前目标分支的 Pull Request，紧接着第二次并行的找到相对于其自己修改的 Pull Request。

3、默认的 **脚本路径** 为 Jenkinsfile。

- 路径：是 Jenkinsfile 在代码仓库的路径，表示它在示例仓库的根目录，若文件位置变动则需修改其脚本路径。

4、勾选 **定期扫描 Repo Trigger**，扫描时间间隔设置为 `5 minutes`。
   
![advance](/pipeline_advance.png)

### 第四步：运行流水线

流水线创建后，将根据上一步的 **行为策略** 自动扫描代码仓库中的分支，在弹窗选择需要构建流水线的 `master` 分支，系统将根据输入的分支加载 Jenkinsfile（默认是根目录下的 Jenkinsfile），Tag 将自动获取 Jenkinsfile 中的 `TAG_NAME: defaultValue`，点击确定，流水线开始运行。

至此 Jenkinsfile in SCM 的创建完成，可查看具体的状态。  
   
![branch_scan](/pipeline_scan.png)

### 第五步：审核流水线

在实际的开发生产场景下，可能需要更高权限的管理员或运维人员来审核流水线和镜像，并决定是否允许将其推送至代码或镜像仓库，以及部署至开发或生产环境。Jenkinsfile 中的 `input` 步骤支持指定用户审核流水线。为方便演示，此处默认用当前账户来通过审核，当流水线执行至 `input` 步骤时状态将暂停，需要手动点击 **继续**，流水线才能继续运行。注意，在 jenkinsfile 中分别定义了三个 stage 用来部署至 Dev 环境和 Production 环境以及推送 tag，因此在流水线中需要审核 `3` 次，若不审核或点击 **终止** 则流水线将不会继续运行。

![审核流水线](/devops_input.png)

## 查看流水线
   
1、点击流水线中 `活动` 列表下当前正在运行的流水线序列号，页面展现了流水线中每一步骤的运行状态，注意，流水线刚创建时处于初始化阶段，可能仅显示日志窗口，待初始化 (约一分钟) 完成后即可看到流水线。黑色框标注了流水线的步骤名称，示例中流水线共 8 个 stage，分别在 [jenkinsfile](https://github.com/kubesphere/devops-docs-sample/blob/master/Jenkinsfile) 中被定义。
   
![run_status](/pipeline_status.png)

2、当前页面中点击右上方的 `查看日志`，查看流水线运行日志。页面展示了每一步的具体日志、运行状态及时间等信息，点击左侧某个具体的阶段可展开查看其具体的日志。日志可下载至本地，如出现错误，下载至本地更便于分析定位问题。
   
![log](/pipeline_log.png)

## 验证运行结果

若流水线的每一步都能执行成功，那么流水线最终 build 的 Docker 镜像也将被成功地 push 到 DockerHub 中，我们在 Jenkinsfile 中已经配置过 Docker 镜像仓库，登录 DockerHub 查看镜像的 push 结果，可以看到 tag 为 snapshot、TAG_NAME(v0.0.1)、latest 的镜像已经被 push 到 DockerHub，并且在 GitHub 中也生成了一个新的 tag，最终以 deployment 和 service 部署到 KubeSphere 的 dev 和 production 环境中。若需要在外网访问，可能需要进行端口转发并开放防火墙，即可访问成功部署的文档网站示例的首页。

|环境|访问地址| 所在项目 (Namespace) | 部署 (Deployment) |
|---|---|---|---|
|Dev| 公网IP (EIP) + 30880| kubesphere-system-dev| ks-docs-sample-dev|
|Production|公网IP (EIP) + 30980|kubesphere-system|ks-docs-sample |

查看推送到 DockerHub 的镜像，可以看到 `devops-docs-sample` 就是 APP_NAME 的值。
  
![](/deveops-dockerhub.png)

访问部署到 KubeSphere 的 Dev 和 Production 环境的服务。

**Dev 环境**
![](/docs-home-dev-preview.png)

**Prodcution 环境**
![](/docs-home-production-preview.png)


至此，创建一个 Jenkinsfile in SCM 类型的流水线已经完成了，若创建过程中遇到问题，可参考 [常见问题](../../faq)。