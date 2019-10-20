---
title: "Architecture"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## Separation of front and back ends

KubeSphere adopts the separation of front and back ends, also realizes a cloud native design, the back ends' service components can communicate with external systems through the REST API, see [API documentation](https://kubesphere.io/docs/v2.0/api/kubesphere) for more details. All component are included in the architecture diagram below. KubeSphere can run anywhere from on-premise datacenter to any cloud to edge. In addition, it can be deployed on any Kubernetes distribution.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190810073322.png)

## Components List

| Back-end component | Function description |
|---|---|
|Ks-account| provides API relating to the user and the privilege management|
|Ks-apiserver| The API interface of the entire cluster management, the communication hub between the modules within the cluster, and the cluster security control |
|Ks-apigateway| isresponsible for handling service requests and all tasks | during API calls
|Ks-console| offers KubeSphere console service |
|Ks-controller-manager| implements business logic, such as creating corresponding permissions for enterprise space; Or when creating a service policy, generate the corresponding | such as the Istio configuration
|Metrics-server| Kubernetes’ monitoring component collects Metrics information from Kubelet of each node. |
|Prometheus| provides clusters, nodes, workloads, API objects and other related monitoring data and services |
|Elasticsearch| provides cluster log indexing, querying, data management and other services, which can also be used to reduce resource consumption at the time of installation against your existing ES
| Fluent Bit | enables log receiving and forwarding. Collected information can be send to ElasticSearch, Kafka |
Jenkins| provides CI/CD pipeline service |
|SonarQube| is an optional installation that provides code static checking and quality analysis |
| source-to-image | will automatically compile and package the Source code into Docker Image, which is convenient to quickly build Image |
|Istio| provides microservice governance and traffic control, such as grayscale publishing, canary publishing, fuse, traffic mirror and so on |
|Jaeger | collects Sidecar data and provided the distributed Tracing service |
|OpenPitrix | provides application templates, application deployment and management services 
|Alert | provides custom Alert service | at the cluster, Workload, Pod, and container levels
|Notification| is an universal Notification service; it currently supports mail Notification|
|redis| stores the data of ks-console and ks-account in the memory storage system |
|MySQL| is the cluster back-end component database for monitoring, alarm, DevOps, OpenPitrix Shared MySQL service |
|PostgreSQL |SonarQube and Harbor's back-end database |
|OpenLDAP| is responsible for centralized storage and management of user account information and docking with external LDAP|
| Storage | built-in CSI plug-in docking cloud platform storage services, have optional installation of open source NFS/Ceph/Gluster client |
| Network | can optionally install Calico/Flannel and other open source network plug-ins to support docking with cloud platform SDN|

## 3rd Party Tools

In addition to the components listed above, KubeSphere also supports [Harbor](https://github.com/goharbor/harbor) and [GitLab](https://about.gitlab.com/) as optional installations that you can install according to your project requires.

## Service Components

Each component has many service components, see [Service Components](../../infrastructure/components) for more details.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017163549.png)


