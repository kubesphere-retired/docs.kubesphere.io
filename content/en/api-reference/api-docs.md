---
title: "API Documentation"
keywords: "kubesphere, kubernetes, docker, helm, jenkins, istio, prometheus, devops, API"
description: "KubeSphere API documentation"
---

KubeSphere provides you with a rich RESTful specification APIs. Before calling an API, you need to log in KubeSphere background or access to the Swagger UI. Only after login and getting the JWT Bearer token, you can start to use KubeSphere API.

> - [KubeSphere API Docs](/api/kubesphere)
> - [Notification API Docs](/api/notification)

## API Architecture

The flowchart below illustrates KubeSphere API's architecture. All requests will be authenticated by the API Gateway and then sent to the corresponding service components. In the architecture graph, `/kapi/xxx.kubesphere.io` is the API for KubeSphere extended aggregation services, while APIs started with `/api` and `/apis` are Kubernetes' native APIs. It forwards users' requests of KubeSphere's native resources to Kubernetes API server through API Gateway in order to operate and manage native resources.

![API Flowchart](https://pek3b.qingstor.com/kubesphere-docs/png/20190627223641.png)
