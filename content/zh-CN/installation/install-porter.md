---
title: "安装 Porter 负载均衡器插件"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Porter - 在物理机 Kubernetes 环境中暴露服务的负载均衡器插件'
---


## 什么是 Porter

[Porter](https://github.com/kubesphere/porter) 是一个开源的适用于 **物理机部署 Kubernetes** 的负载均衡器，该负载均衡器使用物理交换机实现，利用 BGP 和 ECMP 从而达到性能最优和高可用性。我们知道在云上部署的 Kubernetes 环境下，通常云服务厂商会提供 cloud LB 插件暴露 Kubernetes 服务到外网，但在物理机部署环境下由于没有云环境，服务暴露给外网非常不方便，Porter 是一个提供用户在物理环境暴露服务和在云上暴露服务一致性体验的插件。

该插件提供两大功能模块：

- LB controller 和 agent: controller 负责同步 BGP 路由到物理交换机；agent 以 DaemonSet 方式部署到节点上负责维护引流规则；
- EIP service，包括 EIP pool 管理和 EIP controller，controller 会负责更新服务的 EIP 信息。


![](https://pek3b.qingstor.com/kubesphere-docs/png/20200214100015.png)

## 安装 Porter

请参考 [安装 Porter](https://github.com/kubesphere/porter#installation)。
