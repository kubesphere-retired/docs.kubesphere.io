---
title: "Deploy a MySQL Application" 
---
<!--
## 目的

 本文以创建一个有状态副本集 (Statefulset) 为例，使用 `Mysql:5.6` 镜像部署一个有状态的 MySQL 应用，作为 [Wordpress](https://wordpress.org/) 网站的后端，演示如何创建使用 Statefulset。本示例的 MySQL 初始密码将以 [密钥 (Secret)](../../configuration/secrets) 的方式进行创建和保存。为方便演示，本示例仅说明流程，关于参数和字段的详细释义参见 [密钥](../../configuration/secrets) 和 [有状态副本集](../../workload/statefulsets)。 -->


## Target 


This page contains a Statefulset as an example shows how to deploy MySQL as a stateful application, which used the `Mysql:5.6` image as a backend for the [Wordpress](https://wordpress.org/) website. The MySQL initial password for this example will be created and saved as [Secret](../../configuration/secrets). This example only describes the process without too much explanation. For a detailed explanation of parameters and fields, see [Secrets](../../configuration/secrets) and [StatefulSets](../../workload/statefulsets).

<!-- ## 前提条件

- 已创建了企业空间和项目，若还未创建请参考 [管理员快速入门](../admin-quick-start)
- 以上一篇文档创建的 `project-regular` 用户登录 KubeSphere，进入已创建的企业空间下的项目 -->

## Prerequisites

- You need to create a workspace and project, see the [Admin Quick Start](../admin-quick-start) if not yet.
- You need to sign in with `project-regular` and enter into the corresponding project.

<!-- ## 预估时间

约 10 分钟。 -->

## Estimated Time

About 10 minutes.

<!-- ## 操作示例

### 示例视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docsvideo.gd2.qingstor.com/demo1-mysql.mp4">
</video> -->

## Example

<!-- ### 部署 MySQL

#### 第一步：创建密钥

MySQL 的环境变量 `MYSQL_ROOT_PASSWORD` 即 root 用户的密码属于敏感信息，不适合以明文的方式表现在步骤中，因此以创建密钥的方式来代替该环境变量。创建的密钥将在创建 MySQL 的容器组设置时作为环境变量写入。

1.1. 在当前项目下左侧菜单栏的 **配置中心** 选择 **密钥**，点击 **创建**。

![创建密钥](/demo1-create-secrets.png)

1.2. 填写密钥的基本信息，完成后点击 **下一步**。

- 名称：作为 MySQL 容器中环境变量的名称，可自定义，例如 `mysql-secret`
- 别名：别名可以由任意字符组成，帮助您更好的区分资源，例如 `MySQL 密钥`
- 描述信息：简单介绍该密钥，如 `MySQL 初始密码`

![基本信息](/demo1-create-secrets-basic.png)

1.3. 密钥设置页，填写如下信息，完成后点击 **创建**。

- 类型：选择 `默认` (Opaque)
- Data：Data 键值对填写 `MYSQL_ROOT_PASSWORD` 和 `123456`

![Secret 设置](/mysql-secret-setting.png) -->

### Deploy a MySQL as StatefulSet

#### Step 1: Create a Secret

1.1. Navigate to **Configuration Center → Secrets**, then click **Create**.

![创建密钥](/demo1-create-secrets-en.png)

1.2. Fill in the basic information, e.g. `Name : mysql-secret`. Then choose **Next** when you're done. 

![基本信息](/demo1-create-secrets-basic-en.png)

1.3. Data is composed of a set of key/value pairs, fill with the following values and select **Create**.

- Type: Choose `Default`
- key/value: `MYSQL_ROOT_PASSWORD` and `123456`

![Secret Setting](/mysql-secret-setting-en.png)

<!-- #### 第二步：创建有状态副本集

在左侧菜单栏选择 **工作负载 → 有状态副本集**，然后点击 **创建有状态副本集**。

![创建有状态副本集](/mysql-create-statefulset.png) -->

#### Step 2: Create a StatefulSet

Navigate to **Workload → StatefulSets**, then click **Create StatefulSet**.

![mysql-create-statefulset-en](/mysql-create-statefulset-en.png) 

<!-- #### 第三步：填写基本信息

基本信息中，参考如下填写，完成后点击 **下一步**。

- 名称：必填，起一个简洁明了的名称，便于用户浏览和搜索，例如填写 `wordpress-mysql`
- 别名：可选，支持中文帮助更好的区分资源，例如填写 `MySQL 数据库`
- 描述信息：简单介绍该工作负载，方便用户进一步了解

![填写基本信息](/mysql-quick-start-1.png) -->

#### Step 3: Basic Information

Fill in the basic information, e.g. `Name : wordpress-mysql` and `Alias : Mysql database`. Then choose **Next** when you're done. 

![Fill in the basic information](/mysql-quick-start-1-en.png)

<!-- #### 第四步：容器组模板

4.1. 点击 **添加容器**，填写容器组设置，名称可由用户自定义，镜像填写 `mysql:5.6`（应指定镜像版本号)，CPU 此处暂不作限定，将使用在创建项目时指定的默认请求值，内存的 `最大使用` 设置为 1024 Mi (即 1 Gi)。

展开 **高级选项**。

![添加容器](/demo1-step2.png)

4.2. 对 **端口** 和 **环境变量** 进行设置，其它项暂不作设置，完成后点击 **保存**。

- 端口：名称可自定义，选择 `TCP` 协议，填写 MySQL 在容器内的端口 `3306`。
- 环境变量：点击 **引用配置中心**，名称填写 `MYSQL_ROOT_PASSWORD`，选择在第一步创建的密钥 `mysql-secret (MySQL 密钥)` 和 `MYSQL_ROOT_PASSWORD`

![容器组模板](/mysql-quick-start-2.png)

4.3. 更新策略保持默认的 **滚动更新**，Partition 默认为 0，点击 **下一步**。 -->

#### Step 4: Pod Template

4.1. Click **Add Container**, Container Name can be customized by the user, fill in the image with `mysql:5.6` and set the Limit of Memory to `1024` Mi (i.e. 1 Gi), other blanks could be remained default values.

Choose **Advanced Options**.

![添加容器](/demo1-step2-en.png)

4.2. We'll simply set the **Ports** and **Environmental Variables** according to the following hints. 

- Ports:
   - Name: Port
   - Protocol: TCP
   - Port: 3306
- Environmental Variables
   - choose **Reference Config Center**
   - then fill in the name with `MYSQL_ROOT_PASSWORD` 
   - select resource: select `mysql-secret (MySQL password)` 
   - select Key: `MYSQL_ROOT_PASSWORD`

Then choose **Save** when you're done.

4.3. For **Update Strategy** you can keep `RollingUpdate` which is a recommended strategy, and Partition remains `0`. Then click **Next**.

<!-- #### 第五步：添加存储卷模板

容器组模板完成后点击 **下一步**，在存储卷模板中点击 **添加存储卷模板**。有状态应用的数据需要存储在持久化存储卷 (PVC) 中，因此需要添加存储卷来实现数据持久化。参考下图填写存储卷信息，完成后点击 **保存**。添加存储卷模板完成后，点击 **下一步**。

- 存储卷名称：必填，起一个简洁明了的名称，便于用户浏览和搜索，此处填写 `mysql-pvc`
- 描述信息：简单介绍该存储卷，方便用户进一步了解，如 `MySQL 存储卷`
- 存储类型：选择集群已有的存储类型，如 `Local`
- 容量和访问模式：容量默认 `10 Gi`，访问模式选择 `ReadWriteOnce (单个节点读写)`
- 挂载路径：存储卷在容器内的挂载路径，选择 `读写`，路径填写 `/var/lib/mysql`

![添加存储卷模板](/mysql-quick-start-3.png) -->

#### Step 5: Volume Template

Fill in the Volume Template with the following information:

- Volume Name: `mysql-pvc`
- Description: MySQL persistent volume
- Storage Class: e.g. local (Depends on your storage configuration)
- Capacity: 10 Gi by default
- Access Mode: ReadWriteOnce (RWO)
- Mount Path: `/var/lib/mysql`

![添加存储卷模板](/mysql-quick-start-3-en.png)

Then choose **Save** when you're done.

<!-- #### 第六步：服务配置

一个 Kubernetes 的服务 (Service) 是一种抽象，它定义了一类 Pod 的逻辑集合和一个用于访问它们的策略 - 有的时候被称之为微服务。因此要将 MySQL 应用暴露给外部访问，需要创建服务，参考以下截图完成参数设置，完成后点击 **下一步**。

- 服务名称：此处填写 `mysql-service`，注意，这里定义的服务名称将关联 Wordpress，因此在创建 Wordpress 添加环境变量时应填此服务名
- 会话亲和性：默认 None
- 端口：名称可自定义，选择 `TCP` 协议，MySQL 服务的端口和目标端口都填写 `3306`，其中第一个端口是需要暴露出去的服务端口，第二个端口（目标端口）是容器端口

> 说明: 若有实现基于客户端 IP 的会话亲和性的需求，可以在会话亲和性下拉框选择 "ClientIP" 或在代码模式将 service.spec.sessionAffinity 的值设置为 "ClientIP"（默认值为 "None"）。

![服务配置](/mysql-quick-start-4.png) -->

#### Step 6: Service Config

A Kubernetes Service is an abstraction which defines a logical set of Pods and a policy by which to access them - sometimes called a micro-service. 

Fill in the Service Config with the following information:

- Service Name: `mysql-service` (The Service Name defined here will be associated with Wordpress)
- Ports:
   - name: NodePort
   - protocol: TCP
   - port: 3306
   - target port: 3306

![服务配置](/mysql-quick-start-4-en.png)

<!-- #### 第七步：标签设置

为方便识别此应用，我们标签设置为 `app: wordpress-mysql`。下一步的节点选择器可以指定容器组调度到期望运行的节点上，此处暂不作设置，直接点击 **创建**。

![标签设置](/demo1-mysql-label.png) -->

#### Step 7: Label Settings

Labels are key/value pairs that are attached to objects, such as pods. Labels are intended to be used to specify identifying attributes of objects. We simply keep the default label settings as `app: wordpress-mysql`.

There is no need to set Node Selector in this demo, you can choose **Create** directly.

<!-- ### 查看 MySQL 有状态应用

在列表页可以看到有状态副本集 "wordpress-mysql" 的状态为 “更新中”，该过程需要拉取镜像仓库中指定 tag 的 Docker 镜像、创建容器和初始化数据库等一系列操作，状态显示 `ContainerCreating`。正常情况下在一分钟左右状态将变为 “运行中”，点击该项即可进入有状态副本集的详情页，包括资源状态、版本控制、监控、环境变量、事件等信息。

![查看 MySQL 有状态应用](/mysql-quick-start-5.png)

至此，有状态应用 MySQL 已经创建成功，将作为 Wordpress 网站的后端数据库。下一步需要创建 Wordpress 部署并通过外网访问该应用，参见 [快速入门 - 部署 Wordpress](../wordpress-deployment)。 -->

### View the MySQL Stateful Application

You will be able to see the MySQL stateful application displays "updating" since this process requires a series of operations such as pulling a Docker image of the specified tag, creating a container, and initializing the database. Normally, it will change to "running" at around 1 min.

Enter into the MySQL Stateful Application, you could find that page includes Resource Status, Revision Control, Monitoring, Environmental Variables and Events.

![查看 MySQL 有状态应用](/mysql-quick-start-5-en.png)

So far, MySQL Stateful Application has been already created and it is served as the back-end database of the WordPress website.

It's recommended to reference the WordPress deployment and access this web service later, see [Quick Start - Wordpress Deployment](../wordpress-deployment).