---
title: "Instruction"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

[KubeSphere](https://kubesphere.io/) is an enterprise-grade multi-tenant container platform built on [Kubernetes](https://kubernetes.io). It provides an easy-to-use UI for users to manage application workloads and computing resources with a few clicks, which greatly reduces the learning curve and the complexity of daily work such as development, testing, operation and maintenance. KubeSphere aims to alleviate the pain points of Kubernetes including storage, network, security and ease of use, etc.


KubeSphere supports installing on cloud-hosted and on-premises Kubernetes cluster (e.g. native K8s, GKE, EKS, RKE), and on Linux host (including virtual machine and bare metal) with provisioning Kubernetes cluster, both of the two methods are easy and friendly to install KubeSphere. Meanwhile, KubeSphere offers not only online installer, but offline installer for disconnected environment.

KubeSphere is open source project on [GitHub](https://github.com/kubesphere). There are thousands of users are using KunbeSphere, and many of them are running KubeSphere for their producation workloads.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191219232535.png)

## Installing KubeSphere on Existing Kubernetes

> - [Installing KubeSphere on Kubernetes (Online)](../install-on-k8s)
> - [Installing KubeSphere on GKE cluster](../install-on-gke)


## Installing KubeSphere on Linux

KubeSphere installer supports [all-in-one](../all-in-one) and [multi-node](../multi-node) installation, which will help you to install **KubeSphere and Kubernetes** to target marchines.

### Quickstart (For development and testing)

> - [All-in-One](../all-in-one): Means single-node installation, supports one-click deployment, it's only recommended for testing.
> - [Multi-Node](../multi-node): It allows you to install KubeSphere on multiple instances using local volume which means it is not required to install storage server such as Ceph, GlusterFS.

### HA Install (For production environments)

KubeSphere installer supports installing a highly available cluster for production with the prerequisites being load balancer and persistent storage service set up in advance.

> - [Persistent Service Configuration](../storage-configuration): By default, KubeSphere Installer uses [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) based on [openEBS](https://openebs.io/) to provide storage service with dynamic provisioning in Kubernetes cluster, it's convienient for quickstart. However, this service is not recommended to use in production environment. We recomend you to prepare a storage server instead. Please refer [Persistent Service Configuration](../storage-configuration) for details.
> - [Load Balancer Configuration for HA install](../master-ha): Before you get started with Multi-node installation in production environment, you are required to configure a load balancer. Either cloud LB or `HAproxy + keepalived` works for the installation.

## Pluggable Components Overview

KubeSphere has decoupled some core feature components since v2.1.0. These components are designed to be pluggable which means you can enable any of them before or after install. The installer by default does not install the pluggable componentes. Please check the guide [Enable Pluggable Components Installation](../pluggable-components) for your requirement.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191207140846.png)

## Storage Configuration Instruction

*Storage Configuration Instruction* explains how to configure different types of persistent storage services as follows. Please refer [Storage Configuration Instruction](../storage-configuration) for detailed instructions.

- [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)
- [GlusterFS](https://www.gluster.org/)
- [Ceph RBD](https://ceph.com/)
- [QingCloud Block Storage](https://docs.qingcloud.com/product/storage/volume/)
- [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)


## Add new nodes

KubeSphere Installer allows you to scale the number of nodes, see [Add new node](../add-nodes).


## Uninstall

Uninstall will remove KubeSphere from the machine. This operation is irreversible and dangerous. Please check [Uninstall](../uninstall).
