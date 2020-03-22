---
title: "守护进程集"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

守护进程集 (DaemonSet)，保证在每个 Node 上都运行一个容器副本，常用来部署一些集群的日志、监控或者其他系统管理应用。典型的应用场景包括：

- 日志收集，比如 Fluentd, Logstash 等。
- 系统监控，比如 Prometheus Node Exporter, collectd, New Relic agent, Ganglia gmond 等。
- 系统程序，比如 kube-proxy, kube-dns, Gluster, Ceph 等。

## 创建守护进程集 

登录 KubeSphere 控制台，在已创建的项目中选择 **工作负载 → 守护进程集**，进入守护进程集列表页面。

左上角为当前所在项目，点击下拉框可以切换到其他的项目。如果是管理员登录，可以看到集群所有项目的守护进程集情况，如果是普通用户，则只能查看授权项目下的所有守护进程集。列表顶部显示了当前项目的守护进程集 Pod 配额和数量信息。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514092514.png)

### 第一步：填写基本信息

1.1. 点击 **创建守护进程集** 按钮，将弹出创建守护进程集的详情页。创建守护进程集支持三种方式，**页面创建**，**导入 yaml 文件** 创建，**编辑模式** 创建。以下主要介绍页面创建的方式，若选择以编辑模式，可点击右上角编辑模式进入代码界面，支持 yaml 和 json 格式。左上角显示配置文件列表和导入导出按钮。其中导入 yaml 文件方式会自动将 yaml 文件内容填充到页面上，用户根据需要可以在页面上调整后再行创建。编辑模式可以方便习惯命令行操作的用户直接在页面上编辑 yaml 文件并创建守护进程集。

![创建守护进程集 - 代码模式](/ae_daemonset_create_command.png)

1.2. 在基本信息页，需要输入守护进程集的名称，用户可以根据需求填写守护进程集的描述信息，完成后点击 **下一步**。

- 名称：为创建的守护进程集起一个简洁明了的名称，便于用户浏览和搜索。
- 别名：帮助您更好的区分资源，并支持中文名称。
- 描述信息：简单介绍守护进程集，让用户进一步了解其作用。

![创建守护进程集](/ae_daemonset_create_basic.png)

### 第二步：配置容器组模板

2.1. 在 **容器组模板** 页面，点击 **添加容器**，根据需求添加容器镜像，输入容器的名称和对应的镜像名，镜像名一般需要指定 tag，比如 node-exporter:v0.15.2，容器中定义的镜像默认从 Docker Hub 中拉取。

> 说明：若需要使用私有镜像仓库如 Harbor，参见 [镜像仓库 - 添加镜像仓库](../../installation/harbor-installation/#kubesphere-中使用-harbor)。

为了实现集群的资源被有效调度和分配同时提高资源的利用率， 平台采用了 request 和 limit 两种限制类型对资源进行分配。request 通常是容器使用的最小资源需求, 而 limit 通常是容器能使用资源的最大值，设置为 0 表示对使用的资源不做限制, 可无限的使用。request 能保证 pod 有足够的资源来运行, 而 limit 则是防止某个 Pod 无限制的使用资源, 导致其他 Pod 崩溃。

**表1：CPU 配额说明**

|参数|说明|
|---|---|
|**最小使用 (requests)**|容器使用的 CPU 最小值，作为容器调度时资源分配的判断依赖。<br> 只有当节点上可分配 CPU 总量 ≥ 容器 CPU 最小值时，才允许将容器调度到该节点。|
|**最大使用 (limits)**|容器能使用的 CPU 最大值。|

**表2：内存配额说明**

|参数|说明|
|---|---|
|**最小使用 (requests)**|容器使用的最小内存需求，作为容器调度时资源分配的判断依赖。<br> 只有当节点上可分配内存总量 ≥ 容器内存申请数时，才允许将容器调度到该节点。|
|**最大使用 (limits)**|容器能使用的内存最大值，如果内存使用量超过这个限定值，容器可能会被 kill。|

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514092756.png)

2.2. 如果用户有更进一步的需求，可下滑至服务设置和高级设置部分。


- **服务设置**： 即设置容器的访问策略，指定容器需要暴露的端口并自定义端口名称，端口协议可以选择 TCP 和 UDP。
- **健康检查**：在业务级的监控检查方面，Kubernetes 定义了两种类型的健康检查探针，详见 [设置健康检查器](../../workload/health-check)。
   - 存活探针： 监测到容器实例不健康时，重启应用。
   - 就绪探针：监测到容器实例不健康时，将工作负载设置为未就绪状态，业务流量不会导入到该容器中。
- **启动命令**： 
   - **运行命令**：可自定义容器的启动的运行命令，Kubernetes 的容器启动命令可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/#run-a-command-in-a-shell)。
   - **参数**： 可自定义容器的启动参数，Kubernetes 的容器启动的参数可参见 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/)。
- **环境变量**： 环境变量是指容器运行环境中设定的一个变量，与 Dockerfile 中的 “ENV” 效果相同，为创建的工作负载提供极大的灵活性。
   - **添加环境变量**： 以添加键值对的形式来设置环境变量。
   - **引入配置中心**： 支持添加 Secret 和 ConfigMap 作为环境变量，用来保存键值对形式的配置数据，详见 [配置](../../configuration/configmaps) 和 [密钥](../../configuration/secrets)。 
- **镜像拉取策略**：默认的镜像拉取策略是 IfNotPresent，在镜像已经在本地存在的情况下，kubelet 将不再去拉取镜像将使用本地已有的镜像。如果需要每次拉取仓库中的镜像，则设置拉取策略为 Always。如果设置为 IfNotPresent 或者 Never， 则会优先使用本地镜像。


<font color=red>注意，运行命令和参数部分需要参考如下规则进行使用：</font>

如果在容器启动时执行一段 shell 命令，则需要在运行命令分别添加两行命令，然后在参数中填写需要执行的 shell 命令，如果是执行 bash 命令则需要把 sh 换成 bash。

```shell
# 运行命令
sh  # 若执行 bash 命令这里需要替换为 bash
-c
# 参数 (填写需要执行的 shell 命令，如下给出一个示例)
while true; do wget -q -O- http://php-apache.default.svc.cluster.local; done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190517171653.png)

设置完成后点击 **保存**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514090510.png)

![创建部署 - 容器组设置](/ae_daemonsets_container_setting-2.png)

**更新策略**

在 Kubernetes 中策略是指定新的 Pod 替换旧的 Pod 的策略，守护进程集的更新策略分为 `滚动更新 (RollingUpdate)` 和 `删除容器组时更新 (OnDelete)` 两种类型：

- 滚动更新：推荐使用滚动更新（[Rolling-update](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#rolling-update)）的方式更新 Pod。您可以指定 maxUnavailable 和 MinReadySeconds 来控制滚动更新的进程。

   - MaxUnavailable 是可选配置项，当前默认值是 1，用来指定在升级过程中不可用 Pod 的最大数量。该值可以是一个绝对值，也可以是期望 Pod 数量的百分比 (例如 10%)，通过计算百分比的绝对值向下取整。
   - MinReadySeconds 是一个可选配置项，默认是 0 (Pod在ready后就会被认为是可用状态)，用来指定没有任何容器 crash 的 Pod 并被认为是可用状态的最小秒数。进一步了解什么情况下 Pod 会被认为是 ready 状态，请参阅 [Kubernetes 官方文档 - Container Probes](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。

- 删除容器组时更新：设置为删除容器组时更新 (OnDelete) 时，StatefulSet 控制器将不会自动更新 StatefulSet 中的 Pod，用户必须手动删除旧版本 Pod 以触发控制器创建新的 Pod。

上述配置信息填写完成以后，点击 **下一步**。

![更新策略](/daemonsets-update-strategy.png)

### 第三步：添加存储卷

在存储卷页面可以添加 **已有持久化存储卷、添加临时存储卷、HostPath、引用配置中心**。

#### 持久化存储卷

持久化存储卷可用于持久化存储用户数据，需要预先创建存储卷，参考 [存储卷 - 创建存储卷](../../storage/pvc)。

#### 临时存储卷

临时存储卷是 [emptyDir](https://kubernetes.cn/docs/concepts/storage/volumes/#emptydir) 类型，随 Pod 被分配在主机上。当 Pod 从主机上被删除时，临时存储卷也同时会删除，存储卷的数据也将永久删除，容器崩溃不会从节点中移除 Pod，因此 emptyDir 类型的卷中数据在容器崩溃时是安全的。

#### 引用配置中心

支持配置 ConfigMap 或 Secret 中的值添加为卷，支持选择要使用的密钥以及将公开每个密钥的文件路径，最后设置目录在容器中的挂载路径。

其中，Secret 卷用于将敏感信息 (如密码) 传递到 pod。Secret 卷由 tmpfs (一个 RAM 支持的文件系统) 支持，所以它们永远不会写入非易失性存储器。

ConfigMap 用来保存键值对形式的配置数据，这个数据可以在 Pod 里使用，或者被用来为像 Controller 一样的系统组件存储配置数据。虽然 ConfigMap 跟 Secret 类似，但是 ConfigMap 更方便的处理不含敏感信息的字符串。它很像 Linux 中的 /etc 目录，专门用来存储配置文件的目录。ConfigMaps 常用于以下场景：
  
- 设置环境变量的值
- 在容器里设置命令行参数
- 在数据卷里面创建 config 文件

重要提示：您必须先在配置中心创建 Secret 或 ConfigMap，然后才能使用它，详见 [创建 Secret](../../configuration/secrets/#创建-secret) 和 [创建 ConfigMap](../../configuration/configmaps)。

#### HostPath

HostPath 允许将宿主机上的指定卷加载到容器之中。这种卷一般和 DaemonSets 搭配使用，用来操作主机文件，例如进行日志采集中 EFK 中的 [FluentD](https://www.centos.bz/tag/fluentd/) 就采用这种方式，加载主机的容器日志目录，达到收集本主机所有日志的目的。

![创建守护进程集 - 存储卷](/ae_daemonset_create_PVC.png)

### 第四步：添加标签

标签设置页用于指定资源对应的一组或者多组标签 (Label)。Label 以键值对的形式附加到任何对象上，如 Pod，Service，Node 等，定义好标签后，其他对象就可以通过标签来对对象进行引用，最常见的用法便是通过节点选择器来引用对象。一般来说，我们可以为一个 Pod (或其他对象) 定义多个标签，以便于配置、部署等管理工作。例如，部署不同版本的应用到不同的环境中；或者监控和分析应用 (日志记录、监控、报警等)。通过多个标签的设置，我们就可以多维度地对对象进行精细化管理，如 `relase: stable ; tier: frontend`。

![创建守护进程集 - 标签](/ae_daemonset_create_label.png)

### 第五步：添加节点选择器

带有标签的对象创建好之后，我们就可以通过节点选择器 (Selector) 来引用这些对象。节点选择器页面，用户可以通过按节点选择或通过 Selector 设置一组或者多组键值对来指定期望运行容器组的主机。当不指定时，将会在集群内的所有节点上运行容器组。点击右下角的创建后，集群就会按照用户的配置创建对应的守护进程集。

![创建守护进程集 - 节点选择器](/ae_daemonset_create_nodeselector.png)
 
点击创建，即可完成守护进程集的创建，状态显示 “更新中” 是由于拉取镜像需要一定时间，待镜像 pull 成功后状态将显示“运行中”。

