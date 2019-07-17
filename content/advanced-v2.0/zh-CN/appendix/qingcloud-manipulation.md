---
title: "云平台配置端口转发和防火墙"
keywords: ''
description: ''
---

在 KubeSphere 中，若服务、应用路由或外网访问启用的是 NodePort 的方式，NodePort 会在主机上开放一个节点端口。一般来说，如果集群部署在 VPC 中，那么在云平台需要将该端口进行转发并在防火墙添加下行规则，确保流量能够通过该端口。

例如，在 QingCloud 云平台进行上述操作，假设在集群开启的节点端口 NodePort 为 31680 ，则需要参考如下步骤：

**a.端口转发**

其中内网 IP 可选集群中任意一个节点，例如 `192.168.0.8`。

1、点击 「VPC 网络」 进入集群所属的 VPC。

2、点击 「管理配置」。

3、点击 「添加规则」，在弹窗中填写端口转发的规则，将示例端口 31680 转发出来，详见 [QingCloud SDN 官方文档](https://docs.qingcloud.com/product/network/appcenter_network_config/config_portmapping)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190417084751.png)

**b.添加防火墙规则**

进入当前 VPC 的防火墙，为主机端口 31680 添加一条下行规则。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190417085948.png)