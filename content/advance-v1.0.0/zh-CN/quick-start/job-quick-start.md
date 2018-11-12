---
title: "快速入门 - 创建任务"
---

实际工作中，我们经常需要进行批量数据处理和分析，以及按照时间进行调度执行。可以在 KubeSphere 中使用容器技术完成，也就是使用 Job (任务) 和 CronJob (定时任务) 来执行。这样方便维护较为干净的执行环境，减少不同任务工具的相互干扰。同时可以在集群上按照任务要求和资源状况进行动态伸缩执行。

Job 负责批处理任务，即仅执行一次的任务，它保证批处理任务的一个或多个 Pod 成功结束。本文档以创建一个任务并分别执行简单的命令输出作为示例，说明任务的基本功能。

## 创建任务

登录 KubeSphere 控制台，进入 **工作台 → 项目 → 工作负载 → 任务**，进入任务列表页面。

### 第一步：填写基本信息

1.1. 点击 **创建**，填写任务的基本信息。

基本信息页中，需要填写任务的名称和描述信息。

- 名称：为创建的任务起一个简洁明了的名称，便于用户浏览和搜索。
- 别名：别名可以由任意字符组成，帮助您更好的区分资源，并支持中文名称。
- 描述：简单介绍应用仓库的任务，让用户进一步了解该任务。

![填写基本信息](/ae-demo-job1.png)

### 第二步：任务设置

任务设置页中，通过设置 Job Spec 的四个配置参数来设置 Job 的任务类型。

- Back Off Limit：失败尝试次数，若失败次数超过该值，则 Job 不会继续尝试工作；如此处设置为 5 则表示最多重试 5 次。
- Completions：标志任务结束需要成功运行的 Pod 个数，如此处设置为 10 则表示任务结束需要运行 10 个 Pod。
- Parallelism：标志并行运行的 Pod 的个数；如此处设置为 5 则表示并行 5 个 Pod。
- Active Deadline Seconds：标志失败 Pod 的重试最大时间，超过这个时间不会继续重试，且 ActiveDeadlineSeconds 优先级高于 Back Off Limit；如此处设置 20 则表示达到 20s 时 Job 即其所有的 Pod 都会停止。

![任务设置](ae-demo-job2.png)

### 第三步：配置任务模板

任务模板即设置 Pod 模板，其中 [RestartPolicy](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) 指通过同一节点上的 kubelet 重新启动容器，仅支持 Never 或 OnFailure，此处选择 **Never**。当任务未完成的情况下：

- Never：任务会在容器组出现故障时创建新的容器组，且故障容器组不会消失。“.status.failed” 加 1。
- OnFailure：任务会在容器组出现故障时其内部重启容器，而不是创建新的容器组。“.status.failed” 不变。

**Service Account** 为 Pod 中的进程提供身份信息。例如，Pod 容器中的进程也可以与 apiserver 联系。 当它们在联系 apiserver 的时候，它们会被认证为一个特定的 Service Account（例如 default）。

注意，任务需要基于镜像创建，用户首先需要在 KubeSphere 中添加镜像仓库，详见 [镜像仓库 - 创建镜像仓库](../../platform-management/image-registry/#创建镜像仓库)。

下一步添加 Pod，容器组可以包含一个或者多个容器。点击 **添加容器**，输入容器的名称 `hello` 和对应的镜像名 `busybox`。点击 **高级选项**，添加两行命令：`echo` 和 `Hello KubeSphere`，即让每一个 Job 执行标准输出，若成功执行可通过 `Kubectl logs job-name` 查看输出，设置完成后点击 **保存**。

![镜像设置](ae-demo-job3.png)

