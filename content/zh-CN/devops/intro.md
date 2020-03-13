---
title: "DevOps 工程概述"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

由于软件开发复杂度的增高和更多的协同工作，团队开发成员间如何更好地在协同工作中确保软件开发和交付质量，逐渐成为研发过程中不可回避的问题。众所周知，敏捷开发 (Agile) 在业内日趋流行，团队如何在不断变化的需求中快速适应和保证软件质量就变得极其重要了。而 CI/CD 就是专门为解决上述需求的软件开发实践。CI/CD 要求每次的集成都是通过自动化的构建来验证，包括自动编译、发布和测试，从而尽快地发现集成错误，让团队能够更快的开发内聚的软件，减轻了软件发布时的压力。

### KubeSphere DevOps 特点

相较于易捷版，DevOps 工程是高级版独有的功能，针对企业实际的快速迭代和快速交付业务需求和场景，可以发现很多企业和 IT 团队都有持续集成和持续交付的需求。DevOps 工程提供 Jenkinsfile in & out of SCM 两种模式，从仓库 (SVN/Git/GitHub)、代码编译、镜像制作、镜像安全、推送到仓库、应用版本、到定时构建的端到端流水线设置，支持用户在开发、测试等环境下的端到端高效流水线能力，支持用户成员管理，同时提供完整的日志功能，记录 CI/CD 流水线的每个过程。


KubeSphere v2.1 提供的 DevOps 具有以下功能：


- 开箱即用的 DevOps 功能，无需对 Jenkins 进行复杂的插件配置；
- 支持 Source to Image (S2I)，快速交付容器镜像；
- 多语言代码静态检查，持续提升代码质量；
- 独立 DevOps 工程，提供访问可控、安全隔离的 CI/CD 操作空间；
- 兼容 Jenkinsfile in & out of SCM (Source Code Management) 两种模式；
- 可视化流水线编辑工具，降低 CI/CD 学习成本；
- 使用 KubeSphere 基于 Kubernetes 提供弹性、干净、可定制的构建环境。

### 理解 KubeSphere DevOps

KubeSphere 的 DevOps 工程目前支持 GitHub、Git 和 SVN 这一类源代码管理工具，提供可视化的 CI/CD 流水线构建，或基于代码仓库已有的 Jenkinfile 构建流水线。

软件开发的生命周期中，持续构建和发布是 IT 团队在日常工作中必不可少的步骤。但是，相比较传统的 Jenkins 集群一主多从的方式必然存在一些痛点：

- Master 一旦发生单点故障，那么整个 CI/CD 流水线就崩溃了；
- 资源分配不均衡，有的 Slave 要运行的 job 出现排队等待，而有的 Slave 处于空闲状态；
- 不同的 Slave 的配置环境可能不一样，需要完成不同语言的编译打包，这类差异化的配置进一步导致管理不便，维护起来也不是一件易事。

KubeSphere 的 CI/CD 是基于底层 Kubernetes 的动态 Jenkins Slave，也就是说 Jenkins Slave 具有动态伸缩的能力，能够根据任务的执行状态进行动态创建或自动注销释放资源。实际上，Jenkins Master 和 Jenkins Slave 以 Pod 形式运行在 KubeSphere 集群的 Node 上，Master 运行在其中一个节点，并且将其配置数据存储到一个 Volume 中，Slave 运行在各个节点上，并且它不是一直处于运行状态，它会按照需求动态的创建并自动删除。

上述的工作流程可以理解为：当 Jenkins Master 接受到 Build 请求时，会根据配置的 Label 动态创建运行在 Pod 中的 Jenkins Slave 并注册到 Master 上，当这些 Slave 运行完任务后，就会被注销，并且相关的 Pod 也会自动删除，恢复到最初状态。

所以，这种动态的 Jenkins Slave 优势就显而易见了：

- 动态伸缩，合理使用资源，每次运行任务时，会自动创建一个 Jenkins Slave，任务完成后，Slave 自动注销并删除容器，资源自动释放，而且 KubeSphere 会根据每个资源的使用情况，动态分配 Slave 到空闲的节点上创建，降低出现因某节点资源利用率高，还排队等待在该节点的情况；
- 扩展性好，当 KubeSphere 集群的资源严重不足而导致任务排队等待时，可以很容易的添加一个 KubeSphere Node 到集群中，从而实现扩展；
- 高可用，当 Jenkins Master 出现故障时，KubeSphere 会自动创建一个新的 Jenkins Master 容器，并且将 Volume 分配给新创建的容器，保证数据不丢失，从而达到集群服务高可用。

### 快速上手 CI/CD

我们提供了几篇具有代表性的示例和文档，帮助您快速上手 CI/CD。

- [Source to Image](../../quick-start/source-to-image/)

- [基于Spring Boot项目构建流水线](../../quick-start/devops-online)

- [CI/CD 流水线 (离线版)](../../quick-start/devops-online)

- [Jenkinsfile out of SCM](../../quick-start/jenkinsfile-out-of-scm)


### Jenkins Agent 说明

在 DevOps 工程中，KubeSphere 使用 Kubernetes Jenkins Agent 来执行具体的构建。Agent 部分指定整个 Pipeline 或特定阶段将在 Jenkins 环境中执行的位置，具体取决于该 Agent 部分的放置位置。该部分必须在 Pipeline 块内的顶层或 Stage 内部定义，详见 [Jenkins Agent 说明](../jenkins-agent)。

### 添加代码仓库

在创建 Jenkinsfile in SCM 这类流水线时，可参考 [添加代码仓库](../add-scm) 选择添加 Git 或 SVN 这类代码仓库。

### 设置自动触发扫描

在构建已有 SCM (Source Code Management) 的流水线中，用户如果需要为流水线设置自动发现远程分支的变化，以生成新的流水线并使其自动地重新运行，可参考 [设置自动触发扫描](../auto-trigger)。

### 高级设置

KubeSphere 使用了 Configuration-as-Code 进行 Jenkins 的系统设置，详见 [Jenkins 系统设置](../../devops/jenkins-setting)。

### 流水线常见问题

本篇文档总结了流水线运行可能遇到的问题以及如何排错，详见 [流水线常见问题](../devops-faq)。





