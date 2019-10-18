---
title: "安装说明（Dev 版）"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'KubeSphere 安装说明'
---

> 注意：KubeSphere 2.1.0 目前公开的 Installer 是 dev 版，方便社区用户在 2.1.0 GA 发布前的公测与体验，因此当前版本不建议用于正式环境。若在安装使用中遇到问题或发行 Bug，欢迎提交到 [GitHub issue](https://github.com/kubesphere/kubesphere/issues/new/choose)，产品使用问题与技术交流请在 [开发者社区](https://kubesphere.io/forum/) 提问。

[KubeSphere](https://kubesphere.io) 是在 [Kubernetes](https://kubernetes.io) 之上构建的**以应用为中心**的**企业级分布式容器平台**，为用户提供简单易用的操作界面以及向导式操作方式，KubeSphere 提供了在生产环境集群部署的全栈化容器部署与管理平台。

KubeSphere 支持部署和运行在包括**公有云、私有云、VM、BM 和 Kubernetes 等任何基础设施之上**，并且支持**在线安装与离线安装**，目前已在 **阿里云、腾讯云、华为云、青云 QingCloud、AWS、Google Cloud、Kubernetes** 上进行过[部署测试](https://github.com/kubesphere/ks-installer/issues/23)。 KubeSphere **所有版本 100% 开源免费**，已大规模服务于社区用户，广泛地应用在以容器为中心的开发测试及生产环境，大量服务平稳地运行在 KubeSphere 之上。

## 安装须知


> - 由于安装过程中需要更新操作系统和从镜像仓库拉取镜像，因此必须能够访问外网。如果不能访问外网，则需要下载离线安装包。
> - 当进行 all-in-one 模式进行单节点安装时，这个节点既是管理节点，也是工作节点。
> - 当进行 multi-node 模式安装多节点集群时，可在配置文件中设置集群各节点的角色。
> - 如果是新安装的系统，在 Software Selection 界面需要把 OpenSSH Server 选上。
> - KubeSphere 的部署架构中，由于各模块的服务和角色不同，分为管理节点和工作节点两个角色，即 Master 和 Node。
> - Master 节点由三个紧密协作的组件组合而成，即负责 API 服务的 kube-apiserver、负责调度的 kube-scheduler、负责容器编排的 kube-controller-manager。
> - 集群的持久化数据，由 kube-apiserver 处理后保存至 etcd 中。


## 快速安装（适用于快速体验测试）

KubeSphere 在 2.1 版本的 Installer 对各功能组件进行了**解耦**，支持 [自定义功能组件的安装方式](../intro#自定义安装可插拔的功能组件)，使最小化安装**更快速轻量且资源占用更少**，同时方便不同用户**按需选择不同的功能组件**。

快速安装的方式**无需配置持久化存储**，仅建议您用来快速安装测试和体验 2.1 的功能特性。正式环境建议配置持久化存储与集群的高可用部署。

> **安装在 Linux（Dev 版）**
> - [all-in-one](../all-in-one)：单节点安装，支持一键安装。
> - [multi-node](../multi-node)：多节点安装，支持一键安装。
>
> **安装在 Kubernetes（开发中）** 
> - [在 Kubernetes 在线部署 KubeSphere](../install-on-k8s)
> - [在 Kubernetes 离线部署 KubeSphere](../install-ks-offline) 


<!-- ### 离线安装

KubeSphere 支持离线安装，若机器无法访问外网，请下载离线安装包进行安装。

离线的安装步骤与在线安装一致，因此可直接参考 [all-in-one](../all-in-one) 和 [multi-node](../multi-node) 的安装指南下载安装。目前离线安装支持的操作系统如下，系统盘需保证 `100 G` 以上，主机配置规格的其它参数可参考在线安装的主机配置。
 
- CentOS 7.4/7.5   
- Ubuntu 16.04.4/16.04.5 -->

## 正式环境安装（需 2.1 GA 后安装）

目前的 Installer 还处于 Dev 版，不建议在正式环境安装。

正式环境建议使用多节点（Multi-node）部署，并且同时配置**持久化存储**与**集群的高可用**。

> - [持久化存储配置说明](../storge-configuration)：快速安装 KubeSphere 可选择配置部署 [OpenEBS](https://openebs.io/) 来提供持久化存储服务，方便初次安装但没有准备存储服务端的场景下进行**部署测试**。若在正式环境安装使用需配置 KubeSphere 支持的持久化存储服务，并准备相应的存储服务端。本文档说明安装过程中如何在 Installer 中配置持久化存储服务端。
> - [高可用集群配置与安装](../master-ha)：Multi-Node 模式安装 KubeSphere 可以帮助用户顺利地部署环境，由于在实际的生产环境我们还需要考虑 master 节点的高可用问题，本文档以配置负载均衡器 (Load Banlancer) 为例，引导您在安装过程中如何配置高可用的 Master 和 etcd 节点


## 自定义安装可插拔的功能组件

<!-- > 注意，在 CI/CD 流水线中发送邮件通知需要安装前预先在 Installer 中配置邮件服务器，配置请参考 [集群组件配置释义](../vars) (下一版本将支持安装后在 UI 统一配置邮件服务器)。 -->

Installer 支持在 KubeSphere 安装前和安装后单独安装可选的功能组件，您可以根据**业务需求和机器配置选择安装所需的组件**，体验 KubeSphere **完整的端到端的容器产品解决方案**，并且**所有组件都是开源免费**的。

### 可插拔功能组件介绍

> 提示：各功能组件的介绍可参考 [产品功能](../../introduction/features)，还可以在 [视频资源 - 入门教程](https://kubesphere.io/zh-CN/videos/) 下查看各个功能模块的视频 Demo，以下文档也提供了各模块的使用示例。
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
|* Kubernetes| v1.15.4 |
|* etcd|3.2.18|
|* Prometheus| v2.3.1|
|* Fluent Bit| v1.2.1|
|* Elasticsearch（**支持外接**）| v6.7.0 (**支持对接 ElasticSearch 7.x**)|
|Istio | v1.3.2 |
|OpenPitrix| v0.4 |
|Jenkins| v2.176.2 |
|SonarQube| v7.4 |
|GitLab | 11.8.1 |
|Harbor | 1.7.5 |

> 说明：KubeSphere 对 Kubernetes 版本的兼容原则是 `最新的版本 + 往前两个版本`，因为 Kubernetes v1.16 淘汰了一些 API group，如 extensions/v1beta1，这个 API group 被 helm 和很多 charts 使用到，需要等 helm 和 charts 更新后才能兼容 1.16，并且 v2.1 是在 1.5.x 上开发测试的，所以目前 v2.1 对 Kubernetes 兼容并支持的版本包括 1.5.x、1.4.x 和 1.3.x，近期刚发布的 Kubernetes 1.6 会在 KubeSphere 下一个版本兼容。

> 提示：如果需要查看或修改存储、网络、组件版本、可选安装项 (如 GitLab、Harbor)、外部负载均衡器、Jenkins、SonarQube、邮件服务器等配置参数时，可参考以下说明进行修改，集群组件配置释义文档对 installer 中的安装配置文件 `conf/vars.yml` 进行说明，简单介绍每一个字段的意义，参考 [自定义组件安装（安装前）](../vars)。

<!-- #### 安装 QingCloud 负载均衡器插件 (可选)

服务或应用路由如果通过 LoadBalancer 的方式暴露到外网访问，则需要安装对应的云平台负载均衡器插件来支持。如果在 QingCloud 云平台安装 KubeSphere，建议在 `conf/vars.yml` 中配置 QingCloud 负载均衡器插件相关参数，installer 将自动安装 [QingCloud 负载均衡器插件](https://github.com/yunify/qingcloud-cloud-controller-manager)，详见 [安装 QingCloud 负载均衡器插件](../qingcloud-lb)。 -->

### 如何开启可选功能组件的安装

- 安装前，请下载 installer 后参考 [自定义组件安装（安装前）](../vars) 在 `conf/vars.yml` 中进行修改。
- 安装后，请参考 [自定义组件安装（安装后）](../components) 通过 kubectl 编辑 ConfigMap 进行修改。

## 运维指南（开发中）

<!-- ### 升级

若您的机器已安装的环境为 1.0.x 或 2.0.x 版本，我们强烈建议您升级至最新的高级版 2.1.0，最新的 Installer 支持将 KubeSphere 从 1.0.x (或 2.0.0) 环境一键升级至目前最新的 2.1.0，详见 [升级指南](../upgrade)。 -->

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



