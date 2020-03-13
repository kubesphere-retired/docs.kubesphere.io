---
title: "安装 Metrics-server 开启 HPA"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'install metrics-server to enable HPA'
---

KubeSphere 支持对 Deployment 设置 [弹性伸缩 (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) ，支持根据集群的监控指标如 CPU 使用率和内存使用量来设置弹性伸缩，当业务需求增加时，KubeSphere 能够无缝地自动水平增加 Pod 数量，提高应用系统的稳定性。

关于如何使用 HPA 请参考 [设置弹性伸缩](../../quick-start/hpa)，注意，Installer 默认最小化安装因此初始安装时并未开启 Metrics-server 的安装，请在使用 HPA 之前开启 Metrics-server 的安装，参考以下文档。



## 安装前如何开启 Metrics-server

> 注意：开启可选功能组件之前，请先参考 [可插拔功能组件列表](../../installation/intro/#可插拔功能组件列表)，**确认集群的可用 CPU 与内存空间是否充足，否则可能会因为资源不足而导致的机器崩溃或其它问题。**

安装前，在 installer 目录下编辑 `conf/common.yaml` 文件，然后参考如下开启。


```yaml
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
···
metrics_server_enabled: true
```

## 安装后如何开启 Metrics-server 安装

1. 通过修改 ks-installer 的 configmap 可以选装组件，执行以下命令。

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

**参考如下修改 ConfigMap**

```yaml
···
metrics-server:
     enabled: True       
```

2. 保存退出，参考 [验证可插拔功能组件的安装](../verify-components) ，通过查询 ks-installer 日志或 Pod 状态验证功能组件是否安装成功。
