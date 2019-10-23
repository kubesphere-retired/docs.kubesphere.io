---
title: "Source-to-image" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

Source to Image (S2I) 是一个允许程序员直接输入源代码然后打包成可运行程序到 Docker 镜像的工具，在程序员不需要了解 Dockerfile 的情况下方便构建镜像。它是通过将源代码放入一个负责编译源代码的 Builder image 中，自动将编译后的代码打包成 Docker 镜像。

## 目的

本示例通过官方给出的 Java 示例，演示如何在 KubeSphere 上使用 Source to Image 来实现构建镜像，并且实现自动推送到镜像仓库，最后部署到集群中，暴露给外网访问。其中 dependency 分支主要用于构建镜像的缓存测试。

## 前提条件

- 本示例以 GitHub 代码仓库和 DockerHub 镜像仓库为例，参考前确保已创建了 [GitHub](https://github.com/) 和 [DockerHub](http://www.dockerhub.com/) 账号；
- 已创建了企业空间、项目和普通用户 `project-regular` 账号，若还未创建请参考 [多租户管理快速入门](../admin-quick-start)；
- 使用项目管理员 `project-admin` 邀请项目普通用户 `project-regular` 加入项目并授予 `operator` 角色，参考 [多租户管理快速入门 - 邀请成员](../admin-quick-start/#邀请成员) 。
- 参考 [配置 ci 节点](../../system-settings/edit-system-settings/#如何配置-ci-节点进行构建) 为 S2I 任务选择执行构建的节点。

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

2、点击创建服务，改示例演示的例子为 Java 应用，因此在 `**通过代码构建新的服务**` 下选择 Java，并输入基本信息。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat445eb33f07878fcf2a9436678250de73.png)

- 名称：必填，给服务起一个名字，以便在使用的时候容易区分，此处使用 `s2i-test`；
- 别名：为了方便理解可自定义设置；
- 描述信息：简单描述该部署的相关信息，可自定义；

#### 第二步：构建设置

1、点击 「下一步」，进入容构建设置界面。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatb0a0109a0bfc17f36b94b0e50e1588d3.png)



3、服务类型选择 `无状态服务`，构建环境为 `java-8-centos7`，然后复制之前 Fork 后的个人示例仓库的 git 地址。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190426112246.png)

4、参考如下提示填写信息。

> 说明： KubeSphere 内置了常用的 Java、Node.js、Python 等 S2I 的模板，若需要自定义其它语言或依赖环境的 S2I 模板，请参考 [自定义 S2I 模板](../../workload/s2i-template)。

- 代码地址：粘贴上一步复制的 git 地址（目前支持 Git，支持 HTTP、HTTPS，并且可以指定代码分支以及在源代码终端的相对路径）；
- 分支：执行构建的分支，此示例默认使用 `master`，若希望测试缓存，可输入分支 `dependency`。
- 密钥：若为公共仓库则无需填写，私有仓库选择创建的 GIthub 账户密钥；
- 映像模板：选择 `kubespheredev/java-8-centos7` 作为此示例的 Builder image；
- 代码相对路径：使用默认的 `/` 即可；
- 映像名称：可根据自己情况定义，此示例使用 `<dockerhub_username>/s2i-sample`，`dockerhub_username` 为自己的账户名称，确保具有推拉权限；
- tag：镜像标签使用默认 `latest` 即可；
- 目标镜像仓库：选择之前创建的 `dockerhub-id`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat3aa969a5c0c6f5d42ecfae9fdae2e68e.png)

4、点击 「下一步」，设置容器的访问策略，**协议 **默认为 `HTTP`，**容器端口** 和 **服务端口 **设置为8080，其余默认即可。

![](https://pek3b.qingstor.com/kubesphere-docs/png/image-20191022153341058.png)

#### 第二步：挂在存储及高级设置

1、然后点击「下一步」，无需挂在存储，存储默认即可，继续下一步，设置 **外网访问 **方式为 `NodePort`，最后「创建」

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatf97e4aef415ed5bc2381cf69670fbd6d.png)

### 查看构建进度

1、在左侧的工作负载菜单下，点击 **构建镜像**，进入构建镜像管理界面。可看到镜像正在构建。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChata945e7716075b8e48af9e4fded49e701.png)

2、点击「构建的镜像」，进入查看详情，点击下拉箭头可看到构建日志。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatf3a48346a90be742b71e556a19a1784d.png)

### 验证运行结果

若通过 S2I 部署顺利，则将会在设置的 Dockerhub 中查看到设置的镜像，名称和标签为 **构建设置** 中设置的值。若想在浏览器中查看到部署结果，可进行如下配置。

#### 第七步：验证访问

若在内网环境访问部署的  示例服务，可通过 SSH 登陆集群节点，或使用集群管理员登陆 KubeSphere 在 web kubectl 中输入以下命令验证访问：

```shell
# curl {$Virtual IP}:{$Port} 或者 curl {$内网 IP}:{$NodePort}
curl 10.233.40.25:8080
Really appreaciate your star, that's the power of our life.
```

> 提示：若需要在外网访问该服务，可能需要绑定公网 EIP 并配置端口转发和防火墙规则。在端口转发规则中将**内网端口**  转发到**源端口** ，然后在防火墙开放这个**源端口**，保证外网流量可以通过该端口，外部才能够访问。例如在 QingCloud 云平台进行上述操作，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。

### 查看推送的镜像

由于我们在容器组模板设置中设置的目标镜像仓库为 DockerHub，此时可以登录您个人的 DockerHub 查看 Source to Image 示例推送的镜像，以下验证发现 `s2i-sample:latest` 镜像已成功推送至 DockerHub。

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat6d72050f14c2591aa99b0e60c5c13041.png)

