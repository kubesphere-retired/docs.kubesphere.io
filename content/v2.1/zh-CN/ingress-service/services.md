---
title: "服务管理"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

一个 Kubernetes 的服务 (Service) 是一种抽象，它定义了一类 Pod 的逻辑集合和一个用于访问它们的策略 - 有的时候被称之为微服务，而在这个集合中的 Pod 的 IP 地址以及数量等都会发生动态变化，这个服务的客户端并不需要知道这些变化，也不需要自己来记录这个集合的 Pod 信息，这一切都是由抽象层 Service 来完成。

## 前提条件

已创建了工作负载，若还未创建工作负载可参考 [工作负载](../../workload/workload)。

## 创建服务

登录 KubeSphere 控制台，在所属的企业空间中选择已有 **项目** 或新建项目，访问左侧菜单栏，点击 **网络与服务 → 服务** 进入服务列表页。


创建服务支持三种方式，**页面创建**，**导入 yaml/json 文件**，**编辑模式**创建。若选择以编辑模式，可点击右上角编辑模式进入代码界面，支持 yaml 和 json 格式。左上角显示配置文件列表和导入导出按钮。其中导入 yaml 文件方式会自动将 yaml 文件内容填充到页面上，用户根据需要可以在页面上调整后再行创建，编辑模式可以方便习惯命令行操作的用户直接在页面上编辑 yaml 文件创建服务。以下主要介绍页面创建的方式。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514094058.png)


### 第一步：填写基本信息

在服务列表页，点击 **创建** 按钮，填写基本信息:

- 名称：为服务起一个简洁明了的名称，便于用户浏览和搜索。
- 别名：帮助您更好的区分资源，并支持中文名称。
- 描述信息：详细介绍服务的特性，当用户想进一步了解该服务时，描述内容将变得尤为重要。

![基本信息](/ae-svc-basic.png)

### 第二步：服务设置

2.1. 选择需要创建服务的类型，每种服务类型适合不同的场景:

> - VirtualIP：以集群为服务生成的集群内唯一的 IP 为基础，集群内部可以通过此 IP 来访问服务，集群外部可以通过 NodePort 和 LoadBalancer 方式来访问服务。此类型适合绝大多数服务。
> - Headless (selector)：集群不为服务生成 IP，集群内部通过服务的后端 Pod IP 直接访问服务。此类型适合后端异构的服务，比如需要区分主从的服务。
> - Headless (externalname)：将集群或者项目外部服务映射到集群或项目内。


2.2. 若选择 VIP 或 Headless (selector)，需填写服务设置：

- 选择器：选择器来选择不同的后端，使用键值对 (Label Selector) 或 **指定工作负载** 可以选择多个部署。
- 端口：服务的端口号和目标端口，目标端口是对应的后端工作负载的端口号，如 MySQL 的 3306 端口。
- 会话亲和性
   - None：以 Round robin 的方式轮询后端的 Pods。
   - ClientIP：来自同一个 IP 地址的访问请求都转发到同一个后端 Pod。

![创建服务](/ae-svc-setting.png)

若选择 Headless (externalname)，通过返回 CNAME 和它的值，可以将服务映射到 externalName 字段的内容。

### 第三步：添加标签

标签设置页用于指定资源对应的一组或者多组标签 (Label)。Label 以键值对的形式附加到任何对象上，如 Pod，Service，Node 等，定义好标签后，其他对象就可以通过标签来对对象进行引用，最常见的用法便是通过节点选择器来引用对象。

![添加标签](/ae-svc-label.png)

### 第四步：外网访问设置

为服务选择外网访问方式，LoadBalancer 的方式需要对应的负载均衡器插件来启用，如果未安装插件则无法使用。服务创建后支持修改外网访问方式。

> - None: 只在集群内部访问服务，集群外部无法访问。
> - NodePort: 集群外部可以通过访问集群节点的对应端口来访问服务，端口将由集群自动创建。
> - LoadBalancer: 通过云服务商提供的负载均衡器来访问服务。

> 注意：由于使用 Load Balancer 需要在安装前配置与安装与云服务商对接的 cloud-controller-manage 插件，参考 [安装负载均衡器插件](../../installation/qingcloud-lb) 来安装和使用负载均衡器插件。

![外网访问服务](/ae-svc-access.png)

创建完成后即可在服务列表中查看成功创建的服务详情。 


## 访问服务

服务创建后对外提供了不同的访问方式，可满足不同网络环境下提供不同的访问通道。

### 集群内部访问 (服务内部域名或 Virtual IP)

后端工作负载的服务暴露给集群内其他工作负载访问的方式，可通过服务在集群中的域名或 Virtual IP 访问。

- 其中集群内部域名格式为： `<服务名称>.<服务所在的项目名称>.svc.cluster.local`，例如`nginx.demo-namespace.svc.cluster.local`，可通过 curl 命令进行验证。
- Virtual IP 的形式为：`Virtual IP:Port`，例如访问下图的 nginx : `curl 10.233.18.78:80`

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190518012026.png)

### 节点访问 (NodePort)

节点访问是在每个节点的 IP 上开放一个节点端口 (NodePort)，通过节点端口对外暴露服务。通过请求 `<节点 IP>:<NodePort>`，可以从集群的外部访问一个 NodePort 服务。

### 负载均衡 (LoadBalancer)

通过云服务商提供的负载均衡器从公网来访问服务，由于使用 LoadBalancer 需要在安装前配置与安装与云服务商对接的 cloud-controller-manage 插件，参考 [安装负载均衡器插件](../../installation/qingcloud-lb) 来安装和使用负载均衡器插件。

安装完成后，在创服务的外网访问中，需要在 LoadBalancer 中添加两条 Annotation 并填入需要绑定的公网 IP 的 ID，然后就可以通过公网 IP 访问该服务。

```yaml
service.beta.kubernetes.io/qingcloud-load-balancer-type       0
service.beta.kubernetes.io/qingcloud-load-balancer-eip-ids    填写公网 IP 的 ID
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190518014723.png)


