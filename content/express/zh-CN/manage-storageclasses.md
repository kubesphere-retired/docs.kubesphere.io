---
title: "存储类型"
---

存储类型（StorageClass）是由`Kubernetes 集群管理员`配置存储服务端参数，并按类型提供存储给集群用户使用。KubeSphere目前支持 Ceph RBD 和 Glusterfs 存储类型的创建，并且支持各种存储类型的展示。

本节通过以下几个方面介绍如何管理存储类型：

- 如何管理存储类型
  - 创建存储类型
  - 查看存储类型
  - 设置默认存储类型
  - 删除存储类型

# 如何管理存储类型
登录 KubeSphere 管理控制台，访问访问左侧菜单栏，在**资源**菜单下，点击**存储类型**按钮，进入存储类型列表页面。作为集群管理员，可以查看当前集群下所有的存储类型和详细信息。


## 创建存储类型

1. 在存储类型列表页，点击创建存储类型按钮:

![](/sc-sclist-createsc.png)

2. 在基本信息页面填入参数, 以创建 rbd-sc 存储类型为例

*  填入存储类型名和描述信息:

![](/sc-create-page1.png)

*  第 2 步中填入参数键值对可参考[Kubernetes官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd)

![](/sc-create-page2.png)

*  为存储类型设置标签, 点击创建:

![](/sc-create-page3.png)



## 查看存储类型

1.存储类型列表页显示已经创建的存储类型, 点击可查看和编辑该存储类型。

![](/sc-listrbd.png)

2.进入存储类型详情页
- 编辑Yaml文件按钮：直接编辑存储类型对象文件
- 删除按钮：删除存储类型
- 存储卷列表展示与此存储类型相关的存储卷，存储卷介绍请见存储卷说明部分

![](/sc-detail.png)

## 设置默认存储类型

一个 Kubernetes 集群中仅允许设置一个默认存储类型

1.存储类型列表页点击存储类型名称，进入存储类型详情页。点击编辑Yaml文件按钮
    
![](/sc-setdefault-detailrbd.png)

2.进入 Yaml 文件编辑界面，添加 annotation ，并更新

![](/sc-setdefault-edit.png)

3.存储类型详情页中，存储类型名称后添加五角星标识默认存储类型

![](/sc-setdefault-list2.png)

## 删除存储类型

*  存储类型删除前需确保当前集群无此存储类型创建的存储卷。

![](/sc-delete.png)