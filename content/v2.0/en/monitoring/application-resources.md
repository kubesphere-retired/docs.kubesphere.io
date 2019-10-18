---
title: "Application Resources"
keywords: ''
description: ''
---

In addition to monitoring the data from physical resource level, the cluster admin needs to know how many application resources, such as the number of projects and DevOps projects, as well as how many specific types of workloads and services has already been used in the platform. Application resource monitoring is a summary of the resource usage and trends of the application level of the platform.

## Resource Usage

Choose **Monitoring Center → Application Resources** to enter the overview page of application resource monitoring, including the summary of the usage of all resources in the cluster, as shown in the following figure.

![Resource usage](https://pek3b.qingstor.com/kubesphere-docs/png/20190311090558.png)

Among them, cluster resource usage and application resource usage will retain the monitoring data of the last 7 days, and support custom time range query.

![Resource usage](https://pek3b.qingstor.com/kubesphere-docs/png/20190311090825.png)

Click on a specific resource to view the specific usage and trends of the cluster at a certain time, such as clicking on CPU usage to enter its details page. The details page allows you to view specific monitoring data by workspace and project, and users can customize the time range as well.

![CPU usage](https://pek3b.qingstor.com/kubesphere-docs/png/20190311091044.png)

## Usage Ranking

### Workspace Usage Ranking

The usage ranking supports the ranking of enterprise space resource usage and project resource usage, so that platform administrators can understand the resource usage of each enterprise space in the current cluster, including **CPU usage, memory usage, Pod count, network inbound and outbound**, support ascending or descending order according to any one of the indicators.

![Workspace Usage Ranking](https://pek3b.qingstor.com/kubesphere-docs/png/20190311093059.png)

### Project Usage Ranking

There can be multiple project in a workspace. The quota, resource usage, and network speed between different projects can be seen at a glance through this part of the ranking result. The five monitoring indicators mentioned in workspace above are also supported. After compares the current resource usage data with the quota, the cluster admin can adjust the quota according to the monitoring situation.

![Project Usage Ranking](https://pek3b.qingstor.com/kubesphere-docs/png/20190311093418.png)

