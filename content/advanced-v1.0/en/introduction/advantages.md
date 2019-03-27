---
title: "Advantages"
---

## Vision

Kubernetes has now become the de facto standard for deploying containerized applications at scale in private, public and hybrid cloud environments. However, some of users who get started to use Kubernetes may feel slightly difficult since the Kubernetes has many complicated components that need to be installed and deployed, such as storage and network part. Typically, Kubernetes offers some open source solutions or projects as the storage and network service solutions. It's not an easy task to install, maintain and operate multiple components in some way. For the users, the learning curve and the barriers are too high to get started quickly.

KubeSphere run Kubernetes as a service and flexibly manage the computing resources, allows your computing resources can be scheduled based on service requirements and update strategies. So the number of workloads/Pods increases or decreases with service traffic changes, ensuring stable service running, enables you to focus on those more important businesses and processes. 

As a distributed system, KubeSphere has ability to create Kubernetes applications, service discovery, CI/CD pipeline, cluster autoscale, operation & troubleshooting, microservice governance, logging and resource monitoring, etc. In other words, Kubernetes is a great open source project (or thought of as a framework), while KubeSphere is a very specialized enterprise-grade product that comes in many engineering applicabilities, aimed to resolve users' pain points in complex business scenarios, and concentrate on providing users with better and more professional user experience.

Most importantly, KubeSphere provides the best solutions for both storage and networking. For example, not only support open source storage such as Ceph RBD and GlusterFS, but also offers the high-performance cloud storage solutions that were powered by QingCloud, [QingCloud Block Storage ](https://docs.qingcloud.com/product/storage/volume/) and [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/) as the persistent storage. With the integration of the QingCloud CSI and NeonSan CSI plugins, it can provide more stable and secure storage for enterprise applications and data. As for the networking, it supports Calico and Flannel such open source networking projects as the industry's cloud networking solution.


## Why KubeSphere？


Cloud-native and cloud infrastructure applications are developed much fast for enterprises looking to achieve digital transformation. KubeSphere provides large-scale container orchestration and management to the enterprise, aimed at helping application development teams and IT operations teams develop to deploy applications with speed and consistency that meet business demands.

- Enterprise-ready Functionality
- High Availability
- High Resource Utilization
- Extensible Resource Isolation


## Advantages 

### Flexible and Stable Storage

- Support multiple storage classes as persistent storage service, inregrates CSI plugins and other storage clients.
- Support open source storage such as Ceph RBD, Glusterfs, NFS, etc.
- Ability to use QingCloud Block Storage and NeonSAN to provide high performance storage services.


### Scalability and Reliability

- Ability to add new nodes to existing cluster, support on-demand cluster expansion.
- Support for Horizontal Pod Autoscaler to ensure high availability and reliability of applications.

### Multidimensional Monitoring 

- Multidimensional monitoring with full coverage each layer, including cluster, node, workspace, namespace, workload, Pod, container.
- Provide comprehensive, multidimensional, fine-grained and flexible monitoring API.
- Rich monitoring metrics, visualized and concise metrics on UI, provide real-time metrics, trends, ranking, support search for any period, etc. 

### Multi-tenant Management 

- Provide a multi-level and fine-grained access control system, including clusters, workspaces, projects and DevOps levels.
- Role based access control, allows admin to dynamically configure authorization and authentication policies.
- Support AD/LDAP, support account synchronization through different systems (e.g. gitlab, jenkins), ability to connect with the enterprise's account system.

### Security

- API security, API Gateway and authentication system to ensure API security.
- Network security, based on Kubernetes NetworkPolicy to implement internal network isolation.
- Operating system security, based on Kubernetes namespace to implement resource isolation.

### Empower DevOps Team

- Out-of-the-box DevOps, without any complicated Jenkins plugin configuration.
- Ability to deploy applications to Kubernetes, provide a flexible, clean and customizable build environment.
- Role based access control, secure isolated CI/CD operating spaces. 
- Provide Jenkinsfile in & out of SCM (Source Code Management), reduce learning curve of Jenkinsfile and improve operation efficiency.


### Easy-to-use UI 


- User-friendly UI and wizard-style user experience, reduce the learning cost of Kubernetes.
- One-click cluster installation and one-stop application deployment/O&M are supported.
- Embrace Kubernetes, keep its native storage concepts and functions into UI, much easier and friendly for Kubernetes users.

### Extensible Design 

- In addition to provide resource management based on Kubernetes, users can also use KubeSphere integrated modules such as image registry, application template, monitoring and logging, as well as integrating self-built services
- Not only support Calico and Flannel such open source cloud networking solutions, but also allow users to use high-performance commercial network, such as [QingCloud SDN](https://www.qingcloud.com/products/sdn_passthrough/) if users have higher requirements for the network.