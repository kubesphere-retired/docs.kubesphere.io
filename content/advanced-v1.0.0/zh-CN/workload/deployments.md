---
title: "部署"
---

部署 (Deployment) 为 Pod 和 ReplicaSet 提供了一个声明式定义 (declarative) 方法来管理应用。典型的应用场景包括定义 Deployment 来创建 Pod 和 ReplicaSet、滚动升级和回滚应用、扩容和缩容以及暂停和继续 Deployment。

本文档仅说明创建部署中的可能用到的参数或字段意义，创建工作负载后应如何管理，请参考 [工作负载管理](../../workload/workload-management/)。同时，[部署 Wordpress 示例](../../quick-start/wordpress-deployment/) 也可帮助您快速理解 Deployment。

## 创建部署

登录 KubeSphere 控制台，在已创建的项目下选择 **工作负载 → 部署**，进入部署列表页面。

左上角为当前所在项目，如果是管理员登录，可以看到集群所有项目的部署情况，如果是普通用户，则只能查看授权项目下的所有部署。列表顶部显示了当前项目的部署 Pod 配额和数量信息。

![部署列表](/ae_deployment_list.png)

### 第一步：填写基本信息

1.1. 点击 **创建** 按钮，将弹出创建部署的详情页。创建部署支持三种方式，**页面创建**，**导入 yaml 文件** 创建，**编辑模式** 创建。以下主要介绍页面创建的方式，若选择以编辑模式，可点击右上角编辑模式进入代码界面，支持 yaml 和 json 格式。左上角显示配置文件列表和导入导出按钮。其中导入 yaml 文件方式会自动将 yaml 文件内容填充到页面上，用户根据需要可以在页面上调整后再行创建。编辑模式可以方便习惯命令行操作的用户直接在页面上编辑 yaml 文件并创建部署。

![创建部署 - 代码模式](/ae_deployment_command.png)


1.2. 在基本信息页，输入部署的名称，用户可以根据需求填写部署的描述信息。在 Kubernetes 中策略是指定新的 Pod 替换旧的 Pod 的策略，分为 `RollingUpdate` 和 `Recreate` 两种类型。

- 名称：为创建的任务起一个简洁明了的名称，便于用户浏览和搜索。
- 别名：帮助您更好的区分资源，并支持中文名称。
- 描述信息：简单介绍部署，让用户进一步了解部署的作用。
- RollingUpdate：Deployment 使用滚动更新 ([Rolling-update](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#rolling-update)) 的方式更新 Pod，您可以指定 maxUnavailable 和 maxSurge 来控制滚动更新的进程。

   - MaxUnavailable 是可选配置项，当前默认值是 25%。用来指定在升级过程中不可用 Pod 的最大数量。该值可以是一个绝对值 (例如 5)，也可以是期望 Pod 数量的百分比 (例如 10%)。通过计算百分比的绝对值向下取整。如果 MaxSurge 为 0 时，MaxUnavailable 不可以为 0。
   - MaxSurge 是可选配置项，当前默认值是 25%。用来指定可以超过期望的 Pod 数量的最大个数。该值可以是一个绝对值 (例如 5) 或者是期望的 Pod 数量的百分比 (例如 10%)。当 MaxUnavailable 为 0 时 MaxSurge 不可以为 0。通过百分比计算的绝对值向上取整。

- Recreate：在创建出新的 Pod 之前会先杀掉所有已存在的 Pod。   

![创建部署 - 基础信息](/ae_deployment_create_basic.png)

### 第二步：配置容器组模板

2.1. 在 **容器组模板** 页面, 用户可以设置 Pod 副本数量和弹性伸缩 [HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough)，HPA 能够使 Pod 水平自动缩放，提高集群的整体资源利用率。文档提供了一个弹性伸缩的示例并说明了弹性伸缩工作原理，详见 [设置弹性伸缩](../../quick-start/hpa)。

![创建部署-设置HPA](/ae_deployment_HPA_setting.png)

然后根据需求添加容器，Pod 可以包含一个或者多个容器，添加容器前需要先在平台添加镜像仓库，参见 [镜像仓库 - 添加镜像仓库](../../platform-management/image-registry/#添加镜像仓库)。点击 **添加容器**，将从添加到平台的镜像仓库中拉取镜像，输入容器的名称和对应的镜像名，镜像名一般需要指定 tag，比如 wordpress:4.8-apache。

2.2. 如果用户有更进一步的需求，可以点击 **高级选项**。高级选项中可以对 CPU 和内存的资源使用进行限定。

**表1：CPU 配额说明**

|参数|说明|
|---|---|
|**requests**|容器使用的最小 CPU 需求，作为容器调度时资源分配的判断依赖。<br> 只有当节点上可分配 CPU 总量 ≥ 容器 CPU 申请数时，才允许将容器调度到该节点。|
|**limits**|容器能使用的 CPU 最大值，超过这个限定值，容器可能会被 kill。|

**表2：内存配额说明**

|参数|说明|
|---|---|
|**requests**|容器使用的最小内存需求，作为容器调度时资源分配的判断依赖。<br> 只有当节点上可分配内存总量 ≥ 容器内存申请数时，才允许将容器调度到该节点。|
|**limits**|容器能使用的内存最大值。当内存使用率超出设置的内存限制值时，该实例可能会被重启从而影响工作负载。|

在默认情况下，镜像会运行默认命令和参数，如果想运行特定命令或重写镜像默认值，可在高级选项的命令和参数中设置，此外还可以设置端口和环境变量。

- **就绪探针/存活探针**：在业务级的监控检查方面，Kubernetes 定义了两种类型的健康检查探针，详见 [设置健康检查器](../../workload/health-check)。
- **命令**： 可自定义容器的启动命令，Kubernetes 的容器启动命令可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#run-a-command-in-a-shell)。
- **参数**： 可自定义容器的启动参数，Kubernetes 的容器启动的参数可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/)。
- **端口**： 即容器端口，用于指定容器需要暴露的端口，端口协议可以选择 TCP 和 UDP。
- **目标端口**： 在当前集群下的所有节点上打开一个真实的端口号，映射到容器端口。
- **环境变量**： 环境变量是指容器运行环境中设定的一个变量，与 Dockerfile 中的 “ENV” 效果相同，为创建的工作负载提供极大的灵活性。
- **引入配置中心**： ConfigMap 用来保存键值对形式的配置数据，可用于设置环境变量的值，详见 [配置 - Configmap](../../configuration/configmaps)。

上述配置信息填写完成以后，点击下一步。

![创建部署 - 容器组设置](/ae_deployment_container_setting.png)
![创建部署 - 容器组设置](/ae_deployment_container_setting-2.png)

### 第三步：添加存储卷

在存储卷页面可以添加 **持久化存储卷**， **临时存储卷** 和 **引用配置中心**。

#### 持久化存储卷

持久化存储卷可用于持久化存储用户数据，需要预先创建存储卷，参考 [存储卷 - 创建存储卷](../../storage/pvc/#创建存储卷)。

#### 临时存储卷

临时存储卷是 [emptyDir](https://kubernetes.cn/docs/concepts/storage/volumes/#emptydir) 类型，随 Pod 被分配在主机上。当 Pod 从主机上被删除时，临时存储卷也同时会删除，存储卷的数据也将永久删除，容器崩溃不会从节点中移除 Pod，因此 emptyDir 类型的卷中数据在容器崩溃时是安全的。

#### 引入配置中心

支持配置 ConfigMap 或 Secret 中的值添加为卷，支持选择要使用的密钥以及将公开每个密钥的文件路径，最后设置目录在容器中的挂载路径。

其中 Secret 卷用于将敏感信息 (如密码) 传递到 Pod。Secret 卷由 tmpfs (一个 RAM 支持的文件系统) 支持，所以它们永远不会写入非易失性存储器。

ConfigMap 用来保存键值对形式的配置数据，这个数据可以在 Pod 里使用，或者被用来为像 Controller 一样的系统组件存储配置数据。虽然 ConfigMap 跟 Secret 类似，但是 ConfigMap 更方便的处理不含敏感信息的字符串。它很像 Linux 中的 /etc 目录，专门用来存储配置文件的目录。ConfigMaps 常用于以下场景：

- 设置环境变量的值
- 在容器里设置命令行参数
- 在数据卷里面创建 config 文件

重要提示：您必须先在配置中心创建 Secret 或 ConfigMap，然后才能使用它，详见 [创建 Secret](../../configuration/secrets/#创建-secret) 和 [创建 ConfigMap](../../configuration/ConfigMaps/#创建-configmap)。


![创建部署 - 临时存储卷](/ae_deployment_pvc_create1.png)

### 第四步：添加标签

标签设置页用于指定资源对应的一组或者多组标签 (Label)。Label 以键值对的形式附加到任何对象上，如 Pod，Service，Node 等，定义好标签后，其他对象就可以通过标签来对对象进行引用，最常见的用法便是通过节点选择器来引用对象。一般来说，我们可以为一个 Pod（或其他对象）定义多个标签，以便于配置、部署等管理工作。例如，部署不同版本的应用到不同的环境中；或者监控和分析应用 (日志记录，监控，报警等)。通过多个标签的设置，我们就可以多维度地对对象进行精细化管理，如 `relase: stable ; tier: frontend`。

![创建部署 - 标签](/ae_deployment_label.png)

### 第五步：添加节点选择器

用户可以通过按节点选择或通过 Selector 设置一组或者多组键值对来指定期望运行容器组的主机。当不指定时，容器组将有可能调度到集群内满足调度条件的任意节点。最后点击创建，集群就会按照用户的配置创建部署。

![创建部署 - 节点选择器](/ae_deployment_nodeselector.png)

点击创建，即可完成部署资源的创建，状态显示 “更新中” 是由于拉取镜像需要一定时间，待镜像 pull 成功后状态将显示“运行中”。
 
