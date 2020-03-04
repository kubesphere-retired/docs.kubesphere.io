---
title: "基于 Local Helm Repo 快速搭建应用仓库部署 Redis"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '基于 Local Helm Repo 快速搭建应用仓库部署 Redis 至 Kubernetes'
---

本文档需使用 cluster-admin 角色的账号演示，说明如何基于本地的 Local Helm Repo 快速搭建一个示例应用仓库，并通过应用模板快速部署 Redis。本示例适合无外网的离线环境快速搭建应用仓库以及测试应用的部署，同理，您可以上传其它应用的 Helm Chart 用于部署至 Kubernetes 中。

## 前提条件

已创建了企业空间管理员账号，已创建了企业空间与项目，参考 [多租户管理快速入门](../../quick-start/admin-quick-start)。

## 本地创建仓库服务

1、在主机上创建存放 chart 的 repo 目录。

```
$ mkdir -p /root/charts
```

2、[点击下载](https://github.com/kubesphere/tutorial/raw/master/tutorial%202%20-%20local%20helm%20repo/redis.tgz) Redis 的 Helm Chart，并拷贝到 Chart 示例目录。

```
$ cp redis.tgz /root/charts/
```

3、启动本地 repo 的仓库服务。

```
$ helm serve --address 0.0.0.0:8870 --repo-path /root/charts &
Regenerating index. This may take a moment.
Now serving you on 0.0.0.0:8870
```

## 导入应用仓库

1、使用企业空间管理员的账号，进入企业空间，进入 `企业空间管理 → 应用仓库`，点击 `创建应用仓库`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025004747.png)

2、在添加应用仓库的窗口，URL 填入本地的应用仓库地址，验证通过后即可创建。

> 注意，导入应用仓库后，其中的应用将被共享给当前企业空间中的所有用户访问和部署。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190918002500.png)

## 从仓库部署应用

1、使用普通用户的账号，进入企业空间下的任意一个项目中，进入 「应用负载」 → 「应用」，点击 **部署新应用 → 来自应用模板**，然后选择上一步添加的 local helm repo，即可看到本地仓库的 Redis 应用。

2、点击进入应用，查看应用详情，点击 「部署应用」。


3、选择已创建的企业空间和项目，点击部署即可完成 Redis 的一键部署。
