---
title: "Instruction"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

[KubeSphere](https://kubesphere.io/) is an enterprise-grade multi-tenant container management platform built on [Kubernetes](https://kubernetes.io). It provides an easy-to-use UI for users to manage application workloads and computing resources with a few clicks, which greatly reduces the learning curve and the complexity of daily work such as development, testing, operation and maintenance. KubeSphere aims to alleviate the pain points of Kubernetes including storage, network, security and ease of use, etc.


**KubeSphere supports installing on cloud-hosted and on-premises Kubernetes clusters (e.g. native K8s, GKE, EKS, RKE) and Linux host (including VM and BM), both of the 2 installation methods are easy and friendly.**


![](https://pek3b.qingstor.com/kubesphere-docs/png/20191219232535.png)

## Installing KubeSphere on Kubernetes

> - [Installing KubeSphere on Kubernetes (Online)](../install-on-k8s)
> - [Installing KubeSphere on GKE cluster](../install-on-gke)


## Installing KubeSphere on Linux

KubeSphere installer supports [all-in-one](../all-in-one) and [multi-node](../multi-node) installation, which will help you to install **KubeSphere and Kubernetes** to target marchines.

### Quickstart (For development and testing)

> - [All-in-One](../all-in-one): Means single-node installation, supports one-click deployment, it's only recommended to test and experience.
> - [Multi-Node](../multi-node): It allows you to install KubeSphere on multiple instances, no need to prepare storage server (e.g. Ceph, GlusterFS).

### HA Install (For production environments)

KubeSphere installer supports installing a highly available cluster which is able to use in a production environment, the prerequisites are load balancer and persistent storage service configuration.

> - [Persistent Service Configuration](../storage-configuration): By default, KubeSphere Installer uses [Local volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) based on [openEBS](https://openebs.io/) to provide storage service with dynamic provisioning in Kubernetes cluster, it's convienient for quickstart. However, this method is not recommended to use in production environments, we recomend you to prepare a storage server and reference [Persistent Service Configuration](../storage-configuration) for production environments.
> - [Load Balancer Configuration for HA install](../master-ha): Before you get started with Multi-node installation in production environments, you are supposed to configure load balancer, cloud LB or `HAproxy + keepalived` could be a solution for HA install.

## Pluggable Components Overview

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191207140846.png)

## Enable Pluggable Components Installation

 KubeSphere has decoupled some core feature components in v2.1.0, these components are designed to be pluggable and support enabling them before or after installation. By default, installer will start minimal installation if you don't enable pluggable components in related configuration file. See [Enable Pluggable Components Installation](../pluggable-components) for pluggable components installation guide.


 > Attention: For multi-node installation, there should be at least `1` node needs to have more than 8G of available memory, which is used for dependencies cache in CI node.

 |Component| Feature | CPU |Memory|
 | --- | --- | --- | --- |
 | openpitrix-system| Helm Application Store |about 0.3 core | about 300 MiB|
 | kubesphere-alerting-system | KubeSphere alerting and notification system | about 0.08 core | about 80 M |
 | istio-system |ServiceMesh System (Istio-based)|about 2 core|about  3.6 G |
 | kubesphere-devops-system（All-in-one）| KubeSphere DevOps System | about 34 m| about 2.69 G|
 | kubesphere-devops-system（Multi-node）|KubeSphere DevOps System | about 0.47 core| about 8.6 G|  |
 | kubesphere-logging-system |KubeSphere logging system| 56 m | about 2.76 G |
 | metrics-server | enable HPA and "kubectl top" |about 5 m|about 44.35 MiB|
 | GitLab + Harbor | Source code repository & Image registry (3rd party App)| about 0.58 core | about 3.57 G|


## Components Version

The components marked with `*` are required in minimal installation, others are pluggable components.

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

KubeSphere Installer allows you to scale the number of nodes, see [Add new node](../add-nodes).


## Uninstall

Uninstall will remove KubeSphere from the machine, this operation is irreversible and dangerous, see [Uninstall](../uninstall).
