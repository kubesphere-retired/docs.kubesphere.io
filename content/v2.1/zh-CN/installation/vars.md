---
title: "自定义组件安装（安装前）"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere 2.1 版本的 Installer 对各功能组件进行了第一次解耦，支持 [自定义安装各个功能组件](../intro/#自定义安装可插拔的功能组件)，使最小化安装**资源占用更轻量**，同时方便不同用户**按需选择不同的功能组件**。

用户在获取 Installer 并解压至目标安装机器后，如果需要修改存储、网络、组件版本，或选择可选安装项 (如 DevOps 流水线、Service Mesh、OpenPitrix、GitLab、Harbor)、外部负载均衡器、Jenkins、邮件服务器等配置参数时，可参考以下说明进行修改，本文档对 Installer 中的安装配置文件 `conf/common.yaml` 进行说明，简单介绍每一个字段的意义。

### 负载均衡器插件与 QingCloud CSI 配置

配置文件 `conf/common.yaml` 中的前 9 项 qingcloud 开头的配置项是与 QingCloud 云平台负载均衡器插件和 QingCloud CSI 块存储插件相关的公共配置参数，第 10、11 项是启用安装 QingCloud 负载均衡器插件和私有网络配置，释义分别在 [安装负载均衡器插件](../qingcloud-lb) 与 [存储配置说明 - QingCloud 云平台块存储](../storage-configuration/#qingcloud-云平台块存储)。

### 存储相关配置

Installer 使用默认的 [OpenEBS](https://openebs.io/) 基于 [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) 提供持久化存储服务，OpenEBS 支持 [动态申请 PV](https://docs.openebs.io/docs/next/uglocalpv.html#Provision-OpenEBS-Local-PV-based-on-hostpath)，方便初次安装但没有准备存储服务端的场景下进行**部署测试**和**快速体验**。

注意，若在正式环境安装 KubeSphere，则需要配置持久化存储作为存储服务端再执行安装，在 `conf/common.yaml` 支持配置 Ceph RBD、NFS、GlusterFS、QingCloud CSI、NeonSAN CSI 等，存储配置相关参数释义请参考 [存储配置说明](../storage-configuration)。

### 集群组件相关配置

开启可选功能组件的安装之前请确保当前环境的 CPU 与内存空间充足，请参考 [自定义安装各个功能组件](../intro/#自定义安装可插拔的功能组件) 在 `conf/common.yaml` 配置。

**参数说明：**

<details><summary> common.yaml 配置文件参数释义（点击展开）</summary>

```yaml
######################################################################
# Cluster configuration
######################################################################
## Change this to use another Kubernetes version
ks_version: 2.1.0    # KubeSphere 版本号
kube_version: v1.15.5 # Kubernetes 版本号
etcd_version: v3.2.18  # etcd 版本号

ks_image_pull_policy: IfNotPresent # 平台的镜像拉取策略，默认 IfNotPresent，表示优先使用本地镜像，还支持 Always (尝试重新下载镜像) 和 Never (仅使用本地镜像)
kube_network_plugin: calico # 默认的网络插件（支持 Calico、Flannel）

# Kubernetes internal network for services, unused block of space.
kube_service_addresses: 10.233.0.0/18 # Service 网络 IP 地址段（需要是未被使用的地址段）

# internal network. When used, it will assign IP
# addresses from this range to individual pods.
# This network must be unused in your network infrastructure!
kube_pods_subnet: 10.233.64.0/18 # Pod 网络 IP 地址段（需要是未被使用的地址段）

# Kube-proxy proxyMode configuration.
# Can be ipvs, iptables
kube_proxy_mode: ipvs # kube-proxy 模式默认 ipvs (支持 ipvs, iptables)

# Configure the amount of pods able to run on single node
# default is equal to application default
kubelet_max_pods: 110 # 单个节点默认的 Pod 数量上限

# Access Port of KubeSphere
# 30000-32767 (30180/30280/30380 are not allowed)
console_port: 30880 # KubeSphere 控制台访问端口（默认 30880）

disableMultiLogin: true # 禁止同一用户多点登录，默认 true 即禁用

## HA(Highly Available) loadbalancer example config
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
#loadbalancer_apiserver: # 外部的负载均衡器配置项，用于高可用部署，当高可用部署时需取消注释
#  address: 192.168.0.10 # 外部负载均衡器地址，例如阿里云 SLB、AWS NLB、青云 QingCloud 负载均衡器
#  port: 6443 # 外部负载均衡器端口

#Docker periodic cleaning time (Can be reboot/yearly/annually/monthly/weekly/daily/hourly)
periodic_cleaning_time: weekly # Docker 自动清理镜像的周期，默认每周

#Etcd periodic backup time (Specify a period in minutes)
etcd_backup_period: 30 # etcd 备份的周期，默认为 30 分钟
keep_backup_number: 5  # 默认保留最近 5 次备份的数据
etcd_backup_dir: "/var/backups/kube_etcd" # 默认备份的目录为 "/var/backups/kube_etcd"

#CommonComponent
mysql_volume_size: 20Gi # MySQL 存储卷大小
minio_volume_size: 20Gi # Minio 存储卷大小
etcd_volume_size: 20Gi  # etcd 存储卷大小
openldap_volume_size: 2Gi # openldap 存储卷大小
redis_volume_size: 2Gi # MySQL 存储卷大小


# Monitoring
prometheus_replica: 2 #	Prometheus 副本数，默认 2，两个副本的 Prometheus 分别负责不同数据源的监控，同时保证高可用
prometheus_memory_request: 400Mi # Prometheus 内存请求大小
prometheus_volume_size: 20Gi # 	Prometheus 存储卷大小
grafana_enabled: true # 是否额外安装 grafana，若需要自定义监控则开启

# Logging
logging_enabled: true # 是否安装内置的日志系统，建议开启，否则 Console 无法看到任何日志
elasticsearch_master_replica: 1
elasticsearch_data_replica: 2
elasticsearch_volume_size: 20Gi # Elasticsearch 存储卷大小
log_max_age: 7 # 集群内置的 Elasticsearch 中日志保留时间，默认是 7 天
elk_prefix: logstash 
kibana_enabled: true # 是否额外部署 Kibana
logsidecar_injector_enabled: true # 是否安装和增加落盘日志收集器到用户创建的工作负载副本中
#external_es_url: SHOULD_BE_REPLACED # 安装支持对接外部的 Elasticsearch，可减少资源消耗，此处填写 ES 服务的地址
#external_es_port: SHOULD_BE_REPLACED # 此处填写 ES 服务暴露的端口号

#DevOps
devops_enabled: true # 是否安装内置的 DevOps 系统（支持流水线、 S2i 和 B2i 等功能），若机器配置充裕建议安装
jenkins_memory_lim: 8Gi # Jenkins 内存限制，默认 8 Gi
jenkins_memory_req: 4Gi # Jenkins 内存请求，默认 4 Gi
jenkins_volume_size: 8Gi # Jenkins 存储卷大小，默认 8 Gi
jenkinsJavaOpts_Xms: 3g # 以下三项为 jvm 启动参数
jenkinsJavaOpts_Xmx: 6g
jenkinsJavaOpts_MaxRAM: 8g
sonarqube_enabled: true # 是否安装内置的 SonarQube （代码静态分析工具）
#sonar_server_url: SHOULD_BE_REPLACED # 安装支持对接外部已有的 SonarQube，此处填写 SonarQube 服务的地址
#sonar_server_token: SHOULD_BE_REPLACED  # 此处填写 SonarQube 的 Token


#Metrics-Server
metrics_server_enabled: true # 是否安装 Metrics-Server，用于监控 HPA
#OpenPitrix
openpitrix_enabled: true # 是否安装内置的应用商店，若机器配置充裕建议安装
# ServiceMesh: 
servicemesh_enabled: true # 是否安装内置的应用治理，若机器配置充裕建议安装
# Notification
notification_enabled: true # 是否安装内置的邮件通知系统，若机器配置充裕建议安装
# Alerting 
alerting_enabled: true # 是否安装内置的告警系统，若机器配置充裕建议安装


# Harbor
harbor_enabled: false # 是否安装 Harbor 作为私有镜像仓库
harbor_domain: harbor.devops.kubesphere.local #	Harbor 域名（这里可使用默认的域名）
# GitLab
gitlab_enabled: false # 是否安装 GitLab 作为私有代码仓库
gitlab_hosts_domain: devops.kubesphere.local # GitLab 域名（这里可使用默认的域名）


## Container Engine Acceleration
## Use nvidia gpu acceleration in containers
# nvidia_accelerator_enabled: true # 安装是否开启 Nvidia GPU 加速，安装支持 GPU 节点，也支持 CPU 与 GPU 的混合部署
# nvidia_gpu_nodes: # hosts.ini 中要开启 GPU 加速的节点名称
#   - kube-gpu-001  # 例如这里设置节点名为 kube-gpu-001 的机器为 GPU 节点，若有多个 GPU 节点则在其下方继续添加
```
</details>

-----------

<br>

**参数对照表**

| 参数 | 含义 | 
|---|---|
| ks_version | KubeSphere 版本号 | 
| kube_version | Kubernetes 版本号 | 
| etcd_version | etcd 版本号 | 
| openpitrix_version | OpenPitrix 版本号 | 
| ks\_image\_pull\_policy| 默认 IfNotPresent，表示优先使用本地镜像，还支持 Always (尝试重新下载镜像) 和 Never (仅使用本地镜像) |
| kube\_network\_plugin | 默认的网络插件（支持 Calico、Flannel） | 
| kube\_service\_addresses | Service 网络 IP 地址段（未被使用的地址段） | 
| kube\_pods\_subnet | Pod 网络 IP 地址段（未被使用的地址段） | 
| kube\_proxy\_mode | kube-proxy 模式默认 ipvs (支持 ipvs, iptables) | 
| kubelet\_max\_pods | 单台机器默认 Pod 数量 | 
| dns_mode | DNS 模式，建议 coredns | 
| console_port | KubeSphere 控制台访问端口（默认 30880） | 
|disableMultiLogin | 禁止同一用户多点登录，默认 true 即禁用 |
| loadbalancer_apiserver.address | 外部负载均衡器地址 | 
| loadbalancer_apiserver.port | 外部负载均衡器端口 |
| apiserver\_loadbalancer\_domain\_name | 负载均衡器域名，默认 lb.kubesphere.local | 
|periodic\_cleaning\_time| weekly，Docker 自动清理镜像的周期 |
|docker\_registry\_mirrors| 默认 Docker 镜像仓库的 mirror 仓库，可以加快镜像下载 (国外地区下载可将此参数注释) |
|etcd\_backup\_period | 默认备份的周期为 30 分钟|
|keep\_backup\_number | 默认保留最近 5 次备份的数据 |
|etcd\_backup\_dir | 默认备份的目录为 "/var/backups/kube_etcd" |
| prometheus\_memory\_size | Prometheus 内存请求大小 | 
| prometheus\_volume\_size | Prometheus 存储空间大小 | 
| keep\_log\_days | 集群内置的 Elasticsearch 中日志保留时间，默认是 7 天 |
| logsidecar\_injector\_enabled | 是否安装和增加落盘日志收集器到用户创建的工作负载副本中 |
| kibana_enable | 是否部署 Kibana （默认 false） | 
| elasticsearch\_volume\_size | Elasticsearch 存储空间 | 
|EMAIL\_SMTP\_HOST | SMTP 邮件服务器地址 |
|EMAIL\_SMTP\_PORT | SMTP 邮件服务器端口  |
|EMAIL\_FROM\_ADDR | 发件人邮箱地址 |
|EMAIL\_FROM\_NAME | 通知邮件名称 |
|EMAIL\_FROM\_PASS | 密码|
|EMAIL\_USE\_SSL | 是否开启 SSL 配置 |
| jenkins\_memory\_lim | Jenkins 内存限制 | 
| jenkins\_memory\_req | Jenkins 内存请求 | 
| Java_Opts | jvm 启动参数 | 
| JenkinsLocationUrl | jenkins 域名 | 
| harbor_enable | 是否安装 Harbor | 
| harbor_domain | Harbor 域名 | 
| gitlab_enable | 是否部署 GitLab | 
| gitlab\_hosts\_domain | GitLab 域名 | 
| sonarqube_enable | 是否集成并开启 SonarQube，默认安装内置的 SonarQube | 
| sonar\_server\_url | 对接已有的外部 SonarQube 地址（如需集成安装则取消注释） | 
| sonar\_server\_token | 对接已有 SonarQube token（如需集成安装则取消注释） | 
| nvidia\_accelerator\_enabled | 是否开启 Nvidia GPU 加速 | 
| nvidia\_gpu\_nodes | hosts.ini 中要开启 GPU 加速的节点名称（列表），参考以下配置示例 | 

**GPU 节点配置示例**

注意，在安装前可对 GPU 节点在 `common.yaml` 文件中进行设置，例如在 `hosts.ini` 文件配置的两台工作节点 `node1` 是 CPU 节点， `node2` 是 GPU 节点，那么在 `common.yaml` 仅需要在该处填写 node2，注意 "-" 前面需缩进两格。

```yaml
 nvidia_accelerator_enabled: true
 nvidia_gpu_nodes:
   - node2
```
