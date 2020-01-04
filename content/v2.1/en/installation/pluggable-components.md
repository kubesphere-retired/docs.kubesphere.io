---
title: "Enable Pluggable Components Installation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Enable Pluggable Components Installation'
---

## Enable Pluggable Components Installation

 KubeSphere has decoupled some core feature components in v2.1.0, these components are designed to be pluggable and support enabling them before or after installation. **By default, installer will be started with minimal installation** if you don't enable pluggable components in related configuration file.

### Use your Favorite Tools in a Unified Platform

KubeSphere has 6 pluggable components as following listed, you can enable their installation according to your demands.

It's highly recommended that you install these pluggable components to experience the complete and full-stack features and capabilities within KubeSphere, enables you to use your favorite tools in a unified platform and give you an end-to-end user experience, ensure your machines have sufficient CPU and memory before enable them.

- [KubeSphere Application Store](../install-openpitrix)
- [KubeSphere DevOps System](../install-devops)
- [KubeSphere Logging System](../install-logging)
- [KubeSphere Service Mesh](../install-servicemesh)
- [KubeSphere Alerting and Notification](install-alert-notification)
- [Metrics-server](instal-metrics-server)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200104004443.png)

## Pluggable Components Configuration Table

 > Attention: For multi-node installation, there should be at least `1` node needs to have more than 8G of available memory, which is used for dependencies cache in CI node.

 |Component| Feature | CPU |Memory|
 | --- | --- | --- | --- |
 | openpitrix-system| KubeSphere Application Store |about 0.3 core | about 300 MiB|
 | kubesphere-alerting-system | KubeSphere alerting and notification system | about 0.08 core | about 80 M |
 | kubesphere-devops-system（All-in-one）| KubeSphere DevOps System | about 34 m| about 2.69 G|
 | kubesphere-devops-system（Multi-node）|KubeSphere DevOps System | about 0.47 core| about 8.6 G|  |
 | istio-system |KubeSphere Service Mesh System (Istio-based)|about 2 core|about  3.6 G |
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
