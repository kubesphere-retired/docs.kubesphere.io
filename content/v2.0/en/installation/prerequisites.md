---
title: "Prerequisites" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

In addition to supporting deploy on VM and BM, KubeSphere also supports installing on cloud-hosted and on-premises Kubernetes clusters, make sure your Kubernetes cluster meets the prerequisites below.


## Prerequisites

> - Kubernetes Version: from `1.13.0` to `1.15.x`
> - Helm Version: `>= 2.10.0`
> - Available Memory: `>= 10 G`
> - Already have Storage Class (Recommended)


1. Make sure your Kubernetes version is greater than from `1.13.0` to `1.15.x`. KubeSphere relies on new features after `Kubernetes 1.13.0`. Run `kubectl version` in your cluster node to confirm. The output looks like the following:

```bash
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
```

**Note:**

Notice the `Server Version` line. if `GitVersion` is greater than `v1.13.0`, this Kubernetes version is fine. Otherwise you need to upgrade your kubernetes. Please refer to [Upgrading kubeadm clusters from v1.12 to v1.13](https://v1-13.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-13/).

2. Make sure you've already installed `Helm`, and it's version is greater than `2.10.0`. You can run `helm version` to check, the output looks like below:

```bash
root@kubernetes:~# helm version
Client: &version.Version{SemVer:"v2.13.1", GitCommit:"618447cbf203d147601b4b9bd7f8c37a5d39fbb4", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.13.1", GitCommit:"618447cbf203d147601b4b9bd7f8c37a5d39fbb4", GitTreeState:"clean"}
```

**Note**:

> - If you get `helm: command not found`, it means `Helm` is not installed yet. You can check this guide [Install Helm](https://helm.sh/docs/using_helm/#from-the-binary-releases) to find out how to install `Helm`. Don't forget to run `helm init` after installation.
> - If you use an older version (<2.10.0) of `helm`, you need to upgrade it first, see [Upgrading Tiller](https://github.com/helm/helm/blob/master/docs/install.md#upgrading-tiller)


3. Make sure the **available storage is more than** `10Gi`. If there is just one node in your cluster, you can run `free -g` to review available resources.

```bash
$ free -g
              total        used        free      shared  buff/cache   available
Mem:              16          4          10           0           3           2
Swap:             0           0           0
```

4. (Optional) It is highly recommended you use persistent storage service when installing KubeSphere on Kubernetes. Excute `kubectl get sc` to see whether you have set `storageclass` as default.

```bash
root@kubernetes:~$ kubectl get sc
NAME                      PROVISIONER               AGE
ceph                      kubernetes.io/rbd         3d4h
csi-qingcloud (default)   disk.csi.qingcloud.com    54d
glusterfs                 kubernetes.io/glusterfs   3d4h
```

> Tip: If you've not set up persistent storage server, the installation will use `hotpath` by default. However, Pod drift may bring other problems. **It is recommended to configurate StrorageClass for persistent storage under formal installation**.

If your Kubernetes cluster environment meets all above requirements, you are good to go.

