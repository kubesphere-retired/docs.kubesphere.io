---
title: "示例四 - 弹性伸缩" 
---

[Pod 弹性伸缩 (HPA)](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) 是高级版新增的功能，应用的资源使用率通常都有高峰和低谷的时候，如何动态地根据资源使用率来削峰填谷，提高集群的平台和集群资源利用率，让 Pod 副本数自动调整呢？这就有赖于 Horizontal Pod Autoscaling 了，顾名思义，能够使 Pod 水平自动伸缩，也是最能体现 KubeSphere 之于传统运维价值的地方，用户无需对 Pod 手动地水平扩缩容 (Scale out/in)。HPA 仅适用于创建部署 (Deployment) 时或创建部署后设置，支持根据集群的监控指标如 CPU 使用率和内存使用量来设置弹性伸缩，当业务需求增加时，KubeSphere 能够无缝地自动水平增加 Pod 数量，提高系统的稳定性。

本示例详细说明 HPA 的工作原理以及如何在部署中设置 Pod 水平自动伸缩。

<!-- <video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/video/hpa.mp4">
</video> -->
## 弹性伸缩工作原理

HPA 在 Kubernetes 中被设计为一个 Controller，可以在 KubeSphere 中通过简单的设置或通过 UI 的 `kubectl autoscale` 命令来创建。HPA Controller 默认每 `30 秒` 轮询一次，检查工作负载中指定的部署（Deployment）的资源使用率，如 CPU 使用率或内存使用量，同时与创建部署时设定的值和指标做比较，从而实现 Pod 副本数自动伸缩的功能。

在部署中创建了 HPA 后，Controller Manager 将会访问用户自定义的 REST 客户端或 Heapster，获取用户定义的资源中每一个容器组的利用率或原始值（取决于指定的目标类型）的平均值，然后，与 HPA 中设置的指标进行对比，同时计算部署中的 Pod 需要弹性伸缩的具体值并实现操作。在底层 Kubernetes 中的 Pod 的 CPU 和内存资源，实际上还分为 limits 和 requests 两种情况，在调度的时候，kube-scheduler 将会根据 requests 的值进行计算。因此，当 Pod 没有设置资源请求值 (request) 时，弹性伸缩功能将不会工作。

![弹性伸缩工作原理](/hpa.svg)

## 设置弹性伸缩

本示例演示在创建部署时设置弹性伸缩，并通过 UI 的 kubectl 增大其中一个容器组的 CPU 负载，演示其弹性伸缩的功能。

### 前提条件

已有 cluster-admin 角色的账号登录 KubeSphere，并已创建了项目。

### 第一步：创建部署

在项目中，选择 **工作负载 → 部署**，点击创建部署，填写部署的基本信息，以创建镜像为 nginx 的容器作为示例，其它项保持默认。

- 名称：必填，起一个简洁明了的名称，便于用户浏览和搜索，如 `nginx-hpa`
- 别名：可选，更好的区分资源，并支持中文名称
- 更新策略：选择 RollingUpdate


![填写基本信息](/hpa-demo-1.png)

### 第二步：配置弹性伸缩参数

容器组模板中可以设置 HPA 相关参数，以设置 CPU 目标值作为弹性伸缩的计算参考，如下填写信息，实际上会为部署创建一个 `Horizontal Pod Autoscaler` 来调度其弹性伸缩。

- 指定副本数量 (Replicas)：2
- 弹性伸缩 (HPA)
   - 最小副本数：弹性伸缩的容器组数量下限，此处设置 `2`
   - 最大副本数：弹性伸缩的容器组数量下限，此处设置 `8`
   - CPU Request Target(%) (CPU 目标值)：当 CPU 使用率超过或低于此目标值时，将相应地添加或删除副本，此处设置为 `50%`
   - Memory Request Target(Mi) (内存目标值)：当内存使用量超过或低于此目标值时，将添加或删除副本，本示例以增加 CPU 负载作为测试，内存暂不作限定

![设置详情](/hpa-info.png)


### 第三步：添加容器

完成 HPA 的参数设置后，点击 **添加容器**，填写容器的基本信息，容器名称可自定义，镜像填写 `nginx`，将默认拉取 **latest** 的镜像。暂不定义高级设置，点击 **保存**。

由于示例不会用到持久化存储，因此存储卷也不作设置，点击 **下一步**。

![添加容器](/add-nginx-container.png)

### 第四步：标签设置

标签是一个或多个关联到资源如容器组上的键值对，通过标签来识别、组织或查找资源对象，此处标签设置为 `app : nginx-hpa`。

节点选择器无需设置，kube-scheduler 将根据各主机 (Node) 的负载状态，将 Pod 随机调度到各台主机上。点击 **创建**，即可查看 Nginx 的运行状态详情。

## 验证弹性伸缩

### 第一步：查看部署状态

在部署的列表中，点击上一步创建的部署 Nginx，进入资源详情页，可以看到当前部署中的实际运行副本和期望副本数都为 `2`，并且重点关注一下此时容器组的弹性伸缩状态。

![资源详情页](/nginx-resource-details.png)

### 第二步：增加 CPU 负载

如果在 Linux 下如何让 CPU 负载瞬间升高？有一个命令 `cat /dev/urandom|md5sum` 可以瞬时增加 CPU 负载，查看系统提供的永不为空的随机字节数据流，这个命令同样适用于容器。可以通过页面提供的 kubectl 工具，连接到其中的一个 Pod，执行该命令。

1、在资源状态页查看项目名称 (namespace) 和 容器组名称，如下的项目名称 `project-a93lz1`，进入的容器组是 `nginx-hpa-6dcf869855-4fl72`。点击右下角的 kubectl 工具，输入以下命令，进入容器组，手动增加 CPU 负载：

```bash
/ # kubectl exec -it nginx-hpa-6dcf869855-4fl72 -n project-a93lz1 bash

root@nginx-hpa-6dcf869855-4fl72:/# cat /dev/urandom|md5sum
```
### 第三步：查看动态伸缩情况

1、执行 cat 命令后，如下图所示，可以发现 CPU 使用率明显有升高，并且期望副本和实际运行副本数都变成了 `4`，这是由于我们之前设置的 `Horizontal Pod Autoscaler` 开始工作了，弹性伸缩的工作原理已经在开头说明过。

![查看动态伸缩情况](/hpa-testing-result.png)

2、在 kubectl 工具中执行命令 `ctrl + c` 中断增加 CPU 负载，让容器组的 CPU 负载回到正常状态。刷新浏览器，可以看到当前部署的期望副本和实际运行副本数都恢复成了最小副本数 `2`。

![动态伸缩恢复](/hpa-result.png)

## 修改弹性伸缩

至此，您已经熟悉了在部署中弹性伸缩的基本设置操作。创建后若需要修改弹性伸缩的参数，可以在部署详情页，点击 **更多操作 → 弹性伸缩**，如下页面支持修改其参数。

![修改弹性伸缩](/update-hpa.png)













