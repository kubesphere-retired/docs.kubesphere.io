---
title: "存储卷"
---

存储卷，在 KubeSphere 中一般是指基于 PVC 的持久化存储卷，具有单个磁盘的功能，供用户创建的工作负载使用，是将工作负载数据持久化的一种资源对象。

在 all-in-one 部署方式中，可以使用 Local 存储卷将数据持久化，无需存储服务端支持，但此类型存储卷不支持动态分配方式。如果希望体验 KubeSphere 推荐的动态分配 (Dynamic Provisioning) 方式创建存储卷，平台已集成 [QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) 块存储和 [企业级分布式存储 NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/) 插件，支持使用 [青云块存储](https://www.qingcloud.com/products/volume/) 或 [QingStor NeonSAN](https://www.qingcloud.com/products/qingstor-neonsan/) 作为平台的存储服务，免去手动配置存储服务端的繁琐。

另外，Installer 也已集成了 [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[GlusterFS](https://www.gluster.org/)、[CephRBD](https://ceph.com/) 等存储的客户端，需在 `conf/vars.yml` 中配置，但需要自行准备和安装相应的存储服务端，参考附录中的 [部署 Ceph RBD 存储服务端](../https://docs.kubesphere.io/express/zh-CN/ceph-ks-install/) 或 [部署 GlusterFS 存储服务端](../https://docs.kubesphere.io/express/zh-CN/glusterfs-ks-install/)。

## 前提条件

创建存储卷之前必须先创建相应的存储类型，参考 [创建存储类型](../ae-storageclass/#创建存储类型)。

## 创建存储卷

首先登录 KubeSphere 控制台，选择已有 **项目** 或新建项目，访问左侧菜单栏，点击 **存储卷** 进入列表页。作为集群管理员，可以查看当前集群下所有项目的存储卷以及挂载情况，而普通用户只能看到其所属项目的存储卷。
    
![存储卷列表](/ae-pvc-list.png)

### 第一步：填写基本信息

点击存储卷列表页的 **创建存储卷** 按钮进入创建存储卷界面，填写存储卷基本信息，完成后点下一步：

![创建存储卷 - 基本信息](/ae-pvc-basic.png)

### 第二步：存储卷设置

存储设置中，选择存储卷的存储类型，存储类型需要预先创建，详见 [创建存储类型](../ae-storageclass/#创建存储类型)。按需填写存储卷的容量大小，存储卷大小和访问模式必须与存储类型和存储服务端能力相适应，访问模式通常选择为 RWO。各类型存储支持的访问模式参见 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)。

![创建存储卷 - 设置](/ae-pvc-setting.png)

访问模式包括：

- ReadWriteOnce — 该卷可以被单个节点以读/写模式挂载。
- ReadOnlyMany — 该卷可以被多个节点以只读模式挂载。
- ReadWriteMany — 该卷可以被多个节点以读/写模式挂载。

### 第三步：标签设置

为存储卷设置标签，可通过标签来识别、组织和查找资源对象，selector 可以根据标签的键值对来调度资源。
存储卷创建成功，即可挂载至工作负载。

## 挂载存储卷

在创建工作负载时可以添加已创建的存储卷，例如，在创建部署时，点击 **添加已有存储卷**，选择存储卷后填写读写方式和挂载路径即可使用存储卷。

![挂载存储卷](/add-pvc-in-workload.png)