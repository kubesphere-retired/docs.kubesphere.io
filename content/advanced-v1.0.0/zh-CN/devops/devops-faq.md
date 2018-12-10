---
title: "流水线常见问题" 
---

在触发 CI / CD 流水线时可能会因为一些其它因素造成流水线运行失败，比如凭证信息填写错误或网络问题等这类不确定的原因。在流水线运行失败时，用户应该如何排错呢？

## 如何查看日志

在大多时间用户可以直接通过 Pipeline 的图形化页面查看日志完成排错，通常您执行命令的错误信息会在 Pipeline 的每个 Stage 的日志当中。如下执行了一个不存在的 Shell 命令，错误信息位于每个 Stage 的日志中。

![查看流水线日志](/Pipeline-log.png)

但是在部分情况下，错误的参数可能导致 Jenkins Pipeline 的异常中断，这时错误的日志在 Stage 日志中可能不会展示，需要用户使用流水线的下载日志下载整个 Pipeline 的完整日志。

例如下面这种情况，我们在使用 Pipeline Step 时传入了非法的参数，这种情况下部分 Step 可能会发生异常，但这种异常可能不会在 Stage 日志中展示。用户可以点击 **下载日志** 获取 Pipeline 的完整日志进行排错。

![下载日志](/Pipeline-log.png)

## 重新执行与运行之间的区别

重新执行将尽力还原 Pipeline 运行时所在的运行环境。尽管每次 Pipeline 运行完毕后整个 agent 环境将被销毁，但是 Jenkins 将 Pipeline 运行时所在的 SCM 环境与环境变量、参数变量以及 Jenkinsfile 信息都进行存储，在重新运行时将加载上次运行的环境，因此提供了几乎一致的运行环境。运行将重新触发一次运行，将刷新所有环境，根据用户的配置生成全新的环境。
**重新执行** 按钮位于运行图形化展示页的左侧。

![重新执行](/rerun-Pipeline.png)

## Jenkins与中文
kubesphere拥有很多母语为中文的用户，但是Jenkins目前对中文以及一些需要UTF-8字符集的语言支持度不是很好，因此我们强烈建议您在使用kubesphere-devops使用英文。

## 在agent当中切换工作空间

目前 `dir` 或 `ws` 命令都不能在k8s-agent当中切换到 `/home/jenkins/` 外的目录，如果需要切换到 `/home/jenkins/` 外的目录并执行命令，您可以使用 `cd` 命令进行目录的切换。例如： `cd /usr/ && ls`。
这是 Jenkins Kubernetes Plugin 一个已知的问题，我们会跟进社区后续修复。

## 示例运行失败如何排错

示例五和示例六中的 devops-docs-sample 代码仓库位于 GitHub 之中，并且 Pipeline 运行过程需要拉取项目所需的 npm 依赖，同时 sample 还将构建完成的镜像推往 dockerhub。因此 sample 对的执行网络环境有比较严格的要求。如果 devops-docs-sample 运行失败，同样可以通过查看 Pipeline 日志来获取完整的错误信息，以定位问题。


