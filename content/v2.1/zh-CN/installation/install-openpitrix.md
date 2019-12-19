---
title: "KubeSphere 应用商店"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '应用商店'
---

## 什么是应用商店

[KubeSphere](https://github.com/kubesphere/kubesphere) 是一个开源的以应用为中心的容器平台，基于自研开源的 [OpenPitrix](https://openpitrix.io) 构建了应用商店与应用的生命周期管理，并且在 v2.1.0 中提供了 `3` 种应用的快速部署方式：


> - [通过企业空间下的应用仓库与应用模板](../../quick-start/one-click-deploy)，方便快速上传 Helm 应用包或导入第三方 Helm 应用仓库，一键部署应用至 Kubernetes；
> - [平台全局的应用商店](../../quick-start/app-store) 提供从应用提交到应用上架和升级这样完整的应用生命周期管理功能，应用商店也内置了 10 个示例应用。

<font color=red>注意，应用商店内置的 10 个应用不建议用在生产环境，仅建议用于开发测试环境方便快速测试。</font>。



KubeSphere 应用商店对内可作为团队间共享企业内部的中间件、大数据、业务应用等，以应用模板的形式方便用户快速地一键部署常用的基于 [Helm Chart](https://docs.helm.sh/using_helm) 构建的应用到 Kubernetes 中；对外可作为根据行业特性构建行业交付标准、交付流程和交付路径的基础，作为行业通用的应用商店，可根据不同需求应对不同的业务场景。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025011318.png)

## 安装前如何开启安装应用商店（适用于 Linux Installer 安装）

> 注意，本篇文档仅适用于 Linux Installer 安装的环境，若 KubeSphere 部署在 Kubernetes 之上，需提前创建 CA 证书，请参考 [ks-installer](https://github.com/kubesphere/ks-installer)。

安装前，在 installer 目录下编辑 `conf/common.yaml` 文件，然后参考如下开启。开启后请继续参考安装指南执行后续的安装步骤。

```yaml
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
openpitrix_enabled: true
```

## 安装后如何开启安装应用商店（适用于 Linux Installer 安装）

通过修改 ks-installer 的 configmap 可以选装组件，执行以下命令。

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

**参考如下修改 ConfigMap**


```yaml
openpitrix:
      enabled: True
```

保存退出，参考 [验证可插拔功能组件的安装](../verify-components) ，通过查询 ks-installer 日志或 Pod 状态验证功能组件是否安装成功。

## 应用商店安装常见问题

参考 [openpitrix(AppStore) FAQ](https://kubesphere.com.cn/forum/d/471-openpitrix-appstore-faq-and-answer)。
