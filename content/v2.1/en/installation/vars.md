---
title: "Kubernetes Cluster Configuration"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Configure Kubernetes related fields'
---

This tutorial explains each field related to Kubernetes cluster configuration in `conf/common.yaml`, you can reference following section to understand each parameters.

```yaml
######################### Kubernetes #########################
# The default k8s version will be installed
kube_version: v1.16.7  

# The default etcd version will be installed
etcd_version: v3.2.18  

# Configure a cron job to backup etcd data, which is running on etcd machines.
# Period of running backup etcd job, the unit is minutes.
# The default value 30 means backup etcd every 30 minutes.
etcd_backup_period: 30

# How many backup replicas to keep.
# The default value5 means to keep latest 5 backups, older ones will be deleted by order.
keep_backup_number: 5

# The location to store etcd backups files on etcd machines.
etcd_backup_dir: "/var/backups/kube_etcd"

# Add other registry. (For users who need to accelerate image download)
docker_registry_mirrors:
  - https://docker.mirrors.ustc.edu.cn
  - https://registry.docker-cn.com
  - https://mirror.aliyuncs.com

# Kubernetes network plugin, Calico will be installed by default. Note that Calico and flannel are recommended, which are tested and verified by KubeSphere.
kube_network_plugin: calico

# A valid CIDR range for Kubernetes services,
# 1. should not overlap with node subnet
# 2. should not overlap with Kubernetes pod subnet
kube_service_addresses: 10.233.0.0/18

# A valid CIDR range for Kubernetes pod subnet,
# 1. should not overlap with node subnet
# 2. should not overlap with Kubernetes services subnet
kube_pods_subnet: 10.233.64.0/18

# Kube-proxy proxyMode configuration, either ipvs, or iptables
kube_proxy_mode: ipvs

# Maximum pods allowed to run on every node.
kubelet_max_pods: 110

# Enable nodelocal dns cache, see https://github.com/kubernetes-sigs/kubespray/blob/master/docs/dns-stack.md#nodelocal-dns-cache for further information
enable_nodelocaldns: true

# Highly Available loadbalancer example config
# apiserver_loadbalancer_domain_name: "lb.kubesphere.local"  # Loadbalancer domain name
# loadbalancer_apiserver:  # Loadbalancer apiserver configuration, please uncomment this line when you prepare HA install
#   address: 192.168.0.10  # Loadbalancer apiserver IP address
#   port: 6443             # apiserver port
```
