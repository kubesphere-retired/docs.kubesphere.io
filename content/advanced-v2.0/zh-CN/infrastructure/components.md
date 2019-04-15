---
title: "服务组件"
---

服务组件提供 KubeSphere、Kubernetes 和 OpenPitrix 集群内各项服务组件的健康状态监控，可以查看当前集群的健康状态和运行时间，能够帮助用户监测集群的状况和及时定位问题。


## 查看服务组件

登录 KubeSphere 管理控制台，访问 **平台管理 → 服务组件** 进入列表页。作为集群管理员，可以查看当前集群下所有的服务组件:

![服务组件](/ae-components-list.png)

## 服务组件的作用

服务组件可以查看当前集群健康状态，当集群出现异常时，管理员可以查看是否存在某个服务组件出现异常。比如使用应用模板部署应用时，应用没有部署成功，那么就可以查看是不是 Openpitrix 的组件出现异常，管理员就可以快速定位问题，然后根据出现异常的组件进行修复。当某个服务组件出现异常时，KubeSphere、OpenPitrix 和 Kubernetes 的 Tab 显示为异常组件的数目。

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

### KubeSphere

| Components   | Description   | 
|:----|:----|
| ks-account   | 提供用户、权限管理相关的API   | 
| ks-apigateway   | 负责处理服务请求和处理 API 调用过程中的所有任务   | 
| ks-apiserver   | 是整个集群管理的 API 接口和集群内部各个模块之间通信的枢纽，以及集群安全控制   | 
| ks-console   | 提供 KubeSphere 的控制台服务   | 
| oepnldap   | 负责集中存储和管理用户账号信息   | 
| redis   | 将结构化的数据存储在内存中的存储系统   | 

### Kubernetes

| Components   | Description   | 
|:----|:----|
| coredns   | 为 Kubernetes 集群提供服务发现的功能   | 
| metrics-server   | Kubernetes 的监控组件，从每个节点的 Kubelet 采集指标信息   | 
| tiller-deploy   | Helm 的服务端，负责管理发布 release   | 