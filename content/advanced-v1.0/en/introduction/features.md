---
title: "Features"
---

<!-- KubeSphere 为用户提供了一个具备极致体验的 Web 控制台，让您能够像使用任何其他互联网产品一样，快速上手各项功能与服务。KubeSphere 目前集成了工作负载管理、DevOps 工程、多租户管理、多维度监控、服务与网络、应用管理、基础设施管理、镜像管理、应用配置密钥管理这九大功能模块，并支持对接多种开源的存储服务和高性能的商业存储。以下从专业的角度为您详解各个模块的功能服务：

|   功能    |       说明      |  
|------------|--------------|
| 工作负载管理  |对 Kubernetes 中的多种 workload 提供向导式管理界面，包括 Deployments，Daemon Sets，Stateful Sets，Jobs, CronJobs 等，并提供弹性伸缩 (HPA) 和容器健康检查支持。 | 
|DevOps 工程| 提供可视化 CI/CD 流水线，支持从仓库 (GitHub/SVN/Git)、代码编译、镜像制作、镜像安全、推送到仓库、应用版本、到定时构建的端到端流水线设置，支持使用者在开发、测试等环境下的端到端高效流水线能力，同时提供完整的日志功能，记录 CI/CD 流水线的每个过程。|
|多租户管理|提供基于多租户、细粒度安全架构设计，提供资源以及操作级别的权限管控，充分保障资源安全性，同时支持标准 AD/LDAP 协议，以实现集中化认证。平台服务间进行加密通信，提供操作审计日志，可对宿主机以及容器镜像进行安全扫描并发现漏洞。|
|多维度监控| 内置的监控中心提供多维度监控，从集群、企业空间、项目、工作负载/Pod、容器等多个层级，提供节点状态、CPU 和内存使用情况，存储、磁盘吞吐、网络出入和网卡流量以及 IOPS 等实时监控和历史数据。也可对接企业自有监控告警系统，提供对主机、容器以及应用服务多维度监控，内置监控服务支持高可用，下一个版本将集成告警服务。|
| 服务与网络管理 |基于原生 API，对 k8s 中的服务 (Service)、应用路由 (ingress) 等功能提供向导式管理界面，快速将应用暴露以供用户访问。高级版将集成 istio 中的 微服务治理、熔断、灰度发布、限流、智能路由等功能提供向导式管理界面。<br>如果部署在青云平台之上，可以使用插件对接青云的负载均衡器。 | 
| 应用管理 | 后端使用开源的 OpenPitrix 应用商店和仓库服务，为用户提供应用全生命周期管理功能，包括：应用仓库管理、应用拓扑图、APM、应用变更和发布、应用上下线审批、版本控制、鲁棒性测试等。 | 
| 基础设施管理 | 提供存储类型、主机、集群以及配额管理。存储既支持主流开源存储解决方案，也可对接青云的块存储和 NeonSAN。可批量添加主机，且对主机平台及系统弱依赖。并且支持镜像仓库管理、镜像复制、权限管理、镜像安全扫描。| 
|镜像管理| 提供镜像仓库管理，支持添加 Docker 或私有的 Harbor 镜像仓库。|
| 应用配置及秘钥 | 提供自定义应用配置组集中管理，支持配置文件历史查询功能；对不同应用版本可提供不同的应用配置，如：环境变量、端口管理、资源配置、健康检查、应用数据、服务配置等| -->

As a high-reliability enterprise-grade container management platform, KubeSphere provides an easy-to-use console with the awesome user experience that allows you to quickly get started with its functions just like other general products. KubeSphere integrated workload management, DevOps Delivery, multi-tenant management, multi-dimensional monitoring, service and network management, application management, infrastructure management, image management, and supports for ConfigMap and Secret management. It also supports multiple open source storage services and high-performance commercial storage. The following modules elaborate on the KubeSphere services from a professional point of view.

## Workload Management

KubeSphere provides a wizard-like UI for many kinds of workloads including Deployments, Daemon Sets, Statusful Sets, Jobs, CronJobs management, as well as Horizontal Pod Autoscaler (HPA) and container health checking support.

## DevOps Delivery

- Provide a visual CI / CD pipeline that enables users to draw their CI / CD workflow or build on the built-in Jenkinsfile repository. 
- Support for end-to-end pipeline, including source code repositories (GitHub / SVN / Git), code compilation, building image, image security, pushing to repositories, application versions, and timing builds. 
- Support for end-to-end high efficiency DevOps workflow capability in development, testing and so on.
- Provide complete log function to record every process of CI / CD Pipeline. Obviously, it enables modern DevOps teams to get fast iteration, much higher efficiency and much easier deployment over traditional delivery.


## Multitenancy

- Multitenancy based, fine-grained security architecture design.
- Resource and operation level of authority control, fully secure resources, while supporting the standard AD / LDAP protocol to achieve centralized authentication. 
- Support for Platform Services for encrypted communication, provide operational audit logs. 
- Nodes and images can be scanned so that vulnerabilities can be detected in advance. 

## Multi-dimensional Monitoring 

Through the built-in monitoring center, it provides users with multi-dimensional monitoring, including clusters, workspaces, projects, workloads / Pod, and containers.  

- It presents real-time monitoring metrics, including node status, CPU, memory and storage usage, disk throughput, Pod status, inode utilization, network bandwidth, support for both real-time and historical metrics searching.
- Support for matching with the enterprise's own monitoring system to provide multi-dimensional monitoring of host, container and application services. 
- The built-in Monitoring Service supports high availability, and alarm service will be available in v2.0.0. 

## Service and Network Management 

- Based on native API, provide wizard-style user interface for Service and ingress in k8s, expose the application to the network much easier for users. 
- Integration of microservice governance, circuit breakers, staged rollouts with percentage-based traffic split, rate limiting, intelligent routing features based on Istio to provide a wizard-like user interface.
- Support for connecting with QingCloud load balancer if KubeSphere is deployed on the QingCloud platform.

## Application Management 

- Ability to manage deployed applications, support for one-click deployment from App templates. 
- Using repository and application services of OpenPitrix as the backend services to provide users with full application lifecycle management features.


## Infrastructure Management  

- Providing StorageClass, node, cluster, and quota management. 
- Support for mainstream open source storage solutions such as GlusterFS, Ceph RBD, as well as QingCloud Block Storage and NeonSan, etc.
- Support for image registry management, image replication, fine-grained access control, image security scanning, etc.

## Image Management 

Ability to manage built-in image registry, support to add Docker Hub or Private Harbor image registry.

## Configuration Management 

- Providing centralized management of custom configuration, support for configuration history query
- Enabling different application configuration (e.g., Environment Variable, Port Management, ConfigMap and Secret, health check, application data configuration, service configuration.)