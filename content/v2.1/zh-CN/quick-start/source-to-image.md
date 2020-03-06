---
title: "Source-to-image"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## 什么是Source-to-image

**Source-to-image (S2I)** 是一个允许用户直接输入源代码然后打包成可运行程序到 Docker 镜像的工具，在用户不需要了解 Dockerfile 的情况下方便构建镜像。它是通过将源代码放入一个负责编译源代码的 Builder image 中，自动将编译后的代码打包成 Docker 镜像。在 KubeSphere 中支持 S2I 构建镜像，也支持以创建服务的形式，一键将源代码生成镜像推送到仓库，并创建其部署 (Deployment) 和服务 (Service) 最终自动发布到 Kubernetes 中。

## Source-to-image 特性

**Source-to-image (S2I)**能够在实际的项目**快速部署上线、微服务改造**的过程中，极大地赋能开发者和运维用户。S2I 无需编写一行 Dockerfile，**降低学习成本的同时提升发布效率，使用户能够更好地专注在业务本身。**

下图简述了 S2I 的业务实现流程，**S2I 已将以下多个步骤工具化和流程化，因此只需要在一个表单中完成。**

![](https://pek3b.qingstor.com/kubesphere-docs/png/s2i-svg-2.png)

> - ① 在 KubeSphere 创建 S2I 类型的服务，上传项目源代码
> - ② S2I 将在后台创建 K8s Job、Deployment 和 Service
> - ③ 将源代码自动打包成 Docker 镜像
> - ④ 推送镜像至 DockerHub 或 Harbor 或其他 Registry
> - ⑤ S2I Job 将在第二步创建的 Deloyment 中使用仓库中的镜像
> - ⑥ 自动发布至 Kubernetes
>
> 说明：在上述流程中，S2I Job 还会在后台执行状态上报的功能

接下来将用一个 Java 示例来演示介绍 S2I 的使用方式。


## 演示目的

本示例通过官方给出的 Java 示例，演示如何在 KubeSphere 上使用 Source to Image 来实现构建镜像，并且实现自动推送到镜像仓库，最后部署到集群中，暴露给外网访问。其中测试示例仓库中的 dependency 分支主要用于构建镜像的缓存测试。

## 前提条件

- 开启安装了 DevOps 功能组件，参考 [安装 DevOps 系统](../../installation/install-devops)；
- 本示例以 GitHub 代码仓库和 DockerHub 镜像仓库为例，参考前确保已创建了 [GitHub](https://github.com/) 和 [DockerHub](http://www.dockerhub.com/) 账号；
- 已创建了企业空间、项目和普通用户 `project-regular` 账号，若还未创建请参考 [多租户管理快速入门](../admin-quick-start)；
- 使用项目管理员 `project-admin` 邀请项目普通用户 `project-regular` 加入项目并授予 `operator` 角色，参考 [多租户管理快速入门 - 邀请成员](../admin-quick-start/#邀请成员) 。
- 参考 [配置 ci 节点](../../system-settings/edit-system-settings/#如何配置-ci-节点进行构建) 为 S2I 任务选择执行构建的节点。

## 视频教程

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/Source-to-Image.mp4">
</video>

## 预估时间

20-30 分钟（时间由于网速等因素而有所不同）。

## 操作示例

### 创建密钥

需要预先创建 DockerHub 镜像仓库和 GitHub 代码仓库的密钥，分别为 **dockerhub-id** 和 **github-id**，参考 [创建常用的几类密钥](../../configuration/secrets/#创建常用的几类密钥)。

### Fork 项目

登录 GitHub，将本示例用到的 GitHub 仓库 [devops-java-sample](<https://github.com/kubesphere/devops-java-sample>) Fork 至您个人的 GitHub。

![fork](https://kubesphere-docs.pek3b.qingstor.com/png/fork.png)

### 创建服务

#### 第一步：填写基本信息

1、在左侧的工作负载菜单下，点击服务，进入服务管理界面。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat9cdcd15e9c7189e45685918b23a9538b.png)

2、点击创建服务，在 `通过代码构建新的服务` 下选择 `Java`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatfe3be88f9bc6875179d868bd5a0a7236.png)

3、然后输入基本信息。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat445eb33f07878fcf2a9436678250de73.png)

- 名称：必填，给服务起一个名字，以便在使用的时候容易区分，此处使用 `s2i-test`；
- 别名：为了方便理解可自定义设置；
- 描述信息：简单描述该部署的相关信息，可自定义；

#### 第二步：构建设置

1、点击 「下一步」，进入构建设置界面。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatb0a0109a0bfc17f36b94b0e50e1588d3.png)



2、服务类型选择 `无状态服务`，构建环境为 `java-8-centos7`，然后复制之前 Fork 后的个人示例仓库的 git 地址。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190426112246.png)

3、参考如下提示填写信息。

> 说明： KubeSphere 内置了常用的 Java、Node.js、Python 等 S2I 的模板，若需要自定义其它语言或依赖环境的 S2I 模板，请参考 [自定义 S2I 模板](../../workload/s2i-template)。

- 代码地址：粘贴上一步复制的 git 地址（目前支持 Git，支持 HTTP、HTTPS，并且可以指定代码分支以及在源代码终端的相对路径）；
- 分支：执行构建的分支，此示例默认使用 `master`，若希望测试缓存，可输入分支 `dependency`。
- 密钥：若为公共仓库则无需填写，私有仓库选择创建的 Github 账户密钥；
- 映像模板：选择 `kubespheredev/java-8-centos7` 作为此示例的 Builder image；
- 映像名称：可根据自己情况定义，此示例使用 DockerHub, 镜像名称为`<dockerhub_username>/s2i-sample`，`dockerhub_username` 为自己的账户名称，确保具有推拉权限；
- tag：镜像标签使用默认 `latest` 即可；
- 目标镜像仓库：选择之前创建的 `dockerhub-id`。
- **高级设置**-代码相对路径：使用默认的 `/` 即可；


> 提示：若希望将镜像推送到其他镜像仓库（如阿里云、Harbor镜像仓库等），2.1.0版本需要在映像名称中输入完整镜像名称，包括 Registry 地址，2.1.1 版本中已实现根据密钥自动加入 Registry 地址，无需手动添加。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat3aa969a5c0c6f5d42ecfae9fdae2e68e.png)

4、点击 「下一步」，设置容器的访问策略，**协议** 默认为 `HTTP`，**名称** 可以自定义，如 `http-1`，**容器端口** 和 **服务端口** 设置为8080。

![](https://pek3b.qingstor.com/kubesphere-docs/png/image-20191022153341058.png)

5、配置「健康检查器」下的「容器就绪检查」，选择 「HTTP请求检查」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatd820170af0f7ae8d5da427b84c2fa7d5.png)

- 协议：必填，该示例默认使用 `HTTP`；
- 路径：必填，该示例默认使用根路径 `/`；
- 端口：必填，修改为示例应用所暴露的端口 `8080`；
- 初始延迟(秒)：在检查其运行状况之前，容器启动后需要等待多长时间，该示例推荐延迟 `30s`；
- 超时时间(秒)：等待探针完成多长时间。如果超过时间，则认为探测失败，该示例推荐延迟 `10s`；

#### 第三步：挂载存储及高级设置

1、配置完成后保存，然后点击「下一步」，无需挂在存储，存储默认即可，继续下一步，设置 **外网访问** 方式为 `NodePort`，最后「创建」

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatf97e4aef415ed5bc2381cf69670fbd6d.png)

### 第三步：查看构建进度

1、在左侧的工作负载菜单下，点击 **构建镜像**，进入构建镜像管理界面。可看到镜像正在构建。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChata945e7716075b8e48af9e4fded49e701.png)

2、点击「构建的镜像」，进入查看详情，点击下拉箭头可看到构建日志。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatf3a48346a90be742b71e556a19a1784d.png)

### 第四步：验证运行结果

若通过 S2I 部署顺利，则将会在设置的 Dockerhub 中查看到设置的镜像，名称和标签为 **构建设置** 中设置的值。若想在浏览器中查看到部署结果，可进行如下配置。

#### 验证访问

若在内网环境访问部署的示例服务，在浏览器中访问，可通过 NodeIP + 暴露的端口访问。或者通过 SSH 登陆集群节点，或使用集群管理员登陆 KubeSphere 在 web kubectl 中输入以下命令验证访问：

```shell
# curl {$Virtual IP}:{$Port} 或者 curl {$内网 IP}:{$NodePort}
curl 10.233.40.25:8080
Really appreaciate your star, that's the power of our life.
```

> 提示：若需要在外网访问该服务，可能需要绑定公网 EIP 并配置端口转发和防火墙规则。在端口转发规则中将 **内网端口**  转发到 **源端口** ，然后在防火墙开放这个**源端口**，保证外网流量可以通过该端口，外部才能够访问。例如在 QingCloud 云平台进行上述操作，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。

#### 查看推送的镜像

由于我们在容器组模板设置中设置的目标镜像仓库为 DockerHub，此时可以登录您个人的 DockerHub 查看 Source to Image 示例推送的镜像，以下验证发现 `s2i-sample:latest` 镜像已成功推送至 DockerHub。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat6d72050f14c2591aa99b0e60c5c13041.png)
