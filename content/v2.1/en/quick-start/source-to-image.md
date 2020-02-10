---
title: "Source to Image: Publish your app without Dockerfile"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## What is Source to Image

As [Features and Benefits](../../introduction/features) elaborates, Source-to-Image (S2I) is a toolkit and workflow for building reproducible container images from source code. S2I produces ready-to-run images by injecting source code into a container image and letting the container prepare that source code for execution. KubeSphere integrates S2i to enable automatically build images and publish to Kubernetes without writing Dockerfile.


## Objective

This tutorial will use S2I to import source code repository of Java sample project into KubeSphere, build a docker image and push to the target registry, finally publish to Kubernetes and expose externally.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200207162613.png)


## Prerequisites

- You have [enabled KubeSphere DevOps system](../../installation/install-devops).
- You have created [GitHub](https://github.com/) and [DockerHub](http://www.dockerhub.com/) accounts. GitLab and Harbor are also supported, but we will use GitHub and DockerHub in this tutorial.
- You have created workspace, projects and `project-regular` accounts (with role of "operator"), see [Quick Start Guide of Multi-tenant Management](/../../quick-start/admin-quick-start/).


## Estimated Time

20-30 minutes

## Hands-on Lab

### Create Secrets

Create the secrets for DockerHub repository and GitHub codes repository as dockerhub-id and github-id. Please refer to [Creating Common Secrets](/docs/advanced-v2.0/zh-CN/configuration/secrets/#%E5%88%9B%E5%BB%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E5%87%A0%E7%B1%BB%E5%AF%86%E9%92%A5)

#### Fork Project

Login GitHub. Fork the GitHub repository [devops-java-sample](https://github.com/kubesphere/devops-java-sample) to your personal GitHUb.

##Create a Deployment

###Step 1: Fill in basic information

1.1 Click Deployment and enter.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717180338.png#alt=)

1.2 Click Create.

- Name: (Necessary) Name the deployment as `s2i-test`;
- Nickname: It can be customized.
- Description: Simply decirbe the deployment information. This is customizable.

###Step 2: Container Group Template Settings

2.1. Click **Next** and then click **Add Container**.

2.2. Then choose `Build a new container image from code`.

2.3. Fork the [Repository Sample](https://github.com/kubesphere/devops-java-sample) to your personal GItHUb. Then copy your personal repository's git address.

2.4. Refer to the following information and fill in.

> Note: KubeSphere has built in common s2i templates for Java, Node.js and Python. If you need to customize other languages or use the s2i template, please refer to [Customized s2i template](/docs/advanced-v2.0/zh-CN/workload/s2i-template/).


- Code URL: Paste the git address fromt he last step (Git, HTTP and HTTPS are fine. You can also specify code branch and the related route in the source code terminal);
- Secret: Inject the secret `github-id`into the S2I Pod;
- Mirroring Template: Choose `kubespheredev/java-8-centos7` as the Builder image.
- Code relative path: Use `/` by default.
- Image Name: It can be customized. The user names here are `dockerhub_username>/hello` and `dockerhub_username`.
- Tag: The mirroring tag can be `latest` by default.
- Target image repository: Choose `dockerhub-id` created in the previous step.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718095825.png#alt=)

2.4. Scroll down to `Container Specification`. It is suggested to set CPU and RAM's biggest storages as 500M and 1000Mi.

2.5. Scroll down to `Service Settings`. The port number is **8080**:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718112803.png#alt=)

2.6. Then click **Save**.

The duplicate number is 1. The click **Next**.

###Step 3: Create s2i Deployment

No need to set storage volume. Click **Next**. Save the tag by default. Then choose **Create**. Complete the s2i deployment.

####Complete the creation

The green check below indicates that the mirroring had been created by s2i.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718115255.png#alt=)

Check the container group. Function well.

## Verify The Operation Results

If the deployment was successful through s2i, you will see the setted image in Dockerhub. The name and tage have been setted in the **Container Group Template Setting**. If you want to check the deployment results, you can configerate as follows.

### Step 1: Create a Service

Choose **Network & Services → Services** on the left menu, then click on the **Create** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718102443.png#alt=)

### Step 2: Fill in the basic information

This step is similar to deployment creation, e.g. `Name : s2i-test-service`. The rest are customized as below.

### Step 3: Service Settings

3.1. Choose the first item `Virtual IP: Access the service through the internal IP of the cluster`.

3.2. Then click on the `Specify Workload` and choose `springboot-s2i` deployment as below.

3.3. Click save. Refer to the port information as follows.

- Port name: s2i-port
- TCP defaulted, Port Number: `8080` and the target port is `8080`.
- Finish the settings then click **Next**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718112621.png#alt=)

### Step 5: Tag setting

Setting by default then click **Next**.

### Step 6: Setting External Network Access

Select the access method as `NodePort`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718105444.png#alt=)

For now, the service check has been created. As below, the Virtual IP is 10.233.40.2, the service port is 8080 and the Nodeport is 30454.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718112547.png#alt=)

### Step 7: Verify Visits

If you visit the HelloWorld service from the internal network, you can login cluster nodes through SSH or use Cluster admin to login KubeSphere. Then putin the following command in web kubectl:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718113343.png#alt=)

```bash
# curl {$Virtual IP}:{$Port} or curl {$Node IP}:{$NodePort}
$ curl 10.233.60.196:8080
Hello,World!
```

> Tip: If you need to access to this service from external network, you may need to bind to the public network EIP and set port forwarding and firewall rules. Forward the Internal Network Port 30454 to the source port 30454 in the forwarding rule. Then open this port in the firewall to ensure the external network traffic can pass this port. For operations on the QingCloud platform, you can refer to [Cloud Platform Setting Port Forward and Firewall](/docs/advanced-v2.0/zh-CN/appendix/qingcloud-manipulation/).


## Verify the Service and Image Push

Since we set the target mirroring repository as DockerHub, you can login your personal DockerHub to check the image pushed by Source to Image. If you find `hello:latest`, the image has been successfully pushed to DockerHub

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718113818.png#alt=)
