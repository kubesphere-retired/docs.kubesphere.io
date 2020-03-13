---
title: "Enable Service Mesh"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Enable KubeSphere Service Mesh Installation'
---

## What is KubeSphere Service Mesh

KubeSphere service mesh, based on [Istio](https://istio.io/), visualizes the microservice governance and traffic management, provides **circuit break, blue-green Deployment, canary release, traffic mirror, tracing, observability and traffic control**. It enables developers get started with service mesh without modifying source code, reduce the learning curve of Istio. All features of KubeSphere service mesh are designed from business perspective.

![Traffic Management](https://pek3b.qingstor.com/kubesphere-docs/png/20191228214539.png)

![Tracing](https://pek3b.qingstor.com/kubesphere-docs/png/20191228214807.png)

## Enable Service Mesh before Installation

<font color=red>KubeSphere service mesh system requires at least 2 Core of CPU request and 3.6G of memory request. Please make sure your cluster has enough resource.</font>

> Note:
>
> - Currently, the tracing (Jaeger) in the KubeSphere service mesh depends on the KubeSphere logging system. Before installing service mesh, please install the [KubeSphere logging system](../install-logging) first.

Before execute installation, you can set `servicemesh_enabled` to `true` to allow Istio and Jaeger installation according to the following configuration, then you can back to [All-in-One](../all-in-one) or [Multi-Node](../multi-node) to continue installation.

```yaml
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
···
servicemesh_enabled: true
```

## Enable Application Store after Installation

If you already have set up KubeSphere without enabling service mesh, you still can edit the ConfigMap of ks-installer using the following command.

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

Then set servicemesh from `False` to `True`.

```yaml
servicemesh:
    enabled: True
```

Save it and exit, it will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.
