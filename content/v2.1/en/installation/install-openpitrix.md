---
title: "Enable Application Store"
keywords: 'kubesphere, kubernetes, docker, helm, openpitrix'
description: 'How to enable Helm-based Application Store sponsored by OpenPitrix'
---

## What is Application Store

KubeSphere is an open source and application-centric container platform, providing users with the Helm-based application store and application lifecycle management sponsored by the open source [OpenPitrix](https://github.com/openpitrix/openpitrix). Application store allows ISVs, developers and users to upload / test / review / deploy / publish / upgrade / deploy and delete apps with several clicks in one-stop shop.

Meanwhile, the store can be used to share applications such as big data, middleware, AI, etc. among different teams within workspace. Users can deploy the helm chart from the store to Kubernetes cluster with one click.

KubeSphere application store also provides nine built-in Helm charts for testing.

![App Store](https://pek3b.qingstor.com/kubesphere-docs/png/20191225205635.png)

There are three ways to deploy applications in the store since KubeSphere v2.1.0.

> - [Templates of app repository under workspace](../../quick-start/one-click-deploy): You can easily upload Helm-based templates or import third-party templates to app repository, from where users can deploy applications to their Kubernetes clusters.
> - [The global application store](../../quick-start/app-store): It is a global application store for all users. ISVs use it to submit and publish their applications once the applications get approved by app reviewers. Then any user can deploy the applications to their Kubernetes clusters. Please note KubeSphere provides several built-in applications in the global store for testing only.

## Enable Application Store before Installation

> Note: This guide is only used for installing KubeSphere on Linux machines. If you are going to install KubeSphere and app store on your own Kubernetes cluster, please see [ks-installer](https://github.com/kubesphere/ks-installer).

Before starting the installation, you need to change the value of `openpitrix_enabled` to `true` in `conf/common.yaml` as follows to enable app store, then you can go back to [All-in-One](../all-in-one) or [Multi-Node](../multi-node) guide to continue your installation.

```yaml
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
openpitrix_enabled: true
```

## Enable Application Store after Installation

If you already have a minimal KubeSphere setup, you still can enable app store by editing the ConfigMap of ks-installer using the following command.

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

Then set OpenPitrix from `False` to `True`.

```yaml
openpitrix:
      enabled: True
```

Save it and exit. App Store will be installed automatically for you. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.
