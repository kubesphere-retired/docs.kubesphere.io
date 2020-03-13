---
title: "微服务治理（Service Mesh）"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Service Mesh'
---

KubeSphere 基于 [Istio](https://istio.io) 微服务框架提供了可视化的微服务治理功能，无需代码无侵入即可实现 **熔断、蓝绿发布、金丝雀发布、流量镜像、流量管控、限流、链路追踪（Tracing）等完善的微服务治理功能**，从业务角度为微服务组件提供了服务治理的能力，降低了 Istio 服务网格的学习门槛。

可参考文档 [微服务的灰度发布与 Tracing](../../quick-start/bookinfo-canary)、[熔断](../../application/circuit-breaking)、[流量治理](../../application/traffic-gov)，进一步了解 KubeSphere 内置的微服务治理功能。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191109212935.png)

## 安装微服务治理的前提条件

注意，目前 KubeSphere 微服务治理系统中的 Tracing 功能（Jaeger 组件）会依赖 KubeSphere 日志组件（Logging），在安装微服务治理之前，请先开启 [KubeSphere 日志系统](../install-logging) 的安装。

## 安装前如何开启安装微服务治理

安装前，在 installer 目录下编辑 `conf/common.yaml` 文件，然后参考如下开启。开启后请继续参考安装指南执行后续的安装步骤。

```yaml
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
···
servicemesh_enabled: true
```

## 安装后如何开启安装微服务治理

通过修改 ks-installer 的 configmap 可以选装组件，执行以下命令。

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

**参考如下修改 ConfigMap**


```yaml
servicemesh:
    enabled: True
```

保存退出，参考 [验证可插拔功能组件的安装](../verify-components) ，通过查询 ks-installer 日志或 Pod 状态验证功能组件是否安装成功。
