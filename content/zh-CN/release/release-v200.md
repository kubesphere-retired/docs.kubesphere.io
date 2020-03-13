---
title: "Release Notes For 2.0.0"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere 高级版 (Advanced Edition 2.0.0) 已于 2019 年 5 月 18 日 正式发布。建议下载并安装最新的 2.0.0 版本，若您已经安装了 1.0.1 或 1.0.0 版本，请下载 2.0.0 版本的 Installer，支持一键升级 1.0.0 (或 1.0.1) 至 2.0.0。

##  高级版 2.0.0 更新详情列表  

### 组件升级
 
 - 支持 Kubernetes 升级至 [Kubernetes 1.13.5](https://github.com/kubernetes/kubernetes/releases/tag/v1.13.5)    
 - 集成 [QingCloud Cloud Controller](https://github.com/yunify/qingcloud-cloud-controller-manager)，安装后可通过 KubeSphere 控制台创建 QingCloud 负载均衡器并自动绑定后端工作负载 
 - 集成 [QingStor CSI v0.3.0](https://github.com/yunify/qingstor-csi/tree/v0.3.0) 存储插件，支持物理 NeonSAN 存储系统，可提供高可用、高性能分布式 SAN 存储服务  
 - 集成 [QingCloud CSI v0.2.1](https://github.com/yunify/qingcloud-csi/tree/v0.2.1) 存储插件，支持 QingCloud 单副本硬盘，容量型、性能型、超高性能型、基础型、企业型、NeonSAN 硬盘   
 - 可选安装组件 Harbor 升级至 1.7.5  
 - 可选安装组件 GitLab 升级至 11.8.1  
 - Prometheus 升级至 2.5.0  

### 微服务治理  

 - 集成 Istio 1.1.1，支持图形化创建包含多个微服务组件的应用  
 - 支持为项目（外网访问）和应用开启/关闭应用治理  
 - 内置微服务治理示例 [Bookinfo](../zh-CN/quick-start/bookinfo-canary/)  
 - 支持流量治理
 - 支持流量镜像
 - 基于 Istio 提供微服务级别的负载均衡功能
 - 支持金丝雀发布
 - 支持蓝绿部署  
 - 支持熔断  
 - 支持链路追踪
   

### DevOps 

 - CI/CD 流水线提供邮件通知功能，支持构建过程中发送邮件
 - CI/CD 图形化编辑流水线增强，增加更多流水线常用插件和执行条件
 - 提供基于 SonarQube 7.4 的代码漏洞扫描功能  
 - 提供 [Source to Image](https://github.com/kubesphere/s2ioperator) 功能，基于代码无需 Dockerfile 直接构建应用负载并发布运行   

### 监控  

 - 提供 Kubernetes 组件独立监控页，包括 etcd、kube-apiserver 和 kube-scheduler  
 - 优化若干监控指标算法 
 - 优化监控资源占用，减少 Prometheus 内存及磁盘使用量 80% 左右 

### 日志  

 - 提供根据租户权限过滤的统一日志检索控制台  
 - 支持精确和模糊日志检索  
 - 支持实时和历史日志检索  
 - 支持组合条件日志检索，包括：项目、工作负载、容器组、容器、关键字和时间范围  
 - 支持单条日志直达日志详情页，并可切换不同容器组以及容器组下不同容器  
 - 支持日志详情页直达容器组或者容器详情页  
 - 基于自研 [FluentBit Operator](https://github.com/kubesphere/fluentbit-operator) 提供灵活的日志收集配置：可添加 Elasticsearch、Kafka 和 Fluentd 作为日志接收者，并可按需激活/关闭；在发送给日志接收者前，可灵活输入过滤条件筛选出所需要的日志  

### 告警和通知

 - 支持针对集群节点和工作负载资源的邮件通知  
 - 支持组合通知规则：可组合多种监控资源，制定不同的告警级别、检测周期、推送次数和阈值  
 - 可配置通知时间段和通知人  
 - 支持针对不同通知级别设置独立的通知重复规则   

### 安全加强  

 - 修复 [runc 容器逃逸漏洞](https://log.qingcloud.com/archives/5127)  
 - 修复 [Alpine 镜像 shadow 漏洞](https://www.alpinelinux.org/posts/Docker-image-vulnerability-CVE-2019-5021.html)  
 - 支持单点和多点登录配置项  
 - 多次无效登录后强制要求输入验证码  
 - 账户密码策略增强，阻止创建弱密码的账户  
 - 其他若干安全增强  

### 界面优化  

 - Console 多处用户体验优化，如支持在 DevOps 工程与项目间切换
 - 优化多处中英文页面文案

### 其他

 - 支持 etcd 备份及恢复  
 - 支持 docker 镜像定期清理   

## Bug 修复详情列表

 - 修复删除页面资源页面未及时更新问题  
 - 修复删除 HPA 工作负载后残留脏数据问题  
 - 修复任务（Job）状态显示不正确的问题   
 - 更正资源配额、Pod 用量、存储指标算法  
 - 调整 CPU 用量结果精度  
 - 其他若干 Bug 修复  


## 安装 2.0.0

### 安装指南

高级版 2.0.0 支持以下两种安装模式，安装前请参考 [安装说明](../../installation/intro)。

- [All-in-One](../../installation/all-in-one)：All-in-One 模式即单节点安装，支持一键安装，仅建议您用来测试或熟悉安装流程和了解 KubeSphere 高级版的功能特性。
- [Multi-Node](../../installation/multi-node)：Multi-Node 即多节点集群安装，高级版支持 master 节点和 etcd 的高可用，支持在正式环境安装和使用。

### 升级指南

高级版 2.0.0 相较于 1.0.1 提供了更丰富的企业级功能，并对 1.0.1 已有功能进行了改进和功能优化，并修复了已知的 Bug，支持一键升级 1.0.0 (或 1.0.1) 至 2.0.0，请参考 [升级指南](../../installation/upgrade)。