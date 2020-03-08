---
title: "部署高可用的 KubeSphere"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

Multi-Node 模式安装 KubeSphere 可以帮助用户顺利地部署一个多节点集群用于开发和测试，在实际的生产环境我们还需要考虑 master 节点的高可用问题，因为如果 master 节点上的几个服务 kube-apiserver、kube-scheduler 和 kube-controller-manager 都是单点的而且都位于同一个节点上，一旦 master 节点宕机，可能导致 Kubernetes 集群出故障和 KubeSphere 无法访问，对线上业务存在很大的风险。

负载均衡器 (Load Balancer) 可以将来自多个公网地址的访问流量分发到多台主机上，并支持自动检测并隔离不可用的主机，从而提高业务的服务能力和可用性。**用户可以使用任何云厂商提供的负载均衡器或相关的 LB 硬件设备，还可以通过 Keepalived 和 Haproxy 的方式实现多个 master 节点的高可用部署。**

本文档将在 [QingCloud 云平台](https://www.qingcloud.com) 创建 `2` 个 [负载均衡器 (Load Balancer)](https://docs.qingcloud.com/product/network/loadbalancer)，分别作为外网和内网的负载均衡，引导您如何配置生产级别的集群，实现 master 与 etcd 节点的高可用。

## 示例视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/video/KSInstall_100P003C202001_HA-install-on-QingCloud.mp4">
</video>


## 前提条件

- 请确保已参阅 [Multi-Node 模式](../multi-node)，本文档仅说明安装过程中如何修改配置文件来配置 master 节点高可用，完整的安装流程和配置文件中的参数解释说明以 [Multi-Node 模式](../multi-node) 为准。
- 本示例以 [QingCloud 云平台](https://console.qingcloud.com/login) 的负载均衡器作为高可用部署的演示，请预先申请 [QingCloud 云平台](https://console.qingcloud.com/login) 账号（**您也可以使用其它任何云厂商提供的负载均衡器**）。

## Master 和 etcd 节点高可用架构

本示例准备了 6 台主机，将创建 `2` 个负载均衡器，主机规格参考 [Multi-Node 模式 - 节点规格](../multi-node)，将在其中 3 台部署 Master 和 etcd 集群，可编辑主机配置文件 `conf/hosts.ini`。

![Master 和 etcd 节点高可用架构](https://pek3b.qingstor.com/kubesphere-docs/png/20200307215924.png)


### 准备负载均衡器

以创建 QingCloud 云平台负载均衡器为例，简单说明其创建步骤，详细介绍可参考 [QingCloud 官方文档](https://docs.qingcloud.com/product/network/loadbalancer)。

#### 第一步：创建内网负载均衡器

1. 登录 [QingCloud 云平台](https://console.qingcloud.com/login)，在 **网络与 CDN** 选择 **负载均衡器**，填写基本信息。

**创建内网负载均衡器**

2. 如下示例先创建一个内网的负载均衡器，网络选择了集群主机所在的私有网络 (例如本示例的 6 台主机都在 kube 私有网络中)，其它设置保持默认即可。填写基本信息后，点击 **提交** 完成创建。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191113000736.png)

3. 进入上一步创建成功的负载均衡器，为其创建一个监听器，监听协议为 `TCP`，端口设置 `6443`。

> 注意：创建监听器后请检查负载均衡器的防火墙规则，确保 `6443` 端口已添加至防火墙规则并且外网流量可以通过，否则外网无法访问该端口的服务，安装可能会失败。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191110170756.png)

4. 添加后端，其中私有网络本示例的 6 台主机都在的私有网络 kube，点击 **高级搜索**，然后勾选其中 3 台作为 `master` 角色的节点，端口设置为 `6443`，它是 api-server 的默认端口 (Secure Port)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191110171339.png)

5. 点击提交，内网负载均衡器创建成功。点击 **应用修改** 使之生效，可以在列表查看目前负载均衡器的添加的三台 Master 节点。

> 注意，刚添加完的后端主机状态在监听器中可能显示 “不可用”，是因为 api-server 对应的 6443 服务端口还未运行开放，这属于正常现象。待安装成功后，后端主机上的 api-server 的服务端口 6443 将被暴露出来，后端状态变为 “活跃”，说明负载均衡器已在正常工作。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191110171834.png)

#### 第二步：创建外网负载均衡器

您需要预先创建一个 EIP。

> 说明：外网负载均衡器监听的 30880 端口，是 KubeSphere 控制台在集群每个节点上开启的访问入口。

1. 参考上述步骤，创建一个负载均衡器，并绑定公网 IP，其作为外网负载均衡器。



2. 进入上一步创建成功的负载均衡器，为其创建一个监听器，监听协议为 `HTTP`，端口设置 `30880`。

> 注意：创建监听器后请检查负载均衡器的防火墙规则，确保 `30880` 端口已添加至防火墙规则并且外网流量可以通过，否则外网无法访问该端口的服务，安装可能会失败。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191113001208.png)

3. 添加后端，本示例的 6 台主机都在的私有网络 kube，点击 **高级搜索**，然后勾选所有节点，端口设置为 `30880`。


4. 点击提交，外网负载均衡器创建成功。点击 **应用修改** 使之生效，可以在列表查看目前负载均衡器的添加的 6 台节点。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191112163143.png)

### 修改主机配置文件

可在如下示例的 [kube-master] 和 [etcd] 部分填入主机名 master1、master2、master3 作为高可用的 Master 和 etcd 集群。注意，etcd 节点个数需要设置为 `奇数个`，由于 etcd 内存本身消耗比较大，部署到工作节点 (node) 上很容易出现资源不足，因此不建议在工作节点上部署 etcd 集群。为了对待部署目标机器及部署流程进行集中化管理配置，集群中各个节点在主机配置文件 `hosts.ini` 中应参考如下配置，建议使用 `root` 用户安装。

以下示例在 **CentOS 7.5** 上使用 `root` 用户安装。

> 说明：
> - 若以非 root 用户 (如 ubuntu 用户) 进行安装，可参考配置文件 `conf/hosts.ini` 的注释中 `non-root` 用户示例部分编辑。
> - 如果在 taskbox 使用 root 用户无法 ssh 连接到其他机器，也需要参考 `conf/hosts.ini` 的注释中 `non-root` 用户示例部分，但执行安装脚本 `install.sh` 时建议切换到 root 用户，如果对此有疑问可参考 [安装常见问题 - 问题 2](../../faq/faq-install)。

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

在 QingCloud 云平台准备好负载均衡器后，需在 `common.yaml` 配置文件中修改相关参数。假设内网负载均衡器的内网 **VIP** 地址是 `192.168.0.253` (这里需替换为您的负载均衡器实际 IP 地址)，负载均衡器设置的 TCP 协议的监听端口 (port) 为 `6443`，那么在 `conf/common.yaml` 中参数配置参考如下示例 (`loadbalancer_apiserver` 作为可选配置项，在配置文件中应取消注释)。

> - 注意，address 和 port 在配置文件中应缩进两个空格。并且 address 地址应填写 VIP（虚拟地址）。
> - 负载均衡器的域名默认为 "lb.kubesphere.local"，供集群内部访问。如果需要修改域名则先取消注释再自行修改。

**common.yaml 配置示例**

```yaml
## External LB example config
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
loadbalancer_apiserver:
  address: 192.168.0.253
  port: 6443
```

完成 master 和 etcd 高可用的参数配置后，请继续参阅 [Multi-Node 模式 - 存储配置示例](../multi-node) 在 common.yaml 中配置持久化存储相关参数，并继续多节点的安装。
