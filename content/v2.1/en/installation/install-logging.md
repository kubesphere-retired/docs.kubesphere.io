---
title: "Enable KubeSphere Logging System Installation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Install Helm Application Store'
---

## What is KubeSphere Logging System

KubeSphere logging system provides powerful and easy-to-use logs search, collect and management features, based on [Elasticsearch](https://jenkins.io/). For example, it includes multi-tenant logging management, multi-level logs search (including namespace, workload, Pod, container and keywords), as well as flexible and convenient logs collection configuration, which supports forward logs to Elasticsearch, Kafka and Fluentd. In addition, we added collect logs on disk in KubeSphere v2.1.

When it compares with Kibana, KubeSphere logging system based on multitenancy, which makes different roles of tenants can only see the logs belong to their own account.

**Log search**
![](https://pek3b.qingstor.com/kubesphere-docs/png/20191228210920.png)

**Log collection**
![](https://pek3b.qingstor.com/kubesphere-docs/png/20191228210953.png)


## Enable Logging System Before Installation

<font color=red>KubeSphere logging system requires 56 m (CPU request) and 2.76 G (Memory request) at least, make sure your cluster has enough resource.</font>

Before execute installation, you can enable logging system in `conf/common.yaml` according to the following configuration:

> Note: KubeSphere will install Elasticsearch for testing purpose in your cluster by default, it also supports using external Elasticsearch (v7.x), it can reduce memory consumption as well, we recommend you to use external Elasticsearch in production environment, following `external_es_url` and `external_es_port` allows you to configure external ES.

```bash
# Logging
logging_enabled: true # Whether to install KubeSphere logging system
elasticsearch_master_replica: 1  
elasticsearch_data_replica: 2  
elasticsearch_volume_size: 20Gi
log_max_age: 7
elk_prefix: logstash
kibana_enabled: false # Whether to install Kibana
#external_es_url: SHOULD_BE_REPLACED # Elasticsearch service URL
#external_es_port: SHOULD_BE_REPLACED # Elasticsearch service port
```

Then you can back to All-in-one or Multi-node guide to continue installation.

## Enable Logging System After Installation

Edit the ConfigMap of ks-installer using following command:

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

Then set OpenPitrix from False to True:

```bash
logging:
     enabled: True
     elasticsearchMasterReplica: 1
     elasticsearchDataReplica: 2
     elasticsearchVolumeSize: 20Gi
     logMaxAge: 7
     elkPrefix: logstash
     containersLogMountedPath: ""
     kibana:
       enabled: False
```

Save it and exit, it will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.
