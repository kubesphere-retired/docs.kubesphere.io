---
title: "Monitoring Metrics"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere resource monitoring has eight levels: Cluster, Node, Workspace, Namespace, Workload, Pod, Container, and Component (KubeSphere core component).

## Cluster

|Metric|Description|Unit|
|---|---|---|
|cluster\_cpu\_utilisation|CPU utilization of the cluster||
|cluster\_cpu\_usage|CPU usage of the cluster|Core|
|cluster\_cpu\_total|Total CPU resources of the cluster|Core|
|cluster\_load1|One-minute CPU load average of the cluster[^1]||
|cluster\_load5|5-minute CPU load average of the cluster||
|cluster\_load15|15-minute CPU load average of the cluster||
|cluster\_memory\_utilisation|Memory utilization of the cluster||
|cluster\_memory\_available|Available memory of the cluster|Byte|
|cluster\_memory\_total|Total memory of the cluster|Byte|
|cluster\_memory\_usage\_wo\_cache|Memory usage of the cluster[^2]|Byte|
|cluster\_net\_utilisation|Network data transmission rate of the cluster|Byte/s|
|cluster\_net\_bytes\_transmitted|Bytes sent in the cluster|Byte/s|
|cluster\_net\_bytes\_received|Bytes received in the cluster|Byte/s|
|cluster\_disk\_read\_iops|Disk read bytes per second in the cluster|Byte/s|
|cluster\_disk\_write\_iops|Disk write bytes per second in the cluster|Byte/s|
|cluster\_disk\_read\_throughput|Data read from the disk per second|Byte/s|
|cluster\_disk\_write\_throughput|Data written into the disk per second|Byte/s|
|cluster\_disk\_size\_usage|Disk usage of the cluster|Byte|
|cluster\_disk\_size\_utilisation|Disk utilization of the cluster||
|cluster\_disk\_size\_capacity|Total disk capacity of the cluster|Byte|
|cluster\_disk\_size\_available|Available disk space of the cluster|Byte|
|cluster\_disk\_inode\_total|Total number of inodes in the cluster||
|cluster\_disk\_inode\_usage|Number of used inodes in the cluster||
|cluster\_disk\_inode\_utilisation|inode usage percentage in the cluster||
|cluster\_node\_online|Number of online nodes in the cluster||
|cluster\_node\_offline|Number of offline cluster nodes||
|cluster\_node\_offline\_ratio|Ratio of offline cluster nodes||
|cluster\_node\_total|Total number of cluster nodes||
|cluster\_pod\_count|Number of scheduled Pods in the cluster[^3]||
|cluster\_pod\_quota|Sum of maximum capacity of Pods on each node in the cluster[^4]||
|cluster\_pod\_utilisation|Percentage of maximum capacity of Pods used in the cluster||
|cluster\_pod\_running\_count|Number of Pods in the Running state in the cluster[^5]||
|cluster\_pod\_succeeded\_count|Number of Pods in the Succeeded state in the cluster||
|cluster\_pod\_abnormal\_count|Number of abnormal Pods in the cluster [^6]||
|cluster\_pod\_abnormal\_ratio|Ratio of abnormal Pods in the cluster [^7]||
|cluster\_ingresses\_extensions\_count|Number of Ingresses in the cluster||
|cluster\_cronjob\_count|Number of CronJobs in the cluster||
|cluster\_pvc\_count|Number of PersistentVolumeClaims in the cluster||
|cluster\_daemonset\_count|Number of DaemonSets in the cluster||
|cluster\_deployment\_count|Number of Deployments in the cluster||
|cluster\_endpoint\_count|Number of Endpoints in the cluster||
|cluster\_hpa\_count|Number of Horizontal Pod Autoscalers in the cluster||
|cluster\_job\_count|Number of Jobs in the cluster||
|cluster\_statefulset\_count|Number of StatefulSets in the cluster||
|cluster\_replicaset\_count|Number of ReplicaSets in the cluster||
|cluster\_service\_count|Number of Services in the cluster||
|cluster\_secret\_count|Number of Secrets in the cluster||
|cluster\_namespace\_count|Number of Namespaces in the cluster||

**Note**

[^1] Specifies the average number of processes in the runnable or uninterruptible state in the CPU run queue at a specified time. If the value is greater than 1, it indicates that the CPU is not able to serve the processes, and there are processes in the waiting state.

[^2] Excludes buffers and cache.

[^3] The Pod has been scheduled to a node, that is, **status.conditions.PodScheduled = true**. Please refer to [Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions).

[^4] The maximum capacity of nodes to accommodate is generally set to **110** by default. Please refer to [kubelet Options](https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/#options).

[^5] Running indicates that the Pod has been bound to a node, and all the containers in the Pod have been created. At least one container is running or is being started or restarted. Please refer to [Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase).

[^6] Abnormal Pods: If the value of **status.conditions.ContainersReady** for a Pod is **false**, it means that the Pod is not available. When determining if a Pod is abnormal, we also need to consider that the Pod may be in the ContainerCreating state or in the Succeeded state. Taking all these situations into account, the algorithm for calculating the number of abnormal Pods can be represented as follows: Abnormal Pods = Total Pods - ContainersReady Pods - ContainerCreating Pods - Succeeded Pods.

[7] Abnormal Pod ratio: Abnormal Pods/Pods not in the Succeeded state.

## Node

|Metric|Description|Unit|
|---|---|---|
|node\_cpu\_utilisation|CPU utilization of the node||
|node\_cpu\_total|Total CPU resources of the node|Core|
|node\_cpu\_usage|CPU usage of the node|Core|
|node\_load1|One-minute CPU load average of the node||
|node\_load5|5-minute CPU load average of the node||
|node\_load15|15-minute CPU load average of the node||
|node\_memory\_utilisation|Memory utilization of the node||
|node\_memory\_usage\_wo\_cache|Memory usage of the node[^1]|Byte|
|node\_memory\_available|Available memory of the node|Byte|
|node\_memory\_total|Total memory of the node|Byte|
|node\_net\_utilisation|Network data transmission rate of the node|Byte/s|
|node\_net\_bytes\_transmitted|Bytes sent on the node|Byte/s|
|node\_net\_bytes\_received|Bytes received on the node|Byte/s|
|node\_disk\_read\_iops|Disk read bytes per second on the node|Byte/s|
|node\_disk\_write\_iops|Disk write bytes per second on the node|Byte/s|
|node\_disk\_read\_throughput|Data read from the disk per second|Byte/s|
|node\_disk\_write\_throughput|Data written into the disk per second|Byte/s|
|node\_disk\_size\_capacity|Total disk capacity|Byte|
|node\_disk\_size\_available|Available disk capacity|Byte|
|node\_disk\_size\_usage|Disk usage of the node|Byte|
|node\_disk\_size\_utilisation|Node disk usage||
|node\_disk\_inode\_total|Total inodes of the node||
|node\_disk\_inode\_usage|Used inodes of the node||
|node\_disk\_inode\_utilisation|Inode usage||
|node\_pod\_count|Number of scheduled Pods||
|node\_pod\_quota|Maximum capacity of the node||
|node\_pod\_utilisation|Maximum capacity usage of the pods ||
|node\_pod\_running\_count|Number of Pods in the Running state on the node||
|node\_pod\_succeeded\_count|Number of Pods in the Succeeded state on the node||
|node\_pod\_abnormal\_count|Number of abnormal Pods on the node||
|node\_pod\_abnormal\_ratio|Ratio of abnormal Pods||

**Note**

[^1] Excludes buffers and cache.

## Workspace

|Metric|Description|Unit|
|---|---|---|
|workspace\_cpu\_usage|CPU usage of the workspace|Core|
|workspace\_memory\_usage|Memory usage of the workspace (including cache)|Byte|
|workspace\_memory\_usage\_wo\_cache|Memory usage of the workspace|Byte|
|workspace\_net\_bytes\_transmitted|Bytes sent in the workspace|Byte/s|
|workspace\_net\_bytes\_received|Bytes received in the workspace|Byte/s|
|workspace\_pod\_count|Number of non-terminating Pods in the workspace[^1]||
|workspace\_pod\_running\_count|Number of Pods in the Running state in the workspace||
|workspace\_pod\_succeeded\_count|Number of Pods in the Succeeded state in the workspace||
|workspace\_pod\_abnormal\_count|Number of abnormal Pods in the workspace||
|workspace\_pod\_abnormal\_ratio|Ratio of abnormal Pods in the workspace||
|workspace\_ingresses\_extensions\_count|Number of Ingresses in the workspace||
|workspace\_cronjob\_count|Number of CronJobs in the workspace||
|workspace\_pvc\_count|Number of PersistentVolumeClaims in the workspace||
|workspace\_daemonset\_count|Number of DaemonSets in the workspace||
|workspace\_deployment\_count|Number of Deployments in the workspace||
|workspace\_endpoint\_count|Number of Endpoints in the workspace||
|workspace\_hpa\_count|Number of Horizontal Pod Autoscalers in the workspace||
|workspace\_job\_count|Number of Jobs in the workspace||
|workspace\_statefulset\_count|Number of StatefulSets in the workspace||
|workspace\_replicaset\_count|Number of ReplicaSets in the workspace||
|workspace\_service\_count|Number of Services in the workspace||
|workspace\_secret\_count|Number of Secrets in the workspace||
|workspace\_all\_project\_count|Total number of projects in the workspace||


**Note**

[^1] Pods in the non-termination state refer to Pods in the Pending, Running, and Unkown states, and exclude Pods that have been successfully terminated, or that have been terminated by the system for exiting in a non-zero state. Please refer to [Pod Lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions).

**If the Workspace Monitoring API sets the type of the query parameter to statistics, the workspace statistics are returned:**

|Metric|Description|Unit|
|---|---|---|
|workspace\_all\_organization\count|Total number of workspaces in the cluster||
|workspace\\all\_account\_count|Total number of accounts in the cluster||
|workspace\_all\_project\_count|Total number of projects in the cluster||
|workspace\_all\_devops\_project\count[^1]|Total number of DevOps projects in the cluster||
|workspace\_namespace\_count|Total number of projects in the workspace||
|workspace\_devops\_project\count|Total number of DevOps projects in the workspace||
|workspace\_member\_count|Number of members in the workspace||
|workspace\_role\_count[^2]|Number of roles in the workspace||

**Note**

[^1] The first four metrics apply to /kapis/devops.kubesphere.io/v1alpha2/workspaces.

[^2] The last four metrics apply to /kapis/devops.kubesphere.io/v1alpha2/workspaces/{workspace}.

## Namespace

|Metric|Description|Unit|
|---|---|---|
|namespace\_cpu\_usage|CPU usage of the project|Core|
|namespace\_memory\_usage|Memory usage of the project (including cache)|Byte|
|namespace\_memory\_usage\_wo\_cache|Memory usage of the project|Byte|
|namespace\_net\_bytes\_transmitted|Bytes sent in the project|Byte/s|
|namespace\_net\_bytes\_received|Bytes received in the project|Byte/s|
|namespace\_pod\_count|Number of non-terminating Pods in the project||
|namespace\_pod\_running\_count|Number of Pods in the Running state of the project||
|namespace\_pod\_succeeded\_count|Number of Pods in the Succeeded state of the project||
|namespace\_pod\_abnormal\count|Number of abnormal Pods in the project||
|namespace\_pod\_abnormal\_ratio|Ratio of abnormal Pods in the project||
|namespace\_cronjob\_count|Number of CronJobs in the project||
|namespace\_pvc\_count|Number of PersistentVolumeClaims in the project||
|namespace\_daemonset\_count|Number of DaemonSets in the project||
|namespace\_deployment\_count|Number of Deployments in the project||
|namespace\_endpoint\_count|Number of Endpoints in the project||
|namespace\_hpa\_count|Number of Horizontal Pod Autoscalers in the project||
|namespace\_job\_count|Number of Jobs in the project||
|namespace\_statefulset\_count|Number of StatefulSets in the project||
|namespace\_replicaset\_count|Number of ReplicaSets in the project||
|namespace\_service\_count|Number of Services in the project||
|namespace\_secret\_count|Number of Secrets in the project||
|namespace\_ingresses\_extensions\_count|Number of Ingresses in the project||

## Workload

|Metric|Description|Unit|
|---|---|---|
|workload\_pod\_cpu\_usage|[^1] CPU usage of the workload|Core|
|workload\_pod\_memory\_usage|Memory usage of the workload (including cache)|Byte|
|workload\_pod\_memory\_usage\_wo\_cache|Memory usage of the workload|Byte|
|workload\_pod\_net\_bytes\_transmitted|Bytes sent on the workload|Byte/s|
|workload\_pod\_net\_bytes\_received|Bytes recevied on the workload|Byte/s|
|workload\_deployment\_replica|Number of expected deployment replicas||
|workload\_deployment\_replica\_available|Available deployment replicas[^2] ||
|| workload\_deployment\_unavailable\_replicas\_ratio|Ratio of unavailable deployment replicas[^3] ||
|| workload\_statefulset\_replica|Number of expected StatefulSet replicas||
|workload\_statefulset\_replica\_available| Number of available StatefulSet replicas||
|workload\_statefulset\_unavailable\_replicas\_ratio|Ratio of unavailable StatefulSet replicas||
|workload\_daemonset\_replica|Number of expected DaemonSet replicas||
|workload\_daemonset\_replica\_available|Number of available DaemonSet replicas||
|workload\_daemonset\_unavailable\_replicas\_ratio|Ration of unavailable DaemonSet replicas||

**Note**

[^1] Currently supported workload types are Deployment, StatefulSet and DaemonSet.

[^2] Available replicas means that the Pod created by the workload is available, that is, the value of **status.conditions.ContainersReady** of the Pod is **true**.

[^3] Ratio of unavailable replicas: Unavailable replicas/Expected replicas.

## Pod

|Metric|Description|Unit|
|---|---|---|
|pod\_cpu\_usage|CPU usage of the pod|Core|
|pod\_memory\_usage|Memory usage of the pod (including cache)|Byte|
|pod\_memory\_usage\_wo\_cache|Memory usage of the pod|Byte|
|pod\_net\_bytes\_transmitted|Bytes sent in the pod|Byte/s|
|pod\_net\_bytes\_received|Bytes recevied in the pod|Byte/s|

## Container

|Metric|Description|Unit|
|--|--|--|
|container\_cpu\_usage|CPU usage of the container|Core|
|container\_memory\_usage|Memory usage of the container (including cache)|Byte|
|container\_memory\_usage\_wo\_cache|Memory usage of the container|Byte|

## Component

|Metric|Description|Unit|
|---|---|---|
|etcd\_server\_list|List of nodes in the etcd cluster[^1]||
|etcd\_server\_total|Total number of nodes in the etcd cluster||
|etcd\_server\_up\_total|Number of online nodes in the etcd cluster||
|etcd\_server\_has\_leader|Whether each node has a leader in the etcd cluster[^2]||
|etcd\_server\_leader\_changes|Leader changes observed by each node in the etcd cluster (within 1h)||
|etcd\_server\_proposals\_failed\_rate|Average rate of failed proposals [^3] by each node in the etcd cluster| times/s|
|etcd\_server\_proposals\_applied\_rate|Average proposal apply rate by each node in the etcd cluster|times/s|
|etcd\_server\_proposals\_committed\_rate|Average proposal submission rate by each node in the etcd cluster|times/s|
|etcd\_server\_proposals\_pending\_count|Average proposal queue rate by each node in the etcd cluster||
|etcd\_mvcc\_db\_size|Average size of databases on each node in the etcd cluster|Byte|
|etcd\_network\_client\_grpc\_received\_bytes|Bytes received by the etcd cluster from gRPC clients|Byte/s|
|etcd\_network\_client\_grpc\_sent\_bytes|Bytes sent to gRPC clients from the etcd cluster|Byte/s|
|etcd\_grpc\_call\_rate|gRPC request rate in the etcd cluster|sent/s|
|etcd\_grpc\_call\_failed\_rate|gRPC request failure rate in the etcd cluster|times/s|
|etcd\_grpc\_server\_msg\_received\_rate| gRPC streaming message reception rate in the etcd cluster|times/s|
|etcd\_grpc\_server\_msg\_sent\_rate|gRPC streaming message send rate in the etcd cluster| times/s|
|etcd\_disk\_wal\_fsync\_duration|WAL log synchronization time average across nodes in the etcd cluster|seconds|
|etcd\_disk\_wal\_fsync\_duration\_quantile|WAL log synchronization time average in the etcd cluster (by quantile statistics)[^4]|seconds|
|etcd\_disk\_backend\_commit\_duration|Library synchronization time on each node in the etcd cluster[^5]|seconds|
|etcd\_disk\_backend\_commit\_duration\_quantile|Average library synchronization time on each node in the etcd cluster (by quantile)|seconds|
|apiserver\_up\_sum|[^6]Number of online APIServer instances||
|apiserver\_request\_rate|Number of requests accepted by the APIServer per second||
|apiserver\_request\_by\_verb\_rate|Number of requests accepted by the APIServer per second (by HTTP request method)||
|apiserver\_request\_latencies|Average request latency of the APIServer|seconds||
|apiserver\_request\_by\_verb\_latencies|Average latency of requests of the APIServer (by HTTP request method)|seconds|
|scheduler\_up\sum|[^7] Number of online Scheduler instances||
|scheduler\_schedule\_attempts|Cumulative number of scheduled Schedulers[^8]||
|scheduler\_schedule\_attempt\_rate|Scheduling frequency of the Scheduler|times/s|
|scheduler\_e2e\_scheduling\_latency|Scheduling latency of the Scheduler|seconds|
|scheduler\_e2e\_scheduling\_latency\_quantile|Scheduling latency of the Scheduler (by quantile)|seconds|
|controller\_manager\_up\sum|[^9]Number of online Controller Manager instances||
|coredns\_up\_sum|Online CoreDNS instances||
|coredns\_cache\_hits|Cache hit frequency of CoreDNS| times/s|
|coredns\_cache\_misses|Cache misses of CoreDNS| times/s|
|coredns\_dns\_request\_rate|CoreDNS requests per second||
|coredns\_dns\_request\_duration|CoreDNS request elapsed time|seconds|
|coredns\_dns\_request\_duration\_quantile|CoreDNS request elapsed time (by quantile)|seconds|
|coredns\_dns\_request\_by\_type\_rate|CoreDNS requests per second (breakdown statistics by request type)||
|coredns\_dns\_request\_by\_rcode\_rate|CoreDNS requests per second (statistics by rcode)||
|coredns\_panic\_rate|CoreDNS exception frequency| times/s|
|coredns\_proxy\_request\_rate|CoreDNS proxy requests per second||
|coredns\_proxy\_request\_duration|CoreDNS proxy request elapsed time|seconds|
|coredns\_proxy\_request\_duration\_quantile|CoreDNS proxy request elapsed time (by quantile)|seconds|
|prometheus\_up\_sum|Online Prometheus instances||
|prometheus\_tsdb\_head\_samples\_appended\_rate|Number of stored monitoring metrics of Prometheus per second||

**Note**

[^1] If a node returns **1**, it indicates that the etcd node is online, and **0** means the node is offline.

[^2] If a node returns **0**, it indicates that the node does not have a leader, that is, the node is unavailable. If all nodes in the cluster do not have any leader, the whole cluster is unavailable.

[^3] Consensus proposals, failed proposals, commited proposals, applied proposals, and pending proposals.

[^4] Supports three quantile statistics: 99th percentile, 90th percentile, and median.

[^5] Reflects disk I/O latency. If the value is too high, it usually indicates disk errors.

[^6] Refers to kube-apiserver.

[^7] Refers to kube-scheduler.

[^8] Statistics by scheduling results: error (number of Pods that could not be scheduled due to scheduler exceptions), scheduled (number of Pods that were successfully scheduled), unschedulable (number of Pods that could not be scheduled).

[^9] Refers to kube-controller-manager.