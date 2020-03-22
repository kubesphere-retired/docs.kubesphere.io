---
title: "Release Notes For 2.0.1"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere 高级版 (Advanced Edition 2.0.1) 修复了已知的 Bug，2.0.1 已于 2019 年 6 月 9 日 正式发布。建议下载并安装最新的 2.0.1 版本，若您已经安装了 1.0.x 或 2.0.0 版本，请下载 2.0.1 版本的 Installer，支持一键升级至 2.0.1。

## Bug 修复详情列表

- 修复 CI/CD 流水线无法正确识别代码分支名中含有特殊字符的问题
- 修复 CI/CD 流水线在部分情况下无法查看日志的问题
- 修复日志查询时，因索引文档分片异常造成的无日志数据输出的问题，并增加对异常的提示
- 修复无日志情况下搜索日志，提示异常的问题
- 修复流量治理拓扑图线条重叠的问题 修复镜像策略应用无效的问题


## 安装 2.0.1

### 安装指南

高级版 2.0.1 支持以下两种安装模式，安装前请参考 [安装说明](../../installation/intro)。

- [All-in-One](../../installation/all-in-one)：All-in-One 模式即单节点安装，支持一键安装，仅建议您用来测试或熟悉安装流程和了解 KubeSphere 高级版的功能特性。
- [Multi-Node](../../installation/multi-node)：Multi-Node 即多节点集群安装，高级版支持 master 节点和 etcd 的高可用，支持在正式环境安装和使用。

### 升级指南

高级版 2.0.1 修复了已知的 Bug，支持一键升级至 2.0.1，请参考 [升级指南](../../installation/upgrade)。