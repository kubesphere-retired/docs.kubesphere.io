---
title: "工作负载概述"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

Kubernetes 中对一组 Pod 的抽象模型即工作负载，用于描述业务的运行载体，包括 部署 (Deployment)、有状态副本集 (Statefulset)、守护进程集 (Deamonset)、任务 (Job)、定时任务 (CronJob) 等。KubeSphere 控制台提供向导式的用户界面引导用户快速创建工作负载。

- [创建部署](../deployments)

部署 (Deployment) 为 Pod 和 ReplicaSet 提供声明式定义方法，实现无状态应用伸缩、滚动升级、回滚的功能，常用来部署无状态应用实现快速的伸缩，相较于有状态服务，实例数量可以灵活伸缩。

- [创建有状态副本集](../statefulsets)

有状态副本集 (Statefulset) 是为了解决有状态应用的问题，为应用提供数据的持久化存储、稳定的网络标志，有序的部署、升级、收缩功能，常用来部署数据库、缓存等有状态服务，通常情况只会用到一个实例。

- [创建守护进程集](../daemonsets)

守护进程集 (Daemonset) 保证在每个 Node 上都运行一个容器副本，常用来部署一些集群的日志、监控或者其他系统管理应用。

- [创建任务](../jobs)

任务 (Job) 负责批量处理短暂的一次性任务 (short lived one-off tasks)，即仅执行一次的任务，它保证批处理任务的一个或多个 Pod 成功结束。

- [创建定时任务](../cronjobs)

定时任务 (CronJob)，就类似于 Linux 系统的 Crontab，在指定的时间周期运行指定的任务。

## 工作负载基本操作

工作负载创建后，您可以对其执行查看、扩缩容、启停、删除、升级、资源监控等操作，详见 [工作负载管理](../workload-management)。