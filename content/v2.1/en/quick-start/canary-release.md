---
title: "Managing Canary Release of Microservice App based on Istio"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

Istio’s service mesh provides the control necessary to manage traffic distribution with complete independence from deployment scaling. This allows for a simpler, yet significantly more functional, way to do canary test and rollout. **Canary release** provides canary rollouts, and staged rollouts with percentage-based traffic splits.

KubeSphere provides three kinds of grayscale strategies based on Istio, including blue-green deployment, canary release and traffic mirroring.

## Objective

In this tutorial, we're going to deploy a Bookinfo sample application composed of four separate microservices used to demonstrate the canary release, tracing and traffic monitoring using Istio on KubeSphere.

## Prerequisites

- You need to [Enable Service Mesh System](../../installation/install-servicemesh)
- You need to complete all steps in [Getting Started with Multi-tenant Management](../admin-quick-start.md)
- Log in with `project-admin`, then navigate to **Project Settings → Advanced Settings → Set Gateway → Turn On the Application Governance**


## Hands-on Lab

### What is Bookinfo Application

The Bookinfo application is composed of four distributed microservices (There are 3 versions of the Reviews microservice):

- Productpage. The productpage microservice calls the details and reviews microservices to populate the page.
- Details. The details microservice contains book information.
- Reviews. The reviews microservice contains book reviews. It also calls the ratings microservice.
- Ratings. The ratings microservice contains book ranking information that accompanies a book review.

The end-to-end architecture of the application is shown below, see [Bookinfo Application](https://istio.io/docs/examples/bookinfo/) for more details.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718152533.png#align=left&display=inline&height=1030&originHeight=1030&originWidth=1712&search=&status=done&width=1712)


### Step 1: Deploy Bookinfo Application

1.1. Log in with account `project-regular` and enter the `demo-project`, navigate to **Application Workloads → Applications**, click on the **Deploy New Application** then choose **Deploy Sample Application**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210234559.png)


1.2. Click **Create** in the pop-up window, then Bookinfo application has been deployed successfully, application components are listed in this following page, as well as the routes and hostname.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210235159.png)

1.3. Next you can access the Bookinfo homepage as following screenshot via **Click to visit** button. Click on the **Normal user** to enter into the summary page.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718161448.png#align=left&display=inline&height=922&originHeight=922&originWidth=2416&search=&status=done&width=2416)

1.4. Notice that at this point it only shows **- Reviewer1** and **- Reviewer2** without any stars at the Book Reviews section, this is the initial status of this section.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718161819.png#align=left&display=inline&height=986&originHeight=986&originWidth=2854&search=&status=done&width=2854)


### Step 2: Create Canary Release for reviews service

2.1. Back to KubeSphere console, choose **Grayscale Release** and click on the **Create Canary Release Job. **Then select **Canary Release** and click **Create Job**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162152.png#align=left&display=inline&height=748&originHeight=748&originWidth=2846&search=&status=done&width=2846)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162308.png#align=left&display=inline&height=1416&originHeight=1416&originWidth=2822&search=&status=done&width=2822)

2.2. Fill in the basic information, e.g. `canary-release`, click **Next** and select **reviews** as the canary service, then click **Next**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162550.png#align=left&display=inline&height=926&originHeight=926&originWidth=1908&search=&status=done&width=1908)

2.3. Enter `v2` as **Grayscale Release Version Number** and fill in the new image blank with `kubesphere/examples-bookinfo-reviews-v2:1.13.0` (i.e. Modify v1 to v2), then click **Next**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718162840.png#align=left&display=inline&height=754&originHeight=754&originWidth=1910&search=&status=done&width=1910)

2.4. The canary release supports **Forward by traffic ratio** and **Forward by request content**, in this tutorial we choose adjust the traffic ratio to manage traffic distribution between v1 and v2. Drag the slider to adjust v2 takes up 30% traffic, and v2 takes up 70%.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718163639.png#align=left&display=inline&height=750&originHeight=750&originWidth=1846&search=&status=done&width=1846)

2.5. Click **Create** when you've completed configuration, then you're able to see the `canary-release` has been created successfully.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718164216.png#align=left&display=inline&height=850&originHeight=850&originWidth=2822&search=&status=done&width=2822)


### Step 3: Verify the Canary Release

When you visit the Bookinfo website again and refresh your browser repeatedly, you'll be able to see that the Bookinfo reviews section  switch between v1 and v2 at a random rate of about 30% and 70% respectively.

![](https://pek3b.qingstor.com/kubesphere-docs/png/bookinfo-canary.gif#align=left&display=inline&height=1016&originHeight=1016&originWidth=2844&search=&status=done&width=2844)


### Step 4: Inspect the Traffic Topology Graph

4.1. Connect to your SSH Client, use the following command to introduce real traffic to simulate the access to a bookinfo application every 0.5 seconds.

```
$ curl http://productpage.demo-project.192.168.0.88.nip.io:32565/productpage?u=normal

  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
   0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0< 74  5183   74  3842    0     0  73957      0 --:--:-- --:--:-- --:--:-- 73884<!DOCTYPE html>
   ···
```

4.2. From the traffic management diagram, you can easily see the service invocation and dependencies, health, performance between different microservices.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718170256.png#align=left&display=inline&height=1338&originHeight=1338&originWidth=2070&search=&status=done&width=2070)

4.3. Click on the reviews card. The traffic monitoring graph will come out including real-time data of **Success rate**, **Traffic** and **Duration**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718170727.png#align=left&display=inline&height=1150&originHeight=1150&originWidth=2060&search=&status=done&width=2060)


### Step 5: Inspect the Tracing Details

KubeSphere provides distributed tracing feature based on [Jaeger](https://www.jaegertracing.io/), which is used for monitoring and troubleshooting microservices-based distributed application.

5.1. Choose **Tracing** tab. You can clearly see all phases and internal calls of a request, as well as the period in each phase.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718171052.png#align=left&display=inline&height=1568&originHeight=1568&originWidth=2824&search=&status=done&width=2824)

5.2. Click  any  item, you can even drill down to see the request details and this request is being processed by which machine (or container).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718173117.png#align=left&display=inline&height=1382&originHeight=1382&originWidth=2766&search=&status=done&width=2766)


### Step 6: Take Over All Traffic

6.1. As mentioned previously, when the canary version (v2) is released, it could be used to send 70% of traffic to the canary version. Publishers can test the new version online and collect user feedbacks.

Switch to **Grayscale Release** tab, click into `canary-release`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718181326.png#align=left&display=inline&height=756&originHeight=756&originWidth=2824&search=&status=done&width=2824)

6.2. Click **···** and select **Take Over** at `reviews-v2`. Then 100% of traffic will be sent to the new version (v2).

> Note:  If anything goes wrong along the way, we can abort and rollback to the previous version (v1) in time.


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718181413.png#align=left&display=inline&height=1438&originHeight=1438&originWidth=2744&search=&status=done&width=2744)

6.3. Open the bookinfo page again and refresh the browsers several times. We can find that it only shows the v2 (ratings with black stars) in reviews module.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718235627.png#align=left&display=inline&height=1108&originHeight=1108&originWidth=2372&search=&status=done&width=2372)


### Step 7: Take Down the Old Version

When the new version v2 has been  released online and takes over all the traffic. Also, the testing results and online users feedback are confirmed to be correct. You can take down the old version and remove the resources of v1.

Click on the **Job Offline** button to take down the old version.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190719001803.png#align=left&display=inline&height=1466&originHeight=1466&originWidth=2742&search=&status=done&width=2742)

> Notice: If take down a specific version of the component, the associated workloads and istio related configuration resources will be removed simultaneously, it turns out that v1 is being replaced by v2.


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190719001945.png#align=left&display=inline&height=1418&originHeight=1418&originWidth=1988&search=&status=done&width=1988)
