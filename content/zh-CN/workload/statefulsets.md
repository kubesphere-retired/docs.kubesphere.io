---
title: "有状态副本集"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

有状态副本集 (StatefulSet)，是为了解决有状态服务的问题，在运行过程中会保存数据或状态，例如 Mysql，它需要存储产生的新数据。而 Deployments 是为无状态服务而设计。应用场景包括：

- 稳定的持久化存储，即 Pod 重新调度后还是能访问到相同的持久化数据，基于 PVC 来实现。
- 稳定的网络标志，即 Pod 重新调度后其 PodName 和 HostName 不变，基于 Headless Service (即没有 Cluster IP 的 Service) 来实现。
- 有序部署、有序扩展，即 Pod 是有顺序的，在部署或者扩展的时候要依据定义的顺序依次进行 (即从 0 到 N-1，在下一个 Pod 运行之前所有之前的 Pod 必须都是 Running 和 Ready 状态)，基于 init containers 来实现。
- 有序收缩、有序删除 (即从 N-1 到 0)。

本文档仅说明创建有状态副本集中可能用到的参数或字段意义，创建工作负载后应如何管理，请参考 [工作负载管理](../../workload/workload-management/)。同时，[部署 MySQL 有状态应用示例](../../quick-start/mysql-deployment/) 也可帮助您快速理解 StatefulSet。

## 创建有状态副本集      

登录 KubeSphere 控制台，在已创建的项目下选择 **工作负载 → 有状态副本集**，进入列表页。

左上角为当前所在项目，如果是管理员登录，可以看到集群所有项目的有状态副本集情况，如果是普通用户，则只能查看授权项目下的所有有状态副本集。列表顶部显示了当前项目的有状态副本集 Pod 配额和数量信息。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514091833.png)

### 第一步：填写基本信息

1.1. 点击 **创建** 按钮，将弹出创建部署的详情页。创建有状态副本集支持三种方式，**页面创建**，**导入 yaml 文件** 创建，**编辑模式** 创建。以下主要介绍页面创建的方式。若选择以编辑模式，可点击右上角编辑模式进入代码界面，支持 yaml 和 json 格式。左上角显示配置文件列表和导入导出按钮。其中导入 yaml 文件方式会自动将 yaml 文件内容填充到页面上，用户根据需要可以在页面上调整后再行创建。编辑模式可以方便习惯命令行操作的用户直接在页面上编辑 yaml 文件并创建有状态副本集。

![创建有状态副本集 - 代码模式](/ae_statefulset_create_command.png)

1.2. 在基本信息页，需要输入部署的名称并选择创建部署的项目，用户可以根据需求填写部署的描述信息。


- 名称：为创建的有状态副本集起一个简洁明了的名称，便于用户浏览和搜索。
- 别名：帮助您更好的区分资源，并支持中文名称。
- 描述信息：简单介绍该有状态副本集，让用户进一步了解其作用。


点击 **下一步**。

![创建有状态副本集 - 基本信息](/ae_statefulset_create_basic.png)

### 第二步：配置容器组模板

2.1. 在 **容器组模板** 页面, 点击 **添加容器**，然后根据需求添加容器镜像，目前支持以下两种方式：

#### 通过代码构建新的容器镜像

从已有的代码仓库中获取代码，并通过Source to Image的方式构建镜像的方式来完成部署，每次构建镜像的过程将以任务 (S2i Job) 的方式去完成。


- 代码地址：源代码仓库地址(目前支持 git)并且可以指定代码分支及在源代码终端的相对路径，如 `https://github.com/kubesphere/devops-java-sample.git`；
- 密钥：如果是私有代码仓库，请选择代码仓库密钥，参考 [创建 GitHub 密钥](../../configuration/secrets/#创建-github-密钥)；
- 映像模板：选择编译环境和对应的编译模板作为 Builder image；
- 代码相对路径：可以指定代码编译的相对路径，默认为 /；
- 映像名称：根据您的 Docker Hub 账号填写，例如 `<dockerhub_username>/<image_name>`，`dockerhub_username` 为自己的账户名称，确保具有推拉权限；
- tag：镜像标签；
- 目标镜像仓库：选择已创建的镜像仓库，若还未创建请参考 [创建 DockerHub 密钥](../../configuration/secrets/#创建-dockerhub-密钥)。注意，基于代码地址中的源代码构建的镜像在部署和 S2i 任务创建完成后，该镜像直接 Push 至目标镜像仓库；
- 环境变量参数 (可选)：键值对，应用程序开发人员可以使用环境变量来配置此镜像的运行时行为。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514090311.png)


#### 选择已有镜像部署容器

从公开或者私有镜像仓库中拉取镜像，若不填写镜像仓库地址则镜像默认从 Docker Hub 中拉取。输入容器的名称和对应的镜像名，镜像名一般需要指定 tag，比如 mysql:5.6。容器中定义的镜像默认从 Docker Hub 中拉取。

> 说明：若需要使用私有镜像仓库如 Harbor，参见 [镜像仓库 - 添加镜像仓库](../../installation/harbor-installation/#kubesphere-中使用-harbor)。

为了实现集群的资源被有效调度和分配同时提高资源的利用率， 平台采用了 request 和 limit 两种限制类型对资源进行分配。request 通常是容器使用的最小资源需求, 而 limit 通常是容器能使用资源的最大值，设置为 0 表示对使用的资源不做限制, 可无限的使用。request 能保证 pod 有足够的资源来运行, 而 limit 则是防止某个 Pod 无限制的使用资源, 导致其他 Pod 崩溃。

**表1：CPU 配额说明**

|参数|说明|
|---|---|
|**最小使用 (requests)**|容器使用的 CPU 最小值，作为容器调度时资源分配的判断依赖。<br> 只有当节点上可分配 CPU 总量 ≥ 容器 CPU 最小值时，才允许将容器调度到该节点。|
|**最大使用 (limits)**|容器能使用的 CPU 最大值。|

**表2：内存配额说明**

|参数|说明|
|---|---|
|**最小使用 (requests)**|容器使用的最小内存需求，作为容器调度时资源分配的判断依赖。<br> 只有当节点上可分配内存总量 ≥ 容器内存申请数时，才允许将容器调度到该节点。|
|**最大使用 (limits)**|容器能使用的内存最大值，如果内存使用量超过这个限定值，容器可能会被 kill。|

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514092405.png)

2.2. 如果用户有更进一步的需求，可下滑至服务设置和高级设置部分。


- **服务设置**： 即设置容器的访问策略，指定容器需要暴露的端口并自定义端口名称，端口协议可以选择 TCP 和 UDP。
- **健康检查**：在业务级的监控检查方面，Kubernetes 定义了两种类型的健康检查探针，详见 [设置健康检查器](../../workload/health-check)。
   - 存活探针： 监测到容器实例不健康时，重启应用。
   - 就绪探针：监测到容器实例不健康时，将工作负载设置为未就绪状态，业务流量不会导入到该容器中。
- **启动命令**： 
   - **运行命令**：可自定义容器的启动的运行命令，Kubernetes 的容器启动命令可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#run-a-command-in-a-shell)。
   - **参数**： 可自定义容器的启动参数，Kubernetes 的容器启动的参数可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/)。
- **环境变量**： 环境变量是指容器运行环境中设定的一个变量，与 Dockerfile 中的 “ENV” 效果相同，为创建的工作负载提供极大的灵活性。
   - **添加环境变量**： 以添加键值对的形式来设置环境变量。
   - **引入配置中心**： 支持添加 Secret 和 ConfigMap 作为环境变量，用来保存键值对形式的配置数据，详见 [配置](../../configuration/configmaps) 和 [密钥](../../configuration/secrets)。 
- **镜像拉取策略**：默认的镜像拉取策略是 IfNotPresent，在镜像已经在本地存在的情况下，kubelet 将不再去拉取镜像将使用本地已有的镜像。如果需要每次拉取仓库中的镜像，则设置拉取策略为 Always。如果设置为 IfNotPresent 或者 Never， 则会优先使用本地镜像。


<font color=red>注意，运行命令和参数部分需要参考如下规则进行使用：</font>

如果在容器启动时执行一段 shell 命令，则需要在运行命令分别添加两行命令，然后在参数中填写需要执行的 shell 命令，如果是执行 bash 命令则需要把 sh 换成 bash。

```shell
# 运行命令
sh  # 若执行 bash 命令这里需要替换为 bash
-c
# 参数 (填写需要执行的 shell 命令，如下给出一个示例)
while true; do wget -q -O- http://php-apache.default.svc.cluster.local; done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190517171653.png)

设置完成后点击 **保存**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514090510.png)

**更新策略**

更新策略是指定新的 Pod 替换旧的 Pod 的策略，有状态副本集的更新策略分为 `滚动更新 (RollingUpdate)` 和 `删除容器组时更新 (OnDelete)` 两种类型：

- 滚动更新 (RollingUpdate)：推荐使用该策略，有状态副本集中实现 Pod 的自动滚动更新。当更新策略设置为滚动更新时，有状态副本集控制器将在有状态副本集中删除并重新创建每个 Pod。 它将以与 Pod 终止相同的顺序进行 (从最大的序数到最小的序数)，每次更新一个 Pod。在更新其前身之前，它将等待正在更新的 Pod 状态变成正在运行并就绪。

    - Partition：通过指定 Partition 来对滚动更新策略进行分区。如果指定了分区，则当 StatefulSet 的 template 更新时，具有大于或等于分区序数的所有 Pod 将被更新。具有小于分区的序数的所有 Pod 将不会被更新，即使删除它们也将被重新创建。如果 Partition 大于其副本数，则其 template 的更新将不会传播到 Pod。在大多数情况下，您不需要使用分区，只有需要进行分阶段更新时才会使用到。

- 删除容器组时更新 (OnDelete)：设置为 OnDelete 时，StatefulSet 控制器将不会自动更新 StatefulSet 中的 Pod。用户必须手动删除旧版本 Pod 以触发控制器创建新的 Pod。

上述配置信息填写完成以后，点击 **下一步**。

![更新策略](/ae-statefulsets-pod-tmp.png)

### 第三步：添加存储卷

点击 **添加存储卷模板**，填写存储卷的名称，选择存储类型，存储类型需要预先创建，参考 [存储类型 - 创建存储类型](../../infrastructure/storageclass)。然后指定卷的容量和访问模式，确定存储卷在容器内的挂载路径，详见 [存储卷](../../storage/pvc)。

![创建有状态副本集 - 存储卷](/ae_statefulset_create_PVC.png)

### 第四步：服务设置

由于有状态副本集必须包含一个 Headless 服务，因此需创建服务。填写服务名称，服务端口和目标端口，目标端口对应容器对外暴露的端口。基于客户端 IP 地址进行会话保持的模式，即第一次客户端访问后端某个 Pod，之后的请求都转发到这个 Pod 上。若要实现基于客户端 IP 的会话亲和性，可以将会话亲和性的值设置为 "ClientIP" (默认值为 "None")，该设置可将来自同一个 IP 地址的访问请求都转发到同一个后端 Pod。

![创建有状态副本集 - 服务](/ae_statefulset_create_svc.png)

### 第五步：添加标签

标签设置页用于指定资源对应的一组或者多组标签 (Label)。Label 以键值对的形式附加到任何对象上，如 Pod，Service，Node 等，定义好标签后，其他对象就可以通过标签来对对象进行引用，最常见的用法便是通过节点选择器来引用对象。一般来说，我们可以为一个 Pod (或其他对象) 定义多个标签，以便于配置、部署等管理工作。例如，部署不同版本的应用到不同的环境中；或者监控和分析应用 (日志记录、监控、报警等)。通过多个标签的设置，我们就可以多维度地对对象进行精细化管理，如 `relase: stable ; tier: frontend`。

![创建有状态副本集 - 标签](/ae_statefulset_create_label.png)

### 第六步：添加节点选择器

带有标签的对象创建好之后，我们就可以通过节点选择器 (Selector) 来引用这些对象。节点选择器页面，用户可以通过按节点选择或通过设置一组或者多组键值对来指定期望运行容器组的主机。当不指定时，将会在集群内的所有节点上启动容器组。点击右下角的创建后，集群就会按照用户的配置创建对应的守护进程集。

![创建有状态副本集 - 节点选择器](/ae_statefulset_create_nodeselector.png)
 
点击创建，即可完成有状态副本集的创建，状态显示 “更新中” 是由于拉取镜像需要一定时间，待镜像 pull 成功后状态将显示“运行中”。


