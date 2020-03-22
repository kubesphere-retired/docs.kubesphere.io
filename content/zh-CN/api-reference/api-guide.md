---
title: "如何调用 API"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

ks-apigateway 是 KubeSphere 的 API 网关，当您部署 KubeSphere 之后，可参考如下的 API 调用流程。


## 第一步：暴露 ks-apigatway 服务

通过 NodePort 的方式暴露 kubesphere-system namespace 下 ks-apigatway 服务。

使用 admin 账户登录 KubeSphere，在右下角的 「工具箱」 打开 Web Kubectl，执行下述命令。

```bash
kubectl -n kubesphere-system patch svc ks-apigateway -p '{"spec":{"type":"NodePort","ports":[{"name":"ks-apigateway","port":80,"protocal":"TCP","targetPort":2018,"nodePort":30881}]}}'
```

> 上述命令通过 NodePort 端口30881对外暴露 ks-apigateway 服务，可以通过集群中任意 <节点IP>:<30881> 端口访问到 ks-apigateway 服务。


## 第二步：获取 Token

KubeSphere 所有 API 都需要通过 Bearer Token 进行认证，在开始 API 调用之前，需要先通过 `/kapis/iam.kubesphere.io/v1alpha2/login` 接口获取 `access_token`。

请求示例:

```bash
curl -X POST \
  http://192.168.0.20:30881/kapis/iam.kubesphere.io/v1alpha2/login \
  -H 'Content-Type: application/json' \
  -d '{
  "username":"admin",
  "password":"P@88w0rd"
}'
```

返回结果:

```
{
 "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGt1YmVzcGhlcmUuaW8iLCJpYXQiOjE1NzM3Mjg4MDMsInVzZXJuYW1lIjoiYWRtaW4ifQ.uK1KoK1c8MFkm8KnyORFTju31OsZ1ajtGNZQnUS1qk8"
}
```

> 示例中`192.168.0.20`是本示例的节点 IP，请注意替换。


## 第三步：调用 API

通过上述步骤获取到 `access_token` 后，在之后所有的 API 请求中需带上认证请求头 `Authorization: Bearer <access_token>`，可进一步参考 [API 文档](../api-docs)。

例：获取componentstatuses

```bash
curl -X GET \
  http://192.168.0.20:30881/api/v1/componentstatuses \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGt1YmVzcGhlcmUuaW8iLCJpYXQiOjE1NzM3Mjg4MDMsInVzZXJuYW1lIjoiYWRtaW4ifQ.uK1KoK1c8MFkm8KnyORFTju31OsZ1ajtGNZQnUS1qk8'
```

返回结果:

```
{
  "kind": "ComponentStatusList",
  "apiVersion": "v1",
  "metadata": {
    "selfLink": "/api/v1/componentstatuses"
  },
  "items": [
    {
      "metadata": {
        "name": "scheduler",
        "selfLink": "/api/v1/componentstatuses/scheduler",
        "creationTimestamp": null
      },
      "conditions": [
        {
          "type": "Healthy",
          "status": "True",
          "message": "ok"
        }
      ]
    },
    {
      "metadata": {
        "name": "controller-manager",
        "selfLink": "/api/v1/componentstatuses/controller-manager",
        "creationTimestamp": null
      },
      "conditions": [
        {
          "type": "Healthy",
          "status": "True",
          "message": "ok"
        }
      ]
    },
    {
      "metadata": {
        "name": "etcd-1",
        "selfLink": "/api/v1/componentstatuses/etcd-1",
        "creationTimestamp": null
      },
      "conditions": [
        {
          "type": "Healthy",
          "status": "True",
          "message": "{\"health\": \"true\"}"
        }
      ]
    },
    {
      "metadata": {
        "name": "etcd-0",
        "selfLink": "/api/v1/componentstatuses/etcd-0",
        "creationTimestamp": null
      },
      "conditions": [
        {
          "type": "Healthy",
          "status": "True",
          "message": "{\"health\": \"true\"}"
        }
      ]
    },
    {
      "metadata": {
        "name": "etcd-2",
        "selfLink": "/api/v1/componentstatuses/etcd-2",
        "creationTimestamp": null
      },
      "conditions": [
        {
          "type": "Healthy",
          "status": "True",
          "message": "{\"health\": \"true\"}"
        }
      ]
    }
  ]
}
```

## 如何访问 Swagger UI

KubeSphere 的 API 可以在 [Swagger UI](https://swagger.io/) 中预览，在浏览器中通过 URL `http://<节点IP>:<NodePort>/swagger-ui` 访问 Swagger UI，比如 `http://192.168.0.20:30881/swagger-ui/`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190704190556.png)
