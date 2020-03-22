---
title: "一键部署 EMQ X"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---


## KubeSphere 应用部署与管理

[KubeSphere](https://github.com/kubesphere/kubesphere) 是一个开源的以应用为中心的容器平台，基于自研的 [OpenPitrix](https://openpitrix.io) 构建了应用商店与应用的生命周期管理，并且在 v2.1 中提供了 `3` 种应用的快速部署方式：

> - 企业空间下的私有或公有的应用仓库
> - 平台全局的应用商店
> - 自制应用，即通过多个服务构建应用

KubeSphere 支持的应用是基于 [Helm Chart](https://docs.helm.sh/using_helm) 打包规范构建的，并通过统一的公有或私有的应用仓库交付使用，应用由一个或多个 Kubernetes 工作负载 (Workload) 和服务（Service）组成。

KubeSphere 应用商店对内可作为团队间共享企业内部的中间件、大数据、业务应用等，以应用模板的形式方便用户快速地一键部署常用的应用到 Kubernetes 中；对外可作为根据行业特性构建行业交付标准、交付流程和交付路径的基础，作为行业通用的应用商店，可根据不同需求应对不同的业务场景。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025011318.png)

本文先介绍 KubeSphere 支持的 **第一种方式**，通过在企业空间导入第三方应用仓库，快速部署一个 [EMQ X](https://www.emqx.io) 集群至 Kubernetes，最终访问 EMQ X 的 Dashboard 服务，同时介绍 EMQ X 本身的特性与部署方式。

## EMQ X 是什么

[EMQ X](https://github.com/emqx/emqx) 是一款完全开源，高度可伸缩，高可用的 **分布式 MQTT 消息服务器**，适用于 **IoT、M2M 和移动应用程序**，可处理 **千万级别的并发客户端**。EMQ X 面向海量的移动/物联网/车载等终端接入，并实现在 **海量物理网设备间快速低延时的消息路由**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025004214.png)

## 前提条件

已开启安装了 [KubeSphere 应用商店](../../installation/install-openpitrix)。

## 部署简单的 EMQ X 集群

### 导入应用仓库

1. 创建一个企业空间（Workspace），然后在该企业空间，进入 `企业空间管理 → 应用仓库`，点击 `创建应用仓库`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025004747.png)

2. 在添加应用仓库的窗口，URL 填入 `https://repos.emqx.io/charts`，验证通过后即可创建。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025004847.png)

3. 创建一个示例项目（Namespace），然后进入该项目中，在 `应用负载 → 应用` 下点击 `部署新应用`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025005210.png)

4. 此时即可看到 KubeSphere 支持的 3 种应用的快速部署方式，选择 `应用仓库`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025005223.png)

5. 点击查看 EMQ X 应用模板。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025005341.png)

6. 预览 EMQ X 的 [Helm Chart](https://github.com/emqx/emqx-chart) 中的配置文件，然后选择 `部署应用`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025005439.png)

### 编辑 Helm Chart

KubeSphere 支持可视化编辑 Helm Chart，在 `Values.yaml` 参考如下提示，将其中 3 处修改为指定的值：

> 提示：关于 EMQ X 的 Helm Chart 更详细的参数释义，请参考 EMQ X 的官方 [EMQ X Chart](https://github.com/emqx/emqx-chart)。

<!-- ```yaml
namespace: demo-project # 此处替换为您实际创建的项目名称
···
image: emqx/emqx:v3.2.3 # 指定 image 为 emqx/emqx:v3.2.3
···
service:
  type: NodePort # 将 service 从 ClusterIP 改为 NodePort
···
``` -->

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025175948.png)

修改完成后点击 `部署` 即可将 EMQ X 集群部署至 Kubernetes。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025005829.png)

### 查看 EMQ X 部署状态

**应用详情**

在应用列表中，可以看到 EMQ X 的应用状态，点击进入该应用，查看该应用的工作负载与服务的状态。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025010515.png)

**查看工作负载 → 有状态副本集**

EMQ X 部署成功后，将部署 3 副本的有状态副本集（Statefulsets），当显示 `运行中 (3/3)` 时，说明应用部署成功。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025010654.png)

**查看有状态副本集详情**

![](https://pek3b.qingstor.com/kubesphere-docs/png/emq-1.gif)

### 访问 EMQ X Dashboard 服务

1. 在 `应用负载 → 服务` 页面，即可看到 EMQ X 对外暴露的 NodePort 以及端口映射情况，服务端口 18083 映射到节点的 NodePort (如 32688) 即 EMQ X Dashboard 能够在集群外访问到的端口。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025103211.png)

2. 使用  `<$IP><$NodePort>` 访问 EMQ X Dashboard 服务，使用默认帐密 `admin/public` 登录 Dashboard。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025104359.png)

3. 在首页的监控列表即可看到 EMQ X Broker 的系统信息，包括 3 Nodes 和 3 Stats 监控信息，状态显示 Running。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025104904.png)

4. EMQ X 的 3 个 Nodes IP 正好对应着 EMQ X Statefulsets 的 3 个 Pod IP。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025105350.png)

## 部署持久化的 EMQ X 集群

EMQ X 通过创建 PVC 资源挂载 `/opt/emqx/data/mnesia` 目录实现持久化 Pods，在部署 EMQ X 之前，用户可以通过部署 [Haproxy](http://www.haproxy.org/) 或 [Nginx-PLUS](https://www.nginx.com/products/nginx/) 等负载均衡器，然后在 Kubernetes 中创建 PV 或 StorageClass。

在 KubeSphere 部署一个持久化的 EMQ X 集群步骤与上述步骤类似，因此这里仅提示参数配置。在准备好负载均衡器后，只需要在可视化编辑 Helm Chart 的 `Values.yaml` 中指定 StorageClass 相关参数即可。

<!-- ```yaml
···
namespace: demo-project # 此处替换为您实际创建的项目名称
···
persistence
  enabled=true # 此处设为 true
  ···
  storageClass: local # 可通过 KubeSphere 页面或 kubectl get sc 查看存储类型
  ···
  image: emqx/emqx:v3.2.3 # 指定 image 为 emqx/emqx:v3.2.3
  ···
service:
  type: NodePort # 将 service 从 ClusterIP 改为 NodePort
  ···
  ``` -->

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025180459.png)

部署完成后，可以看到 emqx Service 的 ClusterIP 为 10.233.28.52 （以实际部署时为准）。将负载均衡监听的 URL 的 1883、8883、8080、8083、8084、18083 端口转发到 emqx Service 的 ClusterIP。



> 提示：如果有 TLS 连接的需要，推荐在负载均衡器终结 SSL 连接。客户端与负载均衡器之间 TLS 安全连接，负载均衡器与 EMQ X 之间普通 TCP 连接。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025120216.png)

完成后使用 `<$IP><$NodePort>` 或集群内访问 `<$ClusterIP>:<$Port>` 即可访问持久化的 EMQ X 集群服务。

## 扩容 EMQ X 集群

KubeSphere 支持一键快速扩展 EMQ X 集群，进入 `工作负载 → 有状态副本集`，点击扩容的 Button 将 EMQ X 副本数扩容至 5。注意，EMQ X 的节点数量建议为 **单数**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025114511.png)

## 一键进入容器终端

若在运维 EMQ X 集群的过程中，需要快速进入容器终端，可在 EMQ X 的有状态副本详情页找到其中一个 Pod，点击进入指定 Pod 下的容器中。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025115208.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025115246.png)

## 总结

本文介绍了 KubeSphere 支持的 **第一种应用部署与管理方式**，通过在企业空间导入了 [EMQ X](https://www.emqx.io) 应用仓库，并快速部署到了 Kubernetes。下一篇文章将主要介绍第二种方式 - **应用商店与应用的生命周期管理**，演示如何使用开发者或 ISV 角色用户，将 Helm 应用的 **上传提交、应用审核、测试部署、应用上架、应用升级、应用下架** 作为一个完整的流程。
