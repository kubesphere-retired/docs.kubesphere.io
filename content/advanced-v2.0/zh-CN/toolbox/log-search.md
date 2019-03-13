---
title: "日志查询"
---

应用日志的收集、分析和监控是日常运维工作中非常关键的部分，妥善地处理应用日志收集也是应用容器化的一个重要主题。KubeSphere 的日志系统目前是通过 Fluent-Bit Operator 在集群的所有节点上统一部署和配置 Fluent-bit，由 Fluent-bit 进行收集所有容器的日志信息，然后直接传到 Elasticsearch，集群管理员也可以指定 Kafka 或 Fluentd 等存储、消息队列中。

ElasticSearch 输出插件依据⽇志信息，在 ElasticSearch 创建对应的 Index (默认是⼀天的日志一个 Index)，为 Kubernetes ⽇志创建指定格式的 mapping ，并向其中写⼊日志信息。此外，ElasticSearch Curator 定时任务，定时运行并删除过期的日志信息，删除方式为删除过期的 Index (⼀个 Index 存放⼀天的日志信息)，默认存放⽇志的时间⻓度为 1 周，支持修改其默认存放时间。

最终日志信息可通过 KubeSphere 日志查询的可视化界面，提供用户对 ElasticSearch 数据的查询、分析、统计等操作。

## 日志查询

KubeSphere 支持所有用户进行日志查询，登录 KubeSphere 后，点击右下角的小锤子图标，选择 **日志查询**。

![日志查询](https://pek3b.qingstor.com/kubesphere-docs/png/20190308101943.png)

在弹窗的日志查询页面，即可看到搜索框和日志总数的变化趋势。目前支持以下四种查询规则，其中关键字查询可通过 “Error” “Fail” “Fatal” “Exception ” “Warning” 等关键字查找错误日志，查询条件支持组合规则查询，并支持精确匹配和模糊匹配。

- 关键字
- 项目名称
- 工作负载名称
- 容器组名称
- 容器名称
- 时间范围

![查询规则](https://pek3b.qingstor.com/kubesphere-docs/png/20190308102212.png)

查询支持自定义时间范围，默认可查询近 7 天的日志信息，也可以修改日志保留的时间。

![时间范围](https://pek3b.qingstor.com/kubesphere-docs/png/20190308102748.png)

例如，查询在最近 1 小时内，kubesphere-system 项目中包含 error 关键字的日志信息，返回了 22 条搜索结果。

![搜索日志](https://pek3b.qingstor.com/kubesphere-docs/png/20190308103255.png)

点击其中一条日志条目，可查看该项目具体的容器日志信息，这里的日志具体信息可以帮助用户快速的定位和分析问题。日志查询支持动态加载，刷新频率为 5 秒、10 秒或 15 秒。

![查看日志](https://pek3b.qingstor.com/kubesphere-docs/png/20190308103440.png)





