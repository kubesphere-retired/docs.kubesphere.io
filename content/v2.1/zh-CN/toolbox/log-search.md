---
title: "日志查询"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

应用日志的收集、分析和监控是日常运维工作中非常关键的部分，妥善地处理应用日志收集也是应用容器化的一个重要主题。KubeSphere 提供了非常强大且易用的日志管理功能比如多租户日志管理、多级别日志查询 (项目/工作负载/容器组/容器以及关键字)、灵活方便的日志收集配置选项等。在 KubeSphere 的日志查询系统中，不同的租户只能看到属于自己的日志信息，而 Kibana 虽然强大，但是它无法区分不同租户的日志，用户只能在整个集群范围内查看和搜索日志，并且 Kibana 中展现的 Kubernetes 日志包含了很多无关的信息。

### 日志查询演示视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/video/kubesphere-log.mov">
</video>

## 日志系统架构

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190623121834.png)

KubeSphere 的日志系统目前是通过 FluentBit Operator 在集群的所有节点上统一部署和配置 Fluent Bit，由 Fluent Bit 进行收集所有容器的日志信息，然后直接传到 Elasticsearch，集群管理员也可以指定 Kafka 或 Fluentd 等存储、消息队列中。

- FluentBit-operator 以 DaemonSet 方式在每个节点上运⾏⼀个实例，节点物理机的 `/var/log/containers` 目录映射到 FluentBit-operator 容器中。 FluentBit-operator 的 Input 插件 tail 主机映射到容器的 log 日志文件，Output 插件依据配置，将采集到的⽇志信息发送到 ElasticSearch、Kafka 等存储、消息队列中。

- Elasticsearch 以 StatefulSet 的方式部署在集群中，输出插件依据⽇志信息。在 Elasticsearch 创建对应的 Index (默认是⼀天的日志一个 Index)，为 Kubernetes ⽇志创建指定格式的 mapping ，并向其中写⼊日志信息。

- Elasticsearch Curator 以 CronJob 的形式，定时运行并删除过期的日志信息，删除方式为删除过期的 Index (⼀个 Index 存放⼀天的日志信息)，默认存放⽇志的时间⻓度为 1 周，支持修改其默认存放时间。

- 最终的日志信息可通过 KubeSphere 日志查询的可视化界面，提供用户对 Elasticsearch 数据的查询、分析、统计等操作。

## 日志查询

KubeSphere 支持所有用户进行日志查询，登录 KubeSphere 后，点击右下角的小锤子图标，选择 **日志查询**。

![日志查询](https://pek3b.qingstor.com/kubesphere-docs/png/20190308101943.png)

在弹窗的日志查询页面，即可看到搜索框和日志总数的变化趋势。目前支持以下几种查询规则，其中关键字查询可通过 “Error” “Fail” “Fatal” “Exception ” “Warning” 等关键字查找错误日志，查询条件支持组合规则查询，并支持精确匹配和模糊匹配。模糊查询支持大小写模糊匹配，以及通过单词或短语的前半部分检索完整词条（下划线属于单词的一部分）。由于 Elasticsearch 分词的缘故，您可以通过 node_cpu 检索出 node_cpu_totoal，但无法通过 cpu 检索到。

- 关键字
- 项目名称
- 工作负载名称
- 容器组名称
- 容器名称
- 时间范围

![查询规则](https://pek3b.qingstor.com/kubesphere-docs/png/20190308102212.png)

查询支持自定义时间范围，默认可查询近 7 天的日志信息，也可以修改日志保留的时间。

![时间范围](https://pek3b.qingstor.com/kubesphere-docs/png/20190308102748.png)

### 日志查询示例

例如，查询在最近 1 小时内，kubesphere-system 项目中包含 error 关键字的日志信息，返回了 22 条搜索结果。

![搜索日志](https://pek3b.qingstor.com/kubesphere-docs/png/20190308103255.png)

用户可以看到相应日志的收集时间、所属项目、容器组和容器等信息。

点击其中一条日志条目，可查看该项目具体的容器日志信息，包含这条日志相关的上下文信息，用户可以在这个页面查看这条错误发生时所在容器的上下文日志，这里的日志具体信息可以帮助用户快速的定位和分析问题。

> 提示：日志查询支持动态加载，刷新频率为 5 秒、10 秒或 15 秒。

![查看日志](https://pek3b.qingstor.com/kubesphere-docs/png/20190308103440.png)

可以看到在日志查询详情页面左侧有元数据的选项。用户可以在容器一栏选择其他容器，或者同一个容器组中的全部容器；还可以选择同一个项目下的其他容器组或所有容器组，这样就可以看到是否其他容器或容器组会对当前错误产生影响了。日志的错误有可能会和 CPU，内存等的用量有关系，比如内存不够。

![查看日志](https://pek3b.qingstor.com/kubesphere-docs/png/20190409132112.png)

### 支持一键定位

若通过日志输出信息发现问题后，用户可以一键跳转容器、容器组、项目的详情页，进一步查看监控信息和资源状态。同时，用户可以在容器的详情页进入容器终端定位问题。

- 单击项目也可以转到项目页面查看相应监控信息；
- 点击元信息相应容器/容器组右侧的定位按钮，就可以转到相应的容器/容器组页面。

![查看容器](https://pek3b.qingstor.com/kubesphere-docs/png/20190409133307.png)




