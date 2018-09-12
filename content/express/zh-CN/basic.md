---
title: "KubeSphere 简介"
---


## 产品介绍

[KubeSphere](https://kubesphere.io) 是在目前主流容器调度平台 [Kubernetes](https://kubernetes.io) 之上构建的企业级分布式多租户容器管理平台，提供简单易用的操作界面以及向导式操作方式，在降低用户使用容器调度平台学习成本的同时，极大减轻开发、测试、运维的日常工作的复杂度。除此之外，平台已经整合并优化了多个适用于容器场景的功能模块，以帮助企业轻松应对多租户、工作负载和集群管理、服务与网络管理、应用管理、镜像仓库管理和存储管理等业务场景，下一个版本将支持服务治理、CI/CD、监控日志、大数据、人工智能以及 LDAP 集成等复杂业务场景，KubeSphere 提供了在生产环境集群部署的全栈化容器部署与管理平台。


## 产品优势

### 设计愿景

众所周知，开源项目 Kubernetes 已经成为事实上的编排平台的领导者，是下一代分布式架构的王者，其在自动化部署、扩展性、以及管理容器化的应用已经体现出独特的优势。然而，很多人学习 Kubernetes，就会发现有点不知所措，因为 Kubernetes 本身有许多组件并且还有一些组件需要自行安装和部署，比如存储和网络目前 Kubernetes 仅提供的是开源的解决方案或项目，可能在某种程度上难以安装，维护和操作，对于用户来说学习成本和门槛都不是一件易事。

如果无论如何都得将应用部署在云上运行，为什么不让 KubeSphere 为您运行 Kubernetes 且更好地管理运行的资源呢？这样您就可以继续运行应用程序和工作负载并专注于这些更重要的业务。因为通过 KubeSphere 来快速创建 Kubernetes 集群、部署应用、添加服务、CI/CD、集群扩容、微服务治理、日志记录和资源监控，以及利用 KubeSphere 的其他诸多强大功能是多么容易。换句话说，Kubernetes 是一个很棒的开源项目（或被认为是一个框架），但是 KubeSphere 是一款非常专业的企业级平台产品，专注于解决用户在复杂业务场景中的痛点，提供更好更专业的用户体验。

最重要的是，KubeSphere 在存储和网络方面提供了最优的解决方案，比如存储除了支持开源的 Ceph RBD 和 GlusterFS 之外，还提供 [青云云平台的块存储](https://docs.qingcloud.com/product/storage/volume/) 作为 Kubernetes 的持久化存储，通过集成的 QingCloud CSI 和 NeonSAN CSI 插件，即可使用青云提供的高性能块存储作为存储卷挂载至工作负载，为企业应用和数据提供更稳定安全的存储。

### 为什么选择 KubeSphere ？

KubeSphere 为企业用户提供高性能可伸缩的容器应用管理服务，旨在帮助企业完成新一代互联网技术驱动下的数字化转型，加速业务的快速迭代与交付，以满足企业日新月异的业务需求。


|优势|说明|
|---|---|
|灵活便捷的存储配置方案| 针对 Kubernetes 在存储配置上的复杂性， KubeSphere 支持动态分配存储卷，屏蔽底层存储差异性，极大地简化分配和回收存储卷流程。并且提供青云块存储与 Kubernetes 存储对接的解决方案，如目前的 Flex Volume，QingCloud CSI 插件和即将支持的 NeonSAN CSI 插件。 |
|弹性伸缩|支持部署后集群节点扩容以及 Pod 动态的横向伸缩，保证集群和资源的高可用和可靠性。|
|统一门户|无基础设施依赖，无 Kubernetes 依赖，整合多种云平台，纳管多源 Kubernetes 集群。|
|安全第一位|多租户、细粒度安全架构设计，并可集成企业中心化用户中心系统。|
|极简体验，向导UI|面向开发、测试、运维友好的 UI ，向导式用户体验，降低 Kubernetes 学习成本的设计理念。|
|松耦合功能模块设计| 除提供基于原生 k8s 的管理功能之外，用户可以使用 KubeSphere 集成的诸如镜像仓库、应用仓库、监控、日志模块，也可通过配置的方式集成自建的相关服务。 |
|整体化容器平台解决方案|高级版将贯通应用开发、管理、CI/CD、服务治理、发布上线和流量管控等一系列流程。|
|可选的商业网络和存储解决方案|除开源解决方案外，如用户对网络和存储有更高要求，可选用青云作为底层平台，可以使用性价比更高的网络和存储解决方案。|

### 产品规划
Community Edition （ [社区版](https://kubesphere.qingcloud.com/#category) ）=> Express Edition （ [易捷版](https://kubesphere.qingcloud.com/#category) ）=> Advanced Edition （ [高级版](https://kubesphere.qingcloud.com/#category) ）

## 产品功能

KubeSphere 为用户提供了一个具备极致体验的 Web 控制台，让您能够像使用任何其他互联网产品一样，快速上手各项功能与服务。KubeSphere 目前集成了应用负载、服务与网络、应用管理、资源管理和平台管理共五大模块，以下从专业的角度为您详解各个模块的功能服务：

|   功能    |       说明      |  
|------------|--------------|
| 应用负载管理  |对 kubernetes 中的多种 workload 提供向导式管理界面，包括 Deployments，Daemon Sets，Stateful Sets，并提供 HPA 支持。 | 
| 服务与网络管理 |基于原生 API，对 k8s 中的服务 (Service)、应用路由 (ingress) 等功能提供向导式管理界面，快速将应用暴露以供用户访问。高级版将集成 istio 中的 微服务治理、熔断、灰度发布、限流、智能路由等功能提供向导式管理界面。<br>如果部署在青云平台之上，可以使用插件对接青云的负载均衡器。 | 
| 应用管理 | 后端使用开源的 OpenPitrix 服务，为用户提供应用全生命周期管理功能，包括： 应用仓库管理、应用拓扑图、APM、应用变更和发布、应用上下线审批、版本控制、鲁棒性测试等。 | 
| 资源管理 | 提供存储、主机、集群以及配额管理。存储既支持主流开源存储解决方案，也可对接青云的块存储和 NeonSAN。可批量添加主机，且对主机平台及系统弱依赖。并且支持镜像仓库管理、镜像复制、权限管理、镜像安全扫描。 | 
| 平台管理 | 提供基于角色的细粒度权限多租户管理，平台服务间进行加密通信；提供操作审计日志；可对宿主机以及容器镜像进行安全扫描并发现漏洞。| 


## 名词解释
了解和使用 KubeSphere 管理平台，会涉及到以下的基本概念：

 
|  KubeSphere  | Kubernetes |
|------------|--------------|
|项目|Namespace， 为 Kubernetes 集群提供虚拟的隔离作用，详细参考 [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)。|
|部署|Deployment，表示用户对 Kubernetes 集群的一次更新操作，详细参考 [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)。|
|有状态副本集|StatefulSet，用来管理有状态应用，可以保证部署和 scale 的顺序，详细参考 [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)。|
|守护进程集|DaemonSet，保证在每个 Node 上都运行一个容器副本，常用来部署一些集群的日志、监控或者其他系统管理应用，详细参考 [Daemonset](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)。|
|服务|Service， 一个 Kubernete 服务是一个最小的对象，类似 Pod，和其它的终端对象一样，详细参考 [Service](https://kubernetes.io/docs/concepts/services-networking/service/)。|
|应用路由|Ingress，是授权入站连接到达集群服务的规则集合。可通过 Ingress 配置提供外部可访问的 URL、负载均衡、SSL、基于名称的虚拟主机等，详细参考 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)。|
|镜像仓库|Image Registries，镜像仓库用于存放 Docker 镜像，Docker 镜像用于部署容器服务， 详细参考 [Images](https://kubernetes.io/docs/concepts/containers/images/)。|
|存储卷|PersistentVolumeClaim（PVC），满足用户对于持久化存储的需求，用户将 Pod 内需要持久化的数据挂载至存储卷，实现删除 Pod 后，数据仍保留在存储卷内。Kubesphere 推荐使用动态分配存储，当集群管理员配置存储类型后，集群用户可一键式分配和回收存储卷，无需关心存储底层细节。详细参考 [Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。|
|存储类型|StorageClass，为管理员提供了描述存储 “Class（类）” 的方法，包含 Provisioner、 ReclaimPolicy 和 Parameters 。详细参考 [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/)。|
主机|Node，Kubernetes 集群中的计算能力由 Node 提供，Kubernetes 集群中的 Node 是所有 Pod 运行所在的工作主机，可以是物理机也可以是虚拟机。详细参考 [Nodes](https://kubernetes.io/docs/concepts/architecture/nodes/)。|


