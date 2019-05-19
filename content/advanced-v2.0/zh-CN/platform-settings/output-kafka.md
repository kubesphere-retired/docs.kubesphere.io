---
title: "添加 Kafka 作为日志收集"
---

KubeSphere 目前支持添加的日志接收者包括 Elasticsearch、Kafka 和 Fluentd，本文档演示如何添加 Kafka 为日志收集者。我们可以通过 Kafka Consumer 相关命令，验证添加日志收集者的流程是否成功。

## 前提条件

已创建的 Zookeeper + Kafka 集群。


## 第一步：创建 Zookeeper + Kafka 集群

用户可以自行搭建一个 Kafka 集群，或参考 QingCloud 的 [Kafka 服务](https://docs.qingcloud.com/product/big_data/kafka/README.html)，创建一个如下三节点 Kafka 集群：

（1）Zookeeper 集群

![Zookeeper 集群](https://kubesphere-docs.pek3b.qingstor.com/png/20190518234810.png)

（2）Kafka 集群

![Kafka 集群](https://kubesphere-docs.pek3b.qingstor.com/png/20190518114710.png)

打开防火墙 19092、29092、39092 三个端口，分别端口转发到 192.168.2.8、192.168.2.9、192.168.2.14 的 9092 端口。这样我们便可以通过公网 IP 访问这三个节点。

![](https://kubesphere-docs.pek3b.qingstor.com/png/20190519090700.png)

## 第二步：添加 Kafka 作为日志搜集者

1、点击「平台管理」 → 「平台设置」，选择「日志收集」，点击「添加日志收集者」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514234854.png)

2、在弹窗中选择 Kafka，参考如下填写信息，点击确定保存信息。

![](https://kubesphere-docs.pek3b.qingstor.com/png/20190519095200.png)

> 说明：若需要对 Fluent Bit 转发 Kafka 做个性化配置，可在日志收集者页面下进入 「Kafka」 → 「更多操作」，点击 「编辑配置文件」 然后修改 `parameters`，可参看 [Fluent Bit 官方文档](https://docs.fluentbit.io/manual/output/kafka) `kafka` 插件支持的参数项。


## 第三步：验证日志输出

登录 Kafka 集群客户端节点（默认用户名 ubuntu，密码 kafka），输入以下消息消费命令观察日志输出：

```shell
kafka-console-consumer.sh --bootstrap-server 192.168.2.8:9092,192.168.2.9:9092,192.168.2.14:9092 --topic test
```

![](https://kubesphere-docs.pek3b.qingstor.com/png/20190519101600.jpeg)