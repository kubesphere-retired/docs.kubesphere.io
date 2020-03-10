---
title: "Upgrade All-in-One"
keywords: "kubernetes, docker, kubesphere, upgrade, devops, service mesh, microservice"
description: "Upgrade KubeSphere to 2.1.1 on single node"
---

## Prerequisite

You need to download Installer 2.1.1, please refer to [Upgrade Overview](../upgrade).

## Step 1: Sync Configuration

Installer will read the files under `conf` directory when upgrade. Thus you need to sync the changes from the `conf` directory from the old version to 2.1.1 before upgrading, including two scenarios as follows.

### Upgrade from 2.0.x

1. You need to determine if the parameters configuration has been changed in `conf/vars.yaml`. If any parameters were changed, then sync them to 2.1.1 `conf` directory accordingly. In particular, the storage class needs to be consistent with the old version.

> Note: The configuration file is `vars.yaml` in 2.0.x. But it changes to `common.yaml` since 2.1.0, and separates the cloud provider related configurations into several files.

2. KubeSphere has decoupled some components since 2.1.0 and supports installing optional components according to your needs. The Installer will only upgrade the minimal component by default in `common.yaml`, you need to change the enabled components settings to `true` in `common.yaml`, then execute the upgrade script.

### Upgrade from 2.1.0

Same as above, please sync the configuration changes from 2.1.0 `conf` directory to 2.1.1. And the storage class needs to be consistent with 2.1.0. Please notice that do not copy and overlay the whole files from 2.1.0 to 2.1.1. It may cause some unexpected errors. For example, the Kubernetes version defaults to `1.16.7` instead of `1.15.4` in 2.1.1.

<font color="red">Please notice that if you have enabled any components by editing the ks-installer ConfigMap in 2.1.0, please sync from 2.1.0 to 2.1.1 by manually enabling these components in 2.1.1 `common.yaml`. The upgrade script will read from `common.yaml`. </font>

## Step 2: Start Upgrade

When you are done, refer to the following steps to upgrade:

1. Enter `scripts` directory, execute the `upgrade` script using root user.

```bash
./upgrade.sh
```

2. Make sure anything looks correctly, type `yes` to start upgrade. Please wait patiently. If you see "Successful" returned after completed, it means the installation is successful. You can verify the installation logs using the command as follows.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath={.items[0].metadata.name}) -f
```

Finally, use your account and password to log in KubeSphere, click `About` on the top of right to check the version and verify if upgrade successfully.

If you have further questions please do not hesitate to raise issues on [GitHub](https://github.com/kubesphere/kubesphere/issues).
