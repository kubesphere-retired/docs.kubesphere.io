---
title: "Creating Horizontal Pod Autoscaler for Deployment"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---


The Horizontal Pod Autoscaler (HPA) automatically scales the number of pods in a deployment based on observed CPU utilization or Memory usage. The controller periodically adjusts the number of replicas in a deployment to match the observed average CPU utilization or Memory usage to the target value specified by user.

## How does the HPA work

The Horizontal Pod Autoscaler is implemented as a control loop, with a period controlled by the controller manager’s HPA sync-period flag (with a default value of 30 seconds). For per-pod resource metrics (like CPU), the controller fetches the metrics from the resource metrics API for each pod targeted by the Horizontal Pod Autoscaler. See [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) for more details.

After creating HPA in the deployment, Controller Manager can access to Metrics-server. And it can obtain the utilization ratio or the original value's (which is determined by the target type) average value of each container cluster in the customized resources. Then, the Controller Manager will compare the average value with the HPA's setting index. At the same time, the Controller Manager can calculate the specific value of Pod's elastic expansion in the deployment. For the Pod's CPU and its storage resources, it should be considered the limits and requests. When scheduling, Kube-scheduler will calculate according to the requests. Thus, if Pod has not been set the request, the flexible expansion will not work.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716214909.png#alt=)

## Objective

This document walks you through an example of configuring Horizontal Pod Autoscaler for the hpa-example deployment.

We will create a deployment to send an infinite loop of queries to the hpa example application, demonstrating its autoscaling function and the HPA principle.

## Estimate Time

About 25 minutes.

## Prerequisites

- You need to create a workspace and a project, see the [Getting Started with Multi-tenant Management](../admin-quick-start.md) if not yet.
- You need to log in with `project-regular` account and enter the corresponding project.

## Hands-on Lab

### Step 1: Create a Deployment

1.1. Enter `demo-project`, then select **Workload → Deployments** and click **Create Deployment** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716215848.png#alt=)

1.2. Fill in the basic information in the pop-up window. e.g. `Name: hpa-example`, then click **Next** when you've done.

### Step 2: Configure the HPA

2.1. Choose **Horizontal Pod Autoscaling**, and fill in the table as follows:

- Min Replicas Number: 2
- Max Replicas Number: 10
- CPU Request Target(%): 50 (represents the percent of target CPU utilization)

Then click on the **Add Container** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716220122.png#alt=)

2.2. Fill in the Pod Template with the following values, then click **Save** to save these settings.

- Image: `mirrorgooglecontainers/hpa-example`
- Service Settings

  - Name: port
  - port: 80 (TCP protocol by default)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190321234139.png#alt=Add%20a%20Container)

2.3. Skip the Volume and Label Settings, click the **Create** button directly. Now the hpa-example deployment has been created successfully.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221028.png#alt=)

### Step 3: Create a Service

3.1. Choose **Network & Services → Services** on the left menu, then click on the **Create Service** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221110.png#alt=)

3.2. Fill in the basic information, e.g. `name : hpa-example`, then click **Next**.

3.3. Choose the first item `Virtual IP: Access the service through the internal IP of the cluster` for the service Settings.

3.4. In Selector blanks, click **Specify Workload** and select the `hpa-example` as the backend workload. Then choose **Save** and fill in the Ports blanks.

- Ports:

  - Name: port
  - Protocol: TCP
  - Port: 80
  - Target port: 80

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221536.png#alt=)

Click **Next → Create** to complete the creation. Now the hpa-example service has been created successfully.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716221828.png#alt=)

### Step 4: Create Load-generator

4.1. In the current project, redirect to **Workload → Deployments**. Click **Create** button and fill in the basic information in the pop-up window, e.g. `Name : load-generator`. Click **Next** when you've done.

4.2. Click on **Add Container** button, and fill in the Pod template as following:

- Image: busybox
- Scroll down to **Start command**, add commands and parameters as following:

```
# Commands
sh
-c

# Parameters (Note: the http service address like http://{$service name}.{$project name}.svc.cluster.local)
while true; do wget -q -O- http://hpa-example.demo-project.svc.cluster.local; done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716222521.png#alt=)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716222549.png#alt=)

Click on the **Save** button when you've done, then click **Next**.

4.3. Click **Next → Create** to complete creation.

So far, we've created two deployments (i.e. hpa-example and load-generator) and one service (i.e. hpa-example).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716222833.png#alt=)

### Step 5: Verify the HPA

5.1. Click into `hpa-example` and inspect the changes. Please pay attention to the HPA status and the CPU utilization, as well as the Pods monitoring graphs.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190322010021.png#alt=)

### Step 6: Verify the Auto Scaling

6.1. When all of the load-generator pods are successfully created and begin to access the hpa-example service, as shown in the following figure, the CPU utilization is significantly increased after refreshing the page, currently rising to `722%`, and the desired replicas and current replicas is rising to `10/10`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716223104.png#alt=)

> Note: Since the Horizontal Pod Autoscaler is working right now, the load-generator looply requests the hpa-example service to make the CPU utilization rised rapidly. After the HPA starts working, it makes the backend of the service increase fast to handle a large number of requests together. Also the replicas of hpa-example continue to increase following with the CPU utilization increase, which demonstrates the working principle of HPA.


6.2. In the monitoring graph, we can see the CPU usage of the first created Pod shows a significant upward trend. When HPA starts working, the CPU usage has a significant decreased trend. Finally it tends to be smooth. Accordingly, the CPU usage is increasing on the newly created Pods.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716223415.png#alt=)

### Step 7: Stop the Load Generation

7.1. Redirect to **Workload → Deployments** and delete `load-generator` to cease the load increasing.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716225225.png#alt=)

7.2. Inspect the status of the `hpa-example` again, you'll find that its current CPU utilization has slowly dropped to 10% in a few minutes. Eventually the HPA reduces its deployment replicas to one (initial value). The trend reflected by the monitoring curve can also help us to further understand the working principle of HPA.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716230725.png#alt=)

7.3. Now inspect the monitoring graph of the Deployment and review the CPU utilization and Network inbound/outbound trends. We can find the trends match with the HPA example.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716230333.png#alt=)

## Modify HPA Settings

If you need to modify the settings of the HPA, you can go into the deployment, and click **More → Horizontal Pod Autoscaler**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716225918.png#alt=)

## Cancel HPA

Click **···** button on the right and **Cancel** if you don't need HPA for this deployment.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716225953.png#alt=)
