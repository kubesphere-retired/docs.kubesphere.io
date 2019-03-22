---
title: "Advantages"
---

## Vision

As we all know, the open source project Kubernetes has become the de facto leader of orchestration platforms, as well as the King of the next generation of distributed architectures since its unique advantages for automated deployment, scalability, and containerized applications management. However, many people who study the Kubernetes may feel a bit overwhelmed because the Kubernetes has many complicated components that need to be installed and deployed, such as storage and networking part. Typically, Kubernetes offers some open source solutions or projects as the storage and network service. It may be quite difficult to install, maintain and operate in some way. For the users, the cost of learning and the barriers to entry are too high to get started quickly.

If you are going to deploy your application to the container cloud anyway, why not let KubeSphere run the Kubernetes as a service for you and better manage the running resources? It allows you to continue running applications and workloads, enables you to focus on those more important businesses and processes. This is because of how easy it is to quickly create Kubernetes applications, deploy applications, service discovery, CI / CD, cluster autoscale, operation & troubleshooting, micro-service governance, logging and resource monitoring, as well as many other powerful features of KubeSphere. In other words, Kubernetes is a great open source project (or thought of as a framework), while KubeSphere is a very specialized enterprise-grade product that comes in many engineering applicabilities, aimed to resolve users' pain points in complex business scenarios, and concentrate on providing users with better and more professional user experience.

Most importantly, KubeSphere provides the best solutions for both storage and networking. For example, not only support popular open source storage such as Ceph RBD and GlusterFS, but also offers the high-performance commercial storage solutions that were powered by QingCloud, [QingCloud Block Storage ](https://docs.qingcloud.com/product/storage/volume/) and [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/) as the persistent storage. With the integration of the QingCloud CSI and NeonSan CSI plugins, it's much convenient to use the block storage or NeonSan as the backend storage volumes to mount to workloads, enable to provide more stable and secure storage for enterprise applications and data. As for the networking, it enables Calico and Flannel such open source networking projects as the industry's cloud networking solution.


## Why KubeSphere？


KubeSphere provides enterprises with high-performance scalable container application management services, aimed at helping enterprises complete the next generation of Internet technology-driven digital transformation, and accelerate the rapid iteration and delivery of business To meet the changing business needs of the enterprise.

## Advantages 

### Flexible and Stable Storage Configuration

- Commercial storage services: ability to use QingCloud Block Storage and NeonSAN to provide convenient and controllable storage services.
- Support for using open source storage systems such as Ceph RBD, Glusterfs, NFS, etc.
- Embracing Kubernetes, keep its native storage concepts and functions into UI, much easier to use and friendly for Kubernetes users.
- Provide users with rich functions: storage class and volume management

### Scalability and Reliability

- Ability to add new node in the deployed cluster, support on-demand cluster expansion.
- Support for Horizontal Pod Autoscaler to ensure high availability and reliability of deployment and application.

### Multidimensional Monitoring 

- Fully and deeply integrated with Prometheus, the de facto standard in Cloud Native Monitoring domain.
- Providing comprehensive, multi dimensional, fine-grained and flexible monitoring API.
- Multidimensional monitoring with full coverage each layer, including cluster, node, workspace, namespace, workload, Pod, container.
- Rich monitoring metrics, visualize concise metrics on UI, provide real-time metrics, trends, ranking, support any period search, etc. 

### Multi-tenant Management 

- Providing a multi-level and fine-grained access control system, can be divided into clusters, workspaces, projects and DevOps levels for authorization.
- Based on the RBAC, allowing admins to dynamically configure authorization policies.
- Organization management, support multi-level user and group management,authority management for User Groups 
- support AD / LDAP, support account synchronization through many different systems (e.g. gitlab, jenkins), and much fast connecting to the enterprise's existing account system.

### Security

- API security, API Gateway and authentication system to ensure API security.
- Network security, based on Kubernetes NetworkPolicy to implement internal network isolation.
- Operating system security, based on Kubernetes namespace to implement resource isolation.

### Empower DevOps Team

- Offering Out-of-the-box DevOps, without any complicated Jenkins plugin configuration.
- DevOps project provides access to controlled, secure isolated CI/CD operating spaces. 
- Providing Jenkinsfile in & out of SCM (Source Code Management), visualize the CI/CD pipeline by web editing, reduce learning cost of Jenkinsfile and improve operation efficiency.
- Providing a flexible, clean and customizable build environment.

### Easy-to-use UI 

Providing development, testing, operation with user-friendly UI and wizard-style user experience, reduce the learning cost of Kubernetes.

### Loose Coupling Function Design 

- In addition to providing resource management based on Kubernetes, users can also use KubeSphere integrated modules such as image registry, application template, monitoring and logging, as well as the ability to configure to integrate self-built Services
- Not only support Calico and Flannel such open source cloud networking solutions, but also allow users to use high-performance commercial networking, such as [QingCloud SDN](https://www.qingcloud.com/products/sdn_passthrough/) if users have higher requirements for the network.