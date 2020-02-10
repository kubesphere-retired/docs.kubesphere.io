---
title: "Creating a Job to compute π to 2000 places"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

 A Job creates one or more Pods and ensures that a specified number of them successfully terminate. You can also use a Job to run multiple Pods in parallel. For example, we often process and analyze data in batch, thus we can create a job in this scenario.

## Objective

This tutorial describes the basic features of a Job by creating a parallel job to compute π to 2000 places and print it out.

## Prerequisites

- You need to create a workspace, project and "project-regular" account respectively, see the [Getting Started with Multi-tenant Management](../admin-quick-start.md) if not yet.
- You need to sign in with `project-admin` account and invite `project-regular` to enter the corresponding project. Please refer to [Quick Start Guide of Multi-tenant Management-Inviting members](/docs/advanced-v2.0/zh-CN/quick-start/admin-quick-start/#%E9%82%80%E8%AF%B7%E6%88%90%E5%91%98)

## Estimated Time

About 15 minutes

## Hands-on Lab

### Create a Job

Log in the KubeSphere console with `project-regular` account, then enter a project, navigate to **Application Wordloads → Jobs**, then click **Create Job**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205204716.png)

#### Step 1: Fill in the basic information

Fill in the basic information, e.g. "job-demo" as its name. Then choose **Next**.

#### Step 2: Job Settings

Set the four configuration parameters of the Job Spec as the following shown.

- Back Off Limit：Set to 5; Specifies the number of retries before the build job failed;
- Completions：Set to 4 (default to 1); Expected number of completed build jobs;
- Parallelism：Set to 2 (default to 1); Expected maximum number of parallel build jobs;
- Active Deadline Seconds：Set to 300; The timeout of the running build jobs. Once a Job reaches its value, all of its running Pods are terminated and the Job status will become "Failed".


then click **Next** when you've done.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205211021.png)

#### Step 3: Setting the Job Template

Leave the [RestartPolicy](https://kubernetes.io/docs/concepts/workloads/Pods/pod-lifecycle/#restart-policy) as **Never**, then click **Add Container Image**.


> - Never: The job will create a new container group when the errors occur and it will not disappear.
> - OneFailure: The job will restart the container when the errors occur, instead of creating a new container group.

Enter `perl` in the image name, then scroll down to **Start Command**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205225230.png)

Click **Start Command**, add the following command, that is, perform a simple calculation and output the Pi to 2000 places. Then click **√** to save it and  choose **Next** to finish this step.

```bash
# Start Command
perl,-Mbignum=bpi,-wle,print bpi(2000)
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205225435.png)

Click **Next**, then skip the Volume Settings. Click **Create** to complete job creation.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205225718.png)

## Verifying the Job Result

1. Enter the `job-demo` and inspect the execution records. You can see it displays "completed". There are four Pods completed, since the Completions was set to `4` in the Step 2.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205230222.png)

2. In the **Resource Status**, you can inspect the Pod status. Since the Parallelism was set to 2, there are two Pods created in the first batch. Then it continues to create two more Pods. Finally four Pods will be created at the end of the Job.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205230003.png)

> Tips: Since the creation of the container may encounter timed out, if the job fails, click **··· → Rerun** from the list to rerun this job.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205230541.png)


3. In the **Resource Status** tap, expand one of its Pod, then click into **Container Log** to inspect the container logs which display the calculation result, i.e. PI to 2000 places.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205230919.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716213657.png#alt=)

Congratulation! You have learned Job's basic functions. For further details, please refer to [Jobs - Run to Completion](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/).
