---
title: "Enable Metrics-server for HPA"
keywords: 'kubesphere, kubernetes, HPA, metrics-server'
description: 'Install metrics-server to enable HPA'
---

## Introduction to HPA

KubeSphere supports setting [Honrizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) for [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)  based on observed CPU utilization (or, with custom metrics support, on some other application-provided metrics). When the request and traffic surges, the Pod number can be autoscaled in Kubernetes cluster, which can improve the stability of the system. You are supposed to install metrics-server to Enable HPA.

## Enable HPA before Installation

<font color=red>Metrics-server requires at least 5m of CPU request and 44.35M of memory request. Please make sure your cluster has enough resource.</font>

Before executing installation, you can set `metrics_server_enabled` to `true`, then you can back to [All-in-One](../all-in-one) or [Multi-Node](../multi-node) guide to continue installation.

```yaml
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
···
metrics_server_enabled: true
```

## Enable Metrics-server after Installation

If you already have set up KubeSphere without enabling metrics server, you still can edit the ConfigMap of ks-installer using the following command.

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

Then set metrics-server from `False` to `True`.

```yaml
···
metrics-server:
     enabled: True
```

Save it and exit, it will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.
