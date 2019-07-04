---
title: "如何调用 API"
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

KubeSphere 对所有 API 进行了加密处理，在开始调用之前需要登录 KubeSphere 后台获取 API Access Token 或访问 Swagger UI 登录后获得 API Access Token 并授权后，才可以使用 KubeSphere API。获取 Token 也有两种方式，您可以通过命令行或访问 Swaggui UI 使用 admin 账号密码登录查看。

### 命令行

在 KubeSphere 右下角的 「工具箱」 打开 Web Kubectl，执行下述命令，其中 `192.168.0.20` 是节点 IP。

```
curl -X POST "http://192.168.0.20:31078/kapis/iam.kubesphere.io/v1alpha2/login" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"password\": \"P@88w0rd\", \"username\": \"admin\"}"
{
 "access_token": "eyJhbGxxxxxxS44"
```

### Swagger UI

1、在浏览器中通过 URL `http://IP:NodePort/swaggerui` 访问 Swagger UI，比如 `http://192.168.0.20:31078/swagger-ui/`。

2、展开 IAM 进入 POST `/kapis/iam.kubesphere.io/v1alpha2/login` 下，点击 「Try it out」，然后在 body 中输入 admin 用户的账号密码，点击 「Execute」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190704142518.png)

3、在 Responses 中可以看到返回 200，并且 access_token 和 Request URL 也都返回在页面中。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190704142807.png)

## 第三步：调用 API

通过上述步骤拿到 Access Token 后，即可在用户自定义的请求函数中调用 KubeSphere API，可进一步参考 [API 文档](../api-docs)。
