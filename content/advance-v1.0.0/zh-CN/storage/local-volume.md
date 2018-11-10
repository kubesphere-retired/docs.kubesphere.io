---
title: "Local Volume 使用方法"
---

[Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) 表示挂载的本地存储设备，如磁盘、分区或目录，而 Local Volume 只能用作静态创建的 PersistentVolume，与 HostPath 卷相比，Local Volume 可以以持久的方式使用，而无需手动将 pod 调度到节点上，因为系统会通过查看 PersistentVolume 上的节点关联性来了解卷的节点约束。

## 创建 Local Volume

Local Volume 仅用于 [all-in-one](../../installation/all-in-one) 单节点部署，也是单节点部署的默认存储类型，Installer 会预先创建 8 个可用的 10G PV 供使用，若存储空间不足时则需要参考如下步骤手动创建。

1、若 Local Volume 还不是默认的存储类型，可参考创建 Local Volume 的存储类型详细步骤如下：


- 1.1. 通过 `sc.yaml` 文件定义 Local Volume 的存储类型：

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

- 1.2. 执行创建命令：

```
$ kubectl create -f sc.yaml
```

2、创建 Local Volume 文件夹：


*  登录宿主机，创建文件夹，以文件夹 `vol-test` 为例，执行以下命令：

```
sudo mkdir -p /mnt/disks/vol-test
```

3、创建 Local PV：


- 3.1. 通过 `pv.yaml` 文件定义 Loval PV：

```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-local
spec:
  capacity:
    storage: 10Gi 
  # volumeMode field requires BlockVolume Alpha feature gate to be enabled.
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local
  local:
    path: /mnt/disks/vol-test
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: node-role.kubernetes.io/master
          operator: Exists
```

- 3.2. 执行创建命令：

```
$ kubectl create -f pv.yaml
```

4、执行以下命令验证创建结果：

```
$ kubectl get pv
NAME         CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM        STORAGECLASS    REASON    AGE
pv-local     10Gi       RWO            Delete           Available                local                     4s
```

上述工作完成后可在 KubeSphere 控制台创建存储卷，KubeSphere 控制台创建的存储卷容量不可大于预分配 PV 容量。

> 注：Local Volume 存储卷创建成功后为 `Pending` 属于正常状态，当创建工作负载调度 Pod 后存储卷状态即可变化为 Bound。

## 删除 Local Volume PV 和文件夹 

Local Volume 手动创建的 PersistentVolume 也需要手动清理和删除。

1. 删除 Local Volume PV：

```
$ kubectl delete pv pv-local
```

2. 删除 Local Volume 文件夹，此操作也会删除 `vol-test` 文件夹里内容：

```
$ sudo cd /mnt/disks
$ sudo rm -rf vol-test
```