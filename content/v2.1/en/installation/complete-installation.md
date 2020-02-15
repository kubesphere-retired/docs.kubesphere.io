---
title: "Complete Installation (Enable Installing All Components)"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Install KubeSphere with enable all components to Linux machine'
---

The installer only installs required components (i.e. minimal installation) by default since v2.1.0. Other components are designed to be pluggable, which means you can enable any of them before or after installation. If your machine meets the following minimum requirements, we recommend you to **enable all components before installation**. Complete installation enables you to experience the comprehensive product features and solutions for container management and operation.

<font color="red">  
Minimum Requirements

- All-in-one:
  - CPU: at least 8 cores
  - RAM: 16 GB
- Multi-node:
  - CPU: at least 8 cores totally (For all machines)
  - RAM: 16 GB totally (For all machines)
</font>


> Please note: If your machines don't meet the minimum  requirements of complete installation, you can enable any of components at your will, reference [Enable Pluggable Components Installation](../pluggable-components).

This tutorial will walk you through how to enable all components of KubeSphere in Linux installer, you need to configure them before all-in-one or multi-node installation.

## Prepare Installer

Download `KubeSphere 2.1.0` to your server, run the following commands to download Installer 2.1.0 and unpack it, enter `conf` folder.

```bash
$ curl -L https://kubesphere.io/download/stable/v2.1.0 > installer.tar.gz \
$ tar -zxf installer.tar.gz
$ cd kubesphere-all-v2.1.0/conf
```

## Enable All Components

Edit `conf/common.yaml`, reference the following annotations to enable all components (Set the value from false to true).


```
# LOGGING CONFIGURATION
# logging is an optional component when installing KubeSphere, and
# Kubernetes builtin logging APIs will be used if logging_enabled is set to false.
# Builtin logging only provides limited functions, so recommend to enable logging.
logging_enabled: true # Whether to install logging system
elasticsearch_master_replica: 1  # total number of master nodes, it's not allowed to use even number
elasticsearch_data_replica: 2  # total number of data nodes
elasticsearch_volume_size: 20Gi # Elasticsearch volume size
log_max_age: 7 # Log retention time in built-in Elasticsearch, it is 7 days by default.
elk_prefix: logstash # the string making up index names. The index name will be formatted as ks-<elk_prefix>-log
kibana_enabled: false # Kibana Whether to install built-in Grafana
#external_es_url: SHOULD_BE_REPLACED # External Elasticsearch address, KubeSphere supports integrate with Elasticsearch outside the cluster, which can reduce the resource consumption.
#external_es_port: SHOULD_BE_REPLACED # External Elasticsearch service port

#DevOps Configuration
devops_enabled: true # Whether to install built-in DevOps system (Supports CI/CD pipeline, Source/Binary to image)
jenkins_memory_lim: 8Gi # Jenkins memory limit, it is 8 Gi by default
jenkins_memory_req: 4Gi # Jenkins memory request, it is 4 Gi by default
jenkins_volume_size: 8Gi # Jenkins volume size, it is 8 Gi by default
jenkinsJavaOpts_Xms: 3g # Following three are JVM parameters
jenkinsJavaOpts_Xmx: 6g
jenkinsJavaOpts_MaxRAM: 8g
sonarqube_enabled: true # Whether to install built-in SonarQube
#sonar_server_url: SHOULD_BE_REPLACED # External SonarQube address, KubeSphere supports integrate with SonarQube outside the cluster, which can reduce the resource consumption.
#sonar_server_token: SHOULD_BE_REPLACED  # SonarQube token

# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
openpitrix_enabled: true       # KubeSphere application store
metrics_server_enabled: true   # KubeSphere HPA
servicemesh_enabled: true      # KubeSphere service mesh system(Istio-based)
notification_enabled: true     # KubeSphere notification system
alerting_enabled: true         # KubeSphere alerting system

# Harbor is a 3rd-party component.
# Which could be turned on to install it before installation or later by updating its value to true
harbor_enabled: true           # Whether to install Harbor registry
harbor_domain: harbor.devops.kubesphere.local
# GitLab is a 3rd-party component.
# Which could be turned on to install it before installation or later by updating its value to true
gitlab_enabled: true           # Whether to install GitLab
gitlab_hosts_domain: devops.kubesphere.local
```

Save it, then you can return to [All-in-One](../all-in-one) or [multi-node](../multi-node) to continue installation.
