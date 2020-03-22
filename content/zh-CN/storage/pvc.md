---
title: "存储卷"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

存储卷，在 KubeSphere 中一般是指基于 PVC 的持久化存储卷，具有单个磁盘的功能，供用户创建的工作负载使用，是将工作负载数据持久化的一种资源对象。

在 all-in-one 部署方式中，可以使用 Local 存储卷将数据持久化，无需存储服务端支持，但此类型存储卷不支持动态分配方式。如果希望体验 KubeSphere 推荐的动态分配 (Dynamic Provisioning) 方式创建存储卷，平台已集成 [QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) 块存储和 [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/) 插件，支持使用 [QingCloud 云平台块存储](https://www.qingcloud.com/products/volume/) 或 [QingStor NeonSAN](https://www.qingcloud.com/products/qingstor-neonsan/) 作为平台的存储服务，免去手动配置存储服务端的繁琐。

另外，Installer 也已集成了 [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[GlusterFS](https://www.gluster.org/)、[CephRBD](https://ceph.com/) 等存储的客户端，需在 `conf/common.yaml` 中配置，但需要自行准备和安装相应的存储服务端，若用于 KubeSphere 测试存储服务端部署可参考附录中的 [部署 Ceph RBD 存储服务端](../../appendix/ceph-ks-install/) 或 [部署 GlusterFS 存储服务端](../../appendix/glusterfs-ks-install/)。

存储卷生命周期包括存储卷创建、挂载、卸载、删除等操作，如下演示一个存储卷完整生命周期的操作。

## 前提条件

创建存储卷之前必须先创建相应的存储类型，参考 [创建存储类型](../../infrastructure/storageclass/#创建存储类型)。

## 创建存储卷

首先登录 KubeSphere 控制台，选择已有 **项目** 或新建项目，访问左侧菜单栏，点击 **存储卷** 进入列表页。作为集群管理员，可以查看当前集群下所有项目的存储卷以及挂载情况，而普通用户只能看到其所属项目的存储卷。
    
![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514093909.png)

### 第一步：填写基本信息

点击存储卷列表页的 **创建存储卷** 按钮进入创建存储卷界面，填写存储卷基本信息，完成后点下一步：

![创建存储卷 - 基本信息](/ae-pvc-basic.png)

### 第二步：存储卷设置

存储设置中，选择存储卷的存储类型，存储类型需要预先创建，详见 [创建存储类型](../../infrastructure/storageclass/#创建存储类型)。按需填写存储卷的容量大小，存储卷大小和访问模式必须与存储类型和存储服务端能力相适应。各类型存储支持的访问模式参见 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)。

访问模式包括以下三种，注意，块存储仅支持单节点读写，若选择 QingCloud CSI 则访问只能选择 RWO。

- ReadWriteOnce — 可以被单个节点以读/写模式挂载。
- ReadOnlyMany — 可以被多个节点以只读模式挂载。
- ReadWriteMany — 可以被多个节点以读/写模式挂载。

![创建存储卷 - 设置](/ae-pvc-setting.png)

### 第三步：标签设置

为存储卷设置标签，可通过标签来识别、组织和查找资源对象，selector 可以根据标签的键值对来调度资源。


### 第四步：查看存储卷

设置完成后点击创建，即可创建成功，刚创建的存储卷 `pvc-demo` 状态显示 “创建中”，待其状态变为 “准备就绪” 就可以将其挂载至工作负载。

> 注意：若以 all-in-one 模式安装 (存储类型为 Local Volume)，创建存储卷后，在存储卷被挂载至工作负载前，存储卷状态将一直显示 “创建中”，直至其被挂载至工作负载之后状态才显示 “准备就绪”，这种情况是正常的，因为 Local Volume 的 [延迟绑定（delay volume binding）](https://kubernetes.io/docs/concepts/storage/storage-classes/#local)  且 Local Volume 暂不支持动态配置。

![查看存储卷](/ae-pvc-status.png)

## 挂载存储卷

在创建工作负载时可以添加已创建的存储卷。参考如下，以创建一个 Wordpress 部署并挂载存储卷为示例。

### 第一步：填写部署基本信息

选择已有项目，点击 **工作负载 → 部署 → 创建部署**，填写基本信息。

![填写基本信息](/pvc-demo-basic.png)

### 第二步：配置容器组模板

配置容器组模板，以 Wordpress 为例，配置完后点击保存。

![容器组模板](/pvc-wordpress-template.png)

### 第三步：添加存储卷

1、点击 **添加已有存储卷**。

![挂载存储卷 1](/add-pvc-in-workload.png)

2、如下所示选择已有存储卷，此处选择我们在前面创建的 pvc-demo。

![挂载存储卷 2](/ae-select-pvc.png)

3、填写读写方式和挂载路径即可使用存储卷，选择 **读写**，路径填写 `/var/www/html`。

![挂载存储卷 3](/pvc-details-in-workload.png)

### 第四步：标签设置

标签设置为 `app : wordpress`，节点选择器暂不作配置，点击创建。

### 查看挂载状态

待部署创建完成后，在存储卷列表中可以看到 `pvc-demo` 卷显示挂载状态为 **已挂载**。

![挂载状态](/pvc-status-validation.png)

## 卸载存储卷

注意，若需要删除存储卷，请确保存储卷挂载状态处于 `未挂载`。如果存储卷已挂载至工作负载，在删除前需要先在工作负载中卸载 (删除) 存储卷或删除工作负载，完成卸载操作。如下，将挂载在工作负载 Wordpress 的存储卷进行删除 (卸载) 操作。

![卸载存储卷](/delete-pvc-in-wordpress.png)

## 删除存储卷

在项目下，左侧菜单栏点击 **存储卷**，如下所示 **pvc-demo** 存储卷的状态为 **未挂载** ，说明可以被删除。勾选需在上一步卸载的存储卷 **pvc-demo**，点击 **删除** 即可。

![删除存储卷](/ae-delete-pvc.png)
