---
title: "Deploy KubeSphere on existing Kubernetes cluster (Online)"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'How to deploy KubeSphere on an existing Kubernetes cluster'
---

![KubeSphere+K8s](https://pek3b.qingstor.com/kubesphere-docs/png/20191123144507.png)

[All-in-One](../all-in-one) and [Multi-Node](../multi-node) describe how to install KubeSphere on virtual machine or bare metal with provisioning Kubernetes underneath. You are also allowed to deploy KubeSphere on an existing Kubernetes cluster that is cloud-hosted or on-premises.

## Install On Kubernetes

### Prerequisites

> - `Kubernetes version`： `1.15.x, 1.16.x, 1.17.x`
> - `Helm version` >= `2.10.0`，see [Install and Configure Helm in Kubernetes](https://devopscube.com/install-configure-helm-kubernetes/);
> - An existing Storage Class in your Kubernetes clusters, use `kubectl get sc` to verify it.
> - Your cluster can connect to an external network;
> - The CSR signing feature is activated in kube-apiserver when it is started with the `--cluster-signing-cert-file` and `--cluster-signing-key-file` parameters, see [RKE installation issue](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309).

### Installation

Install KubeSphere using kubectl.

- If there are 1 Core and 2 GB RAM available in your cluster, use the command below to trigger a default minimal installation only:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```

- If there are 8 Cores and 16 GB RAM available in your cluster, use the command below to install a complete KubeSphere, i.e. with all components enabled:

Verify the real-time logs. When you see the following outputs, congratulation! You can access KubeSphere console in your browser now.

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

If you start with a default minimal installation, execute the following command to open the configmap in order to enable more pluggable components at your will. Make sure your cluster has enough CPU and memory, see [Enable Pluggable Components](../pluggable-components).

```bash
kubectl edit cm -n kubesphere-system ks-installer
```
