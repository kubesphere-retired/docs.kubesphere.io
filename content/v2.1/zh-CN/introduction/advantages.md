---
title: "产品优势"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## 设计愿景

众所周知，开源项目 Kubernetes 已经成为事实上的编排平台的领导者，是下一代分布式架构的王者，其在自动化部署、扩展性、以及管理容器化的应用已经体现出独特的优势。然而，很多人学习 Kubernetes，就会发现有点不知所措，因为 Kubernetes 本身有许多组件并且还有一些组件需要自行安装和部署，比如存储和网络部分，目前 Kubernetes 仅提供的是开源的解决方案或项目，可能在某种程度上难以安装，维护和操作，对于用户而言，学习成本和门槛都很高，快速上手并不是一件易事。

如果无论如何都得将应用部署在云上运行，为什么不让 KubeSphere 为您运行 Kubernetes 且更好地管理运行的资源呢？这样您就可以继续运行应用程序和工作负载并专注于这些更重要的业务。因为通过 KubeSphere 可以快速管理 Kubernetes 集群、部署应用、服务发现、CI/CD 流水线、集群扩容、微服务治理、日志查询和监控告警。换句话说，Kubernetes 是一个很棒的开源项目（或被认为是一个框架），但是 KubeSphere 是一款非常专业的企业级平台产品，专注于解决用户在复杂业务场景中的痛点，提供更友好更专业的用户体验。

最重要的是，KubeSphere 在存储和网络方面提供了最优的解决方案，比如存储除了支持流行的开源共享存储如 Ceph RBD 和 GlusterFS 之外，还提供 [QingCloud 云平台块存储](https://docs.qingcloud.com/product/storage/volume/) 和青云自研的 [分布式存储 QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/) 作为 Kubernetes 的持久化存储，通过集成的 QingCloud CSI 和 NeonSAN CSI 插件，即可使用青云提供的高性能块存储或 NeonSAN 作为存储卷挂载至工作负载，为企业应用和数据提供更稳定安全的存储。

## 为什么选择 KubeSphere ？

KubeSphere 为企业用户提供高性能可伸缩的容器应用管理服务，旨在帮助企业完成新一代互联网技术驱动下的数字化转型，加速业务的快速迭代与交付，以满足企业日新月异的业务需求。

### 极简体验，向导式 UI

- 面向开发、测试、运维友好的用户界面，向导式用户体验，降低 Kubernetes 学习成本的设计理念
- 用户基于应用模板可以一键部署一个完整应用的所有服务，UI 提供全生命周期管理

### 业务高可靠与高可用

- 自动弹性伸缩：部署 (Deployment) 支持根据访问量进行动态横向伸缩和容器资源的弹性扩缩容，保证集群和容器资源的高可用
- 提供健康检查：支持为容器设置健康检查探针来检查容器的健康状态，确保业务的可靠性

### 容器化 DevOps 持续交付

- 简单易用的 DevOps：基于 Jenkins 的可视化 CI/CD 流水线编辑，无需对 Jenkins 进行配置，同时内置丰富的 CI/CD 流水线模版
- Source to Image (S2I)：从已有的代码仓库中获取代码，并通过 S2I 自动构建镜像完成应用部署并自动推送至镜像仓库，无需编写 Dockerfile
- Binary to Image (B2I)：跟S2I一样，只不过是从二进制可执行文件打包成镜像，而不是从源代码开始打包
- 端到端的流水线设置：支持从仓库 (GitHub / SVN / Git)、代码编译、镜像制作、镜像安全、推送仓库、版本发布、到定时构建的端到端流水线设置
- 安全管理：支持代码静态分析扫描以对 DevOps 工程中代码质量进行安全管理
- 日志：日志完整记录 CI / CD 流水线运行全过程

### 开箱即用的微服务治理

- 灵活的微服务框架：基于 Istio 微服务框架提供可视化的微服务治理功能，将 Kubernetes 的服务进行更细粒度的拆分，支持无侵入的微服务治理
- 完善的治理功能：支持灰度发布、熔断、流量监测、流量管控、限流、链路追踪、智能路由等完善的微服务治理功能

### 灵活的持久化存储方案

- 支持 GlusterFS、CephRBD、NFS 等开源存储方案，支持有状态存储
- NeonSAN CSI 插件对接 QingStor NeonSAN，以更低时延、更加弹性、更高性能的存储，满足核心业务需求
- QingCloud CSI 插件对接 QingCloud 云平台各种性能的块存储服务

### 灵活的网络方案支持

- 支持 Calico、Flannel 等开源网络方案
- 分别开发了 [QingCloud 云平台负载均衡器插件](https://github.com/yunify/qingcloud-cloud-controller-manager) 和适用于物理机部署 Kubernetes 的 [负载均衡器插件 Porter](https://github.com/kubesphere/porter)
- 商业验证的 SDN 能力：可通过 QingCloud CNI 插件对接 QingCloud SDN，获得更安全、更高性能的网络支持


### 多维度监控日志告警

- KubeSphere 全监控运维功能可通过可视化界面操作，同时，开放标准接口对接企业运维系统，以统一运维入口实现集中化运维
- 可视化秒级监控：秒级频率、双重维度、十六项指标立体化监控；提供服务组件监控，快速定位组件故障
- 提供按节点、企业空间、项目等资源用量排行
- 支持基于多租户、多维度的监控指标告警，目前告警策略支持集群节点级别和工作负载级别等两个层级
- 提供多租户日志管理，在 KubeSphere 的日志查询系统中，不同的租户只能看到属于自己的日志信息



