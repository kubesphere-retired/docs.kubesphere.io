---
title: "存储常见问题" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

### 物理环境灾难恢复相关问题

若物理环境的集群中某台节点意外关机或故障，如何将该节点上运行的有状态应用快速调度到其它节点上同时保证数据安全？

答：以 Ceph RBD 和物理 NeonSAN 作为集群存储为例，分别说明其灾难恢复的方法。

#### Ceph RBD

若集群的持久化存储服务端配置的是 Ceph RBD，当其中某台节点意外关机或故障时，可参考如下步骤：

1、查看集群节点的状态，定位故障或关闭的主机，通常该节点的状态 (STATUS) 将显示 NotReady。


```shell
$ kubectl get node -o wide
NAME STATUS ROLES AGE VERSION INTERNAL-IP EXTERNAL-IP OS-IMAGE
i-njy2abnw NotReady <none> 2d7h v1.13.5 172.17.0.8 <none> Ubuntu 16.04.3 LTS 4.4.0-116-generic docker://18.6.2
···
```

2、查看集群中 Pod 的状态，集群节点的状态为 NotReady 后，通常该节点上的 Pod 状态是 Terminating，若通过 kubectl 命令确定该 Pod 正是运行在故障节点上，则需要强行删除 Terminating 的 Pod：

```shell
$ kubectl delete pod pod_name --grace-period=0 --force
```

3、等待一段时间（约几分钟），当旧 Pod 被删除后，RBD 的 PVC 将会自动挂载至 Kubernetes 新创建的 Pod 中，新创建的 Pod 也将会被自动调度到新节点上运行，此时可通过 kubectl get 或 describe 验证 Pod 的运行恢复和挂盘情况。

#### NeonSAN

若集群的持久化存储服务端配置的是 NeonSAN，当其中某台节点意外关机或故障时，可参考如下步骤：

1、通过命令 `kubectl get node -o wide` 查看集群节点的状态，定位故障或关闭的主机，通常该节点的状态 (STATUS) 将显示 NotReady。

2、查看集群中 Pod 的状态，集群节点的状态为 NotReady 后，通常该节点上的 Pod 状态是 Terminating，若通过 kubectl 命令确定该 Pod 正是运行在故障节点上，则需要强行删除 Terminating 的 Pod：

```shell
$ kubectl delete pod pod_name --grace-period=0 --force
```

3、找到 Terminating 的 Pod 挂载的 PVC，假如我们发现 redis 的 Pod 状态为 Terminating，先找到该 PVC 的 VOLUME 名称 (以下返回的是 `pvc-1023666b779211e9`)：

```shell
$ kubectl get pvc --all-namespaces | grep redis
kubesphere-system  redis-pvc   Bound    pvc-1023666b779211e9   100Gi      RWO    csi-qingcloud   26h
```

4、通过 VOLUME 名称找到对应的 volumeattachment，可通过 -o yaml 命令重定向到文件 (以下返回的是 `csi-90ef9b5f64f8156db2a2230f2c634e3afbd2abd5fd9c8238a0363a9b374e21d9`)：

```
$ kubectl get volumeattachment -o yaml | grep pvc-1023666b779211e9 -B 14
- apiVersion: storage.k8s.io/v1
  kind: VolumeAttachment
  ···
    - external-attacher/csi-qingcloud
    name: csi-90ef9b5f64f8156db2a2230f2c634e3afbd2abd5fd9c8238a0363a9b374e21d9
    ···
    source:
      persistentVolumeName: pvc-1023666b779211e9
```

5、删除对应的 volumeattachment：

```shell
$ kubectl delete volumeattachment csi-90ef9b5f64f8156db2a2230f2c634e3afbd2abd5fd9c8238a0363a9b374e21d9
```

6、等待一段时间，当旧 Pod 被删除后，NeonSAN 的 PVC 将会自动挂载至 Kubernetes 新创建的 Pod 中，新创建的 Pod 也将会被自动调度到新节点上运行，此时可通过 kubectl get 或 describe 验证 Pod 的运行恢复和挂盘情况。