---
title: "安装后添加新的存储类型"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Add a new storageclass'
---

KubeSphere Installer 支持在安装前与安装后配置新的存储类型。Installer 默认使用 [OpenEBS](https://openebs.io/) 基于 [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) 提供持久化存储服务，方便初次安装但没有准备存储服务端的场景下进行部署测试，但是在生产环境建议配置 KubeSphere [支持的存储类型](../storage-configuration)。

本文档将帮助您在安装后添加新的存储类型，仅适用于 Linux Installer 安装的环境。


## 前提条件

已准备了存储服务端（如 NFS、Ceph RBD、GlusterFS）

## 配置存储类型参数

若在安装完成后，希望直接配置与添加 KubeSphere 支持的存储类型，可直接在 Installer 中的 `common.yaml` 先修改存储类型相关参数，再执行 `install.sh`，该操作将会在集群中安装新的存储类型的客户端，并根据 `common.yaml` 中配置的存储相关参数对接存储服务端。

本文档以添加 NFS 存储类型为例（添加其它存储类型类似）。

编辑 `conf/common.yaml` 文件，找到 NFS 存储配置项，参考如下进行修改：

> 提示：以下参数释义可参考 [NFS 存储服务](../storage-configuration/#nfs)。


```yaml
# Local Volume
local_volume_enabled: true
local_volume_is_default_class: false   # 先将集群默认的存储类型 Local Volume 设置为 false

# NFS CONFIGURATION
# KubeSphere can use existing nfs service as backend storage service.
# change to true to use nfs.

nfs_client_enabled: true              # 设置为 true 开启客户端的安装
nfs_client_is_default_class: true     # 设置为默认的存储类型

# Hostname of the NFS server(ip or hostname)
nfs_server: 192.168.0.22   # 替换为您 NFS server 实际的 IP 地址或 hostname

# Basepath of the mount point
nfs_path: /mnt/shared_dir  # 	NFS server 的共享目录
nfs_vers3_enabled: false
nfs_archiveOnDelete: false
```

## 安装并对接新的存储服务

重新执行一遍 install.sh，将根据以上修改的参数项，安装存储客户端并对接新的存储服务。

> 提示：重新执行安装程序不会重装整个系统，只会根据参数修改执行相关安装任务。

## 验证新的存储类型

待安装程序执行完毕后，使用 admin 登录在「基础设施」→ 「存储类型」 进行验证，如下 NFS 已是默认的存储类型：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191212173814.png)

可进入任意项目中，创建一个存储卷，并创建一个 deployment 挂载存储卷进行验证。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191212174816.png)

本文仅以添加 NFS 存储类型作为示例，若希望添加 Ceph RBD 或 GlusterFS，步骤与上述类似，可参考 [存储参数配置](../storage-configuration) 。
