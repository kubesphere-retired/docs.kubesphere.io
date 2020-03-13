---
title: "前提条件"
keywords: 'kubesphere, kubernetes, docker, helm, jenkins, istio, prometheus'
description: '在 Kubernetes 安装 KubeSphere 的前提条件'
---

KubeSphere 支持离线和在线的方式部署至现有的 Kubernetes 集群，部署之前请确保您的 Kubernetes 环境满足以下 4 个前提条件：


> - `Kubernetes` 版本： `1.15.x ≤ K8s version ≤ 1.17.x`；
> - `Helm`版本： `2.10.0 ≤ Helm Version ＜ 3.0.0`（不支持 helm 2.16.0 [#6894](https://github.com/helm/helm/issues/6894)），且已安装了 Tiller，参考 [如何安装与配置 Helm](https://devopscube.com/install-configure-helm-kubernetes/) （预计 3.0 支持 Helm v3）；
> - 集群已有默认的存储类型（StorageClass），若还没有准备存储请参考 [安装 OpenEBS 创建 LocalPV 存储类型](../../appendix/install-openebs) 用作开发测试环境。
> - 集群能够访问外网，若无外网请参考 [在 Kubernetes 离线安装 KubeSphere](https://kubesphere.com.cn/docs/v2.1/en/installation/install-on-k8s-airgapped/)。
- CSR signing 在 kube-apiserver 被开启，参考 [RKE 安装 KubeSphere Issue](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309)。

## 验证环境

1. 确认现有的 `Kubernetes` 版本满足上述的前提条件，可以在执行 `kubectl version` 来确认 :

```bash
$ kubectl version | grep Server
Server Version: version.Info{Major:"1", Minor:"13", GitVersion:"v1.13.5", GitCommit:"2166946f41b36dea2c4626f90a77706f426cdea2", GitTreeState:"clean", BuildDate:"2019-03-25T15:19:22Z", GoVersion:"go1.11.5", Compiler:"gc", Platform:"linux/amd64"}
```

> 说明：注意输出结果中的 `Server Version` 这行，如果显示 `GitVersion` 大于 `v1.13.0`，Kubernetes 的版本是可以安装的。如果低于 `v1.13.0` ，可以查看 [Upgrading kubeadm clusters from v1.12 to v1.13](https://v1-13.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-13/) 先升级下 K8s 版本。

2. 确认已安装 `Helm`，并且 `Helm` 的版本至少为 `2.10.0`。在终端执行 `helm version`，得到类似下面的输出：

```bash
$ helm version
Client: &version.Version{SemVer:"v2.13.1", GitCommit:"618447cbf203d147601b4b9bd7f8c37a5d39fbb4", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.13.1", GitCommit:"618447cbf203d147601b4b9bd7f8c37a5d39fbb4", GitTreeState:"clean"}
```

> 说明：
> - 如果提示 `helm: command not found`, 表示还未安装 `Helm`。参考这篇 [Install Helm](https://helm.sh/docs/using_helm/#from-the-binary-releases) 安装 `Helm`, 安装完成后执行  `helm init`；
> - 如果 `helm` 的版本比较老 (<2.10.0), 需要首先升级，参考 [Upgrading Tiller](https://github.com/helm/helm/blob/master/docs/install.md#upgrading-tiller) 升级。

3. 集群现有的可用内存至少在 `2G` 以上，那么执行 `free -g` 可以看下可用资源：

```bash
root@kubernetes:~# free -g
              total        used        free      shared  buff/cache   available
Mem:              16          4          10           0           3           2
Swap:             0           0           0
```

4. 集群已有存储类型（StorageClass），执行 `kubectl get sc` 看下当前是否设置了默认的 `storageclass`。

```bash
root@kubernetes:~$ kubectl get sc
NAME                      PROVISIONER               AGE
ceph                      kubernetes.io/rbd         3d4h
csi-qingcloud (default)   disk.csi.qingcloud.com    54d
glusterfs                 kubernetes.io/glusterfs   3d4h
```

> 提示：若集群还没有准备存储请参考 [安装 OpenEBS 创建 LocalPV 存储类型](../../appendix/install-openebs) 用作开发测试环境，生产环境请确保集群配置了稳定的持久化存储。

如果你的 Kubernetes 环境满足以上的要求，那么可以接着执行安装的步骤了。
