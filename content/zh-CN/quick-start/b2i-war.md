---
title: "Binary to Image"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## 什么是 Binary-to-image

**Binary-to-image (B2I)** 是 2.1.0 版本新增的功能，旨在帮助开发者和运维在项目打包成 WAR、JAR、Binary 这一类的制品后，快速将制品或二进制的 Package 打包成 Docker 镜像，并发布到 DockerHub 或 Harbor 等镜像仓库中。并且支持以创建服务的形式，一键将制品生成镜像推送到仓库，并创建其部署 (Deployment) 和服务 (Service) 最终自动发布到 Kubernetes 中。

## Binary-to-image 特性

**Binary-to-image (B2I)**能够在实际的项目**快速部署上线、微服务改造**的过程中，极大地赋能开发者和运维用户。B2I 无需编写一行 Dockerfile，**降低学习成本的同时提升发布效率，使用户能够更好地专注在业务本身。**

下图简述了 B2I 的业务实现流程，**B2I 已将以下多个步骤工具化和流程化，因此只需要在一个表单中完成。**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191023141324.png)

> - ① 在 KubeSphere 创建 B2I 类型的服务，上传制品或二进制包
> - ② B2I 将在后台创建 K8s Job、Deployment 和 Service
> - ③ 将制品自动打包成 Docker 镜像
> - ④ 推送镜像至 DockerHub 或 Harbor
> - ⑤ B2I Job 将在第二步创建的 Deloyment 中使用仓库中的镜像
> - ⑥ 自动发布至 Kubernetes
>
> 说明：在上述流程中，B2I Job 还会在后台执行状态上报的功能

接下来用两个示例介绍 B2I 的两种使用方式，本文提供了示例制品 WAR、JAR、Binary 方便实操。

> 以下提供 5 个供测试使用的制品包，您也可以提交个人打包的测试项目到 KubeSphere [社区](https://github.com/kubesphere/tutorial)。

|示例包 | 示例项目（代码仓库）|
| ---  |  ---- |
| [b2i-war-java8.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java8.war)| [Spring-MVC-Showcase](https://github.com/spring-projects/spring-mvc-showcase)|
|[b2i-war-java11.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java11.war)| [SpringMVC5](https://github.com/kubesphere/s2i-java-container/tree/master/tomcat/examples/springmvc5)
|[b2i-binary](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary)| [DevOps-go-sample](https://github.com/runzexia/devops-go-sample) |
|[b2i-jar-java11.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java11.jar) |[java-maven-example](https://github.com/kubesphere/s2i-java-container/tree/master/java/examples/maven) |
|[b2i-jar-java8.jar](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-jar-java8.jar) | [devops-java-sample](https://github.com/kubesphere/devops-java-sample) |

## 创建服务使用 B2I

第一个示例将使用创建服务的方式实现 B2I，实现上图的 6 个步骤。在 2.1.0 版本中，创建服务的方式和用户体验相较于 2.0.x 版本变得更加方便和高效。

## 前提条件

- B2I 属于 DevOps 功能组件，因此使用前需开启安装 DevOps 功能组件
- 已创建了企业空间、项目和普通用户 `project-regular` 账号 (该已账号已被邀请至示例项目)，请参考 [多租户管理快速入门](../admin-quick-start)

## 视频教程

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/KS2.1_13-Binary%20to%20Image.mp4">
</video>


### 创建密钥

由于 B2I 的自动构建流程中需要将打包的 Docker 镜像推送到镜像仓库，因此需要先创建一个镜像仓库的密钥 (Secret)，以下创建一个 DockerHub 的密钥，可参考 [创建常用的几类密钥](../../configuration/secrets#创建常用的几类密钥)。


### 创建服务


1. 在 `应用负载 → 服务` 下点击 `创建服务`。

2. 下拉至 `通过制品构建新的服务`，选择 `WAR`，此处仅以一个 [Spring-MVC-Showcase](https://github.com/spring-projects/spring-mvc-showcase) 的项目仓库作为示例，将它的 **WAR 包（b2i-war-java8）** [b2i-war-java8.war](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-war-java8.war) 上传到 KubeSphere。

3. 自定义名称，如 `b2i-war-java8`，下一步构建设置中，默认无状态服务，点击将本地的制品 `b2i-war-java8.war` 上传，构建环境选择 `tomcat85-java8-centos7:latest`。

4. 镜像名称为 `<DOCKERHUB_USERNAME>/<IMAGE NAME>`，tag 默认 latest，目标镜像仓库选择已创建的 `dockerhub-secret`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191022141427.png)


5. 下一步容器设置，镜像名称和端口名称可自定义，**容器端口** 与 **服务端口** 填写 tomcat 默认的 `8080`。

6. 由于是无状态服务，因此跳过挂载存储。

7. 在高级设置中`勾选外网访问`，并设置为 `NodePort`，点击 `创建`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191023142654.png)

**预览动图**

![](https://pek3b.qingstor.com/kubesphere-docs/png/b2i-war-java8.gif)


### 验证状态

B2I 创建完成后，在 `构建镜像` 下查看 B2I 的构建状态，包括执行记录 (动态日志)、资源状态、镜像制品、环境变量和 Events。

**查看构建镜像**

![](https://pek3b.qingstor.com/kubesphere-docs/png/b2i-war-result.gif)


**查看服务**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021180443.png)

**查看部署状态**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021180618.png)

**查看任务执行状态**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021180741.png)

若您习惯使用 kubectl 命令行，也可以通过 `工具箱 → Web Kubectl` 通过 `kubectl get all -n PRJECT_NAME` 来查看 B2I 具体创建了哪些资源。

**web kubectl 查看资源**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021200303.png)

### 访问服务

从服务的列表中，可以看到 NodePort 是 30571，因此在浏览器通过 `<$IP>:<$NodePort>/b2i-war-java8/` 访问 Spring-MVC-Showcase 服务（默认的访问路径 `<$IP>:<$NodePort>` 是 tomcat 服务）。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021181242.png)


### 查看镜像推送

登录 [DockerHub](http://www.dockerhub.com/) 账号，查看 B2I 自动推送的 Docker 镜像。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021181111.png)

## 构建镜像使用 B2I

第一个示例是以创建服务的方式完成了 B2I，最终将 Spring-MVC-Showcase 的 WAR 包打包成镜像后部署到了 Kubernetes。而以 **构建镜像** 的方式使用 B2I 更像一个基于制品自动生成镜像的 **快速工具**，最终不会自动发布至 Kubernetes。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191022182827.png)

以下将使用一个基于 **Go 语言** 的 [示例项目](https://github.com/kubesphere/devops-go-sample) 打包的 Binary 制品 - [b2i-binary（点击下载）](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary) ，演示 B2I 的第二种使用方式 - 构建镜像使用 B2I。

### 上传制品包

1、在 `构建镜像` 下点击 `创建构建镜像`，然后选择 `binary`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191022181948.png)

2、下一步，将下载的 [b2i-binary](https://github.com/kubesphere/tutorial/raw/master/tutorial%204%20-%20s2i-b2i/b2i-binary) 上传至 KubeSphere，镜像名称可自定义 `<DOCKERHUB_USERNAME>/<IMAGE NAME>`，目标镜像仓库选择已创建的 `dockerhub-secret`，点击 `创建`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/b2i-binary-only.gif)

**验证 B2I 状态**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021193015.png)

**查看任务**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021193142.png)

### 验证镜像推送

登录 [DockerHub](http://www.dockerhub.com/) 账号，查看 B2I 自动推送的 Docker 镜像。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191021194646.png)

## 总结

您可以根据需求使用上述两种不同的方式来完成 B2I 的自动镜像构建。一般来说，像 Java 语言的项目，可以通过 `mvn package` 命令打成 JAR/WAR 包，而像 C、C++ 和 Go 这类不需要运行时的语言，可以使用其语言自身的 build 命令打包成 binary 格式的制品，最终就可以通过 KubeSphere B2I 来快速将制品打包成 Docker 镜像，并发布到镜像仓库和 Kubernetes 中。而像 Python、Nodejs 和 PHP 这类脚本式语言的项目，可以通过 KubeSphere [Source-to-Image (S2I)](../zh-CN/quick-start/source-to-image/) 完成类似 B2I 的自动构建与发布。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191023135504.png)
