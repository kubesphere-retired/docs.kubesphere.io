---
title: "Instruction"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

[KubeSphere](https://kubesphere.io) is an enterprise-grade multi-tenant container platform that built on [Kubernetes](https://kubernetes.io). It provides an easy-to-use UI enables creation of computing resources with a few clicks and one-click deployment, which reduces the learning curve and empower the DevOps teams. It greatly reduces the complexity of the daily work of development, testing, operation and maintenance, aiming to solve the pain points of Kubernetes' storage, network, security and ease of use, etc.

**KubeSphere supports installing on cloud-hosted and on-premises Kubernetes clusters and Linux host (including VM and BM), both of the 2 installation methods are easy and friendly for getting start.**


## Installing KubeSphere on Kubernetes

> - [Installing KubeSphere on Kubernetes (Online)](../install-on-k8s)
> - [Installing KubeSphere on GKE cluster](../install-on-gke)


## Installing KubeSphere on Linux

KubeSphere installer supports [all-in-one](../all-in-one) and [multi-node](../multi-node) installation, which will help you to install **Kubernetes v1.15.5, Prometheus and KubeSphere** together to target marchines.

### Quickstart (For development and testing)

> - [All-in-One](../all-in-one): Means single-node installation, supports one-click deployment, it's only recommended to test and experience.
> - [Multi-Node](../multi-node): Installing KubeSphere on multiple instances, it allows you to configure machine addresses in `hosts.ini`, without seperate storage server (e.g. Ceph, GlusterFS) and HA load balance configuration.

### HA Install (For production environments)

KubeSphere installer supports installing a highly available cluster which is able to use in a production environment, the prerequisites are load balancer and persistent storage service configuration.

> - [Persistent Service Configuration](../storage-configuration): By default, KubeSphere Installer uses [Local volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) based on [openEBS](https://openebs.io/) to provide storage service with dynamic provisioning in Kubernetes cluster, it's convienient for quickstart. However, this is not recommended to use in production environments, we recomend you to prepare a storage server and reference [Persistent Service Configuration](../storage-configuration) for production environments.
> - [Load Balancer Configuration for HA install](../master-ha): Before you get started with Multi-node installation in production environments, you are supposed to configure load balancer, cloud LB or `HAproxy + keepalived` could be a solution for HA install.

## Enable Pluggable Components Installation

 KubeSphere has decoupled some core feature components in v2.1.0, these components are designed to be pluggable and support enabling them before or after installation. By default, installer will trigger minimal installation if you don't enable pluggable components in related configuration file. See [Enable Pluggable Components Installation](../pluggable-components) for pluggable components installation guide.


## Components Version

The components with `*` are required in minimal installation, others are corresponding to pluggable components.

|  Component |  Version |
|---|---|
|* KubeSphere| 2.1.0|
|* Kubernetes| v1.15.5 |
|* etcd|3.2.18|
|* Prometheus| v2.3.1|
|Fluent Bit| v1.2.1|
|Elasticsearch | v6.7.0 ( **Support using external ElasticSearch 7.x** )|
|Istio | v1.3.3 |
|OpenPitrix (App Store)| v0.4.5 |
|Jenkins| v2.176.2 |
|SonarQube| v7.4 |
|GitLab | 11.8.1 |
|Harbor | 1.7.5 |

## Storage Configuration Instruction

*Storage Configuration Instruction* explains how to configure different types of persistent storage services as following, see [Storage Configuration Instruction](../storage-configuration).

- [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)
- [GlusterFS](https://www.gluster.org/)
- [Ceph RBD](https://ceph.com/)
- [QingCloud Block Storage](https://docs.qingcloud.com/product/storage/volume/)
- [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)


## Add new nodes

After you install KubeSphere, you may run out of server capacity in a formal environment and need to add a new node, then scale the cluster horizontally to complete the system expansion, see [Add new node](../add-nodes).


## Uninstall

Uninstall will remove KubeSphere from the machine, this operation is irreversible and dangerous, see [Uninstall](../uninstall).
