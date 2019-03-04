---
title: "Service Components"
---

The service components panel provides health status monitoring of various service components in the cluster, which can help users monitor the status of the cluster and locate problems timely.

## View the service component

Sign it with cluster admin, navigate to **platform management → service components**, then you can see the service components page. 

![service components](/ae-components-en.png)

As a cluster administrator, you can view all the service components of KubeSphere, Kubernetes and OpenPitrix.

![service components](/ae-components-list-en.png)

## The role of service component

The service component page supports view the current health status of the cluster, and when there is an exception in the cluster, the cluster admin can quick inspect if there is an exception in one of the service components. 

For example, when the application is deployed with the application template, and the application is not successfully deployed, it can be checked to see whether there is an exception in the component of Openpitrix, the admin can proceed to locate the problem and inspect the logs and events, finally fix it according to the abnormal component. Each tab can also showing the number of exception components.