---
title: "存储类型"
---

## 简介
存储类型（StorageClass）是由`Kubernetes集群管理员`配置存储服务端参数，并按类型提供存储给集群用户使用。Kubesphere目前支持Ceph RBD和Glusterfs存储类型的创建，并且支持各种存储类型的展示。

## 查看存储类型

1. 进入首页，点击左侧导航栏资源选项卡内的存储类型选项，进入存储类型列表页。
    ![](/sc-jumptosclist.png) 

2. 存储类型列表页
    ![](/sc-sclist.png) 

3. 已创建存储类型的存储类型列表页
    - 列表右上角创建存储类型可供新建存储类型。
    - 列表中，每种存储类型为一行。
        - 名称列，展示存储类型名称。
        - 存储卷数量列，展示此存储类型创建并可回收的存储卷个数
        - 创建时间列，展示创建此存储类型时间
        - 左侧方框，可选中后，删除选中存储类型
    ![](/sc-listrbd.png) 

4. 进入存储类型详情页
    - 编辑Yaml文件按钮：直接编辑存储类型对象文件
    - 删除按钮：删除存储类型
    - 存储卷列表展示与此存储类型相关的存储卷，存储卷列表介绍请见存储卷说明部分
    ![](/sc-detail.png) 

## 创建存储类型

1. 在存储类型列表页，点击创建存储类型按钮
    ![](/sc-sclist-createsc.png)

2. 在弹出窗口填入参数
    - 以创建rbd存储类型为例

    2.1. 填入存储类型名和描述信息
    ![](/sc-create-page1.png)

    2.2. 按途中顺序填入参数。第2步中填入参数方法可参考[Kubernetes官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd)

    ![](/sc-create-page2.png)
    2.3. 设置标签

    ![](/sc-create-page3.png)

3. 存储类型列表页查看已有存储类型

    ![](/sc-listrbd.png)

## 设置默认存储类型

`一个Kubernetes集群中仅允许设置一个默认存储类型`

1. 存储类型列表页点击存储类型名称，进入存储类型详情页。点击编辑Yaml文件按钮
    
    ![](/sc-setdefault-detailrbd.png)

2. 进入Yaml文件编辑界面，添加annotation，并更新

    ![](/sc-setdefault-edit.png)

3. 存储类型详情页中，存储类型名称后添加五角星标识默认存储类型

    ![](/sc-setdefault-list2.png)

## 删除存储类型

1. 存储类型删除前需确保当前集群无此存储类型创建的存储卷。

    ![](/sc-delete.png)