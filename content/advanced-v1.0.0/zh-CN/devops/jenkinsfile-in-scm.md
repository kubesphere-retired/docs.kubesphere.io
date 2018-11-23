---
title: "示例一 - Jenkinsfile in SCM" 
---

Jenkinsfile in SCM 意为将 Jenkinsfile 文件本身作为 SCM（Source Control Management，源代码管理）的一部分，因此可使用 `git clone` 或者其他类似的命令都能够获取此 Jenkinsfile，根据该文件内的流水线配置信息快速构建工程内的 CI/CD 功能模块，如阶段（Stage）、任务（Job）等。因此，在 GitHub 的代码仓库中应包含 Jenkinsfile。

本示例演示如何通过 GitHub 仓库中的 Jenkinsfile 来创建流水线，从拉取仓库源码后获取依赖并进行单元测试，然后分别构建 snapshot 和 latest image 并推送至 DockerHub，最终部署到开发环境和生产环境，并分别在 GitHub 和 DockerHub 生成 tag。为演示方便，本示例就以添加本文档网站的 GitHub 仓库 [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample)  为例，可预先将其 Fork 至您的代码仓库中，并修改环境变量为实际参数即可添加。

## 前提条件

- 本示例的代码仓库以 GitHub 和 DockerHub 为例，参考时前确保已有 [GitHub](https://github.com/) 和 [DockerHub](http://www.dockerhub.com/) 账号，已 Fork 本文档网站的代码仓库。
- 已创建了 DevOps 工程，若还未创建请参考 [创建 DevOps 工程](../devops-project)。

## 演示视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="http://kubesphere-docs.pek3b.qingstor.com/video/cicd-demo-github.mp4">
</video>

## 创建凭证

本示例代码仓库中的 Jenkinsfile 需要 DockerHub、GitHub 和 Kubernetes (KubeConfig 用于访问接入正在运行的 Kubernetes 集群) 等 一共 3 个凭证 (credential) ，先依次创建这三个凭证。

1、在左侧的工程管理菜单下。点击 `凭证管理`，进入凭证管理界面，界面会展示当前工程所需的所有可用凭证。

![credential_page](/devops_credentials.png)

2、点击创建按钮，创建一个用于 DockerHub 登录的凭证。

- 凭证 ID：必填，此 ID 将用于仓库中的 Jenkinsfile，可自定义，此处命名为 **dockerhub-id**。
- 类型：选择 **账户凭证**。
- 用户名/密码：输入您个人的 DockerHub 用户名和密码。
- 描述信息：介绍凭证，比如此处可以备注为 DockerHub 登录凭证。

![Dockerhub 凭证](/dockerhub-credential.png)

3、同上，创建一个用于 GitHub 的凭证，凭证 ID 命名为 **github-id**，类型选择 **账户凭证**，输入您个人的 GitHub 用户名和密码，备注描述信息。

4、创建一个类型为 **kubeconfig** 的凭证，凭证 ID 命名为 **demo-kubeconfig**，用于访问接入正在运行的 Kubernetes 集群，在流水线部署步骤将用到该凭证。注意，此处的 Content 将自动获取当前 KubeSphere 中的 kubeconfig 文件内容，若部署至当前 KubeSphere 中则无需修改，若部署至其它 Kubernetes 集群，则需要将其 kubeconfig 文件的内容粘贴至 Content 中。

至此，3 个凭证已经创建完成，下一步需要在示例仓库中修改对应的三个凭证 ID 为用户自己创建的凭证 ID。

![凭证列表](/credential-list-demo.png)

## 修改 Jenkinsfile

在示例仓库的 **Jenkinsfile** 中，先将环境变量 (environment) 修改为实际的参数，然后把 `credentialsId` 和 `kubeconfigId` 的值修改为上一步的 3 个 **凭证 ID**，修改时注意区别 DockerHub 和 GitHub 的 `credentialsId`。

```bash
      ···
environment {
    ORG = 'kubesphere'
    APP_NAME = 'devops-docs-sample'
  }
      ···
stage('build & push snapshot image ') {
      ···
      ···
          withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : 'dockerhub-id' ,)]) {
      ···
          }
      ···
stage('push image with tag'){
      ···
      ···
           withCredentials([usernamePassword(credentialsId: 'github-id', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
      ···
           }
      ···
stage('deploy to dev') {
      ···
        kubernetesDeploy(configs: 'deploy/dev/**', enableConfigSubstitution: true, kubeconfigId: 'demo-kubeconfig')
      ···
      }
      ···
stage('deploy to production') {
      ···
        kubernetesDeploy(configs: 'deploy/dev/**', enableConfigSubstitution: true, kubeconfigId: 'demo-kubeconfig')
      ···
      }    
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

完成代码仓库相关设置后，进入高级设置页面，高级设置支持对流水线的构建记录、行为策略、定期扫描等设置的定制化。此处若无特殊配置需要，暂不作配置，点击创建。
   
![advance](/pipeline_advance.png)

### 第四步：运行流水线

流水线创建后，将自动扫描代码仓库中的所有分支，在弹窗选择需要构建流水线的 master 分支，系统将根据输入的分支加载 Jenkinsfile（默认是根目录下的 Jenkinsfile），Tag 将自动获取 Jenkinsfile 中的 `TAG_NAME: defaultValue`，点击确定，流水线开始运行。

至此 Jenkinsfile in SCM 的创建完成，可查看具体的状态。  
   
![branch_scan](/pipeline_scan.png)

### 第五步：审核流水线

在实际的开发生产场景下，可能需要更高权限的管理员或运维人员来审核流水线和镜像，并决定是否允许将其推送至代码或镜像仓库，以及部署至开发或生产环境。Jenkinsfile 中的 `input` 步骤支持指定用户审核流水线。为方便演示，此处默认用当前账户来通过审核，当流水线执行至 `input` 步骤时状态将暂停，需要手动点击 **继续**，流水线才能继续运行。注意，在 jenkinsfile 中分别定义了三个 stage 用来部署至开发环境和生成环境以及推送 tag，因此在流水线中需要审核 3 次，若不审核或点击 **终止** 则流水线将不会继续运行。

![审核流水线](/devops_input.png)

## 查看流水线
   
1、点击流水线中 `活动` 列表下当前正在运行的流水线序列号，页面展现了流水线中每一步骤的运行状态，注意，流水线刚创建时处于初始化阶段，可能仅显示日志窗口，待初始化 (约一分钟) 完成后即可看到流水线。黑色框标注了流水线的步骤名称，示例中流水线共 8 个 stage，分别在 [jenkinsfile](https://github.com/kubesphere/devops-docs-sample/blob/master/Jenkinsfile) 中被定义。
   
![run_status](/pipeline_status.png)

2、当前页面中点击右上方的 `查看日志`，查看流水线运行日志。页面展示了每一步的具体日志、运行状态及时间等信息，点击左侧某个具体的阶段可展开查看其具体的日志。日志可下载至本地，如出现错误，下载至本地更便于分析定位问题。
   
![log](/pipeline_log.png)

## 验证流水线运行结果

若流水线的每一步都能执行成功，那么流水线最终 build 的 Docker 镜像也将被成功地 push 到 DockerHub 中，我们在 Jenkinsfile 中已经配置过 Docker 镜像仓库，登录 DockerHub 查看镜像的 push 结果，可以看到 tag 为 snapshot、TAG_NAME、latest 的镜像已经被 push 到 DockerHub，并且在 GitHub 中也生成了一个新的 tag，最终以 deployment 和 service 部署到 KubeSphere 的环境中。若需要在外网访问，可能需要进行端口转发 (Service 中定义的 NodePort 为 30880) 并开放防火墙，即可访问成功部署的文档网站示例的首页。

查看 DockerHub 推送的镜像。

![](/deveops-dockerhub.png)

访问部署到 KubeSphere 中的服务。

![](/docs-home-preview.png)


至此，创建一个 Jenkinsfile in SCM 类型的流水线已经完成了，若创建过程中遇到问题，可参考 [常见问题](../faq)。