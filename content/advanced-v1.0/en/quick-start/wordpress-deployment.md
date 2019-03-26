---
title: "Deploy a WordPress Web Application" 
---

## Objective 

In this tutorial we will create a Deployment as an example, demonstrating how to deploy [Wordpress](https://wordpress.org/) web application to KubeSphere, which is based on the last guide [Deploy a MySQL Application](../mysql-deployment). The connection password between WordPress and MySQL will be created and saved as a [ConfigMap](../../configuration/configmaps).

## Prerequisites

- You need to create a MySQL StatefulSet, see the [Deploy a MySQL Application](../mysql-deployment) if not yet.
- You need to sign in with `project-regular` and enter into the corresponding project.

## Estimated Time

About 15 minutes.

## Example

### Create a WordPress Deployment

#### Step 1: Create a ConfigMap

1.1. Enter the project, navigate to **Configuration Center → ConfigMaps**, then choose **Create ConfigMap**.

![Create a ConfigMap](https://pek3b.qingstor.com/kubesphere-docs/png/20190326092909.png)

1.2. Fill in the basic information, e.g. `Name : wordpress-configmap`. Then choose **Next** when you're done. 

![basic information](/demo2-configmap-basic-en.png)

1.3. ConfigMap parameter is composed of a set of key-value pairs, fill in the blanks with the following values and select **Create**.

- key: WORDPRESS\_DB\_PASSWORD
- value: 123456

#### Step 2: Create a Volume

2.1. Navigate to **Volumes**, and click **Create**. Then fill in the basic information, e.g. `Name : wordpress-pvc`, choose **Next** when you're done.

![Create a Volume](/demo2-wordpress-pvc-basic-en.png)

2.2. Volume settings depends on your storage class configuration, local volume is set to the default storage class if used all-in-one installation, its volume settings as below screenshot:

![Volume settings](/demo2-pvc-setting-en.png)

2.3. We simply keep the default label settings as `app: wordpress-pvc`, then choose **Create**.

2.4. when you redirect to the Volumes list, you will be able to see the volume `wordpress-pvc` has been created successfully.

![创建存储卷](/wordpress-pvc-list-en.png)

> Reminder: The volume will display `Pending` if it is not yet mounted, actually it is normal since local doesn't suppor [Dynamic Volume Provisioning](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/). This volume will change to `Bound` when it is mounted to the workload.


#### Step 3: Create a Deployment

Navigate to **Workloads → Deployments**, then click **Create**.

![Create a Deployment](https://pek3b.qingstor.com/kubesphere-docs/png/20190326100738.png)

#### Step 4: Basic Information

Fill in the basic information, e.g. `Name : wordpress`. Then choose **Next** when you're done. 

![填写基本信息](/wordpress-basic-en.png)


#### Step 5: Pod Template

5.1. Click **Add Container**, Container Name can be customized by the user, fill in the image with `wordpress:4.8-apache`, leave the CPU and Memory at their default values. Click **Advanced Options**.

![Add Container](/demo2-container-setting-en.png)

5.2. We'll simply set the **Ports** and **Environmental Variables** according to the following hints. 

![Ports](https://pek3b.qingstor.com/kubesphere-docs/png/20190326101543.png)

- Ports:
   - Name: Port
   - Protocol: TCP
   - Port: 80
- Environmental Variables (It requires to create 2 environmental variables in this section)
   - Choose **Reference Config Center**
   - Fill in the name with `WORDPRESS_DB_PASSWORD` 
   - Select resource: select `wordpress-configmap` 
   - Select Key: `WORDPRESS_DB_PASSWORD`
   
Then select **Add Environmental Variable**, and fill in the name/value:

- Name: WORDPRESS_DB_HOST
- Value: mysql-service

Choose **Save** when you're done.

![Add Environmental Variable](https://pek3b.qingstor.com/kubesphere-docs/png/20190326101810.png)

5.3. No need to modify the Replicas and Horizontal Pod Autoscaling, For **Update Strategy** you can keep `RollingUpdate` which is a recommended strategy. Then click **Next**.

#### Step 6: Volume Settings

6.1. Choose **Add Existing Volume**, select the `wordpress-pvc` which was created in Step 2.

6.2. Set the Mount Path to `/var/www/html` and select `ReadAndWrite`. Then click **Save** and select **Next** when you're done.

![Volume Settings](/wordpress-pvc-path-en.png)

#### Step 7: View the Deployment

7.1. We simply keep the default label settings as `app: wordpress`. There is no need to set Node Selector in this demo, you can choose **Create** directly.

7.2. You will be able to see the WordPress Deployment displays "updating" since this process requires a series of operations such as pulling a Docker image of the specified tag, creating a container, and connecting the MySQL database. Normally, it will change to "running" at around 1 min.

![create-successfully](/demo-wordpress-create-successfully-en.png)


#### Step 8: Create a Service

8.1. Navigate to **Network & Service** → **Service**, choose **Create**.

![Create a Service](/demo2-create-svc-en.png)

8.2. Fill in the basic information, e.g. `Name : wordpress-service`. Then choose **Next** when you're done.

![Fill in the basic information](https://pek3b.qingstor.com/kubesphere-docs/png/20190326102221.png)

8.3. Reference the following information to complete the Service Settings:

- Service Type: choose the first item (**Virtual IP: Access the service through the internal IP of the cluster**)
- Selector: Click **Specify Workload**, then select `wordpress` and click **Save**.
- Ports:
   - Name: nodeport
   - Protocol: TCP
   - Port: 80  
   - Target port: 80
- Session Affinity: None.

![service-setting](/service-setting-en.png)

8.4. We simply keep the default label settings as `app: wordpress-service`, then choose **Next**.

8.5. We are going to expose this service via Route (Ingress), so leave the Access Method at `None`. Then click **Create**, the `wordpress-service` has been created successfully.

![created successfully](/demo2-wordpress-service-list-en.png)


#### Step 9: Create a Route

9.1. Navigate to **Network & Service** → **Routes** and choose **Create Route**.

![Create a Route](/demo2-create-ingress-en.png)

9.2. Fill in the basic information, e.g. `Name: wordpress-ingress`, click **Next** when you're done.

![Basic information](https://pek3b.qingstor.com/kubesphere-docs/png/20190326112814.png)

9.3. Choose **Add Route Rule**, set the Route Rule according to the following hints:

- Hostname：it can be customized by user, e.g. `wordpress.demo.io`, wordpress service will be accessed via this hostname.
- Protocol：select `http` (if select https please create the related certificates in secrets)
- Paths：
   - Path: enter `/`
   - Service: choose `wordpress-service`
   - Port: enter `80`

![Add Route Rule](/wordpress-ingress-setting-en.png)

9.4. Add a line of record (**{$EIP} {$hostname}**) to the your local `hosts` file. For example, if the EIP of your KubeSphere is `139.198.16.160` and the hostname has been set to `wordpress.demo.io`, then we need to add a line of record to `/etc/hosts` as following:

```bash
139.198.16.160 wordpress.demo.io
```

9.5. Skip the [Annotation](https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/), then keep the default label settings as `app: wordpress-ingress`. 

9.6. Click **Create**, the `wordpress-ingress` will be created successfully.

![Created successfully](/ingress-create-result-en.png)


#### Step 10: Configure the Gateway

10.1. Navigate to **Project-Settings → Internet Access**, then click **Set Gateway**.

![Configure the Gateway](/demo2-gateway-en.png)

10.2. Make sure the Access Method is set to `NodePort`, then choose **Save**.

> Reminder: LoadBalancer is required Cloud provider's LB plugin integration and support, [QingCloud LoadBalancer plugin](https://github.com/yunify/qingcloud-cloud-controller-manager) is in development and will coming soon.

10.3. It will generate 2 node ports, represent http and https respectively, e.g. 31499 and 32646.

![Node ports](/gateway-nodeport-list-en.png)

> Note: If you want to expose the service externally, you might need to bind the EIP and configure port forwarding. Then add the corresponding port (e.g. 31499) to the firewall rules to ensure that the external network traffic can pass through the port. In that case, external access will be available.

### Access the WordPress service

At this point, WordPress is exposed to the outside by the Ingress, thus we can access it in your browser via `{$hostname}:{$NodePort}` i.e. `http://wordpress.demo.io:30517` since we selected http protocol previously.

![Access the WordPress service](https://pek3b.qingstor.com/kubesphere-docs/png/20190326131935.png)

Hope you could be familiar with the basic features of Deployments and StatefulSets right now, see the [Deployments](../../workload/deployments) and [StatefulSets](../../workload/statefulsets) for the details.

