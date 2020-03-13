---
title: "Bookinfo 微服务的灰度发布示例"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

灰度发布，是指在黑与白之间，能够平滑过渡的一种发布方式。通俗来说，即让产品的迭代能够按照不同的灰度策略对新版本进行线上环境的测试，灰度发布可以保证整体系统的稳定，在初始灰度的时候就可以对新版本进行测试、发现和调整问题，以保证其影响度。KubeSphere 基于 [Istio](https://istio.io/) 提供了蓝绿部署、金丝雀发布、流量镜像等三种灰度策略，无需修改应用的服务代码，即可实现灰度、流量治理、Tracing、流量监控、调用链等服务治理功能，关于每一种策略的描述参见 [灰度发布](../../ingress-service/grayscale)。

## 目的

本示例在 KubeSphere 中使用 Istio 官方提供的 [Bookinfo](https://istio.io/docs/examples/bookinfo/) 示例，创建一个微服务应用并对其中的服务组件进行灰度发布，演示 KubeSphere 服务治理的能力。

## Bookinfo 微服务应用架构

Bookinfo 应用分为四个单独的微服务：


- productpage ：productpage 微服务会调用 details 和 reviews 两个微服务，用来生成页面。
- details ：这个微服务包含了书籍的信息。
- reviews ：这个微服务包含了书籍相关的评论，它还会调用 ratings 微服务。
- ratings ：ratings 微服务中包含了由书籍评价组成的评级信息。


reviews 微服务有 3 个版本：


- v1 版本不会调用 ratings 服务，因此在界面不会显示星形图标。
- v2 版本会调用 ratings 服务，并使用 1 到 5 个黑色星形图标来显示评分信息。
- v3 版本会调用 ratings 服务，并使用 1 到 5 个红色星形图标来显示评分信息。


下图展示了这个应用的端到端架构。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414172945.png)
<center>(Bookinfo 架构图与示例说明参考自 https://istio.io/docs/examples/bookinfo/)</center>

## 视频教程

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/KS2.1_8-bookinfo-grayscale-release-on-istio.mp4">
</video>

## 预估时间

约 20 ~ 30 分钟。

## 前提条件

- 开启了 Service Mesh 的安装，参考 [开启微服务治理（Service Mesh）](../../installation/install-service)；
- 已创建了企业空间、项目和普通用户 `project-regular` 账号，且已邀请 `project-regular` 加入项目并授予 `operator` 角色，请参考 [多租户管理快速入门](../admin-quick-start)；
- 使用管理员账号 `admin` 在示例项目 `demo-project` 下选择 「项目设置」→「高级设置」→「设置网关」，点击「应用治理」的开启按钮。


## 操作示例

### 创建自制应用

1. 使用项目普通用户 `project-regular` 账号进入项目 demo-project 后，选择 `应用负载` → `应用`，点击 「部署示例应用」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191108093544.png)

2. 在弹窗中，点击 「确定」 部署 bookinfo 示例应用。


3. 确认应用工作负载的所有部署状态显示 `运行中`，则说明 bookinfo 微服务创建成功（约 2 分钟）。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191108100459.png)

### 访问 Bookinfo 应用

1. 点击 bookinfo 进入应用详情页，可以看到应用路由下自动生成的 hostname。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190417083314.png)

2. 由于外网访问启用的是 NodePort 的方式，NodePort 会在主机上开放 http 端口，要访问 bookinfo 应用需要将该端口进行转发并在防火墙添加下行规则，确保流量能够通过该端口。

例如在 QingCloud 云平台进行上述操作，假设外网访问开启的主机端口 NodePort 为 31680 (http)，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。



3. 在本地打开 `/etc/hosts` 文件，为 hostname 添加一条记录，例如：

```shell
#{公网 IP} {hostname}
139.198.111.111 productpage.demo-project.192.168.0.8.nip.io
```

4. 完成上述步骤后，在应用路由下选择 「点击访问」，可以看到 bookinfo 的 details 页面。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190417102555.png)

5. 点击 **Normal user** 访问 productpage。注意此时 Book Reviews 部分只显示了 Reviewer1 和 Reviewer2。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414165548.png)

### 添加灰度发布

1. 回到 KubeSphere，选择 「灰度发布」，点击 「发布灰度任务」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190414165824.png)

2. 在跳转的灰度发布页面，选择 「金丝雀发布」 作为灰度策略，点击 「发布任务」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190512153647.png)

3. 在弹窗中，填写发布任务名称为 `bookinfo-carary`，点击 「下一步」。

4. 点击 `reviews` 一栏的 「选择」，即选择对应用组件 `reviews` 进行灰度发布，点击 「下一步」。

5. 参考如下填写灰度版本信息，完成后点击 「下一步」。


- 灰度版本号：v2；
- 镜像：istio/examples-bookinfo-reviews-v2:1.10.1 (将 v1 改为 v2)。


6. 金丝雀发布允许按流量比例下发与按请求内容下发等两种发布策略，来控制用户对新老版本的请求规则。本示例选择 **按流量比例下发**，流量比例选择 v1 与 v2 各占 **50 %**，点击 「创建」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190417083105.png)

### 验证金丝雀发布

再次访问 Bookinfo 网站，重复刷新浏览器后，可以看到 bookinfo 的 reviews 模块在 v1 和 v2 模块按 50% 概率随机切换。

![bookinfo](/bookinfo-canary.gif)

### 查看流量拓扑图

打开命令行窗口输入以下命令，引入真实的访问流量，模拟对 bookinfo 应用每 0.5 秒访问一次。注意以下命令是模拟 `Normal user` 访问，需要输入完整的命令访问到具体的服务在链路图中才有流量数据。

```shell
$ watch -n 0.5 "curl http://productpage.demo-project.139.198.111.111.nip.io:31680/productpage?u=normal"
```

从流量治理的链路图中，可以看到各个微服务之间的服务调用和依赖、健康状况、性能等情况。

> 提示：点击其中一个应用组件，还可以为该服务组件设置流量治理策略，如连接池管理、熔断器等，详见 [流量治理](../../application/traffic-gov)。


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718170342.png)

### 查看流量监测

点击 reviews 服务，查看该服务的实时流量监测，包括每秒请求的流量 (RPS)、成功率、持续时间等指标，这类指标都可以分析该服务的健康状况和请求成功率。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718170442.png)

### 查看 Tracing

如果在链路图中发现了服务的流量监测异常，还可以在 Tracing 中追踪一个端到端调用经过了哪些服务，以及各个服务花费的时间等详细信息，支持进一步查看相关的 Header 信息，每个调用链由多个 Span 组成。

界面上可以清晰的看到某个请求的所有阶段和内部调用，以及每个阶段所耗费的时间。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190415104734.png)

展开某个阶段，还能下钻看到这个阶段是在哪台机器（或容器）上执行的。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190415104806.png)

### 接管全部流量

当新版本 v2 灰度发布后，发布者可以对线上的新版本进行测试和收集用户反馈。如果测试后确定新版本没有问题，希望将流量完全切换到新版本，则进入灰度发布页面进行流量接管。

1. 点击 「灰度发布」，进入 bookinfo 的灰度发布详情页，点击 **···** 选择 「接管所有流量」，正常情况下所有流量将会指向 v2。

> 提示：此时 v1 也将保持在线，若 v2 上线后发现问题，允许发布者随时将新版本 v2 的流量切回 v1。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190417132015.png)

2. 再次打开 bookinfo 页面，多次刷新后 reviews 模块也仅仅只显示 v2 版本。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190417134504.png)

### 下线旧版本

当新版本 v2 上线接管所有流量后，并且测试和线上用户反馈都确认无误，即可下线旧版本，释放资源 v1 的资源。下线应用组件的特定版本，会同时将关联的工作负载和 istio 相关配置资源等全部删除。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190418125851.png)

至此，Bookinfo 微服务以金丝雀发布作为发布策略，演示了灰度发布的基本功能。
