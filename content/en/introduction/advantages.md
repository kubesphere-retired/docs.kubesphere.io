---
title: "Advantages"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## Vision

Kubernetes has now become the de facto standard for deploying containerized applications at scale in private, public and hybrid cloud environments. However, many people tend to be confused when they use Kubernetes for Kubernetes has many components and some of them need to be installed and deployed by users, such as storage and network. At present, Kubernetes only provides open source solutions or projects, which may be difficult to install, maintain and operate to some extent. For users, learning costs and thresholds are both high , and it is not easy to get started quickly.
 
If you have to deploy your application on the cloud, why not use KubeSphere to help you run Kubernetes for better management of running resources? This would make you continue running applications and workloads and concentrate on these more important businesses. Because Kubernetes cluster, application deployment, service discovery, CI/CD pipeline, Redis cluster capacity enlargement, microservice governance,  logging and monitoring can be quickly managed through KubeSphere. In other words, Kubernetes is a wonderful open-source platform (or considered as a framework), but KubeSphere is a very professional enterprise platform product that focuses on addressing users’ difficulties in complex business scenarios to provide a better user experience.

What matters most is that KubeSphere offers optimal solutions in terms of storage and networking. For example, not only supports open source storage such as [Ceph RBD](https://ceph.io/) and [GlusterFS](https://www.gluster.org/), but also offers the high-performance cloud storage solutions that are powered by QingCloud such as [QingCloud Block Storage ](https://docs.qingcloud.com/product/storage/volume/) and [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/) as the persistent storage. With the integration of the [QingCloud CSI](https://github.com/yunify/qingcloud-csi) and [NeonSan CSI](https://github.com/yunify/qingstor-csi) plugins, it can provide more stable and secure storage for enterprise applications and data. As for the networking, it supports Calico and Flannel such open source networking projects as the industry's cloud networking solution, and will support QingCloud SDN with VPC and subnet enabled for end user soon.


## Why KubeSphere？

KubeSphere provides high-performance and scalable managing containerized services for enterprise users, aiming to help enterprises accomplish the digital transformation driven by the new generation of Internet technology, accelerate the speed of iteration and delivery of business to meet the ever-changing business needs of enterprises.


## Awesome User Experience and Wizard UI

- User interface based on development, testing and operations-friendly, Design concept of guided user experience to reduce the Learning Cost of Kubernetes
- Users can deploy all services of a complete application in one click based on application templates, and UI provides product life-cycle management.
 
## High reliability and High Availability

- Automatic Elastic Scaling Service: Deploying the flexible scaling of container that support dynamic lateral scaling and container resources based on visits to ensure high availability of cluster and container resources.
- Security Service: Supporting the setting of health inspection probes for containers to check its health status and ensure the reliability of business.
 
## Containerized DevOps Delivery

- DevOps easy to use: DevOps does not need to configure Jenkins for it based on visual CI/CD pipeline editing, and it is equipped with abundant CI/CD pipeline templates
- Source to Image (S2i)：It can get the code from the existing code warehouse and build the image automatically through S2i to complete the application deployment and push it to the image warehouse automatically without writing Docker files.
- End-to-End Pipelining Setting: supporting end-to-end pipeline settings from warehouse (GitHub/SVN/Git), code compilation, mirror production, mirror security, push warehouse, version release, to scheduled build.
- Security Management: Supporting static analysis scanning for code quality safety management in DevOps project
- Logging: Log records the whole process of CI/CD pipeline operation.
 
## Out-of-Box Microservice Governance

- Flexible Micro-service Framework: Providing visual micro-service governance functions based on Istio micro-service framework , and dividing Kubernetes services into finer-grained services to support non-intrusive micro-service governance.
- Excellent governance functions: support excellent micro-service governance functions such as gray level publishing, fusing, flow monitoring, flow control, current limiting, link tracking, intelligent routing, etc.
 
## Multiple Persistent Storage Support

- Support open-source storage schemes such as GlusterFS, CephRBD, NFS and  stateful storage
- Neon SAN CSI plug-in docks with QingStor Neon SAN to meet core business needs with lower latency, more flexible and higher performance storage.
- QingCloud CSI plug-in docking with various performance block storage services of QingCloud cloud platform
 
## Flexible Network Solution Support

- Supporting open-source network solutions such as Calico and Flanne
- QingCloud’s load equalizer plug-in and Porter that can be used in physical machine deployment of Kubernetes
- SDN capability for commercial verification：QingCloud SDN can be docked through QingCloud CNI plug-in to achieve safer and higher performance network support.
 
## Multidimensional Monitoring and Logging

- Comprehensive monitoring operation and maintenance can be worked through a visual interface. At the same time, the open standard interfaces are connected with enterprise operation and maintenance systems to achieve centralized operation and maintenance by unified operation and maintenance entry.
- Visual subsecond  monitoring：Second-Frequency, dual dimension, Stereoscopic Monitoring of Sixteen Indicators, and component monitoring is provided to locate component faults quickly
- Providing a rank of resource consumption by node, enterprise space, project, etc.
- Supporting indicators alarm based on multi-tenant, multi-dimensional monitoring, and its alarm strategy supports two levels including cluster node and workload now.
- Providing multi-tenant log management. Tenants can only see their own log information in kubesphere's query system.