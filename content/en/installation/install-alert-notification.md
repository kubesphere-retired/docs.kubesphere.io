---
title: "Enable Alerting and Notification System"
keywords: 'kubesphere, kubernetes, docker, alert, notification, alertmanager'
description: 'Enable Alerting and Notification System Installation'
---

## What is KubeSphere Alerting and Notification System

KubeSphere alert and notification system provides flexible alerting policies and rules, including the following features:

> - Support multi-tenant and multi-dimentional monitoring metrics as the alerting threshold. It allows cluster admin to set alerts for node. Tenants can also set alerts for workloads under project.
> - Flexible alerting policies: users can customize the alerting policy which includes multiple rules.
> - Full angle alerting metrics: provide the metrics of infrastructure and applications, including CPU, memory, disk and network.
> - Flexible alerting and notification rules: support the monitoring duration, period, alerting priority. Users can customize the period time of resending alerts. Now only email delivery is supported in v2.1 (More channels will be supported in v3.0).

## Enable Alerting and Notification before Installation

<font color=red>KubeSphere alerting and notification system requires at least 0.08 Core of CPU request and 80M of memory request. Please make sure your cluster has enough resource.</font>

Before execute installation, you can set `notification_enabled` and `alerting_enabled` to `true` to allow both two components installation according to the following configuration, then you can back to [All-in-One](../all-in-one) or [Multi-Node](../multi-node) guide to continue installation.

```yaml
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
···
notification_enabled: true
alerting_enabled: true
```

## Enable Alerting and Notification after Installation

If you already have set up KubeSphere without enabling alerting and notification system, you still can edit the ConfigMap of ks-installer using the following command.

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

Then set notification and alerting from `False` to `True`.

```yaml
notification:
  enabled: True

alerting:
  enabled: True
```

Save it and exit, it will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.
