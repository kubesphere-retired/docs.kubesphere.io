---
title: "如何调用 API"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

ks-apigateway 是 KubeSphere 的 API 网关，当您部署 KubeSphere 之后，可参考如下的 API 调用流程。


## 第一步：暴露 ks-apigatway 服务

可通过将 ks-apigatway 服务的端口设置为 NodePort 形式暴露 ks-apigatway 服务，可以使用 UI 或命令行这两种方式：

<div class="md-tabs">
<input type="radio" name="tabs" id="ui" checked="checked">
<label for="ui">使用 UI</label>
<span class="md-tab">

### 使用 UI

1、登录 KubeSphere 控制台，进入企业空间 `system-workspace`-> 项目 `kubesphere-system`，在这个项目下服务列表，点击进入 `ks-apigateway` 这个服务的详情页。

2、点击 「更多操作」 -> 「编辑外网访问」，设置访问方式为 `NodePort`，点击确定。

3、在服务详情页即可看到生成的 NodePort 为 31078。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190704143243.png)

</span>
<input type="radio" name="tabs" id="cmd">
<label for="cmd">使用命令行</label>
<span class="md-tab">

### 使用命令行

1、使用 admin 账户登录 KubeSphere，在右下角的 「工具箱」 打开 Web Kubectl，执行下述命令。

```bash
$ kubectl -n kubesphere-system patch svc ks-apigateway -p '{"spec":{"type":"NodePort"}}'
service/ks-apigateway patched
```

2、通过以下命令查看生成的端口号，如下查看的端口号返回是 31078。

```bash
$ kubectl -n kubesphere-system get svc ks-apigateway -o jsonpath='{.spec.ports[0].nodePort}'
31078
```

</span>
</div>

## 第二步：获取 Token

KubeSphere 所有 API 都需要通过 Bearer Token 进行认证，在开始 API 调用之前，需要先通过 `/kapis/iam.kubesphere.io/v1alpha2/login` 接口获取 `access_token`。

在 KubeSphere 右下角的 「工具箱」 打开 Web Kubectl，执行下述命令，其中 `192.168.0.20` 是本示例的节点 IP，31078 是上一步暴露的 ks-apigatway 服务。

```bash
$ curl -X POST \
  http://192.168.0.20:31078/kapis/iam.kubesphere.io/v1alpha2/login \
  -H 'Content-Type: application/json' \
  -d '{
	"username":"admin",
	"password":"P@88w0rd"
}'
{
 "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGt1YmVzcGhlcmUuaW8iLCJpYXQiOjE1NzM3Mjg4MDMsInVzZXJuYW1lIjoiYWRtaW4ifQ.uK1KoK1c8MFkm8KnyORFTju31OsZ1ajtGNZQnUS1qk8"
}
```

## 第三步：调用 API

通过上述步骤拿到 Access Token 后，在之后所有的 API 请求中需带上认证请求头 `Authorization: Bearer <access_token>`，可进一步参考 [API 文档](../api-docs)。

例：获取componentstatuses
```bash
$ curl -X GET \
  http://192.168.0.20:31078/api/v1/componentstatuses \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGt1YmVzcGhlcmUuaW8iLCJpYXQiOjE1NzM3Mjg4MDMsInVzZXJuYW1lIjoiYWRtaW4ifQ.uK1KoK1c8MFkm8KnyORFTju31OsZ1ajtGNZQnUS1qk8'
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

KubeSphere 的 API 可以在 [Swagger UI](https://swagger.io/) 中预览，在浏览器中通过 URL `http://IP:NodePort/swagger-ui` 访问 Swagger UI，比如 `http://192.168.0.20:31078/swagger-ui/`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190704190556.png)
