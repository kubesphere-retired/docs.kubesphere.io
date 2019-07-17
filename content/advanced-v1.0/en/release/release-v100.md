---
title: "Release Notes For 1.0.0"
keywords: ''
description: ''
---

KubeSphere Advanced Edition 1.0.0 was released on **December 10th, 2018**. 

## Download Advanced Edition 1.0.0

Go to KubeSphere's website to download the [Advanced Edition 1.0.1](https://kubesphere.io/download/?type=advanced).

## About Advanced Edition 1.0.0

Currently, KubeSphere provides three editions: 

- Advanced Edition 1.0.0
- Community Edition 
- Express Edition 

The Community Edition and Express Edition mainly provide multi-tenancy management, cluster operation and maintenance, application management and other basic features. The Advanced Edition is designed for enterprise users, aimed to meet the enterprises' complicated requirements. As for the different roles and multi hirarchy of users, Advanced Edition provides a variety of business feature modules and professionally managed, enterprise-grade Kubernetes.

## Installation

Please reference [installation instructions](../../installation/intro) before start installation.

## New Features and Capabilities

- Advanced Edition 1.0.0 is enterprise ready, and is based on [Kubernetes 1.12.3](https://github.com/kubernetes/kubernetes/releases/tag/v1.12.3)
- Provide multi-level tenant management for workspace, projects and DevOps project, support for built-in roles and custom roles
- Support LDAP unified authentication
- Support for multiple kind of workloads, including deployments, StatefulSets, DaemonSets, Jobs, CronJobs
- Support Horizontal Pod Autoscaler (HPA) within Deployment
- Support quota management
- Support Secrets and ConfigMaps management
- Support for image registry management
- Support services and routes management
- Support for open source network plugin, e.g. Calico, Flannel 
- Support for open source storage plugins, e.g. GlusterFS, Ceph RBD and NFS 
- Based on installation on the QingCloud platform, you can use [QingCloud Block Storage](https://github.com/yunify/qingcloud-csi), [SDN Direct Network](https://github.com/yunify/hostnic-cni) and [QingCloud Controller Load Balancer plugin](https://github.com/yunify/qingcloud-cloud-controller-manager)
- Support [QingStor NeonSAN](https://github.com/yunify/qingstor-csi) storage
- Provide Jenkins-based pipeline with visual editing, built-in templates for multiple functional properties, and supports Jenkinsfile in & out SCM
- Support GitHub/Git/SVN as Source Code repository 
- Provide credential management in DevOps project 
- Optional Harbor image registry and GitLab installation, integrated with Jenkins
- Based on Prometheus, it provides multi-dimensional monitoring services, including clusters, nodes, workspaces, projects, workloads, pods, containers, etc. It also displays CPU, memory, network, storage, IO and other metrics in real-time, history, and ranking. Provides API which enables integration with enterprises' existing monitoring systems
- Provide application repository management based on [OpenPitrix](https://openpitrix.io)
- Support for minimal single node and Multi-node (Highly available) installation that can be deployed on existing Kubernetes clusters. Support multiple infrastructures such as physical machines, virtual machines, and cloud hosts, and support hybrid installation.
- Support high availability for master, etcd and monitoring nodes.

