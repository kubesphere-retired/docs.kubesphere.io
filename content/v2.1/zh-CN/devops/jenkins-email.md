---
title: "流水线配置邮件服务器"
keywords: 'kubernetes, docker, email, notification, pipeline'
description: '在 KubeSphere 流水线中配置邮件服务器发送邮件通知'
---

## 修改 Jenkins 邮件服务器设置

在目前版本当中，Jenkins 的邮件配置还没有与系统默认的邮件设置打通，需要编辑 `ks-jenkins` 的 Deployment 配置文件设置邮件服务器。此文档将介绍如何对 Jenkins 发送邮件进行设置。

1. 使用具有 `cluster-admin` 权限的账号登陆 KubeSphere 控制台，进入企业空间 `system-workspace`-> 项目 `kubesphere-devops-system`，进入该项目。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222231148.png)


2. 在这个项目下进入 **应用负载** → **工作负载** 列表，点击进入 `ks-jenkins` 这个工作负载的详情页。

3. 点击 **更多操作** -> **编辑配置模版** -> **容器组模版** -> 修改 `ks-jenkins`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200224211529.png)

4. 下拉窗口滑块，找到环境变量设置，修改下列环境变变量进行设置 Jenkins 的邮件发送。（此环境变量在安装之后会有默认值，用户可以参考修改为自己邮件服务器的配置）

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200224211647.png)

> 注: 修改 Jenkins 环境变量将导致 Jenkins 的 Deployment 重启，请合理安排配置调整时间。

| 环境变量名称 | 含义 |
|---|---|
|EMAIL\_SMTP\_HOST | SMTP 邮件服务器地址 |
|EMAIL\_SMTP\_PORT | SMTP 邮件服务器端口  |
|EMAIL\_FROM\_ADDR | 发件人邮箱地址 |
|EMAIL\_FROM\_NAME | 发件人名称 |
|EMAIL\_FROM\_PASS | 密码|
|EMAIL\_USE\_SSL | 是否开启 SSL 配置 |
