---
title: "产品功能"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere 作为开源的企业级全栈化容器平台，为用户提供了一个具备极致体验的 Web 控制台，让您能够像使用任何其他互联网产品一样，快速上手各项功能与服务。KubeSphere 目前提供了工作负载管理、微服务治理、DevOps 工程、Source to Image/Binary to Image、多租户管理、多维度监控、日志查询与收集、告警通知、服务与网络、应用管理、基础设施管理、镜像管理、应用配置密钥管理等功能模块，开发了适用于物理机部署 Kubernetes 的 [负载均衡器插件 Porter](https://github.com/kubesphere/porter)，并支持对接多种开源的存储与网络方案，支持高性能的商业存储与网络服务。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191005195724.png)

以下从专业的角度为您详解各个模块的功能服务：

## Kubernetes 资源管理  

对底层 Kubernetes 中的多种类型的资源提供可视化的展示与监控数据，以向导式 UI 实现工作负载管理、镜像管理、服务与应用路由管理 (服务发现)、密钥配置管理等，并提供弹性伸缩 (HPA) 和容器健康检查支持，支持数万规模的容器资源调度，保证业务在高峰并发情况下的高可用性。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191005200455.png)

## 微服务治理

- 灵活的微服务框架：基于 Istio 微服务框架提供可视化的微服务治理功能，将 Kubernetes 的服务进行更细粒度的拆分
- 完善的治理功能：支持熔断、灰度发布、流量管控、限流、链路追踪、智能路由等完善的微服务治理功能，同时，支持代码无侵入的微服务治理

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190910172646.png)

## 多租户管理

- 多租户：提供基于角色的细粒度多租户统一认证与三层级权限管理
- 统一认证：支持与企业基于 LDAP / AD 协议的集中认证系统对接，支持单点登录 (SSO)，以实现租户身份的统一认证
- 权限管理：权限等级由高至低分为集群、企业空间与项目三个管理层级，保障多层级不同角色间资源共享且互相隔离，充分保障资源安全性

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190910173854.png)

## DevOps

- 开箱即用的 DevOps：基于 Jenkins 的可视化 CI / CD 流水线编辑，无需对 Jenkins 进行配置，同时内置丰富的 CI/CD 流水线插件
- CI/CD 图形化流水线提供邮件通知功能，新增多个执行条件
- 为流水线、s2i、b2i 提供代码依赖缓存支持
- 端到端的流水线设置：支持从仓库 (Git/ SVN / BitBucket)、代码编译、镜像制作、镜像安全、推送仓库、版本发布、到定时构建的端到端流水线设置
- 安全管理：支持代码静态分析扫描以对 DevOps 工程中代码质量进行安全管理
- 日志：日志完整记录 CI / CD 流水线运行全过程

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190910175008.png)

## 快速构建与发布

提供对代码（Source-to-Image）或者制品（Binary-to-Image）进行快速容器化的工具，无需编写 dockerfile，仅需要通过简单的设置即可将制品和代码构建成服务。

支持从已有的代码仓库中获取代码，或通过上传制品的方式，自动构建镜像和完成部署，并将镜像推送至目标仓库，每次构建镜像和服务的过程将以任务 (Job) 的方式去完成。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191005202413.png)

## 多维度监控

- KubeSphere 全监控运维功能可通过可视化界面操作，同时，开放标准接口，易于对接企业运维系统，以统一运维入口实现集中化运维
- 立体化秒级监控：秒级频率、双重维度、十六项指标立体化监控
    - 在集群资源维度，提供 CPU 利用率、内存利用率、CPU 平均负载、磁盘使用量、inode 使用率、磁盘吞吐量、IOPS、网卡速率、容器组运行状态、ETCD 监控、API Server 监控等多项指标
    - 在应用资源维度，提供针对应用的 CPU 用量、内存用量、容器组数量、网络流出速率、网络流入速率等五项监控指标。并支持按用量排序和自定义时间范围查询，快速定位异常
- 提供按节点、企业空间、项目等资源用量排行
- 提供服务组件监控，快速定位组件故障


![](https://pek3b.qingstor.com/kubesphere-docs/png/20191005202450.png)

## 自研多租户告警系统

- 支持基于多租户、多维度的监控指标告警，目前告警策略支持集群管理员对节点级别和租户对工作负载级别等两个层级
- 灵活的告警策略：可自定义包含多个告警规则的告警策略，并且可以指定通知规则和重复告警的规则
- 丰富的监控告警指标：提供节点级别和工作负载级别的监控告警指标，包括容器组、CPU、内存、磁盘、网络等多个监控告警指标
- 灵活的告警规则：可自定义某监控指标的检测周期长度、持续周期次数、告警等级等
- 灵活的通知发送规则：可自定义发送通知时间段及通知列表，目前支持邮件通知
- 自定义重复告警规则：支持设置重复告警周期、最大重复次数并和告警级别挂钩

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191005202908.png)

## 日志查询与收集

- 提供多租户日志管理，在 KubeSphere 的日志查询系统中，不同的租户只能看到属于自己的日志信息，支持中文日志检索，支持日志导出
- 多级别的日志查询 (项目/工作负载/容器组/容器以及关键字)、灵活方便的日志收集配置选项等
- 支持多种日志收集平台，如 Elasticsearch、Kafka、Fluentd
- 对于将日志以文件形式保存在 Pod 挂盘上的应用，支持开启落盘日志收集功能

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190910175920.png)


## 应用商店

- 基于开源的 [OpenPitrix](https://openpitrix.io) 提供应用商店和应用仓库服务
- 支持应用上传、应用审核、应用上架与分类、应用部署，为用户提供应用全生命周期管理功能
- 用户基于应用模板可以快速便捷地部署一个完整应用的所有服务

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191005224733.png)

## 基础设施管理

提供存储类型管理、主机管理和监控、资源配额管理，并且支持镜像仓库管理、权限管理、镜像安全扫描。内置 Harbor 镜像仓库，支持添加 Docker 或私有的 Harbor 镜像仓库。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191005225415.png)

## 多存储类型支持

- 支持 GlusterFS、CephRBD、NFS 等开源存储方案，支持有状态存储
- NeonSAN CSI 插件对接 QingStor NeonSAN，以更低时延、更加弹性、更高性能的存储，满足核心业务需求
- QingCloud CSI 插件对接 QingCloud 云平台各种性能的块存储服务

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190910180539.png)

## 多网络方案支持

- 支持 Calico、Flannel 等开源网络方案
- 开发了适用于物理机部署 Kubernetes 的 [负载均衡器插件 Porter](https://github.com/kubesphere/porter)
