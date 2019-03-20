---
title: "ConfigMap"
---

ConfigMaps allow you to decouple configuration artifacts from image content to keep containerized applications portable. This page demonstrates how to create ConfigMaps and configure Pods using data stored in ConfigMaps.

## Create a ConfigMap

Sign in with project-regular, enter into one project (e.g. demo-namespace), then select **Configuration Center → ConfigMaps**.

![Create a ConfigMap](https://pek3b.qingstor.com/kubesphere-docs/png/20190320093538.png)

### Step 1: Fill in the Basic Information

1.1. Click **Create ConfigMap** button, then fill in the basic information in the pop-up window. There are two ways to create a ConfigMap, i.e. **fill in the creation table** and **edit mode**. The following mainly introduces each step within creation table. If you prefer edit mode, you can click on the **edit mode** button, it supports the yaml and json formats. Edit mode makes it easy for users who are used to command operations.

![Edit Mode](https://pek3b.qingstor.com/kubesphere-docs/png/20190320093815.png)

1.2. On the basic information page, enter the name of the ConfigMap, you can also fill in the description as required.

- Name: A concise and clear name for this ConfigMap, which is convenient for users to browse and search.
- Alias: Helps you better distinguish resources and supports Chinese.
- Description: A brief introduction to ConfigMap.

Click **Next** when you're done.  

![Basic Information](https://pek3b.qingstor.com/kubesphere-docs/png/20190320093931.png)

### Step 2: ConfigMap Settings

The key-value pairs data could be stored in ConfigMaps, which is used to set as container environment variables, or add the ConfigMap data to a volume, it could be used in workloads. The data as following example:

```bash
data:
  game.properties: 158 bytes
  ui.properties: 86 bytes
```

![ConfigMap Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190320095616.png)

## Using this ConfigMap

ConfigMaps can be mounted as data volumes or be exposed as environment variables to be used by a container in a pod. 

- In Volume, click on **Reference Config Center**, then select the created ConfigMap.
- In the Environment Variables, click **Reference Config Center** then select the created key.

![Using a ConfigMap](https://pek3b.qingstor.com/kubesphere-docs/png/20190320100610.png)

![Using a ConfigMap](https://pek3b.qingstor.com/kubesphere-docs/png/20190319180017.png)

For more information on how to use the ConfigMap, see [Quick-Start - Deploy a WordPress Web Application](../../quick-start/wordpress-deployment).






