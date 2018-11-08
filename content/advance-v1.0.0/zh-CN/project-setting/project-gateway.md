---
title: "外网访问"
---

在当前项目中，左侧菜单选择 **项目设置 → 外网访问**，点击 **设置网关**，即应用路由的网关入口，每个项目都有一个独立的网关入口。

![应用路由列表](/ae-gateway-list.png)

2. 在弹出的窗口选择网关的类型，支持以下两种访问方式：

> - NodePort: 此方式网关可以通过工作节点对应的端口来访问服务。
> - LoadBalancer: 此方式网关可以通过统一的一个外网 IP 来访问 (需要对应的负载均衡器插件)。

3. 点击 **保存** 来创建网关，如下图选择的是 NodePort 的方式，左边节点端口生成的两个端口，分别是 HTTP 协议的 80 端口和 HTTPS 协议的 443 端口，外网可通过 EIP 或 Hostname + 端口号来访问服务。完成后选择关闭。

![网关设置-NodePort](/gateway-nodeport.png)

4. 若选择的是 LoadBalancer，则需要将公网 EIP 的 `ID` 填入 Annotation，如下图所示。

![loadbalancer 注解](/gateway-loadbalancer.png)