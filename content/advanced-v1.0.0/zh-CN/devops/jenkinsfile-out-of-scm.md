---
title: "示例二 - Jenkinsfile out of SCM" 
---

Jenkinsfile out of SCM 不同于 [Jenkinsfile in SCM](../jenkinsfile-in-scm)，其代码仓库中可以无需 Jenkinsfile，支持用户在创建时手动编辑 Jenkinsfile，或手动构建流水线。

本示例演示如何通过手动创建流水线将仓库的代码打包成 Docker 镜像，并通过 archiveArtifacts (保存制品) 生成压缩文件可供下载，常见的制品一般是编译好的代码或者测试报告。为方便演示，本示例以 GitHub 代码仓库 [kubesphere/devops](https://github.com/kubesphere/devops.git) 为例，也可使用其它任意的 GitHub 代码仓库。

## 前提条件

- 已有 [DockerHub](http://www.dockerhub.com/) 的账号，且已准备好代码仓库。
- 本示例的代码仓库以 GitHub 为例，参考时前确保已有 [GitHub](https://github.com/) 账号，且已准备好代码仓库。
- 已创建了 DevOps 工程，若还未创建请参考 [创建 DevOps 工程](../devops-project)。

## 演示视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="http://kubesphere-docs.pek3b.qingstor.com/video/cicd-demo-no-github.mp4">
</video>


## 创建流水线

参考以下步骤，创建并运行一个完整的流水线。

### 第一步：填写基本信息

1、进入已创建的 DevOps 工程，选择左侧 **流水线** 菜单项，然后点击 **创建流水线**。

![create_pipeline](/create_manual_pipeline.png)

2、在弹出的窗口中，输入流水线的基本信息。
- 名称：为创建的流水线起一个简洁明了的名称，便于理解和搜索。
- 描述信息：简单介绍流水线的主要特性，帮助进一步了解流水线的作用。
- 代码仓库：此处不选择代码仓库

![input_info](/manaul_pipeline_info.png)

### 第二步：高级设置

1、填写基本信息后，进入高级设置页面。高级设置支持对流水线的构建记录、参数化构建、定期扫描等设置的定制化。

2、参数化构建过程允许您在进行构建时传入一个或多个参数。本示例以在参数化构建中添加 **字符串参数 (String)** 为例，演示如何在流水线中使用该参数。假设设定一个 Release Tag 为 `tag=v1.0` 的参数并且在流水线使用。高级设置完成后点击创建。

![manual_pipeline_setting](/manual_pipeline_setting.png)

### 第三步：构建流水线

1、创建完成之后页面就会自动跳转至流水线的可视化编辑页面，在此页面中通过构建流水线的每个步骤执行的内容即可自动生成 Jenkinsfile，用户无需学习 Jenkinsfile 的语法，非常方便。当然，平台也支持手动编辑 Jenkinsfile 的方式，流水线分为 “声明式流水线” 和 “脚本化流水线”，Pipeline 语法参见 [Jenkins 官方文档](https://jenkins.io/doc/book/pipeline/syntax/)。

![pipeline_editor](/pipeline_editor.png)

2、点击左侧结构编辑区域的 **“+”** 号，增加一个阶段 (Stage)，然后在此阶段下点击 `增加步骤`；右侧选择 `git`，此阶段通过 Git 拉取代码。弹窗中填写示例 GitHub 仓库的 url `https://github.com/kubesphere/devops.git`，填写 master 分支，无需填写凭证。将此阶段命名为 SCM
   
![add_stage](/pipeline_outscm_editor_addstage.png)

3、 在第一个阶段右侧点击  **“+”**  继续增加一个阶段，此阶段用于构建镜像，由于这个操作需要执行 shell 脚本，因此在右侧选择 `shell`，最后需给此阶段命名为 "build"，其中构建 docker 镜像的 shell 脚本参考如下，其中 `your-dockerhub-account` 替换为您的 DockerHub 账号。

```bash
docker build . -t your-dockerhub-account/kubesphere-devops-sample:${tag}
```
 
![add_build](/pipeline_outscm_editor_addbuild.png)

4、 在 "build" 阶段右侧点击  **“+”**  继续增加一个阶段，此阶段用于构建镜像，由于这个操作需要执行 shell 脚本，因此在右侧选择 `shell`，最后需给此阶段命名为 "save"，其中保存 docker 镜像的 shell 脚本的脚本参考如下，其中 `your-dockerhub-account` 替换为您的 DockerHub 账号。

```bash
docker save -o devops-sample-${tag}.tar your-dockerhub-account/kubesphere-devops-sample:${tag}
```

5、由于流水线需要将构建的 Docker 镜像保存制品，因此在阶段 "save" 中再新增一个步骤，右侧选择保存制品 (archiveArtifacts)，其中制品文件的名称填写 `devops-sample-${tag}.tar`。

![add_docker](/pipeline_outscm_editor_adddocker.png)

6、代理类型选择 `Any`，点击保存。

在流水线中为了支持用户在实际应用场景中可能有各种各样的用例流水线, agent 部分支持一些不同类型的参数。这些参数应用在 `pipeline` 的顶层, 或 stage 指令内部，平台中常用的 agent 如下释义：

- any 

在任何可用的代理上执行流水线或阶段。例如: agent any

- none

当在 pipeline 的顶部没有全局代理， 该参数将会被分配到整个流水线的运行中，并且每个 stage 部分都需要包含他自己的 agent 部分。比如: agent none

- docker

使用给定的容器执行流水线或阶段。该容器将在预置的 node 上，或在匹配可选定义的 `label` 参数上，动态的供应来接受基于 Docker 的流水线。 Docker 也可以选择的接受 args 参数，该参数可能包含直接传递到 docker run 调用的参数, 以及 alwaysPull 选项, 该选项强制进行 docker pull 操作，即使镜像名称已经存在。 比如: agent { docker 'maven:3-alpine' }

并且，手动构建的流水线保存后将自动生成 jenkinsfile，点击 **编辑 jenkinsfile** 可对其编辑，需遵循 [Pipeline 语法](https://jenkins.io/doc/book/pipeline/syntax/)。

![jenkensfile 编辑](/jenkinsfile_editor.png)

### 第四步：运行流水线

手动构建的流水线在平台中需要手动运行，点击 **运行**，输入参数弹窗中可编辑之前定义的字符串参数 tag，此处保留 "tag=v1.0"，点击确定，流水线将开始运行。

### 第五步：查看运行结果

点击 **活动**，在流水线的列表中看到当前流水线运行状态是成功的，点击该条活动可进入详情页，然后点击 **制品** 可查看流水线成功运行后生成的制品 `devops-sample-v1.0.tar`，支持下载制品。

![查看运行结果](/pipeline_running_result.png)

![查看制品](/archive-artifacts.png)

至此，创建一个 Jenkinsfile out of SCM 类型的流水线已经完成了。

