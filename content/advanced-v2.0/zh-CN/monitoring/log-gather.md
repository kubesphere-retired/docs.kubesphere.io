---
title: "日志收集"
---

应用日志的收集、分析和监控是日常运维工作中非常关键的部分，妥善地处理应用日志收集也是应用容器化的一个重要主题。KubeSphere 的日志系统目前是通过 Fluent-Bit Operator 在集群的所有节点上统一部署和配置 Fluent-bit，由 Fluent-bit 进行收集所有容器的日志信息，然后直接传到 Elasticsearch，集群管理员也可以指定 Kafka 或 Fluentd 等存储、消息队列中。

ElasticSearch 输出插件依据⽇志信息，在 ElasticSearch 创建对应的 Index (默认是⼀天的日志一个 Index)，为 Kubernetes ⽇志创建指定格式的 mapping ，并向其中写⼊日志信息。此外，ElasticSearch Curator 定时任务，定时运行并删除过期的日志信息，删除方式为删除过期的 Index (⼀个 Index 存放⼀天的日志信息)，默认存放⽇志的时间⻓度为 1 周，支持修改其默认存放时间。

最终日志信息可通过 KubeSphere 日志查询的可视化界面，提供用户对 ElasticSearch 数据的查询、分析、统计等操作。

## 日志查询



