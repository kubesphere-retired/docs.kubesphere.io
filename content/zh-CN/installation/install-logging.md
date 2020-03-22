---
title: "KubeSphere 日志系统"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '应用商店'
---

KubeSphere 提供了 **强大且易用的日志查询、接收与管理功能**，比如多租户日志管理、多级别日志查询 (包括项目、工作负载、容器组、容器以及关键字)、灵活方便的日志收集配置选项等。相较于 Kibana，KubeSphere 日志系统提供了 **基于多租户的日志查询**，不同的租户只能看到属于自己的日志信息。KubeSphere 内置的日志系统作为可插拔的功能组件，主要的功能如下：

> - [支持多租户与多维度查询平台日志](../../toolbox/log-search)
> - 支持添加多个日志接收者，包括 Elasticsearch、Kafka 和 Fluentd
> - [落盘日志收集](../../workload/logs-on-disk)

## 安装前如何开启安装日志系统

> 注意：开启可选功能组件之前，请先参考 [可插拔功能组件列表](../../installation/intro/#可插拔功能组件列表)，**确认集群的可用 CPU 与内存空间是否充足，否则可能会因为资源不足而导致的机器崩溃或其它问题。**

安装前，在 installer 目录下编辑 `conf/common.yaml` 文件，然后参考如下开启。

> 提示：KubeSphere 支持对接外置的 Elasticsearch，若您已有外置的 ES 集群，建议在以下参数中配置对接，可减少 KubeSphere 集群的资源消耗。

```yaml
# Logging
logging_enabled: true # 是否安装内置的日志系统
elasticsearch_master_replica: 1  # es 主节点副本数，主节点数不能为偶数
elasticsearch_data_replica: 2  # 数据节点副本数
elasticsearch_volume_size: 20Gi # Elasticsearch 存储卷大小
log_max_age: 7 # 集群内置的 Elasticsearch 中日志保留时间，默认是 7 天
elk_prefix: logstash # 自定义 index 命名方式，index 将以 ks-<elk_prefix>-log 形式命名
kibana_enabled: false # 是否部署内置的 Kibana
#external_es_url: SHOULD_BE_REPLACED # 安装支持对接外部的 Elasticsearch 7.x，可减少资源消耗，此处填写 ES 服务的地址
#external_es_port: SHOULD_BE_REPLACED # 此处填写 ES 服务暴露的端口号
```

## 安装后如何开启安装日志系统

通过修改 ks-installer 的 configmap 可以选装组件，执行以下命令。

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

**参考如下修改 ConfigMap**

```yaml
logging:
     enabled: True
     elasticsearchMasterReplica: 1
     elasticsearchDataReplica: 2
     elasticsearchVolumeSize: 20Gi
     logMaxAge: 7
     elkPrefix: logstash
     containersLogMountedPath: ""
     kibana:
       enabled: False  ## 是否开启安装 Kibana
```

保存退出，参考 [验证可插拔功能组件的安装](../verify-components) ，通过查询 ks-installer 日志或 Pod 状态验证功能组件是否安装成功。

## 如何开启安装 Kibana

KubeSphere 内置的日志系统已经足够满足大多数应用场景，并支持了基于多租户的日志查询。

若需要结合 Kibana 使用，可参考上述文档，在 Kibana enable 的对应参数值设置为 "true"。

待安装完成后，在项目 `kubesphere-logging-system` 下的 `elasticsearch-logging-kibana` 服务中，将服务类型设置为 NodePort，即可通过 `{$NodeIP}:{$NodePort}` 访问 Kibana。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191129214711.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191129215132.png)
