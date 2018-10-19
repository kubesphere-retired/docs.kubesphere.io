---
title: "存储卷"
---

存储卷，在 KubeSphere 中是基于 PVC 的持久化存储卷，具有单个磁盘的功能供，用户创建的工作负载使用，是将工作负载数据持久化的一种资源对象。

在 all-in-one 部署方式中，可以使用 Local 存储卷将数据持久化，无需存储服务端支持，但此类型存储卷不支持动态分配方式。如果希望体验 KubeSphere 推荐的动态分配 (Dynamic Provisioning) 方式创建存储卷，我们推荐使用 [青云云平台块存储](https://docs.qingcloud.com/product/storage/volume/)，平台已集成 [QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) 块存储插件，支持使用青云块存储作为平台的存储服务，免去手动配置存储服务端的繁琐。如果需要手动配置 GlusterFS 或 Ceph RBD，需要准备相应的存储服务端。

## 前提条件

创建存储卷之前必须先创建相应的存储类型，参考 [创建存储类型](../ae-storageclass/#创建存储类型)。

## 创建存储卷

首先登录 KubeSphere 控制台，访问左侧菜单栏，在 **资源** 菜单下，点击 **存储卷** 按钮进入列表页。作为集群管理员，可以查看当前集群下所有的存储卷以及挂载情况。普通用户只能看到自己有权限访问的存储卷。
    
![存储卷列表](/pvc-pvclist.png)

> 注：使用 KubeSphere 创建 Local 存储类型存储卷，需预先创建 Local 类型 PV，参见 [Local Volume 使用方法](/express/zh-CN/manage-storages/#local-volume-使用方法)。

1. 点击存储卷列表页的 **创建存储卷** 按钮进入创建存储卷界面，填写存储卷基本信息，完成后点下一步：

![创建存储卷 - 基本信息](/pvc-create1.png)

2. 存储设置中，选择存储卷的存储类型，关于如何创建存储类型请参考 [存储类型管理](/express/zh-CN/manage-storageclasses/)。按需填写存储卷的容量大小，存储卷大小和访问模式必须与存储类型和存储服务端能力相适应，访问模式通常选择为 RWO。各类型存储支持的访问模式参见 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)。

![创建存储卷 - 设置](/pvc-create2.png)

3. 为存储卷设置标签，可通过标签来识别、组织和查找资源对象。

![创建存储卷 - 标签](/pvc-create3.png)

4. 存储卷创建成功。

![存储卷列表](/pvc-pvclist.png)

## 查看存储卷

点击列表页中的存储卷，即可查看存储卷的详细信息。存储卷详情页 **编辑 Yaml 文件** 和 **删除** 按钮分别可以编辑和删除存储卷；右侧显示挂载容器组的信息。