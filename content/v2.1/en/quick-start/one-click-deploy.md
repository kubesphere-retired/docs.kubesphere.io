---
title: "Deploy Grafana App to Kubernetes using Application Template"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## Objective

This tutorial shows you how to quickly deploy a [Grafana](https://grafana.com/) application in KubeSphere by importing application  repository, demonstrating how to share and deploy Helm apps under a Workspace.

## Prerequisites

- You've enabled [KubeSphere Application Store](../../installation/install-openpitrix)
- You've completed all steps in [Getting Started with Multi-tenant Management](../admin-quick-start.md)

## Hands-on Lab

### Add a Application Repository

> Note: The application repository can be either the Object Storage, e.g. [QingStor Object Storage](https://www.qingcloud.com/products/qingstor/), [AWS S3](https://aws.amazon.com/cn/what-is-cloud-object-storage/), or [GitHub Repository](https://github.com/). The packages are composed of Helm Chart template files of the applications. Therefore, before adding an application repository to KubeSphere, you need to create an object storage and upload  Helm packages in advance. This tutorial prepares a demo repository based on QingStor Object Storage.


1. Sign in with `ws-admin` account, click **View Workspace** and navigate to **Workspace Settings → App Repos**, then Click **Add App Repository**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106143904.png)

2. Fill in the basic information, name it as demo-repo and input the URL with `https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/`, you can validate if this URL is available, choose **OK** when you've done.

> Note: Nomarlly, it will automatically import all of the applications from the Helm repository into KubeSphere, you can browse those app templates in each project.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106144105.png)

### Browse App Templates

1. Switch to use `project-regular` account to login, then enter into `demo-project`.

2. Click **Application Workloads → Applications**, click **Deploy New Application**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106161804.png)

3. Choose **From App Templates** and select `demo-repo` from the dropdown list.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106162219.png)

4. Search "Grafana" and click into Grafana App, we'll demonstrate deploy Grafana to Kubernetes as an example.

> Attention: The applications of this demo repo are synchronized from the Google Helm repo, some appliations may not be able to be deployed successfully, since the helm charts were maintained by uncertain organizations.

### Deploy Grafana Application

1. Click **Deploy** on the right, generally you don't need to change parameters configuration, just click **Deploy**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106171747.png)

2. Wait for 2 minutes, then you'll see the application `grafana` showing `active` from the application list.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106172151.png)


### Expose Grafana Service

1. Click into Grafana appliation, and then enter into its service page.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106172416.png)

2. In this page, make sure its deployment and Pod is running, then click **More → Edit Internet Access**, and select **NodePort** in the dropdown list, click **OK** to save it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106172532.png)

3. At this point, you'll be able to access Grafana service outside the cluster.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106172837.png)

### Access the Grafana Service

In this section, we can access Grafana service using `${Node IP}:${NODEPORT}`, e.g. `http://192.168.0.54:31407`, or click the button **Click to visit** to access the Grafana dashboard.

1. Note that you have to obtain the account and password from the grafana secret in advance. Navigate to **Configuration Center → Secrets**, click into **grafana-l47bmc (Type: Default)**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106173434.png)

2. Click the button to display the secret information, then copy and paste the value of **admin-user** and **admin-password**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106173531.png)

3. Open the Grafana log in page, sign in with the **admin** account.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717152831.png#alt=)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717152929.png#alt=)
