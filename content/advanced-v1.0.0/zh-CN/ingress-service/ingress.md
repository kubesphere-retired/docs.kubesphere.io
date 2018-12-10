---
title: "应用路由"
---

应用路由（Ingress）是用来聚合集群内服务的方式，对应的是 Kubernetes 的 Ingress 资源，后端使用了 Nginx Controller 来处理具体规则。Ingress 可以给 service 提供集群外部访问的 URL、负载均衡、SSL termination、HTTP 路由等。

## 前提条件

- 请确保已预先创建了 [服务](../services)，定义应用路由规则时需要选择后端的服务，Ingress 的流量被转发到它所匹配后端的服务。
- 若创建 https 协议的应用路由，请确保已预先创建了 https 证书相关的 [secret](../../configuration/secrets)。

## 创建应用路由

登录 KubeSphere 控制台，在所属的企业空间中选择已有 **项目** 或新建项目，访问左侧菜单栏，点击 **网络与服务 → 应用路由** 进入应用路由列表页。

创建应用路由支持两种方式，**页面创建** 和 **编辑模式**创建。若选择以编辑模式，可点击右上角编辑模式进入代码界面，支持 yaml 和 json 格式，可以方便习惯命令行操作的用户直接在页面上编辑 yaml 文件创建服务，以下主要介绍页面创建的方式。

### 第一步：填写基本信息

在应用路由列表页，点击 **创建** 按钮，填写基本信息:

- 名称：为应用路由起一个简洁明了的名称，便于用户浏览和搜索。
- 描述信息：详细介绍应用路由的特性，当用户想进一步了解该服务时，描述内容将变得尤为重要。

![](/ae-ingress-basic.png)

### 第二步：填写应用路由规则

填写应用路由的规则，如下图所示。

> - Hostname：应用规则的访问域名，最终使用此域名来访问对应的服务。如果访问入口是以 NodePort 的方式启用，需要保证 Host 能够在客户端正确解析到集群工作节点上；如果是以 LoadBalancer 方式启用，需要保证 Host 正确解析到负载均衡器的 IP 上。
> - 协议：支持 http 和 https 协议；
>
>    - http：一个 Host 配置项（Hostname）和一个 Path 列表，每个 Path 都关联一个后端服务，若使用 loadbalancer 将流量转发到 backend 之前，所有的入站请求都要先匹配 Host 和 Path。
>    - https：除了 http 所包含的配置，还需要 [secret](../../configuration/secrets)，在 secret 中可指定包含 TLS 私钥和证书来加密 Ingress，并且 TLS secret 中必须包含名为 tls.crt 和 tls.key 的密钥。
> - Path：应用规则的路径和对应的后端服务，端口需要填写成服务的端口。

![创建应用路由](/ae-ingress-rules.png)

### 第三步：添加注解

为应用规则添加注解，annotation 和 label 一样都是 key/value 键值对映射结构例如：

```
nginx.ingress.kubernetes.io/rewrite-target: /
```

### 第四步：添加标签

标签设置页用于指定资源对应的一组或者多组标签（Label）。Label 以键值对的形式附加到任何对象上，定义好标签后，其他对象就可以通过标签来对对象进行引用，最常见的用法便是通过节点选择器来引用对象。


## 访问应用路由

应用路由创建完成后，确保设置的域名可以解析到外网访问入口的 IP 地址，即可使用域名访问。如在私有环境中，可以使用修改本地 hosts 文件的方式来使用应用路由。例如，

|设置的域名|路径|外网访问入口方式|端口/IP|集群工作节点IP|
----|---|---|---|---
|demo.kubesphere.io|/|NodePort|32586,31920|192.168.0.4,192.168.0.3,192.168.0.2|
|demo2.kubesphere.io|/|LoadBalancer|139.198.1.1|192.168.0.4,192.168.0.3,192.168.0.2

如上表格，创建了两条应用路由规则，分别使用 NodePort 和 LoadBalancer 方式的访问入口。

**NodePort**

对于外网访问方式设置的 NodePort，如果是在私有环境下，我们可以直接在主机的 hosts 文件中添加记录来使域名解析到对应的 IP。例如，对于 `demo.kubesphere.io`，我们添加如下记录：

```
192.168.0.4 demo.kubesphere.io
```

需要保证客户端与集群工作节点 192.168.0.4 网络可通，可以使用其它工作节点的 IP，只要客户端和工作节点网络是通的，设置完之后，在浏览器中使用域名和网关的端口号 `http://demo.kubesphere.io:32586` 即可访问。(此示例中用的是第一个端口 32586，它对应的 HTTP 协议的 80 端口，目前仅支持 HTTP 协议，将在下个版本中支持 HTTPS 协议。) 

**LoadBalancer**

如果外网访问方式设置的是 LoadBalancer，对于 `demo2.kubesphere.io`，除了参考以上方式在 hosts 文件中添加记录之外，还可以使用 [nip.io](http://nip.io/)  作为应用路由的域名解析。nip.io 是一个免费的域名解析服务，可以将符合下列格式的域名解析对应的ip，可用来作为应用路由的解析服务，省去配置本地 hosts 文件的步骤。

**格式**

```
10.0.0.1.nip.io maps to 10.0.0.1  
app.10.0.0.1.nip.io maps to 10.0.0.1
customer1.app.10.0.0.1.nip.io maps to 10.0.0.1
customer2.app.10.0.0.1.nip.io maps to 10.0.0.1
otherapp.10.0.0.1.nip.io maps to 10.0.0.1
```

例如，应用路由的网关公网 IP 地址为 139.198.121.154 , 在创建应用路由时，Hostname 一栏填写为 `demo2.kubesphere.139.198.121.154.nip.io`，其它保持原来的设置。
![路由规则](/ae-ingress-demo.png)

创建完成后，直接使用 `http://demo2.kubesphere.139.198.121.154.nip.io`，即可访问对应的服务。
![访问域名登录页面](/router-login.png)


