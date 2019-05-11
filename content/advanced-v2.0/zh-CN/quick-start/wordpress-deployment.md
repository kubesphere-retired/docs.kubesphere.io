---
title: "部署 Wordpress" 
---

## 目的

本文以创建一个部署 (Deployment) 为例，部署一个无状态的 Wordpress 应用，基于 [示例二](../mysql-deployment) 的 MySQL 应用最终部署一个外网可访问的 [Wordpress](https://wordpress.org/) 网站。Wordpress 连接 MySQL 数据库的密码将以 [配置 (ConfigMap)](../../configuration/configmaps) 的方式进行创建和保存。

## 前提条件

- 已创建了有状态副本集 MySQL，若还未创建请参考上一篇 [部署 MySQL](../mysql-deployment)；
- 使用项目管理员 `project-admin` 邀请项目普通用户 `project-regular` 加入项目并授予 `operator` 角色，参考 [多租户管理快速入门 - 邀请成员](../admin-quick-start/#邀请成员) 。

## 预估时间

约 15 分钟。

## 操作示例

<!-- ### 示例视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docsvideo.gd2.qingstor.com/demo2-wordpress.mp4">
</video> -->

### 部署 Wordpress

#### 第一步：创建配置

Wordpress 的环境变量 `WORDPRESS_DB_PASSWORD` 即 Wordpress 连接数据库的密码，为演示方便，以创建配置 (ConfigMap) 的方式来代替该环境变量。创建的配置将在创建 Wordpress 的容器组设置时作为环境变量写入。

1.1. 以项目普通用户 `project-regular` 登录 KubeSphere，在当前项目下左侧菜单栏的 **配置中心** 选择 **配置**，点击 **创建配置**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190428141721.png)

1.2. 填写部署的基本信息，完成后点击 **下一步**。

- 名称：作为 Wordpress 容器中环境变量的名称，填写 `wordpress-configmap`
- 别名：支持中文，帮助您更好的区分资源，比如 `连接 MySQL 密码`
- 描述信息：简单介绍该 ConfigMap，如 `MySQL password`

![基本信息](/demo2-configmap-basic.png)

1.3. ConfigMap 是以键值对的形式存在，此处键值对设置为 `WORDPRESS_DB_PASSWORD` 和 `123456`，完成后点击 **创建**。

![ConfigMap 设置](/wordpress-configmap.png)

#### 第二步：创建存储卷

2.1. 在当前项目下左侧菜单栏的 **存储卷**，点击创建，基本信息如下。

- 名称：wordpress-pvc
- 别名：Wordpress 持久化存储卷
- 描述信息：Wordpress PVC

![创建存储卷](/demo2-wordpress-pvc-basic.png)

2.2. 完成后点击 **下一步**，存储卷设置中，参考如下填写：

- 存储类型：选择集群中已创建的存储类型，例如 **Local**
- 访问模式：选择单节点读写 (RWO)
- 存储卷容量：默认 10 Gi

![存储卷设置](/demo2-pvc-setting.png)

2.3. 标签默认为 `app: wordpress-pvc`，点击 「创建」。

![设置标签](/demo-pvc-label.png)

2.4. 点击左侧菜单中的 **存储卷**，查看存储卷列表，可以看到存储卷 wordpress-pvc 已经创建成功，状态是 “准备就绪”，可挂载至工作负载。

> 若存储类型为 Local，那么该存储卷在被挂载至工作负载之前都将显示创建中，这种情况是正常的，因为 Local 目前还不支持存储卷动态配置 [ (Dynamic Volume Provisioning) ](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/)，挂载后状态将显示 “准备就绪”。

![创建存储卷](/wordpress-pvc-list.png)

#### 第三步：创建部署

在左侧菜单栏选择 **工作负载 → 部署**，进入列表页，点击 **创建部署**。

![创建部署](/wordpress-create-deployment.png)

#### 第四步：填写基本信息

基本信息中，参考如下填写，完成后点击 **下一步**。

- 名称：必填，起一个简洁明了的名称，便于用户浏览和搜索，比如 `wordpress`
- 别名：可选，支持中文帮助更好的区分资源，如 `Wordpress 网站`
- 描述信息：简单介绍该工作负载，方便用户进一步了解

<!-- - 更新策略：选择 RollingUpdate
   - MaxSurge：默认 25%， MaxSurge 指定的是除了 "期望副本 (DESIRED)" 数量之外，在一次滚动更新中，部署控制器还可以创建多少个新的容器组
   - MaxUnavailable：默认 25%，表示最多可以一次删除 "25 % 的期望副本数量" 个容器组 -->

![填写基本信息](/wordpress-basic.png)

#### 第五步：容器组模板

5.1. 点击 **添加容器**。容器组模板中，名称可自定义，镜像填写 `wordpress:4.8-apache`，CPU 和内存此处暂不作限定，将使用在创建项目时指定的默认值。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190428142854.png)

5.2. 下滑至服务设置，对 **端口** 和 **环境变量** 进行设置，其它项暂不作设置。参考如下填写。

- 端口：名称可自定义如 port，选择 `TCP` 协议，填写 Wordpress 在容器内的端口 `80`。
- 环境变量：这里需要添加两个环境变量
   -  点击 **引用配置中心**，名称填写 `WORDPRESS_DB_PASSWORD`，选择在第一步创建的配置 (ConfigMap) `wordpress-configmap` 和 `WORDPRESS_DB_PASSWORD`。
   -  点击 **添加环境变量**，名称填写 `WORDPRESS_DB_HOST`，值填写 `mysql-service`，对应的是 [示例一 - 部署 MySQL](../mysql-deployment/#第六步：服务配置) 创建 MySQL 服务的名称，否则无法连接 MySQL 数据库，可在服务列表中查看其服务名。


![容器组模板](https://pek3b.qingstor.com/kubesphere-docs/png/20190428143233.png)

5.3. 完成后点击 **保存**，点击 **下一步**。

#### 第六步：存储卷设置

6.1. 此处选择 **添加已有存储卷**，选择第二步创建的存储卷 `wordpress-pvc`。

![存储卷设置](/demo2-wordpress-pvc.png)

6.2. 设置存储卷的挂载路径，其中挂载选项选择 **读写**，挂载路径为 `/var/www/html`，保存后点击 **下一步**。

![存储卷设置](/wordpress-pvc-path.png)

#### 第七步：查看部署

7.1. 标签保留默认值，节点选择器此处暂不作设置，点击 **创建**，部署创建完成。


7.2. 创建完成后，部署的状态为 "更新中" 是由于创建后需要拉取 wordpress 镜像并创建容器 (大概一分钟左右)，可以看到容器组的状态是 "ContainerCreating"，待部署创建完成后，状态会显示 “运行中”。

![部署详情](/wordpress-deployment-list.png)

7.3. 查看创建的部署 Wordpress，可以看到其状态显示运行中，下一步则需要为 Wordpress 创建服务，最终暴露给外网访问。

![创建成功](/demo-wordpress-create-successfully.png)

#### 第八步：创建服务

8.1. 在当前项目中，左侧菜单栏选择 **网路与服务 → 服务**，点击 **创建**。

![创建服务](https://pek3b.qingstor.com/kubesphere-docs/png/20190428143635.png)

8.2. 基本信息中，信息填写如下，完成后点击 **下一步**：

- 名称：必填，起一个简洁明了的名称，便于用户浏览和搜索，比如 `wordpress-service`
- 别名和描述信息：如 `Wordpress 服务`

![创建服务](/create-wordpress-service.png)

8.3. 服务设置参考如下填写，完成后点击 **下一步**：

- 服务类型：选择第一项 **通过集群内部IP来访问服务 Virtual IP**
- 选择器：点击 **指定工作负载** 可以指定上一步创建的部署 Wordpress，指定后点击 **保存** 
- 端口：端口名称可自定义如 port，服务的端口和目标端口都填写 `TCP` 协议的 `80` 端口
- 会话亲和性：None，完成参数设置，选择下一步

> 说明: 若有实现基于客户端 IP 的会话亲和性的需求，可以在会话亲和性下拉框选择 "ClientIP" 或在代码模式将 service.spec.sessionAffinity 的值设置为 "ClientIP"（默认值为 "None"），该设置可将来自同一个 IP 地址的访问请求都转发到同一个后端 Pod。

![服务类型](/demo2-svc-setting.png)
![服务设置](/service-setting.png)

8.4. 本示例标签保留默认值，选择 **下一步**。

8.5. 服务暴露给外网访问支持 NodePort 和 LoadBalancer，这里服务的访问方式选择 **NodePort**。

![设置 NodePort](https://pek3b.qingstor.com/kubesphere-docs/png/20190428143904.png)

8.6. 点击 **创建**，wordpress-service 服务可创建成功。注意，wordpress-service 服务生成了一个节点端口 `32689`。

![查看服务](https://pek3b.qingstor.com/kubesphere-docs/png/20190509082526.png)


> 注意：若需要在公网访问，可能需要进行端口转发和防火墙放行对应的端口，保证外网流量能够通过需要访问的节点端口如 32689，否则外网无法访问。

例如在 QingCloud 云平台进行上述操作，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。

### 访问 Wordpress

设置完成后，WordPress 就以服务的方式通过 NodePort 暴露到集群外部，可以通过 `http://{$公网 IP}:{$节点端口 NodePort}` 访问 WordPress 博客网站。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190509082952.png)

至此，您已经熟悉了部署 (Deployments) 和有状态副本集 (Statefulsets) 、密钥 (Secret)、配置 (ConfigMap) 的基本功能使用，关于部署和有状态副本集的各项参数释义，详见 [部署](../../workload/deployments) 和 [有状态副本集](../../workload/statefulsets)。