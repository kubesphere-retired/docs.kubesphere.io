---
title: "在华为云部署高可用的 KubeSphere"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

搭建高可用的 KubeSphere 建议分别配置内网和外网负载均衡器，并准备和配置 KubeSphere 支持的持久化的存储服务端，可参考 [Master 和 etcd 节点高可用配置](../master-ha)。以下简要说明如何在华为云部署一个基于 Kubernetes 的高可用 KubeSphere 集群。

## 创建 VPC 和子网

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191108232420.png)

## 创建安全组

在 `访问控制` → `安全组` 下，创建一个安全组，设置入方向的规则参考如下：

> 提示：后端服务器的安全组规则必须放行 100.125.0.0/16 网段，否则会导致健康检查异常，详见 [后端服务器配置安全组
](https://support.huaweicloud.com/usermanual-elb/zh-cn_topic_0164706625.html)。此外，还应放行	192.168.1.0/24 （主机之间的网络需全放行）。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191108232803.png)

## 创建主机

例如，本示例创建 6 台 **Ubuntu 18.04 server 64bit** 的云服务器，每台配置为 4 核 8 GB。

> 提示：KubeSphere 在华为云平台还支持部署在 CentOS 7.6 和 Ubuntu 16.04。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191108233455.png)

在网络配置中，网络选择第一步创建的 VPC 和子网。在安全组中，选择上一步创建的安全组。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191108233058.png)

## 创建负载均衡器

为了满足集群的高可用，需要分别创建一个内网的负载均衡器和外网的负载均衡器，然后为对应的节点添加后端监听器。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191109001016.png)

**内网 LB 配置**

为所有 **master 节点**（例如本示例的 3 台）添加后端监听器，监听端口为 6443。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191109002619.png)

**外网 LB 配置**

若集群需要配置公网访问，则需要为外网负载均衡器配置一个公网 IP，基本信息参考如下：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191109001704.png)

为 **所有节点** 添加后端监听器，监听端口为 80。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191109002526.png)

## 配置持久化存储

KubeSphere 默认的存储类型为 Local，该存储类型方便用户快速部署和测试，可作为开发或测试环境。若搭建生产环境请在安装前配置持久化存储。可参考 [存储配置说明](../storage-configuration)，配置 NFS、[GlusterFS](../../appendix/glusterfs-ks-install) 或 [Ceph RBD](../../appendix/ceph-ks-install) 等持久化存储，并单独准备其存储服务端。

> 例如，华为云平台可创建 [SFS](https://support.huaweicloud.com/productdesc-sfs/zh-cn_topic_0034428718.html)（NFS 协议的弹性文件服务），然后开放用户权限，并保证 SFS 和 ECS 归属在同一 VPC 中才能实现文件数据存储共享。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191109003949.png)

准备相应的存储服务端后，在 common.yaml 中配置对应的存储参数即可。

## 开始部署

完成上述步骤后，即可继续参考 [Multi-node 模式安装](../multi-node)，下载 installer 至一台目标机器，开始执行安装。注意，**执行 Installer 的主机要保证可以 SSH 到其他节点上，否则安装可能不成功**。
