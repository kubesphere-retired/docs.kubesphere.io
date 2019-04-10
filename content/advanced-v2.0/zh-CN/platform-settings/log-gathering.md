---
title: "日志收集"
---

KubeSphere 提供了非常灵活的日志收集的管理配置功能，用户可以添加日志接收者包括 Elasticsearch、Kafka 和 Fluentd，甚至可以暂停 (关闭) 向某个日志接收者输入日志，也支持稍后重新启用 (激活) 该日志接收者。

在平台管理中的平台设置页面提供了日志收集配置的选项，KubeSphere 日志查询的日志是存在 Elasticsearch 中的，用户可以把日志导出并保存到其他地方，例如指定集群外部独立的 Elasticsearch 或者 Kafka，添加了新的外部日志接收者后，日志查询就从这个新的日志接收者查询日志了。

## 添加日志收集者

以 `cluster admin` 登录 KubeSphere，点击 **平台管理 → 平台设置**，选择 **日志收集**。

![平台设置](https://pek3b.qingstor.com/kubesphere-docs/png/20190410014618.png)

点击 **添加日志接收者**，在弹窗中可选择 Elasticsearch、Kafka 或 Fluentd 作为日志收集器。

> 提示：如果用户想输出日志到其他地方，那么可选择将日志输出到 Fluentd，它可以通过众多的 Output 插件转发日志到非常多的地方，比如 S3, Mongodb, Cassandra, Mysql, syslog, Splunk 等等。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190410012915.png)

集群将内置的 Elasticsearch 作为默认的日志收集器，因此我们演示添加一个集群内部的 Kafka 作为日志收集器，在弹窗中选择 Kafka，并填写访问地址等相关信息。

![添加日志接收者](https://pek3b.qingstor.com/kubesphere-docs/png/20190410014858.png)

例如，在当前集群中已部署的 Kafka 集群访问地址如下，在弹窗中输入主题和访问地址和端口号：

```bash
192.168.0.5   9092
192.168.0.15  9092
192.168.0.9   9092
```

![添加 Kafka](https://pek3b.qingstor.com/kubesphere-docs/png/20190410014300.png)

点击确认，即可看到 Kafka 已作为日志收集器同时为集群收集容器的标准输入输出日志。

## 日志收集者设置

点击进入 Kafka 的配置详情页，可以更改状态、删除日志收集者或编辑配置文件。

![日志收集者设置](https://pek3b.qingstor.com/kubesphere-docs/png/20190410014450.png)