---
title: "在 Kubernetes 在线部署 KubeSphere"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '将 KubeSphere 部署在 Kubernetes 之上'
---

KubeSphere 支持在已有 Kubernetes 集群之上在线安装 [KubeSphere](https://kubesphere.io/)。在安装之前，请确认您的环境满足以下 [前提条件](../prerequisites)：


> - `Kubernetes` 版本： `1.13.0 ≤ K8s version ≤ 1.16`；
> - `Helm`，版本 `>= 2.10.0`，且已安装了 Tiller，参考 [如何安装与配置 Helm](https://devopscube.com/install-configure-helm-kubernetes/)；
> - 集群的可用 CPU > 1 C，可用内存 > 2 G；
> - 集群已有存储类型（StorageClass）。

可参考 [前提条件](../prerequisites) 验证，若待安装的环境满足以上条件则可以开始部署 KubeSphere。

## 最小化安装 KubeSphere

最小化安装仅需要一条命令，即可安装在 Kubernetes 之上。

```yaml
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```

## 完整安装指南

参考 [ks-installer GitHub](https://github.com/kubesphere/ks-installer/tree/master)。
