---
title: "部署 MySQL 有状态应用" 
---

## 目的

本文以创建一个有状态副本集 (Statefulset) 为例，使用 `mysql:5.6` 镜像部署一个有状态的 MySQL 应用，作为 [Wordpress](https://wordpress.org/) 网站的后端，演示如何创建使用 Statefulset。本示例的 MySQL 初始密码将以 [密钥 (Secret)](../../configuration/secrets) 的方式进行创建和保存。为方便演示，本示例仅说明流程，关于参数和字段的详细释义参见 [密钥](../../configuration/secrets) 和 [有状态副本集](../../workload/statefulsets)。

## 前提条件

- 已创建了企业空间、项目和普通用户 `project-regular` 账号，若还未创建请参考 [多租户管理快速入门](../admin-quick-start)；
- 使用项目管理员 `project-admin` 邀请项目普通用户 `project-regular` 加入项目并授予 `operator` 角色，参考 [多租户管理快速入门 - 邀请成员](../admin-quick-start/#邀请成员) 。

## 预估时间

约 10 分钟。

## 操作示例

<!-- ### 示例视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docsvideo.gd2.qingstor.com/demo1-mysql.mp4">
</video> -->

### 部署 MySQL

#### 第一步：创建密钥



MySQL 的环境变量 `MYSQL_ROOT_PASSWORD` 即 root 用户的密码属于敏感信息，不适合以明文的方式表现在步骤中，因此以创建密钥的方式来代替该环境变量。创建的密钥将在创建 MySQL 的容器组设置时作为环境变量写入。

1.1. 以项目普通用户 `project-regular` 登录 KubeSphere，在当前项目下左侧菜单栏的 **配置中心** 选择 **密钥**，点击 **创建**。

![创建密钥](https://pek3b.qingstor.com/kubesphere-docs/png/20190428135821.png)

1.2. 填写密钥的基本信息，完成后点击 **下一步**。

- 名称：作为 MySQL 容器中环境变量的名称，可自定义，例如 `mysql-secret`
- 别名：别名可以由任意字符组成，帮助您更好的区分资源，例如 `MySQL 密钥`
- 描述信息：简单介绍该密钥，如 `MySQL 初始密码`

![基本信息](/demo1-create-secrets-basic.png)

1.3. 密钥设置页，填写如下信息，完成后点击 **创建**。

- 类型：选择 `默认` (Opaque)
- Data：Data 键值对填写 `MYSQL_ROOT_PASSWORD` 和 `123456`

![Secret 设置](/mysql-secret-setting.png)

#### 第二步：创建有状态副本集

在左侧菜单栏选择 **工作负载 → 有状态副本集**，然后点击 **创建有状态副本集**。

![创建有状态副本集](/mysql-create-statefulset.png)

#### 第三步：填写基本信息

基本信息中，参考如下填写，完成后点击 **下一步**。

- 名称：必填，起一个简洁明了的名称，便于用户浏览和搜索，例如填写 `wordpress-mysql`
- 别名：可选，支持中文帮助更好的区分资源，例如填写 `MySQL 数据库`
- 描述信息：简单介绍该工作负载，方便用户进一步了解

![填写基本信息](/mysql-quick-start-1.png)

#### 第四步：容器组模板

4.1. 点击 **添加容器**，填写容器组设置，名称可由用户自定义，镜像填写 `mysql:5.6`（应指定镜像版本号)，CPU 和内存此处暂不作限定，将使用在创建项目时指定的默认请求值。

![添加容器组模板](https://pek3b.qingstor.com/kubesphere-docs/png/20190428140257.png)

4.2. 对 **服务设置** 和 **环境变量** 进行设置，其它项暂不作设置，完成后点击 **保存**。

- 端口：名称可自定义如 port，选择 `TCP` 协议，填写 MySQL 在容器内的端口 `3306`。
- 环境变量：勾选环境变量，点击 **引用配置中心**，名称填写 `MYSQL_ROOT_PASSWORD`，选择在第一步创建的密钥 `mysql-secret (MySQL 密钥)` 和 `MYSQL_ROOT_PASSWORD`

![设置容器组模板](https://pek3b.qingstor.com/kubesphere-docs/png/20190428140749.png)

4.3. 点击 **保存**，然后点击 **下一步**。

#### 第五步：添加存储卷模板

容器组模板完成后点击 **下一步**，在存储卷模板中点击 **添加存储卷模板**。有状态应用的数据需要存储在持久化存储卷 (PVC) 中，因此需要添加存储卷来实现数据持久化。参考下图填写存储卷信息。

- 存储卷名称：必填，起一个简洁明了的名称，便于用户浏览和搜索，此处填写 `mysql-pvc`
- 存储类型：选择集群已有的存储类型，如 `Local`
- 容量和访问模式：容量默认 `10 Gi`，访问模式默认 `ReadWriteOnce (单个节点读写)`
- 挂载路径：存储卷在容器内的挂载路径，选择 `读写`，路径填写 `/var/lib/mysql`


完成后点击 **保存**，然后点击 **下一步**。

![存储卷模板](https://pek3b.qingstor.com/kubesphere-docs/png/20190428140943.png)

#### 第六步：服务配置

要将 MySQL 应用暴露给其他应用或服务访问，需要创建服务，参考以下截图完成参数设置，完成后点击 **下一步**。

- 服务名称：此处填写 `mysql-service`，注意，这里定义的服务名称将关联 Wordpress，因此在创建 Wordpress 添加环境变量时应填此服务名
- 会话亲和性：默认 None
- 端口：名称可自定义，选择 `TCP` 协议，MySQL 服务的端口和目标端口都填写 `3306`，其中第一个端口是需要暴露出去的服务端口，第二个端口（目标端口）是容器端口

> 说明: 若有实现基于客户端 IP 的会话亲和性的需求，可以在会话亲和性下拉框选择 "ClientIP" 或在代码模式将 service.spec.sessionAffinity 的值设置为 "ClientIP"（默认值为 "None"），该设置可将来自同一个 IP 地址的访问请求都转发到同一个后端 Pod。

![服务配置](/mysql-quick-start-4.png)

#### 第七步：标签设置

标签保留默认设置 `app: wordpress-mysql`。下一步的节点选择器可以指定容器组调度到期望运行的节点上，此处暂不作设置，直接点击 **创建**。

### 查看 MySQL 有状态应用

在列表页可以看到有状态副本集 "wordpress-mysql" 的状态为 “更新中”，该过程需要拉取镜像仓库中指定 tag 的 Docker 镜像、创建容器和初始化数据库等一系列操作，状态显示 `ContainerCreating`。正常情况下在一分钟左右状态将变为 “运行中”，点击该项即可进入有状态副本集的详情页，包括资源状态、版本控制、监控、环境变量、事件等信息。

![查看 MySQL 有状态应用](/mysql-quick-start-5.png)

至此，有状态应用 MySQL 已经创建成功，将作为 Wordpress 网站的后端数据库。下一步需要创建 Wordpress 部署并通过外网访问该应用，参见 [快速入门 - 部署 Wordpress](../wordpress-deployment)。
