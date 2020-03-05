---
title: "High Risk Operations"
keywords: 'kubesphere, kubernetes, docker'
description: 'High risk operations on KubeSphere cluster'
---

KubeSphere supports high availability of master and working nodes to ensure cluster sustainability and stability owing to the underlying kubernetes scheduling mechanism. It is not recommended to shut down or restart nodes for no reason, because such operations are high-risk that may cause the services unavailable. The following operations are the ones we can think of people should pay much attention to.

## High-risk Operations

| Sequence | High-risk Operation |
|---|---|
| 1 | Restart the cluster node or reinstall the operating system. |
| 2 | It is recommended that you do not install additional software on the cluster node, which could make the cluster node unavailable. |

## Prohibitive Operations

| Sequence | Prohibitive Operations |
|---|---|
| 1 | Delete `/var/lib/etcd/`. Delete `/var/lib/docker`. Delete `/etc/kubernetes/`.  Delete `/etc/kubesphere/` |
| 2 | Disk formatting, partitioning. |
