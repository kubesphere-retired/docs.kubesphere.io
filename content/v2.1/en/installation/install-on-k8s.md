---
title: "Install on existing K8s (Online)"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191123144507.png)

Not only support installing on virtual machine and bare metal, KubeSphere also supports installing on cloud-hosted and on-premises Kubernetes cluster.

> Attention: Following section is only used for minimal installation by default, KubeSphere has decoupled some core components in v2.1.0, for more pluggable components installation, see `Enable Pluggable Components` below.

## Install On Kubernetes

### Prerequisites

> - `Kubernetes version`： `1.13.0 ≤ K8s version < 1.16`;
> - `Helm version` >= `2.10.0`，see [Install and Configure Helm in Kubernetes](https://devopscube.com/install-configure-helm-kubernetes/);
> - CPU > 1 Core，Memory > 2 G;
> - An existing Storage Class in your Kubernetes clusters, use `kubectl get sc` to verify it.

### Minimal Installation

Install KubeSphere using kubectl, this command is only trigger the minimal installation by default:

```yaml
$ kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```

Verify the real-time logs, when you see the following outputs, congratulation! You can access KubeSphere console in your browser.

```bash
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f


#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
Console: http://10.128.0.34:30880
Account: admin
Password: P@88w0rd
NOTES：
···
#####################################################
```

## Enable Pluggable Components

The above installation is only used for minimal installation by default, execute following command to enable more pluggable components installation, make sure your cluster has enough CPU and memory in advance.

<font color=red>For enabling DevOps and etcd monitoring installation, you have to create CA and etcd certificates in advance, see [ks-installer](https://github.com/kubesphere/ks-installer/blob/master/README.md) for complete guide.</font>

```
$ kubectl edit cm -n kubesphere-system ks-installer
```


## Configuration Table

Other components are optional and you can install them according to your demands, it's highly recommend you to install these components if you have resource in your machine, please refer to [Parameter Configuration](https://github.com/kubesphere/ks-installer/blob/master/README.md).
