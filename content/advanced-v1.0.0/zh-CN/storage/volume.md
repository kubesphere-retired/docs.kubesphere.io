---
title: "存储概述"
---

存储是为 KubeSphere 平台的容器运行的工作负载（Pod) 提供存储的组件，支持多种类型的存储，并且同一个工作负载中可以挂载任意数量的存储卷。

## 存储分类

作为一个容器管理平台，除了支持如 EmptyDir、HostPath 本地存储之外，还需要支持网络存储。KubeSphere 提供多种网络存储方案作为持久化存储，目前支持的存储分类有本地存储和持久化存储，创建持久化存储卷之前需要预先创建存储类型，详见 [创建存储类型](../../infrastructure/storageclass)。

### 本地存储

#### EmptyDir

[EmptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir) 的生命周期和所属的 Pod 是完全一致的，可以在同一工作负载内的不同容器之间共享工作过程中产生的文件，在部署、任务和定时任务中支持添加临时存储卷，临时存储卷是使用主机磁盘进行存储的，

#### HostPath

[HostPath](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath) 这种会把宿主机上的指定卷加载到容器之中，这种卷一般和有状态副本集（DaemonSet）搭配使用，用来操作主机文件，例如进行日志采集的 FLK 中的 FluentD 就采用这种方式，加载主机的容器日志目录，达到收集本主机所有日志的目的。

### 存储类型

KubeSphere 支持的存储类型有 QingCloud CSI (QingCloud 云平台块存储插件)、NeonSAN CSI (QingStor NeonSAN 分布式存储)、NFS、GlusterFS、Ceph RBD、Local (仅 all-in-one 中使用)。


### Local Volume

[Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) 表示挂载的本地存储设备，如磁盘、分区或目录。本地卷只能用作静态创建的 PersistentVolume。All-in-One 模式安装默认会用 local storage 作为存储类型，由于 local storage 不支持动态分配，installer 会预先创建 10 个可用的 10G PV 供使用，若存储空间不足则需要手动创建 Persistent Volume (PV)，参见 [Local Volume 使用方法](../ae-local-volume/#local-volume-使用方法)。


### QingCloud 云平台块存储

支持使用 QingCloud 云平台块存储作为平台的存储服务，如果希望体验 KubeSphere 推荐的动态分配 (Dynamic Provisioning) 方式创建存储卷，推荐使用 [QingCloud 云平台块存储](https://docs.qingcloud.com/product/storage/volume/)，平台已集成 [QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) 块存储插件，仅需简单配置即可使用 QingCloud 云平台的各种性能的块存储服务，免去手动配置存储服务端的繁琐，详见 [QingCloud 云平台块存储](../qingcloud-storage)。

### Ceph RBD

[CephRBD](https://ceph.com/) 是一个分布式存储系统，KubeSphere 测试过的存储服务端 Ceph RBD 服务端版本为 v0.94.10，`Ceph` 服务端集群部署可参考 [部署 Ceph 存储集群](../ae-ceph)，正式环境搭建 Ceph 存储服务集群请参考 [Install Ceph](http://docs.ceph.com/docs/master/)。

### GlusterFS

[GlusterFS](https://www.gluster.org/) 是一个开源的分布式文件系统，Heketi 用来管理 GlusterFS 存储服务端，KubeSphere 测试过的  GlusterFS 服务端版本为 v3.7.6，GlusterFS 部署可参考 [部署 GlusterFS 存储集群](../ae-glusterfs/)， 正式环境搭建 GlusterFS集群请参考 [Install Gluster](https://www.gluster.org/install/) 或 [Gluster Docs](http://gluster.readthedocs.io/en/latest/Install-Guide/Install/) 并且需要安装 [Heketi 管理端](https://github.com/heketi/heketi/tree/master/docs/admin)，Heketi 版本为 v3.0.0。

### NFS

[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs) 即网络文件系统，它允许网络中的计算机之间通过 TCP/IP 网络共享资源。本地 NFS 的客户端应用可以透明地读写位于远端 NFS 服务器上的文件，就像访问本地文件一样，详见 [NFS 配置](../../installation/)

> 注意：Ceph RBD、GlusterFS、NFS 这类网络文件系统必须先准备好相应的服务端才能使用。


## 存储卷

存储卷，具有单个磁盘的功能，供用户创建的工作负载使用。在创建存储类型后，即可创建存储卷，详见 [存储卷 - 创建存储卷](../ae-PVC/#创建存储卷)。