---
title: "控制台使用常见问题"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
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

4、每个节点默认的最大 Pod 上限数目为 110，若要调整每个节点的 Pod 上限数目要怎么配置？

答：

如果还没安装，安装前在 installer 可以修改 common.yaml 配置文件中的 `kubelet_max_pods`。

KubeSphere 安装后，可以在后台手工修改 master 节点 `/etc/kubernetes/kubelet.env` 中的 `max-pods` 参数，然后执行`systemctl restart kubelet` 重启 kubelet 服务。

5、我在后台通过 kubectl 创建的 namespace 以及该 namespace 下的资源，要如何添加到企业空间 (workspace) 下呢？

答：可以对新建的 namespace 打 label，指定其加入至哪一个企业空间 (workspace) 下。如下，将 echo-production 加入企业空间 demo-workspace 中。

```bash
kubectl label namespace echo-production kubesphere.io/workspace=demo-workspace
namespace/echo-production labeled
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190824184009.png)

6、admin 账号的密码忘记了，如何重置？

答： 如果还有可以登录的管理员账号的话，可以到 **平台管理->账号管理->用户列表->单个用户详情页->更多操作->修改密码**，这样去重置 admin 的密码。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190824184231.png)

如果没有其它管理员账号，则需要进入到 `ks-account` 的 pod 里去执行：

```bash
apk add curl && curl -X PUT http://localhost:9090/kapis/iam.kubesphere.io/v1alpha2/users/admin -H 'Content-Type: application/json' -d '{"username": "admin","email":"admin@kubesphere.io","cluster_role": "cluster-admin","password":"xxxxxx"}'
```


> 说明：
> 若您在使用中遇到任何产品相关的问题，欢迎在 [GitHub Issue](https://github.com/kubesphere/docs.kubesphere.io/issues) 提问。

