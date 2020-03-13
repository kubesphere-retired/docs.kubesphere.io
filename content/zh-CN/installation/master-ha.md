---
title: "Master 和 etcd 节点高可用配置"
keywords: ''
description: ''
---

Multi-Node 模式安装 KubeSphere 可以帮助用户顺利地部署一个多节点集群用于开发和测试，在实际的生产环境我们还需要考虑 master 节点的高可用问题，
因为如果 master 节点上的几个服务 kube-apiserver、kube-scheduler 和 kube-controller-manager 都是单点的而且都位于同一个节点上，一旦 master 节点宕机，可能不应答当前正在运行的应用，将导致 KubeSphere 集群无法变更，对线上业务存在很大的风险。

负载均衡器 (Load Balancer) 可以将来自多个公网地址的访问流量分发到多台主机上，并支持自动检测并隔离不可用的主机，从而提高业务的服务能力和可用性。除此之外，还可以通过 Keepalived 和 Haproxy 的方式实现多个 master 节点的高可用部署。

而 etcd 作为一个高可用键值存储系统，整个集群的持久化数据，则由 kube-apiserver 处理后保存到 etcd 中。etcd 节点至少需要 1 个，但部署多个 etcd (奇数个) 能够使集群更可靠。本文档以配置 [QingCloud 云平台](https://www.qingcloud.com) 的 [负载均衡器 (Load Balancer)](https://docs.qingcloud.com/product/network/loadbalancer) 为例，引导您如何配置高可用的 master 节点，并说明如何配置和部署高可用的 etcd 集群。



## 前提条件

- 请确保已参阅 [Multi-Node 模式](../multi-node)，本文档仅说明安装过程中如何修改配置文件来配置 master 节点高可用，该配置作为一个可选配置项，完整的安装流程和配置文件中的参数解释说明以 [Multi-Node 模式](../multi-node) 为准。
- 已有 [QingCloud 云平台](https://console.qingcloud.com/login) 账号，用于申请负载均衡器给多个 master 节点做负载均衡。

## Master 和 etcd 节点高可用架构

本示例准备了 6 台主机，主机规格参考 [Multi-Node 模式 - 节点规格](../multi-node)，将在其中 3 台部署 Master 和 etcd 集群，可编辑主机配置文件 `conf/hosts.ini` 来配置 Master 和 etcd 的高可用。

![Master 和 etcd 节点高可用架构](/master-ha-design.svg)

### 准备负载均衡器

以创建 QingCloud 云平台负载均衡器为例，简单说明其创建步骤，详细介绍可参考 [QingCloud 官方文档](https://docs.qingcloud.com/product/network/loadbalancer)。

#### 第一步：创建负载均衡器

登录 [QingCloud 云平台](https://console.qingcloud.com/login)，在 **网络与 CDN** 选择 **负载均衡器**，填写基本信息。如下示例在北京 3 区 - C 创建一个负载均衡器，部署方式选择 `单可用区`，网络选择了集群主机所在的 VPC 网络的私有网络 (例如本示例的六台主机都在 kubesphere 私有网络中)，其它设置保持默认即可。填写基本信息后，点击 **提交** 完成创建。

![负载均衡器基本信息](/lb-info.png)

#### 第二步：创建监听器

进入上一步创建成功的负载均衡器，为其创建一个监听器，监听 TCP 协议的 6443 端口，监听的端口号也可以是其它任意端口，但在 vars.yml 中配置应与 port 一致，监听器的基本信息应参考如下填写。 

- 监听协议：选择 TCP 协议
- 端口：填写 6443 端口
- 负载方式：选择轮询

> 注意：创建监听器后请检查负载均衡器的防火墙规则，确保 `6443` 端口已添加至防火墙规则并且外网流量可以通过，否则外网无法访问该端口的服务，安装可能会失败。

![创建监听器](/create-monitor.png)

#### 第三步：添加后端

在当前的负载均衡器中点击 **添加后端**，私有网络选择集群主机所在的私有网络，点击 **高级搜索**，可以一次勾选多台后端主机，例如要通过负载均衡器实现 Master 节点的高可用，此处则勾选 master1、master2、master3 这三台 Master 主机，注意这里端口需填写 `6443`，它是 api-server 的默认端口 (Secure Port)，添加完成后点击 **提交**。

![添加后端](/add-backend-node.png)

添加后端后，需请点击 **应用修改** 使之生效，可以在列表查看目前负载均衡器的添加的三台 Master 节点。注意，刚添加完的后端主机状态在监听器中可能显示 “不可用”，是因为 api-server 对应的 6443 服务端口还未运行开放，这属于正常现象。待安装成功后，后端主机上的 api-server 的服务端口 6443 将被暴露出来，后端状态变为 “活跃”，说明负载均衡器已在正常工作。

![添加后端完成](/lb-list.png)

### 修改主机配置文件

可在如下示例的 [kube-master] 和 [etcd] 部分填入主机名 master1、master2、master3 作为高可用的 Master 和 etcd 集群。注意，etcd 节点个数需要设置为 `奇数个`，由于 etcd 内存本身消耗比较大，部署到工作节点 (node) 上很容易出现资源不足，因此不建议在工作节点上部署 etcd 集群。为了对待部署目标机器及部署流程进行集中化管理配置，集群中各个节点在主机配置文件 `hosts.ini` 中应参考如下配置，建议使用 `root` 用户安装。

以下示例在 **CentOS 7.5** 上使用 `root` 用户安装，若以非 root 用户 (如 ubuntu ) 进行安装，可参考主机配置文件的注释 `non-root` 示例部分编辑。

> 说明：
> - 若以非 root 用户 (如 ubuntu 用户) 进行安装，可参考配置文件 `conf/hosts.ini` 的注释中 `non-root` 用户示例部分编辑。
> - 如果在 taskbox 使用 root 用户无法 ssh 连接到其他机器，也需要参考 `conf/hosts.ini` 的注释中 `non-root` 用户示例部分，但执行安装脚本 `install.sh` 时建议切换到 root 用户，如果对此有疑问可参考 [常见问题 - 问题 2](../../faq)。

**host.ini 配置示例**

```ini
[all]
master1  ansible_connection=local  ip=192.168.0.1
master2  ansible_host=192.168.0.2  ip=192.168.0.2  ansible_ssh_pass=PASSWORD
master3  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_ssh_pass=PASSWORD
node1  ansible_host=192.168.0.4  ip=192.168.0.4  ansible_ssh_pass=PASSWORD
node2  ansible_host=192.168.0.5  ip=192.168.0.5  ansible_ssh_pass=PASSWORD
node3  ansible_host=192.168.0.6  ip=192.168.0.6  ansible_ssh_pass=PASSWORD

[kube-master]
master1
master2
master3

[kube-node]
node1
node2
node3

[etcd]
master1
master2
master3

[k8s-cluster:children]
kube-node
kube-master
```

### 配置负载均衡器参数

在 QingCloud 云平台准备好负载均衡器后，需在 `vars.yaml` 配置文件中修改相关参数。假设负载均衡器的内网 IP 地址是 `192.168.0.10` (这里需替换为您的负载均衡器实际 IP 地址)，负载均衡器设置的 TCP 协议的监听端口 (port) 为 `6443`，那么在 `conf/vars.yml` 中参数配置参考如下示例 (`loadbalancer_apiserver` 作为可选配置项，在配置文件中应取消注释)。

> - 注意，address 和 port 在配置文件中应缩进两个空格。
> - 负载均衡器的域名默认为 "lb.kubesphere.local"，供集群内部访问。如果需要修改域名则先取消注释再自行修改。

**vars.yml 配置示例**

```yaml
## External LB example config
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
loadbalancer_apiserver:
  address: 192.168.0.10
  port: 6443
```

完成 master 和 etcd 高可用的参数配置后，请继续参阅 [Multi-Node 模式 - 存储配置示例](../multi-node) 在 vars.yml 中配置持久化存储相关参数，并继续多节点的安装。

