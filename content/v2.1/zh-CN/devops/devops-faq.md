---
title: "流水线常见问题" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

在触发 CI / CD 流水线时可能会因为一些其它因素造成流水线运行失败，比如凭证信息填写错误或网络问题等这类不确定的原因。在流水线运行失败时，用户应该如何排错呢？

## 如何查看日志

在大多时间用户可以直接通过 Pipeline 的图形化页面查看日志完成排错，通常您执行命令的错误信息会在 Pipeline 的每个 Stage 的日志中。如下执行了一个不存在的 Shell 命令，错误信息位于每个 Stage 的日志中。

![查看流水线日志](/pipeline-log.png)

但是在部分情况下，错误的参数可能导致 Jenkins Pipeline 的异常中断，这时错误的日志在 Stage 日志中可能不会展示，需要用户使用流水线的下载日志下载整个 Pipeline 的完整日志。

例如下面这种情况，我们在使用 Pipeline Step 时传入了非法的参数，这种情况下部分 Step 可能会发生异常，但这种异常可能不会在 Stage 日志中展示。用户可以点击 **下载日志** 获取 Pipeline 的完整日志进行排错。

![下载日志](/download-logs.png)

## 重新执行与运行之间的区别

重新执行将尽力还原 Pipeline 运行时所在的运行环境。尽管每次 Pipeline 运行完毕后整个 Agent 环境将被销毁，但是 Jenkins 将 Pipeline 运行时所在的 SCM 环境与环境变量、参数变量以及 Jenkinsfile 信息都进行存储，在重新运行时将加载上次运行的环境，因此提供了几乎一致的运行环境。运行将重新触发一次运行，将刷新所有环境，根据用户的配置生成全新的环境。
**重新执行** 按钮位于运行图形化展示页的左侧。

![重新执行](/rerun-pipeline.png)

## Jenkins 语言支持问题

KubeSphere 拥有很多母语为中文的用户，但是 Jenkins 目前对中文以及一些需要 UTF-8 字符集的语言支持度不是很好，因此强烈建议您在使用 KubeSphere Devops 时 (如命名或添加参数) 尽量使用英文。

## 其他错误

在运行 Pipeline 时，我们需要用户配置 credential 以获得推送到 DockerHub、Git 仓库的权限。需要注意的是 Git 仓库的密码是在 http 链接中直接进行了使用，若用户的凭证信息如密码中包含了 `@`，`$` 这类符号，可能在运行时无法识别而报错，当遇到这类情况需要用户在创建 credential 时对密码进行 urlencode 编码，可通过一些第三方网站进行转换 (比如 `http://tool.chinaz.com/tools/urlencode.aspx`)。

## 在 Agent 中切换工作空间

目前 `dir` 或 `ws` 命令都不能在 Kubernetes Agent 中切换到 `/home/jenkins/` 外的目录，如果需要切换到 `/home/jenkins/` 外的目录并执行命令，您可以使用 `cd` 命令进行目录的切换。例如： `cd /usr/ && ls`。

这是 Jenkins Kubernetes Plugin 一个已知的问题，我们会跟进社区后续修复。

## 示例运行失败如何排错

快速入门中的示例六和示例七用到的 devops-docs-sample 代码仓库位于 GitHub 之中，并且 Pipeline 运行过程需要拉取项目所需的 npm 依赖，同时 sample 还将构建完成的镜像推往 DockerHub，这些仓库的服务端都在国外，因此该示例对执行网络环境有比较严格的要求。如果 devops-docs-sample 运行失败，同样可以通过查看 Pipeline 日志来获取完整的错误信息，以定位问题。

### 如何解决网络问题

对于网络错误，可以通过重新运行来尝试解决。如果多次重新运行后不能解决这个问题，可以通过将源代码仓库、Docker 镜像仓库转移到国内的方法进行解决。

国内许多 SCM 服务的提供商都提供一键导入 GitHub Repo 的功能，用户只需下载示例源代码的仓库，通过国内的 SCM 服务商来完成仓库的转移。

![下载源码](/devops-sample-faq.png)

对于自建的 SCM 服务，可以通过下面几个步骤来进行迁移。

1、在工作目录初始化一个 Git 仓库，并在自建 SCM 中使两者关联。

2、下载源代码仓库的 zip 压缩包，并将压缩包的内容解压到 Git 仓库目录中。

3、将例子代码提交并推送到自建 SCM 中。

4、创建 Git 类型的项目，并填入自建 SCM 仓库中的例子信息。

5、镜像仓库替换需要修改 Jenkinsfile 的中 docker build、docker tag、docker push 命令的镜像名称，以及示例仓库中 `/deploy` 的 yaml 文件中的镜像地址，用户可以按照自己的情况进行镜像仓库地址的修改。


## Jenkins 流水线质量门

Jenkins 流水线质量门需要在流水线中先执行代码质量分析，在执行代码质量分析时应该使用加载 SonarQube 配置中执行质量分析。

对应的 `Jenkinsfile` 为：
```Groovy
withSonarQubeEnv('sonar') {
  sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=ks-devops -Dsonar.sources=.  -Dsonar.login=$SONAR_TOKEN"
}
```

当执行完代码分析之后，用户就可以使用代码质量检查步骤来检查代码质量是否符合标准。对应的 `Jenkinsfile` 为：
```Groovy
waitForQualityGate abortPipeline: true
```

部分用户在使用 SonarQube 质量门时遇到下图所示问题：

![no-previous-sonar-error](/no-previous-sonar.jpg)

这是因为在 `Jenkinsfile` 当中 `waitForQualityGate` 的代码位置有误，`waitForQualityGate` 应该在 `withSonarQubeEnv` 代码块之外，正确的 `Jenkinsfile` 为：
```Groovy
withSonarQubeEnv('sonar') {
  sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=ks-devops -Dsonar.sources=.  -Dsonar.login=$SONAR_TOKEN"
}
waitForQualityGate abortPipeline: true
```

## Jenkins Kubernetes Deploy 所支持的资源类型与资源版本

受限于目前的 Kubernetes Deploy 的插件实现，目前仅能支持特定 API 版本的特定资源。

支持的资源列表如下表格所示：


| 资源类型 | API 版本 |
| --- | --- | 
| ConfigMap | v1 |
| Daemon Set | apps/v1、extensions/v1beta1、apps/v1beta2 |
| Deployment | apps/v1、apps/v1beta1、extensions/v1beta1、apps/v1beta2 |
| Ingress | extensions/v1beta1 | 
| Job | batch/v1 | 
| Namespace | v1 | 
| Pod | v1 | 
| Replica Set | apps/v1、extensions/v1beta1、apps/v1beta2 | 
| Replication Controller | v1 | 
| Secret | v1 | 
| Service | v1 | 
| Stateful Set | apps/v1、apps/v1beta1、apps/v1beta2 | 
| Cron Job | batch/v1beta1、batch/v2alpha1 | 
| Horizontal Pod Autoscaler | autoscaling/v1、autoscaling/v2beta1、autoscaling/v2beta2 | 
| Network Policy | networking.k8s.io/v1 | 
| Persistent Volume  | v1 | 
| Persistent Volume Claim  | v1 | 


## 为各种不同语言的项目执行代码分析

在流水线示例当中，我们使用 `mvn sonar:sonar` 为 Maven 管理的 Java 项目执行代码分析。

现在我们介绍一下如何为其他语言的项目执行代码分析，在为其他语言的项目做分析时候，我们大都会使用 [SonarQube Scanner](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner)作为执行分析命令的工具。

### 流水线中一键安装并使用 SonarQube Scanner

下面我就来介绍一下如何在流水线中获取并使用 `SonarQube Scanner`:

在 KubeSphere 所提供的 Jenkins 当中可以使用 Jenkins `tool` 命令在不同的 Pipeline agent 上安装 SonarQube Scanner，如下面的Jenkinsfile所示：

```Groovy
    stage('sonarqube analysis'){
      steps{
        script {
          scannerHome = tool 'sonar';  // 安装sonar工具，并且获取sonar工具路径
        }
        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
            withSonarQubeEnv('sonar') {
               sh "${scannerHome}/bin/sonar-scanner -Dsonar.branch=$BRANCH_NAME -Dsonar.projectKey=%{xxxx} -Dsonar.sources=.  -Dsonar.login=$SONAR_TOKEN"  // 执行 SonarQube Scanner 分析语句
            }
        }
        timeout(time: 1, unit: 'HOURS') {
          waitForQualityGate abortPipeline: true
        }
      }
```

### 各种语言的分析方式

对于各种不同的语言，SonarQube 执行分析的配置不太相同，具体可以参考 [SonarQube 官方文档](https://docs.sonarqube.org/display/PLUG)。

 

