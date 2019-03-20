---
title: "Deployments"
---

A Deployment controller provides declarative updates for Pods and ReplicaSets. You describe a desired state in a Deployment object, and the Deployment controller changes the actual state to the desired state at a controlled rate. 

This document only describes the parameters or field meanings that may be used in creating a deployment, for deployment management please refer to [Workload Management](../../workload/workload-management/). At the same time, [Quick Start - Deploy a WordPress Web Application](../../quick-start/wordpress-deployment/) can also help you quickly understand Deployment.

## Create a Deployment

Sign in with project-regular, enter into one project (e.g. demo-namespace), then select **Workload → Deployments**.

![Create a Deployment](https://pek3b.qingstor.com/kubesphere-docs/png/20190312111041.png)

### Step 1: Fill in the Basic Information

1.1. Click **Create Deployment** button, then fill in the basic information in the pop-up window. There are two ways to create a deployment, i.e. **fill in the creation table** and **edit mode**. The following mainly introduces each step within creation table. If you prefer edit mode, you can click on the **edit mode**, it supports the yaml and json formats. Edit mode makes it easy for users who are used to command operations.

![command-line](https://pek3b.qingstor.com/kubesphere-docs/png/20190311153946.png)

1.2. On the basic information page, enter the name of the deployment, you can also fill in the description as required.

- Name: A concise and clear name for this deployment, which is convenient for users to browse and search.
- Alias: Helps you better distinguish resources and supports Chinese.
- Description: A brief introduction to this deployment.

Click **Next** when you're done.

![Fill in the basic information](https://pek3b.qingstor.com/kubesphere-docs/png/20190311154158.png)

### Step 2: Configure the Pod Template

2.1. On the **Pod Template** page, user can set the number of replicas and [HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough), HPA is able to automatically scale deployments and increase the overall resource utilization of the cluster. 

> Note: This guide [Setting HPA for Deploymets](../../quick-start/hpa) provides an example of HPA and demonstrates how HPA works.

![HPA Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190311154740.png)

Click **Add Container** to add a container image as needed. The image defined in the template is pulled from the DockerHub by default. Enter the name of the container and the corresponding image name. The image name generally needs to be specified with its tag, such as `wordpress:4.8-apache`.

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

![Quota](https://pek3b.qingstor.com/kubesphere-docs/png/20190312205428.png)

2.2. If the user has further requirements, click on **Advanced Options**.

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

![image template](https://pek3b.qingstor.com/kubesphere-docs/png/20190311214334.png)

**Update Strategy**

Update policies include RollingUpdate and Recreate:

- RollingUpdates: It is recommended to update the deployment using [Rolling-update](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#rolling-update). Rolling upgrade will be used gradually when the new version of the Pod replaces the old version. During rolling upgrade process, the traffic is distributed to the old and new Pods at the same time, so the service is not interrupted. You can specify following two fields to control the rolling update process.
    - The minimum available number of Pods: Optional, the number of minimum Pods available for each RollingUpdate, is recommended to be a positive integer.
    - The maximum available number of Pods: Optional, the maximum number of Pods allowed during a rolling upgrade.

- Recreate: All existing Pods will be killed before the new Pod is created, meaning that this strategy will delete the old Pod first, then create a new Pod, and the business will be interrupted during the upgrade process.

![Update Strategy](https://pek3b.qingstor.com/kubesphere-docs/png/20190311215456.png)

After completing the above configuration information, click **Next**.

### Step 3: Volume Settings

Deployment suppots totally 3 kind of volumes, i.e. **Persistent Storage Volume**, **Temporary Storage Volume (EmptyDir)** and **Reference Configuration Center**.

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

Click on the **Next** button when you're done.

![Reference Configuration Center](https://pek3b.qingstor.com/kubesphere-docs/png/20190312101454.png)

### Step 4: Label Settings

Labels are key/value pairs that are attached to objects, such as pods. Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to users. Labels can be used to organize and to select subsets of objects, each object can have a set of key/value labels defined, such as `relase: stable ; tier: frontend`.

![Label Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190312102359.png)

Click on the **Next** button when you're done.

### Step 5: Node Selector

For the pod to be eligible to run on a node, the node must have each of the indicated key-value pairs as labels (it can have additional labels as well). The user can specify the node on which the Pod is expected to run by setting one or more sets of key-value pairs or select node directly. When not specified, the Pod will likely be scheduled to any node in the cluster that meets the resource scheduling criteria.

![Node Selector](https://pek3b.qingstor.com/kubesphere-docs/png/20190312102641.png)

Click **Create** to complete the creation of the Deployment resource. The status display “Updating” is due to it's pulling the image. After the image pull succeeds, the status will display “Running”.