---
title: "Enable Alerting and Notification System Installation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Enable Alerting and Notification System Installation'
---

## What is KubeSphere Alerting and Notification System

KubeSphere alert and notification system provides flexible alerting policies and rules, including following features:

> - Support multi-tenant and multi-dimentional monitoring metrics as the alerting threshold, allows cluster admin to set alerts for node, tenants can also set alerts for workloads under project.
> - Flexible alerting policies: users can customize the alerting policy which includes multiple rules.
> - Abundant alerting metrics: provide **node** level and **workload** level metrics, including CPU, memory, disk and network.
> - Flexible alerting and notification rules: support the monitoring duration, period, alerting priority, users can customize the duration of the duplicate alerting, support email notification in v2.1 (More channels will be supported in v3.0)


## Enable Alerting and Notification Before Installation

<font color=red>KubeSphere alerting and notification system requires 0.08 Core (CPU request) and 80 M (Memory request) at least, make sure your cluster has enough resource.</font>

Before execute installation, you can set `notification_enabled` and `alerting_enabled` to `true` to allow both two components installation according to the following configuration, then you can back to All-in-one or Multi-node guide to continue installation.

```bash
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
···
notification_enabled: true
alerting_enabled: true
```

## Enable Alerting and Notification After Installation

Edit the ConfigMap of ks-installer using following command:

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

Then set notification and alerting from False to True:

```bash
notification:
  enabled: True

alerting:
  enabled: True
```

Save it and exit, it will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.
