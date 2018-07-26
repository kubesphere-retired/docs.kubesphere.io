---
title: "存储卷"
---

## 简介

存储卷供用户创建的工作负载使用，是将工作负载数据持久化的一种资源对象。在Kubesphere中创建存储卷之前必须创建相应存储类型。

Kubesphere推荐使用动态分配方式创建存储卷。即用户在Kubesphere Dashboard发起创建和删除存储卷请求后即可在存储服务端创建和删除存储卷，并可供Kubesphere工作负载使用。

在Allinone部署方式中，可以使用Local存储卷将数据持久化，无需存储服务端支持。此类型存储卷不支持动态分配方式。如果希望体验KubeSphere推荐的动态分配(Dynamic Provisioning)方式创建存储卷，请配置GlusterFS和Ceph RBD存储类型。

## 查看存储卷

- 进入存储卷列表页
     - 存储卷列表中，每行显示一个存储卷信息
        - 选中方框列，可选中存储卷并删除
        - 名称列，显示存储卷名称，存储卷名称下方显示存储类型名称
        - 状态列，显示存储卷是否已在存储服务端创建成功，成功为Bound
        - 容量列，显示存储卷的容量
        - 访问模式列，显示存储卷的访问模式(access mode)，模式有RWO（单节点读写）,RWX（多节点读写）,ROX（多节点只读）
        - 挂载状态列，显示存储卷是否正在被容器组挂载并使用
        - 项目列，显示存储卷所在的项目
        - 创建时间，显示存储卷创建的时间
        - 创建者，显示创建存储卷的用户名称
    - 存储卷列表左上角可按项目显示存储卷
    - 存储卷列表右上角可以点击创建存储卷

![](/pvc-jumptopvclist.png)

   

![](/pvc-pvclist.png)

- 进入存储卷详情页
    - 存储卷详情页编辑Yaml文件和删除按钮分别可以编辑和删除存储卷
    - 右侧有挂载容器组的信息

![](/pvc-detail.png)

## 创建存储卷
> - 注：使用Kubesphere创建Local存储类型存储卷，需预先创建Local类型PV，参见附录1

- 点击存储卷列表页的创建存储卷按钮进入创建存储卷界面

![](/pvc-create1.png)

**存储卷大小和访问模式必须与存储类型和存储服务端能力相适应，访问模式通常选择为RWO。各类型存储支持的访问模式参见[Kubernetes官方文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)**

![](/pvc-create2.png)

![](/pvc-create3.png)

- 存储卷创建成功

![](/pvc-pvclist.png)


## 使用存储卷
- 以创建部署挂载存储卷为例
- 注：工作负载挂载Ceph RBD类型存储卷时需确保工作负载所在项目必须有特定的Secret,详情见附录2

- 在创建部署至存储设置时可挂载已有的存储卷

![](/pvc-mount1.png)

![](/pvc-mount2.png)

![](/pvc-mount3.png)

- 挂载成功后

> 部署正常启动

![](/pvc-deploylist.png)

> 存储卷挂载状态变为已挂载

![](/pvc-listmounted.png)

> 存储卷详情页显示挂载此存储卷的容器组列表

![](/pvc-detail.png)

## 删除存储卷
> - 注：使用Kubesphere删除Local存储类型存储卷，需手动回收Local类型PV，参见附录1
- 在存储卷列表页可选中存储卷，点击删除按钮删除。 
删除存储卷前请确保存储卷挂载状态处于未挂载。

![](/pvc-deletepvc.png)

## 附录1

**Local Volume使用方法**

> Local volume仅用于All-in-one单节点部署。


### 使用Local volume的总体流程

0.创建Local volume的存储类型，详细步骤见本小节

1.预先在宿主机创建文件夹，详细步骤见本小节

2.创建Local volume PV，详细步骤见本小节

3.通过Kubesphere创建Local存储卷，详细步骤见创建存储卷小节

4.通过Kubesphere使用Local存储卷，详细步骤见使用存储卷小节

5.通过Kubesphere删除Local存储卷，详细步骤见删除存储卷小节

6.删除Local volume PV，详细步骤见本小节

7.在宿主机删除Local volume PV使用文件夹，详细步骤见本小节

### 创建Local volume的存储类型详细步骤
1.sc.yaml文件定义

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

2.执行创建命令

```
$ kubectl create -f sc.yaml
```

### 创建Local volume文件夹和PV详细步骤

1.创建Local Volume文件夹

  - 登录宿主机，创建文件夹，以文件夹vol-test为例，执行以下命令：

```
sudo mkdir -p /mnt/disks/vol-test
```

2.创建Local PV

  - pv.yaml文件定义

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

  - 执行创建命令

```
$ kubectl create -f pv-local.yaml
```

  - 执行以下命令验证创建结果

```
$ kubectl get pv
NAME         CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM        STORAGECLASS    REASON    AGE
pv-local     10Gi       RWO            Delete           Available                local                     4s
```

**上述工作完成后可在KubeSphere Dashboard创建存储卷，Kubesphere Dashboard创建的存储卷容量不可大于预分配PV容量**

> 注：Local volume存储卷创建成功后为Pending属于正常状态，当创建工作负载调度Pod后存储卷状态即可变化为Bound

### 删除Local volumePV和文件夹详细步骤
1. 删除Local PV
```
$ kubectl delete pv pv-local
```

1. 删除Local volume文件夹
> 注：此操作步骤会删除vol-test文件夹里内容
```
$ sudo cd /mnt/disks
$ sudo rm -rf vol-test
```

## 附录2

- Ceph RBD存储卷挂载至工作负载缺少密钥无法挂载解决方法

1. 假设工作负载所在项目为ns1, Ceph RBD存储卷关联的存储类型为rbd。

2. 通过Kubectl命令行工具向kubernetes发送以下命令 ,查询要创建Secret名称
```
$ kubectl get sc rbd | grep userSecretName
userSecretName: ceph-rbd-user-secret
```
应创建的Secret名称为ceph-rbd-user-secret

3. 通过ceph命令行工具向Ceph集群发送以下命令，得到密钥
```
$ ceph auth get-key client.admin
AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==
```
密钥为AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==

4. 通过Kubectl命令行工具向kubernetes发送以下命令,创建Secret
    - 以下字段根据实际状况有所不同
        - ceph-rbd-user-secret
        - AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==
        - ns1

```
kubectl create secret generic ceph-rbd-user-secret --type="kubernetes.io/rbd" --from-literal=key='AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==' --namespace=ns1
```



