---
title: "Glossary"
---

<!-- 了解和使用 KubeSphere 管理平台，会涉及到以下的基本概念：

 
|  KubeSphere  | Kubernetes 对照释义 |
|------------|--------------|
|项目|Namespace， 为 Kubernetes 集群提供虚拟的隔离作用，详见 [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)。|
|容器组| Pod，是 Kubernetes 进行资源调度的最小单位，每个 Pod 中运行着一个或多个密切相关的业务容器 |
|部署|Deployments，表示用户对 Kubernetes 集群的一次更新操作，详见 [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)。|
|有状态副本集|StatefulSets，用来管理有状态应用，可以保证部署和 scale 的顺序，详见 [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)。|
|守护进程集|DaemonSets，保证在每个 Node 上都运行一个容器副本，常用来部署一些集群的日志、监控或者其他系统管理应用，详见 [Daemonset](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)。|
|任务|Jobs，在 Kubernetes 中用来控制批处理型任务的资源对象，即仅执行一次的任务，它保证批处理任务的一个或多个 Pod 成功结束。任务管理的 Pod 根据用户的设置将任务成功完成就自动退出了。比如在创建工作负载前，执行任务，将镜像上传至镜像仓库。详见 [Job](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/)。|
|定时任务|CronJob，是基于时间的 Job，就类似于 Linux 系统的 crontab，在指定的时间周期运行指定的 Job，在给定时间点只运行一次或周期性地运行。详见 [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)|
|服务|Service， 一个 Kubernete 服务是一个最小的对象，类似 Pod，和其它的终端对象一样，详见 [Service](https://kubernetes.io/docs/concepts/services-networking/service/)。|
|应用路由|Ingress，是授权入站连接到达集群服务的规则集合。可通过 Ingress 配置提供外部可访问的 URL、负载均衡、SSL、基于名称的虚拟主机等，详见 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)。|
|镜像仓库|Image Registries，镜像仓库用于存放 Docker 镜像，Docker 镜像用于部署容器服务， 详见 [Images](https://kubernetes.io/docs/concepts/containers/images/)。|
|存储卷|PersistentVolumeClaim（PVC），满足用户对于持久化存储的需求，用户将 Pod 内需要持久化的数据挂载至存储卷，实现删除 Pod 后，数据仍保留在存储卷内。Kubesphere 推荐使用动态分配存储，当集群管理员配置存储类型后，集群用户可一键式分配和回收存储卷，无需关心存储底层细节。详见 [Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。|
|存储类型|StorageClass，为管理员提供了描述存储 “Class（类）” 的方法，包含 Provisioner、 ReclaimPolicy 和 Parameters 。详见 [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/)。|
|流水线|Pipeline，简单来说就是一套运行在 Jenkins 上的 CI/CD 工作流框架，将原来独立运行于单个或者多个节点的任务连接起来，实现单个任务难以完成的复杂流程编排和可视化的工作。|
|企业空间|Workspace，是 KubeSphere 实现多租户模式的基础，是您管理项目、 DevOps 工程和企业成员的基本单位。
主机|Node，Kubernetes 集群中的计算能力由 Node 提供，Kubernetes 集群中的 Node 是所有 Pod 运行所在的工作主机，可以是物理机也可以是虚拟机。详见 [Nodes](https://kubernetes.io/docs/concepts/architecture/nodes/)。| -->

This document describes some frequently used glossaries in KubeSphere, will involve the following basic concepts:

 
| Object | Concepts|
|------------|--------------|
| Project | It can be regarded as Kubernetes Namespace which is intended for use in environments with many users spread across multiple teams, or projects, provides virtual isolation for the resources in KubeSphere, reference [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/).|
| Pods | Pods, are the smallest deployable units of computing that can be created and managed in KubeSphere, reference [Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/).
| Deployments | Deployments, are used to describe a desired state in a Deployment object, and the Deployment controller changes the actual state to the desired state at a controlled rate, see [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/). |
| StatefulSets | StatefulSets, StatefulSet is the workload object used to manage stateful applications, such as MySQL, reference [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/). |
| DaemonSet | DaemonSet, A DaemonSet ensures that all (or some) Nodes run a copy of a Pod，such as fluentd or logstash, reference [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/).  |
| Jobs | Jobs, A job creates one or more pods and ensures that a specified number of them successfully terminate, see [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/). |
|CronJob |CronJob, it creates Jobs on a time-based schedule, a CronJob object is like one line of a crontab (cron table) file. It runs a job periodically on a given schedule, reference [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/).  | 
| Services | Services, A Kubernetes Service is an abstraction which defines a logical set of Pods and a policy by which to access them - sometimes called a micro-service. See [Services](https://kubernetes.io/docs/concepts/services-networking/service/). |
| Routes | Ingress, An API object that manages external access to the services in a cluster, typically HTTP, Ingress can provide load balancing, SSL termination and name-based virtual hosting, reference [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/).  |
|Image Registry |Image registry, is used to store and distribute Docker Images, it could be public or private, see [Image](https://kubernetes.io/docs/concepts/containers/images/). |
| Volume | Persistent Volume Claim (PVC), is a request for storage by a user, allow a user to consume abstract storage resources, see [PVC](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). | 
|Storage Classes| A Storage Class provides a way for administrators to describe the “classes” of storage they offer, see [StorageClasses](https://kubernetes.io/docs/concepts/storage/storage-classes/). |
| Pipeline | Jenkins Pipeline is a suite of plugins which supports implementing and integrating continuous delivery pipelines into Jenkins, see [Pipeline](https://jenkins.io/doc/book/pipeline/). |
WorkSpace | Multitenancy based, is the basic unit that is used to manage projects, DevOps and different level users.|
Nodes | A node is a worker machine that may be a VM or physical machine, depending on the cluster. Each node contains the services necessary to run pods and is managed by the master components. see [Nodes](https://kubernetes.io/docs/concepts/architecture/nodes/). |