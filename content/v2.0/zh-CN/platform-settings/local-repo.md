---
title: "基于 Local Helm Repo 快速搭建应用仓库部署 Redis"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

本文档需使用 cluster-admin 角色的账号演示，说明如何基于本地的 Local Helm Repo 快速搭建一个示例应用仓库，并通过应用模板快速部署 Redis。本示例适合无外网的离线环境快速搭建应用仓库以及测试应用的部署，同理，您可以上传其它应用的 Helm Chart 用于部署至 Kubernetes 中。

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

4、使用管理员角色的账号登录 KubeSphere，在「平台管理」➡「平台设置」➡「应用仓库」 点击 「添加应用仓库」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190918002403.png)

5、输入仓库名称与地址，若验证无误即可添加成功。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190918002500.png)

6、点击顶部的 「应用模板」 然后选择上一步添加的 local helm repo，即可看到本地仓库的 Redis 应用。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190918002552.png)

7、点击进入应用，查看应用详情，点击 「部署应用」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190918002654.png)

8、选择已创建的企业空间和项目，点击部署即可完成 Redis 的一键部署。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190918002917.png)

9、在选择部署的项目中，即可查看 Redis 应用的部署状态，下图的状态显示应用已经部署成功。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190918003031.png)

10、查看 Redis 下的工作负载与服务，此时即可访问 Redis 的服务。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190918003140.png)