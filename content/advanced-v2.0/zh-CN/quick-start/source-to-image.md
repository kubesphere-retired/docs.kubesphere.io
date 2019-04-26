---
title: "Source-to-image" 
---

Source to Image (S2I) 是一个允许程序员直接输入源代码然后打包成可运行程序到 Docker 镜像的工具，在程序员不需要了解 Dockerfile 的情况下方便构建镜像。它是通过将源代码放入一个负责编译源代码的 Builder image 中，自动将编译后的代码打包成 Docker 镜像。

## 目的

本示例通过官方给出的 Hello World 的 Java 示例，演示如何在 KubeSphere 上使用 Source to Image 来实现构建镜像，并且实现自动推送到镜像仓库，最后部署到集群中。

## 前提条件

- 本示例以 GitHub 代码仓库和 DockerHub 镜像仓库为例，参考前确保已创建了 [GitHub](https://github.com/) 和 [DockerHub](http://www.dockerhub.com/) 账号；
- 已创建了企业空间和项目管理，若还未创建请参考 [多租户管理快速入门](../../quick-start/admin-quick-start)。

## 预估时间

20-30 分钟（时间由于网速等因素而有所不同）。

## 操作示例

### 创建密钥

需要预先创建 DockerHub 镜像仓库和 GitHub 代码仓库的密钥，分别为 **dockerhub-id** 和 **github-id**，参考 [创建常用的几类密钥](../../configuration/secrets/#创建常用的几类密钥)。

### Fork 项目

登录 GitHub，将本示例用到的 GitHub 仓库 [devops-java-sample](<https://github.com/kubesphere/devops-java-sample>) Fork 至您个人的 GitHub。

![fork](https://kubesphere-docs.pek3b.qingstor.com/png/fork.png)

### 创建部署

#### 第一步：填写基本信息

1、在左侧的工作负载菜单下，点击部署，进入部署管理界面。

![createdeploy](https://kubesphere-docs.pek3b.qingstor.com/png/createdeploy.png)

2、点击创建，创建一个部署。

- 名称：必填，给部署起一个名字，以便在使用的时候容易区分，此处使用 `s2i-test`；
- 别名：为了方便理解可自定义设置；
- 描述信息：简单描述该部署的相关信息，可自定义；

#### 第二步：容器组模版设置

1、点击 「下一步」，进入容器组模版设置界面，选择 「添加容器」。

![container](https://kubesphere-docs.pek3b.qingstor.com/png/container.png)

2、然后选择 `通过代码构建新的容器镜像`。

![build](https://kubesphere-docs.pek3b.qingstor.com/png/build.png)

3、[示例仓库](https://github.com/kubesphere/devops-java-sample) Fork 至您个人的 GitHub 后，复制您个人仓库的 git 地址。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190426112246.png)

4、参考如下提示填写信息。

- 代码地址：粘贴上一步复制的 git 地址（目前支持 Git，支持 HTTP、HTTPS，并且可以指定代码分支以及在源代码终端的相对路径）；
- 密钥：选择之前创建的 `github-id`；
- 映像模板：选择 `kubespheredev/java-8-centos7` 作为此示例的 Builder image；
- 代码相对路径：使用默认的 `/` 即可；
- 映像名称：可根据自己情况定义，此示例使用 `<dockerhub_username>/hello`，`dockerhub_username` 为自己的账户名称，确保具有推拉权限；
- tag：镜像标签使用默认 `latest` 即可；
- 目标镜像仓库：选择之前创建的 `dockerhub-id`。

![s2i](https://kubesphere-docs.pek3b.qingstor.com/png/s2i.png)

4、往下滑动至 `容器规格设置`，建议最大 CPU 和最大内存设置为 500m 和 1000Mi

![plan](https://kubesphere-docs.pek3b.qingstor.com/png/plan.png)

5、往下滑至 `服务设置`，配置端口为 8080，如：

![server](https://kubesphere-docs.pek3b.qingstor.com/png/server.png)

6、然后点击 「保存」

副本数量可选择为 1，然后点击 「下一步」。

![next1](https://kubesphere-docs.pek3b.qingstor.com/png/next1.png)

#### 第三步：存储卷设置

默认即可，选择 `下一步`。

#### 第四步：标签设置

默认即可，选择 `创建`。

以上部署创建完成。

### 构建完成

出现如下图所依绿勾即表示镜像通过 s2i 构建成功。

![succ](https://kubesphere-docs.pek3b.qingstor.com/png/succ.png)

查看容器组，正常运行。

![succ-pod](https://kubesphere-docs.pek3b.qingstor.com/png/succ-pod.png)

### 验证运行结果

若通过 s2i 部署顺利，则将会在设置的 Dockerhub 中查看到设置的镜像，名称和标签为 **容器组模版设置** 中设置的值。若想在浏览器中查看到部署结果，可进行如下配置。

#### 第一步：创建服务

选择左侧网络与服务下的服务，点击 「创建服务」。

![create_service](https://kubesphere-docs.pek3b.qingstor.com/png/create_service.png)

#### 第二步：基本信息填写

基本信息与创建部署类似，这里名称填写示例名称 `s2i-test-service`，其余可根据自己情况填写，点击 「下一步」，如下图。

![service_name](https://kubesphere-docs.pek3b.qingstor.com/png/service_name.png)

#### 第三步：服务设置

1、选择服务类型为 `通过集群内部IP来访问服务 Virtual IP`，如下图。

![type](https://kubesphere-docs.pek3b.qingstor.com/png/type.png)

2、然后点击 「指定工作负载」，选择刚刚创建的名称为 `s2i-test` 的部署，如下图。

![select](https://kubesphere-docs.pek3b.qingstor.com/png/select.png)

3、点击保存，参考如下提示配置端口信息。

- 端口名称：s2i-port；
- 协议默认 TCP，端口号：`30962`，目标端口为 `8080`；
- 设置完成后点击 「下一步」。

![s2i-port](https://pek3b.qingstor.com/kubesphere-docs/png/s2i-port.png)


#### 第五步：标签设置

默认即可，点击 「下一步」。

#### 第六步：外网访问

选择访问方式为 `NodePort`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190426113634.png)

至此，查看服务创建完成。

![](https://pek3b.qingstor.com/kubesphere-docs/png/s2i-nodeport.png)

可在内网通过 `http://{$nodeIP}:{$nodePort}` 进行访问。如上图所示，此示例中随机分配的 nodePort 为 30454，即可在内网通过 `http://{$nodeIP}:30454` 进行访问。

#### 第七步：配置外网访问

若需要在外网访问，可能需要进行端口转发并开放防火墙，即可访问成功部署的 `Hello World` 示例，以访问该项目管理下的服务的 `30454` 端口为例。

例如，在 QingCloud 云平台上，如果使用了 VPC 网络，则需要将 KubeSphere 集群中的任意一台主机上暴露的节点端口 (NodePort) `30454` 在 VPC 网络中添加端口转发规则，然后在防火墙放行该端口。

**添加端口转发规则**

![trans](https://kubesphere-docs.pek3b.qingstor.com/png/trans.png)

**防火墙添加下行规则**

![firewall](https://kubesphere-docs.pek3b.qingstor.com/png/firewall.png)

至此，即可访问`http://{$EIP}:30454/`，看到页面的 `Hello World!`。

### 查看推送的镜像

由于我们在容器组模板设置中设置的目标镜像仓库为 DockerHub，此时可以登录您个人的 DockerHub 查看 Source to Image 示例推送的镜像，以下验证发现 `hello:latest` 镜像已成功推送至 DockerHub。

![查看推送的镜像](https://pek3b.qingstor.com/kubesphere-docs/png/20190426114503.png)