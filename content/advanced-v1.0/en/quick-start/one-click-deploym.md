---
title: "One-click deployment of Applications"
---

## Target

This document demonstrates how to deploy an application in KubeSphere and access it through an external network by importing an application repository containing test templates, demonstrating the basic functionality of the application repository, application templates, and application lists.

## Prerequisites

- You need to create a workspace and project, see the [Admin Quick Start](../admin-quick-start) if not yet.

## Estimated Time

About 10 minutes.

## Example

### Step 1: Add a Application Repository

The back end of the application repository can be either the [QingStor Object Storage](https://www.qingcloud.com/products/qingstor/) or the [AWS Object Storage](https://aws.amazon.com/cn/what-is-cloud-object-storage/), where the contents are the configuration packages including template files of the applications. Therefore, before adding an application repository to KubeSphere, you need to create object storage and upload application configuration packages in advance, which is generally based on the Helm Chart.

This documentation prepares an application repository based on QingStor Object Storage.

1.1. Sign in with `cluster-admin` and navigate to **Platform → App Repositories**, then Click **Add App Repository**.

![添加应用仓库](/add-app-repo-en.png)

1.2. Fill in the basic information, note that there is an example repository of http protocol `http://docs-repo.gd2.qingstor.com`, you can validate if this URL is available, choose **OK** when you're done.

![应用仓库详细信息](/app-repo-basic-en.png)

1.3. Select **App Templates** on the top of this page, it will import all of the applications from the object storage. There is only Nginx App template could be deployed since it's only one package been uploaded in that object storage.

![查看应用模板](/app-template-lists-en.png)

### Step 2: Deploy Nginx App

2.1. When you have added the application repository to the platform, you can log out and sign in with `project-regular`. Then select **App Templates** on the top of this page, and enter into the Nginx app.

![inspect nginx template](/nginx-details-en.png)

Choose Setting Files to inspect the configuration files of the application package, e.g. `values.yaml`.

2.2. Click Deploy App and fill in the basic information, **Name** can be customized by yourself.

**Params Configuration** is the default value in the `values.yaml` file and support for both yaml and form edit, just leave the default values in **Params Configuration**. Then choose **Deploy** to deploy Nginx app to KubeSphere.

2.3. Navigate to **Applications**, then you can see the application `docs-demo` showing `active` from the application list. 

![查看应用](/nginx-app-demo-en.png)

### Step 3: View App Details

1. Enter into `docs-demo`, you will be able to see its service and workload in `Resource Status` page, as well as Environmental Variables and Operation Logs.

![](/nginx-details-overview-en.png)

2. Next we are going to expose this service outside of the cluster via NodePort. 

Enter into `docs-demo-nginx` service, then click **More** and choose **Edit Internet Access**.

![编辑外网访问](/nginx-service-details-en.png)

3. Select NodePort from the drop down list.

> Internet Access supports for 3 access types:
> - None: This is the default service type which is used to expose the service on a cluster-internal IP. Choosing this value makes the service only reachable from within the cluster. This is the default ServiceType.
> - NodePort: Exposes the service on each Node’s IP at a static port (the NodePort). A ClusterIP service, to which the NodePort service will route, is automatically created. You’ll be able to contact the NodePort service, from outside the cluster, by requesting <NodeIP>:<NodePort>.
> - LoadBalancer: Exposes the service externally using a cloud provider’s load balancer. (It requires to install the cloud provider LoadBalancer plugin, [qingcloud-cloud-controller-manager](https://github.com/yunify/qingcloud-cloud-controller-manager/) is in development and will provide LB service soon).

![选择访问方式](/select-nodeport-en.png)

4. Therefore it will generate a Node Port, for example, here is `30518` that we can access this service through `<$NodeIP>:<$NodePort>`.

![查看节点端口](/nodeport-details-en.png)

### Step 4: Access Nginx Service

> Note: If you want to access the service, you might need to bind the EIP and configure port forwarding. If the public network EIP has a firewall, add the corresponding port (e.g. 30518) to the firewall rules to ensure that the external network traffic can pass through the port. In that case, external access is available.

For example, our KubeSphere cluster is deployed on QingCloud platform within VPC, thus we need to add `30518` to the port forwarding rule on the VPC network and then release the port on the firewall.

**Add `30518` to the port forwarding rule**

![添加端口转发规则](/demo4-vpc-nodeport-forward-en.png)

**Release the port on the firewall**

![防火墙添加下行规则](/demo4-firewall-nodeport-en.png)

At this point, you will be able to access the Nginx service via `${EIP}:${NODEPORT}`.

![访问应用](/access-nginx-app-en.png)

