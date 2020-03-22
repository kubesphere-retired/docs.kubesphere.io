---
title: "在 Kubernetes 安装 KubeSphere"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '将 KubeSphere 部署在 Kubernetes 之上'
---

KubeSphere 支持在已有 Kubernetes 集群之上在线安装 [KubeSphere](https://github.com/kubesphere/kubesphere)。在安装之前，请确认您的环境满足 [前提条件](../prerequisites)。若待安装的环境满足前提条件，则可以开始部署 KubeSphere。

> 说明：本文档仅说明在线安装，若您的环境无外网，请参考 [在 Kubernetes 离线安装 KubeSphere](/en/installation/install-on-k8s-airgapped/)。


## 视频教程

**视频教程以 QingCloud 云平台为例，先安装 Kubernetes 集群和 StorageClass，来准备安装示例的前提条件（即 K8s 集群），然后再在 K8s 集群一键安装 KubeSphere，与其它云平台安装步骤类似，具体以其官方文档为准。**

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/KSInstall_200P004C202002_install-kubesphere-on-k8s.mp4">
</video>

## 安装 KubeSphere

根据集群资源情况，使用 kubectl 安装 KubeSphere。

### 最小化安装 KubeSphere

若集群可用 CPU > 1 Core 且可用内存 > 2 G，可以使用以下命令最小化安装 KubeSphere：

```yaml
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```
### 完整安装 KubeSphere

若集群可用 CPU > 8 Core 且可用内存 > 16 G，可以使用以下命令完整安装 KubeSphere。

> 注意，应确保集群中有一个节点的可用内存大于 8 G。

```yaml
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-complete-setup.yaml
```

> 提示：若您的服务器提示无法访问 GitHub，可将 [kubesphere-minimal.yaml](https://github.com/kubesphere/ks-installer/blob/master/kubesphere-minimal.yaml) 或 [kubesphere-complete-setup.yaml](https://github.com/kubesphere/ks-installer/blob/master/kubesphere-complete-setup.yaml) 文件保存到本地作为本地的静态文件，再参考上述命令进行安装。

## 验证与访问

1. 查看滚动刷新的安装日志，请耐心等待安装成功。

```bash
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

> 说明：安装过程中若遇到问题，也可以通过以上日志命令来排查问题。

2. 通过 `kubectl get pod --all-namespaces` 查看 KubeSphere 相关 namespace 下所有 Pod 状态是否为 Running。确认 Pod 都正常运行后，可使用 `IP:30880` 访问 KubeSphere UI 界面，默认的集群管理员账号为 `admin/P@88w0rd`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191020153911.png)

## 开启可选功能组件的安装

若您开启了最小化安装，可参考 [KubeSphere 可插拔功能组件概览](../pluggable-components)，确保您的机器可用资源满足其最低要求，然后再开启可选功能组件的安装。

## 如何重启安装

若安装过程中遇到问题，当您解决问题后，可以通过重启 ks-installer 的 Pod 来重启安装任务，将 ks-installer 的 Pod 删除即可让其自动重启：

```
$ kubectl delete pod ks-installer-xxxxxx-xxxxx -n kubesphere-system
```

## 开启 etcd 监控

完整安装成功后，KubeSphere 还支持在控制台开启 etcd 的监控面板，请参考 [ks-installer GitHub](https://github.com/kubesphere/ks-installer/tree/master) 创建 etcd 所需要的。

## Installer 代码

Installer 代码开源地址请参考 [ks-installer GitHub](https://github.com/kubesphere/ks-installer/tree/master)。

## 帮助与支持

若遇到其它的安装问题需要协助支持，请在 [社区论坛](https://kubesphere.com.cn/forum/) 搜索解决方法或发布帖子，我们会尽快跟踪解决。
