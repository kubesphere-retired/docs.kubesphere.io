---
title: "Master 节点高可用配置"
---

Multi-node 模式安装 KubeSphere 可以帮助用户顺利地部署一个多节点集群用于开发和测试，但是要应用到实际的生产环境就不得不考虑 master 节点的高可用问题了，
因为目前我们的 master 节点上的几个服务 kube-apiserver、kube-scheduler 和 kube-controller-manager 都是单点的而且都位于同一个节点上，
一旦 master 节点宕机，虽然不应答当前正在运行的应用，将导致 KubeSphere 集群无法变更，对线上业务存在很大的风险。

负载均衡器（Load Balancer） 可以将来自多个公网地址的访问流量分发到多台主机上，并支持自动检测并隔离不可用的主机，从而提高业务的服务能力和可用性。除此之外，还可以通过 Keepalived 和 Haproxy 的方式实现多个 master 节点的高可用部署。本文档以配置负载均衡器 (Load Balancer) 为例，引导您如何配置高可用的 master 节点。

## 前提条件

- 请确保已参阅 [Multi-node 模式](../Multi-node)，本文档仅说明安装过程中如何修改配置文件来配置 master 节点高可用，该配置作为一个可选配置项，完整的安装流程和说明以 [Multi-node 模式](../Multi-node) 为准。
- 已准备外部的负载均衡器，比如 [青云负载均衡器](https://docs.qingcloud.com/product/network/loadbalancer)，用来给多个 master 节点的做负载均衡。

## Master 节点高可用架构

![Master 节点高可用架构](/master-ha-design.png)

以配置 5 台主机中两个 master 节点为例，主机规格参考 [Multi-node 模式 - 节点规格](../Multi-node/#第一步-准备主机)，编辑主机配置文件 `conf/hosts.ini`。若需要配置 etcd 的高可用，可在 [etcd] 部分填入主机名比如 master1、 node1 和 node2 作为 etcd 集群，etcd 节点个数需要设置为 `奇数个`。

### 修改主机配置文件

为了对待部署目标机器及部署流程进行集中化管理配置，集群中各个节点在主机配置文件 `hosts.ini` 中应参考如下配置。以下示例在 CentOS 7.5 上使用 `root` 用户安装。若以 ubuntu 用户进行安装，可参考主机配置文件的注释 `non-root` 示例部分编辑。

**host.ini 配置示例**

```ini
[all]
master1  ansible_connection=local  ip=192.168.0.1
master2  ansible_host=192.168.0.2  ip=192.168.0.2  ansible_ssh_pass=PASSWORD
node1  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_ssh_pass=PASSWORD
node2  ansible_host=192.168.0.4  ip=192.168.0.4  ansible_ssh_pass=PASSWORD
node3  ansible_host=192.168.0.5  ip=192.168.0.5  ansible_ssh_pass=PASSWORD

[kube-master]
master1
master2

[kube-node]
node1
node2
node3

[etcd]
master1

[k8s-cluster:children]
kube-node
kube-master
```

### 配置负载均衡器

准备负载均衡器后，假设负载均衡器的内网 IP 地址是 192.168.0.10，监听的端口为 TCP 协议的 6443 端口，负载均衡器的域名默认为 "lb.kubesphere.local"，供集群内部访问 (若需要修改域名则先取消注释再自行修改)，那么在 `conf/vars.yml` 中参数配置参考如下示例 (负载均衡器的 apiserver 作为可选配置项，在配置文件中应取消注释)。

**vars.yml 配置示例**

```yaml
## External LB example config
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
loadbalancer_apiserver:
address: 192.168.0.10
port: 6443
```

完成 master 高可用的参数配置后，可继续参阅 [Multi-node 模式](../multi-node) 进行多节点的安装。

