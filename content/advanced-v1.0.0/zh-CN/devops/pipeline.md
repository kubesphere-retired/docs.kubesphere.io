---
title: "流水线"
---

[Jenkins Pipeline](https://jenkins.io/doc/book/pipeline/) (流水线) 表示应用从代码编译、测试、打包和部署的过程， KubeSphere 的流水线管理使用了业界常用的 [Jenkinsfile](https://jenkins.io/doc/book/pipeline/jenkinsfile/) 来表述一组 CI/CD 流程。Jenkinsfile 是一个文本文件，使用了 Jenkins 提供的 DSL（Domain-Specific Language）语法。为 降低学习 Jenkinsfile 语法的门槛，KubeSphere 提供了可视化编辑器，用户只需在页面上输入少量配置信息，接口自动组装完成 Jenkinsfile。也可直接编辑 Jenkinsfile，结合 KubeSphere 平台提供的一些功能插件，为更复杂的场景定制复杂流水线。

Pipeline 的几个常用概念：  

- Stage: 阶段，一个 Pipeline 可以划分为若干个 Stage，每个 Stage 代表一组操作。注意，Stage 是一个逻辑分组的概念，可以跨多个 Node。
- Node: 节点，一个 Node 就是一个 Jenkins 节点，或者是 Master，或者是 Agent，是执行 Step 的具体运行时环境。
- Step: 步骤，Step 是最基本的操作单元，小到创建一个目录，大到构建一个 Docker 镜像，由各类 Jenkins Plugin 提供。

## 创建流水线（Pipeline）

创建流水线支持 `Jenkinsfile in SCM (Source Code Management)` 和 `Jenkinsfile out of SCM (Source Code Management)`，请确保在创建流水线之前已创建了 DevOps 工程。本节准备了两个示例，通过以下两种方式，分别说明如何将本文档网站构建一个 CI/CD 的 Jenkins 流水线，并最终发布并部署到 KubeSphere 中。

- Jenkinsfile in SCM：创建此类型流水线时需要添加代码仓库且仓库中存在 Jenkinsfile，平台将扫描仓库中的 Jenkinsfile 自动构建流水线。本文档给出了一个示例和视频，参阅 [Jenkinsfile in SCM](../../quick-start/jenkinsfile-in-scm)。
- Jenkinsfile out of SCM：创建此类型的流水线无需添加代码仓库，支持可视化构建流水线，本文档给出了一个示例和视频，请参阅 [Jenkinsfile out of SCM](../../quick-start/jenkinsfile-out-of-scm)。



  