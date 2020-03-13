---
title: "创建 Wordpress 应用并发布至 Kubernetes"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## WordPress 简介

WordPress 是使用 PHP 开发的博客平台，用户可以在支持 PHP 和 MySQL 数据库的环境中架设属于自己的网站。本文以创建一个 [Wordpress 应用](www.wordpress.com/‎) 为例，以创建 KubeSphere 应用的形式将 Wordpress 的组件（MySQL 和 Wordpress）创建后发布至 Kubernetes 中，并在集群外访问 Wordpress 服务。

一个完整的 Wordpress 应用会包括以下 Kubernetes 对象，其中 MySQL 作为后端数据库，Wordpress 本身作为前端提供浏览器访问。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027200444.png)


## 前提条件

已创建了企业空间、项目和普通用户 `project-regular` 账号（该已账号已被邀请至示例项目），并开启了外网访问，请参考 [多租户管理快速入门](../admin-quick-start)。


## 预估时间

约 10 分钟。

## 示例视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/KS2.1_3-wordpress-k8s.mp4">
</video>

## 创建密钥

MySQL 的环境变量 `MYSQL_ROOT_PASSWORD` 即 root 用户的密码属于敏感信息，不适合以明文的方式表现在步骤中，因此以创建密钥的方式来代替该环境变量。创建的密钥将在创建 MySQL 的容器组设置时作为环境变量写入。

### 创建 MySQL 密钥

1. 以项目普通用户 `project-regular` 登录 KubeSphere，在当前项目下左侧菜单栏的 **配置中心** 选择 **密钥**，点击 **创建**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027202848.png)

2. 填写密钥的基本信息，完成后点击 **下一步**。


- 名称：作为 MySQL 容器中环境变量的名称，可自定义，例如 `mysql-secret`
- 别名：别名可以由任意字符组成，帮助您更好的区分资源，例如 `MySQL 密钥`
- 描述信息：简单介绍该密钥，如 `MySQL 初始密码`


3. 密钥设置页，填写如下信息，完成后点击 **创建**。


- 类型：选择 `默认` (Opaque)
- Data：Data 键值对填写 `MYSQL_ROOT_PASSWORD` 和 `123456`

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027203044.png)

### 创建 WordPress 密钥

同上，创建一个 WordPress 密钥，Data 键值对填写 `WORDPRESS_DB_PASSWORD` 和 `123456`。此时两个密钥都创建完成。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027203325.png)

## 创建存储卷

1. 在当前项目下左侧菜单栏的 `存储卷`，点击 `创建`，基本信息如下。


- 名称：wordpress-pvc
- 别名：Wordpress 持久化存储卷
- 描述信息：Wordpress PVC


2. 完成后点击 `下一步`，存储类型默认 local，访问模式和存储卷容量也可以使用默认值，点击 `下一步`，直接创建即可。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027212232.png)

## 创建应用

### 添加 MySQL 组件

1. 在左侧菜单栏选择 **应用负载 → 应用**，然后点击 **部署新应用**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027203641.png)

2. 基本信息中，参考如下填写，完成后在右侧点击 **添加组件**。


- 应用名称：必填，起一个简洁明了的名称，便于用户浏览和搜索，例如填写 `wordpress`
- 描述信息：简单介绍该工作负载，方便用户进一步了解

**MySQL 组件信息**

3. 参考如下提示完成 MySQL 组件信息：


- 名称： mysql
- 组件版本：v1
- 别名：MySQL 数据库
- 负载类型：选择 `有状态服务`

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027173228.png)

4. 点击 **添加容器镜像**，镜像填写 `mysql:5.6`（应指定镜像版本号)，然后按回车键或点击 DockerHub，点击 `使用默认端口`。

> 提示: 注意，在高级设置中确保内存限制 ≥ 1000 Mi,否则可能 MySQL 会因内存 Limit 不够而无法启动。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027173158.png)


5. 下滑至环境变量，在此勾选 `环境变量`，然后选择 `引用配置文件或密钥`，名称填写为 `MYSQL_ROOT_PASSWORD`，下拉框中选择密钥为 `mysql-secret` 和 `MYSQL_ROOT_PASSWORD`。

完成后点击右下角 `√`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027173718.png)

6. 点击 `添加存储卷模板`，为 MySQL 创建一个 PVC 实现数据持久化。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027205954.png)

参考下图填写存储卷信息。


- 存储卷名称：必填，起一个简洁明了的名称，便于用户浏览和搜索，此处填写 `mysql-pvc`
- 存储类型：选择集群已有的存储类型，如 `Local`
- 容量和访问模式：容量默认 `10 Gi`，访问模式默认 `ReadWriteOnce (单个节点读写)`
- 挂载路径：存储卷在容器内的挂载路径，选择 `读写`，路径填写 `/var/lib/mysql`


完成后点击 `√`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027174010.png)

### 添加 WordPress 组件

1. 参考如下提示完成 WordPress 组件信息：


- 名称： wordpress
- 组件版本：v1
- 别名：Wordpress前端
- 负载类型：默认 `无状态服务`

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027210730.png)

2. 点击 **添加容器镜像**，镜像填写 `wordpress:4.8-apache`（应指定镜像版本号)，然后按回车键或点击 DockerHub，点击 `使用默认端口`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027174215.png)

3. 下滑至环境变量，在此勾选 `环境变量`，这里需要添加两个环境变量：


-  点击 **引用配置文件或密钥**，名称填写 `WORDPRESS_DB_PASSWORD`，选择在第一步创建的配置 (Secret) `wordpress-secret` 和 `WORDPRESS_DB_PASSWORD`。
-  点击 **添加环境变量**，名称填写 `WORDPRESS_DB_HOST`，值填写 `mysql`，对应的是上一步创建 MySQL 服务的名称，否则无法连接 MySQL 数据库。


完成后点击 `√`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027174555.png)

4. 点击 `添加存储卷`，选择已有存储卷 `wordpress-pvc`，访问模式改为 `读写`，容器挂载路径 `/var/www/html`。完成后点击 `√`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027174709.png)

5. 检查 WordPress 组件信息无误后，再次点击 `√`，此时 MySQL 和 WordPress 组件信息都已添加完成，点击 `创建`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027212851.png)

## 查看应用资源

1. 在 `工作负载` 下查看 **部署** 和 **有状态副本集** 的状态，当它们都显示为 `运行中`，说明 WordPress 应用创建成功。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027213213.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027213150.png)

2. 访问 Wordpress 服务前，查看 wordpress 服务，将外网访问设置为 `NodePort`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027213426.png)

3. 点击 `更多操作` → `编辑外网访问`，选择 `NodePort`，然后该服务将在每个节点打开一个节点端口，通过 `点击访问` 即可在浏览器访问 WordPress。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027213826.png)

> 提示：此时也可以通过工具箱的 web kubctl 查看当前项目中 Wordpress 应用正在运行的所有资源。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027220246.png)

## 访问 Wordpress

以上访问将通过 `http://{$节点 IP}:{$节点端口 NodePort}` 访问 WordPress 博客网站。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027213826.png)

至此，您已经熟悉了如何通过创建一个 KubeSphere 应用的方式，通过快速添加多个组件来完成一个应用的构建，最终发布至 Kubernetes。这种创建应用的形式非常适合微服务的构建，只需要将各个组件容器化以后，即可通过这种方式快速创建一个完整的微服务应用并发布 Kubernetes。

同时，这种方式还支持用户以 **无代码侵入的形式开启应用治理**，针对 **微服务、流量治理、灰度发布与 Tracing** 等应用场景，开启应用治理后会在每个组件中以 SideCar 的方式注入 Istio-proxy 容器来接管流量，后续将以一个 Bookinfo 的示例来说明如何在创建应用中使用应用治理。
