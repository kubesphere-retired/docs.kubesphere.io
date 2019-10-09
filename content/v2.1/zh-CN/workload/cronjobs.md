---
title: "定时任务"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

定时任务 (CronJob)，是基于时间的 Job，就类似于 Linux 系统的 crontab，在指定的时间周期运行指定的 Job，在给定时间点只运行一次或周期性地运行，执行完成后 Pod 便会停止。定时计划设置可设置任务的执行周期，比如每隔 1 min 执行一次任务：`*/1 * * * *`，定时计划的格式参考 [CRON](https://en.wikipedia.org/wiki/Cron)。

## 创建定时任务

登录 KubeSphere 控制台，在已创建的项目下，进入 **工作负载 → 定时任务**，进入定时任务列表页面，左上角为当前所在项目。如果是管理员登录，可以看到集群所有项目的定时任务情况，如果是普通用户，则只能查看授权项目下的定时任务。列表顶部显示了当前项目的定时任务 Pod 配额和数量信息。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514093407.png)

### 第一步：填写基本信息

1.1. 点击 **创建定时任务**，将弹出创建定时任务的详情页。创建定时任务支持三种方式，**页面创建**，**导入 yaml 文件**，**编辑模式** 。以下主要介绍页面创建的方式，若选择以编辑模式，可点击右上角编辑模式进入代码界面，支持 yaml 和 json 格式，且支持下载配置文件。其中导入 yaml 文件方式会自动将 yaml 文件内容填充到页面上，用户根据需要可以在页面上调整后再行创建。编辑模式可以方便习惯命令行操作的用户直接在页面上编辑 yaml 文件并创建任务。

![创建任务 - 代码模式](/ae-cronjob-command.png)

基本信息页中，需要填写任务的名称和描述信息。

- 名称：为创建的定时任务起一个简洁明了的名称，便于用户浏览和搜索。
- 别名：帮助您更好的区分资源，并支持中文名称。
- 描述信息：简单介绍定时任务的主要特性，让用户进一步了解该定时任务。
- 定时计划：必需字段，指定定时任务的运行周期，格式同 [CRON](https://en.wikipedia.org/wiki/Cron)。

点击 **高级选项**，还可以对一些可选配置如并发策略、启动 Job 的期限、保留历史等进行设置。

- 启动 Job 的期限 (StartingDeadlineSeconds)：启动 Job 的期限 (秒级别)，如果因为任何原因而错过了被调度的时间，那么错过执行时间的 Job 将被认为是失败的。如果没有指定，则没有期限。
- 保留完成 Job 数 (SuccessfulJobsHistoryLimit)：允许保留的成功的任务个数。
- 保留失败 Job 数 (FailedJobsHistoryLimit)：允许保留的失败的任务个数。
- 并发策略 (ConcurrencyPolicy)：并发策略，它指定了如何处理被 CronJob 创建的 Job 的并发执行。只允许指定下面策略中的一种：
   - Allow ：允许并发运行 Job。
   - Forbid (默认)：禁止并发运行，如果前一个还没有完成，则直接跳过下一个。
   - Replace：取消当前正在运行的 Job，用一个新的来替换。

完成后点击 **下一步**。

![cronjob 基本信息](/ae-cronjob-basic.png)

### 第二步：任务设置

定时任务 (CronJob) 同时也具备任务 (Job) 的如下 Job Spec 格式，通过设置四个配置参数来设置 Job 的任务类型。

 Back Off Limit：失败尝试次数，若失败次数超过该值，则 Job 不会继续尝试工作；如设置为 4 则表示最多重试 4 次。
- Completions：标志任务结束需要成功运行的 Pod 个数，如设置为 6 则表示任务结束需要运行 6 个 Pod。
- Parallelism：标志并行运行的 Pod 的个数；如设置为 2 则表示并行 2 个 Pod。
- Active Deadline Seconds：标志失败 Pod 的重试最大时间，超过这个时间不会继续重试，且 ActiveDeadlineSeconds 优先级高于 Back Off Limit；如设置 500 则表示达到 500s 时 Job 即其所有的 Pod 都会停止。

![任务设置](/ae-cronjob-setting.png)

### 第三步：配置任务模板

3.1. 任务模板即设置 Pod 模板，其中 [重启策略 (RestartPolicy)](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) 指通过同一节点上的 kubelet 重新启动容器，仅支持 Never 或 OnFailure，当任务未完成的情况下：

- Never：任务会在容器组出现故障时创建新的容器组，且故障容器组不会消失，返回的字段 “.status.failed” 加 1。
- OnFailure：任务会在容器组出现故障时其内部重启容器，而不是创建新的容器组，返回的字段 “.status.failed” 不变。

3.2. 点击 **添加容器**，然后根据需求添加容器镜像，容器中定义的镜像默认从 Docker Hub 中拉取。输入容器的名称和对应的镜像名，镜像名一般需要指定 tag，比如 perl:5.28。

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

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514093547.png)

3.3. 如果用户有更进一步的需求，可下滑至服务设置和高级设置部分。


- **服务设置**： 即设置容器的访问策略，指定容器需要暴露的端口并自定义端口名称，端口协议可以选择 TCP 和 UDP。
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

上述配置信息填写完成以后，点击 **保存**，然后点击 **下一步**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514093746.png)


### 第四步：存储卷设置

在存储卷页面可以添加以下三类存储卷：

#### 持久化存储卷

持久化存储卷可用于持久化存储用户数据，需要预先创建存储卷，参考 [存储卷 - 创建存储卷](../../storage/pvc)。

#### 临时存储卷

临时存储卷是 [emptyDir](https://kubernetes.cn/docs/concepts/storage/volumes/#emptydir) 类型，随 Pod 被分配在主机上。当 Pod 从主机上被删除时，临时存储卷也同时会删除，存储卷的数据也将永久删除，容器崩溃不会从节点中移除 Pod，因此 emptyDir 类型的卷中数据在容器崩溃时是安全的。

#### 引用配置中心

引入配置中心支持配置 ConfigMap 或 Secret 中的值添加为卷，支持选择要使用的密钥以及将公开每个密钥的文件路径，最后设置目录在容器中的挂载路径。

[Secret](../../configuration/secrets) 用于将敏感信息 (如密码) 传递到 pod。您可以将 Secret 存储在 Kubernetes API 中，并将它们挂载为文件，以供 Pod 使用，而无需直接连接到 Kubernetes。Secret 卷由 tmpfs (一个 RAM 支持的文件系统) 支持，所以它们永远不会写入非易失性存储器。

[ConfigMap](../../configuration/configmaps) 用来保存键值对形式的配置数据，这个数据可以在 Pod 里使用，或者被用来为像 Controller 一样的系统组件存储配置数据。虽然 ConfigMap 跟 Secret 类似，但是 ConfigMap 更方便的处理不含敏感信息的字符串。它很像 Linux 中的 /etc 目录，专门用来存储配置文件的目录。ConfigMaps 常用于以下场景：

- 设置环境变量的值
- 在容器里设置命令行参数
- 在数据卷里面创建 config 文件

![存储卷设置](/ae-cronjob-pvc.png)

### 第五步：标签设置

标签 (Label) 用于指定资源对应的一组或者多组标签。Label 以键值对的形式附加到任何对象上，定义好标签后，其他对象就可以通过标签来对对象进行引用，最常见的用法便是通过节点选择器来引用对象。一般来说，我们可以为一个 Pod (或其他对象) 定义多个标签，以便于配置、部署等管理工作。例如，部署不同版本的应用到不同的环境中；或者监控和分析应用 (日志记录、监控、报警等)。通过多个标签的设置，我们就可以多维度地对对象进行精细化管理。

![标签](/ae-cronjob-label.png)

### 第六步：添加节点选择器

带有标签的对象创建好之后，我们就可以通过选择器 (Selector) 来引用这些对象。节点选择器页面，用户可以通过按节点选择或通过设置一组或者多组键值对来指定期望运行容器组的主机。比如，给 Node 打上标签 “disktype=ssd”，然后给 Pod 添加选择器 “disktype=ssd”，那么，该 Pod 将调度到标签为 “disktype=ssd” 的 Node 上。

![节点选择器](/cronjob-node-selector.png)

点击创建，即可完成定时任务的创建，状态显示 “更新中” 是由于拉取镜像需要一定时间，待镜像 pull 成功后状态将显示“运行中”。



