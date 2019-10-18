---
title: "Instruction"
keywords: ''
description: ''
---

[KubeSphere](https://kubesphere.io) is an enterprise-grade multi-tenant container management platform that built on [Kubernetes](https://kubernetes.io). It provides an easy-to-use UI enables creation of computing resources with a few clicks and one-click deployment, which reduces the learning curve and empower the DevOps teams. It greatly reduces the complexity of the daily work of development, testing, operation and maintenance, aiming to solve the pain spots of Kubernetes' storage, network, security and ease of use, etc. 

## Installing KubeSphere on Linux

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

`All-in-One` is single-node installation that supports one-click installation, it's only recommended to test and experienc the features of 2.0.2, see [All-in-One](../all-in-one). By contrast, the multi-node installation is recommended in a formal environment.

### Multi-Node 

`Multi-node` is used for installing KubeSphere on multiple instances, supports for installing a highly available master and etcd cluster which is able to use in a formal environment, see [Multi-Node](../multi-node).

#### Components Version

|Components | Version|
|---|---|
|KubeSphere| v2.0.2|
|Kubernetes| v1.13.5|
|Istio | v1.1.1 |
|etcd| v3.2.18|
|OpenPitrix| v0.3.5|
|Elasticsearch| v6.7.0 |
|Prometheus| v2.3.1|
|Jenkins| v2.138 |
|SonarQube| v7.4 |
|GitLab | v11.8.1 |
|Harbor | v1.7.5 |

#### Storage Configuration Instruction

*Storage Configuration Instruction* explains how to configure different types of persistent storage services as following, see [Storage Configuration Instruction](../storage-configuration).

- [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)
- [GlusterFS](https://www.gluster.org/)
- [Ceph RBD](https://ceph.com/)
- [QingCloud Block Storage](https://docs.qingcloud.com/product/storage/volume/)
- [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)
 

#### Creating HA Master and Etcd Cluster

Multi-node installation can help uses to deploy KubeSphere to a cluster. However, we also need to consider the high availability of the master and etcd in a production environment. This page uses the Load balancer as an example, walk you through how to configure highly available Master and etcd nodes installation, see [Creating Highly Available Master and Etcd Cluster](../master-etcd-ha).

#### Adding new node

After you install KubeSphere, you may run out of server capacity in a formal environment and need to add a new node, then scale the cluster horizontally to complete the system expansion, see [Add new node](../add-nodes).

## Installing KubeSphere on Kubernetes

In addition to supporting deploy on VM and BM, KubeSphere also supports installing on cloud-hosted and on-premises Kubernetes clusters.

> - [Installing KubeSphere on Kubernetes (Online)](../install-on-k8s)
> - [Installing KubeSphere on Kubernetes (Offline)](../install-ks-offline)



## Uninstalling

Uninstall will remove KubeSphere from the machine, this operation is irreversible, see [Uninstall](../uninstall).


