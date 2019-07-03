---
title: "监控概述"
---

KubeSphere 监控系统支持大规模系统监控、多指标监控、多维度监控，为每一个层级资源的运行状态都提供实时的多种指标监控，而且收集资源实时监控数据和历史监控数据，旨在帮助用户观察和建立资源和集群性能的正常标准。通过不同时间、不同负载条件下监测集群各项基础指标，并以图表或列表的形式展现。

例如，用户可以监控**集群和节点**的服务组件状态、CPU 利用率、内存使用率和磁盘 I/O、网卡流量等物理层级的基础指标，还可以监控**平台**的企业空间、容器组 (Pod) 和容器的 CPU 使用量、内存使用量等指标，以及应用资源用量、资源用量趋势，监控数据支持选择节点、企业空间或项目按具体指标进行排行。KubeSphere 监控还提供逐级钻取能力，用户可以很方便地查看某个服务组件下工作负载中的 Pod 和容器监控状况，帮助快速定位故障。


## 监控维度

KubeSphere 的监控中心包括 [集群状态监控](../cluster-resources) 和 [应用资源监控](../application-resources) 两大监控维度。通常，只有平台管理员 (cluster-admin) 或在该平台角色的权限列表中勾选了 **查看监控管理** 的用户才有权限在控制台查看监控中心，详见 [物理资源监控](../cluster-resources) 和 [应用资源监控](../application-resources)。

值得一提的是，监控中心支持用户按用量排序和自定义时间范围查询，帮助快速定位故障。

KubeSphere 对资源的监控从两条线提供多维度的监控指标，即
- 管理员视角：**Cluster -> Node -> Pod -> Container** 
- 用户视角：**Cluster -> Workspace -> Namespace -> Workload/Pod -> Container**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190702004824.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190702004904.png)

从上图中不难发现，KubeSphere 平台的监控指标和 IaaS 层相似，有我们常见的 CPU、内存、磁盘和网络等四个方面的使用量和使用率，还包括 Kubernetes 集群的 ETCD、API Server 和 kube-scheduler 的监控。

另外 KubeSphere 也提供主机的 inode 监控，Kubernetes 对镜像和日志都有回收机制，但没有对 inode 的回收或清理机制，有可能发生 inode 已经用光，但是硬盘还未存满的情况，此时已无法在硬盘上创建新文件，可能会造成整个集群中某个节点无法创建工作负载。
