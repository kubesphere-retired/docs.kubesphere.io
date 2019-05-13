---
title: "Jenkinsfile out of SCM - 图形化构建流水线" 
---

上一篇文档示例十是通过代码仓库中的 Jenkinsfile 构建流水线，需要对声明式的 Jenkinsfile 有一定的基础。而 Jenkinsfile out of SCM 不同于 [Jenkinsfile in SCM](../jenkinsfile-in-scm)，其代码仓库中可以无需 Jenkinsfile，支持用户在控制台通过可视化的方式构建流水线或编辑 Jenkinsfile 生成流水线，用户操作界面更友好。

## 目的

本示例演示基于 [示例十 - Jenkinsfile in SCM](../jenkinsfile-in-scm)，通过可视化构建流水线最终将一个 HelloWorld 示例网站部署到 KubeSphere 集群中的开发环境且能够允许用户访问，这里所谓的开发环境在底层的 Kubernetes 里是以项目 (Namespace) 为单位进行资源隔离的。若熟悉了示例十的流程后，对于示例七的手动构建步骤就很好理解了。为方便演示，本示例仍然以 GitHub 代码仓库 [devops-java-sample](https://github.com/kubesphere/devops-java-sample) 为例。

## 前提条件

- 已有 [DockerHub](http://www.dockerhub.com/) 的账号；
- 已创建了企业空间和 DevOps 工程并且创建了普通用户 `project-regular` 的账号，若还未创建请参考 [多租户管理快速入门](../admin-quick-start)；
- 使用项目管理员 `project-admin` 邀请普通用户 `project-regular` 加入 DevOps 工程并授予 `maintainer` 角色，若还未邀请请参考 [多租户管理快速入门 - 邀请成员](../admin-quick-start/#邀请成员)。

## 预估时间

约 30 分钟。

## 操作示例

<!-- ### 演示视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docsvideo.gd2.qingstor.com/demo7-jenkinsfile-out-of-scm.mp4">
</video> -->

### 流水线概览

构建可视化流水线共包含以下 6 个阶段 (stage)，先通过一个流程图简单说明一下整个 pipeline 的工作流：

![流程图](/cicd-pipeline-02.svg)

> 详细说明每个阶段所执行的任务：
> - **阶段一. Checkout SCM**: 拉取 GitHub 仓库代码；
> - **阶段二. Unit test**: 单元测试，如果测试通过了才继续下面的任务；
> - **阶段三. Code Analysis**: 配置 SonarQube 进行静态代码质量检查与分析；
> - **阶段四. Build & push snapshot image**: 构建镜像，并将 tag 为 `SNAPSHOT-$BUILD_NUMBER` 推送至 DockerHub (其中 `$BUILD_NUMBER` 为 pipeline 活动列表的运行序号)；
> - **阶段五. Artifacts**: 制作制品 (jar 包) 并保存至制品库；
> - **阶段六. Deploy to dev**: 将项目部署到 Dev 环境，此阶段需要预先审核，若部署成功后则发送邮件。

### 创建项目

CI/CD 流水线会根据文档网站的 [yaml 模板文件](https://github.com/kubesphere/devops-docs-sample/tree/master/deploy/no-branch-dev)，最终将该网站部署到开发环境 `kubesphere-docs-dev`，它对应的是 KubeSphere 中的一个项目，该项目需要预先创建，若还未创建请参考 [示例十 - 创建第一个项目](../jenkinsfile-in-scm/#创建项目) 使用 项目管理员 project-admin 账号创建 `kubesphere-docs-dev` 项目，并邀请项目普通用户 `project-regular` 进入该项目授予 `operator` 角色。

### 创建凭证

本示例创建流水线时需要访问 DockerHub、Kubernetes (创建 KubeConfig 用于接入正在运行的 Kubernetes 集群) 和 SonarQube 共 3 个凭证 (Credentials)。

1、使用项目普通用户登录 KubeSphere，参考 [创建凭证](../../devops/credential/#创建凭证) 创建 DockerHub 和 Kubernetes 的凭证，凭证 ID 分别为 `dockerhub-id` 和 `demo-kubeconfig`。

2、然后参考 [访问 SonarQube](../../devops/sonarqube/) 创建 Token，创建一个 Java 的 Token 并复制。

3、最后在 KubeSphere 中进入 devops-demo 的 DevOps 工程中，与上面步骤类似，在 凭证 下点击 创建，创建一个类型为 秘密文本 的凭证，凭证 ID 命名为 sonar-token，密钥为上一步复制的 token 信息，完成后点击 确定。

至此，3 个凭证已经创建完毕，将在流水线中使用它们。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514023424.png)

### 创建流水线

参考以下步骤，创建并运行一个完整的流水线。

#### 第一步：填写基本信息

1、进入已创建的 DevOps 工程，选择左侧 **流水线** 菜单项，然后点击 **创建**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514023644.png)

2、在弹出的窗口中，输入流水线的基本信息，完成后点击 **下一步**。

- 名称：为流水线起一个简洁明了的名称，便于理解和搜索
- 描述信息：简单介绍流水线的主要特性，帮助进一步了解流水线的作用
- 代码仓库：此处不选择代码仓库

![基本信息](/manaul_pipeline_info.png)

#### 第二步：高级设置

1、点击 **添加参数**，如下添加 **三个** 字符串参数，将在流水线的 docker 命令中使用该参数，完成后点击确定保存。

|参数类型|名称|默认值|描述信息|
|---|---|---|---|
|字符串参数 (string)|REGISTRY|仓库地址，本示例使用 docker.io
|字符串参数 (string)|DOCKERHUB_NAMESPACE|填写您的 DockerHub 账号 (它也可以是账户下的 Organization 名称)|DockerHub Namespace|
|字符串参数 (string)|APP_NAME|填写 devops-docs-sample|Application Name|


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514023916.png)

2、在图形化构建流水线的界面，点击左侧结构编辑区域的 **“+”** 号，增加一个阶段 (Stage)，点击界面中的 **No name**，在右侧将其命名为 **checkout SCM**。