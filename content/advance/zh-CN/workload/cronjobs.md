---
title: "定时任务"
---

定时任务（CronJob），是基于时间的 Job，就类似于 Linux 系统的 crontab，在指定的时间周期运行指定的 Job，在给定时间点只运行一次或周期性地运行，执行完成后 Pod 便会停止。定时计划设置如每隔 1 min 执行一次任务：`*/1 * * * *`，定时计划的格式参考 [CRON](https://en.wikipedia.org/wiki/Cron)。

## 创建定时任务

登录 KubeSphere 控制台，进入 **工作台 → 项目 → 工作负载 → 定时任务**，进入定时任务列表页面。左上角为当前所在项目。如果是管理员登录，可以看到集群所有项目的定时任务情况，如果是普通用户，则只能查看授权项目下的定时任务。列表顶部显示了当前项目的定时任务 Pod 配额和数量信息。

### 第一步：填写基本信息

1.1. 点击 **创建** 按钮，将弹出创建定时任务的详情页。创建定时任务支持三种方式，**页面创建**，**导入 yaml 文件**，**编辑模式** 。以下主要介绍页面创建的方式，若选择以编辑模式，可点击右上角编辑模式进入代码界面，支持 yaml 和 json 格式，且支持下载配置文件。其中导入 yaml 文件方式会自动将 yaml 文件内容填充到页面上，用户根据需要可以在页面上调整后再行创建。编辑模式可以方便习惯命令行操作的用户直接在页面上编辑 yaml 文件并创建任务。

![创建任务 - 代码模式](/ae-cronjob-command.png)

基本信息页中，需要填写任务的名称和描述信息。

- 名称：为创建的任务起一个简洁明了的名称，便于用户浏览和搜索。
- 描述信息：简单介绍定时任务的主要特性，让用户进一步了解该定时任务。
- 定时计划：必需字段，指定任务的运行周期，格式同 [CRON](https://en.wikipedia.org/wiki/Cron)。

高级选项中，还可以对一些可选配置如并发策略、启动 Job 的期限、历史限制等进行设置。

- StartingDeadlineSeconds：启动 Job 的期限（秒级别），如果因为任何原因而错过了被调度的时间，那么错过执行时间的 Job 将被认为是失败的。如果没有指定，则没有期限。
- SuccessfulJobsHistoryLimit：允许保留的成功的任务个数。
- FailedJobsHistoryLimit：允许保留的失败的任务个数。
- ConcurrencyPolicy：并发策略，它指定了如何处理被 Cron Job 创建的 Job 的并发执行。只允许指定下面策略中的一种：
   - Allow（默认）：允许并发运行 Job。
   - Forbid：禁止并发运行，如果前一个还没有完成，则直接跳过下一个。
   - Replace：取消当前正在运行的 Job，用一个新的来替换。

![cronjob 基本信息](/ae-cronjob-basic.png)

### 第二步：任务设置

定时任务（CronJob）同时也具备任务（Job）的如下 Job Spec 格式，通过设置四个配置参数来设置 Job 的任务类型。

 Back Off Limit：失败尝试次数，若失败次数超过该值，则 Job 不会继续尝试工作；如设置为 4 则表示最多重试 4 次。
- Completions：标志任务结束需要成功运行的 Pod 个数，如设置为 6 则表示任务结束需要运行 6 个 Pod。
- Parallelism：标志并行运行的 Pod 的个数；如设置为 2 则表示并行 2 个 Pod。
- Active Deadline Seconds：标志失败 Pod 的重试最大时间，超过这个时间不会继续重试，且 ActiveDeadlineSeconds 优先级高于 Back Off Limit；如设置 500 则表示达到 500s 时 Job 即其所有的 Pod 都会停止。

![任务设置](/ae-cronjob-setting.png)

### 第三步：配置任务模板

任务模板即设置 Pod 模板，其中 [RestartPolicy](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) 指通过同一节点上的 kubelet 重新启动容器，仅支持 Never 或 OnFailure，当任务未完成的情况下：

- Never：任务会在容器组出现故障时创建新的容器组，且故障容器组不会消失。“.status.failed” 加 1。
- OnFailure：任务会在容器组出现故障时其内部重启容器，而不是创建新的容器组。“.status.failed” 不变。


Service Account 为 Pod 中的进程提供身份信息。例如，Pod 容器中的进程也可以与 apiserver 联系。 当它们在联系 apiserver 的时候，它们会被认证为一个特定的 Service Account（例如 default）。

任务需要基于镜像创建，用户首先需要在 KubeSphere 中添加镜像仓库，详见 [镜像仓库 - 创建镜像仓库](../ae-image-registry/#创建镜像仓库)。

下一步添加 Pod，容器组可以包含一个或者多个容器。点击 **添加容器**，输入容器的名称和对应的镜像名。如果用户有更进一步的需求，可以点击 **高级选项**。高级选项中可以对 CPU 和内存的资源使用进行限定。

**表1：CPU 配额说明**

|参数|说明|
|---|---|
|**requests**|容器使用的最小 CPU 需求，作为容器调度时资源分配的判断依赖。<br> 只有当节点上可分配CPU总量 ≥ 容器 CPU 申请数时，才允许将容器调度到该节点。|
|**limits**|容器能使用的 CPU 最大值，超过这个限定值，容器可能会被 kill。|

**表2：内存配额说明**

|参数|说明|
|---|---|
|**requests**|容器使用的最小内存需求，作为容器调度时资源分配的判断依赖。<br> 只有当节点上可分配内存总量 ≥ 容器内存申请数时，才允许将容器调度到该节点。|
|**limits**|容器能使用的内存最大值。当内存使用率超出设置的内存限制值时，该实例可能会被重启从而影响工作负载。|

在默认情况下，镜像会运行默认命令和参数，如果想运行特定命令或重写镜像默认值，可在高级选项的命令和参数中设置，此外还可以设置端口和环境变量。

- **命令**： 可自定义容器的启动命令，Kubernetes 的容器启动命令可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#run-a-command-in-a-shell)。
- **参数**： 可自定义容器的启动参数，Kubernetes 的容器启动的参数可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/)。
- **端口**： 即容器端口，用于指定容器需要暴露的端口，端口协议可以选择 TCP 和 UDP。
- **目标端口**： 在当前集群下的所有节点上打开一个真实的端口号，映射到容器端口。
- **环境变量**： 环境变量是指容器运行环境中设定的一个变量，与 Dockerfile 中的 “ENV” 效果相同，为创建的工作负载提供极大的灵活性。
- **引入配置中心**： Secret 或 ConfigMap 可用来保存键值对形式的配置数据，可用于设置环境变量的值。

上述配置信息填写完成以后，点击 **保存**。

### 第四步：存储卷设置

在存储卷页面可以添加 **持久化存储卷**， **临时存储卷** 和 **引用配置中心**。持久化存储卷可用于持久化存储用户数据，需要预先创建存储卷，参考 [存储卷 - 创建存储卷](../ae-pvc/#创建存储卷)。

临时存储卷是 [emptyDir](https://kubernetes.cn/docs/concepts/storage/volumes/#emptydir) 类型，随 Pod 被分配在主机上。当 Pod 从主机上被删除时，临时存储卷也同时会删除，存储卷的数据也将永久删除，容器崩溃不会从节点中移除 Pod，因此 emptyDir 类型的卷中数据在容器崩溃时是安全的。关于存储卷的更多解释参见 [存储卷管理](../ae-pv-management)。

引入配置中心支持配置 ConfigMap 或 Secret 中的值添加为卷，支持选择要使用的密钥以及将公开每个密钥的文件路径，最后设置目录在容器中的挂载路径。

[Secret](../../configuration/secrets) 用于将敏感信息（如密码）传递到 pod。您可以将 Secret 存储在 Kubernetes API 中，并将它们挂载为文件，以供 Pod 使用，而无需直接连接到 Kubernetes。 Secret 卷由 tmpfs（一个 RAM 支持的文件系统）支持，所以它们永远不会写入非易失性存储器。

[ConfigMap](../../configuration/configmaps) 用来保存键值对形式的配置数据，这个数据可以在 Pod 里使用，或者被用来为像 Controller 一样的系统组件存储配置数据。虽然 ConfigMap 跟 Secret 类似，但是 ConfigMap 更方便的处理不含敏感信息的字符串。它很像 Linux 中的 /etc 目录，专门用来存储配置文件的目录。ConfigMaps 常用于以下场景：

- 设置环境变量的值。
- 在容器里设置命令行参数。
- 在数据卷里面创建 config 文件。

### 第五步：标签设置

标签（Label）用于指定资源对应的一组或者多组标签。Label 以键值对的形式附加到任何对象上，定义好标签后，其他对象就可以通过标签来对对象进行引用，最常见的用法便是通过节点选择器来引用对象。一般来说，我们可以为一个 Pod（或其他对象）定义多个标签，以便于配置、部署等管理工作。例如，部署不同版本的应用到不同的环境中；或者监控和分析应用（日志记录，监控，报警等）。通过多个标签的设置，我们就可以多维度地对对象进行精细化管理。

### 第六步：添加节点选择器

带有标签的对象创建好之后，我们就可以通过选择器（Selector）来引用这些对象。节点选择器页面，用户可以通过按节点选择或通过设置一组或者多组键值对来指定期望运行容器组的主机。比如，给 Node 打上标签  “disktype=ssd”，然后给 Pod 添加选择器 “disktype=ssd”，那么，该 Pod 将调度到标签为 “disktype=ssd” 的 Node 上。

点击创建，即可完成定时任务的创建，状态显示 “更新中” 是由于拉取大小不同的镜像需要一定时间，待镜像 pull 成功后状态将显示“运行中”。



