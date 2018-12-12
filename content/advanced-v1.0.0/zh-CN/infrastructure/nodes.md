---
title: "主机管理"
---

Kubernetes 集群中的计算能力由主机 (Node) 提供，Kubernetes 集群中的 Node 是所有 Pod 运行所在的工作主机，可以是物理机也可以是虚拟机。而 KubeSphere 主机管理的功能完全满足企业对集群运维监控的需求，支持实时查看资源状态和节点状态，查看任意主机上容器组的运行状态以及 CPU 和 内存的消耗，并且主机的监控页面还能够实时地提供全方位细粒度的资源监控如 IOPS、磁盘吞吐、网卡流量，让用户一目了然所有主机资源状态。

节点 (Node) 中有一个重要的功能即污点 (Taints) 管理。我们知道节点亲和性 (NodeAffinity) 是 Pod 上定义的一种属性，使 Pod 能够按我们的要求调度到某个节点上，而污点则恰恰相反，它可以让节点拒绝运行 Pod，甚至驱逐 Pod。污点是节点的一个属性，如果主机设置了污点后，底层的 Kubernetes 是不会将 Pod 调度到这个节点上的。

## Taints 管理      

首先登录 KubeSphere 管理控制台，访问左侧菜单栏，在 **资源** 菜单下，点击 **主机管理** 按钮进入列表页。作为集群管理员，可以查看当前集群下所有主机信息。

![主机列表](/ae-node_lists.png)

1. 点击右上角 **Taints 管理** 按钮，进入集群主机 Taints 统一管理页面。

2. 在左侧节点列表中可以看到各个主机节点已有的 Taints 状态，选中相应节点，在右侧可以对其完成 Taints 的添加、删除、更新操作。

3. 当对所需一个或者多个主机节点完成相应 Taints 编辑操作后，点击 **保存** 按钮，完成 Taints 配置的更新。

> 参数解释:
>
> Node 的 effect 存在以下 3 个值，对于还未被调度的 Pod 来说：
> - NoSchedule: 表示不允许调度，已调度的资源不受影响。
> - PreferNoSchedule: 表示尽量不调度。
> - NoExecute: 表示不允许调度
>
> 如果在设置 node 的 Taints (污点) 之前，就已经运行了一些 Pod，则分为以下几种情况：
> - 若 effect 的值是 NoSchedule 或 PreferNoSchedule，对于已运行的 Pod 仍然可以运行，只是新 Pod (如果没有设置容忍) 不会再往上调度。
> - 若 effect 的值是 NoExecute，那么此 Node 上正在运行的 Pod，只要没有容忍的，立刻被驱逐。effect 为 NoExecute 的污点，在容忍 (Toleration) 属性中有一个可选配置：tolerationSeconds 字段，用来设置这些 Pod 还可以在这个 Node 之上运行多久，给它们一点宽限的时间，到时间才驱逐。
>     - 如果是部署 (Deployment)，那么被该 Node 驱逐的 Pod 会漂移其它节点运行。
>     - 如果是守护进程集 (DaemonSet) 被驱逐后也不会再被运行到其它 Node，直到 Node 上的 NoExecute 污点被删除或者为该 Pod 设置了容忍。

![主机 taint 管理](/ae-node_taints.png)

## 查看主机详情  

在主机列表页，点击某个主机节点打开其详情页，可以看到当前主机下所有资源的概况，包括主机的 CPU 、内存和容器组资源运行和使用状态，并且支持查看主机上所有容器组的资源使用情况和数量变化，以及注解 (Annotation) 和事件 (Events) 信息。

### 节点状态

节点状态 (Conditions) 描述了所有运行中节点的状态，KubeSphere 对主机的管理有以下五种状态，集群管理员通过以下五种状态可以判断当前节点的负载和能力，更合理地管理主机资源。

- OutOfDisk：表示当前节点是否有足够的空间添加和运行新的 Pods
- MemoryPressure：表示当前节点的内存压力的高低
- DiskPressure：表示当前节点的磁盘压力高低
- PIDPressure：表示当前节点的进程是否存在压力
- Ready：表示当前节点的状态是否健康和能够准备接收新的 Pods 运行，Node Controller 如果 40 秒 内没有收到节点的状态报告则为 Unknown

![节点详情](/ae-node_detail.png) 

### 查看监控

值得一提的是，主机管理支持细粒度的资源监控，可筛选指定时间范围内的监控数据以查看变化情况。

![](/ae-monitor-details.png)

## 停用或启用主机

在主机详情页面，点击左侧 **停用** (cordon) 按钮，主机状态变为 **无法调度**，当前按钮变为 **启用** (uncordon)，当有新的工作负载被创建时将不会被调度到此节点，如想回复为可调度状态，点击 **启用** 按钮。

## 更新主机标签 

如果需要限制 Pod 到指定的 Node 上运行，则可以给 Node 打标签 (Label) 并给 Pod 配置节点选择器 (NodeSelector)。

例如，给其中一个 Node 打上标签 `role=ssd_node` 后，如果给 Pod 也设置了 NodeSelector 为 `role : ssd_node`，那么该 Pod 将只会在这一个节点上运行。

如果需要更新更新主机标签，可在项目详情页面，点击左侧项目操作菜单, 点击 **编辑标签** 按钮编辑当前主机上的标签 (Labels)，最后点击 **确认** 按钮完成修改。

![修改主机标签](/ae-node_labels_edit.png)