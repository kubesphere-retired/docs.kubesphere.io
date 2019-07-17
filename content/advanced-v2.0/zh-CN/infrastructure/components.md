---
title: "服务组件"
keywords: ''
description: ''
---

服务组件提供集群内各项服务组件的健康状态监控，可以查看当前集群的健康状态和运行时间，能够帮助用户监测集群的状况和及时定位问题。

目前在服务组件可以查看以下服务的相关组件的监控状态：


- KubeSphere
- Kubernetes 
- OpenPitrix
- Istio 
- Monitoring
- Logging
- DevOps


## 查看服务组件

使用集群管理员账号登录 KubeSphere 管理控制台，访问 **平台管理 → 服务组件** 进入列表页。作为集群管理员，可以查看当前集群下所有的服务组件:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190511135905.png)

## 服务组件的作用

服务组件可以查看当前集群健康状态，当集群出现异常时，管理员可以查看是否存在某个服务组件出现异常。比如使用应用模板部署应用时，应用没有部署成功，那么就可以查看是不是 Openpitrix 的组件出现异常，管理员就可以快速定位问题，然后根据出现异常的组件进行修复。当某个服务组件出现异常时，其 Tab 将显示为异常组件的数目。

### KubeSphere

| Components   | Description   | 
|:----|:----|
| ks-account   | 提供用户、权限管理相关的API   | 
| ks-apigateway   | 负责处理服务请求和处理 API 调用过程中的所有任务   | 
| ks-apiserver   | 是整个集群管理的 API 接口和集群内部各个模块之间通信的枢纽，以及集群安全控制   | 
| ks-console   | 提供 KubeSphere 的控制台服务   | 
| ks-docs | `docs.kubesphere.io` 文档服务 |
| oepnldap   | 负责集中存储和管理用户账号信息   | 
| redis   | 将结构化的数据存储在内存中的存储系统   | 


### Kubernetes

| Components   | Description   | 
|:----|:----|
| coredns   | 为 Kubernetes 集群提供服务发现的功能   | 
| metrics-server   | Kubernetes 的监控组件，从每个节点的 Kubelet 采集指标信息   | 
| tiller-deploy   | Helm 的服务端，负责管理发布 release   | 
| kube-controller-manager | kube-controller-manager 由一系列的控制器组成，处理集群中常规任务的后台线程 | 
| kube-scheduler | kubernetes 的调度器，将 Pod 调度到合适的 Node 节点上去 | 


### OpenPitrix

| Components   | Description   | 
|:----|:----|
| openpitrix-api-gateway   | 负责处理平台的服务请求和处理 API 调用过程中的所有任务   | 
| openpitrix-app-manager   | 提供 OpenPitrix 的应用生命周期管理   | 
| openpitrix-category-manager   | 提供 OpenPitrix 中的应用分类管理   | 
| openpitrix-cluster-manager   | 提供 OpenPitrix 中的应用实例生命周期管理   | 
| openpitrix-db   | OpenPitrix 数据库   | 
| openpitrix-etcd   | 高可用键值存储系统，用于共享配置、服务发现和全局锁   | 
| openpitrix-iam-service   | 控制哪些用户可使用您的资源（身份验证）以及可使用的资源和采用的方式（授权）   | 
| openpitrix-job-manager   | 具体执行 OpenPitrix 应用实例生命周期 Action   | 
| openpitrix-minio   | 对象存储服务，用于存储非结构化数据   | 
| openpitrix-repo-indexer   | 提供 OpenPitrix 的应用仓库索引服务   | 
| openpitrix-repo-manager   | 提供 OpenPitrix 的应用仓库管理   | 
| openpitrix-runtime-manager   | 提供平台中的云运行时环境管理   | 
| openpitrix-task-manager   | 具体执行 OpenPitrix 应用实例生命周期 Action 子任务 | 


### Istio

| Components   | Description   | 
|:----|:----|
| istio-citadel   | 通过内置身份和凭证管理赋能强大的服务间和最终用户身份验证   | 
| istio-galley   | 代表其他的 Istio 控制平面组件，用来验证用户编写的 Istio API 配置   | 
| istio-ingressgateway   | 提供外网访问的网关   | 
| istio-pilot   | 为 Envoy Sidecar 提供服务发现功能   | 
| istio-policy   | 用于向 Envoy 提供准入策略控制，黑白名单控制，速率限制等相关策略   | 
| istio-sidecar-injector | 为配置注入的pod自动注入 Sidecar | 
| istio-telemetry | 为 Envoy 提供了数据上报和日志搜集服务 | 
| jaeger-collector | 收集sidecar的数据，Istio 里面 sidecar 就是 jaeger-agent | 
| jaeger-collector-headless | 收集 sidecar 的数据，Istio 里面 Sidecar 就是 jaeger-agent | 
| jaeger-query | 接收查询请求，然后从后端存储系统中检索 trace 并通过 UI 进行展示 | 
| jaeger-operator | 负责创建 Jaeger 服务，并在配置更新时自动应用到 jaeger 服务   | 

### Monitoring

| Components   | Description   | 
|:----:|:----|
| kube-state-metrics | 监听 Kubernetes API server 以获取集群中各种 API 对象的状态包括节点，工作负载和 Pod 等，并生成相关监控数据供 Prometheus 抓取   | 
| node-exporter   | 收集集群各个节点的监控数据，供 Prometheus 抓取   | 
| prometheus-k8s | 提供节点、工作负载、 API 对象相关监控数据   | 
| prometheus-k8s-system   | 提供 etcd, coredns, kube-apiserver, kube-scheduler, kube-controller-manager 等 Kubernetes 组件的监控数据 | 
| prometheus-operator | 管理 Prometheus 实例的 Operator   | 
| prometheus-operated | 所有 Prometheus 实例对应的服务，供 Prometheus Operator 内部使用   | 

### Logging

| Components   | Description   | 
|:----|:----|
| elasticsearch-logging-data   | 提供 Elasticsearch 数据存储、备份、搜索等数据服务   | 
| elasticsearch-logging-discovery   | 提供 Elasticsearch 集群管理服务   | 

### DevOps

| Components   | Description   | 
|:----|:----|
| controller-manager-metrics-service   | 提供 s2i 控制器的监控数据   | 
| ks-jenkins   | jenkins master 服务，提供 DevOps 基础功能   | 
| ks-jenkins-agent   | jenkins agent 连接 jenkins master 所使用的服务   | 
| ks-sonarqube-postgresql | 代码质量分析组件 SonarQube 的后端数据库   | 
| ks-sonarqube-sonarqube | SonarQube 的主服务   | 
| s2ioperator | s2i 控制器，s2i 的全声明周期管理   | 
| uc-jenkins-update-center | jenkins 更新中心，提供 Jenkins 插件的安装包   | 
| webhook-server-service | 为 s2i 提供默认值和验证 webhook | 
