---
title: "Prerequisites"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere not only supports installing on virtual machine and bare metal with provisioning Kubernetes, but also supports installing on cloud-hosted and on-premises existing Kubernetes cluster as long as your Kubernetes cluster meets the prerequisites below.

> - Kubernetes Version: 1.13.x, 1.14.x, 1.15.x for KubeSPhere 2.1.0; 1.13.x, 1.14.x, 1.15.x, 1.16.x for KubeSPhere 2.1.1
> - Helm Version: `>= 2.10.0` (excluding 2.16.0), see [Install and Configure Helm in Kubernetes](https://devopscube.com/install-configure-helm-kubernetes/);
> - CPU > 1 Core, Memory > 2 G;
> - An existing Storage Class in your Kubernetes clusters.

1. Make sure your Kubernetes version is greater than 1.13.0 by run `kubectl version` in your cluster node to check. The output looks as the following:

```bash
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
```

> Note: Pay attention to `Server Version` line. If `GitVersion` is greater than `v1.13.0`, it's good. Otherwise you need to upgrade your kubernetes first. You can refer to [Upgrading kubeadm clusters from v1.12 to v1.13](https://v1-13.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-13/).

2. Make sure you've already installed `Helm`, and the version is greater than `2.10.0`. You can run `helm version` to check. The output looks like below:

```bash
$ helm version
Client: &version.Version{SemVer:"v2.13.1", GitCommit:"618447cbf203d147601b4b9bd7f8c37a5d39fbb4", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.13.1", GitCommit:"618447cbf203d147601b4b9bd7f8c37a5d39fbb4", GitTreeState:"clean"}
```

> Note: If you get `helm: command not found`, it means `Helm` is not installed yet. You can refer to [Install Helm](https://helm.sh/docs/using_helm/#from-the-binary-releases) to find out how to install `Helm`, and don't forget to run `helm init` first after installation. If you use an older version (<2.10.0), you need to  [Upgrade Helm and Tiller](https://github.com/helm/helm/blob/master/docs/install.md#upgrading-tiller).

3. Check if the available resources in your cluster meet the minimal prerequisites.

```bash
$ free -g
              total        used        free      shared  buff/cache   available
Mem:              16          4          10           0           3           2
Swap:             0           0           0
```

4. Check if there is a default Storage Class in your cluster. An existing Storage Class is the prerequisite for KubeSphere installation.

```bash
$ kubectl get sc
NAME                      PROVISIONER               AGE
glusterfs (default)               kubernetes.io/glusterfs   3d4h
```

If your Kubernetes cluster environment meets all four requirements above, then you are ready to deploy KubeSphere on your existing Kubernetes cluster.
