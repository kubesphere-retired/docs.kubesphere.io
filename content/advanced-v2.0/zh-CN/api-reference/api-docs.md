---
title: "API 文档"
keywords: ''
description: ''
---

KubeSphere 提供了丰富的 RESTful 规范的 API 供您使用，在开始调用之前需要登录 KubeSphere 后台或访问 Swagger UI 登录后获得 JWT Bearer token 后，才可以使用 KubeSphere API。

- <a href="//docs.kubesphere.io/advanced-v2.0/api/kubesphere" target="_blank">KubeSphere API 文档</a>
- <a href="//docs.kubesphere.io/advanced-v2.0/api/notification" target="_blank">Notification API 文档</a>

## API 架构

下图是 KubeSphere API 的架构，所有请求都将通过 API Gateway 进行认证授权代理后发送到各个服务组件。

其中 `/kapi/xxx.kubesphere.io` 是 KubeSphere 拓展聚合的 API，`/api` 和 `/apis` 开头的都属于 Kubernetes 原生的 API，KubeSphere 把用户对原生 Kubernetes 资源的请求通过 API Gateway 转发到 Kubernetes API Server 对原生资源进行操作和管理。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190627223641.png)
