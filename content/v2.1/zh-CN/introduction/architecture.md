---
title: "架构说明"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'KubeSphere 架构说明'
---

KubeSphere 采用了**前后端分离的架构**，实现了**面向云原生的设计**，后端的各个功能组件可通过 REST API 对接外部系统，可参考 [API 文档](../../api-reference/api-docs)。KubeSphere 无底层的基础设施依赖，可以运行在任何 Kubernetes、私有云、公有云、VM 或物理环境（BM）之上。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190910101703.png)

|后端组件|功能说明|
|---|---|
|ks-account| 提供用户、权限管理相关的 API |
|ks-apiserver| 整个集群管理的 API 接口和集群内部各个模块之间通信的枢纽，以及集群安全控制 |
|ks-apigateway| 负责处理服务请求和处理 API 调用过程中的所有任务 |
|ks-console| 提供 KubeSphere 的控制台服务 |
|ks-controller-manager| 实现业务逻辑的，例如创建企业空间时，为其创建对应的权限；或创建服务策略时，生成对应的 Istio 配置等|
|Metrics-server|Kubernetes 的监控组件，从每个节点的 Kubelet 采集指标信息|
|Prometheus|提供集群、节点、工作负载、API 对象等相关监控数据与服务|
|Elasticsearch|提供集群的日志索引、查询、数据管理等服务，在安装时也可对接您已有的 ES 减少资源消耗|
|Fluent Bit|提供日志接收与转发，可将采集到的⽇志信息发送到 ElasticSearch、Kafka |
|Jenkins| 提供 CI/CD 流水线服务|
|SonarQube| 可选安装项，提供代码静态检查与质量分析 |
|Source-to-Image | 将源代码自动将编译并打包成 Docker 镜像，方便快速构建镜像 |
|Istio|提供微服务治理与流量管控，如灰度发布、金丝雀发布、熔断、流量镜像等|
|Jaeger | 收集 Sidecar 数据，提供分布式 Tracing 服务 |
|OpenPitrix | 提供应用模板、应用部署与管理的服务 |
|Alert | 提供集群、Workload、Pod、容器级别的自定义告警服务 |
|Notification| 通用的通知服务，目前支持邮件通知 |
|redis| 将 ks-console 与 ks-account 的数据存储在内存中的存储系统 |
|MySQL|集群后端组件的数据库，监控、告警、DevOps、OpenPitrix 共用 MySQL 服务|
|PostgreSQL |SonarQube 和 Harbor 的后端数据库|
|OpenLDAP|负责集中存储和管理用户账号信息与对接外部的 LDAP|
|存储|内置 CSI 插件对接云平台存储服务，可选安装开源的 NFS/Ceph/Gluster 的客户端|
|网络|可选安装 Calico/Flannel 等开源的网络插件，支持对接云平台 SDN|

除了上述列表的组件，KubeSphere 还支持 Harbor 与 GitLab 作为可选安装项，您可以根据项目需要进行安装。以上列表中每个功能组件下还有多个服务组件，关于服务组件的说明，可参考 [服务组件说明](../../infrastructure/components)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190910143931.png)

