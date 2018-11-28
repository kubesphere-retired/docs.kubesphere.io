---
title: "产品优势"
---

### 设计愿景

众所周知，开源项目 Kubernetes 已经成为事实上的编排平台的领导者，是下一代分布式架构的王者，其在自动化部署、扩展性、以及管理容器化的应用已经体现出独特的优势。然而，很多人学习 Kubernetes，就会发现有点不知所措，因为 Kubernetes 本身有许多组件并且还有一些组件需要自行安装和部署，比如存储和网络目前 Kubernetes 仅提供的是开源的解决方案或项目，可能在某种程度上难以安装，维护和操作，对于用户来说学习成本和门槛都不是一件易事。

如果无论如何都得将应用部署在云上运行，为什么不让 KubeSphere 为您运行 Kubernetes 且更好地管理运行的资源呢？这样您就可以继续运行应用程序和工作负载并专注于这些更重要的业务。因为通过 KubeSphere 来快速创建 Kubernetes 集群、部署应用、添加服务、CI/CD、集群扩容、微服务治理、日志记录和资源监控，以及利用 KubeSphere 的其他诸多强大功能是多么容易。换句话说，Kubernetes 是一个很棒的开源项目（或被认为是一个框架），但是 KubeSphere 是一款非常专业的企业级平台产品，专注于解决用户在复杂业务场景中的痛点，提供更好更专业的用户体验。

最重要的是，KubeSphere 在存储和网络方面提供了最优的解决方案，比如存储除了支持流行的开源共享存储如 NFS、 Ceph RBD 和 GlusterFS 之外，还提供 [QingCloud 云平台块存储](https://docs.qingcloud.com/product/storage/volume/) 和 [分布式存储 QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/) 作为 Kubernetes 的持久化存储，通过集成的 QingCloud CSI 和 NeonSAN CSI 插件，即可使用青云提供的高性能块存储或 NeonSAN 作为存储卷挂载至工作负载，为企业应用和数据提供更稳定安全的存储。

### 为什么选择 KubeSphere ？

KubeSphere 为企业用户提供高性能可伸缩的容器应用管理服务，旨在帮助企业完成新一代互联网技术驱动下的数字化转型，加速业务的快速迭代与交付，以满足企业日新月异的业务需求。


|优势|说明|
|---|---|
|灵活便捷的存储配置方案| 商业化存储服务，将青云云平台块存储和 NeonSAN 块存储与 Kubernetes 相对接，提供自主可控的存储服务<br>对接开源存储系统，如 Ceph RBD, Glusterfs, NFS<br>为用户提供丰富的功能：存储卷管理，存储类型管理 <br>将 Kubernetes 存储理念和丰富的存储功能融入 UI ，易于使用和管理存储资源|
|弹性伸缩|支持部署后集群节点扩容以及 Pod 动态的横向伸缩，保证集群和资源的高可用和可靠性。|
|多维度监控|与云原生监控领域事实上的标准 Prometheus 全面深度集成<br>为 Kubernetes 提供全方位、多维度、细粒度、灵活、易用的监控 API<br> Cluster/Node/Workspace/Namespace/Workload/Pod/Container 多维度监控全覆盖并支持逐级下钻<br>丰富的监控指标、简洁美观的 UI 展现，提供即时值、趋势、排行等多种展现方式<br>通过监控 API 将 Kubenetes 监控与现有监控系统集成|
|多租户管理|提供多层级的权限控制体系，可分别针对集群、租户、项目多个层级进行授权<br>细粒度的权限控制，基于 RBAC 权限管理策略，可以灵活的制定角色<br>组织机构管理，支持组织机构多层级用户、组管理，针对用户组的权限管理<br>支持 LDAP、AD 的账户同步，快速接入企业现有的账户系统<br>统一认证，基于 OAuth2.0 提供统一的认证入口<br>
|安全第一位|API 安全，API Gateway 和认证鉴权体系保证 API 的安全<br>网络安全，基于 Kubernetes NetworkPolicy 实现内部网络隔离<br>操作系统安全，基于 Kubernetes Namespace实现计算资源隔离|
|内置 DevOps 工程|开箱即用的 DevOps 功能，无需对 Jenkins 进行复杂的插件配置<br>独立 DevOps 工程，提供访问可控、安全隔离的 CI/CD 操作空间<br>兼容 Jenkinsfile in & out of SCM（Source Code Management）两种模式<br>可视化流水线编辑工具，降低 CI/CD 学习成本<br>使用 KubeSphere 提供弹性、干净、可定制的构建环境|
|极简体验，向导 UI|面向开发、测试、运维友好的 UI ，向导式用户体验，降低 Kubernetes 学习成本的设计理念。|
|松耦合功能模块设计| 除提供基于原生 k8s 的管理功能之外，用户可以使用 KubeSphere 集成的诸如镜像仓库、应用仓库、监控、日志模块，也可通过配置的方式集成自建的相关服务。 |
|可选的商业网络解决方案|除开源解决方案外，如用户对网络有更高要求，可选用青云作为底层平台，可以使用性价比更高的网络解决方案。|

### 产品规划
Community Edition （ [社区版](https://kubesphere.qingcloud.com/#category) ）=> Express Edition （ [易捷版](https://kubesphere.qingcloud.com/#category) ）=> Advanced Edition （ [高级版](https://kubesphere.qingcloud.com/#category) ）

![Roadmap](/ae-roadmap.png)