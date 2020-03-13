---
title: "落盘日志收集"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '应用商店'
---

KubeSphere 支持多种日志收集的方式，便于运维人员对日志的统一收集、管理和分析，本篇向您介绍如何收集一个示例应用的落盘日志。

## 示例视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/%E8%90%BD%E7%9B%98%E6%97%A5%E5%BF%97%E6%94%B6%E9%9B%86.mp4">
</video>

## 操作步骤

0. 确保已在项目的高级设置下使用管理员开启了 `落盘日志收集`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191030102441.png)

1. 在工作负载下新建一个镜像为 alpine 的部署，tag 默认 latest 即可，然后勾选 `启动命令` ，参数和命令参考如下：

> 提示：以下命令执行的是每 30 s 向 /data/log 的 app-test.log 文件循环地输出一条当前的 date 信息。

```bash
# 运行命令
/bin/sh
# 参数
-c,if [ ! -d /data/log ];then mkdir -p /data/log;fi; while true; do date >> /data/log/app-test.log; sleep 30;done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191030102349.png)

2. 下一步，在存储卷挂载打开 `收集落盘日志`，然后选择 `添加存储卷`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191030102559.png)

3. 根据第 1 步我们设置的测试日志输出路径和日志文件，在临时存储卷的容器挂载路径和容器日志相对路径参考如下：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191030102647.png)

4. 以上步骤完成后，可直接创建，待部署的状态为运行中，即可进入 logsidecar-container（filebeat 容器） 去查看落盘日志，最终输出到了 filebeat 容器的 stdout ：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191030103541.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191030103712.png)

5. 也可以通过工具箱的日志查询工具，输入容器组 （Pod） 名称，来查询输出到 stdout 的落盘日志：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191030103825.png)
