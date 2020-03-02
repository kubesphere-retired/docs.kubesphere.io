---
title: "Release Notes For 2.1.1"
keywords: 'kubernetes, docker, kubesphere, jenkins, istio'
description: 'KubeSphere Release Notes - 2.1.1'
---

## Installer

### UPGRADE & ENHANCEMENT

- 支持 Kubernetes v1.14.x、v1.15.x、v1.16.x、v1.17.3，同时解决 K8s API 兼容性问题 #[1829](https://github.com/kubesphere/kubesphere/issues/1829)
- 简化在已有 Kubernetes 上安装的步骤，无需配置集群 CA 证书路径，如不需 etcd 监控数据也无需配置 etcd 证书路径
- 升级前备份 CoreDNS 配置以便恢复

### BUG FIXES

- 修复安装后应用商店下内置应用导入失败的问题

## 应用商店

### UPGRADE & ENHANCEMENT

- OpenPitrix 版本升级至 v0.4.8

### BUG FIXES

- 修复发布的最新版应用版本号显示问题 #[1130](https://github.com/kubesphere/kubesphere/issues/1130)
- 修复应用审核列表页面列名错误的问题 #[1498](https://github.com/kubesphere/kubesphere/issues/1498)
- 修复无法按名称和企业空间搜索审核中应用的问题 #[1497](https://github.com/kubesphere/kubesphere/issues/1497)
- 修复应用删除后无法创建同名应用的问题 #[1821](https://github.com/kubesphere/kubesphere/pull/1821) #[1564](https://github.com/kubesphere/kubesphere/issues/1564)
- 修复应用商店部署时常常容易失败的问题 #[1619](https://github.com/kubesphere/kubesphere/issues/1619) #[1730](https://github.com/kubesphere/kubesphere/issues/1730)

## 存储

### UPGRADE & ENHANCEMENT

- 内置支持阿里云和腾讯云存储插件

### BUG FIXES

- 修复存储类型列表页不支持分页的问题 #[1583](https://github.com/kubesphere/kubesphere/issues/1583) #[1591](https://github.com/kubesphere/kubesphere/issues/1591)
- 修复在创建创建 ceph 存储类型时 imageFeatures 默认显示 2 的问题 #[1593](https://github.com/kubesphere/kubesphere/issues/1593)
- 修复存储卷列表中状态查询条件不生效 #[1582](https://github.com/kubesphere/kubesphere/issues/1582)
- 修复存储卷异常显示问题 #[1581](https://github.com/kubesphere/kubesphere/issues/1581)
- 修复关联已删除的存储类型的存储卷无法正常显示的问题 #[1580](https://github.com/kubesphere/kubesphere/issues/1580) #[1579](https://github.com/kubesphere/kubesphere/issues/1579)

## 可观察性

### UPGRADE & ENHANCEMENT

- Fluent Bit 版本升级至 v1.3.5 #[1505](https://github.com/kubesphere/kubesphere/issues/1505)
- Kube-state-metrics 版本升级至 v1.7.2
- Elastic Curator 版本升级至 v5.7.6 #[517](https://github.com/kubesphere/ks-installer/issues/517)
- Fluent Bit Operator 支持自动获取宿主机上 Docker 容器日志目录软连接真实路径
- Fluent Bit Operator 支持声明式配置的方式管理 Fluent Bit 实例（通过修改 Operator ConfigMap）
- 调整告警列表页面排序方式 #[1397](https://github.com/kubesphere/kubesphere/issues/1397)
- 调整容器内存用量指标，使用 container_memory_working_set_bytes

### BUG FIXES

- 修复容器详情页日志延迟问题 #[1650](https://github.com/kubesphere/kubesphere/issues/1650)
- 修复多副本工作负载部分副本的容器无日志的问题 #[1505](https://github.com/kubesphere/kubesphere/issues/1505)
- 修复 Curator 不兼容 Elasticsearch 7.x #[517](https://github.com/kubesphere/ks-installer/issues/517)
- 修复容器创建过程中，查看容器日志报错的问题 #[1518](https://github.com/kubesphere/kubesphere/issues/1518)
- 修复在节点资源调整时，节点监控偶尔出现空节点的问题 #[1464](https://github.com/kubesphere/kubesphere/issues/1464)
- 修复监控中心页面组件状态未实时更新的问题 #[1858](https://github.com/kubesphere/kubesphere/issues/1858)
- 修复告警详情中，监控目标数量不正确 #[61](https://github.com/kubesphere/console/issues/61)

## DevOps

### BUG FIXES

- 修复流水线 UNSTABLE 状态没有展示的问题 #[1428](https://github.com/kubesphere/kubesphere/issues/1428)
- 修复 DevOps 流水线中 KubeConfig 格式不对的问题 #[1529](https://github.com/kubesphere/kubesphere/issues/1529)
- 修复 B2I 不支持阿里云镜像仓库地址的问题 #[1500](https://github.com/kubesphere/kubesphere/issues/1500)
- 修复 DevOps 流水线分支列表分页显示问题 #[1517](https://github.com/kubesphere/kubesphere/issues/1517)
- 修复 Jenkinsfile 配置流水线参数导致流水线配置无法展示的问题 #[1522](https://github.com/kubesphere/kubesphere/issues/1522)
- 修复 S2I 任务构建生成的制品下载失败的问题 #[1547](https://github.com/kubesphere/kubesphere/issues/1547)
- 修复[重启 Jenkins 概率性造成数据丢失的问题]( https://kubesphere.com.cn/forum/d/283-jenkins)
- 修复流水线对接 Github 只能检出 PR-HEAD 的问题 #[1780](https://github.com/kubesphere/kubesphere/issues/1780)
- 修复更新 DevOps 凭证  HTTP 414 的问题 #[1824](https://github.com/kubesphere/kubesphere/issues/1824)
- 修复 B2I/S2I 生成的 s2ib/s2ir 名称错误的问题 #[1840](https://github.com/kubesphere/kubesphere/issues/1840)
- 图形化创建流水线时，无法拖动任务进行排序 #[62](https://github.com/kubesphere/console/issues/62)


## 认证和权限

### UPGRADE & ENHANCEMENT

- 通过CSR生成客户端证书 #[1449](https://github.com/kubesphere/kubesphere/issues/1449)
- 收敛企业空间管理权限，具有企业空间管理权限的用户不能参与企业空间下的项目协同#[1844](https://github.com/kubesphere/kubesphere/issues/1844)

### BUG FIXES

- 修复 KubeConfig 文件证书内容不全的问题 #[1529](https://github.com/kubesphere/kubesphere/issues/1529)
- 修复用不同权限用户连续用同一浏览器登录报错的问题 #[1600](https://github.com/kubesphere/kubesphere/issues/1600)

## 用户体验

### UPGRADE & ENHANCEMENT

- 创建工作负载时，可配置安全上下文（SecurityContext）#[1530](https://github.com/kubesphere/kubesphere/issues/1530)
- 创建工作负载时，可配置 init container #[1488](https://github.com/kubesphere/kubesphere/issues/1488)
- 配置探针时，增加支持 startupProbe 类型探针，同时参数增加支持 periodSeconds、successThreshold、failureThreshold 参数 #[1487](https://github.com/kubesphere/kubesphere/issues/1487)
- 优化 Pod 状态显示 #[1187](https://github.com/kubesphere/kubesphere/issues/1187)
- 前端报错提示优化 #[43](https://github.com/kubesphere/console/issues/43)

### BUG FIXES

- 修复未就绪容器组（Pod）状态显示错误的问题 #[1187](https://github.com/kubesphere/kubesphere/issues/1187)
- 修复在以 QingCloud 负载均衡器配置服务时，注解（annotation）参数无法删除的问题 #[1395](https://github.com/kubesphere/kubesphere/issues/1395)
- 修复创建服务时工作负载选择列表显示的问题 #[1596](https://github.com/kubesphere/kubesphere/issues/1596)
- 修复无法编辑定时任务配置文件的问题 #[1521](https://github.com/kubesphere/kubesphere/issues/1521)
- 修复无法更新有状态副本集的服务的问题 #[1513](https://github.com/kubesphere/kubesphere/issues/1513)
- 修复无法搜索青云、阿里云等镜像仓库中镜像的问题 #[1627](https://github.com/kubesphere/kubesphere/issues/1627)
- 修复相同创建时间的资源排序混乱的问题 #[1750](https://github.com/kubesphere/kubesphere/pull/1750)
- 修复服务详情无法编辑配置文件问题 #[41](https://github.com/kubesphere/console/issues/41)
