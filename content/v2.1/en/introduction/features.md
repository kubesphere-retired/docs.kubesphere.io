---
title: "Features and Benefits"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## Overview

As an enterprise container platform, KubeSphere helps enterprises to build out a more robust and feature-rich platform, includes most common functionalities needed for enterprise Kubernetes strategy.

KubeSphere provides **workload management, Service Mesh (Istio-based), DevOps projects (CI/CD), Source to Image, multi-tenancy management, multi-dimensional monitoring, log query and collection, alerting and notification, service and network, application management, infrastructure management, image registry management, application management**. It also supports multiple open source storage and Network, as well as high-performance cloud storage services.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200202153355.png)

The following modules elaborate on the key features and benefits provided by KubeSphere container platform.

## Provisioning and Maintaining Kubernetes

### Provisioning Kubernetes Cluster

KubeSphere Installer can help you to deploy Kubernetes on your infrastructure out of box, provisioning Kubernetes cluster with high availability and self healing. It's recommended that at least three master nodes need to be configured behind a load balancer with integrated or independent clustered deployment of etcd that stores all the cluster state information.

### Kubernetes Resource Operation

KubeSphere provides graphical interface for creating and managing Kubernetes’ resources, including Pods and Containers, Workloads, Secrets and ConfigMaps, Services and Ingress, Jobs and CronJobs, HPA, etc. As well as strong observability includes resources' monitoring, events and logging.


### Cluster Upgrades and Scaling

An enterprise-grade solution should support rolling upgrades of Kubernetes clusters, such that the cluster and the cluster API is always available even while the cluster is being upgraded. KubeSphere Installer provides ease of setup, installation, management and maintenance. Additionally, it will provide the ability to rollback to previous stable version upon failure. Also, a single Kubernetes cluster can scale horizontally to support large sets of workloads by using KubeSphere Installer.

## Built-in DevOps Support

KubeSphere integrates tightly with Jenkins and other standard CI/CD tools, or automated workflows and tools including binary-to-image (B2I) and source-to-image (S2I) process to get source code into ready-to-run container images.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200202220455.png)

### CI/CD Pipeline

- CI/CD pipelines and build strategies based on Jenkins, streamline the creation and automation of Development, Test and Production pipelines, supports for dependency cache to accelerate build and deployment.
- Ships out of box a Jenkins build strategy and client
plugin to create a Jenkins pipeline based on Git repository/SVN, you can define any steps and stages in built-in jenkinsfile.
- Design a visualized control panel to create CI/CD pipelines, delivers complete visibility simplifying user interaction.
- Integrated source code quality analysis, supports output and collect logs of each step.


### Source to Image

Source-to-Image (S2I) is a toolkit and workflow for building reproducible container images from source code. S2I produces ready-to-run images by injecting source code into a container image and letting the container prepare that source code for execution.

S2I allows you to publish your service to Kubernetes without writing Dockerfile. You just provide source code repository address, and specify the target image registry, other configurations will be set automaticly. And all configurations are stored as different resources in Kubernetes, your project will be automaticly published to Kubernetes and the image will be pushed to target registry as well.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200204131749.png)

### Binary to Image

As similar as S2I, Binary to Image (B2I) is a toolkit and workflow for building reproducible container images from binary (e.g. Jar, War, Binary package).

You just need to upload your application binary package, and specify the image registry which you want to push, other configurations will be set automaticly. And all configurations are stored as different resources in Kubernetes, then your project will be automaticly published to Kubernetes as well.

## Service Mesh (Istio-based)

KubeSphere service mesh composed of a set of ecosystem projects, including Istio (v1.3.3), Envoy and Jaeger, etc. We've designed a unified user interface to use and manage these sophisticated tools in a single console, and most features are out-of-box and has been designed from developer's perspective, which means KubeSphere can help you to reduce the learning curve since you don't need to deep dive into those seperated tools.

KubeSphere service mesh provides fine-grained **traffic management**, **observability**, **tracing**, and **service identity and security** for a distributed microservice architecture, so the developer can focus on business value. With a service mesh layer on KubeSphere, cloud native apps can better track, route and optimize communications with Kubernetes.


### Traffic Management

- **Canary release** provides canary rollouts, and staged rollouts with percentage-based traffic splits.
- **Blue-green deployment** allows the new version of the application is deployed in the green environment and tested for functionality and performance. Once the testing results are successful, application traffic is routed from blue to green. Green then becomes the new production.
- **Traffic mirroring** enables teams to bring changes to production with as little risk as possible. Mirroring sends a copy of live traffic to a mirrored service.
- **Circuit breakers** allows users to set limits for calls to individual hosts within a service, such as the number of concurrent connections or how many times calls to this host have failed.

### Visualization

KubeSphere service mesh has the ability to visualize the connections between microservices and look at the topology of how they interconnect. Observability also be useful in understanding cloud-native microservice interconnections.

### Distributed Tracing

Based on Jaeger, KubeSphere service mesh enables users to track how each service interacts with these other functions. This allows a deeper understanding about request latency, bottlenecks, serialization and parallelism via visualization.


## Multi-tenant Management

- Multi-tenancy: Provide unified authentication based on fine-grained roles and three-tier authority management.
- Unified authentication: Support the docking to the centralized authentication system with enterprises based on LDAP/AD protocol. And support single sign-on (SSO) to realize the unified authentication of tenant identity.
- Authority management: The authority level is divided into three levels, namely, cluster, enterprise space and project. From high to low, we ensure the resource sharing as well as the isolation among different roles at multiple levels. Fully guarantee resource security.



## Multi-dimensional Monitoring

- Fully monitoring dashboard can be operated through a visual interface, while at the same time, the open standard interface is easy to connect with the enterprise operation and maintenance system, so as to unify the operation and maintenance entry to realize centralized operation and maintenance.
- Three-dimensional second-level monitoring: Instruct the three-dimensional monitoring with second-level frequency and dual-dimensions for 16 indicators.
- In the cluster resource dimension, we provide multiple indicators such as CPU utilization, memory utilization, CPU load average, disk usage, inode utilization, disk throughput, IOPS, network card rate, container group running state, ETCD monitoring, API Server monitoring.
- In the dimension of application resources, we provide five monitoring indicators such as CPU consumption, memory consumption, number of container clusters, network outflow rate and network inflow rate for the application. Besides, we support the query by the amount of sorting and custom time range as well as fast location of exceptions.
- Provide resource usage ranking by node, enterprise space, project, etc.
- Provide service component monitoring to quickly locate component failures.


## Alerting and Notification System

- Support indicator alerting based on multi-tenancy and multi-dimensional monitoring. Currently, the warning strategy supports two levels. One is the cluster administrator to node level and the other is the tenant to workload.
- Flexible alerting policy: You can customize an alerting policy that contains multiple alerting rules, and you can specify notification rules and repeat alerting rules.
- Rich monitoring warning indicators: Provide monitoring warning indicators at node level and workload level. It includes many monitor alerting indicators such as container cluster group, CPU, memory, disk and the network.
- Flexible alerting rules: You can customize the detection cycle length, duration and alerting level of a monitoring index.
- Flexible notification delivery rules: You can customize the notification delivery period and notification list. Mail notification is currently supported.
- Custom repeat alerting rules: Support to set the repeat alerting cycle, maximum repeat times, and the alerting level


## Log Query and Collection

- Provide multi-tenant log management. In KubeSphere's log search system, different tenants can only see their own log information.
- Contain multi-level log queries (project/workload/container group/container and keywords) as well as flexible and convenient log collection configuration options.
- Support multiple log collection platforms such as Elasticsearch, Kafka, Fluentd.

Application management and orchestration
- Use open source OpenPitrix to provide app store and app repository services to provide users with the management of the application lifecycle.
- Users can quickly and easily deploy all the services of a complete application based on application templates.


## Infrastructure Management

Support storage management, host management and monitoring, resource quota management, mirroring database warehouse management, permission management and mirror security scanning. With Harbor mirror warehouse built-in, KubeSphere supports to Docker add or private Harbor mirror warehouse.



## Multiple Storage Solutions Support

- Support GlusterFS, CephRBD, NFS and other open source storage.
- Enable NeonSAN CSI plug-in to connect QingStor NeonSAN to meet core business requirements with lower latency, more resilient, higher performance storage.
- QingCloud CSI plug-in connects QingCloud platform with various performance block storage services.


## Multiple Network Solutions Support

- Support Calico, Flannel and other open source network solutions.
- Developed load balancer plug-in Porter for Kubernetes deployment on physical machines.
