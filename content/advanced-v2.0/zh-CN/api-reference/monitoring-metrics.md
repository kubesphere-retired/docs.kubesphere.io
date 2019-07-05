---
title: "监控指标说明"
---

## Cluster

|指标名|说明|单位|
|---|---|---|
|cluster\_cpu\_utilisation|集群 CPU 使用率||
|cluster\_cpu\_usage|集群 CPU 用量|Core|
|cluster\_cpu\_total|集群 CPU 总量|Core|
|cluster\_load1|集群 1 分钟 CPU 平均负载[^1]||
|cluster\_load5|集群 5 分钟 CPU 平均负载||
|cluster\_load15|集群 15 分钟 CPU 平均负载||
|cluster\_memory\_utilisation|集群内存使用率||
|cluster\_memory\_available|集群可用内存|Byte|
|cluster\_memory\_total|集群内存总量|Byte|
|cluster\_memory\_usage\_wo\_cache|集群内存使用量[^2]|Byte|
|cluster\_net\_utilisation|集群网络数据传输速率|Byte/s|
|cluster\_net\_bytes\_transmitted|集群网络数据发送速率|Byte/s|
|cluster\_net\_bytes\_received|集群网络数据接受速率|Byte/s|
|cluster\_disk\_read\_iops|集群磁盘每秒读次数|次/s|
|cluster\_disk\_write\_iops|集群磁盘每秒写次数|次/s|
|cluster\_disk\_read\_throughput|集群磁盘每秒读取数据量|Byte/s|
|cluster\_disk\_write\_throughput|集群磁盘每秒写入数据量|Byte/s|
|cluster\_disk\_size\_usage|集群磁盘使用量|Byte|
|cluster\_disk\_size\_utilisation|集群磁盘使用率||
|cluster\_disk\_size\_capacity|集群磁盘总容量|Byte|
|cluster\_disk\_size\_available|集群磁盘可用大小|Byte|
|cluster\_disk\_inode\_total|集群 inode 总数||
|cluster\_disk\_inode\_usage|集群 inode 已使用数||
|cluster\_disk\_inode\_utilisation|集群 inode 使用率||
|cluster\_node\_online|集群节点在线数||
|cluster\_node\_offline|集群节点下线数||
|cluster\_node\_offline\_ratio|集群节点下线比例||
|cluster\_node\_total|集群节点总数||
|cluster\_pod\_count|集群中调度完成[^3] Pod 数量||
|cluster\_pod\_quota|集群各节点 Pod 最大容纳量[^4]总和||
|cluster\_pod\_utilisation|集群 Pod 最大容纳量使用率||
|cluster\_pod\_running\_count|集群中处于 Running 阶段[^5]的 Pod 数量||
|cluster\_pod\_succeeded\_count|集群中处于 Completed 阶段的 Pod 数量||
|cluster\_pod\_abnormal\_count|集群中异常 Pod [^6]数量||
|cluster\_pod\_abnormal\_ratio|集群中异常 Pod 比例 [^7]||
|cluster\_ingresses\_extensions\_count|集群 Ingress 数||
|cluster\_cronjob\_count|集群 CronJob 数||
|cluster\_pvc\_count|集群 PersistentVolumeClaim 数||
|cluster\_daemonset\_count|集群 DaemonSet 数||
|cluster\_deployment\_count|集群 Deployment 数||
|cluster\_endpoint\_count|集群 Endpoint 数||
|cluster\_hpa\_count|集群 Horizontal Pod Autoscaler 数||
|cluster\_job\_count|集群 Job 数||
|cluster\_statefulset\_count|集群 StatefulSets 数||
|cluster\_replicaset\_count|集群 ReplicaSet 数||
|cluster\_service\_count|集群 Service 数||
|cluster\_secret\_count|集群 Secret 数||
|cluster\_namespace\_count|集群 Namespace 数||

[^1] 指单位时间内，单位 CPU 运行队列中处于可运行或不可中断状态的平均进程数。如果数值大于 1，表示 CPU 不足以服务进程，有进程在等待。 

[^2] 不包含 buffer、 cache。

[^3] Pod 已经被调度到节点上，即 status.conditions.PodScheduled = true 。参考：[Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)

[^4] 节点 Pod 最大容纳量一般默认 110 个 Pod。参考：[kubelet Options](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/#options)

[^5] Running 阶段表示该 Pod 已经绑定到了一个节点上，Pod 中所有的容器都已被创建。至少有一个容器正在运行，或者正处于启动或重启状态。参考：[Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)

[^6] 异常 Pod：如果一个 Pod 的 status.conditions.ContainersReady 字段值为 false，说明该 Pod 不可用。我们在判定 Pod 是否异常时，还需要考虑到 Pod 可能正处于 ContainerCreating 状态或者 Completed 已完成阶段。综合以上情况，异常 Pod 总数的算法可表示为： Abnormal Pods = Total Pods - ContainersReady Pods - ContainerCreating Pods - Completed Pods 。

[^7] 异常 Pod 比例：异常 Pod 数 / 非 Completed Pod 数。