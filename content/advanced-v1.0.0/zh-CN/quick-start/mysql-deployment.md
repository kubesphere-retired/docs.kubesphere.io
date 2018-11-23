---
title: "快速入门 - 部署 MySQL 有状态应用" 
---

本文以创建一个有状态副本集（Statefulset）为例，使用 `Mysql:5.6` 镜像部署一个有状态的 MySQL 应用，作为 [Wordpress](https://wordpress.org/) 网站的后端。MySQL 应用的初始密码将以 [Secrets](../../configuration/secrets) 的方式进行创建和保存。

## 前提条件

- 用户需在所属企业空间中已创建可用的项目资源。
- 已添加镜像仓库，若还未添加请参考 [添加镜像仓库](../../platform-management/image-registry)。

## 部署 MySQL

### 第一步：创建 Secret

MySQL 的环境变量 `MYSQL_ROOT_PASSWORD` 即 root 用户的密码属于敏感信息，不适合以明文的方式表现在步骤中，因此以创建 secret 的方式来代替该环境变量。创建的 Secret 将在创建 MySQL 的容器组设置时作为环境变量写入。

1.1. 在当前项目下左侧菜单栏的 **配置中心** 选择 **Secrets**，点击创建，基本信息如下：

- 名称：作为 MySQL 容器中环境变量的名称，可自定义。
- 别名：别名可以由任意字符组成，帮助您更好的区分资源，此处填写 `MYSQL_ROOT_PASSWORD`。
- 描述信息：MySQL password。


1.2. Secret 设置页，类型选择默认 (Opaque)，Data 的键值对填写 `MYSQL_ROOT_PASSWORD` 和 `123456`，完成 Secret 创建。

![Secret 设置](/mysql-secret-setting.png)


### 第二步：创建有状态副本集

登录 KubeSphere 控制台，进入已创建的项目， 选择 **工作负载 → 有状态副本集**，进入列表页，点击 **创建有状态副本集**。

![创建有状态副本集](/mysql-create-statefulset.png)

### 第三步：填写基本信息

基本信息中名称填写 `wordpress-mysql`，其它项本示例暂使用默认值，完成后点下一步：

![填写基本信息](/mysql-quick-start-1.png)

### 第四步：容器组模板

4.1. 填写容器组设置，名称可由用户自定义，镜像填写 `mysql:5.6`（应指定镜像版本号)。

4.2. 高级选项中支持对 CPU 和内存的资源使用进行限定，此处暂不作限定。其中 requests 是集群保证分配给容器的资源，limits 是容器可以使用的资源的上限。支持通过命令和参数 选项自定义容器的启动命令和启动参数。

4.3. 在容器组设置中配置 MySQL 的访问端口（3306）和 MySQL 容器的环境变量，环境变量名称填写 `MYSQL_ROOT_PASSWORD`，然后选择第一步创建的 secret，端口用于指定容器需要暴露的端口，端口协议此处选择 TCP，主机端口是容器映射到主机上的端口，此处暂不设置主机端口，其它项均保持默认。完成后点下一步：

![容器组模板](/mysql-quick-start-2.png)

### 第五步：添加存储卷模板

有状态应用的数据需要存储在持久化存储卷 (pvc) 中，因此需要添加存储卷来实现数据持久化。参考下图填写存储卷信息，挂载路径为 `/var/lib/mysql`。

![添加存储卷模板](/mysql-quick-start-3.png)

### 第六步：服务配置

一个 Kubernetes 的服务 (Service) 是一种抽象，它定义了一类 Pod 的逻辑集合和一个用于访问它们的策略 - 有的时候被称之为微服务。因此要将 MySQL 应用暴露给外部访问，需要创建服务。

参考以下截图完成参数设置。其中，第一个端口是需要暴露出去的服务端口，第二个端口（目标端口）是容器端口，此处的 MySQL 服务的端口和目标端口都填写 TCP 协议的 3306 端口，选择下一步。

> 说明: 若要实现基于客户端 IP 的会话亲和性，可以在会话亲和性下拉框选择 "ClientIP" 或在代码模式将 service.spec.sessionAffinity 的值设置为 "ClientIP"（默认值为 "None"）。

![服务配置](/mysql-quick-start-4.png)

### 第七步：标签设置

为方便识别此应用，我们标签设置为 `app: wordpress-mysql`。节点选择器可以指定容器组调度到期望运行的节点上，此处暂不作设置，点击创建。


## 查看 MySQL 有状态应用

在列表页可以看到有状态副本集 "wordpress-mysql" 的状态为 “更新中”，该过程需要拉取镜像仓库中指定 tag 的 Docker 镜像，正常情况下状态将自动变为 “运行中”，点击该项即可进入有状态副本集的详情页，包括资源状态、版本控制、监控、环境变量、事件等信息。

![查看 MySQL 有状态应用](/mysql-quick-start-5.png)

至此，有状态应用 MySQL 已经创建成功，将作为 Wordpress 网站的后端数据库。下一步需要创建 Wordpress 部署并通过外网访问该应用，参见 [快速入门 - 部署 Wordpress](../wordpress-deployment)。
