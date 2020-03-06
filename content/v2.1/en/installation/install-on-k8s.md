---
title: "Deploy KubeSphere on Existing Kubernetes Cluster"
keywords: "kubesphere, kubernetes, docker, installation"
description: "How to deploy KubeSphere on an existing Kubernetes cluster"
---

![KubeSphere+K8s](https://pek3b.qingstor.com/kubesphere-docs/png/20191123144507.png)

[All-in-One](../all-in-one) and [Multi-Node](../multi-node) describe how to install KubeSphere on virtual machine or bare metal with provisioning Kubernetes underneath. You are also allowed to deploy KubeSphere on an existing Kubernetes cluster that is cloud-hosted or on-premises. This document will show you how to deploy KubeSphere on a Kubernetes with internet access. With regard to disconnected Kubernetes cluster, please refer to [Deploy KubeSphere on Air Gapped Kubernetes Cluster](../install-on-k8s-airgapped).

> Note: first of all, please read the [prerequisites](../prerequisites).

## Deploy KubeSphere

Install KubeSphere using kubectl.

- If there are 1 Core and 2 GB RAM available in your cluster, use the command below to trigger a default minimal installation only:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```

- If there are 8 Cores and 16 GB RAM available in your cluster, use the command below to install a complete KubeSphere, i.e. with all components enabled:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-complete-setup.yaml
```

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

If you start with a default minimal installation, execute the following command to open the configmap in order to enable more pluggable components at your will. Make sure your cluster has enough CPU and memory. Please see [Enable Pluggable Components](../pluggable-components) for more information.

```bash
kubectl edit cm -n kubesphere-system ks-installer
```
