---
title: "Introduction to Enabling Pluggable Components"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Introduction to How to Enable Pluggable Components of KubeSphere'
---

## Introduction

 KubeSphere has decoupled some core feature components since v2.1.0. These components are designed to be pluggable which means you can enable them either before or after installation. By default, KubeSphere will be started with a minimal installation if you don't enable them.

## Enable Pluggable Components

KubeSphere has six pluggable components as the following listed. You can enable any of them according to your demands.

It's highly recommended that you install these pluggable components to discover the complete and full-stack features and capabilities provided by KubeSphere. Please ensure your machines have sufficient CPU and memory before enabling them.

- [KubeSphere Application Store](../install-openpitrix)
- [KubeSphere DevOps System](../install-devops)
- [KubeSphere Logging System](../install-logging)
- [KubeSphere Service Mesh](../install-servicemesh)
- [KubeSphere Alerting and Notification](install-alert-notification)
- [Metrics-server](instal-metrics-server)

![Pluggable Components](https://pek3b.qingstor.com/kubesphere-docs/png/20200104004443.png)

## Pluggable Components Configuration Table

 > Attention: For multi-node installation, there should be at least `ONE` node having more than 8G of available memory, which is used for dependencies cache in CI node.

 The following table shows the name, description and rough CPU/memory required of each component.

 | Component | Feature | CPU | Memory |
 | --- | --- | --- | --- |
 openpitrix-system | Application Store | 0.3 core | 300 MiB |
 kubesphere-alerting-system | alerting and notification system | 0.08 core | 80 M |
 kubesphere-devops-system（All-in-one）| DevOps System | 34 m| 2.69 G |
 kubesphere-devops-system（Multi-node）| DevOps System | 0.47 core| 8.6 G |
 istio-system | Istio-based Service Mesh System | 2 core | 3.6 G |
 kubesphere-logging-system | logging system | 56 m | 2.76 G |
 metrics-server | enable HPA and "kubectl top" | 5 m | 44.35 MiB |
 GitLab + Harbor | Source code repository & Image registry (3rd party App) | 0.58 core | 3.57 G |

## Components Version

The components marked with `*` are required in minimal installation. Others are pluggable components.

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
