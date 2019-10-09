---
title: "任务"
keywords: ''
description: ''
---

任务 (Job)，在 Kubernetes 中用来控制批处理型任务的资源对象，即仅执行一次的任务，它保证批处理任务的一个或多个 Pod 成功结束。任务管理的 Pod 根据用户的设置在任务成功完成就自动退出，比如在创建工作负载前，执行任务；将镜像上传至镜像仓库等一次性任务。

本文档主要解释说明创建任务中所有参数或字段的释义，配合 [快速入门 - 创建简单任务](../../quick-start/job-quick-start) 帮助您快速创建一个任务来执行简单的命令计算并输出圆周率到小数点后 2000 位作为示例，说明任务的基本功能。


## 创建任务

登录 KubeSphere 控制台，在已创建的项目下，进入 **工作负载 → 任务**，进入任务列表页面。左上角为当前所在项目。如果是管理员登录，可以看到集群所有项目的任务情况，如果是普通用户，则只能查看授权项目下的所有任务。列表顶部显示了当前项目的任务 Pod 配额和数量信息。

![创建任务](/ae-create-job.png)

### 第一步：填写基本信息

1.1. 点击 **创建** 按钮，将弹出创建任务的详情页。创建任务支持三种方式，**页面创建**，**导入 yaml 文件**，**编辑模式** 。以下主要介绍页面创建的方式，若选择以编辑模式，可点击右上角编辑模式进入代码界面，支持 yaml 和 json 格式。左上角显示配置文件列表和导入导出按钮。其中导入 yaml 文件方式会自动将 yaml 文件内容填充到页面上，用户根据需要可以在页面上调整后再行创建。编辑模式可以方便习惯命令行操作的用户直接在页面上编辑 yaml 文件并创建任务。

![创建任务 - 代码模式](/ae-job-command.png)

基本信息页中，需要填写任务的名称和描述信息。

- 名称：为创建的任务起一个简洁明了的名称，便于用户浏览和搜索。
- 别名：帮助您更好的区分资源，并支持中文名称。
- 描述信息：简单介绍该任务有什么作用，让用户进一步了解该任务。

![填写基本信息](/ae-demo-job1.png)

### 第二步：任务设置

任务设置页中，通过设置 Job Spec 的四个配置参数来设置 Job 的任务类型。

- Back Off Limit：失败尝试次数，若失败次数超过该值，则 Job 不会继续尝试工作；如设置为 5 则表示最多重试 5 次。
- Completions：标志任务结束需要成功运行的 Pod 个数，如设置为 10 则表示任务结束需要运行 10 个 Pod。
- Parallelism：标志并行运行的 Pod 的个数；如设置为 5 则表示并行 5 个 Pod。
- Active Deadline Seconds：Active Deadline Seconds：指定 Job 可运行的时间期限，超过时间还未结束，系统将会尝试进行终止，且 ActiveDeadlineSeconds 优先级高于 Back Off Limit；如设置 20 则表示超过 20s 后 Job 运行将被终止。

![任务设置](/job-setting.png)

### 第三步：配置任务模板

3.1. 任务模板即设置 Pod 模板，其中 [RestartPolicy](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) 指通过同一节点上的 kubelet 重新启动容器，仅支持 Never 或 OnFailure，当任务未完成的情况下：

- Never：任务会在容器组出现故障时创建新的容器组，且故障容器组不会消失，返回的字段 “.status.failed” 加 1。
- OnFailure：任务会在容器组出现故障时其内部重启容器，而不是创建新的容器组，返回的字段 “.status.failed” 不变。


3.2. 点击 **添加容器**，然后根据需求添加容器镜像，容器中定义的镜像默认从 Docker Hub 中拉取。输入容器的名称和对应的镜像名，镜像名一般需要指定 tag，比如 perl:5.28.0。

> 说明：若需要使用私有镜像仓库如 Harbor，参见 [镜像仓库 - 添加镜像仓库](../../platform-management/image-registry/#添加镜像仓库)。

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

![Job 容器组模板](/ae-job-tmp.png)

3.3. 如果用户有更进一步的需求，可以点击 **高级选项**。

- **命令**： 可自定义容器的启动命令，Kubernetes 的容器启动命令可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#run-a-command-in-a-shell)。
- **参数**： 可自定义容器的启动参数，Kubernetes 的容器启动的参数可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/)。
- **端口**： 即容器端口，用于指定容器需要暴露的端口，端口协议可以选择 TCP 和 UDP。
- **环境变量**： 环境变量是指容器运行环境中设定的一个变量，与 Dockerfile 中的 “ENV” 效果相同，为创建的工作负载提供极大的灵活性。
- **引入配置中心**： 支持添加 Secret 和 ConfigMap 作为环境变量，用来保存键值对形式的配置数据，详见 [配置](../../configuration/configmaps) 和 [密钥](../../configuration/secrets)。 
- **镜像拉取策略**：imagePullPolicy，默认的镜像拉取策略是 IfNotPresent，在镜像已经存在的情况下，kubelet 将不再去拉取镜像。如果需要频繁拉取镜像，则设置拉取策略为 Always。如果容器属性 imagePullPolicy 设置为 IfNotPresent 或者 Never， 则会优先使用本地镜像。

![任务模板](/ae-job-tmp-2.png)

上述配置信息填写完成以后，点击 **保存**，然后点击 **下一步**。

### 第四步：存储卷设置

在存储卷页面可以添加以下三类存储存储卷： 

#### 持久化存储卷

持久化存储卷可用于持久化存储用户数据，需要预先创建存储卷，参考 [存储卷 - 创建存储卷](../../storage/pvc)。

#### 临时存储卷

临时存储卷是 [emptyDir](https://kubernetes.cn/docs/concepts/storage/volumes/#emptydir) 类型，随 Pod 被分配在主机上。当 Pod 从主机上被删除时，临时存储卷也同时会删除，存储卷的数据也将永久删除，容器崩溃不会从节点中移除 Pod，因此 emptyDir 类型的卷中数据在容器崩溃时是安全的。

#### 引用配置中心 

引入配置中心支持配置 ConfigMap 或 Secret 中的值添加为卷，支持选择要使用的密钥以及将公开每个密钥的文件路径，最后设置目录在容器中的挂载路径。

其中，Secret 卷用于将敏感信息 (如密码) 传递到 Pod。您可以将 Secret 存储在 Kubernetes API 中，并将它们挂载为文件，以供 Pod 使用，而无需直接连接到 Kubernetes。Secret 卷由 tmpfs (一个 RAM 支持的文件系统) 支持，所以它们永远不会写入非易失性存储器。

ConfigMap 用来保存键值对形式的配置数据，这个数据可以在 Pod 里使用，或者被用来为像 Controller 一样的系统组件存储配置数据。虽然 ConfigMap 跟 Secret 类似，但是 ConfigMap 更方便的处理不含敏感信息的字符串。它很像 Linux 中的 /etc 目录，专门用来存储配置文件的目录。ConfigMaps 常用于以下场景：

- 设置环境变量的值
- 在容器里设置命令行参数
- 在数据卷里面创建 config 文件

![存储卷](/ae-job-pvc.png)

### 第五步：标签设置  

标签 (Label) 用于指定资源对应的一组或者多组标签。Label 以键值对的形式附加到任何对象上，定义好标签后，其他对象就可以通过标签来对对象进行引用，最常见的用法便是通过节点选择器来引用对象。一般来说，我们可以为一个 Pod (或其他对象) 定义多个标签，以便于配置、部署等管理工作。例如，部署不同版本的应用到不同的环境中；或者监控和分析应用 (日志记录、监控、报警等)。通过多个标签的设置，我们就可以多维度地对对象进行精细化管理。

![标签设置](/ae-job-label.png)

### 第六步：添加节点选择器

带有标签的对象创建好之后，我们就可以通过选择器 (Selector) 来引用这些对象。节点选择器页面，用户可以通过按节点选择或通过设置一组或者多组键值对来指定期望运行容器组的主机。比如给 Node 打上标签 “disktype=ssd”，然后给 Pod 添加选择器 “disktype=ssd”，那么该 Pod 将调度到标签为 “disktype=ssd” 的 Node 上。

![节点选择器](/job-node-selector.png)

点击创建，即可完成定时任务的创建，状态显示 “更新中” 是由于拉取镜像需要一定时间，待镜像 pull 成功后状态将显示 “运行中”。
