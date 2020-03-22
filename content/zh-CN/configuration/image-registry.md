---
title: "镜像仓库"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

Docker 镜像是一个只读的模板，可用于部署容器服务，每个镜像有特定的唯一标识 (镜像的 Registry 地址 + 镜像名称+镜像 Tag)。例如：一个镜像可以包含一个完整的 Ubuntu 操作系统环境，里面仅安装了 Apache 或用户需要的其它应用程序。而镜像仓库是集中存放镜像文件的场所，镜像仓库用于存放 Docker 镜像。

## 前提条件

添加镜像仓库需要预先创建企业空间和项目，若还未创建请参考 [管理员快速入门](../../quick-start/admin-quick-start)。

## 添加镜像仓库

登录 KubeSphere 管理控制台，在已创建的项目中，左侧菜单栏中选择 **配置中心 → 密钥**，点击 **创建**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514094405.png)


### 添加 QingCloud 镜像仓库

QingCloud Docker Hub 基于 Docker 官方开源的 Docker Distribution 为用户提供 Docker 镜像集中存储和分发服务，请参考 [QingCloud 容器镜像仓库](https://docs.qingcloud.com/product/container/docker_hub.html) 预先创建。若还未创建 QingCloud 镜像仓库，可以先参考文档添加一个示例仓库。

1、填写镜像仓库的基本信息

- 名称：为镜像仓库起一个简洁明了的名称，便于浏览和搜索。
- 别名：帮助您更好的区分资源，并支持中文名称。
- 描述信息：简单介绍镜像仓库的主要特性，让用户进一步了解该镜像仓库。

![创建 QingCloud 仓库](/ae-image-registry-basic.png)

2、密钥设置中，类型选择 `镜像仓库密钥`，填写镜像仓库的登录信息。

- 仓库地址：用 QingCloud 镜像仓库地址 `dockerhub.qingcloud.com` 作为示例
- 用户名/密码：填写 guest / guest
- 邮箱：填写个人邮箱

![密钥设置](/dockerhub-advanced-setting.png)

3、点击 **创建**，即可查看创建结果。

![密钥列表](/dockerhub-created-successfully.png)


### 添加 Docker Hub 镜像仓库

如果需要添加 [Dokcer Hub](https://hub.docker.com/) 中的镜像仓库，请先确保已在 Docker Hub 注册过账号。添加步骤同上，仓库地址填写 `docker.io`，输入个人的 DockerHub 用户名和密码即可。

![Docker Hub 镜像仓库](/add-dockerhub.png)


### 添加 Harbor 镜像仓库

**Harbor 简介**

[Harbor](http://vmware.github.io/harbor/) 是一个用于存储和分发 Docker 镜像的企业级 Registry 服务器，通过添加一些企业必需的功能特性，例如安全、标识和管理等，扩展了开源 Docker Distribution，作为一个企业级私有 Registry 服务器，Harbor 提供了更好的性能和安全。注意，添加之前请确保已创建了 Harbor 镜像仓库服务端，以下详细介绍如何在 KubeSphere 中添加 Harbor 镜像仓库。

#### 添加内置 Harbor 镜像仓库

KubeSphere Installer 集成了 **Harbor** 的 Helm Chart，内置的 **Harbor** 作为可选安装项，用户可以根据团队项目的需求来配置安装，仅需安装前在配置文件 `conf/common.yaml` 中简单配置即可，关于如何安装和使用内置的 Harbor 镜像仓库详见 [安装内置 Harbor](../../installation/harbor-installation)。

#### 对接外部 Harbor 镜像仓库

根据 Harbor 镜像仓库的地址类型，需要分 http 和 https 两种认证方法：

#### http

1. 首先，需要修改集群中所有节点的 docker 配置。以 `http://192.168.0.99` 为例 (用户操作时镜像仓库的地址应替换为您实际创建的仓库地址)，在 `/etc/systemd/system/docker.service.d/docker-options.conf` 文件添加字段`--insecure-registry=192.168.0.99`：

 示例：

```bash
[Service]
Environment="DOCKER_OPTS=--registry-mirror=https://registry.docker-cn.com --insecure-registry=10.233.0.0/18 --graph=/var/lib/docker --log-opt max-size=50m --log-opt max-file=5 \
--insecure-registry=192.168.0.99"
```

2. 添加完成以后，需要重载修改过的配置文件并重启 docker:

```bash
$ sudo systemctl daemon-reload
```

```bash
$ sudo systemctl restart docker
```

3. 配置 `/etc/hosts`，将 IP 与 Harbor 域名进行映射。

```
192.168.0.99 harbor.devops.kubesphere.local
```

4. 然后通过 KubeSphere 控制台，填写镜像仓库所需要的信息如仓库地址和用户认证，创建 Harbor 镜像仓库。

![Harbor 镜像仓库](https://pek3b.qingstor.com/kubesphere-docs/png/20200219141059.png)

#### https

1. 对于 https 协议的镜像仓库，首先需要获取镜像仓库的证书，记为 `ca.crt`，以 `https://harbor.openpitrix.io` 这个镜像仓库的地址为例，对集群中的所有节点都需要执行以下操作:

```bash
$ sudo cp ca.crt /etc/docker/certs.d/harbor.openpitrix.io/ca.crt
```

- 如果还是报权限错误，针对不同的操作系统，需要执行以下操作:

**UBUNTU**

```bash
$ sudo cp ca.crt /usr/local/share/ca-certificates/harbor.openpitrix.io.ca.crt
```
```bash
$ sudo update-ca-certificates
```
**RED HAT ENTERPRISE LINUX**

```bash
$ sudo cp ca.crt /etc/pki/ca-trust/source/anchors/harbor.openpitrix.io.ca.crt
```
```bash
$ sudo update-ca-trust
```

2. 添加完成以后，需要重载修改过的配置文件并重启 docker (详情可参照 [docker官网](https://docs.docker.com/registry/insecure/#troubleshoot-insecure-registry)):

```bash
$ sudo systemctl systemctl daemon-reload
```

```bash
$ sudo systemctl restart docker
```

3. 然后通过 KubeSphere 控制台，填写镜像仓库所需要的信息如仓库地址和用户认证，参考添加 Docker Hub 的步骤，创建 Harbor 镜像仓库。

## 使用镜像仓库

以创建 Deployment 为例展示如何使用镜像仓库来拉取仓库中的镜像。比如 QingCloud 镜像仓库中有 `mysql:5.6` 的 docker 镜像。创建 Deployment 时，在容器组模板中需要选择镜像仓库，镜像地址填写为 `dockerhub.qingcloud.com/mysql:5.6`，镜像地址的格式为 `镜像仓库地址 / 镜像名称:tag`，填写后创建完成即可使用该镜像仓库中的镜像。

![创建部署](/ae-docker-hub-setting.png)
