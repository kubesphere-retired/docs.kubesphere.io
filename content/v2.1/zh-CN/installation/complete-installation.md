---
title: "完整安装（开启所有功能组件）"
keywords: 'Kubernetes, docker, jenkins, devops, istio'
description: '在 Linux 完整安装 KubeSphere 容器平台'
---

KubeSphere 2.1 默认 **仅开启最小化安装**，Installer 已支持在安装前后自定义安装各个可插拔的功能组件，用户可根据业务需求和机器配置选择安装所需的组件。若您的机器资源配置满足以下要求，非常建议您在 **安装前将 KubeSphere 所有功能组件都开启** 后再执行安装，完整安装能够体验 KubeSphere 容器平台端到端的容器管理与运维能力。

## 机器配置（最低要求）

<font color="red">  

- All-in-one:
  - CPU: 8 Cores
  - Memory: 16 GB
- Multi-node:
  - CPU: 8 cores in total of all machines
  - Memory: 16 GB in total of all machines
</font>

> 提示：若您的机器配置不满足完整安装的最低要求，可参考 [安装可插拔功能组件](../install-openpitrix) 下的文档根据机器资源大小安装所需的功能组件。

本文仅适用于在 Linux 环境安装 KubeSphere，在获取 KubeSphere Installer 后，以下将指导您如何在配置文件中开启所有功能组件的配置，配置完后可继续返回 All-in-One 或 Multi-node 进行安装。

## 准备安装包

若您还没有下载 KubeSphere Installer，请先下载 `KubeSphere 2.1.0` 安装包至待安装机器，进入组件配置目录。

```bash
$ curl -L https://kubesphere.io/download/stable/v2.1.0 > installer.tar.gz \
&& tar -zxf installer.tar.gz && cd kubesphere-all-v2.1.0/conf
```

## 开启所有功能组件

编辑 `conf/common.yaml`，参考如下说明开启所有组件（将 false 改为 true）：

```
# LOGGING CONFIGURATION
# logging is an optional component when installing KubeSphere, and
# Kubernetes builtin logging APIs will be used if logging_enabled is set to false.
# Builtin logging only provides limited functions, so recommend to enable logging.
logging_enabled: true # 是否安装内置的日志系统
elasticsearch_master_replica: 1  # es 主节点副本数，主节点数不能为偶数
elasticsearch_data_replica: 2  # 数据节点副本数
elasticsearch_volume_size: 20Gi # Elasticsearch 存储卷大小
log_max_age: 7 # 集群内置的 Elasticsearch 中日志保留时间，默认是 7 天
elk_prefix: logstash # 自定义 index 命名方式，index 将以 ks-<elk_prefix>-log 形式命名
kibana_enabled: false # 是否部署内置的 Kibana
#external_es_url: SHOULD_BE_REPLACED # 安装支持对接外部的 Elasticsearch 7.x，可减少资源消耗，此处填写 ES 服务的地址
#external_es_port: SHOULD_BE_REPLACED # 此处填写 ES 服务暴露的端口号

#DevOps Configuration
devops_enabled: true # 是否安装内置的 DevOps 系统（支持流水线、 S2i 和 B2i 等功能）
jenkins_memory_lim: 8Gi # Jenkins 内存限制，默认 8 Gi
jenkins_memory_req: 4Gi # Jenkins 内存请求，默认 4 Gi
jenkins_volume_size: 8Gi # Jenkins 存储卷大小，默认 8 Gi
jenkinsJavaOpts_Xms: 3g # 以下三项为 jvm 启动参数
jenkinsJavaOpts_Xmx: 6g
jenkinsJavaOpts_MaxRAM: 8g
sonarqube_enabled: true # 是否安装内置的 SonarQube （代码静态分析工具）
#sonar_server_url: SHOULD_BE_REPLACED # 安装支持对接外部已有的 SonarQube，此处填写 SonarQube 服务的地址
#sonar_server_token: SHOULD_BE_REPLACED  # 此处填写 SonarQube 的 Token

# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
openpitrix_enabled: true       # KubeSphere 应用商店
metrics_server_enabled: true   # KubeSphere HPA（弹性伸缩）
servicemesh_enabled: true      # KubeSphere Service Mesh
notification_enabled: true     # KubeSphere 通知系统
alerting_enabled: true         # KubeSphere 告警系统

```

完成后保存退出，可返回 All-in-One 或 Multi-node 继续执行安装。
