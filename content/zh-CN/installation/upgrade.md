---
title: "升级必读"
keywords: 'kubernetes, docker, helm, upgrade, istio, prometheus'
description: '从 2.0.x 或 2.1.x 升级到 KubeSphere 2.1.1'
---

KubeSphere v2.1.1 已发布，该版本修复了已知的 Bug，关于 v2.1.1 版本的更新详情可参考 [Release Note - v2.1.1](../../release/release-v211)。

若您已安装的环境为 2.0.x 或 2.1.0 版本（以下统称老版本），我们强烈建议您下载 2.1.1 版本的 Installer 并升级至 2.1.1，最新的 Installer 支持将 KubeSphere 从老版本一键升级至 2.1.1，无需卸载和重新安装；同时支持升级 Kubernetes 和 etcd 至指定版本，Kubernetes 将默认升级至 `v1.16.7`。


<font color="red">

- 注意！KubeSphere Installer 将同时升级 Kubernetes 版本（默认 v1.16.7）。由于新版本的 Kubernetes 丢弃了很多旧的 apiversion，升级 Kubernetes 后旧的 apiversion 不再支持，不会影响已部署应用，但部署新的业务前，需要修改 yaml 文件适配新的 apiversion。如果之前服务是通过 Helm 部署，在升级时需要删除旧的 release ，用更新过 apiversion 的 Helm Chart 重新部署至 KubeSphere。
- 保险起见，在生产环境使用 Installer 升级之前，请在测试环境先进行升级的模拟测试。在测试环境确保升级成功后，业务应用能够正常运行，再在生产环境升级。
- 注意，升级过程中所有节点将会逐个升级，可能会出现短暂的应用服务中断现象，请您安排合理的升级时间。

</font>


> 说明：本文档仅适用于在 Linux 使用 Installer 安装的环境，若老版本是基于 Kubernetes 部署的环境，请参考 [ks-installer](https://github.com/kubesphere/ks-installer/blob/master/README_zh.md#%E5%8D%87%E7%BA%A7) 进行升级。


## 如何升级

### 第一步：下载最新安装包

下载最新的 `KubeSphere v2.1.1` 安装包至任务执行机，进入安装目录。

```bash
$ curl -L https://kubesphere.io/download/stable/v2.1.1 > installer.tar.gz \
&& tar -zxf installer.tar.gz
```

### 第二步：修改配置文件

由于两种安装模式配置文件的修改方法不同，在升级前需要将老版本中修改过的参数配置同步至 2.1.1 Installer。请根据您老版本所安装的模式，参考以下的一种升级方法进行配置：

- [All-in-One 升级](../upgrade-allinone)
- [Multi-node 升级](../upgrade-multi-node)
