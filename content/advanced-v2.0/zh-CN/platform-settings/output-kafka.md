---
title: "添加 Kafka 作为日志收集"
---

KubeSphere 目前支持添加的日志接收者包括 Elasticsearch、Kafka 和 Fluentd，本文档通过以下两种方式说明如何创建 Kafka 和 Zookeeper 集群，并通过 KubeSphere 添加日志收集者将日志输出到 Kafka 的 topic，最终通过 [Kafkacat 客户端](https://github.com/edenhill/kafkacat) 验证接收实时的日志消息：

- 在 Kubernetes 部署一个单节点的 Kafka 和 Zookeeper
- 在 AppCenter 创建 Kafka 和 Zookeeper

## Kubernetes 部署单节点 Kafka 和 Zookeeper 

### 第一步：通过 yaml 创建 Zookeeper、Kafka

> 注意：单节点 Kafka 和 Zookeeper 仅用于测试日志输出到 Kafka，正式环境建议搭建多节点的 Kafka 集群。

1、在工具箱打开 web kubectl 或后台 SSH 到 KubeSphere 后台，新建一个 kafka 的 Namespace，然后在该 Namespace 中创建 Zookeeper 的 Service 和 Deployment。

**zookeeper-service.yaml**

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: zookeeper-service
  name: zookeeper-service
spec:
  type: NodePort
  ports:
  - name: zookeeper-port
    port: 2181
    nodePort: 30181
    targetPort: 2181
  selector:
    app: zookeeper
```

**zookeeper.yaml**
```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    app: zookeeper
  name: zookeeper
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: zookeeper
    spec:
      containers:
      - image: wurstmeister/zookeeper
        imagePullPolicy: IfNotPresent
        name: zookeeper
        ports:
        - containerPort: 2181
```

**创建命令**

```bash
$ kubectl create ns kafka
$ kubectl create -f zookeeper-service.yaml,zookeeper.yaml -n kafka
```

2、创建 Kafka 的 Deployment 和 Service，其中 `192.168.0.16` 请替换为您实际的 IP 地址：

**kafka.yaml**

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  labels:
    app: kafka
  name: kafka
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: kafka
    spec:
      containers:
      - env:
        - name: KAFKA_ADVERTISED_HOST_NAME
          value: "192.168.0.16"
        - name: KAFKA_ADVERTISED_PORT
          value: "30092"
        - name: KAFKA_BROKER_ID
          value: "1"
        - name: KAFKA_ZOOKEEPER_CONNECT
          value: 192.168.0.16:30181
        - name: KAFKA_CREATE_TOPICS
          value: "test:1:1"
        image: wurstmeister/kafka
        imagePullPolicy: IfNotPresent
        name: kafka
        ports:
        - containerPort: 9092
```


**kafka-service.yaml**

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: kafka-service
  name: kafka-service
spec:
  type: NodePort
  ports:
  - name: kafka-port
    port: 9092
    nodePort: 30092
    targetPort: 9092
  selector:
    app: kafka
```

**创建命令**

```bash
$ kubectl create -f kafka.yaml,kafka-service.yaml -n kafka
```

3、查看 kafka namespace 中，以上步骤创建的资源。

```bash
$ kubectl get all -n kafka
···
NAME                        TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
service/kafka-service       NodePort   10.233.0.194   <none>        9092:30092/TCP   6h41m
service/zookeeper-service   NodePort   10.233.0.234   <none>        2181:30181/TCP   6h44m

NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/kafka       1/1     1            1           6h41m
deployment.apps/zookeeper   1/1     1            1           6h44m
···
```

4、安装 [Kafkacat 客户端](https://github.com/edenhill/kafkacat)，Kafkacat 是一款开源的 Kafka 调试工具。以下仅演示在 ubuntu 安装 Kafkacat (其它 OS 安装请参考 [Kafkacat](https://github.com/edenhill/kafkacat))：

```bash
apt-get install kafkacat
```

5、使用 Kafkacat 验证单节点 kafka 消息的发送和接收，如下表明发送和接收成功：

```bash
$ cho "Hello KubeSphere!" | kafkacat -P -b 192.168.0.16:30092 -t test-topic
$ kafkacat -C -b 192.168.0.16:30092 -t test-topic
Hello KubeSphere!
```

### 第二步：添加 Kafka 作为日志搜集者

1、点击「平台管理」 → 「平台设置」，选择「日志收集」，点击「添加日志收集者」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514234854.png)

2、在弹窗中选择 Kafka，参考如下填写信息，点击确定保存信息。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190715004519.png)

> 说明：若需要对 Fluent Bit 转发 Kafka 做个性化配置，可在日志收集者页面下进入 「Kafka」 → 「更多操作」，点击 「编辑配置文件」 然后修改 `parameters`，可参看 [Fluent Bit 官方文档](https://docs.fluentbit.io/manual/output/kafka) `kafka` 插件支持的参数项。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190521100155.png)


### 第三步：验证日志输出

通过 Kafkacat 的消费命令观察日志的动态输出流信息：

```shell
kafkacat -C -b 192.168.0.16:30092 -t test-topic
Hello KubeSphere!
{"@timestamp":1563122754.655668, "log":"2019/07/14 16:45:54 config map updated\n", "time":"2019-07-14T16:45:54.655667686Z", "kubernetes":{"pod_name":"fluent-bit-ss5zr", "namespace_name":"kubesphere-logging-system", "host":"ks-allinone", "container_name":"config-reloader", "docker_id":"1475e0b4ccce582848b55463e4c1f405dceb4a117fa2c0aa29f047f782bb04a6"}}
{"@timestamp":1563122754.659812, "log":"2019/07/14 16:45:54 successfully triggered reload\n", "time":"2019-07-14T16:45:54.659811676Z", "kubernetes":{"pod_name":"fluent-bit-ss5zr", "namespace_name":"kubesphere-logging-system", "host":"ks-allinone", "container_name":"config-reloader", "docker_id":"1475e0b4ccce582848b55463e4c1f405dceb4a117fa2c0aa29f047f782bb04a6"}}
{"@timestamp":1563123117.109699, "log":"2019-07-14 16:51:57.109 [INFO][96] ipsets.go 295: Finished resync family=\"inet\" numInconsistenciesFound=0 resyncDuration=6.203131ms\n", "time":"2019-07-14T16:51:57.109698704Z", "kubernetes":{"pod_name":"calico-node-ndk99", "namespace_name":"kube-system", "host":"ks-allinone", "container_name":"calico-node", "docker_id":"e45138d5b465c9670ff6632e7bd7eb21802d8827c7981d6ad05e2da8f3fb7123"}}
{"@timestamp":1563123117.109884, "log":"2019-07-14 16:51:57.109 [INFO][96] int_dataplane.go 747: Finished applying updates to dataplane. msecToApply=6.6922559999999995\n", "time":"2019-07-14T16:51:57.109883574Z", "kubernetes":{"pod_name":"calico-node-ndk99", "namespace_name":"kube-system", "host":"ks-allinone", "container_name":"calico-node", "docker_id":"e45138d5b465c9670ff6632e7bd7eb21802d8827c7981d6ad05e2da8f3fb7123"}}
···
```

## AppCenter 部署 Kafka 和 Zookeeper 集群

### 第一步：创建 Zookeeper + Kafka 集群

除了上述方式，正式环境建议自行搭建一个 Zookeeper 和 Kafka 集群，可通过 [QingCloud AppCenter](https://appcenter.qingcloud.com/) 完成 Zookeeper 和 Kafka 集群的一键部署，参考文档 [Zookeeper 服务](https://docs.qingcloud.com/product/big_data/zk/README) 和 [Kafka 服务](https://docs.qingcloud.com/product/big_data/kafka/README.html)。

> 说明：建议将 Kafka、Zookeeper 集群与 KubeSphere 集群置于同一个私有网络环境。若它们处于不同的集群，需要在 broker 所在的路由器上配置端口转发，并且需要修改 broker 的 advertised host 与 advertised port 为路由器转发的源地址和源端口。因为 Kafka 各节点 (broker, producer, consumer) 之间是靠 advertised host 与 advertised port 通讯的，配置详见 [跨网访问](https://docs.qingcloud.com/product/big_data/kafka/README.html#%E8%B7%A8%E7%BD%91%E8%AE%BF%E9%97%AE)。

1、创建 Zookeeper 集群，Zookeeper 作为 Kafka 的依赖，需要在 Kafka 之前创建。

![Zookeeper 集群](https://kubesphere-docs.pek3b.qingstor.com/png/20190518234810.png)

2、创建 Kafka 集群。

![Kafka 集群](https://kubesphere-docs.pek3b.qingstor.com/png/20190518114710.png)

### 第二步：添加日志收集者并验证

同上，在 KubeSphere 中添加 Kafka 集群作为日志收集者，可安装使用 Kafkacat 验证单节点 Kafka 消息的发送和接收。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190715010145.png)