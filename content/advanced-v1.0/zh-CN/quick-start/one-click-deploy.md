---
title: "示例四 - 一键部署应用"
---

应用为用户提供完整的业务功能，由一个或多个特定功能的组件组成。KubeSphere 应用模板所纳管的应用基于 Helm 打包规范构建，并通过统一的公有或私有的应用仓库交付使用，应用可根据自身特性由一个或多个 Kubernetes 工作负载 (workload) 和服务组成。

一键部署应用基于 KubeSphere 应用模板，应用模板可以查看来自所有应用仓库的应用，通过可视化的方式在 KubeSphere 中展示并提供部署及管理功能，常用来提供开发和测试使用的场景所需的中间件服务。用户可以基于应用模板快速地一键部署常用的应用到 KubeSphere 中，通过编辑服务的外网访问方式，用户可以在外部访问该应用。KubeSphere 基于 [OpenPitrix](https://openpitrix.io) 构建了应用仓库服务，在使用应用模板前可以添加一个包含应用的应用仓库，详见 [添加应用仓库](../../platform-management/app-repo)，KubeSphere 会自动加载此仓库下的所有应用。本示例也准备了一个示例仓库仅供测试部署使用。


## 目的

本示例通过导入一个包含测试模板的应用仓库，演示如何在 KubeSphere 中一键部署应用，并通过外网访问该应用，演示应用仓库、应用模板和应用列表的基本功能。

## 前提条件

已创建了企业空间和项目，若还未创建请参考 [管理员快速入门](../../quick-start/admin-quick-start)。

## 预估时间

约 15 分钟。

## 操作示例

### 示例视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docsvideo.gd2.qingstor.com/demo4-oneclick-deploy.mp4">
</video>

### 第一步：添加应用仓库

应用仓库的后端可以是 QingStor 对象存储，也可以是 AWS 对象存储，里面存储的内容是开发者开发好的应用的配置包以及索引文件。因此在 KubeSphere 添加应用仓库之前，需提前在云平台创建对象存储并上传应用配置包，一般是基于 Helm Chart 规范开发的应用。本示例准备了一个基于 [QingStor 对象存储](https://www.qingcloud.com/products/qingstor/) 的应用仓库，里面包含了用于演示的 Nginx 应用配置包，若需要自行添加和上传应用，请参阅 [添加应用仓库](../../platform-management/app-repo)。

1、应用仓库一般仅集群管理员或拥有应用仓库权限的用户操作。以 **集群管理员** 或拥有应用仓库权限的账号登录 KubeSphere，选择 **平台管理 → 应用仓库**，点击添加应用仓库。

![添加应用仓库](/add-app-repo.png)

2、填写应用仓库的详细信息，如下添加一个 http 协议的示例仓库：`http://docs-repo.gd2.qingstor.com	`，完成后点击 **确定**。

![应用仓库详细信息](/app-repo-basic.png)

3、添加完成后，可以在顶部的 **应用模板** 中查看新添加仓库的应用，点击应用名称为 `nginx` 的应用，准备部署该应用。

![查看应用模板](/app-template-lists.png)

### 第二步：部署应用

1、查看和部署应用等后续操作可使用管理员快速入门中创建的 project-regular 账号登录操作。点击进入 Nginx 应用模板的详情页面，可以查看其应用介绍、基本信息、版本信息和配置文件，该页面支持编辑和下载应用的配置文件，支持 Yaml 和 Json 格式。

![](/nginx-details.png)

2、点击 **部署应用**，填写应用的基本信息，应用名称可自定义，其中参数配置是读取的 `values.yaml` 文件中的默认值。选择预先创建的企业空间和项目，暂无需修改其它配置，点击 **部署**。

![填写基本信息](/nginx-demo-basic.png)

3、点击左侧菜单栏的 **应用**，通过应用模板部署的应用可以在项目下的 **应用** 列表页面查看，此时将在当前项目的 **应用** 中创建一个新的 Nginx 应用，待镜像拉取和容器启动完毕，状态即可显示为 **已启用**。

![查看应用](/nginx-app-demo.png)

点击应用可查看该应用后端的工作负载详情，如部署 (Deployment), 有状态副本集 (Statefulset) 和服务 (Service)。在 **应用** 中也可以点击 **部署新应用** 进入 **应用模板** 完成一键部署。

### 第三步：查看应用详情

1、在应用列表点击 Nginx 应用 (docs-demo)，进入应用的资源状态页可以看到该应用是由服务和工作负载组成，并支持查看其环境变量和操作日志。

![](/nginx-details-overview.png)

2、点击 **工作负载** 中的 `docs-demo-nginx`，可以查看该应用的部署 (Deployment) 详情页面，该页面可以更详细地查看 Pod 和容器的资源状态、监控，并支持编辑 Pod 的基本功能，如编辑配置模板、弹性伸缩、添加健康检查器等。

![工作负载详情](/nginx-deployment-details.png)

3、返回应用的详情页面，点击 **服务** 中的 `docs-demo-nginx` 可以查看该应用的服务详情。若需要将该应用暴露给外网访问，可点击 **更多操作 → 编辑外网访问**。

![编辑外网访问](/nginx-service-details.png)

4、外网访问支持以下三种，本示例以 `NodePort` 访问方式为例，点击确定。

> - 说明：
> -  None: 只在集群内部访问服务，集群外部无法访问。
> - NodePort：使用 NodePort 方式可以通过访问工作节点对应的端口来访问服务
> - LoadBalancer：如果用 LoadBalancer 的方式暴露服务，需要有云服务厂商的 LoadBalancer 插件支持，比如 [QingCloud KubeSphere 托管服务](https://appcenter.qingcloud.com/apps/app-u0llx5j8/Kubernetes%20on%20QingCloud) 可以将公网 IP 地址的 ID 填入 Annotation 中，即可通过公网 IP 访问该服务。

![选择访问方式](/select-nodeport.png)

5、将在当前服务的详情页面生成一个节点端口 (NodePort)，比如本示例是 `30055`，可通过外网访问该 NodePort 对外暴露的服务。

![查看节点端口](/nodeport-details.png)

### 第四步：访问应用

> 注意：若需要在外网访问，可能需要绑定公网 EIP 并配置端口转发，若公网 EIP 有防火墙，请在防火墙添加规则放行对应的端口 (比如 30055)，保证外网流量可以通过该端口，外部才能够访问。

例如，在 QingCloud 云平台上，如果使用了 VPC 网络，则需要将 KubeSphere 集群中的任意一台主机上暴露的节点端口 (NodePort) `30055` 在 VPC 网络中添加端口转发规则，然后在防火墙放行该端口。

**添加端口转发规则**

![添加端口转发规则](/demo4-vpc-nodeport-forward.png)

**防火墙添加下行规则**

![防火墙添加下行规则](/demo4-firewall-nodeport.png)

### 访问 Nginx

当以上步骤都顺利完成，此时在浏览器可以通过 **公网 IP : 30055** (`${EIP}:${NODEPORT}`) 在外网访问 Nginx 应用。

![访问应用](/access-nginx-app.png)

至此，您已经熟悉了如何通过添加应用仓库并使用应用模板一键部署应用的操作流程。

### 访问容器终端

在后台如果需要进入容器终端通常需要执行命令 `docker exec -it [容器编号] /bin/bash` 才可以进入容器内部，在 KubeSphere 中访问容器终端是非常方便的。

在 nginx 的部署详情页，点击容器组下的 nginx 容器组 → nginx 容器，即可进入容器的详情页。

![工作负载详情](/nginx-workload-page.png)

![容器组详情页](/view-docker-container.png)

点击左侧 `终端` 按钮，即可进入该容器的终端。

![容器终端](/container-terminal.png)

进入容器终端后，即可在容器内部执行命令进行操作。比如，执行 `cat /etc/hosts` 查看该容器的 Pod IP 和 Pod Name。

![终端窗口](/terminal-command-window.png)



