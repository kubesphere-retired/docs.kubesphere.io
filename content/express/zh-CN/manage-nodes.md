---
title: "主机管理"
---

Kubernetes 集群中的计算能力由主机提供，Kubernetes 集群中的 Node 是所有 Pod 运行所在的工作主机，可以是物理机也可以是虚拟机。

本节通过以下几个方面介绍如何管理主机：

- Taints 管理
- 查看主机详情
- 停用/启用主机
- 更新主机的标签


## Taints 管理      

首先登录 KubeSphere 管理控制台，访问左侧菜单栏，在 **资源** 菜单下，点击 **主机管理** 按钮进入列表页。作为集群管理员，可以查看当前集群下所有主机信息。

![主机列表](/node_lists.png)

1. 点击右上角 **Taints 管理** 按钮，进入集群主机 Taints 统一管理页面。

2. 在左侧节点列表中可以看到各个主机节点已有的 Taints 状态，选中相应节点，在右侧可以对其完成 Taints 的添加、删除、更新操作。

![主机 taint 管理](/node_taints.png)

> 参数解释:
> - NoSchedule: 表示不允许调度，已调度的资源不受影响。
> - PreferNoSchedule: 表示尽量不调度。
> - NoExecute: 表示不允许调度，已调度的在 tolerationSeconds（定义在 Tolerations 上）后删除
> Node 和 Pod 上都可以定义多个 Taints 和 Tolerations，Scheduler 会根据具体定义进行筛选，Node 筛选 Pod 列表的时候，会保留 Tolerations 定义匹配的，过滤掉没有 Tolerations 定义的，过滤的过程是这样的：
>   * 如果 Node 中不存在影响策略为 NoSchedule 的 Taint，但是存在一个或多个影响策略为 PreferNoSchedule 的 Taint，该 Pod 会尽量不调度到该 Node。
>   * 如果 Node 中存在一个或多个影响策略为 NoExecute 的 Taint，该 Pod 不会被调度到该 Node，并且会驱逐已经调度到该 Node 的 Pod 实例。


3. 当对所需一个或者多个主机节点完成相应 Taints 编辑操作后，点击 **应用** 按钮，完成 Taints 配置的更新。
  

## 查看主机详情  

在主机列表页，点击某个主机节点打开其详情页，可以看到当前主机下所有资源的概况，点击相应资源，可以打开对应资源的详情页面查看更多细节信息。

![节点详情](/node_detail.png)  

## 停用或启用主机

在主机详情页面，点击左侧 **停用**（cordon）按钮，主机状态变为 **无法调度**，当前按钮变为 **启用**（uncordon)，当有新的工作负载被创建时将不会被调度到此节点，如想回复为可调度状态，点击 **启用** 按钮。

![启用主机](/node_uncordon.png)

## 更新主机标签 

进入项目详情页面，点击左侧项目操作菜单, 点击 **编辑标签** 按钮编辑当前主机上的标签 (Labels)，最后点击 **确认** 按钮完成修改。

![修改主机标签](/node_labels_edit.png)