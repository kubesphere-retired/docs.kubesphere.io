---
title: "DaemonSets"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

A DaemonSet ensures that all (or some) Nodes run a copy of a Pod. As nodes are added to the cluster, Pods are added to them.
There are some typical uses of a DaemonSet as following:

- Running a logs collection daemon on every node, such as Fluentd or Logstash.
- Running a node monitoring daemon on every node, such as Prometheus Node Exporter, collectd, AppDynamics Agent, 
- Running a cluster storage daemon and system program on every node, such as Glusterd, Ceph, kube-dns, kube-proxy, etc.

## Create a DaemonSet

Sign in with project-regular, enter into one project (e.g. demo-namespace), then select **Workload → DaemonSets**.

![Create a DaemonSet](https://pek3b.qingstor.com/kubesphere-docs/png/20190312152538.png)

### Step 1: Fill in the Basic Information

1.1. Click **Create DaemonSet** button, then fill in the basic information in the pop-up window. There are two ways to create a DaemonSet, i.e. **fill in the creation table** and **edit mode**. The following mainly introduces each step within creation table. If you prefer edit mode, you can click on the **edit mode** button, it supports the yaml and json formats. Edit mode makes it easy for users who are used to command operations.

![Edit Mode](https://pek3b.qingstor.com/kubesphere-docs/png/20190312152620.png)

1.2. On the basic information page, enter the name of the DaemonSet, you can also fill in the description as required.

- Name: A concise and clear name for this DaemonSet, which is convenient for users to browse and search.
- Alias: Helps you better distinguish resources and supports Chinese.
- Description: A brief introduction to DaemonSet.

Click **Next** when you're done.  

![Fill in the Basic Information](https://pek3b.qingstor.com/kubesphere-docs/png/20190312155602.png)

### Step 2: Pod Template

2.1. On the Pod Template page, click on the **Add Container** button, 

![Pod Template](https://pek3b.qingstor.com/kubesphere-docs/png/20190312160140.png)

2.2. Then enter the name of the container and the corresponding image name. The imgae name generally needs to specify with tag, such as `node-exporter:v0.15.2`, the default image is pulling from Docker Hub.

In order to realize the effective scheduling and allocation of resources in the cluster and improve resources utilization, the platform uses requests and limits to allocate resources. Request is usually the minimum resource requirement used by the container, and limit is usually the maximum value of the resource. Setting it to 0 means that there is no restriction on the resources used. Request can ensure that the pod has enough resources to run, and limit is to prevent a Pod from using resources unrestricted，causing other Pods to crash.

**Table 1: CPU Quota Description**

|Parameter|Description|
|---|---|
|**Requests**|A request is the amount of that CPU resources that the system will guarantee for the container, and Kubernetes will use this value to decide on which node to place the pod.  |
|**Limits**|A limit is the maximum amount of CPU resources that Kubernetes will allow the container to use.  |

**Table 2: Memory Quota Description**

|Parameter|Description|
|---|---|
|**Requests**|A request is the amount of that memory resources that the system will guarantee for the container, and Kubernetes will use this value to decide on which node to place the pod. |
|**Limits**|A limit is the maximum amount of memory resources that Kubernetes will allow the container to use. If the memory usage exceeds this limit, the container may be killed. |

![Pod Template](https://pek3b.qingstor.com/kubesphere-docs/png/20190312160210.png)

2.3. If the user has further requirements, click on **Advanced Options**.

- **Health Check**: Kubernetes defines two types of health check probes for monitoring at the business level. 
   - Liveness Probe: Restarts the application when it detects that the container instance is unhealthy.
   - Readiness Probe: To know when a Container is ready to start accepting traffic. A Pod is considered ready when all of its Containers are ready. 
- **Command**: In some cases, you need your command to run in a shell, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/inject-data-application/define-command-Argument-container/#run-a-command-in-a-shell).
- **Arguments**: You can defined the arguments directly by providing strings, see [Kubernetes documentation](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/).
- **Ports**: This is the container port that needs to be exposed. The port protocol can be TCP and UDP.
- **Environment Variables**: you can define an argument for a Pod using any of the techniques available for defining environment variables, including ConfigMaps and Secrets, which has the same effect as the "ENV" in the Dockerfile, providing great flexibility for creating workloads.
    - **Reference Configuration Center**: Supports adding Secret and ConfigMap as environment variables to save configuration data in the form of key-value pairs. See [ConfigMaps](../../configuration/configmaps) and [Secrets](../../configuration/secrets).
- **Image Pull Policy**: imagePullPolicy, the default image pull policy is **IfNotPresent**, the kubelet will no longer pull the image if the image already exists. If you need to pull the image frequently, set the pull policy to Always. If the container property imagePullPolicy is set to IfNotPresent or Never, the local image will be used first.

Click **Save** when setup is complete.

![Advanced Options](https://pek3b.qingstor.com/kubesphere-docs/png/20190312160513.png)

DaemonSet has two update strategy types:

- RollingUpdate: This is the default update strategy. With RollingUpdate update strategy, after you update a DaemonSet template, old DaemonSet pods will be killed, and new DaemonSet pods will be created automatically, in a controlled fashion.
   - MaxUnavailable: The default value is 1, it is an optional field that specifies the maximum number of Pods that can be unavailable during the update process.
   - MinReadySeconds: It is an optional field that specifies the minimum number of seconds for which a newly created Pod should be ready without any of its containers crashing, for it to be considered available. This defaults to 0 (the Pod will be considered available as soon as it is ready). To learn more about when a Pod is considered ready, see Container Probes.

- OnDelete: With OnDelete update strategy, after you update a DaemonSet template, new DaemonSet pods will only be created when you manually delete old DaemonSet pods. 

![Update Strategy](https://pek3b.qingstor.com/kubesphere-docs/png/20190312160612.png)

Click on the **Next** button when you're done.

### Step 3: Volume Settings

Deployment suppots totally 4 kind of volumes, i.e. **Persistent Storage Volume**, **Temporary Storage Volume (EmptyDir)**, **Reference Configuration Center**, **Hostpath**.

#### Persistent Volume

Persistent storage volumes can be used to save user's persist data, **Add Existing Volume** means you need to create volumes in advance, see [Create Persistent Storage Volume](../../storage/pvc). 

#### Temporary Volume (EmptyDir)

The temporary storage volume represents [emptyDir](https://kubernetes.cn/docs/concepts/storage/volumes/#emptydir), which is first created when a Pod is assigned to a Node, and exists as long as that Pod is running on that node. When a Pod is removed from a node for any reason, the data in the emptyDir is deleted forever.

#### Reference Configuration Center

It also supports for configuring the key-value pairs ​​in ConfigMap or Secret via reference configuration center.

A secret volume is used to pass sensitive information, such as passwords, to Pods. Secret volumes are backed by tmpfs (a RAM-backed filesystem) so they are never written to non-volatile storage. 

ConfigMap is used to store configuration data in the form of key-value pairs. The configMap resource provides a way to inject configuration data into Pods. The data stored in a ConfigMap object can be referenced in a volume of type configMap and then consumed by containerized applications running in a Pod.

- Set the value of the environment variable
- Set command parameters in the container
- Create a config file in the volume

> Note: You need to create a Secret or ConfigMap in the Configuration Center before you can use it, see [Create Secret](../../configuration/secrets/#Create-secret) and [Create ConfigMap](../../configuration/configmaps).

#### HostPath

A hostPath volume mounts a file or directory from the host node’s filesystem into your Pod. For example, Fluentd is used for log collection, which is used to load the host's container log directory to collect all logs of the host.

Click on the **Next** button when you're done.

![Volume Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190312170455.png)

### Step 4: Label Settings

Labels are key/value pairs that are attached to objects, such as pods. Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to users. Labels can be used to organize and to select subsets of objects, each object can have a set of key/value labels defined, such as `app: node-exporter ; tier: monitoring`.

Click on the **Next** button when you're done.

![Label Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190312170626.png)

### Step 5: Node Selector

For the pod to be eligible to run on a node, the node must have each of the indicated key-value pairs as labels (it can have additional labels as well). The user can specify the node on which the Pod is expected to run by setting one or more sets of key-value pairs or select node directly. When not specified, the Pod will likely be scheduled to any node in the cluster that meets the resource scheduling criteria.

![Node Selector](https://pek3b.qingstor.com/kubesphere-docs/png/20190312171341.png)

Click **Create** to complete the creation of the DaemonSet resource. The status display “Updating” is due to it's pulling the image. After the image pull succeeds, the status will display “Running”.