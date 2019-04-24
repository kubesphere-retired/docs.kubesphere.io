---
title: "安装 QingCloud 负载均衡器插件"
---

服务或应用路由如果通过 LoadBalancer 的方式暴露到外网访问，则需要安装对应的负载均衡器插件来支持。如果在 QingCloud 云平台安装 KubeSphere，建议在 `conf/vars.yml` 中配置 QingCloud 负载均衡器插件相关参数，installer 将自动安装 [QingCloud 负载均衡器插件](https://github.com/yunify/qingcloud-cloud-controller-manager)。

## 前提条件

已有 QingCloud 云平台账号，并下载 installer 至目标机器。

## 安装步骤

参考如下提示在 `conf/vars.yml` 中进行配置：

1. 配置 QingCloud API key pairs 和 zone：

```bash
# Access key pair can be created in QingCloud console
qingcloud_access_key_id: Input your QingCloud key id
qingcloud_secret_access_key: Input your QingCloud access key
# Zone should be the same as Kubernetes cluster
qingcloud_zone: Input your Zone ID
# QingCloud IaaS platform service url.
qingcloud_host: api.qingcloud.com
qingcloud_port: 443
qingcloud_protocol: https
qingcloud_uri: /iaas
qingcloud_connection_retries: 3
qingcloud_connection_timeout: 30
```


|**QingCloud-CSI** | **Description**|
| --- | ---|
| qingcloud\_access\_key\_id ， <br> qingcloud\_secret\_access\_key|通过 [QingCloud 云平台控制台](https://console.qingcloud.com/login) 的右上角账户图标选择 **API 密钥** 创建密钥获得|
|qingcloud\_zone| zone 应与 Kubernetes 集群所在区相同，CSI 插件将会操作此区的存储卷资源。例如：zone 可以设置为 sh1a（上海一区-A）、sh1b（上海1区-B）、 pek2（北京2区）、pek3a（北京3区-A）、gd1（广东1区）、gd2a（广东2区-A）、ap1（亚太1区）、ap2a（亚太2区-A）|

2. 安装并启用 QingCloud 负载均衡器插件：

```bash
## QingCloud LoadBlance
qingcloud_lb_enable: true
```
 