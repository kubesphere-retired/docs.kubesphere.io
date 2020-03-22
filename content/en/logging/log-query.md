---
title: "Log Query"
keywords: "kubernetes, kubesphere, elasticsearch, fluentbit, logging"
description: "Multi-tenant and multi-dimensional log search on KubeSphere"
---

The logs of applications and systems can help you understand what is happening inside your cluster and workloads. The logs are particularly useful for debugging problems and monitoring cluster activities. KubeSphere provides a powerful and easy-to-use logging system which offers users the capabilities of log collection, query and management in terms of tenants. Tenant-based logging system is much more useful than Kibana since different tenants can only view her/his own logs, leading much better security. Moreover, KubeSphere logging system filters out lots of redundant information.

## Logging System Architecture

![Logging System Architecture](https://pek3b.qingstor.com/kubesphere-docs/png/20190623121834.png)

KubeSphere logging system is deployed through the FluentBit operator. It deploys and configures a Fluent Bit DaemonSet on every node to collect container and application logs from the node file system. Fluent Bit collects logs from all Pods, and transfers the logs to ElasticSearch by default. The cluster admin can also specify the logs collector like Kafka or Fluentd.

> - FluentBit-operator is deployed as a DaemonSet on each node, the director `/var/log/containers` in the host will be mapped to the FluentBit-operator container. The _Input_ plugin of FluentBit-operator tails the mapped log files, then the _Output_ plugin will transfer the collected logs to ElasticSearch, Kafka, Fluentd etc. according to the configuration.
> - ElasticSearch is deployed as a StatefulSet in the cluster. The _Output_ plugin will create the corresponding Index in ElasticSearch (defaults to create one Index per day). It creates the mapping of specified format for Kubernetes logs.
> - ElasticSearch Curator is the component that performs scheduled maintenance operations and trims logs by time. It is deployed as a CronJob to periodically run and delete the outdated logs, i.e. delete the Index. The preservation time defaults to last `seven` days, you can modify it according to your needs.
> - KubeSphere logging console provides the capabilities of log query, analysis and statistics for users.

## Log Query

KubeSphere supports logs query for tenant isolation. Use the `admin` account to log in KubeSphere, choose **Toolbox → Log Query**.

![Log Query](https://pek3b.qingstor.com/kubesphere-docs/png/20200308203245.png)

As shown in the pop-up window, you can see the trend of logs amount. The logging console supports the following query levels:

- Keyword
- Project
- workload
- Pod
- container
- Range of time

> - For example, you can use “Error”, “Fail”, “Fatal”, “Exception”, “Warning”  to query the exception logs. The query rules support combinatorial keywords query, also supports exact query or fuzzy query.
> - Fuzzy query supports case-insensitive fuzzy matching and retrieval of full terms by the first half of a word or phrase because of the ElasticSearch segmentation rules. For example, you can retrieve the logs containing `node_cpu_totoal` by search the keyword `node_cpu`, but not the keyword `cpu`.

![Log query](https://pek3b.qingstor.com/kubesphere-docs/png/20200308181906.png)

It also supports customizing the range of time to query. KubeSphere stores the logs for last seven days by default.

> Note: You can modify the retain period in the ConfigMap `elasticsearch-logging-curator`.

![Range of time to query](https://pek3b.qingstor.com/kubesphere-docs/png/20200308203853.png)

### How to Query

For example, let's query the logs including the keyword `error` in the `kubesphere-system` project within `last 1 hour` as shown in the following screenshot:

![How to query log](https://pek3b.qingstor.com/kubesphere-docs/png/20200308205141.png)

It returns 74 rows of results with the corresponding time, project, Pod, logs.

Click any one of the results from the list. Drill into its detail page and inspect the logs from this Pod, including the complete context at the right section. It is convenient for developers to debug and analyze.

> Note: It supports dynamical refresh with 5s, 10s or 15s, and allows to export the logs to local for further analysis.

![Log detail page](https://pek3b.qingstor.com/kubesphere-docs/png/20200308205736.png)

As you see from the left panel, you can switch to inspect another Pod and its container within the same project from the dropdown list. In this case, you can determine if any abnormal Pods affect other Pods.

![Logs page](https://pek3b.qingstor.com/kubesphere-docs/png/20200308211831.png)

## Drill into Detail Page

If the log looks abnormal, you can drill into the the Pod detail page or container detail page to deep inspect the container logs, resource monitoring graph and events.

![Drill into detail page](https://pek3b.qingstor.com/kubesphere-docs/png/20200308211936.png)

Inspect the container detail page as follows. At the same time, it allows you to open the terminal to debug container directly.

![Container detail page](https://pek3b.qingstor.com/kubesphere-docs/png/20200308212007.png)
