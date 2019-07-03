---
title: "如何调用 KubeSphere API"
---

ks-apigateway 是 KubeSphere 的 API 网关，当您部署 KubeSphere 之后，可参考如下的 API 调用流程。


## 第一步：暴露 ks-apigatway 服务

### 使用 UI

1、进入到 `system-workspace`-> `kubesphere-system` 这个项目下服务列表，点开 `ks-apigateway` 这个服务的详情页。

2、点击更多操作->编辑外网访问，设置访问方式为 `NodePort`，点击确定。

3、在服务详情页即可看到 NodePort。

### 使用命令行

1、使用 admin 账户登录 kubesphere，打开 terminal，执行下述命令。

```bash
$ kubectl -n kubesphere-system patch svc ks-apigateway -p '{"spec":{"type":"NodePort"}}'
service/ks-apigateway patched
```

2、通过以下命令查看生成的端口号，如下查看的端口号返回是 31078。

```bash
$ kubectl -n kubesphere-system get svc ks-apigateway -o jsonpath='{.spec.ports[0].nodePort}'
31078
```

## 第二步：访问 API

API Gateway 可以通过集群中任一节点的 `节点IP:NodePort`，请参考 API docs。

**TBD**