---
title: "Deploying a WordPress Web Application" 
keywords: ''
description: ''
---

## Objective

In this tutorial we will create a Deployment as an example, demonstrating how to deploy [Wordpress](https://wordpress.org/) web application to KubeSphere, which is based on the last tutorial [Deploy a MySQL StatefulSet](mysql-statefulset.md). The password between WordPress and MySQL will be created and saved as a ConfigMap.

## Prerequisites

- You need to create a MySQL StatefulSet, see the [Tutorial 3](mysql-statefulset.md) if not yet.
- You need to sign in with `project-regular` and enter into the corresponding project.

##Estimated Time

About 15 minutes.

## Hands-on Lab

### Step 1: Create a ConfigMap

The environment variable `WORDPRESS_DB_PASSWORD` is the password to connect the database in Wordpress. In this presentation, create a ConfigMap to replace the environment variable. A ConfigMap will be written as an environment variable when create Wordpress container group setting.

1.1. Login KubeSphere as `project-regular`. Enter `demo-project`, navigate to **Configuration Center → ConfigMaps**, then click **Create ConfigMap**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716201555.png#alt=)

1.2. Fill in the basic information, e.g. `Name : wordpress-configmap`, then click **Next**

1.3. ConfigMap parameter is composed of a set of key-value pairs, fill in the blanks with the following values and click **Create** button when you've done.

- key: WORDPRESS_DB_PASSWORD
- value: 123456

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716201840.png#alt=)

#### Step 2: Create a Volume

2.1. Navigate to **Volumes**, and click **Create**. Then fill in the basic information, e.g. `Name : wordpress-pvc`, click **Next** when you've done.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716201942.png#alt=)

2.2. Leave the default values in Volume Settings, click **Next** and choose **Create**. You will be able to see the volume `wordpress-pvc` has been created successfully.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716202259.png#alt=)

> Reminder: The volume will display `Pending` if it is not yet mounted, actually it's normal since local volume doesn't suppor [Dynamic Volume Provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/). It will change to `Bound` when it has been mounted to the workload.


#### Step 3: Create a Deployment

3.1. Navigate to **Workloads → Deployments**, then click **Create** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716202607.png#alt=)

3.2. Fill in the basic information, e.g. `Name : wordpress`, then choose **Next**.

3.3. Click **Add Container**, then fill in the table according to the following hints.

- Image: `wordpress:4.8-apache`
- Container Name: wordpress
- Service Settings:

  - Name: port
  - Protocol: TCP
  - Port: 80

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716203151.png#alt=)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716203427.png#alt=)

3.4. Check the box for **Environmental Variable**, and fill in the blanks with follow values:

- Environmental Variables (It requires to create 2 environmental variables in this section)

  - Click **Reference Config Center**
  - Fill in the name with `WORDPRESS_DB_PASSWORD`
  - Select resource: select `wordpress-configmap`
  - Select Key: `WORDPRESS_DB_PASSWORD`
  - Click **Add Environmental Variable**
  - Name: `WORDPRESS_DB_HOST`
  - Value: `mysql-service`

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716203500.png#alt=)

3.5. Other blanks could be remained default values, choose **Save → Next** when you've done.

3.6. Choose **Add Existing Volume**, select the `wordpress-pvc` which was created in Step 2.

3.7. Select `ReadAndWrite` and set the Mount Path to `/var/www/html`. Then click **Save → Next → Create** when you've done. Now we've created the Wordpress Deployment succeessfully.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716232832.png#alt=)

#### Step 4: Create a Service

4.1. Navigate to **Network & Service** → **Service**, then click **Create** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716204610.png#alt=)

4.2. Fill in the basic information, e.g. `Name : wordpress-service`, click **Next** and reference the following list to complete the Service Settings:

- Service Type: choose the first item `Virtual IP: Access the service through the internal IP of the cluster`
- Selector: Click **Specify Workload**, then select `wordpress` and click **Save**.
- Ports:

  - Name: port
  - Protocol: TCP
  - Port: 80
  - Target port: 80

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716204854.png#alt=)

4.3. Click **Next → Next** to skip the Label Settings. We are going to expose this service via NodePort, so choose `NodePort` and click **Create**, the `wordpress-service` has been created successfully. We got the NodePort `30204` from the Service list.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716205229.png#alt=)

### Step 5: Access the WordPress Application

At this point, WordPress is exposed to the outside by the Service, thus we can access this application in your browser via `{$Node IP}:{$NodePort}`, for example `http://192.168.0.88:30204` since we selected http protocol previously.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716205640.png#alt=)
