---
title: "存储类型"
---

存储类型（StorageClass）是由 `集群管理员` 配置存储服务端的参数，并按类型提供存储给集群用户使用。通常情况下，创建存储卷之前需要先创建存储类型，目前支持的存储类型如 [青云块存储](https://www.qingcloud.com/products/volume/)、 [企业级分布式存储 NeonSAN](https://www.qingcloud.com/products/qingstor-neonsan/)、[GlusterFS](https://www.gluster.org/)、[CephRBD](https://ceph.com/)、[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local)、[EmptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir) 等。

## 创建存储类型

首先登录 KubeSphere 管理控制台，选择 **平台管理 → 基础设施 → 存储类型**，进入存储类型列表页面。作为集群管理员，可以查看当前集群下所有的存储类型和详细信息。

### 第一步：填写基本信息

在存储类型列表页，点击 **创建** 按钮，填写基本信息:

- 名称：为存储类型起一个简洁明了的名称，便于用户浏览和搜索。
- 描述信息：详细介绍存储类型的特性，当用户想进一步了解该存储类型时，描述内容的完整将变得尤为重要。
- 允许存储卷扩容：存储卷的扩容的开关。
- 回收机制：默认 Delete，相关的存储资产比如 QingCloud 块存储也会一并删除。

![存储类型 - 基本信息](/ae-sc-basic.png)

### 第二步：存储类型设置

设置存储类型的详细参数，这一步的参数会根据 供应者 (Provisioner) 不同而变化，以设置青云块存储插件 CSI-QingCloud 为例：

![存储类型 - 参数设置](/ae-sc-setting.png)

- 供应者（Provisioner）：实际上是个存储分配器，用来决定使用哪个卷插件分配 PV，例如选择 csi-qingcloud, Ceph RBD 或 GlusterFS。

- type: 云平台存储卷类型。比如在青云的公有云上， 0 代表性能型硬盘。3 代表超高性能型硬盘。1 或 2（根据集群所在区不同而参数不同）代表容量型硬盘。 详见 [QingCloud 文档](https://docs.qingcloud.com/product/api/action/volume/create_volumes.html)。

- maxSize/minSize: 限制存储卷类型的存储卷容量范围，单位为 GiB。

- stepSize: 设置用户所创建存储卷容量的增量，单位为 GiB。

- fsType: 支持 ext3, ext4, xfs. 默认为 ext4。


## 设置默认存储类型

一个 Kubernetes 集群中仅允许设置一个默认存储类型，在存储类型的详情页点击 **更多操作** 可设置默认的存储类型。

![设置默认存储类型](/ae-sc-default-setting.png)

