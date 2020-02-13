---
title: "安装说明"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'KubeSphere 安装说明'
---

[KubeSphere](https://kubesphere.com.cn) 是在 [Kubernetes](https://kubernetes.io) 之上构建的**以应用为中心**的**企业级分布式容器平台**，为用户提供简单易用的操作界面以及向导式操作方式，KubeSphere 提供了在生产环境集群部署的全栈化容器部署与管理平台。

KubeSphere 支持部署和运行在包括**公有云、私有云、虚机、裸机 和 Kubernetes 等任何基础设施之上**，KubeSphere 可以部署在公有云托管的 Kubernetes 之上 (如 GKE、EKS、ACK)，也支持部署在私有化的 Kubernetes 之上 (如 kubeadm、k3s、RKE 部署的集群)。目前已在 **阿里云、腾讯云、华为云、青云 QingCloud、AWS、Google Cloud、Kubernetes、GKE、RKE** 上进行过[部署测试](https://github.com/kubesphere/ks-installer/issues/23)。同时，KubeSphere 支持**在线安装与离线安装**。

[KubeSphere](https://github.com/kubesphere) **所有版本 100% 开源免费**，已大规模服务于社区用户，广泛地应用在以容器为中心的开发测试及生产环境，大量服务平稳地运行在 KubeSphere 之上。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191207004917.png)


## 安装须知


> - 由于安装过程中需要更新操作系统和从镜像仓库拉取镜像，因此必须能够访问外网。如果不能访问外网，则需要下载离线安装包。
> - 当进行 all-in-one 模式进行单节点安装时，这个节点既是管理节点，也是工作节点。
> - 当进行 multi-node 模式安装多节点集群时，可在配置文件中设置集群各节点的角色。
> - 如果是新安装的系统，在 Software Selection 界面需要把 OpenSSH Server 选上。
> - KubeSphere 的部署架构中，由于各模块的服务和角色不同，分为管理节点和工作节点两个角色，即 Master 和 Node。
> - Master 节点由三个紧密协作的组件组合而成，即负责 API 服务的 kube-apiserver、负责调度的 kube-scheduler、负责容器编排的 kube-controller-manager。
> - 集群的持久化数据，由 kube-apiserver 处理后保存至 etcd 中。


## 快速安装（适用于快速体验测试）

KubeSphere 在 2.1 版本的 Installer 对各功能组件进行了**解耦**，**快速安装将默认仅开启最小化安装（Minimal Installation），** 支持在安装前或安装后 [自定义可插拔的功能组件的安装](../intro#自定义安装可插拔的功能组件)，使最小化安装**更快速轻量且资源占用更少**，方便不同用户**按需选择安装不同的功能组件**。

快速安装的方式**无需配置持久化存储**，仅建议您用来快速安装测试和体验 2.1 的功能特性。正式环境建议配置持久化存储与集群的高可用部署。

### 安装在 Linux

> - [all-in-one](../all-in-one)：单节点安装，支持一键安装。
> - [multi-node](../multi-node)：多节点安装，支持一键安装。
>
> 提示：离线安装可参考 [离线安装多节点 Kubesphere 2.1](https://kubesphere.com.cn/forum/d/437-centos7-7-multinode-kubesphere2-1-offline)。


### 安装在 Kubernetes

参考 [在 Kubernetes 在线部署 KubeSphere](../install-on-k8s)

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


Installer 支持在 KubeSphere 安装前和安装后单独安装可选的功能组件，您可以根据**业务需求和机器配置选择安装所需的组件**，体验 KubeSphere **完整的端到端的容器产品解决方案**，并且 **所有组件都是开源免费的**。

### 可插拔功能组件介绍

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191207140846.png)

> 提示：各功能组件的介绍可参考 [产品功能](../../introduction/features)，还可以在 [视频资源 - 入门教程](/zh-CN/videos/) 下查看各个功能模块的视频 Demo，以下文档也提供了各模块的使用示例。
> - KubeSphere 多租户日志系统（Logging）：[日志查询](../../toolbox/log-search) 与 [日志收集](../../platform-settings/log-gathering)；
> - KubeSphere 多维度告警通知系统（Alerting & Notification）：[设置集群节点告警](../../monitoring/alert-policy) 与 [设置工作负载告警](../../monitoring/workload-alert-policy)；
> - KubeSphere 一站式 DevOps 系统（CI/CD）：[图形化构建流水线](../../quick-start/jenkinsfile-out-of-scm)、[构建流水线发布项目至 Kubernetes](../../quick-start/devops-online)、[Source-to-Image](../../quick-start/source-to-image)；
> - KubeSphere 应用与微服务治理系统（ServiceMesh）：[微服务的灰度发布与 Tracing](../../quick-start/bookinfo-canary)、[熔断](../../application/circuit-breaking)、[流量治理](../../application/traffic-gov)；
> - Metrics server：[HPA 弹性伸缩](../../quick-start/hpa)；
> - GitLab & Harbor：[安装使用内置 GitLab](../../installation/gitlab-installation)、[安装使用内置 Harbor](../../installation/harbor-installation)、[基于 GitLab + Harbor 构建 CI/CD 流水线](../../harbor-gitlab-devops-offline)。

### 可插拔功能组件列表

<font color=red>注意：开启可选功能组件之前，请先参考下表确认集群的可用 CPU 与内存空间是否充足（下表是计算得出的各组件 CPU 与内存的 Request 值），否则可能会因为资源不足而导致的机器崩溃或其它问题。</font>


|组件名称| 组件功能 | CPU |内存| 说明 |
| --- | --- | --- | --- | --- |
| openpitrix-system| 应用商店 |约 0.3 core | 约 300 MiB| 支持应用声明周期管理<br>与应用一键部署，建议安装 |
| kubesphere-alerting-system | 告警&邮件通知 | 约 0.08 core | 约 80 M | alerting 与 notification 安装时<br>建议同时开启|
| istio-system |应用与微服务治理（ServiceMesh）|约 2 core|约  3.6 G | 支持灰度发布、流量治理、Tracing，建议安装 |
| kubesphere-devops-system（单节点）| 构建镜像（s2i/b2i）和 CI/CD 流水线|约 34 m| 约 2.69 G| 与容器平台打通形成<br>完整的**一站式DevOps 方案**|
| kubesphere-devops-system（多节点）| 构建镜像（s2i/b2i）和 CI/CD 流水线|约 0.47 core| 约 8.6 G| 多节点安装 DevOps 需要<br>有一个节点的**可用内存大于 8G** |
| kubesphere-logging-system |内置的日志系统| 约 56 m | 约 2.76 G | 建议开启，否则无法使用内置的日志系统|
| metrics-server |支持 HPA 的使用|约 5 m|约 44.35 MiB| 若需要使用 [HPA](../../quick-start/hpa) 则建议安装 |
| GitLab + Harbor | 私有代码仓库 + 私有镜像仓库 | 约 0.58 core |约 3.57 G| 第三方应用 |


> 说明：
> - 此表格中的 CPU 与内存占用数据仅为最小资源占用，在实际的集群环境中建议预留更充足的资源空间。
> - 单位后缀 m 表示千分之一核，即 1 Core = 1000m。

KubeSphere 2.1.0 中的相关组件包括了以下版本，其中带 * 号的组件为使用 Installer **最小化安装**时的默认安装项，其它组件为可选安装项：

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
|SonarQube| v7.4 |
|GitLab | 11.8.1 |
|Harbor | 1.7.5 |

> 说明：KubeSphere 对 Kubernetes 版本的兼容原则是 `最新的版本 + 往前两个版本`，因为 Kubernetes v1.16 淘汰了一些 API group，如 extensions/v1beta1，这个 API group 被 helm 和很多 charts 使用到，需要等 helm 和 charts 更新后才能兼容 1.16，并且 v2.1 是在 1.15.x 上开发测试的，所以目前 v2.1 对 Kubernetes 兼容并支持的版本包括 1.15.x、1.14.x 和 1.13.x，近期刚发布的 Kubernetes 1.16 会在 KubeSphere 下一个版本兼容。


<!-- #### 安装 QingCloud 负载均衡器插件 (可选)

服务或应用路由如果通过 LoadBalancer 的方式暴露到外网访问，则需要安装对应的云平台负载均衡器插件来支持。如果在 QingCloud 云平台安装 KubeSphere，建议在 `conf/common.yaml` 中配置 QingCloud 负载均衡器插件相关参数，installer 将自动安装 [QingCloud 负载均衡器插件](https://github.com/yunify/qingcloud-cloud-controller-manager)，详见 [安装 QingCloud 负载均衡器插件](../qingcloud-lb)。 -->

### 如何开启可选功能组件的安装

参考 [安装可插拔的功能组件](../install-openpitrix) 目录下的 7 篇文档，开启可插拔功能组件的安装。**注意，在开启安装前，请先确保机器的 CPU 与内存资源满足最低要求，参考上述的可插拔功能组件列表**。


## 集群参数配置

在获取 Installer 并解压至目标安装机器后，如果需要修改网络、组件版本等集群配置相关参数，可参考以下说明进行修改，本文档对 Installer 中的安装配置文件 `conf/common.yaml` 进行说明，简单介绍每一个字段的意义。参考 [集群参数配置）](../vars)。


## 运维指南

### 升级

若您的机器已安装的环境为 2.0.x 版本，我们强烈建议您升级至最新的高级版 2.1.0，最新的 Installer 支持将 KubeSphere 从 2.0.x 环境一键升级至目前最新的 2.1.0，详见 [升级指南](../upgrade)。注意，2.1.0 目前暂不支持回滚至 2.0.x。

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
