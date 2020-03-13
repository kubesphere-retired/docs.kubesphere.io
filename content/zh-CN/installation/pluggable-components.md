---
title: "KubeSphere 可插拔功能组件概览"
keywords: 'kubernetes, docker, kubesphere, jenkins, istio, prometheus'
description: 'Linux 单节点安装 KubeSphere 与 Kubernetes'
---

## 说明

KubeSphere 在 2.1 版本的 Installer 对各功能组件进行了 **解耦**，**快速安装将默认仅开启最小化安装（Minimal Installation）**，支持在安装前或安装后 [自定义可插拔的功能组件的安装](../intro#自定义安装可插拔的功能组件)，使最小化安装 **更快速轻量且资源占用更少**，也方便不同用户 **按需选择安装不同的功能组件**。

## 可插拔功能组件列表

KubeSphere 有以下六个可插拔功能组件，您可以根据需求，选择开启安装 KubeSphere 的功能组件。我们非常建议您开启这些功能组件来体验 KubeSphere 完整的功能以及端到端的解决方案。

- [KubeSphere 应用商店](../install-openpitrix)
- [KubeSphere DevOps 系统](../install-devops)
- [KubeSphere 日志系统](../install-logging)
- [KubeSphere Service Mesh（基于 Istio）](../install-servicemesh)
- [KubeSphere 告警通知系统](install-alert-notification)
- [Metrics-server（HPA）](instal-metrics-server)

## 可插拔功能组件介绍

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191207140846.png)

> - KubeSphere 多租户日志系统（Logging）：[日志查询](../../toolbox/log-search) 与 [日志收集](../../platform-settings/log-gathering)；
> - KubeSphere 多维度告警通知系统（Alerting & Notification）：[设置集群节点告警](../../monitoring/alert-policy) 与 [设置工作负载告警](../../monitoring/workload-alert-policy)；
> - KubeSphere 一站式 DevOps 系统（CI/CD）：[图形化构建流水线](../../quick-start/jenkinsfile-out-of-scm)、[构建流水线发布项目至 Kubernetes](../../quick-start/devops-online)、[Source-to-Image](../../quick-start/source-to-image)；
> - KubeSphere 应用与微服务治理系统（ServiceMesh）：[微服务的灰度发布与 Tracing](../../quick-start/bookinfo-canary)、[熔断](../../application/circuit-breaking)、[流量治理](../../application/traffic-gov)；
> - Metrics server：[HPA 弹性伸缩](../../quick-start/hpa)；

## 可插拔功能组件配置要求

<font color=red>
注意：开启可选功能组件之前，请先参考下表确认集群的可用 CPU 与内存空间是否充足（下表是计算得出的各组件 CPU 与内存的 Request 值），否则可能会因为资源不足而导致的机器崩溃或其它问题。
</font>

 | 功能组件 | 命名空间（所属项目） | CPU (request)| 内存 (request)| 说明 |
 | --- | --- | --- | --- | --- |
 | KubeSphere 应用商店 | openpitrix-system |  0.3 core | 300 MiB | 内置应用商店与应用生命周期管理<br>，建议安装 |
 | KubeSphere 告警通知系统 | kubesphere-alerting-system | 0.08 core | 80 M | alerting 与 notification 安装时<br>建议同时开启|
 | KubeSphere DevOps System(All-in-one)| kubesphere-devops-system| 34 m| 2.69 G | 一站式 DevOps 方案，内置 Jenkins 流水线与 B2I & S2I |
 | KubeSphere DevOps System (Multi-node)| kubesphere-devops-system | 0.47 core| 8.6 G |多节点安装 DevOps 需要<br>有一个节点的内存大于 8 G |
 | KubeSphere Service Mesh（基于 Istio）| istio-system  | 2 core | 3.6 G | 支持灰度发布、流量拓扑、流量治理、Tracing |
 | KubeSphere 日志系统 | kubesphere-logging-system  | 56 m | 2.76 G | 内置日志查询、日志收集和日志转发等功能 |
 | 弹性伸缩（HPA） | metrics-server | 5 m | 44.35 MiB | 内置 [弹性伸缩 HPA](../../quick-start/hpa) |

 > 说明：
 > - 此表格中的 CPU 与内存占用数据仅为最小资源占用，在实际的集群环境中建议预留更充足的资源空间。
 > - 单位后缀 m 表示千分之一核，即 1 Core = 1000m。

<!-- ## Components Version

The components marked with `*` are required in minimal installation. Others are pluggable components.

|  组件 |  版本 |
|---|---|
|* KubeSphere| 2.1.0|
|* Kubernetes| v1.15.5 |
|* etcd|3.2.18|
|* Prometheus| v2.3.1|
|Fluent Bit| v1.2.1|
|Elasticsearch | v6.7.0 ( **Support using external ElasticSearch 7.x** )|
|Istio | v1.3.3 |
|OpenPitrix (App Store)| v0.4.5 |
-->
