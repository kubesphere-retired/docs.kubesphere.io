---
title: "Instruction"
---

<!-- [KubeSphere](https://kubesphere.io) 是在目前主流容器调度平台 [Kubernetes](https://kubernetes.io) 之上构建的 **企业级分布式多租户容器管理平台**，为用户提供简单易用的操作界面以及向导式操作方式，KubeSphere 提供了在生产环境集群部署的全栈化容器部署与管理平台，以及细粒度的资源监控和 CI/CD 流水线等。

## 前提条件

需下载 KubeSphere 高级版的 Installer 至目标安装机器，若还未获取请前往 [官网](https://kubesphere.io/download) 下载。

## 安装 KubeSphere

KubeSphere 安装支持 [all-in-one](../all-in-one) 和 [multi-node](../multi-node) 两种模式，即支持单节点和多节点安装两种安装方式。 KubeSphere Installer 采用 [Ansible](https://www.ansible.com/) 对安装目标机器及安装流程进行集中化管理配置。采用预配置模板，可以在安装前通过对相关配置文件进行自定义实现对安装过程的预配置，以适应不同的 IT 环境，帮助您快速安装 KubeSphere。

另外，KubeSphere Installer 集成了 **Harbor** 的 Helm Chart，但默认情况下不会安装 Harbor 镜像仓库，因为内置的 **Harbor** 作为可选安装项，用户可以根据团队项目的需求来配置安装，仅需安装前在配置文件 `conf/vars.yml` 中简单配置即可，参考 [安装内置 Harbor](../harbor-installation)。

**说明:**

> - 由于安装过程中需要更新操作系统和从镜像仓库拉取镜像，因此必须能够访问外网。
> - KubeSphere 集群的架构中，由于各自服务的不同，分为管理节点和工作节点两个角色，即 Master 和 Node。
> - Master 节点由三个紧密协作的组件组合而成，即负责 API 服务的 kube-apiserver、负责调度的 kube-scheduler、负责容器编排的 kube-controller-manager。
> - 集群的持久化数据，由 kube-apiserver 处理后保存至 etcd 中。
> - 当进行 all-in-one 模式进行单节点安装时，这个节点既是管理节点，也是工作节点。
> - 当进行 multi-node 模式安装多节点集群时，可在配置文件中设置集群各节点的角色。
> - 如果是新安装的系统，在 Software Selection 界面需要把 OpenSSH Server 选上。 -->

[KubeSphere](https://kubesphere.io) is an enterprise-grade distributed multi-tenant container management platform that built on [Kubernetes](https://kubernetes.io), the current mainstream container orchestration platform. It provides an easy-to-use interface and wizard-based manipulation, supports for a full-stack container deployment and management platform in production environment, as well as fine-grained resource monitoring and CI/CD pipelines.

## Prerequisites

Download the [KubeSphere Advanced Edition](https://kubesphere.io/download) to the target machine.

## Install KubeSphere

KubeSphere installation supports [all-in-one](../all-in-one) and [multi-node](../multi-node) modes, all-in-one means single master and node on one host, and multi-node means master(s) and node(s) is deployed into multiple nodes. Kubesphere Installer uses [Ansible](https://www.ansible.com/) to centralize the configuration of the target machine and installation process. It enables pre-configuration template of the installation to customize the associated configuration files to suit different IT environments, which can help you to quickly install KubeSphere.

In addition, you can choose to integrate Harbor image registry into cluster since it is an optional installation. By default Harbor will not be installed, users need to pre-configure the `conf/vars.yml` to install harbor, reference [Integrate Harbor Installation](../harbor-installation).

**Note:** 

- The external network must be accessible because of installation is required to update the OS and pull images and dependencies from the outside.
- There are two roles in the architecture of KubeSphere cluster, i.e. Master and Node. The master node consists of three closely coordinated components, namely, kube-apiserver for exposing the Kubernetes API, kube-scheduler for scheduling decisions, and kube-controller-manager for running controllers.
- Etcd as the consistent and highly-available key value store used as Kubernetes’ backing store for all cluster data.
- All-in-one is used for a single-node installation, the node is both a management and a working node.
- When you install a multi-node cluster with the multi-node mode, you can set the roles of the cluster nodes in the configuration file.
- Notice that select OpenSSH Server from the Software Selection step if your host(s) is a newly installed system,.

<!-- ### All-in-One 模式

`All-in-One` 模式即单节点安装，支持一键安装，仅建议您用来测试或熟悉安装流程和了解 KubeSphere 高级版的功能特性，详见 [All-in-One 模式](../all-in-one)。在正式使用环境建议使用 Multi-Node 模式。

### Multi-Node 模式

`Multi-Node` 即多节点集群安装，高级版支持 master 节点和 etcd 的高可用，支持在正式环境安装和使用，详见 [Multi-Node 模式](../multi-node)。

#### 存储配置说明

Multi-Node 模式安装 KubeSphere 可选择配置部署 NFS Server 来提供持久化存储服务，方便初次安装但没有准备存储服务端的场景下进行部署测试。若在正式环境使用需配置 KubeSphere 支持的持久化存储服务，并准备相应的存储服务端。本文档说明安装过程中如何在 Installer 中配置 [QingCloud 云平台块存储](https://docs.qingcloud.com/product/storage/volume/)、[企业级分布式存储 NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)、[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[GlusterFS](https://www.gluster.org/)、[Ceph RBD](https://ceph.com/) 这类持久化存储的安装参数，详见 [存储配置说明](../storage-configuration)。

#### Master 和 etcd 节点高可用配置

Multi-Node 模式安装 KubeSphere 可以帮助用户顺利地部署环境，由于在实际的生产环境我们还需要考虑 master 节点的高可用问题，本文档以配置负载均衡器 (Load Banlancer) 为例，引导您在安装过程中如何配置高可用的 Master 和 etcd 节点，详见 [Master 和 etcd 节点高可用配置](../master-ha)。

## 集群节点扩容

安装 KubeSphere 后，在正式环境使用时可能会遇到服务器容量不足的情况，这时就需要添加新的节点 (node)，然后将应用系统进行水平扩展来完成对系统的扩容，配置详见 [集群节点扩容](../add-nodes)。 -->

### All-in-One

`All-in-One` is single-node installation that supports one-click installation, it's only recommended for testing and experiencing the features of Advanced Edition, see [All-in-One](../all-in-one). By contrast, the Multi-node mode is recommended in a formal environment.

### Multi-Node 

`Multi-node` is used for a Multi-Node cluster installation, supports for installing a highly available master and etcd cluster and it's able to use in a formal environment, see [Multi-Node](../multi-node).

### Storage Configuration Instruction

The Multi-Node mode installation supports configure the NFS Server to provide a persistent storage service, it's only for testing the installation without preparing the storage server for the first time. If you are going to install KubeSphere in a formal environment, it's required to prepare and configure the corresponding storage server which is supported by KubeSphere. This page explains how to configure such persistent storage services as following, see [Storage Configuration Instruction](../storage-configuration) for the detailed guides.

- [QingCloud Block Storage](https://docs.qingcloud.com/product/storage/volume/)
- [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)
- [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)
- [GlusterFS](https://www.gluster.org/)
- [Ceph RBD](https://ceph.com/) 

### Creating Highly Available Master and Etcd Cluster

Multi-node installation can help uses to deploy KubeSphere to a cluster. However, we also need to consider the high availability of the master and etcd in a real production environment. This page uses the Load balancer as an example, walk you through how to configure highly available Master and etcd nodes installation, see [Creating Highly Available Master and Etcd Cluster](../master-etcd-ha).

### Add new node

After you install KubeSphere, you may run out of server capacity in a formal environment and need to add a new node, then scale the cluster horizontally to complete the system expansion, see [Add new node](../add-nodes).

<!-- ## 高危操作

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
| 2 |磁盘格式化、分区。| -->

### High-risk Operation

KubeSphere supports high availability of master and working nodes to ensure cluster stability, based on the underlying kubernetes scheduling mechanism to ensure the sustainability and stability. It is not recommended to shut down or restart nodes for no reason, because such  operations are high-risk operations may cause the service is not available, please operate with caution. High-risk operations are performed by informing users about the risks, the engineer is allowed to implement the backend operation after users and other engineers agree. For example, be aware of the following list describes high-risk and prohibited operations that may cause a node or cluster unavailable:

**List of high-risk Operations**  

| Sequence | High-risk Operation | 
|---|---|
| 1 | Restart the cluster node or reinstall the operating system. |
| 2 | It is recommended that you do not install additional software on the cluster node, which could make the cluster node unavailable. |

**Prohibitive operations** 

| Sequence | Prohibitive Operations | 
|---|---|
| 1 | Delete `/var/lib/etcd/`. Delete `/var/lib/docker`. Delete `/etc/kubernetes/`.  Delete `/etc/kubesphere/` |
| 2 | Disk formatting, partitioning. |


## Uninstall

<!-- 卸载将从机器中删除 KubeSphere，该操作不可逆，详见 [卸载说明](../uninstall)。 -->

Uninstall will remove KubeSphere from the machine, this operation is irreversible, see [Uninstall](../uninstall).


## Components Version

|Components | Version|
|---|---|
|KubeSphere| Advanced Edition v1.0.0|
|Kubernetes| v1.12.3|
|OpenPitrix| v0.3.5|
|Prometheus| v2.3.1|
|Jenkins| v2.138 |