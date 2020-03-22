---
title: "Release Notes For 2.0.2"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere 高级版 (Advanced Edition 2.0.2) 已于 2019 年 7 月 9 日 正式发布，修复了已知的 Bug，增强了现有的功能。建议下载并安装最新的 2.0.2 版本，若您已经安装了 1.0.x、2.0.0 或 2.0.1 版本，请下载 2.0.2 版本的 Installer，支持一键升级至 2.0.2。

## 高级版 2.0.2 更新详情列表

### 功能增强

- 官网提供 [API docs](../zh-CN/api-reference/api-docs/)
- 防止暴力破解
- 规范资源名称的最大长度
- 升级项目网关 (Ingress Controller) 版本至 0.24.1，支持 Ingress 灰度发布

### Bug 修复详情列表  

- 修复流量拓扑图显示项目之外资源的问题  
- 修复流量拓扑图在特定条件下显示多余服务组件的问题  
- 修复 Source to Image 重新构建镜像操作在特定条件下无法执行的问题  
- 修复失败的 Source To Image 任务导致服务选择页面展示的问题
- 修复容器组 (Pod) 状态异常时无法查看日志的问题   
- 修复磁盘监控无法检测到部分挂盘类型，例如 LVM 硬盘
- 修复已部署应用无法删除的问题  
- 修复应用组件状态判断有误的问题  
- 修复主机节点数计算错误的问题  
- 修复添加环境变量时切换到引用配置按钮导致输入数据丢失的问题  
- 修复项目 Operator 角色用户不能 rerun job 的问题  
- 修复无 IPv4 环境 uuid 无法初始化的问题  
- 修复日志详情页无法滚动下拉查看过往日志的问题  
- 修复 KubeConfig 文件中 APIServer 地址错误的问题  
- 修复无法修改 DevOps 工程名称的问题  
- 修复容器日志无法指定时间查询的问题  
- 修复在特定情况下关联的镜像仓库秘钥没有保存的问题  
- 修复应用下服务组件创建页面没有镜像仓库秘钥参数的问题  

## 安装 2.0.2

### 安装指南

高级版 2.0.2 支持以下两种安装模式，安装前请参考 [安装说明](../../installation/intro)。

- [All-in-One](../../installation/all-in-one)：All-in-One 模式即单节点安装，支持一键安装，仅建议您用来测试或熟悉安装流程和了解 KubeSphere 高级版的功能特性。
- [Multi-Node](../../installation/multi-node)：Multi-Node 即多节点集群安装，高级版支持 master 节点和 etcd 的高可用，支持在正式环境安装和使用。

### 升级指南

高级版 2.0.2 修复了已知的 Bug，支持一键升级至 2.0.2，请参考 [升级指南](../../installation/upgrade)。