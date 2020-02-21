---
title: "Creating Horizontal Pod Autoscaler for Deployment"
keywords: 'kubesphere, kubernetes, docker, HPA, Horizontal Pod Autoscaler'
description: 'How to scale deployment replicas using horizontal Pod autoscaler'
---


The Horizontal Pod Autoscaler (HPA) automatically scales the number of pods in a deployment based on observed CPU utilization or memory usage. The controller periodically adjusts the number of replicas in a deployment to match the observed average CPU utilization or memory usage to the target value specified by user.

## How does the HPA work

The Horizontal Pod Autoscaler is implemented as a control loop with a period of 30 seconds by default controlled by the controller manager HPA sync-period flag. For per-pod resource metrics like CPU, the controller fetches the metrics from the resource metrics API for each pod targeted by the Horizontal Pod Autoscaler. See [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) for more details.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716214909.png#alt=)

## Objective

This document walks you through an example of configuring Horizontal Pod Autoscaler for the hpa-example deployment.

We will create a deployment to send an infinite loop of queries to the hpa-example application, demonstrating its autoscaling function and the HPA principle.

## Estimate Time

About 25 minutes

## Prerequisites

- You need to [enable HPA](../../installation/install-metrics-server)
- You need to create a workspace, a DevOps project, and a **project-regular** user account, and this account needs to be invited into a DevOps project, please refer to [Get started with multi-tenant management](../admin-quick-start).

## Hands-on Lab

### Task 1: Create a Deployment

1.1. Log in with `project-regular` account. Enter `demo-project`, then select **Application Workloads → Workloads → Deployments** and click **Create Deployment** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200220224148.png)

1.2. Fill in the basic information in the pop-up window. e.g. name it `hpa-example`, then click **Next**.

### Task 2: Create Stateless Service

2.1. Log in with `project-regular` account. Enter `demo-project`, then select **Application Workloads → Service**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221075410.png)

2.2.  Click **Create Service** and choose **Stateless service**, name it `hpa`, then click **Next**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221075509.png)

2.3. Click on the `Add Container Image`, then input `mirrorgooglecontainers/hpa-example`and press `return` key, it will automatically search and load the image information, choose `Use Default Ports`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221075857.png)

2.4. Choose **√** to save it, click **Next**. There is no need to set **Mount Volomes** and **Advanced Settings**, thus we skip these two steps and click **Create**. At this point, the stateless service `hpa` has been created successfully.

> Note: At the same time, the corresponding Deployment and Service have been created in Kubernetes.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221080648.png)

### Task 3: Configure HPA

3.1. Choose **Workloads → Deployment**, then enter `hpa` to view its detailed page.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221081356.png)

3.2. Choose **More → Horizontal Pod Autoscaler**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221081517.png)

3.3. Give some sample values for HPA configuration as follows:

- CPU Request Target(%): `50` (represents the percent of target CPU utilization)
- Min Replicas Number: `1`
- Max Replicas Number: `10`

> Note: After setting HPA for Deployment, it will create a `Horizontal Pod Autoscaler` in Kubernetes for autoscaling.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221083958.png)

### Task 4: Create Load-generator

4.1. In the current project, navigate to **Workloads**. Click **Create** and fill in the basic information in the pop-up window, name it `load-generator`, click **Next**.

4.2. Click on the **Add Container Image**, enter `busybox` into Image edit box, and press `return` key.



4.3. Scroll down to **Start command**. Add commands and parameters as follows, these commands are used to request hpa service and create CPU load:

> Note: You need to replace the following http address with the actual name of service and project.

```
# Run cammand
sh,-c

# Parameters (http address example：http://{$service-name}.{$project-name}.svc.cluster.local)
while true; do wget -q -O- http://hpa.demo-project.svc.cluster.local; done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221090034.png)

4.4. Click on the **√** button when you've done, then click **Next**. We don't use volume in this demo, please click **Next → Create** to complete the creation.

So far, we've created two deployments, i.e. `hpa` and `load-generator`, and one service, i.e. `hpa`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716222833.png#alt=)

### Task 5: Verify the HPA

#### View Deployment Status

Choose **Workloads → Deployments**,  enter the deployment `hpa` to view detailed page. Please pay attention to the replicas, Pod status and CPU utilization, as well as the Pods monitoring graphs.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221091126.png)

#### View HPA Status

When the `load-generator` Pod works, it will continuously request `hpa` service. As the following screenshot shown, the CPU utilization is significantly increased after refreshing the page, currently it rising to `1012%`, and the desired replicas and current replicas is rising to `10/10`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221091504.png)

After around 2 minutes, the CPU decreased to `509%`, it proves the principle of HPA.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221092228.png)

### Task 6: Verify Autoscaling

6.1. Scroll down to the Pods list, and pay attention to the Pod that we first created. Generally, we can see the CPU usage of the first created Pod shows a significant upward trend in the monitoring graph. When HPA starts working, the CPU usage has a obvious decreased trend. Finally it tends to be smooth.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221093302.png)

**View workloads monitoring**

6.2. Switch to the **Monitoring** tap and select `Last 30 minutes` in the filter.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221092927.png)


**View all replicas monitoring**

6.3. Click `View all replicas` on the right of monitoring graph, inspecting all replicas monitoring graphs:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221093939.png)

### Task 7: Stop Load Generation

7.1. Redirect to **Workloads → Deployments** and delete `load-generator` to cease the load increasing.


7.2. Inspect the status of the `hpa` again, you'll find that its current CPU utilization has slowly dropped to 10% **in a few minutes**. Eventually the HPA reduces its deployment replicas to one (initial value). The trend in the monitoring curve can also help us to understand the working principle of HPA.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221095630.png)


7.3. Now, drill into the **Pod** detailed page from Pod list, inspect the monitoring graph and review the CPU utilization and Network inbound/outbound trends. We can find the trends are matched with this HPA example.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221094853.png)

7.4. Then drill into the contain of this Pod, we can find it has the same trend with above.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221095007.png)

## Modify HPA Settings

If you need to modify the settings of the HPA, you can go to the deployment detailed page, and click **More → Horizontal Pod Autoscaler**, edit the pop-up window at your will.


## Cancel HPA

If you don't need HPA for deployment, you can click **··· → Cancel**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221095420.png)

Congratulation! You have been familiar with how to set HPA for deployment through this tutorial.
