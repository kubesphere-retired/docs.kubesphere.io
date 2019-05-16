---
title: "安装说明"
---

[KubeSphere](https://kubesphere.io) 是在目前主流容器调度平台 [Kubernetes](https://kubernetes.io) 之上构建的 **企业级分布式多租户容器管理平台**，为用户提供简单易用的操作界面以及向导式操作方式，KubeSphere 提供了在生产环境集群部署的全栈化容器部署与管理平台。

<!-- ## 前提条件

下载最新的 [KubeSphere Advanced 2.0.0 - dev](https://kubesphere.io/download) 至待安装机器中。 -->

## 安装 KubeSphere

KubeSphere 安装支持 [all-in-one](../all-in-one) 和 [multi-node](../multi-node) 两种模式，即支持单节点和多节点安装两种安装方式。

另外，KubeSphere Installer 集成了 **Harbor** 和 **GitLab**，但默认情况下不会安装 Harbor 和 GitLab，用户可以根据团队项目的需求来配置安装，仅需安装前在配置文件 `conf/vars.yml` 中简单配置即可，参考 [安装内置 Harbor](../harbor-installation) 和 [安装内置 GitLab](../gitlab-installation)。

**说明:**

> - 由于安装过程中需要更新操作系统和从镜像仓库拉取镜像，因此必须能够访问外网。如果不能访问外网，则需要下载离线安装包。
> - KubeSphere 集群的架构中，由于各自服务的不同，分为管理节点和工作节点两个角色，即 Master 和 Node。
> - Master 节点由三个紧密协作的组件组合而成，即负责 API 服务的 kube-apiserver、负责调度的 kube-scheduler、负责容器编排的 kube-controller-manager。
> - 集群的持久化数据，由 kube-apiserver 处理后保存至 etcd 中。
> - 当进行 all-in-one 模式进行单节点安装时，这个节点既是管理节点，也是工作节点。
> - 当进行 multi-node 模式安装多节点集群时，可在配置文件中设置集群各节点的角色。
> - 如果是新安装的系统，在 Software Selection 界面需要把 OpenSSH Server 选上。

### All-in-One 模式

`All-in-One` 模式即单节点安装，支持一键安装，仅建议您用来测试或熟悉安装流程和了解 KubeSphere 高级版的功能特性，详见 [All-in-One 模式](../all-in-one)。在正式使用环境建议使用 Multi-Node 模式。

### Multi-Node 模式

`Multi-Node` 即多节点集群安装，高级版支持 master 节点和 etcd 的高可用，支持在正式环境安装和使用，详见 [Multi-Node 模式](../multi-node)。

### 离线安装

KubeSphere 支持离线安装，若机器无法访问外网，请下载离线安装包进行安装。

离线的安装步骤与在线安装一致，因此可参考以上两种安装模式的安装指南进行安装。目前离线安装支持的操作系统如下，系统盘需保证 100 G 以上，主机配置规格的其它参数可参考在线安装的主机配置。
 
- CentOS 7.4/7.5   
- Ubuntu 16.04.4/16.04.5

#### 存储配置说明

Multi-Node 模式安装 KubeSphere 可选择配置部署 NFS Server 来提供持久化存储服务，方便初次安装但没有准备存储服务端的场景下进行部署测试。若在正式环境使用需配置 KubeSphere 支持的持久化存储服务，并准备相应的存储服务端。本文档说明安装过程中如何在 Installer 中配置 [QingCloud 云平台块存储](https://docs.qingcloud.com/product/storage/volume/)、[企业级分布式存储 NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)、[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[GlusterFS](https://www.gluster.org/)、[Ceph RBD](https://ceph.com/) 这类持久化存储的安装参数，详见 [存储配置说明](../storage-configuration)。

#### 集群组件配置释义

如果需要查看或修改网络、组件版本、可选安装项 (如 GitLab、Harbor)、外部负载均衡器、Jenkins、邮件服务器等配置参数时，可参考以下说明进行修改，本文档对 installer 中的安装配置文件 `conf/vars.yml` 进行说明，简单介绍每一个字段的意义。

#### 安装 QingCloud 负载均衡器插件 (可选)

服务或应用路由如果通过 LoadBalancer 的方式暴露到外网访问，则需要安装对应的云平台负载均衡器插件来支持。如果在 QingCloud 云平台安装 KubeSphere，建议在 `conf/vars.yml` 中配置 QingCloud 负载均衡器插件相关参数，installer 将自动安装 [QingCloud 负载均衡器插件](https://github.com/yunify/qingcloud-cloud-controller-manager)，详见 [安装 QingCloud 负载均衡器插件](../qingcloud-lb)。

#### 安装内置 Harbor (可选)

KubeSphere Installer 集成了 Harbor 的 Helm Chart (版本为 harbor-18.11.1)，内置的 Harbor 作为可选安装项，需 `安装前` 在配置文件 `conf/vars.yml` 中进行配置。用户可以根据团队项目的需求来配置安装，详见 [安装内置 Harbor](../harbor-installation)。

#### 安装内置 GitLab (可选)

​KubeSphere Installer 集成了 Harbor 的 Helm Chart (版本为 harbor-18.11.1)，内置的 Gitlab (版本为 v11.3.4) 作为可选安装项，需 `安装前` 在配置文件 `conf/vars.yml` 中进行配置。用户可以根据团队项目的需求来配置安装，详见 [安装内置 GitLab](../gitlab-installation)。

#### Master 和 etcd 节点高可用配置

Multi-Node 模式安装 KubeSphere 可以帮助用户顺利地部署环境，由于在实际的生产环境我们还需要考虑 master 节点的高可用问题，本文档以配置负载均衡器 (Load Banlancer) 为例，引导您在安装过程中如何配置高可用的 Master 和 etcd 节点，详见 [Master 和 etcd 节点高可用配置](../master-ha)。

<!-- ## 升级

若您的机器已安装的环境为 v1.0.1 版本，我们强烈建议您升级至最新的版本 v2.0.0，最新的 Installer 支持将 KubeSphere 从 v1.0.1 环境一键升级至目前最新的 v2.0.0，详见 [升级](../upgrade)。 -->

## 集群节点扩容

安装 KubeSphere 后，在正式环境使用时可能会遇到服务器容量不足的情况，这时就需要添加新的节点 (node)，然后将应用系统进行水平扩展来完成对系统的扩容，配置详见 [集群节点扩容](../add-nodes)。

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


## 卸载

卸载将从机器中删除 KubeSphere，该操作不可逆，详见 [卸载说明](../uninstall)。

## 组件版本信息

KubeSphere Advanced 2.0.0 中的相关组件将默认安装以下版本：

|  组件 |  版本 |
|---|---|
|KubeSphere| Advanced Edition 2.0.0|
|Kubernetes| v1.13.5|
|etcd|3.2.18|
|OpenPitrix| v0.3.5|
|Elasticsearch| v6.7.0 |
|Prometheus| v2.3.1|
|Jenkins| v2.138 |
|SonarQube| v7.4 |