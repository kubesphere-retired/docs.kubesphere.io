---
title: "外网访问"
---

1. 在当前项目中，左侧菜单选择 **项目设置 → 外网访问**，点击 **设置网关**，即应用路由的网关入口，每个项目都有一个独立的网关入口。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514095021.png)

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
  - `http://139.198.0.20:30798`
  - `https://139.198.0.20:31279`

- 通过在应用路由规则中设置的 Hostname 访问：
  - `http://demo.kubesphere.io:30798`
  - `https://demo.kubesphere.io:31279`


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514095320.png)

## 通过 LoadBalancer 暴露网关

> 前提条件：若 KubeSphere 部署在 QingCloud 云平台，确保已安装了 [QingCloud LB 插件](../../installation/qingcloud-lb)。

若选择的是 LoadBalancer，负载均衡器插件将自动在云平台创建负载均衡器并绑定公网 IP 至网关，提供内部服务和应用路由的快速访问，最终可通过公网 IP 或域名的方式访问应用路由和服务。

1、在「项目设置」→「外网访问」下，点击「设置网关」，选择 LoadBalancer。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190605235710.png)

2、如下添加一条注解，保存后即可允许 LB 插件自动为网关创建和绑定公网 IP，同时在 QingCloud 云平台创建负载均衡器。您在创建和使用应用路由、服务时即可为其自动生成公网 IP。

```annotation
service.beta.kubernetes.io/qingcloud-load-balancer-eip-source : auto
```

3、等待 2 分钟左右负载均衡器将自动创建完毕并自动绑定公网 IP 至网关。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190606004135.png)

4、在部署应用或创建应用路由、服务后，即可自动使用该公网 IP 或域名来暴露服务，方便用户快速访问。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190606004254.png)

