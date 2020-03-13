---
title: "示例十二 - 使用 Ingress-Nginx 进行灰度发布"
keywords: 'nginx, kubernetes, docker, helm, jenkins, istio, prometheus'
description: '使用 Ingress-Nginx 进行灰度发布'
---

在 [Bookinfo 微服务的灰度发布示例](../bookinfo-canary) 中，KubeSphere 基于 Istio 对 Bookinfo 微服务示例应用实现了灰度发布。有用户表示自己的项目还没有上 Istio，要如何实现灰度发布？

在 [Ingress-Nginx (0.21.0 版本)](https://github.com/kubernetes/ingress-nginx/releases/tag/nginx-0.21.0) 中，引入了一个新的 Canary 功能，可用于为网关入口配置多个后端服务，还可以使用指定的 annotation 来控制多个后端服务之间的流量分配。 KubeSphere 在 [2.0.2 的版本](../zh-CN/release/release-v202/) 中，升级了项目网关 (Ingress Controller) 版本至 0.24.1，支持基于 [Ingress-Nginx](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#canary) 的灰度发布。

上一篇文章已经对灰度发布的几个应用场景进行了详细介绍，本文将直接介绍和演示基于 KubeSphere 使用应用路由 (Ingress) 和项目网关 (Ingress Controller) 实现灰度发布。

> 说明： 本文用到的示例 yaml 源文件及代码已上传至 [GitHub](https://github.com/kubesphere/tutorial)，可 clone 至本地方便参考。

## Ingress-Nginx Annotation 简介

KubeSphere 基于 [Nginx Ingress Controller](https://github.com/kubernetes/ingress-nginx/#nginx-ingress-controller) 实现了项目的网关，作为项目对外的流量入口和项目中各个服务的反向代理。而 Ingress-Nginx 支持配置 Ingress Annotations 来实现不同场景下的灰度发布和测试，可以满足金丝雀发布、蓝绿部署与 A/B 测试等业务场景。

> [Nginx Annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#canary) 支持以下 4 种 Canary 规则：
> - `nginx.ingress.kubernetes.io/canary-by-header`：基于 Request Header 的流量切分，适用于灰度发布以及 A/B 测试。当 Request Header 设置为 `always` 时，请求将会被一直发送到 Canary 版本；当 Request Header 设置为 `never` 时，请求不会被发送到 Canary 入口；对于任何其他 Header 值，将忽略 Header，并通过优先级将请求与其他金丝雀规则进行优先级的比较。
> - `nginx.ingress.kubernetes.io/canary-by-header-value`：要匹配的 Request Header 的值，用于通知 Ingress 将请求路由到 Canary Ingress 中指定的服务。当 Request Header 设置为此值时，它将被路由到 Canary 入口。该规则允许用户自定义 Request Header 的值，必须与上一个 annotation (即：canary-by-header) 一起使用。
> - `nginx.ingress.kubernetes.io/canary-weight`：基于服务权重的流量切分，适用于蓝绿部署，权重范围 0 - 100 按百分比将请求路由到 Canary Ingress 中指定的服务。权重为 0 意味着该金丝雀规则不会向 Canary 入口的服务发送任何请求，权重为 100 意味着所有请求都将被发送到 Canary 入口。
> - `nginx.ingress.kubernetes.io/canary-by-cookie`：基于 cookie 的流量切分，适用于灰度发布与 A/B 测试。用于通知 Ingress 将请求路由到 Canary Ingress 中指定的服务的cookie。当 cookie 值设置为 `always` 时，它将被路由到 Canary 入口；当 cookie 值设置为 `never` 时，请求不会被发送到 Canary 入口；对于任何其他值，将忽略 cookie 并将请求与其他金丝雀规则进行优先级的比较。
>
> 注意：金丝雀规则按优先顺序进行如下排序：
>
> `canary-by-header - > canary-by-cookie - > canary-weight`

把以上的四个 annotation 规则可以总体划分为以下两类：

- 基于权重的 Canary 规则

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826201233.png)

- 基于用户请求的 Canary 规则

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826204915.png)

## 视频教程

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/KS2.1_12-ingress-nginx-grayscale-release.mp4">
</video>


## 前提条件

- 使用 project-admin 登陆创建 ingress-demo 项目
- 使用 admin 用户登陆，在KubeSphere 右下角的工具箱打开 web kubectl

## 第一步：创建项目和 Production 版本的应用

1.1. 在 KubeSphere 中创建一个企业空间 (workspace) 和项目 (namespace) ，可参考 [多租户管理快速入门](../admin-quick-start)。如下已创建了一个示例项目。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200211101511.png)

1.2. 本文为了快速创建应用，使用集群的 **admin** 账号登录，在项目中创建工作负载和服务时可通过 `编辑 yaml` 的方式，或使用 KubeSphere 右下角的**工具箱**打开 `web kubectl` 并使用以下命令和 yaml 文件创建一个 Production 版本的应用并暴露给集群外访问。如下创建 Production 版本的 `deployment` 和 `service`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200229121159.png)

```bash
$ kubectl apply -f production.yaml -n ingress-demo
deployment.extensions/production created
service/production created
```

其中用到的 yaml 文件如下：

**production.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: production
  labels:
    app: production
spec:
  replicas: 1
  selector:
    matchLabels:
      app: production
  template:
    metadata:
      labels:
        app: production
    spec:
      containers:
      - name: production
        image: mirrorgooglecontainers/echoserver:1.10
        ports:
        - containerPort: 8080
        env:
          - name: NODE_NAME
            valueFrom:
              fieldRef:
                fieldPath: spec.nodeName
          - name: POD_NAME
            valueFrom:
              fieldRef:
                fieldPath: metadata.name
          - name: POD_NAMESPACE
            valueFrom:
              fieldRef:
                fieldPath: metadata.namespace
          - name: POD_IP
            valueFrom:
              fieldRef:
                fieldPath: status.podIP

---

apiVersion: v1
kind: Service
metadata:
  name: production
  labels:
    app: production
spec:
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
    name: http
  selector:
    app: production
```

1.3. 创建 Production 版本的应用路由 (Ingress)。

```bash
$ kubectl apply -f production.ingress -n ingress-demo
ingress.extensions/production created
```

其中用到的 yaml 文件如下：

**production.ingress**

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: production
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
  - host: kubesphere.io
    http:
      paths:
      - backend:
          serviceName: production
          servicePort: 80
```

## 第二步：访问 Production 版本的应用

2.1. 此时，在 KubeSphere UI 的企业空间 demo-workspace 下，可以看到 ingress-demo 项目下的所有资源。

**Deployment**
![](https://pek3b.qingstor.com/kubesphere-docs/png/20200229122819.png)

**Service**
![](https://pek3b.qingstor.com/kubesphere-docs/png/20200229122918.png)

**Route (Ingress)**
![](https://pek3b.qingstor.com/kubesphere-docs/png/20200229122939.png)

2.2. 访问 Production 版本的应用需确保当前项目已开启了网关，在**外网访问**下打开网关，类型为 `NodePort`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826161846.png)

2.3. 如下访问 Production 版本的应用，注意以下命令需要在 SSH 客户端中执行。


```bash
$ curl --resolve kubesphere.io:30205:192.168.0.88 kubesphere.io:30205
# 注意，加上 --resolve 参数则无需在本地配置 /etc/hosts 中的 IP 与域名映射，否则需要预先在本地配置域名映射，其中 192.168.0.88 是项目内的网关地址。

Hostname: production-6b4bb8d58d-7r889

Pod Information:
	node name:	ks-allinone
	pod name:	production-6b4bb8d58d-7r889
	pod namespace:	ingress-demo
	pod IP:	10.233.87.165

Server values:
	server_version=nginx: 1.12.2 - lua: 10010

Request Information:
	client_address=10.233.87.225
	method=GET
	real path=/
	query=
	request_version=1.1
	request_scheme=http
	request_uri=http://kubesphere.io:8080/

Request Headers:
	accept=*/*
	host=kubesphere.io:30205
	user-agent=curl/7.29.0
apiVersion: extensions/v1beta1
	x-forwarded-for=192.168.0.88
	x-forwarded-host=kubesphere.io:30205
	x-forwarded-port=80
	x-forwarded-proto=http
	x-original-uri=/
	x-real-ip=192.168.0.88
	x-request-id=9596df96e994ea05bece2ebbe689a2cc
	x-scheme=http

Request Body:
	-no body in request-
```

## 第三步：创建 Canary 版本

参考将上述 Production 版本的 `production.yaml` 文件，再创建一个 Canary 版本的应用，包括一个 Canary 版本的 `deployment` 和 `service` (为方便快速演示，仅需将 `production.yaml` 的 deployment 和 service 中的关键字 `production` 直接替换为 `canary`，实际场景中可能涉及业务代码变更)。

## 第四步：Ingress-Nginx Annotation 规则

### 基于权重 (Weight)

基于权重的流量切分的典型应用场景就是`蓝绿部署`，可通过将权重设置为 0 或 100 来实现。例如，可将 Green 版本设置为主要部分，并将 Blue 版本的入口配置为 Canary。最初，将权重设置为 0，因此不会将流量代理到 Blue 版本。一旦新版本测试和验证都成功后，即可将 Blue 版本的权重设置为 100，即所有流量从 Green 版本转向 Blue。

4.1. 使用以下 `canary.ingress` 的 yaml 文件再创建一个基于权重的 Canary 版本的应用路由 (Ingress)。

> 注意：要开启灰度发布机制，首先需设置 `nginx.ingress.kubernetes.io/canary: "true"` 启用 Canary，以下 Ingress 示例的 Canary 版本使用了**基于权重进行流量切分**的 annotation 规则，将分配 **30%** 的流量请求发送至 Canary 版本。

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: canary
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "30"
spec:
  rules:
  - host: kubesphere.io
    http:
      paths:
      - backend:
          serviceName: canary
          servicePort: 80
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826162507.png)

4.2. 访问应用的域名（在 SSH 中执行以下命令）。

> 说明：应用的 Canary 版本基于权重 (30%) 进行流量切分后，访问到 Canary 版本的概率接近 30%，流量比例可能会有小范围的浮动。

```
$ for i in $(seq 1 10); do curl -s --resolve kubesphere.io:30205:192.168.0.88 kubesphere.io:30205 | grep "Hostname"; done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205162603.png)

### 基于 Request Header

4.3. 基于 Request Header 进行流量切分的典型应用场景即`灰度发布或 A/B 测试场景`。参考以下截图，在 KubeSphere 给 Canary 版本的应用路由 (Ingress) 新增一条 annotation `nginx.ingress.kubernetes.io/canary-by-header: canary` (这里的 annotation 的 value 可以是任意值)，使当前的 Ingress 实现基于 Request Header 进行流量切分。

> 说明：金丝雀规则按优先顺序 `canary-by-header - > canary-by-cookie - > canary-weight` 进行如下排序，因此以下情况将忽略原有 canary-weight 的规则。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826174117.png)

4.4. 在请求中加入不同的 Header 值，再次访问应用的域名。

> 说明：
>
> 举两个例子，如开篇提到的当 Request Header 设置为 `never` 或 `always` 时，请求将`不会`或`一直`被发送到 Canary 版本；
>
> 对于任何其他 Header 值，将忽略 Header，并通过优先级将请求与其他 Canary 规则进行优先级的比较（如下第二次请求已将`基于 30% 权重`作为第一优先级）。


```
$ for i in $(seq 1 10); do curl -s -H "canary: never" --resolve kubesphere.io:30205:192.168.0.88 kubesphere.io:30205 | grep "Hostname"; done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205231401.png)

```
$ for i in $(seq 1 10); do curl -s -H "canary: other-value" --resolve kubesphere.io:30205:192.168.0.88 kubesphere.io:30205 | grep "Hostname"; done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205231455.png)

4.5. 此时可以在上一个 annotation (即 canary-by-header）的基础上添加一条 `nginx.ingress.kubernetes.io/canary-by-header-value: user-value` 。用于通知 Ingress 将请求路由到 Canary Ingress 中指定的服务。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826184040.png)

4.6. 如下访问应用的域名，当 Request Header 满足此值时，所有请求被路由到 Canary 版本（该规则允许用户自定义 Request Header 的值）。

```
$ for i in $(seq 1 10); do curl -s -H "canary: user-value" --resolve kubesphere.io:30205:192.168.0.88 kubesphere.io:30205 | grep "Hostname"; done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205231634.png)

### 基于 Cookie

4.7. 与基于 Request Header 的 annotation 用法规则类似。例如在 `A/B 测试场景` 下，需要让地域为北京的用户访问 Canary 版本。那么当 cookie 的 annotation 设置为 `nginx.ingress.kubernetes.io/canary-by-cookie: "users_from_Beijing"`，此时后台可对登录的用户请求进行检查，如果该用户访问源来自北京则设置 cookie  `users_from_Beijing` 的值为 `always`，这样就可以确保北京的用户仅访问 Canary 版本。


## 总结

灰度发布可以保证整体系统的稳定，在初始灰度的时候就可以对新版本进行测试、发现和调整问题，以保证其影响度。本文通过多个示例演示和说明了基于 KubeSphere 使用应用路由 (Ingress) 和项目网关 (Ingress Controller) 实现灰度发布，并详细介绍了 Ingress-Nginx 的四种 Annotation，还未使用 Istio 的用户也能借助 Ingress-Nginx 轻松实现灰度发布与金丝雀发布。

## 参考

- [NGINX Ingress Controller - Annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#canary)
- [canary deployment with ingress-nginx](https://www.elvinefendi.com/2018/11/25/canary-deployment-with-ingress-nginx.html)
- [Canary Deployments on Kubernetes without Service Mesh](https://medium.com/@domi.stoehr/canary-deployments-on-kubernetes-without-service-mesh-425b7e4cc862)
