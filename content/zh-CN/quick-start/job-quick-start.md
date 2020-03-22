---
title: "创建任务计算圆周率"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

实际工作中，我们经常需要进行批量数据处理和分析，以及按照时间执行任务。可以在 KubeSphere 中使用容器技术完成，也就是使用 Job (任务) 和 CronJob (定时任务) 来执行。这样方便维护较为干净的执行环境，减少不同任务工具的相互干扰。同时可以在集群上按照任务要求和资源状况进行动态伸缩执行。

Job 负责批处理任务，即仅执行一次的任务。任务具有并发的特性，可以抽象成一个任务中的多个 Pod 并行运行，保证批处理任务的一个或多个 Pod 成功结束。平时也存在很多需要并行处理的场景，比如批处理程序，每个副本（Pod）都会从任务池中读取任务并执行，副本越多，执行时间就越短，效率就越高，类似这样的场景都可以用任务来实现。

## 目的

本文档以创建一个并行任务去执行简单的命令计算并输出圆周率到小数点后 2000 位作为示例，说明任务的基本功能。

## 前提条件

已创建了企业空间、项目和普通用户 `project-regular` 账号（该已账号已被邀请至示例项目），并开启了外网访问，请参考 [多租户管理快速入门](../admin-quick-start)。

## 视频教程

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/video/KS2.1_4-job-quick-start.mp4">
</video>


## 预估时间

约 15 分钟。

## 创建任务

1. 以项目普通用户 `project-regular` 登录 KubeSphere 控制台，在所属项目的左侧菜单栏，选择 **应用负载 → 任务**，点击 **创建任务**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027220600.png)

2. 参考如下提示填写任务的基本信息，完成后点击 **下一步**。


- 名称：为创建的任务起一个简洁明了的名称，便于用户浏览和搜索，如 job-demo。
- 别名：别名可以由任意字符组成，帮助您更好的区分资源，并支持中文名称。
- 描述：简单介绍应用仓库的任务，让用户进一步了解该任务。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027220839.png)

3. 任务设置页中，通过设置 Job Spec 的四个配置参数来设置 Job 的任务类型，完成后点击 **下一步**。

- Back Off Limit：输入 5，失败尝试次数，若失败次数超过该值，则 Job 不会继续尝试工作；如此处设置为 5 则表示最多重试 5 次。
- Completions：输入 4，标志任务结束需要成功运行的 Pod 个数，如此处设置为 4 则表示任务结束需要运行 4 个 Pod。
- Parallelism：输入 2，标志并行运行的 Pod 的个数；如此处设置为 2 则表示并行 2 个 Pod。
- Active Deadline Seconds：输入 300，指定 Job 可运行的时间期限，超过时间还未结束，系统将会尝试进行终止，且 ActiveDeadlineSeconds 优先级高于 Back Off Limit；如此处设置 300 则表示如果超过 300s 后 Job 中的所有 Pod 运行将被终止。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027220922.png)

> 说明：
> [重启策略 (RestartPolicy)](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) 指通过同一节点上的 kubelet 重新启动容器，支持 Never 或 OnFailure。RestartPolicy 表示当任务未完成的情况下：
> - Never：任务会在容器组出现故障时创建新的容器组，且故障容器组不会消失。
> - OnFailure：任务会在容器组出现故障时在其内部重启容器，而不是创建新的容器组。


4. 下一步点击 **添加容器镜像**，镜像名输入 `perl`，然后按回车键或点击 DockerHub。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027221223.png)

5. 勾选 **启动命令**，依次添加如下四段命令（每一段命令以 "," 隔开），即让每一个 Job 执行输出圆周率小数点后 2000 位。如下设置完成后点击 `√`，然后选择 **下一步**。

```bash
# 命令
perl,-Mbignum=bpi,-wle,print bpi(2000)
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027221506.png)


6. 本示例暂不需要设置存储卷，可以跳过此步骤，点击 **下一步**，无需挂载存储，点击 **下一步 → 创建**，任务创建成功，可在任务列表页查看。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027221638.png)

## 验证任务结果

1. 点击该任务 `job-demo` 查看执行记录，可以看到任务执行的结果状态是 "已完成(4/4)"，并且一共运行了 4 个 Pod，这是因为在第二步 Completions 设置为 4。

> 提示：若提示 “失败 (3/4)” 这是由于镜像创建较慢导致在指定的 "Active Deadline Seconds" 时间内没有完全创建，可点击重新执行继续该计算任务。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027222417.png)


2. 在任务详情页的 **资源状态**，可以查看任务执行过程中创建的容器组。由于 Parallelism 设置为 2，因此任务将预先并行地创建 2 个容器组，然后再继续并行创建 2 个容器组，任务结束时将创建 4 个容器组，

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027222321.png)

> 提示：在事件（Events）中也可以通过创建时间来验证以上 4 个容器组是在两个不同的时间点，两两并行开始执行创建任务的。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027222910.png)


3. 在 **资源状态** 页，展开其中任意一个容器组（Pod），点击 **容器日志**，即可进入容器查看 pi 容器中命令计算圆周率到小数点后 2000 位的输出结果。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027222152.png)

至此，您已经熟悉了任务 (Job) 的基本功能使用，关于任务的各项参数释义详见 [任务](../../workload/jobs)。
