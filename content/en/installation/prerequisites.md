---
title: "Prerequisites"
keywords: "kubesphere, kubernetes, docker, installation"
description: "The prerequisites of installing KubeSphere on existing Kubernetes"
---

KubeSphere not only supports installing on virtual machine and bare metal with provisioning Kubernetes, but also supports installing on cloud-hosted and on-premises existing Kubernetes cluster as long as your Kubernetes cluster meets the prerequisites below.

- `Kubernetes version`： `1.15.x, 1.16.x, 1.17.x`
- `Helm version` >= `2.10.0` and < `3.0`，see [Install and Configure Helm in Kubernetes](https://devopscube.com/install-configure-helm-kubernetes/); KubeSphere 3.0 will support Helm 3.0.
- A default Storage Class in your Kubernetes cluster is configured; use `kubectl get sc` to verify it.
- Available resource CPU >= 1 Core and memory >= 2G
- The CSR signing feature is activated in kube-apiserver when it is started with the `--cluster-signing-cert-file` and `--cluster-signing-key-file` parameters, see [RKE installation issue](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309).

## Pre Checks

1. Make sure your Kubernetes version is compatible by running `kubectl version` in your cluster node. The output looks as the following:

```bash
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"15", GitVersion:"v1.15.1", GitCommit:"4485c6f18cee9a5d3c3b4e523bd27972b1b53892", GitTreeState:"clean", BuildDate:"2019-07-18T09:09:21Z", GoVersion:"go1.12.5", Compiler:"gc", Platform:"linux/amd64"}
```

> Note: Pay attention to `Server Version` line. If `GitVersion` shows an older one, you need to upgrade the kubernetes first. Please refer to [Upgrading kubeadm clusters from v1.14 to v1.15](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/).

2. Make sure you have installed `Helm`, and the version is >= `2.10.0` and < `3.0`. You can run `helm version` to check. The output looks like below.

```bash
$ helm version
Client: &version.Version{SemVer:"v2.13.1", GitCommit:"618447cbf203d147601b4b9bd7f8c37a5d39fbb4", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.13.1", GitCommit:"618447cbf203d147601b4b9bd7f8c37a5d39fbb4", GitTreeState:"clean"}
```

> Note: If you get `helm: command not found`, it means `Helm` is not installed yet. You can refer to the [guide](https://helm.sh/docs/using_helm/#from-the-binary-releases) to find out how to install it, and remember to run `helm init` first after installation. If you use an older version (<2.10.0), you need to  [Upgrade Helm and Tiller](https://github.com/helm/helm/blob/master/docs/install.md#upgrading-tiller).

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
