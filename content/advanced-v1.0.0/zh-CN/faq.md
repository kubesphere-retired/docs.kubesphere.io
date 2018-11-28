---
title: "常见问题" 
---

1、作为新手，如何快速了解 KubeSphere 的使用？

答：我们提供了多个快速入门的示例包括工作负载和 DevOps 工程，建议从 [快速入门](../../zh-CN/quick-start/quick-start-guide) 入手，参考 **快速入门** 并实践和操作每一个示例。

2、创建 Jenkins 流水线后，运行时报错怎么处理？

![流水线报错](/faq-pipeline-error.png)

答：最快定位问题的方法即查看日志，点击 **查看日志**，具体查看出错的阶段 (stage) 输出的日志。比如，在 **push image** 这个阶段报错了，如下图中查看日志提示可能是 DockerHub 的用户名或密码错误。

![查看日志](/faq-pipeline-log.png)

<!-- 3、如果创建了某个工作负载比如部署，副本数设置为 2  -->