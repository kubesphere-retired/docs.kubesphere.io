---
title: "Create a Job to Calculate PI to 2000 Decimal"
---

<!-- ## 目的

本文档以创建一个并行任务去执行简单的命令计算并输出圆周率到小数点后 2000 位作为示例，说明任务的基本功能。

## 前提条件

已创建了企业空间和项目，若还未创建请参考 [管理员快速入门](../../quick-start/admin-quick-start)。

## 预估时间

约 15 分钟。 -->

## Target

This tutorial describes the basic features of a Job by creating a parallel task to perform a simple calculation and outputting PI to 2000 decimal as an example.

## Prerequisites

- You need to create a workspace and project, see the [Admin Quick Start](../admin-quick-start) if not yet.
- You need to sign in with `project-regular` and enter into the corresponding project.

## Estimated Time

About 10 minutes.

## Example
<!-- 
## 操作示例

### 示例视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docsvideo.gd2.qingstor.com/demo3-job.mp4">
</video> -->
<!-- 
### 创建任务

登录 KubeSphere 控制台，在所属项目的左侧菜单栏，选择 **工作负载 → 任务**，进入任务列表页面。

![创建任务](/demo3-create-job.png)

#### 第一步：填写基本信息

点击 **创建任务**，填写任务的基本信息，完成后点击 **下一步**。

基本信息页中，需要填写任务的名称和描述信息。

- 名称：为创建的任务起一个简洁明了的名称，便于用户浏览和搜索。
- 别名：别名可以由任意字符组成，帮助您更好的区分资源，并支持中文名称。
- 描述：简单介绍应用仓库的任务，让用户进一步了解该任务。

![填写基本信息](/ae-demo-job1.png) -->

### Create a Job

Enter into the project, navigate to **Wordloads → Jobs**, then click **Create**.

![创建任务](/demo3-create-job-en.png)

#### Step 1: Basic information

Fill in the basic information, e.g. `Name : job-demo`. Then choose **Next** when you're done. 

![填写基本信息](/demo3-job-basic-en.png)

<!-- #### 第二步：任务设置

任务设置页中，通过设置 Job Spec 的四个配置参数来设置 Job 的任务类型，完成后点击 **下一步**。

- Back Off Limit：默认为 6，失败尝试次数，若失败次数超过该值，则 Job 不会继续尝试工作；如此处设置为 5 则表示最多重试 5 次。
- Completions：默认为 1，标志任务结束需要成功运行的 Pod 个数，如此处设置为 4 则表示任务结束需要运行 4 个 Pod。
- Parallelism：默认为 1，标志并行运行的 Pod 的个数；如此处设置为 2 则表示并行 2 个 Pod。
- Active Deadline Seconds：指定 Job 可运行的时间期限，超过时间还未结束，系统将会尝试进行终止，且 ActiveDeadlineSeconds 优先级高于 Back Off Limit；如此处设置 100 则表示超过 100s 后 Job 中的所有 Pod 运行将被终止。

![任务设置](/demo-job-setting.png) -->

#### Step 2: Job Settings

Fill the job settings with the following values of the screenshot.

- Back Off Limit：set to 5 (default to 6); Maximum retry count before mark the build task as failed; 
- Completions：set to 4 (default to 1); Expected number of completed build tasks;
- Parallelism：set to 2 (default to 1); Expected maximum number of parallel build tasks;
- Active Deadline Seconds：set to 200; The timeout of the running build tasks.

![任务设置](/demo-job-setting-en.png)

<!-- #### 第三步：配置任务模板

任务模板即设置 Pod 模板，其中 [RestartPolicy](https://kubernetes.io/docs/concepts/workloads/Pods/pod-lifecycle/#restart-policy) 指通过同一节点上的 kubelet 重新启动容器，仅支持 Never 或 OnFailure，此处 RestartPolicy 选择 **Never**。

> 说明：
> RestartPolicy 表示当任务未完成的情况下：
> - Never：任务会在容器组出现故障时创建新的容器组，且故障容器组不会消失。
> - OnFailure：任务会在容器组出现故障时其内部重启容器，而不是创建新的容器组。 -->

#### Step 3: Pod Template

Leave the [RestartPolicy](https://kubernetes.io/docs/concepts/workloads/Pods/pod-lifecycle/#restart-policy) as **Never**, then click **Add Container**.

<!-- ![重启策略](/demo3-job-restartpolicy.png)

下一步点击 **添加容器**，输入容器的名称 `pi` 和对应的镜像名 `perl`。CPU 和内存此处暂不作限定，将使用在创建项目时指定的默认值。

点击 **高级选项**，然后点击 **添加命令**，依次添加如下四行命令，即让每一个 Job 执行输出圆周率小数点后 2000 位。设置完成后点击 **保存**，然后选择 **下一步**。

```bash
# 命令
perl
-Mbignum=bpi
-wle
print bpi(2000)
```

![镜像设置](/job-demo-container.png) -->

Fill in the Pod Template, Container Name can be customized by the user, fill in the image with `perl`, other blanks could be remained default values.

Choose **Advanced Options**.

Then click **Add Command**, add the following four lines of commands in sequence, that is, perform a simple calculation and outputting the Pi to 2000 decimal.

```bash
# Command
perl
-Mbignum=bpi
-wle
print bpi(2000)
```

Then choose **Save** and click **Next** when you're done.

![镜像设置](/job-demo-container-en.png) 

<!-- #### 第四步：标签设置

本示例暂不需要设置存储卷，可以跳过此步骤，点击 **下一步** 进入标签设置。标签（Label）用于指定资源对应的一组或者多组标签，便于标识和管理对象，这里的标签设置为 `app : job-demo`，无需设置节点选择器，点击 **创建**，任务创建成功，可在任务列表页查看。

![任务创建成功](/demo3-job-list.png) -->

#### Step 4: Label Settings

Skip the Volume Settings and click **Next** to the **Label Settings**. We simply keep the default label settings as `app: job-demo`.

Then choose **Create** when you're done.

![任务创建成功](/demo3-job-list-en.png)

<!-- ### 验证任务结果

1、点击该任务 `job-demo` 查看执行记录，可以看到任务执行的结果状态是 "已完成"，并且一共运行了 4 个 Pod，这是因为在第二步 Completions 设置为 4。

![任务记录](/demo3-job-execution-record.png)

2、在任务详情页的 **资源状态**，可以查看任务执行过程中创建的容器组。由于 Parallelism 设置为 2，因此任务将预先并行地创建 2 个容器组，然后再继续并行创建 2 个容器组，任务结束时将创建 4 个容器组，

![任务详情](/demo3-job-creation-details.png)

3、点击其中一个容器组，比如 `job-demo-5slt4`，查看该容器组中的容器。

![任务容器详情](/demo3-job-container.png)

4、在 **资源状态** 页，进一步点击该容器然后在 **容器日志** 的 Tab 下，查看 pi 容器中命令计算圆周率到小数点后 2000 位的输出结果。另外，可点击左侧的 **终端** 进入容器内部执行命令。

![查看容器日志](/demo3-container-log.png)

至此，您已经熟悉了任务 (Job) 的基本功能使用，关于任务的各项参数释义详见 [任务](../../workload/jobs)。 -->

### Verify

1. Enter into the `job-demo` and view the execution records, we can see it displays "completed (4/4)" and there were four Pods completed running, since the `completions` are set to four in the Step 2.

![任务记录](/demo3-job-execution-record-en.png)

2. Change to the **Resource Status**, we can easily find that there were 4 Pods generated by the `job-demo`. Since the **Parallelism** is set to 2, the Job will create 2 Pods in advance, then continue to create 2 Pods in parallel, finally 4 Pods will be created at the end of the Job.

![任务详情](/demo3-job-creation-details-en.png)

3. View one of the Pod, e.g. `job-demo-7vkcz`, then click `Container Logs` to view its container logs. 

![任务容器详情](/demo3-job-container-en.png)

4. Then you will be able to see the container logs outputting page which display PI to 2000 decimal.

![查看容器日志](/demo3-container-log-en.png)


