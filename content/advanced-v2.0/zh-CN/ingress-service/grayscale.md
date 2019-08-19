---
title: "灰度发布"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

灰度发布是指在黑与白之间，能够平滑过渡的一种发布方式。灰度发布是互联网产品在快速迭代的过程中，安全地发布到生产环境的一种方法，包含多种发布策略。目前灰度发布提供了蓝绿部署、金丝雀发布、流量镜像三类灰度发布策略。

## 蓝绿部署

蓝绿发布提供了一种零宕机的部署方式，在保留旧版本的同时部署新版本，将两个版本同时在线，新版本和旧版本是相互热备的，通过切换路由权重 (weight) 的方式（非 0 即 100）实现应用的不同版本上线或者下线，如果有问题可以快速地回滚到老版本。

![蓝绿部署](https://pek3b.qingstor.com/kubesphere-docs/png/20190408172523.png)

<center>(图参考自 https://blog.christianposta.com/deploy/blue-green-deployments-a-b-testing-and-canary-releases)</center>

## 金丝雀发布

在生产环境运行的服务中引一部分实际流量对一个新版本进行测试，测试新版本的性能和表现，然后从这部分的新版本中快速获取用户反馈。

![金丝雀发布](https://pek3b.qingstor.com/kubesphere-docs/png/20190408172716.png)

<center>(图参考自 https://blog.christianposta.com/deploy/blue-green-deployments-a-b-testing-and-canary-releases)</center>

## 流量镜像

流量镜像功能通常用于在生产环境进行测试，是将生产流量镜像拷贝到测试集群或者新的版本中，在引导用户的真实流量之前对新版本进行测试，旨在有效地降低新版本上线的风险。流量镜像可用于以下场景：

- 验证新版本：可以实时对比镜像流量与生产流量的输出结果。
- 测试：生产实例的真实流量可用于集群测试。
- 隔离测试数据库：与数据处理相关的业务，可使用空的数据存储并加载测试数据，针对该数据进行镜像流量操作，实现测试数据的隔离。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190409101655.png)



