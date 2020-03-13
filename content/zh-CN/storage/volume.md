---
title: "存储概述"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

存储是为 KubeSphere 平台的容器运行的工作负载 (Pod) 提供存储的组件，支持多种类型的存储，并且同一个工作负载中可以挂载任意数量的存储卷。

## 存储分类

作为一个容器平台，除了支持如 Local Volume(仅用于 all-in-one 测试安装), EmptyDir, HostPath 本地存储之外，还需要支持对接开源的分布式文件系统或网络文件系统。KubeSphere 提供多种网络存储方案作为持久化存储，目前支持的存储分类有本地存储和持久化存储，创建持久化存储卷之前需要预先创建存储类型，详见 [创建存储类型](../../infrastructure/storageclass)。

### 本地存储

#### Local Volume

[Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) 表示挂载的本地存储设备，如磁盘、分区或目录，只能用作静态创建的 PersistentVolume。All-in-One 模式安装默认会用 Local Volume 作为存储类型，由于 Local Volume 不支持动态分配，Installer 会预先创建 10 个可用的 10G PV 供使用，若存储空间不足则需要手动创建 Persistent Volume (PV)，参见 [Local Volume 使用方法](../local-volume)。

#### EmptyDir

[EmptyDir](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir) 的生命周期和所属的 Pod 是完全一致的，可以在同一工作负载内的不同容器之间共享工作过程中产生的文件，在部署、任务和定时任务中支持添加临时存储卷，临时存储卷是使用主机磁盘进行存储的，

#### HostPath

[HostPath](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath) 这种会把宿主机上的指定卷加载到容器之中，这种卷一般和有状态副本集 (DaemonSet) 搭配使用，用来操作主机文件，例如进行日志采集的 FLK 中的 FluentD 就采用这种方式，加载主机的容器日志目录，达到收集本主机所有日志的目的。

### 持久化存储

KubeSphere 支持的存储类型有 QingCloud 云平台块存储插件、QingStor NeonSAN 分布式存储、NFS、GlusterFS、Ceph RBD，这类存储类型都支持创建和使用持久化存储卷，并且支持动态存储卷分配 (Dynamic Volume Provisioning)[https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/]，必须预先准备好相应的服务端。安装前可在 Installer 的 `conf/common.yaml` 中配置这类存储服务，详见 [存储配置说明](../../installation/storage-configuration)。

#### QingCloud 云平台块存储

支持使用 QingCloud 云平台块存储作为平台的存储服务，如果希望体验 KubeSphere 推荐的动态分配 (Dynamic Provisioning) 方式创建存储卷，推荐使用 [QingCloud 云平台块存储](https://www.qingcloud.com/products/volume/)，平台已集成 [QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) 块存储插件，仅需简单配置即可使用 QingCloud 云平台的各种性能的块存储服务，免去手动配置存储服务端的繁琐，详见 [QingCloud-CSI 参数配置](../../installation/storage-configuration/#qingcloud-csi)。

#### QingStor NeonSAN

支持对接青云自研的企业级分布式存储 [QingStor NeonSAN](https://www.qingcloud.com/products/qingstor-neonsan/) 作为存储服务，若您准备好 NeonSAN 服务端后，即可在 `conf/common.yaml` 配置 NeonSAN-CSI 插件对接其存储服务端，详见 [存储配置说明](../../installation/storage-configuration)

#### Ceph RBD

[Ceph RBD](https://ceph.com/) 是一个分布式存储系统，KubeSphere 测试过的存储服务端 Ceph RBD 服务端版本为 v0.94.10，`Ceph` 服务端集群部署可参考 [部署 Ceph 存储集群](../../appendix/ceph-ks-install/)，正式环境搭建 Ceph 存储服务集群请参考 [Install Ceph](http://docs.ceph.com/docs/master/)。

#### GlusterFS

[GlusterFS](https://www.gluster.org/) 是一个开源的分布式文件系统，Heketi 用来管理 GlusterFS 存储服务端，KubeSphere 测试过的  GlusterFS 服务端版本为 v3.7.6，GlusterFS 部署可参考 [部署 GlusterFS 存储集群](../../appendix/glusterfs-ks-install/)， 正式环境搭建 GlusterFS集群请参考 [Install Gluster](https://www.gluster.org/install/) 或 [Gluster Docs](http://gluster.readthedocs.io/en/latest/Install-Guide/Install/) 并且需要安装 [Heketi 管理端](https://github.com/heketi/heketi/tree/master/docs/admin)，Heketi 版本为 v3.0.0。

#### NFS

[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs) 即网络文件系统，它允许网络中的计算机之间通过 TCP/IP 网络共享资源。本地 NFS 的客户端应用可以透明地读写位于远端 NFS 服务器上的文件，就像访问本地文件一样。使用 NFS 需提前准备存储服务端，比如 QingCloud 云平台 [vNAS](https://www.qingcloud.com/products/nas/)，然后可以在 Installer 配置参数对接 NFS 存储服务端，详见 [NFS 配置](../../installation/storage-configuration/#nfs)。

## 存储卷

存储卷，具有单个磁盘的功能，供用户创建的工作负载使用。在创建存储类型后，即可创建存储卷，并挂载至工作负载，详见 [创建存储卷](../pvc)。