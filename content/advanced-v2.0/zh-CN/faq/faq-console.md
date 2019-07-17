---
title: "控制台使用常见问题" 
keywords: ''
description: ''
---

### 如何快速了解 KubeSphere

1、作为新手，如何快速了解 KubeSphere 的使用？

答：我们提供了多个快速入门的示例包括工作负载和 DevOps 工程，建议从 [快速入门](../../quick-start/quick-start-guide) 入手，参考 **快速入门** 并实践和操作每一个示例。


### 如何查看 kubeconfig 文件

2、如何查看当前集群的 Kubeconfig 文件？

答：用户可以点击 “小锤子” 工具箱的图标，选择「kubeconfig」即可查看，仅管理员用户有权限查看。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190506151204.png)

### CPU 用量异常问题

3、为何安装后 CPU 用量数值异常大？

![CPU 用量数值异常大](https://pek3b.qingstor.com/kubesphere-docs/png/20190425174519.png)

答：Kubesphere 计算 CPU 用量的方法是求 user 、 nice 、 system 、 iowait 、 irq 、 softirq 以及 steal 七种 CPU 模式下的用量合，数据通过 node_exporter 采集。由于 Linux 内核 4.x 存在 steal 数值异常大的 bug，导致了如上图的异常值。建议尝试重启节点主机，或升级内核版本。

更多信息请参考 [node_exporter issue #742](https://github.com/prometheus/node_exporter/issues/742)

<!-- ### 如何修改配置使 KubeSphere 允许同一账号多人登录？

1、在控制台中，进入企业空间 system-workspace → 项目 → kubesphere-system，然后在 「配置中心」→「配置」选择 ks-console-ae-config，点击 「编辑配置文件」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190601102158.png)

2、然后将 disableMultiLogin: True 的值修改为 False，并通过 kubectl 命令将 ks-console 应用更新。

```shell
$ kubectl scale --replicas=0 deployment/ks-console -n kubesphere-system

$ kubectl scale --replicas=0 deployment/ks-console -n kubesphere-system
``` -->


> 说明：
> 若您在使用中遇到任何产品相关的问题，欢迎在 [GitHub Issue](https://github.com/kubesphere/docs.kubesphere.io/issues) 提问。
 