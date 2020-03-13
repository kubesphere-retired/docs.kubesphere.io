---
title: "安装说明"
keywords: 'kubernetes, docker, kubesphere, jenkins, installation'
description: 'KubeSphere 安装说明'
---

[KubeSphere](https://kubesphere.com.cn) 是在 [Kubernetes](https://kubernetes.io) 之上构建的 **企业级分布式容器平台**，为用户提供简单易用的操作界面以及向导式操作方式，还能够帮助一键快速安装与运营 Kubernetes 集群。

KubeSphere 支持部署和运行在包括 **公有云、私有云、虚机、物理机 和 Kubernetes 等任何基础设施之上**，KubeSphere 可以部署在公有云托管的 Kubernetes 之上 (如 GKE、EKS、ACK)，也支持部署在私有化的 Kubernetes 之上 (如 kubeadm、k3s、RKE 部署的集群)。目前已在 **阿里云、腾讯云、华为云、青云 QingCloud、AWS、Google Cloud、Kubernetes、GKE、RKE** 上进行过[部署测试](https://github.com/kubesphere/ks-installer/issues/23)。并且，KubeSphere 支持 **在线安装与离线安装**。

[KubeSphere](https://github.com/kubesphere) **所有版本 100% 开源免费**，已大规模服务于社区用户，广泛地应用在以容器为中心的开发测试及生产环境，大量服务平稳地运行在 KubeSphere 之上。

![KubeSphere Installer 概览](https://pek3b.qingstor.com/kubesphere-docs/png/20200305093158.png)

## 安装须知

> - 由于安装过程中需要更新操作系统和从镜像仓库拉取镜像，因此必须能够访问外网。如果不能访问外网，则需要下载离线安装包。
> - 当进行 all-in-one 模式进行单节点安装时，这个节点既是管理节点，也是工作节点。
> - 当进行 multi-node 模式安装多节点集群时，可在配置文件中设置集群各节点的角色。
> - 如果是新安装的系统，在 Software Selection 界面需要把 OpenSSH Server 选上。
> - 安装之前建议关闭防火墙，或参考 [端口防火墙](../port-firewall) 开放指定端口。

KubeSphere 在 2.1 版本的 Installer 对各功能组件进行了 **解耦**，**快速安装将默认仅开启最小化安装（Minimal Installation）**，支持在安装前或安装后 [自定义可插拔的功能组件的安装](../intro#自定义安装可插拔的功能组件)，使最小化安装 **更快速轻量且资源占用更少**，方便不同用户 **按需选择安装不同的功能组件**。

## 快速安装（适用于开发测试环境）

快速安装的方式 **无需配置持久化存储**，仅建议您用来快速安装测试和体验 2.1 的功能特性。正式环境建议配置持久化存储与集群的高可用部署。

### 安装在 Linux

#### 在线安装

- [all-in-one](../all-in-one)：单节点安装，支持一键安装。
- [multi-node](../multi-node)：多节点安装，支持一键安装。

#### 离线安装

离线环境可参考 [离线安装 KubeSphere 2.1.1](https://kubesphere.com.cn/forum/d/852-kubesphere-2-1-1-kubernetes)。

### 安装在 Kubernetes

#### 在线安装

确保您的 Kubernetes 集群满足前提条件，然后再开启安装。

- [前提条件](../prerequisites)
- [在 Kubernetes 在线部署 KubeSphere](../install-on-k8s)

#### 离线安装

请参考 [在 Kubernetes 离线安装 KubeSphere](/en/installation/install-on-k8s-airgapped/)。

## 正式环境安装

### 安装在 Linux

正式环境需要使用多节点（Multi-node）部署，并且同时配置 **持久化存储** 与 **集群的高可用**。

> - [持久化存储配置说明](../storage-configuration)： KubeSphere 默认开启了 Local Volume 方便初次安装但没有准备存储服务端的场景下进行**部署测试**。若在 **正式环境安装使用需配置 KubeSphere 支持的持久化存储服务**，并准备相应的存储服务端。本文档说明安装过程中如何在 Installer 中配置持久化存储服务端。
> - [高可用集群配置与安装](../master-ha)：Multi-Node 模式安装 KubeSphere 可以帮助用户顺利地部署环境，由于在实际的生产环境我们还需要考虑 master 节点的高可用问题，本文档以配置负载均衡器 (Load Banlancer) 为例，引导您在安装过程中如何配置高可用的 Master 和 etcd 节点。

### 安装在 Kubernetes

需要注意的是，为方便快速安装测试，[在 Kubernetes 在线部署 KubeSphere](../install-on-k8s) 文档中使用的存储类型是基于 OpenEBS 创建的 Local Volume。在正式环境安装 KubeSphere 之前，建议您保证 Kubernetes 集群本身已配置了高可用，即 Kubernetes 集群满足以下两个条件：

- 集群已配置了持久化存储，并创建了 [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/)
- Master 节点数量 ≥ 3，且配置了负载均衡方案满足高可用

若满足以上两个条件，即可参考 [在 Kubernetes 在线部署 KubeSphere](../install-on-k8s) 进行安装。

## 自定义安装可插拔的功能组件

Installer 支持在 KubeSphere 安装前和安装后单独安装可选的功能组件，您可以根据 **业务需求和机器配置**，选择安装所需的功能组件，体验 KubeSphere **完整的端到端的容器产品解决方案**，并且 **所有组件都是开源免费的**。

- [KubeSphere 可插拔功能组件概览](../pluggable-components)
- [KubeSphere 应用商店](../install-openpitrix)
- [KubeSphere DevOps 系统](../install-devops)
- [KubeSphere 日志系统](../install-logging)
- [KubeSphere Service Mesh（基于 Istio）](../install-servicemesh)
- [KubeSphere 告警通知系统](install-alert-notification)
- [Metrics-server（HPA）](instal-metrics-server)

![Pluggable Components](https://pek3b.qingstor.com/kubesphere-docs/png/20200104004443.png)

<!-- KubeSphere 2.1.0 中的相关组件包括了以下版本，其中带 * 号的组件为使用 Installer **最小化安装**时的默认安装项，其它组件为可选安装项：

|  组件 |  版本 |
|---|---|
|* KubeSphere| 2.1.0|
|* Kubernetes| v1.15.5 |
|* etcd|3.2.18|
|* Prometheus| v2.3.1|
|Fluent Bit| v1.2.1|
|Elasticsearch（ **支持外接** ）| v6.7.0 ( **支持对接 ElasticSearch 7.x** )|
|Istio | v1.3.3 |
|OpenPitrix| v0.4 |
|Jenkins| v2.176.2 |
|SonarQube| v7.4 | -->

## 升级

若您的机器已安装的环境为 2.0.x 或 2.1.0 版本，我们建议您升级至最新的高级版 2.1.1，Installer 2.1.1 支持将 KubeSphere 从 2.0.x 或 2.1.0 环境一键升级至目前最新的 2.1.1，详见 [升级指南](../upgrade)。

## 集群参数配置

在获取 Installer 并解压至目标安装机器后，如果需要修改网络、组件版本等集群配置相关参数，可参考以下说明进行修改，本文档对 Installer 中的安装配置文件 `conf/common.yaml` 进行说明，简单介绍每一个字段的意义。参考 [集群参数配置](../vars)。


## 运维指南

### 集群节点扩容

安装 KubeSphere 后，在正式环境使用时可能会遇到服务器容量不足的情况，这时就需要添加新的节点 (node)，然后将应用系统进行水平扩展来完成对系统的扩容，配置详见 [集群节点扩容](../add-nodes)。

### 卸载

卸载将从机器中删除 KubeSphere，该操作不可逆，详见 [卸载说明](../uninstall)。

## 高危操作

KubeSphere 支持管理节点和 etcd 节点高可用，保证集群稳定性，同时基于 kubernetes 底层调度机制，可以保证容器服务的可持续性及稳定性，但并不推荐无理由关闭或者重启节点，因为这类后台操作均属于高危操作，可能会造成相关服务不可用，请谨慎操作。执行高危操作需将风险告知用户，并由用户以及现场运维人员同意之后，由运维人员进行后台操作。比如以下列表包含了高危操作和禁止操作，可能造成节点或集群不可用：

**高危操作列表**

| 序列 | 高危操作|
|---|---|
| 1 |重启集群节点或重装操作系统。|
| 2 |建议不要在集群节点安装其它软件，可能导致集群节点不可用。|

**禁止操作列表**

| 序列 | 禁止操作|
|---|---|
| 1 |删除 `/var/lib/etcd/`，删除 `/var/lib/docker`，删除 `/etc/kubernetes/`，删除 `/etc/kubesphere/`。 |
| 2 |磁盘格式化、分区。|
