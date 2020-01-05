---
title: "Publish WordPress App to Kubernetes"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## Wordpress Introduction

WordPress is an online, open source website creation tool written in PHP, with a back-end database MySQL and a front-end component. We can deploy Wordpress to Kubernetes using some Kubernetes object resouces.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105181908.png)

## Objective

In this tutorial we will create a WordPress application as an example, demonstrating how to deploy application with multiple components to Kubernetes based on KubeSphere UI.

## Estimated Time

About 15 minutes.

## Hands-on Lab

## Create Secrets

### Create a MySQL Secret

The environment variable `WORDPRESS_DB_PASSWORD` is the password to connect the database in Wordpress. In this presentation, create a ConfigMap as the environment variable that to be used in MySQL Pod template.

1. Login KubeSphere as `project-regular`. Enter `demo-project`, navigate to **Configuration Center → Secrets**, then click **Create Secrets**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105182525.png)

2. Fill in the basic information, e.g. `Name : mysql-secret`, then click **Next**. Fill in the secret settings as following screenshot, save it and click **Create**.


- Key: MYSQL_ROOT_PASSWORD
- Value: 123456

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105182805.png)

### Create a WordPress Secret

Same steps as above, create a WordPress Secret `Wordpress-secret` with `Key : WORDPRESS_DB_PASSWORD` and `Data : 123456`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105183314.png)

## Create a Volume

Choose **Volumes** and click **Create**, enter `wordpress-pvc` into volume name, then click **Next** to skip Volume Settings and Advanced Settings, click **Create** to finish volume creation.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106000543.png)

## Create an Application

### Add MySQL back-end component

In this section, we will choose composing app to create a complete microservice app.

1. Select **Application Workloads → Application → Deploy New Application**, and choose **Composing App**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106000851.png)

2. Fill in the pop-up table as following:


- Application Name: wordpress
- Then click **Add Component**
- Name: mysql
- Component Version: v1
- Workload Type: Stateful service (StatefulSet)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106001425.png)

3. Click **Add Container Image**, enter `mysql:5.6` into Image, press the return key and click `Use Default Ports`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106002012.png)

4. Scroll down to the Environment Variables, check **Environment Variable** and click **Use ConfigMap or Secret**, then enter `MYSQL_ROOT_PASSWORD` and choose `mysql-secret` that we created in previous step.

Click `√` to save it when you've finished above steps.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106002450.png)

5. Click `Add Volume Template` to create a PVC for MySQL according to following screenshot.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106003738.png)

6. Click `√` to save it, at this point you've added MySQL component.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106004012.png)

### Add WordPress front-end component

1. Click **Add Component**, fill in the Name and Component Version refer to following screenshot:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106004302.png)

2. Click **Add Container Image**, enter `wordpress:4.8-apache` into Image, press the return key and click `Use Default Ports`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106004543.png)

3. Scroll down to the Environment Variables, check **Environment Variable** and click **Use ConfigMap or Secret**, then enter the values according to following screenshot.

- `WORDPRESS_DB_PASSWORD`, choose `wordpress-secret` and `WORDPRESS_DB_PASSWORD`
- Click **Add Environment Variable**, then fill its key & value with `WORDPRESS_DB_HOST` and `mysql`.


![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106004841.png)

4. Click `√` to save it.

5. Click `Add Volume` to attach the existed volume to Wordpress.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106005242.png)

6. Select `wordpress-pvc` that we've created in the previous step, and select `ReadAndWrite`, then input `/var/www/html` as its mount path. Click `√` to save it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106005431.png)

7. Again, click `√` to save it, ensure that both mysql and wordpress application component have been added into the table, then you can click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106005705.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106010011.png)

## Verify the Resouces

**Deployment**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106010223.png)

**StatefulSet**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106010244.png)

**Services**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106010312.png)

## Access the WordPress Application

1. Enter into `wordpress` service, then **edit internet access**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106010404.png)

2. Choose `NodePort` as its service type.


![](https://pek3b.qingstor.com/kubesphere-docs/png/20200106010644.png)

At this point, WordPress is exposed to the outside by the Service, thus we can access this application in your browser via `{$Node IP}:{$NodePort}`, for example `http://192.168.0.88:30048` since we selected http protocol previously.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716205640.png#alt=)
