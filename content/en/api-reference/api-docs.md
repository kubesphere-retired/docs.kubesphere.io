---
title: "API Documentation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'This is API Documentation'
---

KubeSphere provides you with a rich RESTful specification API. Before calling API, you need to log in KubeSphere background or access to Swagger UI. Only after logging in and getting the JWT Bearer token, can you use KubeSphere API.

> - [KubeSphere API Docs](/api/kubesphere)
> - [Notification API Docs](/api/notification)

## API Architecture

The flowchart below illustrates KubeSphere API's architecture. All requests will be authenticated by the API Gateway and then sent to the various service components.

In the architecture graph, `/kapi/xxx.kubesphere.io` is the API for KubeSphere Extended Aggregation while APIs started with `/api` and `/apis` are Kubernetes' native APIs. KubeSphere forwarded users' requests of KubeSphere's native resources to Kubernetes API Server through API Gateway in order to operate and manage native resources.


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190627223641.png)
