---
title: "安装负载均衡器插件"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

服务或应用路由如果通过 LoadBalancer 的方式暴露到外网访问，则需要安装对应的负载均衡器插件来支持，集群可以部署云平台的虚拟机或直接部署在物理机，因此分别需要不同类型的负载均衡器插件进行对接，KubeSphere 分别开发了 [QingCloud 云平台负载均衡器插件](https://github.com/yunify/qingcloud-cloud-controller-manager) 和适用于适用于物理机部署 Kubernetes 的 [负载均衡器插件 Porter](https://github.com/kubesphere/porter)，并且已将它们在 GitHub 开源。

## 安装 QingCloud 云平台负载均衡器插件

如果在 QingCloud 云平台安装 KubeSphere，建议在 `conf/plugin-qingcloud.yaml` 中配置 QingCloud 负载均衡器插件相关参数，installer 将自动安装 [QingCloud 负载均衡器插件](https://github.com/yunify/qingcloud-cloud-controller-manager)。目前 QingCloud 负载均衡器插件只支持多节点集群的安装。

### 前提条件

已有 QingCloud 云平台账号，并下载 installer 至目标机器。

### 安装步骤

在安装 KubeSphere 前参考如下提示在 `conf/plugin-qingcloud.yaml` 中进行配置：

1. 其中值带有 * 号的值为必配项：
    - `qingcloud_access_key_id` 和 `qingcloud_secret_access_key`： 通过 [QingCloud 云平台](https://console.qingcloud.com/login) 的右上角账户图标选择 **API 密钥** 创建密钥获得；
    - `qingcloud_zone`：根据您的机器所在的 Zone 填写，例如：sh1a（上海一区-A）、sh1b（上海1区-B）、 pek2（北京2区）、pek3a（北京3区-A）、gd1（广东1区）、gd2a（广东2区-A）、ap1（亚太1区）、ap2a（亚太2区-A）；


最后六行为可配置项，适用于私有云场景下的配置，请根据实际情况配置。

```bash
# Access key pair can be created in QingCloud console
qingcloud_access_key_id: * Input your QingCloud key id *
qingcloud_secret_access_key: * Input your QingCloud access key *
# Zone should be the same as Kubernetes cluster
qingcloud_zone: * Input your Zone ID *
# QingCloud IaaS platform service url.
qingcloud_host: api.qingcloud.com
qingcloud_port: 443
qingcloud_protocol: https
qingcloud_uri: /iaas
qingcloud_connection_retries: 3
qingcloud_connection_timeout: 30
```


2. 设置 `qingcloud_lb_enable` 为 true，启用并安装 QingCloud 负载均衡器插件。其中 `qingcloud_vxnet_id` 为可配项，此参数配置适用于私有云场景，若填写后将为集群的服务及应用路由生成内网 IP，服务仅支持集群内部访问，若需要配置则填写待安装机器所在的私有网络 ID。

```bash
## QingCloud LoadBlancer Plugin
qingcloud_lb_enable: true
qingcloud_vxnet_id: SHOULD_BE_REPLACED
```

完成以上步骤的配置后，可继续参考安装指南完成其他配置并执行安装。

### 如何使用 QingCloud LB 插件

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

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190606004135.png)

3、在部署应用或创建应用路由、服务后，即可自动使用该公网 IP 或域名来暴露服务，方便用户快速访问。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190606004254.png)


## 安装负载均衡器插件 Porter

Porter 是一款适用于物理机部署 Kubernetes 的负载均衡器，该负载均衡器使用物理交换机实现，利用 BGP 和 ECMP 从而达到性能最优和高可用性，Porter 是一个提供用户在物理环境暴露服务和在云上暴露服务一致性体验的插件。

安装和使用 Porter 请参考 [Porter 项目](https://github.com/kubesphere/porter)。
