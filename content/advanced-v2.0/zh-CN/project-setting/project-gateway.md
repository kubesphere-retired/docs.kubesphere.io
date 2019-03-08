---
title: "外网访问"
---

1. 在当前项目中，左侧菜单选择 **项目设置 → 外网访问**，点击 **设置网关**，即应用路由的网关入口，每个项目都有一个独立的网关入口。

![应用路由列表](/ae-gateway-list.png)

2. 在弹出的窗口选择网关的类型，支持以下两种访问方式：

> - NodePort: 此方式网关可以通过工作节点对应的端口来访问服务。
> - LoadBalancer: 此方式网关可以通过统一的一个外网 IP 来访问。
>
> 注意：由于使用 Load Balancer 需要安装与云服务商对接的 cloud-controller-manage 插件，目前 qingcloud-cloud-controller-manager 插件正在开发阶段，且即将上线，待上线后即可使用 Load Balancer 将内部的服务暴露给外网访问。

3. 点击 **保存** 来创建网关，如下图选择的是 NodePort 的方式，左边节点端口生成的两个端口，分别是 HTTP 协议的端口和 HTTPS 协议的端口，外网可通过 EIP:NodePort 或 Hostname:NodePort 来访问服务，如：


- 通过 EIP 访问：
  - `http://139.198.0.20:30798`
  - `https://139.198.0.20:31279`

- 通过在应用路由规则中设置的 Hostname 访问：
  - `http://demo.kubesphere.io:30798`
  - `https://demo.kubesphere.io:31279`


![网关设置-NodePort](/gateway-nodeport.png)

<!-- 若选择的是 LoadBalancer，则需要将公网 EIP 的 `ID` 填入 Annotation。

![loadbalancer 注解](/gateway-loadbalancer.png) -->