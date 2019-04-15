---
title: "Bookinfo 应用的灰度发布示例"
---

灰度发布，是指在黑与白之间，能够平滑过渡的一种发布方式。通俗来说，即让产品的迭代能够按照不同的灰度策略对新版本进行线上环境的测试，灰度发布可以保证整体系统的稳定，在初始灰度的时候就可以对新版本进行测试、发现和调整问题，以保证其影响度。KubeSphere 基于 [istio](https://istio.io/) 提供了蓝绿部署、金丝雀发布、流量镜像等三种灰度策略，无需修改应用的服务代码，即可实现灰度、流量治理、Tracing、流量监控、调用链等服务治理功能，关于每一种策略的描述参见 [灰度发布](../../ingress-service)。

## 目的

本示例在 KubeSphere 中使用 istio 官方提供的 Bookinfo 示例，创建一个微服务应用并对其中的服务组件进行灰度发布，演示 KubeSphere 服务治理的能力。

## 前提条件

- 已创建了企业空间和项目，若还未创建请参考 [管理员快速入门](../admin-quick-start)；
- 使用管理员快速入门创建的 `project-regular` 用户登录 KubeSphere，进入已创建的企业空间下的项目 `demo-namespace`；
- 已安装 [QingCloud cloud-controller-manager](https://github.com/yunify/qingcloud-cloud-controller-manager) LB 插件。

## 预估时间

约 30 ~ 50 分钟。

### Bookinfo 微服务应用架构

Bookinfo 应用分为四个单独的微服务：

- productpage ：productpage 微服务会调用 details 和 reviews 两个微服务，用来生成页面。
- details ：这个微服务包含了书籍的信息。
- reviews ：这个微服务包含了书籍相关的评论。它还会调用 ratings 微服务。
- ratings ：ratings 微服务中包含了由书籍评价组成的评级信息。

reviews 微服务有 3 个版本：

- v1 版本不会调用 ratings 服务。
- v2 版本会调用 ratings 服务，并使用 1 到 5 个黑色星形图标来显示评分信息。
- v3 版本会调用 ratings 服务，并使用 1 到 5 个红色星形图标来显示评分信息。

下图展示了这个应用的端到端架构。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414172945.png)
<center>(Bookinfo 架构图与示例说明参考自 https://istio.io/docs/examples/bookinfo/)</center>

## 操作示例

### 设置外网访问

由于本示例需要引入外网访问流量，因此需要先在 KubeSphere 集群所在的区域申请公网 EIP，然后在 KubeSphere 的外网访问开启 LoadBalancer 的网关。
 
1. 以项目管理员 `project-admin` 登录 KubeSphere，在 「项目设置」 → 「外网访问」 下，点击 「设置网关」。
 
2. 在弹窗中，选择 「LoadBalancer」，填入申请的公网 EIP 的 ID，点击 「保存」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414160253.png)

3. 公网 IP 解析并绑定至当前项目需要 1~2 分钟，确认外网访问一栏可以看到外部 IP，说明公网 EIP 在当前项目内可用。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414160725.png)

### 创建自制应用

1. 进入项目 demo-namespace 后，点击 「应用」，选择 「自制应用」，点击 「部署新应用」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414141845.png)

2. 在弹窗中，选择 「通过服务构建应用」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414142000.png)

3. 参考如下填写基本信息：


- 应用名称：起一个简洁明了的名称，便于用户浏览和搜索，例如 `bookinfo`；
- 应用版本：填写当前应用的版本，此处填写 v1；
- 应用治理：开启应用治理后会在每个组件中以 SideCar 的方式注入 istio-proxy 容器，默认开启即可；
- 描述信息：简单介绍该应用，方便用户进一步了解。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414162147.png)

4. 接下来依次添加 bookinfo 的四个服务组件：**productpage, reviews, details, ratings**，首先添加 productpage 作为服务组件。


- 名称：productpage
- 组件版本：v1
- 容器组模板
   - 点击 「添加容器」
   - 容器名称：productpage
   - 镜像：istio/examples-bookinfo-productpage-v1:1.10.1
- 服务设置
   - 协议：选择 HTTP
   - 名称：port
   - 容器端口：9080
   - 服务端口：9080


完成以上设置后，点击 「保存」，确认应用组件信息无误再点击 「保存」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414162019.png)

5. 参考上一步添加 reviews 作为应用组件，表单信息填写如下：


- 名称：reviews
- 组件版本：v1
- 容器组模板
   - 点击 「添加容器」
   - 容器名称：reviews
   - 镜像：istio/examples-bookinfo-reviews-v1:1.10.1
- 服务设置
   - 协议：选择 HTTP
   - 名称：port
   - 容器端口：9080
   - 服务端口：9080



6. 同上，参考上一步继续添加剩余的 **details**、**ratings** 两个应用组件 (除了名称、容器名称和镜像不相同，组件版本与服务设置的端口号等信息都与上一步相同)。


- 应用组件 details
    - 名称：details
    - 容器名称：details
    - 镜像：istio/examples-bookinfo-details-v1:1.10.1


- 应用组件 ratings
    - 名称：ratings
    - 容器名称：ratings
    - 镜像：istio/examples-bookinfo-ratings-v1:1.10.1


7. 至此，一共添加了 4 个应用组件，下一步点击 「添加路由规则」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414164459.png)

8. 如下添加一条路由规则，服务选择 `productpage`，端口选择 `9080`，点击 「保存」，然后点击 「创建」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414164706.png)

9. 确认应用状态显示 `Ready` 后，说明 bookinfo 微服务创建成功。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414164900.png)

### 添加灰度发布

1. 点击 bookinfo 进入应用详情页，在应用路由下选择 「点击访问」，可以看到 bookinfo 的 details 页面。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414165255.png)

2. 点击 **Normal user** 访问 productpage。注意此时 Book Reviews 部分只显示了 Reviewer1 和 Reviewer2。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414165548.png)

3. 回到 KubeSphere，选择 「灰度发布」，点击 「发布灰度任务」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414165824.png)

4. 在跳转的灰度发布页面，选择 「金丝雀发布」 作为灰度策略，点击 「应用治理」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414165936.png)

5. 在弹窗中，填写发布任务名称为 `bookinfo-carary`，点击 「下一步」。

6. 点击 `reviews` 一栏的 「选择」，点击 「下一步」。

7. 参考如下填写灰度版本信息，完成后点击 「下一步」。


- 灰度版本号：v2；
- 镜像：istio/examples-bookinfo-reviews-v2:1.10.1 (将 v1 改为 v2)。


8. 金丝雀发布允许按流量比例下发与按请求内容下发等两种发布策略，来控制用户对新老版本的请求规则。本示例选择 **按流量比例下发**，流量比例选择 v1 与 v2 各占 50 %，点击 「创建」。

### 验证金丝雀发布

再次访问 Bookinfo 网站，重复刷新浏览器后，可以看到 bookinfo 的 reviews 模块在 v1 和 v2 模块按 50% 概率随机切换。

![bookinfo](/bookinfo-canary.gif)

### 查看流量治理

打开命令行窗口输入以下命令，模拟对 bookinfo 应用每 0.5 秒访问一次。

从流量治理的链路图中，可以看到各个微服务之间的服务调用和依赖、健康状况、性能等情况。

```
watch -n 0.5 "curl http://productpage.demo-namspace.139.198.121.201.nip.io/productpage"
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190415013123.png)

### 查看流量监测

点击 reviews 服务，查看该服务的流量监测，包括每秒请求的流量 (RPS)、成功率、持续时间等指标，这类指标都可以分析该服务的健康状况和请求成功率。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190415013531.png)

### 查看 Tracing

如果在链路图中发现了服务的流量监测异常，还可以在 Tracing 中进一步查看相关的 Header 信息。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190415104734.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190415104806.png)