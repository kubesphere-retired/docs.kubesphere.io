---
title: "Binary to Image"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## What is Binary-to-image

**Binary-to-image（B2I）** is the newly added function of 2.1.0 version. The aim is to help developers and operators to turn the product or binary Packages into Docker images after the projects are packaged as WAR, JAR or Binary. Then the images will be released to the image registries of DockerHub and Harbor. Besides, service creation method is supported. With one click, products' images can be pushed to image registries and its deployment and services will be released to Kubernetes automatically.  

## Binary-to-image features

In the process of **fast deployment update and microservice transformation**, **Binary-to-image（B2I）** can significantly help developer and maintain users. Without any need of Dockerfile, B2I **reduces study cost and improve the release efficiency, which enables users to focus more on the business itself.**

The diagram below briefly introduces the B2I's realization process. **B2I has simplified the following steps into instruments and processes so they can be completed in one diagram.**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191023141324.png)

> - ① Create the B2I service in KubeSphere and upload the product and binary packages.
> - ② B2I will create K8s Job, Deployment and Service in the background.
> - ③ Package the product as Docker's image automatically.
> - ④ Push the image to DockerHub or harbor.
> - ⑤ B2I Job will use images in the registry from the Deployment created in the step 2.
> - ⑥ Release it to Kubernetes automatically.
>
> Note: In the above procedures, B2I Job will keep reporting in the background.

The following 2 examples will show you 2 usage modes. This guide presents product WAR, JAR, Binary for your convenience.

> Here are 5 product packages for testing. You can upload personal packaged testing projects to KubeSphere [Community](https://github.com/kubesphere/tutorial)。

|Sample Package| Sample Projects (code repository)|
| ---  |  ---- |
| [b2i-war-java8.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java11.war)| [Spring-MVC-Showcase](https://github.com/spring-projects/spring-mvc-showcase)|
|[b2i-war-java11.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java11.war)| [SpringMVC5](https://github.com/kubesphere/s2i-java-container/tree/master/tomcat/examples/springmvc5)
|[b2i-binary](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary)| [DevOps-go-sample](https://github.com/runzexia/devops-go-sample) |
|[b2i-jar-java11.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java11.jar) |[java-maven-example](https://github.com/kubesphere/s2i-java-container/tree/master/java/examples/maven) |
|[b2i-jar-java8.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java8.jar) | [devops-java-sample](https://github.com/kubesphere/devops-java-sample) |

## Create services for B2I

The first sample will use the method of creating services to realize B2I by following the 6 steps above. In the version of 2.1.0, creating services and user experience are more convenient and more efficient compared to 2.0.x.

## Prerequisites

B2I is the DevOps' functional component. Thus, DevOps components should be installed before the usage.

### Create secretes

Since the packaged Docker images should be pushed to the image registry in the B2I's automatic building process, an image registry's Secret needs to be created. To create a DockerHub's Secret, you can refer to [Create several common secrets](../../configuration/secrets#Create several common secrets).


### Create services


1. Find `Application load → Service` and click `Create services`。

2. Scroll to `Create new services through products` and select `WAR`. There is only one project repository [Spring-MVC-Showcase](https://github.com/spring-projects/spring-mvc-showcase) as an example. Upload its **WAR pakcage（b2i-war-java8）** [b2i-war-java8.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java11.war) to KubeSphere。

3. Custom name, such as `b2i-war-java8`. In the next step of settings, choose stateless service by default and upload the local copy `b2i-war-java8.war`. Choose the setting environment as `tomcat85-java8-centos7:latest`.

4. The image's name is `<DOCKERHUB_USERNAME>/<IMAGE NAME>`. The tag is latest by default. Select the targeted image registry as the created `dockerhub-secret`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191022141427.png)


5. The nest step is to customize containers, image names and port names. Fill in **Container ports** and **service ports** as `8080` defaulted by tomcat.

6. Owing to the stateless services, skip the mount storage.

7. Select `External network access` in the advanced setting and set name it as `NodePort`. Then click `Create`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191023142654.png)

**Preview gif**

![](https://pek3b.qingstor.com/kubesphere-docs/png/b2i-war-java8.gif)


### Check the status

After creating the B2I, check B2I's building status under `Build images`, which includes the checking of executive logging (dynamic logging), resource status, image products, environment variables and Events.

**Check the created images**

![](https://pek3b.qingstor.com/kubesphere-docs/png/b2i-war-result.gif)


**Services review**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021180443.png)

**Deployment status review**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021180618.png)

**Executive status review**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021180741.png)

If you are accustomed to use kubectl commands, you can check specific created resources in B2I through `Toolkit → Web Kubectl` and `kubectl get all -n PRJECT_NAME`.

**Check resources on web kubectl **

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021200303.png)

### Access services

In the service list, you can see NodePort as 30571. Therefore, you can access to Spring-MVC-Showcase service (The defaulted access route is `<$IP>:<$NodePort>` which is tomcat service.) through `<$IP>:<$NodePort>/spring-mvc-showcase/`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021181242.png)


### Check image push

Login the account of [DockerHub](http://www.dockerhub.com/), and check Docker's image pushed by B2I automatically.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021181111.png)

## Use B2I to build images

The first sample completed B2I by creating services and finally deploy Spring-MVC-Showcase's WAR package as images to Kubernetes. Using B2I in the way of **Images building** is more like a **fast tool** based on automatic image generation and the result will not released to Kubernetes.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191022182827.png)

The following is a packaged Binary product [Sample project](https://github.com/kubesphere/devops-go-sample) based on **Go language** 的 [Sample project](https://github.com/kubesphere/devops-go-sample). It shows the second method of using B2I - using B2I to build images.

### Upload product packages

1、Click `Create images building` under `images building`. Then choose  `binary`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191022181948.png)

2、For the next step, upload the downloaded [b2i-binary](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary) to KubeSphere. The iamge's name can be customized as `<DOCKERHUB_USERNAME>/<IMAGE NAME>` and the targeted image registry is `dockerhub-secret`. Then click `Create`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/b2i-binary-only.gif)

**Verify B2I status**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021193015.png)

**Check tasks**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021193142.png)

### Review the images push

Login the account for [DockerHub](http://www.dockerhub.com/) and check Docker's images pushed by B2I automatically.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021194646.png)

## Conclusion

You can use the tow different methods above to complete B2I's automatic image building according to your requirements. Generally, Java's projects can be packaged as JAR/WAR through the command of `mvn package`. On the other hand, for languages like C, C++ and Go that do not need runtime, the build commands of those languages can be used to create binary product. Finally, KubeSphere B2I can be used to package the product as Docker's image rapidly and then release the product to image registry and Kubernetes. Scripted language projects such as Python, Nodejs and PHP can complete B2I's automatic building and releasing through KubeSphere [Source-to-Image（S2I）](https://kubesphere.io/docs/v2.0/zh-CN/quick-start/source-to-image/).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191023135504.png)
