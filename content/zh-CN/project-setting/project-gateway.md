---
title: "外网访问"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

1. 在当前项目中，左侧菜单选择 **项目设置 → 高级设置**，点击 **设置网关**，即应用路由的网关入口，每个项目都有一个独立的网关入口。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200211102112.png)

2. 在弹出的窗口选择网关的类型，支持以下两种访问方式：

> - NodePort: 此方式网关可以通过工作节点对应的端口来访问服务。
> - LoadBalancer: 此方式网关可以通过统一的一个外网 IP 来访问。
> - 应用治理: 通过 Istio 提供完整的非入侵式的微服务治理解决方案，可以有效的解决云原生应用的网络治理问题，提供熔断、限流及灰度发布等功能。
>
> 注意：由于使用 Load Balancer 需要在安装前配置与安装与云服务商对接的 cloud-controller-manage 插件，参考 [安装负载均衡器插件](../../installation/qingcloud-lb) 来安装和使用负载均衡器插件。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514095052.png)

3. 点击 **保存** 来创建网关。

## 通过 NodePort 暴露网关

如下图选择的是 NodePort 的方式，左边节点端口生成的两个端口，分别是 HTTP 协议的端口和 HTTPS 协议的端口，外网可通过 EIP:NodePort 或 Hostname:NodePort 来访问服务，如：


- 通过 EIP 访问：
  - `http://139.198.0.20:31733`
  - `https://139.198.0.20:30910`

- 通过在应用路由规则中设置的 Hostname 访问：
  - `http://demo.kubesphere.io:31733`
  - `https://demo.kubesphere.io:30910`


![](https://pek3b.qingstor.com/kubesphere-docs/png/20200211102426.png)

## 通过 LoadBalancer 暴露网关

> 前提条件：若 KubeSphere 部署在 QingCloud 云平台，确保已安装了 [QingCloud LB 插件](../../installation/qingcloud-lb)。

若选择的是 LoadBalancer，负载均衡器插件将自动在云平台创建负载均衡器并绑定公网 IP 至网关，提供内部服务和应用路由的快速访问，最终可通过公网 IP 或域名的方式访问应用路由和服务。

在「项目设置」→「外网访问」下，点击「设置网关」，选择 LoadBalancer。

> LB 插件可通过添加 Annotation 来配置使用，目前支持以下三种配置方式，参考 [公网 IP 配置](https://github.com/yunify/qingcloud-cloud-controller-manager/blob/master/docs/configure.md#%E4%BA%8C%E5%85%AC%E7%BD%91ip%E9%85%8D%E7%BD%AE)。
> - **手动配置 EIP**：添加一条 Annotation 的 key 是 `service.beta.kubernetes.io/qingcloud-load-balancer-eip-ids`，值是 `公网IP 的 ID`；
> - **自动获取 EIP**：需添加一条 Annotation 的 key `service.beta.kubernetes.io/qingcloud-load-balancer-eip-source`，注意自动获取 EIP 支持以下三种方式 (对应不同的值)：
>    - 自动获取当前账户下处于可用的 EIP，如果找不到返回错误，值设置为 `use-available`；
>    - 自动获取当前账户下处于可用的 EIP，如果找不到则申请一个新的，值设置为 `auto`；
>    - 不管账户下有没有可用的 EIP，申请一个新 EIP，值设置为 `allocate`；
> - **配置多个服务 (Service) 共享一个公网 IP**：由于 EIP 是稀缺资源，QingCloud-LB 插件提供了多个 Service 共享一个 EIP 的模式，使用这个模式有一定限制，详见 [配置多个Service共享一个EIP](https://github.com/yunify/qingcloud-cloud-controller-manager/blob/master/docs/configure.md#%E4%B8%89%E9%85%8D%E7%BD%AE%E5%A4%9A%E4%B8%AAservice%E5%85%B1%E4%BA%AB%E4%B8%80%E4%B8%AAeip)。


以下仅以其中一种配置方式 “自动获取当前账户下处于可用的 EIP，如果找不到则申请一个新的，值设置为 `auto`” 演示如何在 KubeSphere 配置使用。

> 注意，示例中的这种方式可能会造成同一账号下其他用户空闲的公网 IP 被使用。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190605235710.png)

1、如图在示例中添加一条注解，保存后即可允许 LB 插件自动为网关创建和绑定公网 IP，同时在 QingCloud 云平台创建负载均衡器。您在创建和使用应用路由、服务时即可为其自动生成公网 IP。

```annotation
service.beta.kubernetes.io/qingcloud-load-balancer-eip-source : auto
```

2、等待 `2` 分钟左右负载均衡器将在云平台自动创建完毕并自动绑定公网 IP 至网关。


3、在部署应用或创建应用路由、服务后，即可自动使用该公网 IP 或域名来暴露服务，方便用户快速访问。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190606004254.png)
