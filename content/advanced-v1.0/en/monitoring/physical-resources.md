---
title: "Physical Resources"
---

The KubeSphere Monitoring Center provides monitoring of CPU, memory, network, and disk metrics at the physical resource level, and supports historical monitoring and node usage rankings. The physical resource status is available on via **Platform → Monitoring Center**.

## Prerequisites

You need an account of cluster-admin role and sign in with KubeSphere.

## View the Cluster Status

Choose **Physical Resources** under **Monitoring Center**, you will be able to view the cluster resource monitoring status, including cluster node status, component service and cluster resource usage.

![cluster-status-monitoring-en](/cluster-status-monitoring-en.png)

## Cluster node status

The cluster node status displays the current online status of all nodes. Supports the drill down to host management page to view the real-time resource usage of all hosts. Click the node online status to enter the host management list.

For example, the `192.168.0.4` node in the following list, click into it to view the details page of the host.

![nodes-list-en](/nodes-list-en.png)

From the node details page, the current nodes' CPU, memory, local storage, and Pod usage can be seen in a straightforward way from the pie chart of the monitoring result.

![node-monitoring-details-en](/node-monitoring-details-en.png)


