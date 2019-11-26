---
title: "Release Notes For 1.0.1"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere 高级版 (Advanced Edition 1.0.1) 已于 2019 年 1 月 28 日 正式发布。建议下载并安装最新的 1.0.1 版本，若您已经安装了 1.0.0 版本，请下载 1.0.1 版本的 Installer，支持一键升级 1.0.0 至 1.0.1。


## 下载高级版 1.0.1

请前往 KubeSphere 官网下载最新的 [KubeSphere Advanced Edition 1.0.1](/download/?type=advanced)。

### 安装指南

高级版 1.0.1 支持以下两种安装模式，安装前请参考 [安装说明](../../installation/intro)。

- [All-in-One](../../installation/all-in-one)：All-in-One 模式即单节点安装，支持一键安装，仅建议您用来测试或熟悉安装流程和了解 KubeSphere 高级版的功能特性。
- [Multi-Node](../../installation/multi-node)：Multi-Node 即多节点集群安装，高级版支持 master 节点和 etcd 的高可用，支持在正式环境安装和使用。

### 升级指南

v1.0.1 对 v1.0.0 进行了改进和功能优化，并修复了已知的 Bug，支持一键升级 1.0.0 至 1.0.1，参考 [升级指南](../../installation/upgrade)。

## 高级版 1.0.1 更新详情

### Bug 修复

- 修复 workspaces-manager 角色的账户登录后无法看到企业空间列表的问题。
- 修复 git 类型代码仓库凭证传参问题。
- 修正不存在用户登录失败的提示信息。    
- 修复已删除应用残留数据问题。
- 修复某些 Helm 应用的配置文件中的参数显示问题。  
- 修复 Pod 横向自动弹性伸缩（HPA）针对不同权限用户的显示问题。    
- 修复在某些场景下修改应用路由 Hosts 参数不生效的问题。
- 更正多处中英文页面文案。

### 功能优化

 - 在更新有状态副本集的时候，可同步编辑其关联服务。
 - 更新资源时，其详情页的子页面的内容会有保存提示。  
 - 规范创建以及编辑项目时的 CPU 和内存限额的单位。  
 - 允许用户为没有 CPU 和内存限额的项目添加限额。  
 - 校验 DevOps 工程下凭证信息的完整性。  
 - 支持用户级别设置界面语言。
 - 允许将 NodePort 类型的服务修改为 None 类型。  
 - 允许登录用户在用户设置页面修改密码。 
 - 多处用户体验优化，包括容器编辑界面输入参数、更新策略、容器日志等。

 ### Kubernetes 相关

 - Kubernetes v1.12.3 可升级至 [Kubernetes 1.12.5](https://github.com/kubernetes/kubernetes/releases/tag/v1.12.5)，同时支持升级至 v1.13.2。
 <!-- - Kube-proxy 默认选择 ipvs 作为 proxy mode。 -->
 - etcd 支持升级至 v3.2.24。

### 安全

 - 登录方式支持验证码，防止登录攻击。   
 - 增加资源删除前的确认提示。



