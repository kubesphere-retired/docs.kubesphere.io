---
title: "Source to Image: Publish your app without Dockerfile"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

Source to Image (S2I) is a tool that allows a programmer to input source code and transfer the code into runnable program to Docker image. This tool enables programmers to build images even when they don't know about Dockerfile. By inputing source code into the source code compiler and builder image, Source to Image can transfer the code into Docker images.

## Objective

The example below is an official Java demonstration for Hello World. It will show you how to use Source to Image on KubeSphere to build image, push the image to docker repository and finally deploy it to a Kubernetes cluster.

## Prerequisites

- The example below takes the GitHub code repository and DockerHub repository for example. Make sure you have created [GitHub](https://github.com/) and [DockerHub](http://www.dockerhub.com/) accounts.
- Build workspace, projects and `project-regular` accounts for common users at first. If not, please refer to [Quick Start Guide of Multi-tenant Management](/docs/advanced-v2.0/zh-CN/quick-start/admin-quick-start/).
- Use `project-admin` to invite `project-regular`, a regular user, to join in the project. Refer to [Quick Start Guide of Multi-tenant Management-inviting members](/docs/advanced-v2.0/zh-CN/quick-start/admin-quick-start/) and grant the regular user the `operator`role.

## Estimated Time

20-30 minutes (The time varies according to the Internet speed and other factors.)

## Hands-on Lab

### Create Secrets

Create the secrets for DockerHub repository and GitHub code repository, and naming them dockerhub-id and github-id respectively. Please refer to [Creating Common Secrets](/docs/advanced-v2.0/zh-CN/configuration/secrets/#%E5%88%9B%E5%BB%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E5%87%A0%E7%B1%BB%E5%AF%86%E9%92%A5)

#### Fork Project

Log in GitHub, and fork the GitHub repository [devops-java-sample](https://github.com/kubesphere/devops-java-sample) to your personal GitHub.

##Create a Deployment

###Step 1: Fill in basic information

1.1 Choose Deployment.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190717180338.png#alt=)

1.2 Click Create and input the following info.

- Name: (required) Name the deployment `S2I-test`;
- Nickname: It can be customized.
- Description: Simply describe the deployment information.

###Step 2: Container Group Template Settings

2.1. Click **Next** and then click **Add Container**.

2.2. Choose `Build a new container image from code`.

2.3. Fork the [Repository Sample](https://github.com/kubesphere/devops-java-sample) to your personal GItHub. Then copy your personal repository's Git address.

2.4. Refer to the following information and fill in.

> Note: KubeSphere has built in common S2I templates for Java, Node.js and Python. If you need to customize other languages or use the S2I template, please refer to [Customized S2I template](/docs/advanced-v2.0/zh-CN/workload/S2I-template/).


- Code URL: Copy the Git address from the last step (Git, HTTP and HTTPS are valid too. You can also specify code branch and the related route in the source code terminal);
- Secret: Inject the secret `github-id`into the S2I Pod;
- Mirroring Template: Choose `kubespheredev/java-8-centos7` as the Builder image.
- Code relative path: Use `/` by default.
- Image Name: It can be customized. The user names here are `dockerhub_username>/hello` and `dockerhub_username`.
- Tag: Keep the image default tag `latest`.
- Target image repository: Choose `dockerhub-id` created in the previous step.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718095825.png#alt=)

2.4. Scroll down to `Container Specification`. It is suggested to set CPU and RAM's maximum storages to 500M and 1000Mi respectively.

2.5. Scroll down to `Service Settings`. Set the port number to **8080**:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718112803.png#alt=)

2.6. Then click **Save**.


###Step 3: Create S2I Deployment

No need to set storage volume. Click **Next**. Save the tag by default. Then choose **Create**. Complete the S2I deployment.

####Complete the creation

The green check below indicates that the image had been created by S2I.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718115255.png#alt=)

Check the container group to check the status.

## Verify The Operation Results

If the deployment was successful created through S2I, you will see the set image in Dockerhub. The name and tag have been set in the **Container Group Template Setting**. If you want to check the deployment results, you can configure as follows.

### Step 1: Create a Service

Choose **Network & Services → Services** on the left menu, then click on the **Create** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718102443.png#alt=)

### Step 2: Fill in the basic information

This step is similar to deployment creation, e.g. `Name : S2I-test-service`. The rest are customized as below.

### Step 3: Service Settings

3.1. Choose the first item `Virtual IP: Access the service through the internal IP of the cluster`.

3.2. Then click on the `Specify Workload` and choose `springboot-S2I` deployment as below.

3.3. Click save. Refer to the port information as follows.

- Port name: S2I-port
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

If you visit the HelloWorld service from the internal network, you can login cluster nodes through SSH or use Cluster admin to login KubeSphere. Then put the following command in web kubectl:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718113343.png#alt=)

```bash
# curl {$Virtual IP}:{$Port} or curl {$Node IP}:{$NodePort}
$ curl 10.233.60.196:8080
Hello,World!
```

> Tip: If you need to access to this service from external network, you may need to bind to the public network EIP and set port forwarding and firewall rules. Forward the Internal Network Port 30454 to the source port 30454 in the forwarding rule. Then open this port in the firewall to ensure the external network traffic can pass this port. For operations on the QingCloud platform, you can refer to [Cloud Platform Setting Port Forward and Firewall](/docs/advanced-v2.0/zh-CN/appendix/qingcloud-manipulation/).


## Verify the Service and Image Push

Since we set the target image repository as DockerHub, you can login your personal DockerHub to check the image pushed by Source to Image. If you find `hello:latest`, the image has been successfully pushed to DockerHub

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718113818.png#alt=)
