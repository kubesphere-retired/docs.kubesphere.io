---
title: "守护进程集"
---

守护进程集 (DaemonSet)，保证在每个 Node 上都运行一个容器副本，常用来部署一些集群的日志、监控或者其他系统管理应用。典型的应用场景包括：

- 日志收集，比如 Fluentd，Logstash 等。
- 系统监控，比如 Prometheus Node Exporter，collectd，New Relic agent，Ganglia gmond 等。
- 系统程序，比如 kube-proxy, kube-dns, Gluster, Ceph 等。

## 创建守护进程集 

首先登录 KubeSphere 控制台，访问左侧菜单栏，在 **工作负载** 菜单下，点击 **守护进程集** 按钮进入列表页。左上角为当前所在项目，点击下拉框可以切换到其他的项目。选择不同的项目，就可以看到对应项目下的所有守护进程集。如果是管理员登录，可以看到集群所有项目的守护进程集情况，如果是普通用户，则只能查看授权项目下的所有守护进程集。列表顶部显示了当前项目的守护进程集 Pod 配额和数量信息。右上角的条形图显示近一周内 Pod 数量的一个变化统计。

![守护进程集 - 列表页](/ae_daemonset_list.png)  

1、点击右上角 **创建** 按钮，工作负载类型选择创建守护进程集，将弹出创建守护进程集的详情页。创建守护进程集支持三种方式，**页面创建**，**导入 yaml 文件** 创建，**编辑模式** 创建。以下主要介绍页面创建的方式，若选择以编辑模式，可点击右上角编辑模式进入代码界面，支持 yaml 和 json 格式。左上角显示配置文件列表和导入导出按钮。其中导入 yaml 文件方式会自动将 yaml 文件内容填充到页面上，用户根据需要可以在页面上调整后再行创建。编辑模式可以方便习惯命令行操作的用户直接在页面上编辑 yaml 文件并创建守护进程集。

![创建守护进程集 - 代码模式](/ae_daemonset_create_command.png)


在基本信息页，需要输入守护进程集的名称并选择创建守护进程集的项目，用户可以根据需求填写守护进程集的描述信息。在 Kubernetes 中策略是指定新的 Pod 替换旧的 Pod 的策略，守护进程集的更新策略分为 `RollingUpdate` 和 `OnDelete` 两种类型：

- RollingUpdate：Deployment 使用滚动更新（[Rolling-update](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#rolling-update)）的方式更新 Pod。您可以指定 maxUnavailable 和 MinReadySeconds 来控制滚动更新的进程。

   - MaxUnavailable 是可选配置项，当前默认值是 1。用来指定在升级过程中不可用 Pod 的最大数量。该值可以是一个绝对值，也可以是期望 Pod 数量的百分比（例如 10% ）。通过计算百分比的绝对值向下取整。
   - MinReadySeconds 是一个可选配置项，默认是0（Pod在ready后就会被认为是可用状态）。用来指定没有任何容器 crash 的 Pod 并被认为是可用状态的最小秒数。进一步了解什么情况下 Pod 会被认为是 ready 状态，参阅 [Kubernetes 官方文档 - Container Probes](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。

- OnDelete：设置为 OnDelete 时，StatefulSet 控制器将不会自动更新 StatefulSet 中的 Pod。用户必须手动删除旧版本 Pod 以触发控制器创建新的 Pod。


![创建守护进程集](/ae_daemonset_create_basic.png)

2、在 **容器组模板** 页面，用户可以根据需求对容器组进行配置。容器组可以包含一个或者多个容器，要求输入容器的名称和对应的镜像名。如果用户有更进一步的需求，可以点击 **高级选项**。高级选项中可以对 CPU 和内存的资源使用进行限定。
**表1：CPU 配额说明**

|参数|说明|
|---|---|
|**requests**|容器使用的最小 CPU 需求，作为容器调度时资源分配的判断依赖。<br> 只有当节点上可分配CPU总量 ≥ 容器 CPU 申请数时，才允许将容器调度到该节点。|
|**limits**|容器能使用的 CPU 最大值，超过这个限定值，容器可能会被 kill。|

**表2：内存配额说明**

|参数|说明|
|---|---|
|**requests**|容器使用的最小内存需求，作为容器调度时资源分配的判断依赖。<br> 只有当节点上可分配内存总量 ≥ 容器内存申请数时，才允许将容器调度到该节点。|
|**limits**|容器能使用的内存最大值。当内存使用率超出设置的内存限制值时，该实例可能会被重启从而影响工作负载。|

在默认情况下，镜像会运行默认命令和参数，如果想运行特定命令或重写镜像默认值，可在高级选项的命令和参数中设置，此外还可以设置端口和环境变量。

- **命令**： 可自定义容器的启动命令，Kubernetes 的容器启动命令可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#run-a-command-in-a-shell)。
- **参数**： 可自定义容器的启动参数，Kubernetes 的容器启动的参数可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/)。
- **端口**： 即容器端口，用于指定容器需要暴露的端口，端口协议可以选择 TCP 和 UDP。
- **目标端口**： 在当前集群下的所有节点上打开一个真实的端口号，映射到容器端口。
- **环境变量**： 环境变量是指容器运行环境中设定的一个变量，与 Dockerfile 中的 “ENV” 效果相同，为创建的工作负载提供极大的灵活性。

上述配置信息填写完成以后，点击下一步。

![创建守护进程集 - 容器组](/ae_daemonset_create_container.png)

3、在存储卷页面可以添加 **持久化存储卷**，**临时存储卷** 和 **HostPath**。其中，持久化存储卷可用于持久化存储用户数据；保留在临时存储卷中的数据，在容器组被删除以后，也将被同步删除。HostPath 直接将主机目录挂载到容器。注意，设置 HostPath 允许挂载主机上的文件系统到容器组里面去。如果容器组需要使用主机上的文件，可以使用 HostPath。

![创建守护进程集 - 存储卷](/ae_daemonset_create_PVC.png)

当选择使用 HostPath 时，用户需要填写存储卷的名称，指定 HostPath 和容器内部的挂载点，点击挂载和确定。然后点击下一步。

![创建守护进程集 - HostPath](/ae_daemonset_create_HostPath.png)

4、标签设置页用于指定守护进程集对应的一组或者多组标签。

![创建守护进程集 - 标签](/ae_daemonset_create_label.png)

5、节点选择器页面，用户可以通过按节点选择或通过 NodeSelector 设置一组或者多组键值对来指定期望运行容器组的主机。当不指定时，将会在集群内的所有节点上启动容器组。点击右下角的创建后，集群就会按照用户的配置创建对应的守护进程集。

![创建守护进程集 - 节点选择器](/ae_daemonset_create_nodeselector.png)
 


