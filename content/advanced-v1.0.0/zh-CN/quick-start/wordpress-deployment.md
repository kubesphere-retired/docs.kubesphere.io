---
title: "快速入门 - 部署 Wordpress" 
---

本文以创建一个部署（Deployment）为例，使用 `wordpress:4.8-apache` 镜像部署一个无状态的 Wordpress 应用，最终部署一个外网可访问的 [Wordpress](https://wordpress.org/) 网站。Wordpress 连接 MySQL 数据库的密码将以 [ConfigMap](../../configuration/configmaps) 的方式进行创建和保存。

## 前提条件

- 用户需在所属企业空间中已创建可用的项目资源
- 已创建了有状态副本集 MySQL，若还未创建请参考 [快速入门 - 部署 MySQL](../mysql-deployment)。
- 已添加镜像仓库，若还未添加请参考 [添加镜像仓库](../../platform-management/image-registry)。

## 部署 Wordpress

### 第一步：创建 ConfigMap

Wordpress 的环境变量 `WORDPRESS_DB_PASSWORD` 即 Wordpress 连接数据库的密码属于敏感信息，不适合以明文的方式表现在步骤中，因此以创建 ConfigMap 的方式来代替该环境变量。创建的 ConfigMap 将在创建 Wordpress 的容器组设置时作为环境变量写入。

1.1. 在当前项目下左侧菜单栏的 **配置中心** 选择 **ConfigMaps**，点击创建，基本信息如下：

- 名称：作为 Wordpress 容器中环境变量的名称，可自定义。
- 别名：别名可以由任意字符组成，帮助您更好的区分资源，此处填写 `WORDPRESS_DB_PASSWORD`。
- 描述信息：Wordpress password。


1.2. ConfigMap 是以键值对的形式存在，因此键值对设置为 `WORDPRESS_DB_PASSWORD` 和 `123456`。

![创建 ConfigMap](/wordpress-configmap.png)

### 第二步：创建存储卷

2.1. 在当前项目下左侧菜单栏的 **存储卷**，点击创建，基本信息如下，

- 名称：wordpress-pvc
- 描述信息：Wordpress 持久化存储卷


2.2. 下一步，存储卷设置中，存储类型选择预先为集群创建的存储类型，示例中是 [csi-qingcloud](../../storage/qingcloud-storage)，访问模式选择单节点读写 (RWO)，存储卷容量默认 10 Gi。

2.3. 下一步，设置标签为 `app: wordpress`，点击创建。

可以看到存储卷 wordpress-pvc 已经创建成功，状态是 “准备就绪”，可挂载至工作负载。

![创建存储卷](/wordpress-pvc-list.png)

### 第三步：创建部署

登录 KubeSphere 控制台，进入已创建的项目， 选择 **工作负载 → 部署**，进入列表页，点击 **创建部署**。

![创建部署](/wordpress-create-deployment.png)

### 第四步：填写基本信息

基本信息中名称填写 `wordpress-mysql`，其它项本示例暂使用默认值，完成后点下一步：

![填写基本信息](/wordpress-basic.png)

### 第五步：容器组模板

5.1. 副本数量设置为 `2`，弹性伸缩的设置如下：

- Min Replicas (副本数量的下限): 2
- Max Replicas (副本数量的上限): 10
- CPU Request Target(%) (当CPU使用率超过或低于此目标值时，将添加或删除副本): 50
- Memory Request Target(Mi): 暂不限定


5.2. 容器组模板中，名称可自定义，镜像填写 `wordpress:4.8-apache`，配置 WordPress 的容器需要暴露的端口：80 端口 (暂不设置主机端口) 和关联 MySQL 数据库的环境变量 (`WORDPRESS_DB_HOST` 和 `WORDPRESS_DB_PASSWORD`) 并保存，CPU 和内存设定为 200，镜像拉取策略保持默认选项，参考如下配置，保存后点下一步。

> 注意: 环境变量中， `WORDPRESS_DB_HOST` 的值对应的是上一篇文档创建 MySQL 服务的名称 "service-7b4k6o"，可在服务列表中查看其服务名， MySQL 服务的名称应该与此处的环境变量值相同， 否则无法连接 MySQL 数据库。而 `WORDPRESS_DB_PASSWORD` 已经在第一步中以 ConfigMap 的形式创建，点击 **引入配置中心**，变量名填写 `WORDPRESS_DB_PASSWORD`，然后选择创建的 ConfigMap 作为数据库连接的密码。

![容器组模板](/wordpress-container-setting.png)

### 第六步：存储卷设置

此处选择 **添加已有存储卷**，选择第二步创建的存储卷 wordpress-pvc，挂载选项选择 **读写**，挂载路径为 `/var/www/html`。

![存储卷设置](/wordpress-pvc-path.png)

### 第七步：标签设置

为方便识别此应用，我们标签设置如下。节点选择器可以指定容器组调度到期望运行的节点上，此处暂不作设置，点击创建，部署创建完成。

```
app: wordpress-mysql
tier: frontend
```

创建完成后，部署的状态为 "更新中" 是由于创建后需要拉取 wordpress 镜像，可以看到容器组的状态是 "ContainerCreating"，

![部署详情](/wordpress-deployment-list.png)

### 第八步：创建服务

8.1. 在当前项目中，左侧菜单选择 **网路与服务 → 服务**，点击 **创建**。基本信息中，信息填写如下：

- 名称：wordpress-service
- 描述信息：wordpress 服务


8.2. 服务设置选择 **通过集群内部IP来访问服务 Virtual IP**，选择器点击 **Specify Workload** 可以指定上一步创建的 Wordpress deployment，此处的 wordpress 服务的端口和目标端口都填写 TCP 协议的 80 端口，完成参数设置，选择下一步。


8.3. 添加标签并保存，本示例标签设置如下，添加后选择下一步。

```
tier=wordpress-service
```

8.4. 服务暴露给外网访问的访问方式，支持 NodePort 和 LoadBalancer，由于示例将以应用路由 (Ingress) 的方式添加 Hostname 并暴露服务给外网，所以服务的访问方式选择 **不提供外网访问**。

### 第九步：创建应用路由

通过创建应用路由的方式可以将 WordPress 暴露出去供外网访问，与将服务直接通过 NodePort 或 LoadBalancer 暴露出去不同之处是应用路由是通过配置 Hostname 和路由规则（即 ingress）来访问，请参考以下步骤配置应用路由。关于如何管理应用路由详情请参考 [应用路由](../../ingress-service/ingress)。


9.1. 在当前项目中，左侧菜单选择 **网路与服务 → 应用路由**，点击 **创建**。创建应用路由，填入基本信息：

- 名称：wordpress-ingress
- 描述信息：wordpress 应用路由


9.2. 下一步，点击 **添加路由规则**，配置路由规则，这里设置 Hostname 为 `kubesphere.wordpress.com` 作为示例，协议选择 `http`，并且 path 路径填写 "/"，服务选择之前的创建成功的 wordpress 服务名称，端口填写 wordpress 服务端口 `80`，完成后点击下一步：

- Hostname: 应用规则的访问域名，最终使用此域名来访问对应的服务。(如果访问入口是以 NodePort 的方式启用，需要保证 Hostname 能够在客户端正确解析到集群工作节点上；如果是以 LoadBalancer 方式启用，需要保证 Hostname 正确解析到负载均衡器的 IP 上)。
- Paths: 应用规则的路径和对应的后端服务，端口需要填写成服务的端口。


9.3. 添加注解，Annotation 是用户任意定义的“附加”信息，以便于外部工具进行查找，参见 [Annotation 官方文档](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/)。本示例注解如下所示，完成后选择下一步：

```
hostname=kubesphere.wordpress.com
```

9.4. 添加标签如下，选择创建：

```
tier=wordpress-ingress
```

### 第十步：配置外网访问

在当前项目中，左侧菜单选择 **项目设置 → 外网访问**，点击 **设置网关**，即应用路由的网关入口，每个项目都有一个独立的网关入口。

网关入口提供 NodePort 和 LoadBalancer 两种访问方式，如果用 LoadBalancer 的方式暴露服务，需要有云服务厂商的 LoadBalancer 插件支持，比如 [青云QingCloud KubeSphere 托管服务](https://appcenter.qingcloud.com/apps/app-u0llx5j8/Kubernetes%20on%20QingCloud) 可以将公网 IP 地址的 ID 填入 Annotation 中，即可通过公网 IP 访问该服务。（如果外网访问方式设置的是 LoadBalancer，参见 [应用路由](../../ingress-service/ingress) 的 LoadBalancer 方式。）

本示例以 NodePort 访问方式为例配置网关入口，此方式网关可以通过工作节点对应的端口来访问，点击保存，将生产两个 NodePort，分别是 HTTP 协议的 80 端口和 HTTPS 协议的 443 端口。

至此，WordPress 就以应用路由的方式通过网关入口暴露到外网，用户可以通过示例中配置的 kubesphere.wordpress.com 和端口号访问 WordPress 博客网站。

## 查看部署

