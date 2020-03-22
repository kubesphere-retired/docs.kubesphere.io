---
title: "监控指标说明"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere 资源监控共分为八个层级：Cluster（集群），Node（节点），Workspace（企业空间），Namespace（项目），Workload（工作负载），Pod（容器组），Container（容器），Component（ KubeSphere 核心组件）。

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
|cluster\_pod\_succeeded\_count|集群中处于 Succeeded 阶段的 Pod 数量||
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
|cluster\_statefulset\_count|集群 StatefulSet 数||
|cluster\_replicaset\_count|集群 ReplicaSet 数||
|cluster\_service\_count|集群 Service 数||
|cluster\_secret\_count|集群 Secret 数||
|cluster\_namespace\_count|集群 Namespace 数||

**【说明】**

[^1] 指单位时间内，单位 CPU 运行队列中处于可运行或不可中断状态的平均进程数。如果数值大于 1，表示 CPU 不足以服务进程，有进程在等待。 

[^2] 不包含 buffer、 cache。

[^3] Pod 已经被调度到节点上，即 status.conditions.PodScheduled = true 。参考：[Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)

[^4] 节点 Pod 最大容纳量一般默认 110 个 Pod。参考：[kubelet Options](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/#options)

[^5] Running 阶段表示该 Pod 已经绑定到了一个节点上，Pod 中所有的容器都已被创建。至少有一个容器正在运行，或者正处于启动或重启状态。参考：[Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)

[^6] 异常 Pod：如果一个 Pod 的 status.conditions.ContainersReady 字段值为 false，说明该 Pod 不可用。我们在判定 Pod 是否异常时，还需要考虑到 Pod 可能正处于 ContainerCreating 状态或者 Succeeded 已完成阶段。综合以上情况，异常 Pod 总数的算法可表示为： Abnormal Pods = Total Pods - ContainersReady Pods - ContainerCreating Pods - Succeeded Pods 。

[^7] 异常 Pod 比例：异常 Pod 数 / 非 Succeeded Pod 数。

## Node

|指标名|说明|单位|
|---|---|---|
|node\_cpu\_utilisation|节点 CPU 使用率||
|node\_cpu\_total|节点 CPU 总量|Core|
|node\_cpu\_usage|节点 CPU 用量|Core|
|node\_load1|节点 1 分钟 CPU 平均负载||
|node\_load5|节点 5 分钟 CPU 平均负载||
|node\_load15|节点 15 分钟 CPU 平均负载||
|node\_memory\_utilisation|节点内存使用率||
|node\_memory\_usage\_wo\_cache|节点内存使用量[^1]|Byte|
|node\_memory\_available|节点可用内存|Byte|
|node\_memory\_total|节点内存总量|Byte|
|node\_net\_utilisation|节点网络数据传输速率|Byte/s|
|node\_net\_bytes\_transmitted|节点网络数据发送速率|Byte/s|
|node\_net\_bytes\_received|节点网络数据接受速率|Byte/s|
|node\_disk\_read\_iops|节点磁盘每秒读次数|次/s|
|node\_disk\_write\_iops|节点磁盘每秒写次数|次/s|
|node\_disk\_read\_throughput|节点磁盘每秒读取数据量|Byte/s|
|node\_disk\_write\_throughput|节点磁盘每秒写入数据量|Byte/s|
|node\_disk\_size\_capacity|节点磁盘总容量|Byte|
|node\_disk\_size\_available|节点磁盘可用大小|Byte|
|node\_disk\_size\_usage|节点磁盘使用量|Byte|
|node\_disk\_size\_utilisation|节点磁盘使用率||
|node\_disk\_inode\_total|节点 inode 总数||
|node\_disk\_inode\_usage|节点 inode 已使用数||
|node\_disk\_inode\_utilisation|节点 inode 使用率||
|node\_pod\_count|节点调度完成 Pod 数量||
|node\_pod\_quota|节点 Pod 最大容纳量||
|node\_pod\_utilisation|节点 Pod 最大容纳量使用率||
|node\_pod\_running\_count|节点中处于 Running 阶段的 Pod 数量||
|node\_pod\_succeeded\_count|节点中处于 Succeeded 阶段的 Pod 数量||
|node\_pod\_abnormal\_count|节点异常 Pod 数量||
|node\_pod\_abnormal\_ratio|节点异常 Pod 比例||

**【说明】**

[^1] 不包含 buffer、 cache。

## Workspace

|指标名|说明|单位|
|---|---|---|
|workspace\_cpu\_usage|企业空间 CPU 用量|Core|
|workspace\_memory\_usage|企业空间内存使用量（包含缓存）|Byte|
|workspace\_memory\_usage\_wo\_cache|企业空间内存使用量|Byte|
|workspace\_net\_bytes\_transmitted|企业空间网络数据发送速率|Byte/s|
|workspace\_net\_bytes\_received|企业空间网络数据接受速率|Byte/s|
|workspace\_pod\_count|企业空间内非终止阶段 Pod 数量[^1]||
|workspace\_pod\_running\_count|企业空间内处于 Running 阶段的 Pod 数量||
|workspace\_pod\_succeeded\_count|企业空间内处于 Succeeded 阶段的 Pod 数量||
|workspace\_pod\_abnormal\_count|企业空间异常 Pod 数量||
|workspace\_pod\_abnormal\_ratio|企业空间异常 Pod 比例||
|workspace\_ingresses\_extensions\_count|企业空间 Ingress 数||
|workspace\_cronjob\_count|企业空间 CronJob 数||
|workspace\_pvc\_count|企业空间 PersistentVolumeClaim 数||
|workspace\_daemonset\_count|企业空间 DaemonSet 数||
|workspace\_deployment\_count|企业空间 Deployment 数||
|workspace\_endpoint\_count|企业空间 Endpoint 数||
|workspace\_hpa\_count|企业空间 Horizontal Pod Autoscaler 数||
|workspace\_job\_count|企业空间 Job 数||
|workspace\_statefulset\_count|企业空间 StatefulSet 数||
|workspace\_replicaset\_count|企业空间 ReplicaSet 数||
|workspace\_service\_count|企业空间 Service 数||
|workspace\_secret\_count|企业空间 Secret 数||
|workspace\_all\_project\_count|企业空间下项目总数||

**【说明】**

[^1] 非终止阶段的 Pod 指处于 Pending、Running、Unkown 阶段的 Pod，不包含被成功终止，或者因非 0 状态退出被系统终止的 Pod。参考：[Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)

**若 Workspace Monitoring API 设置了查询参数 type 为 statistics，则返回企业空间统计信息：**

|指标名|说明|单位|
|---|---|---|
|workspace\_all\_organization\_count|集群企业空间总数||
|workspace\_all\_account\_count|集群账号总数||
|workspace\_all\_project\_count|集群项目总数||
|workspace\_all\_devops\_project\_count[^1]|集群 DevOps 工程总数||
|workspace\_namespace\_count|企业空间项目总数||
|workspace\_devops\_project\_count|企业空间 DevOps 工程总数||
|workspace\_member\_count|企业空间成员数||
|workspace\_role\_count[^2]|企业空间角色数||

**【说明】**

[^1] 前四个指标适用于 /kapis/devops.kubesphere.io/v1alpha2/workspaces

[^2] 后四个指标适用于 /kapis/devops.kubesphere.io/v1alpha2/workspaces/{workspace}

## Namespace

|指标名|说明|单位|
|---|---|---|
|namespace\_cpu\_usage|项目 CPU 用量|Core|
|namespace\_memory\_usage|项目内存使用量（包含缓存）|Byte|
|namespace\_memory\_usage\_wo\_cache|项目内存使用量|Byte|
|namespace\_net\_bytes\_transmitted|项目网络数据发送速率|Byte/s|
|namespace\_net\_bytes\_received|项目网络数据接受速率|Byte/s|
|namespace\_pod\_count|项目内非终止阶段 Pod 数量||
|namespace\_pod\_running\_count|项目内处于 Running 阶段的 Pod 数量||
|namespace\_pod\_succeeded\_count|项目内处于 Succeeded 阶段的 Pod 数量||
|namespace\_pod\_abnormal\_count|项目异常 Pod 数量||
|namespace\_pod\_abnormal\_ratio|项目异常 Pod 比例||
|namespace\_cronjob\_count|项目 CronJob 数||
|namespace\_pvc\_count|项目 PersistentVolumeClaim 数||
|namespace\_daemonset\_count|项目 DaemonSet 数||
|namespace\_deployment\_count|项目 Deployment 数||
|namespace\_endpoint\_count|项目 Endpoint 数||
|namespace\_hpa\_count|项目 Horizontal Pod Autoscaler 数||
|namespace\_job\_count|项目 Job 数||
|namespace\_statefulset\_count|项目 StatefulSet 数||
|namespace\_replicaset\_count|项目 ReplicaSet 数||
|namespace\_service\_count|项目 Service 数||
|namespace\_secret\_count|项目 Secret 数||
|namespace\_ingresses\_extensions\_count|项目 Ingress 数||

## Workload

|指标名|说明|单位|
|---|---|---|
|workload\_pod\_cpu\_usage|工作负载[^1] CPU 用量|Core|
|workload\_pod\_memory\_usage|工作负载内存使用量（包含缓存）|Byte|
|workload\_pod\_memory\_usage\_wo\_cache|工作负载内存使用量|Byte|
|workload\_pod\_net\_bytes\_transmitted|工作负载网络数据发送速率|Byte/s|
|workload\_pod\_net\_bytes\_received|工作负载网络数据接受速率|Byte/s|
|workload\_deployment\_replica| Deployment 期望副本数 ||
|workload\_deployment\_replica\_available| Deployment 可用副本数[^2] ||
|workload\_deployment\_unavailable\_replicas\_ratio| Deployment 不可用副本数比例[^3] ||
|workload\_statefulset\_replica| StatefulSet 期望副本数||
|workload\_statefulset\_replica\_available| StatefulSet 可用副本数||
|workload\_statefulset\_unavailable\_replicas\_ratio| StatefulSet 不可用副本数比例||
|workload\_daemonset\_replica| DaemonSet 期望副本数||
|workload\_daemonset\_replica\_available| DaemonSet 可用副本数||
|workload\_daemonset\_unavailable\_replicas\_ratio| DaemonSet 不可用副本数比例||

**【说明】**

[^1] 目前支持的工作负载类型包括：Deployment，StatefulSet 和 DaemonSet。

[^2] 可用副本指工作负载创建出的 Pod 处于可用状态，即该 Pod 的 status.conditions.ContainersReady 字段值为 true。

[^3] 不可用副本数比例：不可用副本数 / 期望副本数。

## Pod

|指标名|说明|单位|
|---|---|---|
|pod\_cpu\_usage|容器组 CPU 用量|Core|
|pod\_memory\_usage|容器组内存使用量（包含缓存）|Byte|
|pod\_memory\_usage\_wo\_cache|容器组内存使用量|Byte|
|pod\_net\_bytes\_transmitted|容器组网络数据发送速率|Byte/s|
|pod\_net\_bytes\_received|容器组网络数据接受速率|Byte/s|

## Container

|指标名|说明|单位|
|---|---|---|
|container\_cpu\_usage|容器 CPU 用量|Core|
|container\_memory\_usage|容器内存使用量（包含缓存）|Byte|
|container\_memory\_usage\_wo\_cache|容器内存使用量|Byte|

## Component

|指标名|说明|单位|
|---|---|---|
|etcd\_server\_list|etcd 集群节点列表[^1]||
|etcd\_server\_total|etcd 集群节点总数||
|etcd\_server\_up\_total|etcd 集群在线节点数||
|etcd\_server\_has\_leader|etcd 集群各节点是否有 leader[^2]||
|etcd\_server\_leader\_changes|etcd 集群各节点观察到 leader 变化数（ 1h 内）||
|etcd\_server\_proposals\_failed\_rate|etcd 集群各节点提案失败[^3]频率平均数|次/s|
|etcd\_server\_proposals\_applied\_rate|etcd 集群各节点提案应用频率平均数|次/s|
|etcd\_server\_proposals\_committed\_rate|etcd 集群各节提案提交频率平均数|次/s|
|etcd\_server\_proposals\_pending\_count|etcd 集群各节点排队提案数平均值||
|etcd\_mvcc\_db\_size|etcd 集群各节点数据库大小平均值|Byte|
|etcd\_network\_client\_grpc\_received\_bytes|etcd 集群向 gRPC 客户端发送数据速率|Byte/s|
|etcd\_network\_client\_grpc\_sent\_bytes|etcd 集群接受 gRPC 客户端数据速率|Byte/s|
|etcd\_grpc\_call\_rate|etcd 集群 gRPC 请求速率|次/s|
|etcd\_grpc\_call\_failed\_rate|etcd 集群 gRPC 请求失败速率|次/s|
|etcd\_grpc\_server\_msg\_received\_rate| etcd 集群 gRPC 流式消息接收速率|次/s|
|etcd\_grpc\_server\_msg\_sent\_rate| etcd 集群 gRPC 流式消息发送速率|次/s|
|etcd\_disk\_wal\_fsync\_duration|etcd 集群各节点 WAL 日志同步时间平均值|秒|
|etcd\_disk\_wal\_fsync\_duration\_quantile|etcd 集群 WAL 日志同步时间平均值（按分位数统计）[^4]|秒|
|etcd\_disk\_backend\_commit\_duration|etcd 集群各节点库同步时间[^5]平均值|秒|
|etcd\_disk\_backend\_commit\_duration\_quantile|etcd 集群各节点库同步时间平均值（按分位数统计）|秒|
|apiserver\_up\_sum|APIServer [^6]在线实例数||
|apiserver\_request\_rate|APIServer 每秒接受请求数||
|apiserver\_request\_by\_verb\_rate|APIServer 每秒接受请求数（按 HTTP 请求方法分类统计）||
|apiserver\_request\_latencies|APIServer 请求平均迟延|秒|
|apiserver\_request\_by\_verb\_latencies|APIServer 请求平均迟延（按 HTTP 请求方法分类统计）|秒|
|scheduler\_up\_sum|调度器[^7]在线实例数||
|scheduler\_schedule\_attempts|调度器累计调度次数 [^8]||
|scheduler\_schedule\_attempt\_rate|调度器调度频率|次/s|
|scheduler\_e2e\_scheduling\_latency|调度器调度延迟|秒|
|scheduler\_e2e\_scheduling\_latency\_quantile|调度器调度延迟（按分位数统计）|秒|
|controller\_manager\_up\_sum|Controller Manager[^9] 在线实例数||
|coredns\_up\_sum|CoreDNS 在线实例数||
|coredns\_cache\_hits|CoreDNS 缓存命中频率|次/s|
|coredns\_cache\_misses| CoreDNS 缓存未命中频率|次/s|
|coredns\_dns\_request\_rate|CoreDNS 每秒请求数||
|coredns\_dns\_request\_duration|CoreDNS 请求耗时|秒|
|coredns\_dns\_request\_duration\_quantile|CoreDNS 请求耗时（按分位数统计）|秒|
|coredns\_dns\_request\_by\_type\_rate|CoreDNS 每秒请求数（按请求类型分类统计）||
|coredns\_dns\_request\_by\_rcode\_rate|CoreDNS 每秒请求数（按 rcode 分类统计）||
|coredns\_panic\_rate|CoreDNS 异常发生频率|次/s|
|coredns\_proxy\_request\_rate|CoreDNS 代理每秒请求数||
|coredns\_proxy\_request\_duration|CoreDNS 代理请求耗时|秒|
|coredns\_proxy\_request\_duration\_quantile|CoreDNS 代理请求耗时（按分位数统计）|秒|
|prometheus\_up\_sum|Prometheus 在线实例数量||
|prometheus\_tsdb\_head\_samples\_appended\_rate|Prometheus 每秒存储监控指标数||

**【说明】**

[^1] 如果某一节点返回值为 1 说明该 etcd 节点在线，0 说明节点下线。

[^2] 如果某一节点返回值为 0 说明该节点没有leader ，即该节点不可使用；如果集群中，所有节点都没有任何 leader ，则整个集群不可用。

[^3] 中英文对照说明：提案（consensus proposals）,失败提案（failed proposals），已提交提案（commited proposals），应用提案（applied proposals），排队提案（pending proposals）。

[^4] 支持三种分位数统计：99th 百分位数、90th 百分位数、中位数。

[^5] 反映磁盘 I/O 延迟。如果数值过高，通常表示磁盘问题。

[^6] 指 kube-apiserver。

[^7] 指 kube-scheduler。

[^8] 按调度结果分类统计：error（因调度器异常而无法调度的 Pod 数量），scheduled（成功被调度的 Pod 数量），unschedulable（无法被调度的 Pod 数量）。

[^9] 指 kube-controller-manager。