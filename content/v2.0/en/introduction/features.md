---
title: "Features"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

As an enterprise container platform, KubeSphere provides an easy-to-use console with awesome user experience that allows you to quickly get started with various functions.

KubeSphere provides rich features ranging from the **workload management, microservice governance (Service Mesh), DevOps projects (CI/CD), Source to Image (S2I), multi-tenancy management, multi-dimensional monitoring, log query and collection, alerting and notification, service and network, application management, infrastructure management, image registry management, application management and so on**. It also supports a various of open source storage and network solutions, as well as high-performance cloud storage services, business products regarding storage and network.

We are also developing [Porter](https://github.com/kubesphere/porter), the open source load balancer plugin which is suitable for Kubernetes installed on bare metal. 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017145758.png)

The following modules elaborate on the KubeSphere services from a professional point of view.

## Kubernetes Resource Management

KubeSphere provides easy-to-use visual wizard UI for various Kubernetes resources so as to manage workloads, image registry, service and application router as well as the key configuration. It also provides Horizontal Pod Autoscaler (HPA) and container check, and supports millions of container resource configuration to ensure businesses’ high availability under the peak concurrent.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017150242.png)

## Microservice Governance (Service Mesh)

- Flexible microservice framework: Based on the Istio microservice framework, KubeSphere provides a visualized microservice governance function to manage Kubernete’s services in fine-grained control.
- Complete governance functions: Support microservice governance such as circuit breaker, gray release, traffic control, current limitation, link tracking and the intelligent routing. At the same time, the system supports microservice governance without modifying your source code.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190713002111.png)


## Multi-tenant Management

- Multi-tenancy: Provides unified authentication based on fine-grained roles and three-tier authorization management.
- Unified authentication: Supports integration with enterprise centralized authentication system that is based on LDAP/AD protocol. And support single sign-on (SSO) to realize the unified authentication of tenant identity.
- Authorization management: The authorization hierarchy is divided into three levels, namely, cluster, workspace and project. From high to low, we ensure the resource sharing as well as the isolation among different roles at multiple levels with resource security fully guaranteed.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017150642.png)

## DevOps Project (CI/CD)

- Out-of-the-box DevOps: Supports visual CI/CD Jenkins-based pipeline editing with no Jenkins configuration required, and provides rich CI/CD pipeline plug-ins.
- CI/CD graphical pipelining provides mail notification and adds multiple execution conditions
- End-to-end pipeline setup: Supports end-to-end pipeline setup from repository (GitHub/SVN/Git), code compiling, container image generating, image security scanning, pushing to repository, release, and scheduled pipeline trigger.
- Security management: Support code static analysis scanning to manage the security of code quality in DevOps project.
- Logging: The logs record the whole process of CI/CD pipeline running.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017153203.png)

## Source to Image

 Source to Image (S2i) provides the ability to pull source code from code repository, compile the code, make container image and push the image to a target repository. The whole process of S2I will be completed in the form of task (Job).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017152542.png)

## Multidimensional Monitoring

- fully monitoring dashboard can be operated through a visual interface, while at the same time, the open standard interface is easy to connect with the enterprise operation and maintenance system, so as to unify the operation and maintenance entry to realize centralized operation and maintenance.
- Three-dimensional second-level monitoring: Instruct the three-dimensional monitoring with second-level frequency and dual-dimensions for 16 indicators.
- In the cluster resource dimension, we provide multiple indicators such as CPU utilization, memory utilization, CPU load average, disk usage, inode utilization, disk throughput, IOPS, network card rate, Pod running state, ETCD monitoring, API Server monitoring.
- In the dimension of application resources, we provide five monitoring indicators such as CPU consumption, memory consumption, number of container clusters, network outflow rate and network inflow rate for the application. Besides, we support the query by the amount of sorting and custom time range as well as fast location of exceptions.
- Provide resource usage ranking by node, enterprise space, project, etc.
- Provide service component monitoring to quickly locate component failures.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017150930.png)

## Alerting and Notification System

- Provides monitor metrics and alert polices based on multiple tenancy and multiple dimensions. Currently, the alerting policy supports two levels. One is node level for the cluster administrator and the other is workload level for a tenant.
- Flexible alerting policy: You can customize an alerting policy that contains multiple alerting rules, and you can specify notification rules and repeat alerting rules.
- Rich alerting polices: Provide monitoring metrics and alerting polices at both node level and workload level. It includes many monitoring metrics such as Pod, CPU, memory, disk, network, etc.
- Flexible alerting rules: You can customize time period and consecutive times of the probe, and configure how serious the alert is.
- Flexible notification delivery rules: You can customize the notification delivery period and notification list. Mail notification is currently supported only.
- Custom repeat alerting rules: Support to set the repeat alerting cycle, maximum repeat times, and the alerting level

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017151933.png)

## Log Query and Collection

- Provides multi-tenant log management. In KubeSphere's log search system, different tenants can only see their own log information.
- Contains multi-level log queries (project/workload/Pod/container and keywords) as well as flexible and convenient log collection configuration options.
- Supports a variety of log collection platforms such as Elasticsearch, Kafka, Fluentd.

Application management and orchestration
- Use open source OpenPitrix to provide app store and app repository services to provide users with the management of the application lifecycle.
- Users can quickly and easily deploy all the services of a complete application based on application templates.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017151418.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017152007.png)

## Infrastructure Management

KubeSphere provides the ability to operate infrastructure including storage management, host management and monitoring, resource quota management, image registry management, authorization management and image security scanning. KubeSphere also supports adding public Docker hub and private Harbor as external image registries in addition to shipping built-in Harbor image registry.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017151554.png)

## Multiple Storage Solutions Support

- Supports GlusterFS, CephRBD, NFS and other open source storage.
- Provides NeonSAN CSI plug-in to leverage QingStor NeonSAN storage with lower latency, more resilient, higher performance to meet enterprise core business requirements.
- Provides QingCloud CSI plug-in to use various block storage services in QingCloud.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017151706.png)

## Multiple Network Solutions Support

- Supports Calico, Flannel and other open source network solutions.
- Load balancer Porter developed for Kubernetes deployed on bare metal environment.
