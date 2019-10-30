---
title: "安装内置 Harbor" 
keywords: ''
description: ''
---

KubeSphere Installer 集成了 Harbor 的 Helm Chart (版本为 harbor-18.11.1)，内置的 Harbor 作为可选安装项，用户可以根据团队项目的需求来配置安装，方便用户对项目的镜像管理，仅需安装前在配置文件 `conf/vars.yml` 中简单配置即可，参考以下步骤安装和访问 Harbor。

## 修改安装配置文件

1、安装 KubeSphere 前，在 Installer 中的 `conf/vars.yml` 文件中，参考如下配置修改。
```
# harbor deployment
harbor_enable: true
harbor_domain: harbor.devops.kubesphere.local
```
2、修改后保存，然后执行安装脚本，即可通过 Helm Chart 的方式来安装 Harbor。

## 访问 Harbor

在 KubeSphere 中添加 Harbor 作为镜像仓库，请参考如下步骤，先配置 Docker 访问，然后在 KubeSphere 添加 Harbor 的用户认证信息。

### 配置 Docker 访问

#### 第一步：修改 Docker 配置

修改集群中 **所有节点** 的 Docker 配置，需要在 `/etc/systemd/system/docker.service.d/docker-options.conf` 文件添加字段 `--insecure-registry=harbor.devops.kubesphere.local:30280`，如下所示：

**配置文件修改示例**

```bash
[Service]
Environment="DOCKER_OPTS=  --registry-mirror=https://registry.docker-cn.com --data-root=/var/lib/docker --log-opt max-size=10m --log-opt max-file=3 --insecure-registry=harbor.devops.kubesphere.local:30280"
```

> 注意：Environment 配置应写在一行，不能手动换行。

#### 第二步：修改 hosts 配置

在本地的 `/etc/hosts` 文件中，需要参考如下添加一条记录：

```bash
192.168.0.24 harbor.devops.kubesphere.local
```

> 说明：192.168.0.24 是当前主机的内网 IP，请根据实际情况填写。若需要将 Harbor 服务暴露给集群外部用户使用，则需要在外网配置 DNS 记录（DNS 服务器处或者用户的本地 hosts 文件内），把域名 `harbor.devops.kubesphere.local` 对应到相应的外网 IP，并将 Harbor 端口 30280 进行端口转发和开放防火墙，确保外部流量可以通过该端口。

#### 第三步：重启 Docker 服务

修改后，需要重启 **所有节点** 的 Docker 服务使配置生效，⽐如在 Linux 系统中需执行以下命令：

```bash
$ sudo systemctl daemon-reload
```

```bash
$ sudo systemctl restart docker
```
#### 第四步：登录 Harbor

执行以下命令登录 Harbor 镜像仓库。关于如何制作镜像、打包上传镜像以及 Dockerfile 的使用，请参考 [Docker 官方文档](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)。

```dockerfile
$ docker login -u admin -p Harbor12345 http://harbor.devops.kubesphere.local:30280

WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

### KubeSphere 添加 Harbor 

当后台配置 Docker 访问 Harbor 成功后，即可登录 KubeSphere，在已创建的企业空间的项目下，左侧菜单栏选择 **配置中心 → 密钥**，点击 **创建**。

#### 第一步：填写基本信息

填写密钥的基本信息，完成后点击 **下一步**。

- 名称：起一个简洁明了的名称，填写 `harbor`
- 别名：支持中文，帮助您更好的区分资源，比如 `内置 Harbor 镜像仓库`
- 描述信息：简单介绍该密钥的功能

![基本信息](/harbor-secret-basic.png)

#### 第二步：填写 Harbor 仓库信息

2.1. 在类型中选择镜像仓库密钥，参考如下提示填写 Harbor 仓库的登录信息。

- 仓库地址：填写内置的 Harbor 镜像仓库域名和节点端口 `http://harbor.devops.kubesphere.local:30280`
- 用户名：admin
- 密码：Harbor12345
- 邮箱：填写个人邮箱

![](/harbor-docker-login.png)

2.2. 点击 **创建**，如果 Harbor 安装配置都正确，并且验证信息都填写无误，即可添加成功。Harbor 镜像仓库添加完成后，可以上传镜像和拉取镜像。

![](/harbor-secret-list.png)

### 浏览器访问

KubeSphere 和 Harbor 都安装成功后，若需要在集群外部访问 Harbor，请在本地的 `/etc/hosts` 文件中参考如下示例添加一行记录，然后才可以在浏览器访问 Harbor 镜像仓库。

```bash
139.198.10.10 harbor.devops.kubesphere.local
```

> 注意：`139.198.10.10` 是 KubeSphere 集群的公网 IP，请根据实际情况填写。在外网访问 Harbor，需要绑定公网 IP 并配置端口转发，若公网 IP 有防火墙，请在防火墙添加规则放行对应的端口 30280，保证外网流量可以通过该端口，外部才能够访问。

Harbor 服务对外暴露的节点端口 (NodePort) 为 30280，内置的 Harbor 镜像仓库目前仅支持 http 协议，在浏览器中可以通过 `{$域名}:{$NodePort}` 如 `http://harbor.devops.kubesphere.local:30280` 访问 Harbor 登录页面。默认的管理员用户名和密码为 `admin / Harbor12345`，其它用户与 KubeSphere 的用户账户体系一致。关于 Harbor 的使用详见 [Harbor 官方文档](https://goharbor.io/docs/)。



![浏览器访问](https://pek3b.qingstor.com/kubesphere-docs/png/20190322111038.png)

### 使用 Harbor 镜像仓库

若需要在 KubeSphere 中使用 Harbor 镜像仓库中的镜像，需要先将相关的镜像构建后上传至 Harbor。关于 Harbor 的使用详见 [Harbor 官方文档](https://goharbor.io/docs/)。

以创建 Deployment 为例展示如何使用镜像仓库来拉取仓库中的镜像。比如 Harbor 镜像仓库中已有 `mysql:5.6` 的 docker 镜像，在容器组模板中需要先选择镜像仓库，然后将镜像填写为 `http://harbor.devops.kubesphere.local:30280/mysql:5.6`，对应的格式为 `镜像仓库地址 / 镜像名称:tag`，填写后创建完成即可使用该 Harbor 镜像仓库中的镜像。

![使用 Harbor 镜像仓库](/apply-harbor.png)
