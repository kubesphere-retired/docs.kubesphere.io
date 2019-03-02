---
Title: "Service Components"
---

The service components panel provides health status monitoring of various service components in the cluster of KubeSphere, Kubernetes and OpenPitrix, which can check the current health status and running time of the cluster, and can help users monitor the status of the cluster and locate problems timely.

## View the service component

Login KubeSphere management console, access ** platform management > service components ** into the list page. As a cluster administrator, you can view all the service components under the current cluster:

! [service components](/ae-components-list-en.png)

## The role of service component

The service component can view the current health of the cluster, and when there is an exception in the cluster, the administrator can see if there is an exception in one of the service components. For example, when the application is deployed with the application template, and the application is not successfully deployed, it can be checked to see whether there is an exception in the component of Openpitrix, and the administrator can quickly locate the problem and fix it according to the abnormal component. When an exception occurs for a service component, the Tab for KubeSphere, OpenPitrix, and Kubernetes shows the number of exception components.