---
title: "KubeSphere 告警通知系统"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'KubeSphere 告警通知系统'
---

KubeSphere 多租户告警系统支持灵活的告警策略和告警规则，支持邮件通知，并具备以下特性：


> - 支持基于多租户、多维度的监控指标告警，目前告警策略支持集群管理员对节点级别和租户对工作负载级别等两个层级；
> - 灵活的告警策略：可自定义包含多个告警规则的告警策略，并且可以指定通知规则和重复告警的规则；
> - 丰富的监控告警指标：提供节点级别和工作负载级别的监控告警指标，包括容器组、CPU、内存、磁盘、网络等多个监控告警指标；
> - 灵活的告警规则：可自定义某监控指标的检测周期长度、周期次数、告警等级等；目前支持邮件通知；
> - 灵活的重复告警规则：可自定义重复告警周期、最大重复次数并和告警级别挂钩。
>
> 可参考文档 [设置集群节点告警](../../monitoring/alert-policy) 与 [设置工作负载告警](../../monitoring/workload-alert-policy)，进一步了解 KubeSphere 告警通知系统的功能。

## 安装前如何开启安装告警通知系统

> 注意：开启可选功能组件之前，请先参考 [可插拔功能组件列表](../../installation/intro/#可插拔功能组件列表)，**确认集群的可用 CPU 与内存空间是否充足，开启安装前可能需要提前扩容集群或机器配置，否则可能会因为资源不足而导致的机器崩溃或其它问题。**

安装前，在 installer 目录下编辑 `conf/common.yaml` 文件，然后参考如下开启。


```yaml
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
···
notification_enabled: true
alerting_enabled: true
```

## 安装后如何开启安装告警通知系统

通过修改 ks-installer 的 configmap 可以选装组件，执行以下命令。

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

**参考如下修改 ConfigMap**

```yaml
    notification:
      enabled: True

    alerting:
      enabled: True
```

保存退出，参考 [验证可插拔功能组件的安装](../verify-components) ，通过查询 ks-installer 日志或 Pod 状态验证功能组件是否安装成功。
