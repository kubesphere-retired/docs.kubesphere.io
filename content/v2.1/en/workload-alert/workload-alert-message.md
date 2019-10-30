---
title: "Alarm —— workload class"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

The alert message records all the alert message that meets the workload level alert policies. The file of [Alarm strategy —— alarm workload level](../workload-alert-policy) demonstrates how to create a workload level alert policy, send an email notification and record the alert message from all platforms in the alert message list. From the list managers can check alarm details, monitor indexes, edit alarm policy, latest notification and make suggestions, etc.

## Prerequisites

Build the alert policy and receive alert message at first. Otherwise, please refer to [Alert policy —— alarm workload level](../workload-alert-policy).

## Check warnings

1. Login KubeSphere with the account of project-regular. Enter into the project of demo-namespace and select 「Monitoring alarms」→ 「alert message」.

2. Click 「alert message」and check **all** the alert message from the list. Since we have set the monitoring target as reviews-v1 and details-v1 in the alert policy sample, and the two sample workloads' memories are larger than the alarm's threshold as 20 MiB, the 2 alert message according to the monitoring targets can be seen in the alert message list.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190430153418.png)

3. Click one of the alert message to the details page. Check monitored workload memories in the alarm details. You can find that the monitored target's memories have been higher than the 20 MiB for some time, which triggered the alarm.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190430150116.png)

## Strategies for warning checking

Switch to 「Alert policy」 to check the alert policy for this alarm. You can find the triggering rule of the workload's alert policy was set in the previous workload alert policy sample.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190430150247.png)

## Check latest notification

 Click 「Latest Notification」. You can see the three received alarms. This is because the workload's memories have passed the thresholds twice and the notification policy is **Alarm every 5 minuets and 3 notification is the maximum**.  

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190430150346.png)

### Verification email notification

Login the notification email-box to see the alarms sent by KubeSphere's email server. The sample email-box received 6 emails because the 2 workloads memory utilizations set by the alert policy has overpassed the threshold **20 MiB** **twice continuously**. The alert policy was set as **Alarm every 5 minuets and 3 notification is the maximum**.  

## Add processing comments

Click 「Processing comments」 to process current alarms and add comments. For an example, since the current alarm workload's memory is higher than the threshold, we can add a message in the processing comment window, which is **the maximum memories in the deployment needs to be raised**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190418100512.png)
