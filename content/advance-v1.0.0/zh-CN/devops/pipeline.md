---
title: "流水线"
---

[Jenkins Pipeline](https://jenkins.io/doc/book/pipeline/) (流水线) 表示应用从代码编译、测试、打包和部署的过程， KubeSphere 的流水线管理使用了业界常用的 [Jenkinsfile](https://jenkins.io/doc/book/pipeline/jenkinsfile/) 来表述一组 CI/CD 流程。Jenkinsfile 是一个文本文件，使用了 Jenkins 提供的 DSL（Domain-Specific Language）语法。为 降低学习 Jenkinsfile 语法的门槛，KubeSphere 提供了可视化编辑器，用户只需在页面上输入少量配置信息，接口自动组装完成 Jenkinsfile。也可直接编辑 Jenkinsfile，结合 KubeSphere 平台提供的一些功能插件，为更复杂的场景定制复杂流水线。

## 创建流水线（Pipeline）

创建流水线支持 `Jenkinsfile in SCM` 和 `Jenkinsfile out of SCM`。

- 第一种方式在创建流水线时需要添加代码仓库且仓库中存在 Jenkinsfile，并填写凭证信息，本文档给出了一个示例和视频，创建这类型的流水线请参阅 [Jenkinsfile in SCM](../Jenkinsfile-in-scm)。
- 第二种方式在创建时无需添加代码仓库，但需要手动构建流水线，本文档给出了一个示例和视频，创建这类型的流水线请参阅 [Jenkinsfile out of SCM](../Jenkinsfile-out-of-scm)。



  