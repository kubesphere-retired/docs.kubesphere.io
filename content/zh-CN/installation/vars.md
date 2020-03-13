---
title: "Kubernetes 集群参数配置"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

用户在获取 Installer 并解压至目标安装机器后，如果需要修改网络、组件版本等集群配置相关参数，可参考以下说明进行修改，本文档对 Installer 中的安装配置文件 `conf/common.yaml` 进行说明，简单介绍每一个字段的意义。

```yaml
######################### Kubernetes #########################
kube_version: v1.16.7  # 默认安装的 Kubernetes 版本，支持指定 v1.15.5,v1.16.7,v1.17.3 的安装
etcd_version: v3.2.18  # 默认安装的 etcd 版本

 # etcd 备份的周期，默认为 30 分钟
etcd_backup_period: 30

# 默认保留最近 5 次备份的数据
keep_backup_number: 5  

# 默认备份的目录为 "/var/backups/kube_etcd"
etcd_backup_dir: "/var/backups/kube_etcd"

# 镜像仓库的 mirror 仓库，可以加快镜像下载 (国外地区下载可将此参数注释)
docker_registry_mirrors:
  - https://docker.mirrors.ustc.edu.cn
  - https://registry.docker-cn.com
  - https://mirror.aliyuncs.com

# Kubernetes 网络插件，支持 Calico 与 Flannel，默认 Calico
kube_network_plugin: calico

# Kubernetes Service 的 IP 地址段（需要是有效的未被使用的地址段），不与节点所在的子网重复，不与 Kubernetes Pod 子网重复
kube_service_addresses: 10.233.0.0/18

# Kubernetes Pod 子网的 IP 地址段（需要是未被使用的地址段），不与节点所在的子网重复，不与 Kubernetes Pod 子网重复，系统将从这个地址段中分配 IP 给每一个 Pod
kube_pods_subnet: 10.233.64.0/18

# kube-proxy 模式默认 ipvs (支持 ipvs, iptables)
kube_proxy_mode: ipvs

# 单个节点默认的 Pod 数量上限
kubelet_max_pods: 110

# 是否允许通过在集群节点上以 Deamonset 的方式运行 DNS 缓存代理来提高集群的 DNS 性能，参考 https://github.com/kubernetes-sigs/kubespray/blob/master/docs/dns-stack.md#nodelocal-dns-cache
enable_nodelocaldns: true

## HA(Highly Available) loadbalancer example config
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
#loadbalancer_apiserver: # 外部的负载均衡器配置项，用于高可用部署，当高可用部署时需取消注释
#  address: 192.168.0.10 # 外部负载均衡器地址，例如阿里云 SLB、AWS NLB、青云 QingCloud 负载均衡器
#  port: 6443 # 外部负载均衡器端口


######################### KubeSphere #########################

# Version of KubeSphere
ks_version: v2.1.0  

# KubeSphere console port, range 30000-32767,
# but 30180/30280/30380 are reserved for internal service
console_port: 30880 # KubeSphere 控制台默认端口

#CommonComponent
mysql_volume_size: 20Gi # MySQL 存储卷大小
minio_volume_size: 20Gi # Minio 存储卷大小
etcd_volume_size: 20Gi  # etcd 存储卷大小
openldap_volume_size: 2Gi # openldap 存储卷大小
redis_volume_size: 2Gi # Redis 存储卷大小


# Monitoring
prometheus_replica: 2 #	Prometheus 副本数，默认 2，两个副本的 Prometheus 分别负责不同数据源的监控，同时保证高可用
prometheus_memory_request: 400Mi # Prometheus 内存请求大小
prometheus_volume_size: 20Gi # 	Prometheus 存储卷大小
grafana_enabled: true # 是否额外安装 grafana，若需要自定义监控则开启


## Container Engine Acceleration
## Use nvidia gpu acceleration in containers
# nvidia_accelerator_enabled: true # 安装是否开启 Nvidia GPU 加速，安装支持 GPU 节点，也支持 CPU 与 GPU 的混合部署
# nvidia_gpu_nodes: # hosts.ini 中要开启 GPU 加速的节点名称，目前仅支持 Ubuntu 16.04
#   - kube-gpu-001  # 例如这里设置节点名为 kube-gpu-001 的机器为 GPU 节点，若有多个 GPU 节点则在其下方继续添加
```

## GPU 节点配置示例

注意，在安装前可对 GPU 节点在 `common.yaml` 文件中进行设置，例如在 `hosts.ini` 文件配置的两台工作节点 `node1` 是 CPU 节点， `node2` 是 GPU 节点，那么在 `common.yaml` 仅需要在该处填写 node2，注意 "-" 前面需缩进两格。注意，目前 GPU 节点仅支持 Ubuntu 16.04。

```yaml
 nvidia_accelerator_enabled: true
 nvidia_gpu_nodes:
   - node2
```
