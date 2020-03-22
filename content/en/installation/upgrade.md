---
title: "Overview"
keywords: "kubernetes, kubesphere, upgrade, docker, service mesh, devops, microservice"
description: "How to upgrade KubeSphere to 2.1.1"
---


KubeSphere v2.1.1 is released, we fixed the known bugs and continued to improve the user experience, and the Kubernetes support changes from v1.15 to v1.17. Please see [Release Note - v2.1.1](../../release/release-v211) for further information.

If you have installed 2.0.x or 2.1.0 (both are called old version below), we strongly recommend you to download the latest Installer and upgrade to 2.1.1. Installer supports one-click upgrade, and supports upgrading the underneath Kubernetes and Etcd to the target version. Note the Kubernetes will be upgraded to `1.16.7` by default.

<font color="red">

- Please notice that there were some [APIs deprecated since Kubernetes v1.16](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.16.md#deprecations-and-removals), which means the old apiversion will not be supported after upgrading to KubeSphere 2.1.1. It may not affect the deployed applications, but you need to change the YAML files to adapt the new apiversion. For example, if your existing applications are packaged with Helm, you may need to delete the old release and use the new Chart with apiversion updated to deploy on KubeSphere.
- For safety, considering upgrading KubeSphere and Kubernetes in testing environment and implementing rehearsal plan in advance. Make sure your applications are running successfully after upgrading, then you can upgrade production environment.
- Note, the cluster nodes will be upgraded one by one, and the application may be unavailable temporarily if it does not support HA. Please arrange a appropriate time to upgrade.

</font>

> Note: This guide is only for Linux installer, if your KubeSphere was installed on existing Kubernetes cluster, please refer to [ks-installer](https://github.com/kubesphere/ks-installer) to upgrade.

## How to Upgrade

### Step 1: Download Installer

Download the Installer `KubeSphere v2.1.1`, unpack it.

```bash
curl -L https://kubesphere.io/download/stable/v2.1.1 > installer.tar.gz && tar -zxf installer.tar.gz
```

### Step 2: Sync the Configuration

Since the there are different configuration methods between [all-in-one](../all-in-one) and [multi-node](../multi-node), please sync the configuration from old version to Installer 2.1.1 by choosing one of the upgrade methods:

- [All-in-One Upgrade](../upgrade-allinone)
- [Multi-node Upgrade](../upgrade-multi-node)
