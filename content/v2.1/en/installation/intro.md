---
title: "Instruction"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

[KubeSphere](https://kubesphere.io/) is an enterprise-grade multi-tenant container platform built on [Kubernetes](https://kubernetes.io). It provides an easy-to-use UI for users to manage application workloads and computing resources with a few clicks, which greatly reduces the learning curve and the complexity of daily work such as development, testing, operation and maintenance. KubeSphere aims to alleviate the pain points of Kubernetes including storage, network, security and ease of use, etc.

KubeSphere supports installing on cloud-hosted and on-premises Kubernetes cluster, e.g. native K8s, GKE, EKS, RKE, etc., and on Linux host including virtual machine and bare metal with provisioning Kubernetes cluster. Both of the two methods are easy and friendly to install KubeSphere. Meanwhile, KubeSphere offers not only online installer, but offline installer for disconnected environment.

KubeSphere is open source project on [GitHub](https://github.com/kubesphere). There are thousands of users are using KunbeSphere, and many of them are running KubeSphere for their production workloads.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191219232535.png)


## Before Installation

> - As the installation will pull images and update operating system from internet, your environment must have the internet access. If not, then you need to use the disconnected installer instead.
> - For all-in-one installation, the only one node is both the master and the worker.
> - For multi-node installation, you are asked to specify the node roles in the configuration file before installation.
> - You linux host must have OpenSSH Server installed.
> - please check the [ports requirement](../port-firewall) before installation.

## Quick Install For Development and Testing

KubeSphere has decoupled some components since v2.1.0. The installer only installs required components by default which brings the benefits of fast installation and minimal resource consumption. If you want to install any optional component, please check the following section **Pluggable Components Overview** for details.

The quick install of KubeSphere is only for development or testing since it uses local volume for storage by default. If you want a production install please refer to the section **High Availability Installation for Production Environment**.

### Install KubeSphere on Linux

> - [All-in-One](../all-in-one): It means a single-node hassle-free configuration installation with one-click.
> - [Multi-Node](../multi-node): It allows you to install KubeSphere on multiple instances using local volume, which means it is not required to install storage server such as Ceph, GlusterFS.
>
> Note：disconnected installation please refer to [Disconnected Installation on Multi-Node](https://kubesphere.com.cn/forum/d/437-centos7-7-multinode-kubesphere2-1-offline).

### Install KubeSphere on Existing Kubernetes

You can install KubeSphere on your existing Kubernetes cluster. Please refer [Install KubeSphere on Kubernetes](../install-on-k8s) for instructions.

## High Availability Installation for Production Environment

### Install KubeSphere on Linux

KubeSphere installer supports installing a highly available cluster for production with the prerequisites being a load balancer and persistent storage service set up in advance.

> - [Persistent Service Configuration](../storage-configuration): By default, KubeSphere Installer uses [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) based on [openEBS](https://openebs.io/) to provide storage service with dynamic provisioning in Kubernetes cluster. It is convenient for quick install of testing environment. In production environment, it must have a storage server set up. Please refer [Persistent Service Configuration](../storage-configuration) for details.
> - [Load Balancer Configuration for HA install](../master-ha): Before you get started with multi-node installation in production environment, you need to configure a load balancer. Either cloud LB or `HAproxy + keepalived` works for the installation.

### Install KubeSphere on Existing Kubernetes

Before you install KubeSphere on existing KubeSphere, please check the prerequisites of the installation on Linux described above, and verify the existing Kubernetes to see if it satisfies these prerequisites or not, i.e., a load balancer and persistent storage service.  

If your Kubernetes is ready, please refer [Install KubeSphere on Kubernetes](../install-on-k8s) for instructions.

> You can install KubeSphere on cloud Kubernetes service such as
> - [Installing KubeSphere on GKE cluster](../install-on-gke)

## Pluggable Components Overview

KubeSphere has decoupled some core feature components since v2.1.0. These components are designed to be pluggable, which means you can enable any of them before or after installation. The installer by default does not install the pluggable components. Please check the guide [Enable Pluggable Components Installation](../pluggable-components) for your requirement.

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
