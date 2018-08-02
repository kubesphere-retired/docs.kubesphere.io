---
title: "KubeSphere 简介"
---


# 产品概述

## 产品介绍
KubeSphere 是在目前主流容器调度平台 Kubernetes 之上构建的企业级分布式多租户容器管理平台，提供简单易用的操作界面以及向导式操作方式，在降低用户使用容器调度平台学习成本的同时，极大减轻开发、测试、运维的日常工作的复杂度。除此之外，平台整合并优化了多个适用于容器场景的功能模块，以帮助企业轻松应对多租户、服务治理、CI/CD、应用管理、监控日志、大数据、人工智能以及 LDAP 集成等复杂业务场景，KubeSphere 提供了在生产环境集群部署的全栈化容器部署与管理平台。

### 组件版本
|  组件 |  版本信息 |
|---|---|
|KubeSphere| 1.0 Alpha (20180705.1800)|
|KubeSphere Console| Express Edition|
|Kubernetes| v1.10.5|
|OpenPitrix| v0.1.6|


### 产品功能
KubeSphere 为用户提供了一个具备极致体验的 Web 控制台，让您能够像使用任何其他互联网产品一样，快速上手各项功能与服务。KubeSphere 目前集成了应用负载、服务与网络、应用管理、资源和平台管理共五大模块，以下从专业的角度为您详解各个模块的功能服务：

|   功能 | 说明 | 特点 |
|------------|--------------| -------------  |
| 应用负载管理  |对 kubernetes 中的多种 workload 提供向导式管理界面，包括 Deployments, Daemon Sets, Stateful Sets,并提供HPA支持 | 简单易用 |
| 服务与网络管理 |基于原生 API，对 k8s 中的服务( Service )，应用路由（ ingress ），以及 istio 中的 微服务治理，熔断，灰度发布，限流，智能路由等功能提供向导式管理界面，同时，如部署在青云平台之上，可以使用插件对接青云的负载均衡器 |灵活扩展|
| 应用管理 | 后端使用开源的 OpenPitrix 服务，为 k8s 提供应用全生命周期管理功能，包括： 应用仓库，仓库管理，应用拓扑图，APM，应用变更，发布，审批，版本控制，鲁棒性测试 | 高效便捷 |
| 资源管理 | 提供存储、主机、集群以及配额管理。存储支持主流开源存储解决方案，对于青云平台用户也可对接青云的块存储和 NeonSAN。可批量添加主机，且对主机平台及系统弱依赖。并且，支持镜像仓库管理，镜像复制，权限管理，垃圾回收，镜像安全扫描。内置的镜像仓库支持高可用 | 专业可靠 |
| 平台管理 | 提供基于角色的细粒度权限多租户管理。平台服务间进行加密通信。提供操作审计日志。可对宿主机以及容器镜像进行安全扫描并发现漏洞。| 安全可控 |

#### Why KubeSphere ？

KubeSphere 为企业用户提供高性能可伸缩的容器应用管理服务，旨在帮助企业完成新一代互联网技术驱动下的数字化转型，加速海量业务的快速迭代与交付，以满足企业日新月异的业务需求。

##### 产品优势
|优势|说明|
|---|---|
|统一门户|无基础设施依赖，无 Kubernetes 依赖，整合多种云平台，纳管多源 Kubernetes 集群|
|安全第一位|多租户、细粒度安全架构设计，并可集成企业中心化用户中心系统|
|极简体验，向导UI|面向开发、测试、运维友好的 UI ，向导式用户体验，降低 Kubernetes 学习成本的设计理念|
|松耦合功能模块设计| 除提供基于原生 k8s 的管理功能之外，用户可以使用 KubeSphere 集成的诸如镜像仓库、应用仓库，监控、日志模块，也可通过配置的方式集成自建的相关服务 |
|整体化容器平台解决方案|贯通应用开发、管理，CI/CD，服务治理，发布上线，流量管控等一系列流程|
|可选的商业网络和存储解决方案|除开源解决方案外，如用户对网络和存储有更高要求，可选用青云作为底层平台，可以使用性价比更高的网络和存储解决方案|

### 产品规划
Community Edition => Express Edition => Advanced Edition

### 名词解释
了解和使用KubeSphere管理平台，会涉及到以下的基本概念：

#### KubeSphere 与 Kubernetes 常用概念对照
 
|  KubeSphere  | Kubernetes |
|------------|--------------|
|项目|Namespace ， 为 Kubernetes 集群提供虚拟的隔离作用, 详细参考 [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)|
|部署|Deployment ，表示用户对 Kubernetes 集群的一次更新操作，详细参考 [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)|
|有状态副本集|StatefulSet，用来管理有状态应用， 可以保证部署和scale的顺序，详细参考 [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)|
|守护进程集|DaemonSet ，保证在每个 Node 上都运行一个容器副本，常用来部署一些集群的日志、监控或者其他系统管理应用，详细参考 [Daemonset](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)|
|服务|Service ， 一个 Kubernete 服务是一个最小的对象，类似 pod,和其它的终端对象一样，详细参考 [Service](https://kubernetes.io/docs/concepts/services-networking/service/)|
|应用路由|Ingress ，是授权入站连接到达集群服务的规则集合。可通过 Ingress 配置提供外部可访问的 URL、负载均衡、SSL、基于名称的虚拟主机等，详细参考 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)|
|镜像仓库|Image Registries ，镜像仓库用于存放Docker镜像，Docker镜像用于部署容器服务， 详细参考 [Images](https://kubernetes.io/docs/concepts/containers/images/)|
|存储卷|Volume ， Kubernetes 集群中的存储卷跟 Docker 的存储卷有点类似， Docker 的存储卷作用范围为一个容器，而 Kubernetes 的存储卷的生命周期和作用范围是一个 Pod。详细参考 [Volume](https://kubernetes.io/docs/concepts/storage/volumes/)|
|存储类型|StorageClass ，为管理员提供了描述存储“ class （类）”的方法，包含 Provisioner、 ReclaimPolicy 和 Parameters 。详细参考 [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/)|
主机|Node ，Kubernetes 集群中的计算能力由 Node 提供，Kubernetes 集群中的 Node 是所有 Pod 运行所在的工作主机，可以是物理机也可以是虚拟机。详细参考 [Nodes](https://kubernetes.io/docs/concepts/architecture/nodes/)|

# KubeSphere用户指南

《 KubeSphere 用户指南》为 KubeSphere Express Edition 的最终用户指南，以清晰简明的图文，向您详细地介绍了 KubeSphere 的产品概述、功能特性和各个功能模块的使用教程，旨在为用户提供简单易用的向导式帮助，助您快速入门。


本指南以 KubeSphere 菜单栏为导向，通过图文结合的方式，为您详细介绍以下六个模块：

- 首页
- 应用负载 
- 服务与网络
- 应用管理
- 资源
- 平台管理
