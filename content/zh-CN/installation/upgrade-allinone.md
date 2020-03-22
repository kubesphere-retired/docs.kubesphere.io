---
title: "All-in-One 升级"
keywords: 'kubernetes, docker, kubesphere, upgrade'
description: '单节点升级 KubeSphere 2.1.1'
---

## 前提条件

请确保已参考 [升级](../upgrade) 成功下载并解压了 2.1.1 的 Installer。

## 视频解说

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/KSInstall_200P005C202003_upgrade-all-in-one.mp4">
</video>

## 第一步：修改配置文件

升级将默认读取 2.1.1 的 `conf` 目录下的配置文件。因此，在升级前您需要将原有安装包中 `conf` 目录下的配置文件中修改过的参数，都同步到 2.1.1 版本安装包的对应文件中，修改配置文件分以下两种情况。

### 从 2.0.x 升级

<font color=red>提示：升级所需的时间跟网络情况和带宽、机器配置、安装节点个数等因素有关，可在升级前 [配置镜像加速器](https://kubesphere.com.cn/forum/d/149-kubesphere-v2-1-0) 或通过调高带宽的方式来加快安装速度。</font>

1. 注意，升级前仅需要确认老版本集群的参数配置是否修改，对应文件是 KubeSphere 2.0.x 的 `conf/vars.yaml`，若老版本有修改参数，则需要在 2.1.1 的 `conf` 目录下同步所有修改的参数。特别要注意的是，存储类型应与老版本集群的存储类型保持一致。

> 提示：在 2.0.x 中，conf 目录下的集群参数配置文件名称是 `vars.yaml`，在 2.1.x 该文件名修改成了 `common.yaml`，并将云厂商相关的配置参数从中分开，作为单独的配置文件；

2. 在 KubeSphere 2.1.x 对各个功能组件进行了解耦和可插拔的设计，支持 KubeSphere 各功能组件的可选安装，`common.yaml` 仅开启了最小化安装，升级前需要在 2.0.x 的 `common.yaml` 中将所有功能组件设置为 true，再执行升级。

<font color="red">请注意，若您在 2.1.0 通过编辑 ConfigMap 开启过部分功能组件，那么在升级前，需要在 `common.yaml` 中将 2.1.0 开启的功能组件进行同步，即：将对应的 Enable 项设置为 true。升级脚本将读取 `common.yaml` 进行升级。</font>


### 从 2.1.0 升级

1. 同上，请将 2.1.0 中的 `conf` 目录下修改的参数配置同步到 2.1.1 中，并且存储类型应与老版本集群的存储类型保持一致。

2. 将 2.1.0 的 `common.yaml` 开启了的可插拔功能组件，同步到 2.1.1 中。

## 第二步：开始升级

完成上述配置后，参考如下步骤进行升级：

1. 进入 scripts 目录，执行升级脚本，建议使用 **root** 用户：

```bash
$ ./upgrade.sh
```

2. 确认提示信息无误后，输入 `yes` 开始升级。请耐心等待，升级完成后，可以在界面上看到 "successful" 字样；同时可以通过界面给出的命令查看 ks-installer 日志，以确认升级结果：

```bash
# kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath={.items[0].metadata.name}) -f
```

最后，使用原有访问地址和账户登陆 KubeSphere，点击右上角的「关于」查看版本是否更新成功。

若升级遇到问题需要支持，请在 [社区论坛](https://kubesphere.com.cn/forum/) 搜索或发布帖子，社区会尽快跟踪解决。
