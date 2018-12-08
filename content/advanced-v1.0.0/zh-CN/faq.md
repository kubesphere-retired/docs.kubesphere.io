---
title: "常见问题" 
---

1、作为新手，如何快速了解 KubeSphere 的使用？

答：我们提供了多个快速入门的示例包括工作负载和 DevOps 工程，建议从 [快速入门](../../zh-CN/quick-start/quick-start-guide) 入手，参考 **快速入门** 并实践和操作每一个示例。

2、安装过程中，如果遇到安装失败并且发现错误日志中有这类信息： `The following packages have pending transactions` ，这种情况应该如何处理？

![安装问题](/faq-installation-1.png)

答：这是因为有些 transactions 操作没有完成，可以连接到安装失败的节点上，依次执行下列命令，并重新执行 `install.sh` 脚本：

```shell
$ yum install yum-utils -y
$ yum-complete-transaction
$ yum-complete-transaction --cleanup-only
```

3、创建 Jenkins 流水线后，运行时报错怎么处理？

![流水线报错](/faq-pipeline-error.png)

答：最快定位问题的方法即查看日志，点击 **查看日志**，具体查看出错的阶段 (stage) 输出的日志。比如，在 **push image** 这个阶段报错了，如下图中查看日志提示可能是 DockerHub 的用户名或密码错误。

![查看日志](/faq-pipeline-log.png)


> 说明：
> 若您在使用中遇到任何产品相关的问题，欢迎在 [GitHub Issue](https://github.com/kubesphere/docs.kubesphere.io/issues) 提问。