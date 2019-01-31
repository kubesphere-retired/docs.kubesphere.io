---
title: "安装内置 Harbor" 
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

### 浏览器访问

KubeSphere 安装成功后，即可在浏览器访问 Harbor 镜像仓库。Harbor 服务对外暴露的节点端口 (NodePort) 为 30280，内置的 Harbor 镜像仓库目前仅支持 http 协议，在浏览器中可以通过 `{$公网 IP}:{$NodePort}` 如 `http://139.198.16.160:30280` 访问 Harbor 登录页面。默认的管理员用户名和密码为 `admin / Harbor12345`，其它用户与 KubeSphere 的用户账户体系一致。关于 Harbor 的使用详见 [Harbor 官方文档](https://goharbor.io/docs/)。

> 注意：若需要在外网访问，可能需要绑定公网 EIP 并配置端口转发，若公网 EIP 有防火墙，请在防火墙添加规则放行对应的端口 30280，保证外网流量可以通过该端口，外部才能够访问。

![Harbor 登录](/harbor-console.png)

### Docker 访问

#### 第一步：修改 Docker 配置

修改集群中所有节点的 Docker 配置，需要根据操作系统来修改：

- 如果待安装机器的系统为 `CentOS`，则需要在 `/etc/systemd/system/docker.service.d/docker-options.conf` 文件添加字段 `--insecure-registry=harbor.devops.kubesphere.local:30280`，如下所示：

**CentOS 示例**

```bash
[Service]
Environment="DOCKER_OPTS= -D --insecure-registry=harbor.devops.kubesphere.local:30280 --data-root=/var/lib/docker --log-opt max-size=10m --log-opt max-file=3 --iptables=false"
```

- 如果待安装机器的系统为 `Ubuntu`，则需要修改或添加 `/etc/docker/daemon.json` ⽂件：

**Ubuntu 示例**

```bash
{
    "insecure-registries": [
        "harbor.devops.kubesphere.local:30280"]
}
```

#### 第二步：重启 Docker 服务

修改后，需要重启所有节点的 Docker 服务使配置生效，⽐如在 Linux 系统中需执行以下命令：

```bash
$ sudo systemctl restart docker
```
#### 第三步：登录 Harbor

执行以下命令登录 Harbor 镜像仓库。关于如何制作镜像、打包上传镜像以及 Dockerfile 的使用，请参考 [Docker 官方文档]。(https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)。

```dockerfile
$ docker login -u admin -p Harbor12345 http://harbor.devops.kubesphere.local:30280

WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

### KubeSphere 添加 Harbor 

登录控制台，在已创建的企业空间的项目下，左侧菜单栏选择 **配置中心 → 密钥**，点击 **创建**。

#### 第一步：填写基本信息

填写密钥的基本信息，完成后点击 **下一步**。

- 名称：起一个简洁明了的名称，填写 `harbor`
- 别名：支持中文，帮助您更好的区分资源，比如 `内置 Harbor 镜像仓库`
- 描述信息：简单介绍该密钥的功能

![基本信息](/harbor-secret-basic.png)

#### 第二步：填写 Harbor 仓库信息

2.1. 参考如下提示填写 Harbor 仓库的登录信息。

- 仓库地址：填写内置的 Harbor 镜像仓库域名和节点端口 `http://harbor.devops.kubesphere.local:30280`
- 用户名：admin
- 密码：Harbor12345
- 邮箱：填写个人邮箱

![](/harbor-docker-login.png)

2.2. 如果 Harbor 安装配置都正确，并且验证信息都填写无误，即可添加成功。Harbor 镜像仓库添加完成后，可以上传镜像和拉取镜像。

![](/harbor-secret-list.png)


### 使用 Harbor 镜像仓库

若需要在 KubeSphere 中使用 Harbor 镜像仓库中的镜像，需要先将相关的镜像构建后上传至 Harbor。关于 Harbor 的使用详见 [Harbor 官方文档](https://goharbor.io/docs/)。

以创建 Deployment 为例展示如何使用镜像仓库来拉取仓库中的镜像。比如 Harbor 镜像仓库中已有 `mysql:5.6` 的 docker 镜像，在容器组模板中需要先选择镜像仓库，然后将镜像填写为 `http://harbor.devops.kubesphere.local:30280/mysql:5.6`，对应的格式为 `镜像仓库地址 / 镜像名称:tag`，填写后创建完成即可使用该 Harbor 镜像仓库中的镜像。

![使用 Harbor 镜像仓库](/apply-harbor.png)