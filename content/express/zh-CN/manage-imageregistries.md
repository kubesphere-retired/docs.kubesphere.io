---
title: "镜像仓库"
---

Docker 镜像是一个只读的模板，可用于部署容器服务，每个镜像有特定的唯一标识（镜像的 Registry 地址+镜像名称+镜像 Tag）。例如：一个镜像可以包含一个完整的 Ubuntu 操作系统环境，里面仅安装了 Apache 或用户需要的其它应用程序。而镜像仓库，是集中存放镜像文件的场所，镜像仓库用于存放 Docker 镜像。

本节通过以下几个方面介绍如何管理镜像仓库：

- 如何管理镜像仓库
  - 创建镜像仓库
      - 创建 Harbor 镜像仓库
  - 查看镜像仓库
  - 修改镜像仓库
  - 如何使用镜像仓库
  - 删除镜像仓库

# 如何管理镜像仓库
登录 KubeSphere 管理控制台，访问访问左侧菜单栏，在**资源**菜单下，点击**镜像仓库**按钮，进入镜像仓库列表页面。作为集群管理员，可以查看当前集群下所有的镜像仓库。
![](/image_registires_list.png) 

## 创建镜像仓库
1.点击右上角**创建镜像仓库**按钮，弹出添加镜像仓库对话框，填写镜像仓库所需要的信息。

2.信息确认无误后，点击**确定**按钮，该过程中有个验证，验证用户所填写的镜像地址、用户名和密码是否正确，如果认证错误请检查镜像仓库所填写信息是否有误。

3.验证成功即完成镜像仓库的添加。

![](/image_registries_create.png) 

### 创建Harbor镜像仓库

**Harbor 简介**

[Harbor](http://vmware.github.io/harbor/) 是一个用于存储和分发 Docker 镜像的企业级 Registry 服务器，通过添加一些企业必需的功能特性，例如安全、标识和管理等，扩展了开源 Docker Distribution。作为一个企业级私有 Registry 服务器，Harbor 提供了更好的性能和安全。提升用户使用Registry构建和运行环境传输镜像的效率。Harbor支持安装在多个 Registry 节点的镜像资源复制，镜像全部保存在私有 Registry 中， 确保数据和知识产权在公司内部网络中管控。另外，Harbor 也提供了高级的安全特性，诸如用户管理，访问控制和活动审计等。以下详细介绍如何在 KubeSphere 中创建 Harbor 镜像仓库： 

根据 harbor 镜像仓库的地址类型，需要分 http 和 https 两种认证方法：

#### http
首先，需要修改集群中所有节点的 docker 配置。以 http://139.198.16.232 为例，修改 `/etc/docker/daemon.json` 文件，添加如下字段：

```
"insecure-registries" : ["139.198.16.232"]
```
添加完成以后，需要重启 docker:

```bash
$ systemctl restart docker
```
然后通过 KubeSphere 控制台，填写镜像仓库所需要的信息，创建 Harbor 镜像仓库。

![](/createhub1.png)

#### https
对于 https 协议的镜像仓库，首先需要获取镜像仓库的证书，记为 `ca.crt`，以 `https://harbor.openpitrix.io` 这个镜像仓库的地址为例，对集群中的所有节点都需要执行以下操作:

```bash 
$ cp ca.crt  /etc/docker/certs.d/harbor.openpitrix.io/ca.crt
```

如果还是报权限错误，针对不同的操作系统，需要执行以下操作:

**UBUNTU**

```bash
$ cp ca.crt /usr/local/share/ca-certificates/harbor.openpitrix.io.ca.crt
```
```bash
$ update-ca-certificatess
```
**RED HAT ENTERPRISE LINUX**

```bash
$ cp ca.crt /etc/pki/ca-trust/source/anchors/harbor.openpitrix.io.ca.crt
```
```bash
$ update-ca-trust
```

添加完成以后，需要重启docker：
```bash
$ systemctl restart docker
```

详情可参照 [docker官网](https://docs.docker.com/registry/insecure/#troubleshoot-insecure-registry) 。

然后通过 KubeSphere 控制台，填写镜像仓库所需要的信息，创建 Harbor 镜像仓库。
![](/createhub2.png)


## 查看镜像仓库
1.点击列表镜像仓库**名称**，进入该镜像仓库详情页面。

2.可以查看当前镜像仓库的授权项目列表以及镜像仓库的详情信息。

![](/image_registries_detail.png) 


## 修改镜像仓库
*  进入镜像仓库详情页面，点击左上角**编辑**按钮，可以修改当前镜像仓库信息。

![](/image_registries_alter.png)


## 使用镜像仓库

以创建deployment为例展示如何使用镜像仓库来拉取镜像。比如demo镜像仓库中有 `mysql:5.6` 的 docker 镜像,镜像地址为 `dockerhub.qingcloud.com/mysql/mysql:5.6`。

1.在镜像仓库已经授权的项目中，创建 deployment
   
![](/reg_demo_create.png)

2.在容器组设置阶段，点击镜像输入框，会弹出授权该项目下的所有镜像仓库列表，选择 demo 镜像仓库，然后输入具体的镜像仓库地址(命名空间+镜像+ TAG), 本例中输入的是 ```/mysql/mysql:5.6```。

![](/reg_demo_create_registries_list.png)

*  在容器组设置中配置 MySQL 的访问端口和 MySQL 的环境变量 (root 用户的密码) 并保存。高级选项中可以对 CPU 和内存的资源使用进行限定, 其中 requests 是集群保证分配给容器的资源， limits 是容器可以使用的资源的上限。

![](/reg_demo_create_container.png)

3.后续操作请查看 **部署管理**，最终会看到刚才部署的 mysql 已经运行起来了。

![](/reg_demo_create_done.png) 


## 删除镜像仓库
*  在镜像仓库列表页**勾选**镜像仓库或者进入详情页面，点击左侧镜像仓库操作菜单，点击**删除**按钮删除镜像仓库。

![](/image_registries_del.png)
![](/image_registries_delet.png)