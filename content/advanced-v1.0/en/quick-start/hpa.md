---
title: "Create Horizontal Pod Autoscaler for Deployment"
---

Horizontal Pod Autoscaler (HPA) is the new feature which is integrated in the Advanced Edition. The Horizontal Pod Autoscaler automatically scales the number of pods in a deployment based on observed CPU utilization or Memory usage. The controller periodically adjusts the number of replicas in a deployment to match the observed average CPU utilization to the target value specified by user.

## How does the HPA work


The Horizontal Pod Autoscaler is implemented as a control loop, with a period controlled by the controller manager’s flag (with a default value of 15 seconds). For per-pod resource metrics (like CPU), the controller fetches the metrics from the resource metrics API for each pod targeted by the HorizontalPodAutoscaler. Then, if a target utilization value is set, the controller calculates the utilization value as a percentage of the equivalent resource request on the containers in each pod. If a target raw value is set, the raw metric values are used directly. The controller then takes the mean of the utilization or the raw value (depending on the type of target specified) across all targeted pods, and produces a ratio used to scale the number of desired replicas.

![How does the HPA work](/hpa.svg)


## Target

This document walks you through an example of enabling Horizontal Pod Autoscaler for the Nginx deployment. Sending an infinite query request to the application to access the Nginx application's service through multiple Pod, which is equivalent to manually increasing the CPU load. That is, simulating multiple users accessing the service at the same time, demonstrating its autoscaling function and the HPA Principle.

## Prerequisites

- You need to create a workspace and project, see the [Admin Quick Start](../admin-quick-start) if not yet.
- You need to sign in with `project-regular` and enter into the corresponding project.

## Estimated Time

About 25 minutes.

## Create HPA

### Step 1: Create a Deployment

1. Sign in with project-regular, enter into one project (e.g. demo-namespace), then select **Workload → Deployments**. Click **Create Deployment** button.

![Create a Deployment](https://pek3b.qingstor.com/kubesphere-docs/png/20190321182255.png)

2. Then fill in the basic information in the pop-up window. 


- Name: A concise and clear name for this deployment, which is convenient for users to browse and search, e.g. `hpa-example`.
- Alias: Helps you better distinguish resources and supports Chinese.
- Description: A brief introduction to this deployment.

Click **Next** when you're done.

![Basic Information](https://pek3b.qingstor.com/kubesphere-docs/png/20190321170824.png)

### Step 2: Configure the HPA 

Choose **Horizontal Pod Autoscaling**, and fill in the table as following:

- Min Replicas Number: 2
- Max Replicas Number: 8
- CPU Request Target(%): 50, represents the percent of target CPU utilization 

![Configure the HPA ](https://pek3b.qingstor.com/kubesphere-docs/png/20190321210900.png)

### Step 3: Add a Container

1. Click on **Add Container**, then fill in the Pod template table.



- Container Name: nginx
- Image: nginx

![Add a Container](https://pek3b.qingstor.com/kubesphere-docs/png/20190321234139.png)


2. Click **Save** to save these settings.

3. Leave the Update Strategy as `RollingUpdate`, then click **Next**.

4. There is no need to set Volume, click **Next** to skip Volume Settings.

5. Leave the Label as `app : hpa-example`, then click **Create**. Now the Nginx deployment has been created successfully.

![Nginx deployment](https://pek3b.qingstor.com/kubesphere-docs/png/20190321234325.png)


## Create a Service

### Step 1: Basic Information

1. Choose **Network & Services → Services** on the left menu, then click **Create Service**.

![Create a Service](https://pek3b.qingstor.com/kubesphere-docs/png/20190321235409.png)

2. Fill in the basic information, enter `hpa-example` into name then click **Next**.

![Basic Information](https://pek3b.qingstor.com/kubesphere-docs/png/20190321235821.png)

### Step 2: Service Settings

Since the service is accessed within the cluster, so we choose the first item (Virtual IP) for the service Settings.

![Service Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190322000035.png)

- Selector: Click **Specify Workload**, select the hpa-example as the backend workload, then click **Save**
- Ports: 
   - name: Enter port
   - protocol: TCP
   - port: Enter 80
   - target port: Enter 80
- Session Affinity: Leave "None:

![Service Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190322000351.png)

![Service Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190322000427.png)

**Virtual IP Settings**

![Service Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190322000755.png)

### Step 3: Label Settings

Leave the Label as `app : hpa-example`, then click **Create**. Now the Nginx service has been created successfully. Next, we will create a load generator.

## Create Load-generator

### Step 1: Fill in the Basic Information

1. In the current project, select **Workload → Deployments**. Click **Create Deployment** button.

![Create a Deployment](https://pek3b.qingstor.com/kubesphere-docs/png/20190322001209.png)


2. Then fill in the basic information in the pop-up window. 


- Name: A concise and clear name for this deployment, which is convenient for users to browse and search, e.g. `load-generator`.
- Alias: Helps you better distinguish resources and supports Chinese.
- Description: A brief introduction to this deployment.

![basic information](https://pek3b.qingstor.com/kubesphere-docs/png/20190322001329.png)

Click **Next** when you're done.

### Step 2: Pod Template

1. Click on **Edit Mode** and modify the replicas to 50, then click **Edit Mode** to redirect to the creation table.

![Pod Template](https://pek3b.qingstor.com/kubesphere-docs/png/20190322001544.png)

2. Click **Add Container**, and fill in the Pod template as following:



- Container Name: busybox-container
- Image: busybox

![Add Container](https://pek3b.qingstor.com/kubesphere-docs/png/20190322001920.png)

3. Click on the **Advanced Options** to expand the table.

![Advanced Options](https://pek3b.qingstor.com/kubesphere-docs/png/20190322002259.png)

4. Reference the following commands and arguments to fill in the table. Click **Add command** and **Add argument** to add the second line.

```
# Commands
sh
-c

# Arguments (http address ：http://{$service name}.{$project name}.svc.cluster.local)
while true; do wget -q -O- http://hpa-example.demo-namespace.svc.cluster.local; done
```

![Advanced Options](https://pek3b.qingstor.com/kubesphere-docs/png/20190322003344.png)

Click on the **Save** button when you're done, then click **Next**.

### Step 3: Label Settings

Click **Next** to skip the Volume Settings, leave the label as `app:load-generator`.

Click **Create** to complete creation.

So far, we have created 2 deployments (i.e. hpa-example and load-generator) and 1 service (hpa-example).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190322004246.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190322004340.png)


## Verify HPA

### Step 1: Inspect the Status

Click into `hpa-example` and inspect the changes, please pay attention to the HPA status and the CPU utilization, as well as the Pods monitoring graphs.

![Inspect the status](https://pek3b.qingstor.com/kubesphere-docs/png/20190322010021.png)

### Step 2: Verify the Scaling

When all of the load-generator pods are successfully created and begins to access the hpe-example service, as shown in the following figure, the CPU utilization is significantly increased after refreshing the page, currently rising to 55%, and the desired replicas and current replicas are rising to 3. 

![Verify the scaling](https://pek3b.qingstor.com/kubesphere-docs/png/20190322010738.png)

This is because the Horizontal Pod Autoscaler is working right now. The load-generator looply requests the hpa-example service to make the CPU utilization rise rapidly. After the HPA starts working, it makes the backend of the service increases fast to handle a large number of requests together, and the replicas of hpa-example continues to increase follow with the CPU utilization increases, which demonstrates the working principle of HPA.


In theory, from the CPU monitoring curve of the Pod, it can be seen that the CPU usage of the two Pods originally created has a significant upward trend. When HPA starts working, it can be found that the CPU usage has a significant decrease trend, and finally it tends to be smooth, and the CPU usage is increasing on the newly added Pod.

![Verify the scaling](https://pek3b.qingstor.com/kubesphere-docs/png/20190322011115.png)

> Note: After HPA works, the replicas of the deployment may take a few minutes to be stable, and it takes a few minutes for the Pods to recover normal after the load is removed. Due to environmental differences, the replicas in different environments may be different as well.

![HPA works](https://pek3b.qingstor.com/kubesphere-docs/png/20190322011541.png)

## Remove the load

1. Select **Workload → Deployments** and delete `load-generator` to cease the load increasing.

![Remove the load](https://pek3b.qingstor.com/kubesphere-docs/png/20190322011900.png)


2. Looking at the status of the `hpa-example` again, you can see that its CPU utilization has slowly dropped to 0% in a few minutes, and HPA has reduced its replicas to 2, eventually returning to normal level. The trend reflected by the monitoring curve can also help us to further understand the working principle of HPA;

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190322013238.png)

3. It enables user to inspect the monitoring status of Deloyment, see the CPU utilization trend and Network inbound/outbound, they just match with the HPA example.

![Looking at the status](https://pek3b.qingstor.com/kubesphere-docs/png/20190322012628.png)

## Modify HPA 

If you need to modify the settings of the HPA, you can click into the deployment, and click **More → Horizontal Pod Autoscaler**. The following page displays how to reset HPA:

![Modify HPA](https://pek3b.qingstor.com/kubesphere-docs/png/20190322013114.png)

## Cancel HPA

Click **···** button on the right and **Cancel** if you don't need HPA within this deployment.

![Cancel HPA](https://pek3b.qingstor.com/kubesphere-docs/png/20190322013159.png)

So far, you are familiar with the basics of how to set Horizontal Pod Autoscaler for deployments.