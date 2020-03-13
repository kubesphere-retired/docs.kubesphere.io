---
title: "Basic Information"
keywords: ''
description: ''
---

The basic information supports managing the following resources information of the current project: 

- Basic information
- Resource quota 
- Resource requests and limits

The quota information management is designed for the project level and is used to limit the resource usage within the project. The resource request and limits are designed for the container level. When you create a workload, by default the container's CPU and memory requests and limits will use the value which is set in the default request and limits.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190320153225.png)

## Basic Information

Click **"···"**, Select **Edit Info** to modify the alias and description of the project.

![Basic Information Management](https://pek3b.qingstor.com/kubesphere-docs/png/20190320153708.png)

![Basic Information Management](https://pek3b.qingstor.com/kubesphere-docs/png/20190320154520.png)

## Quota Management

By default, the usage limit for resources is not set in the project. Quota management supports setting limits on multiple types of resources such as workload, CPU, memory, etc. Click on **Edit Quota** to set the upper limits for each resource.

![Quota Information Management](https://pek3b.qingstor.com/kubesphere-docs/png/20190320154626.png)


## Resource Request and Limits

When creating a project, the admin has set a resource default request for the project. It's designed for the container level. If you need to modify the request and limits for resources, click **"···"** Select **Edit** .

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190320154708.png)

For example, when creating a deployment, in the advanced options of the container group template, if you do not fill in the CPU and memory requests and limits values, then the resource request and limit values ​​for these two items default to the values ​​set in the above figure.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190320154810.png)