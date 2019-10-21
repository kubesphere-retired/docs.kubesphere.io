---
title: "Features"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

As an enterprise container management platform, KubeSphere provides an easy-to-use console with the awesome user experience that allows you to quickly get started with various functions.

KubeSphere ranging from the **workload management, microservice governance (Service Mesh), DevOps projects (CI/CD), Source to Image, multi-tenancy management, multi-dimensional monitoring, log query and collection, alerting and notification, service and network, application management, infrastructure management, image registry management, application management**. It also supports multiple open source storage and Network, as well as high-performance cloud storage services.

We have also developed [Porter](https://github.com/kubesphere/porter), the open source Load Balancer plugin which is suitable for Kubernetes on Bare Metal. Support multiple open source storage and network plans and back high-performance business storage network services.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017145758.png)

The following modules elaborate on the KubeSphere services from a professional point of view.

## Kubernetes Resource Management

Provide easy graphical wizard UI for various Kubernetes’ underlying resources so as to manage workloads, image registry, service and application router as well as the key configuration. Provide Horizontal Pod Autoscaler (HPA) and container check. Support million of container resource configuration to ensure businesses’ high availability under the peak concurrent.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017150242.png)

## Microservice Governance (Service Mesh)

- Flexible microservice framework: Based on the Istio microservice framework, KubeSphere provides a visualized microservice governance function to subdivide Kubernete’s services into more detailed parts.
- Complete governance functions: Support microservice governances such as circuit breaker, gray release, traffic control, current limitation, link tracking and the intelligent routing. At the same time, we back the non-invasive microservice governance.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190713002111.png)


## Multi-tenant Management

- Multi-tenancy: Provide unified authentication based on fine-grained roles and three-tier authority management.
- Unified authentication: Support the docking to the centralized authentication system with enterprises based on LDAP/AD protocol. And support single sign-on (SSO) to realize the unified authentication of tenant identity.
- Authority management: The authority level is divided into three levels, namely, cluster, enterprise space and project. From high to low, we ensure the resource sharing as well as the isolation among different roles at multiple levels. Fully guarantee resource security.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017150642.png)

## DevOps Project (CI/CD)

- Out-of-the-box DevOps: Based visual CI/CD pipeline editing, no Jenkins configuration is required and there are rich CI/CD pipeline plug-ins.
- CI/CD graphical pipelining provides mail notification and adds multiple execution conditions
- End-to-end pipeline setup: Support end-to-end pipeline setup from repository (GitHub/SVN/Git), code compilation, mirror database production, mirror database security, push repository, release, and scheduled construction.
- Security management: Support code static analysis scanning to manage the security of code quality in DevOps project.
- Log: Logs completely records the whole process of CI/CD pipeline operation.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017153203.png)

## Source to Image

Obtain the code from the existing code repository by providing Source to Image (S2i). Then complete the deployment by building the mirror database from Source to Image, and push the mirror to the target repository. The process of building the mirror database will be completed in the form of task (Job).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017152542.png)

## Multidimensional Monitoring

- fully monitoring dashboard can be operated through a visual interface, while at the same time, the open standard interface is easy to connect with the enterprise operation and maintenance system, so as to unify the operation and maintenance entry to realize centralized operation and maintenance.
- Three-dimensional second-level monitoring: Instruct the three-dimensional monitoring with second-level frequency and dual-dimensions for 16 indicators.
- In the cluster resource dimension, we provide multiple indicators such as CPU utilization, memory utilization, CPU load average, disk usage, inode utilization, disk throughput, IOPS, network card rate, container group running state, ETCD monitoring, API Server monitoring.
- In the dimension of application resources, we provide five monitoring indicators such as CPU consumption, memory consumption, number of container clusters, network outflow rate and network inflow rate for the application. Besides, we support the query by the amount of sorting and custom time range as well as fast location of exceptions.
- Provide resource usage ranking by node, enterprise space, project, etc.
- Provide service component monitoring to quickly locate component failures.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017150930.png)

## Alerting and Notification System

- Support indicator alerting based on multi-tenancy and multi-dimensional monitoring. Currently, the warning strategy supports two levels. One is the cluster administrator to node level and the other is the tenant to workload.
- Flexible alerting policy: You can customize an alerting policy that contains multiple alerting rules, and you can specify notification rules and repeat alerting rules.
- Rich monitoring warning indicators: Provide monitoring warning indicators at node level and workload level. It includes many monitor alerting indicators such as container cluster group, CPU, memory, disk and the network.
- Flexible alerting rules: You can customize the detection cycle length, duration and alerting level of a monitoring index.
- Flexible notification delivery rules: You can customize the notification delivery period and notification list. Mail notification is currently supported.
- Custom repeat alerting rules: Support to set the repeat alerting cycle, maximum repeat times, and the alerting level

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017151933.png)

## Log Query and Collection

- Provide multi-tenant log management. In KubeSphere's log search system, different tenants can only see their own log information.
- Contain multi-level log queries (project/workload/container group/container and keywords) as well as flexible and convenient log collection configuration options.
- Support multiple log collection platforms such as Elasticsearch, Kafka, Fluentd.

Application management and orchestration
- Use open source OpenPitrix to provide app store and app repository services to provide users with the management of the application lifecycle.
- Users can quickly and easily deploy all the services of a complete application based on application templates.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017151418.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017152007.png)

## Infrastructure Management

Support storage management, host management and monitoring, resource quota management, image registry warehouse management, permission management and mirror security scanning. With Harbor mirror warehouse built-in, KubeSphere supports to Docker add or private Harbor mirror warehouse.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017151554.png)

## Multiple Storage Support

- Support GlusterFS, CephRBD, NFS and other open source storage.
- Enable NeonSAN CSI plug-in to connect QingStor NeonSAN to meet core business requirements with lower latency, more resilient, higher performance storage.
- QingCloud CSI plug-in connects QingCloud platform with various performance block storage services.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017151706.png)

## Multiple Network Support

- Support Calico, Flannel and other open source network solutions.
- Developed load balancer plug-in Porter for Kubernetes deployment on physical machines.
