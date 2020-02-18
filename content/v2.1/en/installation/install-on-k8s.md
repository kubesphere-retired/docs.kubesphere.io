---
title: "Deploy KubeSphere on existing Kubernetes cluster (Online)"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'How to deploy KubeSphere on an existing Kubernetes cluster'
---

![KubeSphere+K8s](https://pek3b.qingstor.com/kubesphere-docs/png/20191123144507.png)

[All-in-One](../all-in-one) and [Multi-Node](../multi-node) describe how to install KubeSphere on virtual machine or bare metal with provisioning Kubernetes underneath. You are also allowed to deploy KubeSphere on an existing Kubernetes cluster that is cloud-hosted or on-premises.

> Attention: The following instructions are only for a default minimal installation. KubeSphere has decoupled some core components since v2.1.0. For more pluggable components installation, see the section `Enable Pluggable Components` below.

## Install On Kubernetes

### Prerequisites

> - `Kubernetes version`： `1.13.0 ≤ K8s version < 1.16` for KubeSphere 2.1.0; `1.13.0 ≤ K8s version < 1.17` for KubeSphere 2.1.1
> - `Helm version` >= `2.10.0`，see [Install and Configure Helm in Kubernetes](https://devopscube.com/install-configure-helm-kubernetes/);
> - CPU > 1 Core，Memory > 2 G;
> - An existing Storage Class in your Kubernetes clusters, use `kubectl get sc` to verify it.

### Minimal Installation

Install KubeSphere using kubectl. The command below is only to trigger a default minimal installation:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```

Verify the real-time logs. When you see the following outputs, congratulation! you can access KubeSphere console in your browser now.

```bash
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f

#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
Console: http://10.128.0.34:30880
Account: admin
Password: P@88w0rd

NOTE：Please modify the default password after login.
#####################################################
```

## Enable Pluggable Components

The installation above is only used for a default minimal installation. Execute the following command to open the configmap in order to enable more pluggable components. Make sure your cluster has enough CPU and memory.

<font color=red>If you want to enable DevOps or etcd monitoring, please create CA and etcd certificates first. See [ks-installer](https://github.com/kubesphere/ks-installer/blob/master/README.md) for complete guide.</font>

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

## Configuration Table

The pluggable components are optional and you can install them according to your demands. We highly recommend you to install these components if you have enough resource in your machines. Please refer to [Parameter Configuration](https://github.com/kubesphere/ks-installer/blob/master/README.md).
