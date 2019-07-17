---
title: "Instruction"
keywords: ''
description: ''
---

[KubeSphere](https://kubesphere.io) is an enterprise-grade multi-tenant container management platform that built on [Kubernetes](https://kubernetes.io). It provides an easy-to-use UI enables creation of computing resources with a few clicks and one-click deployment, which reduces the learning curve and empower the DevOps teams. It greatly reduces the complexity of the daily work of development, testing, operation and maintenance, aiming to solve the pain spots of Kubernetes' storage, network, security and ease of use, etc. 

## Prerequisites

Download the [KubeSphere Advanced Edition](https://kubesphere.io/download/?type=advanced) to the target machine.

## Installing KubeSphere

KubeSphere installation supports [all-in-one](../all-in-one) and [multi-node](../multi-node).

All-in-one means a single host that includes the master, node, etcd, and other components, thus multi-node means multiple hosts with all components included on each (master, node, etcd, and other components).

In addition, you can choose to integrate Harbor image registry into cluster (optional). By default, Harbor will not be installed, users need to pre-configure the `conf/vars.yml` to install harbor, see [Integrate Harbor Installation](../harbor-installation).

> **Note:** 
> - The external network must be accessible because of installation is required to update the OS and pull images and dependencies from the external source.
> - There are two roles in the architecture of KubeSphere cluster, i.e. Master and Node. The master node consists of three components, namely, **kube-apiserver** for exposing the Kubernetes API, **kube-scheduler** for scheduling decisions, and **kube-controller-manager** for running controllers.
> - Etcd as the consistent and highly-available key value store used as Kubernetes’ backing store for all cluster data.
> - All-in-one is used for a single-node installation, the node is both a management and a working node.
> - When you start multi-node installation, you can set the roles of the cluster nodes in the configuration file.
> - Notice that select OpenSSH Server from the Software Selection step if your host(s) is a newly installed system,.

### All-in-One

`All-in-One` is single-node installation that supports one-click installation, it's only recommended to test and experienc the features of Advanced Edition, see [All-in-One](../all-in-one). By contrast, the multi-node installation is recommended in a formal environment.

### Multi-Node 

`Multi-node` is used for installing KubeSphere on multiple instances, supports for installing a highly available master and etcd cluster which is able to use in a formal environment, see [Multi-Node](../multi-node).

### Storage Configuration Instruction

The multi-node installation supports configure the NFS in Kubernetes to provide cluster with persistent storage service, it's only for testing the installation without preparing the storage server for the first time. If you are going to install KubeSphere in a formal environment, it's required to prepare and configure the corresponding storage server which is supported by KubeSphere. 

*Storage Configuration Instruction* explains how to configure different types of persistent storage services as following, see [Storage Configuration Instruction](../storage-configuration).

- [QingCloud Block Storage](https://docs.qingcloud.com/product/storage/volume/)
- [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)
- [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)
- [GlusterFS](https://www.gluster.org/)
- [Ceph RBD](https://ceph.com/) 

### Creating Highly Available Master and Etcd Cluster

Multi-node installation can help uses to deploy KubeSphere to a cluster. However, we also need to consider the high availability of the master and etcd in a production environment. This page uses the Load balancer as an example, walk you through how to configure highly available Master and etcd nodes installation, see [Creating Highly Available Master and Etcd Cluster](../master-etcd-ha).

### Adding new node

After you install KubeSphere, you may run out of server capacity in a formal environment and need to add a new node, then scale the cluster horizontally to complete the system expansion, see [Add new node](../add-nodes).

### High-risk Operation

KubeSphere supports high availability of master and working nodes to ensure cluster stability, based on the underlying kubernetes scheduling mechanism to ensure the sustainability and stability. It is not recommended to shut down or restart nodes for no reason, because such operations are high-risk operations may cause the service is not available, please operate with caution. High-risk operations are supposed to inform users about the risks in advance, the engineer is only allowed to implement the backend operation after users and other engineers agree. For example, be aware of the following list describes high-risk and prohibited operations that may cause a node or cluster unavailable:

**High-risk Operations**  

| Sequence | High-risk Operation | 
|---|---|
| 1 | Restart the cluster node or reinstall the operating system. |
| 2 | It is recommended that you do not install additional software on the cluster node, which could make the cluster node unavailable. |

**Prohibitive Operations** 

| Sequence | Prohibitive Operations | 
|---|---|
| 1 | Delete `/var/lib/etcd/`. Delete `/var/lib/docker`. Delete `/etc/kubernetes/`.  Delete `/etc/kubesphere/` |
| 2 | Disk formatting, partitioning. |


## Uninstalling

Uninstall will remove KubeSphere from the machine, this operation is irreversible, see [Uninstall](../uninstall).


## Components Version

|Components | Version|
|---|---|
|KubeSphere| Advanced Edition v1.0.0|
|Kubernetes| v1.12.3|
|OpenPitrix| v0.3.5|
|Prometheus| v2.3.1|
|Jenkins| v2.138 |