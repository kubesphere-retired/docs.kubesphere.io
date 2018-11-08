---
title: "示例一 - Jenkinsfile in SCM" 
---

Jenkinsfile in SCM 意为将 Jenkinsfile 文件本身作为 SCM（Source Control Management，源代码管理）的一部分，因此可使用 `git clone` 或者其他类似的命令都能够获取此 Jenkinsfile，根据该文件内的流水线配置信息快速构建工程内的 CI/CD 功能模块，如阶段（Stage）、任务（Job）等。因此，在 GitHub 的代码仓库中应包含 Jenkinsfile。

本示例演示如何通过 GitHub 仓库中的 Jenkinsfile 来创建流水线将仓库的代码打包成 docker 镜像并推送到 DockerHub。为演示方便，本示例以 GitHub 代码仓库 [kubesphere-devops-sample](https://github.com/FeynmanZhou/kubesphere-devops-sample) 为例，可预先将其 Fork 至您的代码仓库中，并相应修改 Credential 和 DockerHub 信息。

## 前提条件

- 已有 [DockerHub](http://www.dockerhub.com/) 的账号，且已准备好代码仓库。
- 本示例的代码仓库以 GitHub 为例，参考时前确保已有 [GitHub](https://github.com/) 账号。
- 已创建了 DevOps 工程，若还未创建请参考 [创建 DevOps 工程](../devops-project)。

## 演示视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="http://kubesphere-docs.pek3b.qingstor.com/video/cicd-demo-github.mp4">
</video>


## 创建流水线

参考以下步骤，创建并运行一个完整的流水线。

### 第一步：填写基本信息

1、进入已创建的 DevOps 工程，选择左侧 **流水线** 菜单项，然后点击 **创建流水线**。

![create-pipeline](/pipeline_create.png)

2、在弹出的窗口中，输入流水线的基本信息。
- 名称：为创建的流水线起一个简洁明了的名称，便于理解和搜索。
- 描述信息：简单介绍流水线的主要特性，帮助进一步了解流水线的作用。
- 代码仓库：点击选择代码仓库，代码仓库需要存在 Jenkinsfile。

![basic_info](/pipeline_info.png)

### 第二步：添加仓库

1、点击代码仓库，以添加 Github 仓库为例，并输入访问此仓库的 [Access Token](https://github.com/settings/tokens/new?scopes=repo,read:user,user:email,write:repo_hook)。
   
![git_input](/pipeline_git_token.png)

2、输入 Token 点击保存，验证通过后，右侧会列出此 Token 关联用户的所有代码库，选择其中一个带有 Jenkinsfile 的仓库，此处选择准备好的示例仓库。

注意：代码仓库 [kubesphere-devops-sample](https://github.com/FeynmanZhou/kubesphere-devops-sample) Fork 至您的 GitHub 之后，需要修改 Credential 和 DockerHub 信息：

- 将 [Jenkinsfile](https://github.com/FeynmanZhou/kubesphere-devops-sample/blob/master/Jenkinsfile) 中两处 `your-dockerhub-account` 修改为您 DockerHub 的 ID；
- `your-dockerhub-credentials` 需要在 [凭证管理](../credential) 中创建，编辑凭证 ID，类型选择 **账户凭证**，填写您 DockerHub 的账户信息，凭证创建后将凭证的名称如 **"key-docker123456"** 替换 `your-dockerhub-credentials`，作为 `credentialsId`，修改完后提交并推送到您的 GitHub 仓库。

```jenkinsfile
stage('build image') {
          ···
          sh 'docker build . -t your-dockerhub-account/kubesphere-devops-sample:latest'
          ···
    }
stage('push image'){
          ···
          credentialsId: 'your-dockerhub-credentials',
          ···
          docker push your-dockerhub-account/kubesphere-devops-sample:latest
	      ···                 
                }
``` 
   
![git_select](/git_repo.png)

### 第三步：高级设置

完成代码仓库相关设置后，进入高级设置页面，高级设置支持对流水线的构建记录、行为策略、定期扫描等设置的定制化。此处若无特殊配置需要，暂不作配置，点击创建。
   
![advance](/pipeline_advance.png)

### 第四步：运行流水线

点击扫描分支，用于获取代码仓库中的 Jenkinsfile。扫描分支会自动获取此仓库的所有分支，选择需要构建流水线的 master 分支，系统将根据输入的路径寻找并加载 Jenkinsfile（默认是根目录下名为 Jenkinsfile 的文件），完成流水线的创建工作，至此 Jenkinsfile in SCM 的创建完成，可查看具体的状态。  
   
![branch_scan](/pipeline_scan.png)

## 查看流水线
   
1、点击页面中某个运行中的流水线序列号，页面展现了流水线中每一步骤的运行状态，黑色框标注了流水线的步骤名称，示例中流水线共包括了四步，共 5 个 stage，分别在 [jenkinsfile](https://github.com/FeynmanZhou/kubesphere-devops-sample/blob/master/Jenkinsfile) 中被定义。
   
![run_status](/pipeline_status.png)

2、当前页面中点击右上方的 `查看日志`，查看流水线运行日志。页面展示了每一步的具体日志、运行状态及时间等信息。日志可下载至本地，如出现错误，下载至本地更便于分析定位问题。
   
![log](/pipeline_log.png)

## 验证流水线运行结果

若流水线的每一步都能执行成功，那么流水线最终 build 的 Docker 镜像也将被成功地 push 到预定义 DockerHub 中，我们在 Jenkinsfile 中已经配置过 Docker 镜像仓库，登录 DockerHub 查看镜像的 push 结果，可以看到 tag 为 latest 的镜像已经被 push 到个人的镜像仓库。

![](/deveops-dockerhub.png)

至此，创建一个 Jenkinsfile in SCM 类型的流水线已经完成了，若创建过程中遇到问题，可参考 [常见问题](../faq)。