---
title: "自制应用"
---

应用通常是一个独立完整的业务功能，比如一个 bookinfo 的书城网站就是一个应用，一个应用由多个服务组件组成，对于微服务而言每个组件都可以独立于其他组件创建、启动、运行和治理的。一个应用组件中又可以有一个或多个组件版本，例如 bookinfo 示例应用中 Reviews 组件就有三个版本，而不同版本后端对应了不同的工作负载。

自制应用允许用户选择已有服务或者新建服务组件来构建应用。

## 创建自制应用

### 前提条件

- 已创建了企业空间、项目和普通用户 `project-regular` 账号，并且项目已开启了外网访问 (访问方式为 `NodePort`)，请参考 [多租户管理快速入门](../../quick-start/admin-quick-start)；
- 使用项目管理员 `project-admin` 邀请项目普通用户 `project-regular` 加入项目并授予 `operator` 角色，若还未邀请请参考 [多租户管理快速入门 - 邀请成员](../../quick-start/admin-quick-start/#邀请成员)；
- 已准备微服务的各个组件及镜像。

### 操作说明

1. 使用 `project-regular` 账号进入项目 demo-namespace 后，点击 「应用」，选择 「自制应用」，点击 「部署新应用」，然后在弹窗中选择 「通过服务构建应用」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190429214732.png)

2. 填写应用的基本信息。


- 应用名称：为应用起一个简洁明了的名称，便于用户浏览和搜索。
- 应用版本：应用的版本号，如 v1
- 应用治理：默认开启，开启应用治理后会在每个组件中以 SideCar 的方式注入 Istio-proxy 容器
- 描述信息：简单介绍该应用，让用户进一步了解应用的功能。


3. 应用组件组合了工作负载和服务作为应用中的组件，点击 「添加组件」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190429205025.png)

4. 参考如下提示填写新组件的基本信息。


- 名称：为组件起一个简洁明了的名称，例如 productpage
- 组件版本：应用组件的版本号，例如 v1、v2
- 别名：别名可以由任意字符组成，帮助您更好的区分资源，并支持中文名称。
- 负载类型：支持无状态服务(部署)及有状态服务(有状态副本集)
- 副本：指定副本策略，设置多个副本可以保证应用组件的高可用
- 容器组模板：点击 「添加容器」，可以添加容器工作负载和服务，容器组模板的说明可参考 [部署 - 容器组模板](../../workload/deployments)，[有状态副本集 - 容器组模板](../../workload/statefulsets) 和 [服务](../../ingress-service/services)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190429210144.png)

5. 添加存储卷需要预先创建存储卷或使用临时存储卷，可参考 [存储卷](../../storage/pvc)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190429220038.png)

6. 点击 「保存」，应用需要暴露给其他用户访问则需要添加应用路由，点击 「添加应用路由规则」，可参考 [添加应用路由](../../ingress-service/ingress)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190429220245.png)

 






