---
title: "存储卷"
---

存储卷供用户创建的工作负载使用，是将工作负载数据持久化的一种资源对象。在 Kubephere 中创建存储卷之前必须存在相应的存储类型。KubeSphere 推荐使用动态分配方式创建存储卷, 即用户在 KubeSphere 控制台发起创建和删除存储卷请求后即可在存储服务端创建和删除存储卷，并可供 KubeSphere 工作负载使用。在 all-in-one 部署方式中，可以使用 Local 存储卷将数据持久化，无需存储服务端支持。此类型存储卷不支持动态分配方式。如果希望体验 KubeSphere 推荐的动态分配 (Dynamic Provisioning) 方式创建存储卷，请配置 GlusterFS 和 Ceph RBD 存储类型。

本节通过以下几个方面介绍如何管理存储卷：

- 如何管理存储卷
  - 创建存储卷
  - 查看存储卷
  - 使用存储卷
  - 删除存储卷
  - 附录1: Local Volume 使用方法
  - 附录2: Ceph RBD 存储卷缺少密钥无法挂载解决方案

# 如何管理存储卷

登录 KubeSphere 管理控制台，访问访问左侧菜单栏，在**资源**菜单下，点击**存储卷**按钮，进入存储卷列表页面。作为集群管理员，可以查看当前集群下所有的存储卷以及挂载情况。


- 进入存储卷列表页
    - 存储卷列表中，每行显示一个存储卷信息
    - 存储卷列表左上角可按项目显示存储卷
    - 存储卷列表右上角可以点击创建存储卷

![](/pvc-pvclist.png)

## 创建存储卷
> 注：使用 KubeSphere 创建 Local 存储类型存储卷，需预先创建 Local 类型 PV，参见 附录1

1.点击存储卷列表页的创建存储卷按钮进入创建存储卷界面, 填写存储卷基本信息，完成后点下一步：

![](/pvc-create1.png)

2.存储设置中, 选择存储卷的存储类型, 关于如何创建存储类型请参考下一节**存储类型管理**。 按需填写存储卷的容量大小, 存储卷大小和访问模式必须与存储类型和存储服务端能力相适应，访问模式通常选择为 RWO。各类型存储支持的访问模式参见 [Kubernetes官方文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)。

![](/pvc-create2.png)

3.为存储卷设置标签, 可通过标签来识别、组织和查找资源对象。

![](/pvc-create3.png)

4.存储卷创建成功

![](/pvc-pvclist.png)

## 查看存储卷

点击列表页中的存储卷, 即可查看存储卷的详细信息。

- 进入存储卷详情页
    - 存储卷详情页编辑 Yaml 文件和删除按钮分别可以编辑和删除存储卷
    - 右侧显示挂载容器组的信息

![](/pvc-detail.png)


## 使用存储卷
在创建工作负载时将用到存储卷, 以创建部署并挂载存储卷为例:

> 注：工作负载挂载 Ceph RBD 类型存储卷时需确保工作负载所在项目必须有特定的 Secret ,详情见 附录2

1.在工作负载中选择创建部署, 填写基本信息和容器组设置信息, 可参考**部署管理**部分的指南。存储设置页面可挂载已有的存储卷或创建新的存储卷, 在添加存储卷下选择第一项**存储卷**, 然后在右侧选择已经创建的存储卷:


![](/pvc-mount2.png)

2.输入存储卷在容器内的挂载路径, 完成后续步骤即可成功创建部署:

![](/pvc-mount3.png)



3.当存储卷挂载成功后, 部署正常启动, 此时存储卷挂载状态变为已挂载

![](/pvc-deploylist.png)


## 删除存储卷
> 注：使用 KubeSphere 删除 Local 存储类型存储卷，需手动回收 Local 类型 PV，参见 附录1
*  在存储卷列表页可选中存储卷，点击删除按钮删除, 删除存储卷前请确保存储卷挂载状态处于未挂载。


![](/pvc-deletepvc.png)

## 附录1

### Local Volume 使用方法

Local Volume 仅用于 all-in-one 单节点部署。


#### 使用 Local Volume 的流程

1.创建Local Volume的存储类型详细步骤

*  通过 `sc.yaml` 文件定义 Local Volume 的存储类型

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

*  执行创建命令

```
$ kubectl create -f sc.yaml
```

2.创建 Local Volume 文件夹

*  登录宿主机，创建文件夹，以文件夹 `vol-test` 为例，执行以下命令：

```
sudo mkdir -p /mnt/disks/vol-test
```

3.创建 Local PV

*  通过 `pv.yaml` 文件定义 Loval PV:

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

*  执行创建命令

```
$ kubectl create -f pv-local.yaml
```

4.执行以下命令验证创建结果

```
$ kubectl get pv
NAME         CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM        STORAGECLASS    REASON    AGE
pv-local     10Gi       RWO            Delete           Available                local                     4s
```

上述工作完成后可在 KubeSphere 控制台创建存储卷，KubeSphere 控制台创建的存储卷容量不可大于预分配 PV 容量

> 注：Local Volume 存储卷创建成功后为 `Pending` 属于正常状态，当创建工作负载调度 Pod 后存储卷状态即可变化为 Bound

#### 删除 Local Volume PV 和文件夹
1. 删除 Local Volume PV

```
$ kubectl delete pv pv-local
```

2. 删除 Local Volume 文件夹
> 注：此操作步骤会删除 `vol-test` 文件夹里内容

```
$ sudo cd /mnt/disks
$ sudo rm -rf vol-test
```

## 附录2 

### CephRBD 存储卷缺少密钥无法挂载解决方案

Ceph RBD 存储卷操作过程中, 如果遇到 Ceph RBD 存储卷挂载至工作负载时因缺少密钥无法挂载, 可参考如下解决方案:

1.假设工作负载所在项目为 ns1, Ceph RBD 存储卷关联的存储类型为 rbd。

2.通过 Kubectl 命令行工具向 kubernetes 发送以下命令, 查询要创建 Secret 名称:

```
$ kubectl get sc rbd | grep userSecretName
userSecretName: ceph-rbd-user-secret
```

则应创建的 Secret 名称为 `ceph-rbd-user-secret`。

3.通过 ceph 命令行工具向 Ceph 集群发送以下命令，得到密钥:

```
$ ceph auth get-key client.admin
AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==
```
则密钥为 `AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==`。

4.通过 Kubectl 命令行工具向 kubernetes 发送以下命令,创建 Secret:


```
kubectl create secret generic ceph-rbd-user-secret --type="kubernetes.io/rbd" --from-literal=key='AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==' --namespace=ns1
```

> 其中, 以下的三个字段根据不同环境的实际状况会有所不同, 应根据您的环境替换成对应的字段:
        - ceph-rbd-user-secret
        - AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==
        - ns1

