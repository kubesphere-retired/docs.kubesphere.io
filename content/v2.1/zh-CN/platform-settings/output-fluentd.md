---
title: "添加 Fluentd 作为日志接收者"
---

KubeSphere 目前支持添加的日志接收者包括 Elasticsearch、Kafka 和 Fluentd，本文档演示如何在 KubeSphere 部署容器化的 Fluentd 并将其添加为日志接收者，展示 Fluentd 接收到日志数据后，输出到容器的 stdout 标准输出，最后可以通过查看 Fluentd 容器的日志，验证添加日志接收者的流程是否成功。

## 前提条件

已创建了企业空间、项目，若还未创建请参考 [多租户管理快速入门](../../quick-start/admin-quick-start)。这里我们为本演示创建示例项目 `test-fluentd`；

## 第一步：创建配置 (ConfigMap)

1、使用集群管理员账号登录 KubeSphere，进入企业空间下的项目 `test-fluentd` 中，选择「配置中心」 → 「配置」，点击 「创建配置」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514231449.png)

2、在基本信息中名称填写为 `fluentd-config`，点击下一步进行配置设置，键值对填写以下配置，完成后点击 「创建」。

```bash
# 键
fluent.conf

# 值
<source>
  @type forward
  port 24224
</source>

<filter **>
  @type grep
  <exclude>
    key $.kubernetes.namespace_name
    pattern /^test-fluentd$/
  </exclude>
</filter>

<match **>
  @type stdout
</match>
```

> 参数释义
> - source：Fluentd 在 24224 端口接受数据
> - filter：因为我们要把 Fluentd 接受到的日志输出至 stdout，为避免 Fluent Bit 与 FluentD 循环采集日志，这里过滤 Fluentd 所在项目 `test-fluentd` 下的日志 
> - match：输出到标准输出

> 注意：本示例仅演示输出到标准输出。 Fluentd 支持多种第三方接收器转发，比如 S3, Mongodb, Cassandra, MySQL, syslog, Splunk 等。如需配置其他 Fluentd 支持的外部存储收集日志，请参考 [FLuentd 官方文档](https://docs.fluentd.org/output)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514232334.png)

## 第二步：创建部署

1、选择 「工作负载」→ 「部署」，点击 「创建」。基本信息中名称可自定义，如 `fluentd-logging`。

2、点击「下一步」进入容器组模板，在镜像中输入 `fluent/fluentd:v1.4.2-2.0`，点击「保存」然后点击「下一步」。

3、存储卷设置中，点击 「引用配置中心」，然后在配置中选择之前创建的 `fluentd-config`，挂载路径选择 `只读`，路径为 `/fluentd/etc`，然后点击保存。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514233553.png)

4、点击「下一步」，标签保留默认值，点击「创建」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514233918.png)

## 第三步：创建服务

1、选择 「网络与服务」→「服务」，点击「创建」。在基本信息中名称可自定义，例如 `fluentd-svc`，点击「下一步」。

2、选择第一项 `通过集群内部IP来访问服务 Virtual IP`，点击指定工作负载，选择部署 `fluentd-logging`，端口名称 fluentd，默认 TCP 协议的端口和目标端口都设置为 `24224`，点击「下一步」然后点击「创建」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514234315.png)

3、可以看到 `fluentd-svc` 服务创建成功。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514234627.png)

## 第四步：添加 Fluentd 作为日志接收者

1、点击「平台管理」 → 「平台设置」，选择「日志收集」，点击「添加日志接收者」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514234854.png)

2、在弹窗中选择 Fluentd，参考如下填写信息，点击确定保存信息。

- 访问地址：格式参考 {$Fluentd 服务名}.{$Fluentd 所在的项目名}.svc，
- 端口号：24224

3、可以看到日志状态显示收集中，说明添加成功。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514235411.png)

> 说明：若需要对 Fluent Bit 转发 Fluentd 做个性化配置，可在日志接收者页面下进入 「Fluentd」 → 「更多操作」，点击 「编辑配置文件」 然后修改 `parameters`，可参看 [Fluent Bit 官方文档](https://docs.fluentbit.io/manual/output/forward) `forward` 插件支持的参数项。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190517112230.png)

## 第五步：验证日志输出

1、回到项目下的 「工作负载」 → 「部署」，进入 fluentd-logging，然后展开容器组点击进入容器日志。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514235728.png)

2、在容器日志中，可以看到日志信息的实时数据在动态的输出，即说明 Fluentd 日志收集添加成功。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514235834.png)