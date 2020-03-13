---
title: "Enable Logging System"
keywords: 'kubesphere, kubernetes, docker, prometheus, elasticsearch, logging, elk'
description: 'How to enable KubeSphere logging system'
---

## What is KubeSphere Logging System

KubeSphere provides powerful and easy-to-use logging system which offers users the capabilities of log collection, query and management in terms of tenants. Meanwhile, the system provides not only infrastructure logging capabilities but application logging capabilities. Moreover, it provides various search scopes such as project, workload, Pod, docker and keyword. Tenant-based logging system is much more useful than Kibana since different tenant can only view her/his own logs, leading much better security. KubeSphere logging system is a pluggable component that you can enable to use. It has the following features.

> - [Support multi-tenant and multi-dimensional log search](../../logging/log-query)
> - [Support file-based logging](../../workload/logs-on-disk)
> - Support various log receivers including Elasticsearch, Kafka and Fluentd

## Enable Logging System before Installation

<font color=red>KubeSphere logging system requires at least 56m of CPU request and 2.76G of memory request. Please make sure your cluster has enough resource.</font>

Before start the installation, you can change the value of `logging_enabled` in `conf/common.yaml` from `false` to `true` to enable logging system as shown below, then you can continue your installation by following the instructions of [All-in-One](../all-in-one) or [Multi-Node](../multi-node).

> Note: By default, KubeSphere will install Elasticsearch within the cluster for testing purpose. It also supports using external Elasticsearch (v7.x) which reduces memory consumption of your cluster resource. Generally, we recommend you to use external Elasticsearch in production environment by configuring the parameters `external_es_url` and `external_es_port`.

```yaml
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

Then you can continue your installation by following the instructions of [All-in-One](../all-in-one) or [Multi-Node](../multi-node).

## Enable Logging System after Installation

If you already have set up KubeSphere without enabling logging system, you still can edit the ConfigMap of ks-installer using the following command.

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

Then set logging from `False` to `True`.

```yaml
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

Save it and exit. The logging system will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.
