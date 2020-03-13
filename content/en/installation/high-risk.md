---
title: "High Risk Operation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere supports high availability of master and working nodes to ensure cluster stability, based on the underlying kubernetes scheduling mechanism to ensure the sustainability and stability. It is not recommended to shut down or restart nodes for no reason, because such operations are high-risk operations may cause the service is not available, please operate with caution. High-risk operations are supposed to inform users about the risks in advance, the engineer is only allowed to implement the backend operation after users and other engineers agree. For example, be aware of the following list describes high-risk and prohibited operations that may cause a node or cluster unavailable:

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