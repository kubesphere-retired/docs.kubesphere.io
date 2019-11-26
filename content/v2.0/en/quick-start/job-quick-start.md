---
title: "Creating a Job to compute π to 2000 places"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

In actual work, we often need to process and analyze data in batch and execute jobs according to the time. The container technology in KubeSphere can help you. To be more specific, you can use Job and CronJob to execute, which is easier to maintain the clean execution environent and reduce the mutual interface of different job tools. At the same time, the dynamic scaling can be escuted on the cluster according to job requirement and resource status.

Job is responsible for batch jobs, namely it only excute the job once. The job has concurrent features and it can be abstracted to multiple Pods to run in parrallel. Such feature can ensure the successful completion of one or multiple Pods. In day-to-day work,

## Objective

This tutorial describes the basic features of a Job by creating a parallel job to perform a simple calculation and outputting PI to 2000 decimal. The job's basic functions will be explained.

## Prerequisites

- You need to create a workspace, project and `project-regular` account, see the [Getting Started with Multi-tenant Management](../admin-quick-start.md) if not yet.
- You need to sign in with `project-admin` account invite `project-regular` to enter into the corresponding project. Please refer to [Quick Start Guide of Multi-tenant Management-Inviting members](/docs/advanced-v2.0/zh-CN/quick-start/admin-quick-start/#%E9%82%80%E8%AF%B7%E6%88%90%E5%91%98)

## Estimated Time

About 15 minutes.

## Hands-on Lab

### Create a Job

Login the KubeSphere console with `project-regular`  `demo-project`, navigate to **Wordloads → Jobs**, then click **Create Job**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716210828.png#alt=)

#### Step 1: Fill in the basic information

Click **Create** and fill in the job's basic information. Then choose **Next**.

Here is the job's name and description.

- Name: Use a simple name for browsing and searching.
- Nickname: It can be any characters. Help you to distinguish resources.
- Description: Simply descript the repository-application job. Give users further knowledge about this job.

#### Step 2: Job Setting

Set the four configuration parameters of the Job Spec for the Job job type. Then click **Next**.

- Back Off Limit：Set to 5; Maximum retry count before mark the build job as failed;
- Completions：Set to 4 (default to 1); Expected number of completed build jobs;
- Parallelism：Set to 2 (default to 1); Expected maximum number of parallel build jobs;
- Active Deadline Seconds：Set to 200; The timeout of the running build jobs. Once a Job reaches its value, all of its running Pods are terminated and the Job status will become "Failed".

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716211839.png#alt=)

#### Step 3: Setting the Job Template

Leave the [RestartPolicy](https://kubernetes.io/docs/concepts/workloads/Pods/pod-lifecycle/#restart-policy) as **Never**, then click **Add Container**.

> Note: When RestartPolicy shows that the job is uncomplete:


- Never: The job will create a new container group when the errors occur and it will not disappear.
- OneFailure: The job will restart the container when the errors occur, instead of creating a new container group.

Next Click **Add Container**; put in the container's name `pi` and the according image name `perl`. Set the CPU and storage by default.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716212138.png#alt=)

Check the box of **Start Command**, add the following 4 lines of commands in sequence, that is, perform a simple calculation and outputting the Pi to 2000 decimal. Then choose **Next**.

```bash
# Command
perl
-Mbignum=bpi
-wle
print bpi(2000)
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716212547.png#alt=)

#### Step 4: Tag Setting

Skip the Volume Settings, then click **Next** to the tag setting. Tag is `app: job-demo`by default. No need to set node selector. Click **Create** to coplete the job. It can checked in the job list.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716212734.png#alt=)

## Verifying the Job Result

1. Enter into the `job-demo` and inspect the execution records, you can see it display "completed". There are 4 Pods completed, since the Completions was set to `4` in the Step 2.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716213402.png#alt=)

2. In the **Resource Status**, you can check the created container group. Since the Parallelism was set as 2, there are 2 container groups set before the job. Then it continued to create 2 other container groups. Finally 4 Pods will be created at the end of the Job.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716213505.png#alt=)

3. Click one of the container groups, e.g. `job-demo-bh5bc` to check the containers inside.

4. In the **Resource Status** page, click **Container Log** to check outputting page which display PI to 2000 decimal. Besides, you can click **Terminal** on the lef to excute the command inside of the container.


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716213657.png#alt=)

For now, you have learned Job's basic functions. For further details, please refer to [Job](/docs/advanced-v2.0/zh-CN/workload/jobs/)

