---
title: "Enable Application Store Installation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Install Helm Application Store'
---

## What is Application Store

KubeSphere is an open source and application-centric container platform, provides users with the Helm application store and application lifecycle management, which is based on OpenPitrix, the self-developed and open source framework (platform). Application store allows ISV, developers and users to upload / test / review / deploy / publish / upgrade and remove App with several clicks.

Meanwhile, the application store can be used to share applications between different teams within workspace, including big data, middleware, AI, etc. Users can share and deploy the helm chart to Kubernetes in an easy way. It can also meet different demands in diverse scenarios.

KubeSphere application store also provides 10 helm chart application for quick testing.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191225205635.png)

## Enable Application Store Before Installation

> Note: This guide is only used for Linux installer, if you are going to install KubeSphere and app store on your own Kubernetes, see [ks-installer](https://github.com/kubesphere/ks-installer).

Before execute installation, you can enable `openpitrix_enabled` in `conf/common.yaml` to allow app store installation according to the following configuration, then you can back to All-in-one or Multi-node guide to continue installation.

```bash
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
openpitrix_enabled: true
```

## Enable Application Store After Installation

Edit the ConfigMap of ks-installer using following command:

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

Then set OpenPitrix from False to True:

```bash
openpitrix:
      enabled: True
```

Save it and exit, it will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.
