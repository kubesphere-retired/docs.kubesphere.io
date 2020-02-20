---
title: "Binary to Image - Publish Artifact to Kubernete"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## What is Binary to Image

As similar as Source to Image (S2I), Binary to Image (B2I) is a toolkit and workflow for building reproducible container images from binary (e.g. Jar, War, Binary package). You just need to upload your artifact or binary package, and specify the image repository (e.g. DockerHub or Harbor) which you want to push. Then all configurations are stored as different resources in Kubernetes, images will be pushed to target repository and your application will be automatically published to Kubernetes as well.

## How B2I improves CD efficiency

Binary-to-image (B2I) can greatly empower developers and maintainer in continuous delivery and publish, microservice transformation and migration.  With B2I tool, you don't need to write Dockerfile, which reduces learning costs and improves publishing efficiency, enabling developers to better focus on the business itself.

The following figure outlines the business implementation process of B2I. B2I has instrumented and streamlined the following steps, so it only needs to be completed with several clicks in KubeSphere UI.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108144952.png)

> - ① Create B2I in KubeSphere UI, upload artifact or binary package.
> - ② B2I will create K8s Job、Deployment and Service based on the uploaded binary
> - ③ Automatically package artifacts into Docker images
> - ④ Push image to DockerHub or Harbor
> - ⑤ B2I Job will pull the image from registry for Deployment created in the second step
> - ⑥ Automatically publish to Kubernetes
>
> Note: In the above process, the B2I Job also performs reporting status in the backend.

In this document, we'll walk you through how to use B2I in KubeSphere using two sample tutorials.

> Note: For quick testing, we provide five artifact packages that you can download from the sites in the following tables.

|Artifact Package (Click to download) | GitHub Repository|
| ---  |  ---- |
| [b2i-war-java8.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java8.war)| [Spring-MVC-Showcase](https://github.com/spring-projects/spring-mvc-showcase)|
|[b2i-war-java11.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java11.war)| [SpringMVC5](https://github.com/kubesphere/s2i-java-container/tree/master/tomcat/examples/springmvc5)
|[b2i-binary](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary)| [DevOps-go-sample](https://github.com/runzexia/devops-go-sample) |
|[b2i-jar-java11.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java11.jar) |[java-maven-example](https://github.com/kubesphere/s2i-java-container/tree/master/java/examples/maven) |
|[b2i-jar-java8.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java8.jar) | [devops-java-sample](https://github.com/kubesphere/devops-java-sample) |

## Prerequisites

- You have installed [KubeSphere DevOps System](../../installation/install-devops).
- You have created a workspace, a project and a `project-regular` account, see [Get Started with Multi-tenant Management](../admin-quick-start).

## Using B2I by Creating Service

In this tutorial, we will demonstrate how to use B2I by creating service in KubeSphere, and how to automatically complete six steps described in the workflow graph above.

### Create a Secret

We need to create a Secret since B2I Job will push the image to DockerHub.

1. Sign in with `project-regular` account, enter the sample project you created, then choose **Configuration Center → Secrets**, click **Create** to create a new Secret.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108164932.png)

2. Enter your account information refer to the following sample, click `Create` when you've completed.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108165555.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108170256.png)

### Create a Service

1. Select **Application Workloads** → **Service**, then create a new service through the artifact.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108170544.png)

2. Scroll down to `Build a new service through the artifact`, then choose `war`. We will use the [Spring-MVC-Showcase](https://github.com/spring-projects/spring-mvc-showcase) project as a sample. Upload its WAR artifact ([b2i-war-java8](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java8.war)) to KubeSphere.

3. Enter service name, e.g. **b2i-war-java8**, click **Next**.

4. In this step, refer to the following instructions


- Upload `b2i-war-java8.war` to KubeSphere.
- Build Environment: Choose `tomcat85-java8-centos7:latest` as the build environment.
- Image: Enter `<DOCKERHUB_USERNAME>/<IMAGE NAME>` or `<HARBOR-PROJECT_NAME>/<IMAGE NAME>` as image name
- Tag: the image tag you may specify, e.g. `latest`
- Target image repository: Select `dockerhub-secret` that we created in previous step.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108175747.png)


5. Click **Next** to the Container Settings step and configure the basic info as the figure shown below

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108175907.png)

6. Skip Mount Volumes

7. Check `Internet Access` and choose **NodePort**, then click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108180015.png)

### Verify B2I Build Status

1. Choose **Image Builder** and click into `b2i-war-java8-xxx` to inspect B2I building status.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108181100.png)

2. Now it is ready to verify the status. You can expand the Job record to inspect the rolling logs. Normally, it will execute successfully in 2~4 minutes.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108181133.png)

### Verify the resources created by B2I

**Service**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108182649.png)

**Deployment**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108182707.png)

**Job**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108183640.png)

If you would like to use kubectl, it allows you to inspect those resources in web kubectl from Toolbox. Note it requires cluster admin account to run the commands.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108184829.png)

### Access the Service

Click into service `b2i-war-java8`, we can easily get the NodePort and Endpoints. Thereby we can access the `Spring-MVC-Showcase` service via Endpoints within cluster, or browse the web service externally using `http://{$Node IP}:{$NodePort}/{$Binary-Package-Name}/`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108185210.png)

For example, enter `http://139.198.111.111:30182/b2i-war-java8/` to access `Spring-MVC-Showcase`. Make sure the traffic can pass through the NodePort.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108190256.png)

### Verify Image in DockerHub

Sign in DockerHub with your account, we can find that the image was successfully pushed to DockerHub with tag `latest`.

 ![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108191311.png)
