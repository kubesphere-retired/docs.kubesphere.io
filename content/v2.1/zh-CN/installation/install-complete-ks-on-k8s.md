---
title: "在 Kubernetes 完整安装 KubeSphere"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '将 KubeSphere 部署在 Kubernetes 之上'
---

为方便您在 Kubernetes 快速地完整安装 KubeSphere，即 **默认开启 KubeSphere 所有功能组件**，本篇文档将引导您通过一条命令进行完整安装。在安装之前，请确认您的环境满足以下 [前提条件](../prerequisites)：


> - `Kubernetes` 版本： `1.15.x ≤ K8s version ≤ 1.17.x`；
> - `Helm`版本： `2.10.0 ≤ Helm Version ＜ 3.0.0`（不支持 helm 2.16.0 [#6894](https://github.com/helm/helm/issues/6894)），且已安装了 Tiller，参考 [如何安装与配置 Helm](https://devopscube.com/install-configure-helm-kubernetes/) （预计 3.0 支持 Helm v3）；
> - 集群的可用 CPU 不小于 8 Cores，可用内存不小于 16 G；
> - 集群已有默认的存储类型（StorageClass）；若还没有准备存储请参考 [安装 OpenEBS 创建 LocalPV 存储类型](../../appendix/install-openebs) 用作开发测试环境；
> - 集群能够访问外网。

可参考 [前提条件](../prerequisites) 验证，若待安装的环境满足以上条件则可以开始部署 KubeSphere。

## 完整安装 KubeSphere

1. 完整安装 KubeSphere 仅需要一条命令，即可安装在 Kubernetes 之上。

```yaml
$ kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-complete-setup.yaml
```

> 提示：若您的服务器提示无法访问 GitHub，可将 [kubesphere-complete-setup.yaml](https://github.com/kubesphere/ks-installer/blob/master/kubesphere-complete-setup.yaml) 文件复制并保存到本地作为本地的静态文件，再参考上述命令进行安装。

2. 查看滚动刷新的安装日志，请耐心等待安装成功。

```bash
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

> 提示：若安装过程中出现问题，也可以通过上述命令查看 ks-installer 的 Pod 日志进行排查。

3. 通过 `kubectl get pod --all-namespaces` 查看 KubeSphere 相关 namespace 下所有 Pod 状态是否为 Running。确认 Pod 都正常运行后，可使用 `IP:30880` 访问 KubeSphere UI 界面，默认的集群管理员账号为 `admin/P@88w0rd`。


## 如何重启安装

若安装过程中遇到问题，当您解决问题后，可以通过重启 ks-installer 的 Pod 来重启安装任务，将 ks-installer 的 Pod 删除即可让其自动重启：

```
$ kubectl delete pod ks-installer-xxxxxx-xxxxx -n kubesphere-system
```

## 开启 etcd 监控

完整安装成功后，KubeSphere 还支持在控制台开启 etcd 的监控面板，请参考 [ks-installer GitHub](https://github.com/kubesphere/ks-installer/tree/master) 创建 etcd 所需要的。

若遇到其它的安装问题需要协助支持，请在 [社区论坛](https://kubesphere.com.cn/forum/) 搜索解决方法或发布帖子，我们会尽快跟踪解决。
