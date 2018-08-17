---
title: "存储类型"
---

存储类型（StorageClass）是由 `集群管理员` 配置存储服务端参数，并按类型提供存储给集群用户使用。KubeSphere 目前支持 [Ceph RBD](http://docs.ceph.com/docs/master/) 和 [GlusterFS](https://www.gluster.org/install/) 存储类型以及青云研发的块存储插件 [QingCloud CSI](https://github.com/yunify/qingcloud-csi) (更多的存储类型持续更新中)，并且支持各种存储类型的展示。

本节通过以下几个方面介绍如何管理存储类型：

- 创建存储类型
- 查看存储类型
- 设置默认存储类型
- 删除存储类型


## 创建存储类型

首先登录 KubeSphere 管理控制台，访问左侧菜单栏，在 **资源** 菜单下，点击 **存储类型** 按钮，进入存储类型列表页面。作为集群管理员，可以查看当前集群下所有的存储类型和详细信息。

1. 在存储类型列表页，点击 **创建存储类型** 按钮:

![存储类型列表](/sc-sclist-createsc.png)

2. 在基本信息页面填入参数，以创建 rbd-sc 存储类型为例。


- 2.1.  填入存储类型名和描述信息:

![存储类型 - 基本信息](/sc-create-page1.png)

- 2.2. 填入参数键值对，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd)。

![存储类型 - 参数设置](/sc-create-page2.png)

- 2.3. 为存储类型设置标签，点击创建:

![存储类型 - 标签](/sc-create-page3.png)


## 查看存储类型

1. 存储类型列表页显示已经创建的存储类型，点击可查看和编辑该存储类型。

![](/sc-listrbd.png)

2. 进入存储类型详情页。

选择 **编辑 Yaml 文件** 按钮直接编辑存储类型对象文件；选择 **删除** 按钮删除存储类型；存储卷列表展示与此存储类型相关的存储卷，存储卷介绍请见 [存储卷](/express/zh-CN/manage-storages/)。

![存储类型详情](/sc-detail.png)

## 设置默认存储类型

一个 Kubernetes 集群中仅允许设置一个默认存储类型。

1. 存储类型列表页点击存储类型名称，进入存储类型详情页。点击编辑 Yaml 文件按钮。
    
![编辑存储类型1](/sc-setdefault-detailrbd.png)

2. 进入 Yaml 文件编辑界面，添加 annotation，并更新。

![编辑存储类型2](/sc-setdefault-edit.png)

3. 存储类型详情页中，存储类型名称后添加五角星标识为默认存储类型。

![编辑存储类型3](/sc-setdefault-list2.png)

## 删除存储类型

* 存储类型删除前需确保当前集群无此存储类型创建的存储卷。

![删除存储类型](/sc-delete.png)