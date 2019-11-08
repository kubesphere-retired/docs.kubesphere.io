---
title: "DevOps 常见问题" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

### 流水线运行报错相关问题

1、创建 Jenkins 流水线后，运行时报错怎么处理？

![流水线报错](/faq-pipeline-error.png)

答：最快定位问题的方法即查看日志，点击 **查看日志**，具体查看出错的阶段 (stage) 输出的日志。比如，在 **push image** 这个阶段报错了，如下图中查看日志提示可能是 DockerHub 的用户名或密码错误。

![查看日志](/faq-pipeline-log.png)

2、运行流水线失败时，查看日志发现是 Docker 镜像 push 到 DockerHub 超时问题 (Timeout)，比如以下情况，要怎么处理？

![docker超时问题](/pipeline-docker-timeout.png)

答：可能由于网络问题造成，建议尝试再次运行该流水线。

3、流水线运行时遇到如下报错应如何处理？

```
+ git push http://****:****@github.com/****/devops-java-sample.git --tags
fatal: unable to access 'http://****:****@github.com/****/devops-java-sample.git/': Could not resolve host: yunify.com; Unknown error
script returned exit code 128  
```

答：可能是 GitHub 账号或密码带有 "@" 这类特殊字符，需要用户在创建凭证时对密码进行 urlencode 编码，可通过一些第三方网站进行转换 (比如 `http://tool.chinaz.com/tools/urlencode.aspx`)，然后再将转换后的输出粘贴到对应的凭证信息中。

4、在流水线还未开始运行，已经执行失败的情况下，重新执行流水线遇到如下报错，如何处理？

![](https://pek3b.qingstor.com/kubesphere-docs/png/WechatIMG6074.png)

答：这是由于 Jenkins 重新执行的机制做了限制。流水线还未开始运行就执行失败，Jenkins 会认为这是由于一些与运行无关的原因所引起的，比如无法连接 repo 、Jenkinsfile 语法错误等原因，可参考类似 [issue](https://issues.jenkins-ci.org/browse/JENKINS-51441) 。若需要执行新的构建，可通过其他构建重新执行，或者点击运行，创建新的构建。