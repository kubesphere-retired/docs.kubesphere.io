---
title: "Alert policy —— workload level"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## Objective

KubeSphere provides nodes and workload level alert policy and ordinary users can set workload level alert policy in the project. This guidebook will create a workload level alert policy and send notification email as an example. Here is to guide users to set workload level alert policy in projects.

## Hand-on example

### Prerequisites

- Cluster managers need to set email server in the first place. Otherwise, please refer to [Email server](../../platform-settings/email-server)；
- Project-regular account and workspace are needed. Otherwise, please refer to [Multi-tenant management fast guide](../../quick-start/admin-quick-start)；
- Workload is needed in the project. Otherwise, select 「Deployment sample application Bookinfo」 from 「Application」→「New deployment application」 to deploy an application immediately.

<!-- <video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/video/kubesphere%20%E5%91%8A%E8%AD%A6.mov">
</video> -->

### Step 1: Add alert policies

Login KubeSphere with `project-regular` account. Enter into sample project demo-namespace and select 「Monitoring Alarm」→「Alert policy」. Click 「Add policy」.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190430100932.png)

### Step 2: Fill in basic information

In the pop-up window, refer to the following detailed information. Click 「Next」 after completion.

- Name: Use a simple name for the alert policy for user browse and search;
- Nickname: Nicknames can help you distribute resources better；
- Description: Briefly introduce the alert policy.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190430101057.png)

### Step 3: Select monitoring targets

Monitor targets support three workloads including deployment, stateful replica set and daemon. Select **deployment** and select reviews-v1 and details-v1 as monitoring targets. The click 「Next」.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190430101829.png)

### Step 4: Add alert policies

Click 「Add policy」. The sample here sets **Memory utilization** as alert indexes. The monitoring cycle is **1 minute/ cycle** and select **twice continuously**. Set the memory utilization threshold as **> 20 MiB** and set the level as important alert. The setting rule is shown as follows:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190430104015.png)

> Note：
> The workload alert policy is as below:
> - CPU usage；
> - Memory usage (including cache)；
> - Memory usage；
> - Network: Network's data sending rate and data receiving rate;
> - Workload index: Deploy copy unavailability rate, stateful replica set replica unavailability rate and daemon set unavailability rate (Workload copy unavailability rate: if Ngix's 5 copies of deployment run properly, the copies' status is 5/5. If the deployment unavailability rate is over 20%, the alert message will be sent when the copy's status is 4/5.)


Click 「Save」 after completion and then click 「Next」.

### Step 5: Set notification rules

1. You can set notification email time scale by setting the notifying valid time such as `09:00 ~ 19:00`. Currently, the email notification is available. You can add members' email addresses in the notification list.

2. The repetitive rule configures notification sending cycle and repetitive frequency. If the alert has not been solved for some time, the alerts will be sent repetitively. For different levels of alerts, different repetitive rules can be configured. Since the alarm level set in the previous step is important, the rule should be chosen is **alarm every 5 minutes and 3 times is the maximum**. Please refer to the following screenshots to set notification rules:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190417182721.png)

3. Click 「Create」. You can see the sample alert policy has been set successfully.

> Note: The alert waiting time = checking cycle x times. For example, when the check cycle is **1 minute/cycle**, for twice continuously, the waiting time is 2 minutes.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190430113250.png)

### Step 6: Check the alert policy

After setting the alert policy, click `alert-demo` to access alert policy page. Check the policy details, the current status and detailed information about monitoring targets, notification rules and alert calendar, etc.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190430113351.png)

Click 「More actions」 → 「Change status」to start or stop the alert policy.
