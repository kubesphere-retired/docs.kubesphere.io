---
title: "快速入门 - 部署 MySQL 有状态应用" 
---

本文以创建一个有状态副本集（Statefulset）为例，使用 `Mysql:5.6` 镜像部署一个有状态的 MySQL 应用，作为 [Wordpress](https://wordpress.org/) 网站的后端。MySQL 应用的初始密码将以 [密钥 (Secret)](../../configuration/secrets) 的方式进行创建和保存。为方便演示，本示例仅说明流程，关于参数和字段的详细释义参见 [密钥](../../configuration/secrets) 和 [有状态副本集](../../workload/statefulsets)。

## 前提条件

- 用户需在所属企业空间中已创建可用的项目资源，若还未创建项目，参考 [创建项目](../../platform-management/workspace-management/#创建项目)。
- 已添加镜像仓库，若还未添加请参考 [添加镜像仓库](../../platform-management/image-registry)。

## 部署 MySQL

### 第一步：创建密钥

MySQL 的环境变量 `MYSQL_ROOT_PASSWORD` 即 root 用户的密码属于敏感信息，不适合以明文的方式表现在步骤中，因此以创建密钥的方式来代替该环境变量。创建的密钥将在创建 MySQL 的容器组设置时作为环境变量写入。

1.1. 在当前项目下左侧菜单栏的 **配置中心** 选择 **密钥**，点击创建，基本信息如下：

- 名称：作为 MySQL 容器中环境变量的名称，可自定义。
- 别名：别名可以由任意字符组成，帮助您更好的区分资源，此处填写 `MYSQL_ROOT_PASSWORD`。
- 描述信息：MySQL password。 


1.2. 密钥设置页，填写如下信息，完成后点击 **创建**。

- 类型：选择默认 (Opaque)
- Data：Data 键值对填写 `MYSQL_ROOT_PASSWORD` 和 `123456`

![Secret 设置](/mysql-secret-setting.png)


### 第二步：创建有状态副本集

登录 KubeSphere 控制台，进入已创建的项目， 选择 **工作负载 → 有状态副本集**，进入列表页，点击 **创建有状态副本集**。

![创建有状态副本集](/mysql-create-statefulset.png)

### 第三步：填写基本信息

基本信息中，参考如下填写：

- 名称：必填，起一个简洁明了的名称，便于用户浏览和搜索，此处填写 `wordpress-mysql`
- 别名：可选，支持中文帮助更好的区分资源，此处填写 `mysql`
- 更新策略：选择 RollingUpdate
- Partition：默认 0，暂不作设置
- 描述信息：简单介绍该工作负载，方便用户进一步了解。

![填写基本信息](/mysql-quick-start-1.png)

### 第四步：容器组模板

填写容器组设置，名称可由用户自定义，镜像填写 `mysql:5.6`（应指定镜像版本号)，展开 **高级选项** 对端口和环境变量进行设置，完成后点击 **保存**。

- CPU 和内存：此处暂不作限定，将使用在创建项目时指定的默认请求值。
- 端口：名称可自定义，选择 `TCP` 协议，填写 MySQL 在容器内的端口 `3306`。主机端口是容器映射到主机上的端口，此处暂不设置主机端口。
- 环境变量：点击 **引用配置中心**，名称填写 `MYSQL_ROOT_PASSWORD`，选择在第一步创建的密钥 `mysql-secret` 和 `MYSQL_ROOT_PASSWORD`。


![容器组模板](/mysql-quick-start-2.png)

### 第五步：添加存储卷模板

有状态应用的数据需要存储在持久化存储卷 (PVC) 中，因此需要添加存储卷来实现数据持久化。参考下图填写存储卷信息，完成后点击 **保存**。

- 存储卷名称：必填，起一个简洁明了的名称，便于用户浏览和搜索，此处填写 `mysql-pvc`
- 描述信息：简单介绍该存储卷，方便用户进一步了解。
- 存储类型：由于安装时配置了 QingCloud-CSI 插件，因此这里选择 `csi-qingcloud` (可选择实际配置和创建的存储类型)
- 容量和访问模式：容量默认 `10 Gi`，访问模式选择 `ReadWriteOnce (单个节点读写)`
- 挂载路径：存储卷在容器内的挂载路径，选择 `读写`，路径填写 `/var/lib/mysql`

![添加存储卷模板](/mysql-quick-start-3.png)

### 第六步：服务配置

一个 Kubernetes 的服务 (Service) 是一种抽象，它定义了一类 Pod 的逻辑集合和一个用于访问它们的策略 - 有的时候被称之为微服务。因此要将 MySQL 应用暴露给外部访问，需要创建服务，参考以下截图完成参数设置。

- 服务名称：此处填写 `mysql-service`，这里定义的服务名称将关联 Wordpress，因此在创建 Wordpress 时添加环境变量应填此服务名
- 会话亲和性：默认 None
- 端口：名称可自定义，选择 `TCP` 协议，MySQL 服务的端口和目标端口都填写 `3306`，其中第一个端口是需要暴露出去的服务端口，第二个端口（目标端口）是容器端口

> 说明: 若有实现基于客户端 IP 的会话亲和性的需求，可以在会话亲和性下拉框选择 "ClientIP" 或在代码模式将 service.spec.sessionAffinity 的值设置为 "ClientIP"（默认值为 "None"）。

![服务配置](/mysql-quick-start-4.png)

### 第七步：标签设置

为方便识别此应用，我们标签设置为 `app: wordpress-mysql`。节点选择器可以指定容器组调度到期望运行的节点上，此处暂不作设置，点击创建。


## 查看 MySQL 有状态应用

在列表页可以看到有状态副本集 "wordpress-mysql" 的状态为 “更新中”，该过程需要拉取镜像仓库中指定 tag 的 Docker 镜像、创建容器和初始化数据库等一系列操作，状态显示 `ContainerCreating`。正常情况下在一分钟左右状态将变为 “运行中”，点击该项即可进入有状态副本集的详情页，包括资源状态、版本控制、监控、环境变量、事件等信息。

![查看 MySQL 有状态应用](/mysql-quick-start-5.png)

至此，有状态应用 MySQL 已经创建成功，将作为 Wordpress 网站的后端数据库。下一步需要创建 Wordpress 部署并通过外网访问该应用，参见 [快速入门 - 部署 Wordpress](../wordpress-deployment)。

![创建成功](/mysql-created-result.png)
