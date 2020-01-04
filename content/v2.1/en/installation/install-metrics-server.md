---
title: "Install metrics-server to Enable HPA"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Install metrics-server to enable HPA'
---

## Introduction of HPA

KubeSphere supports setting [Honrizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) for [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)  based on observed CPU utilization (or, with custom metrics support, on some other application-provided metrics). When the request and traffic surges, the Pod number can be autoscaled in Kubernetes cluster, which can improve the stability of the system. You're supposed to install metrics-server to Enable HPA.


## Enable HPA Before Installation

<font color=red>Metrics-server requires 5 m (CPU request) and 44.35 M (Memory request) at least, make sure your cluster has enough resource.</font>

Before execute installation, you can set `metrics_server_enabled` to `true`, then you can back to All-in-one or Multi-node guide to continue installation.

```bash
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
···
metrics_server_enabled: true
```

## Enable Metrics-server After Installation

Edit the ConfigMap of ks-installer using following command:

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

Then set metrics-server from False to True:

```bash
···
metrics-server:
     enabled: True
```

Save it and exit, it will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.
