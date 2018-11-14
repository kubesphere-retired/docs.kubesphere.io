---
title: "常见问题" 
---

1、作为新手，如何快速了解 KubeSphere 的使用？

答：我们提供了多个快速入门的示例包括工作负载和 DevOps 工程，建议从 [快速入门](../../zh-CN/quick-start/quick-start-guide) 入手，参考 **快速入门** 并实践和操作每一个示例。

2、创建 Jenkins 流水线后，运行时报错怎么处理？

![流水线报错](/faq-pipeline-error.png)

答：最快定位问题的方法即查看日志，点击 **查看日志**，具体查看出错的阶段 (stage) 输出的日志。比如，在 **push image** 这个阶段报错了，如下图中查看日志提示可能是 DockerHub 的用户名或密码错误。

![查看日志](/faq-pipeline-log.png)

3、Ceph RBD 缺少密钥无法挂载怎么解决？

答：Ceph RBD 存储卷操作过程中，如果遇到 Ceph RBD 存储卷挂载至工作负载时因缺少密钥无法挂载，可参考如下解决方案：

1. 假设工作负载所在项目为 ns1，Ceph RBD 存储卷关联的存储类型为 rbd。

2. 通过 Kubectl 命令行工具向 kubernetes 发送以下命令，查询要创建 Secret 名称，得到应创建的 Secret 名称为 `ceph-rbd-user-secret`。

```
$ kubectl get sc rbd | grep userSecretName
userSecretName: ceph-rbd-user-secret
```


3. 在 Ceph 集群执行以下命令，得到密钥：

```
$ ceph auth get-key client.admin
AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==
```
则密钥为 `AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==`。

4. 通过 Kubectl 命令行工具执行以下命令，创建 Secret：


```
kubectl create secret generic ceph-rbd-user-secret --type="kubernetes.io/rbd" --from-literal=key='AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==' --namespace=ns1
```

> 其中， 以下的三个字段根据不同环境的实际状况会有所不同， 应根据您的环境替换成对应的字段:
       > - ceph-rbd-user-secret
       > - AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==
       > - ns1