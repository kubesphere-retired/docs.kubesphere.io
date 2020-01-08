---
title: "Binary to Image - Publish Artifact to Kubernete"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## What is Binary to Image

As similar as Source to Image (S2i), Binary to Image (B2i) is a toolkit and workflow for building reproducible container images from binary (e.g. Jar, War, Binary package). You just need to upload your artifact or binary package, and specify the image repository (e.g. DockerHub or Harbor) which you want to push. Then all configurations are stored as different resources in Kubernetes, images will be pushed to target repository and your project will be automaticly published to Kubernetes as well.

## How B2i improves CD efficiency

Binary-to-image (B2I) can greatly empower developers and maintenaner in continuous delivery and pulish, microservice transformation and migration.  With B2i tool, you don't need to write Dockerfile, which reduces learning costs and improves publishing efficiency, enabling developers to better focus on the business itself.

The following figure outlines the business implementation process of B2I. B2I has instrumented and streamlined the following steps, so it only needs to be completed with several clicks in KubeSphere UI.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108144952.png)

> - ① Create B2i in KubeSphere UI, upload artifact or binary package.
> - ② B2i will create K8s Job、Deployment and Service based on the uploaded binary
> - ③ Automatically package artifacts into Docker images
> - ④ Push image to DockerHub or Harbor
> - ⑤ B2I Job will pull the image from registry for Deloyment created in the second step
> - ⑥ Automatically publish to Kubernetes
>
> Note: In the above process, the B2I Job also performs reporting status in the background.

In this document, we'll walk you through how to use B2I in KubeSphere using 2 sample tutorials.

> Note: For quick testing, we provide 5 artifact packages that you can download from following table.

|Artifact Package (Click to download) | GitHub Repository|
| ---  |  ---- |
| [b2i-war-java8.war (Click here to download it)](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java8.war)| [Spring-MVC-Showcase](https://github.com/spring-projects/spring-mvc-showcase)|
|[b2i-war-java11.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java11.war)| [SpringMVC5](https://github.com/kubesphere/s2i-java-container/tree/master/tomcat/examples/springmvc5)
|[b2i-binary](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary)| [DevOps-go-sample](https://github.com/runzexia/devops-go-sample) |
|[b2i-jar-java11.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java11.jar) |[java-maven-example](https://github.com/kubesphere/s2i-java-container/tree/master/java/examples/maven) |
|[b2i-jar-java8.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java8.jar) | [devops-java-sample](https://github.com/kubesphere/devops-java-sample) |

## Prerequisites

- You have installed [KubeSphere DevOps System](../../installation/install-devops).
- You have created a workspace, a project and a `project-regular` account, see [Get Started with Multi-tenant Management](../admin-quick-start).

## Using B2I by Creating Service

In the first tutorial, we will demonstrate how to use B2I by creating service in KubeSphere, to automatically complete 6 steps in above workflow graph.

### Create a Secret

We need to create a Secret since B2I Job will push the image to DockerHub.

1. Sign in with `project-regular` account, enter into a sample project, then choose **Configuration Center → Secrets**, click **Create** to create a new Secret.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108164932.png)

2. Enter your account information refor to following sample, click `Create` when you've completed.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108165555.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108170256.png)

### Create a Service

1. Select **Application Workloads** → **Service**, then create a new service through the artifact.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108170544.png)

2. Scroll down to `Build a new service through the artifact`, then choose `WAR`, we will use a [Spring-MVC-Showcase](https://github.com/spring-projects/spring-mvc-showcase) project as the sample, upload its WAR artifact ([b2i-war-java8](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java11.war)) to KubeSphere.

3. Enter service name, e.g. **b2i-war-java8**, click **Next**.

4. In this step, refer to following


- Upload `b2i-war-java8.war` to KubeSphere.
- Build Environment: Choose `tomcat85-java8-centos7:latest` as the build environment.
- Image: Enter `<DOCKERHUB_USERNAME>/<IMAGE NAME>` or `<HARBOR-PROJECT_NAME>/<IMAGE NAME>` as image name
- Tag: It can be customized, e.g. `latest`
- Target image repository: Select `dockerhub-secret` that we created in previous step.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108175747.png)


5. Click **Next**, image name and

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108175907.png)

6. Skip Mount Volumes

7. Check `Internet Access` and choose **NodePort**, then click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108180015.png)

### Verify B2I Build Status

1. Choose **Image Builder** and click into `b2i-war-java8-xxx` to inspect B2I building status.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108181100.png)

2. Verify the status, you can expand the Job record to inspect the dynamic logs. Normally, it will execute successfully in 2~4 minutes.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108181133.png)

### Verify the resources created by B2I

**Service**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108182649.png)

**Deployment**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108182707.png)

**Job**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108183640.png)

If you would like to use kubectl, it allows you to inspect in web kubectl from Toolbox, it requires cluster admin account to execute.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108184829.png)

### Access the Service

Click into service `b2i-war-java8`, we can easily get the NodePort and Endpoints. Thereby we can access the `Spring-MVC-Showcase` service via Endpoints within cluster, or browse the web service externally using `http://{$Node IP}:{$NodePort}/{$Binary-Package-Name}/`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108185210.png)

For example, enter `http://139.198.111.111:30182/b2i-war-java8/` to access `Spring-MVC-Showcase`, make sure the traffic can pass through the NodePort.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108190256.png)

### Verify Image in DockerHub

Sign in DockerHub with your account, we can find that the image was successfully pushed to DockerHub with tag `latest`.

 ![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108191311.png)
