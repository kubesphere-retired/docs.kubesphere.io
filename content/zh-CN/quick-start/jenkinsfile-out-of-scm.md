---
title: "图形化构建流水线 (Jenkinsfile out of SCM)"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '图形化构建 CI/CD 流水线'
---

在之前的示例中，我们演示了通过代码仓库中的 Jenkinsfile 构建流水线，此模式需要您对声明式的 Jenkinsfile 有一定的基础。而 Jenkinsfile out of SCM 不同于 [Jenkinsfile in SCM](../devops-online)，其代码仓库中可以没有 Jenkinsfile，您可以在控制台通过可视化的方式构建流水线或编辑 Jenkinsfile 生成流水线，操作界面更友好。

## 目的

本示例演示基于 [示例九 - Jenkinsfile in SCM](../devops-online)，通过可视化构建流水线最终将示例服务部署到 KubeSphere 集群中的开发环境且能够允许用户访问，这里所谓的开发环境在底层的 Kubernetes 里是以项目 (Namespace) 为单位进行资源隔离的。若熟悉了示例九的流程后，对于本示例的手动构建步骤就很好理解了。为方便演示，本示例仍然以 GitHub 代码仓库 [devops-java-sample](https://github.com/kubesphere/devops-java-sample) 为例。

## 前提条件

- 开启安装了 DevOps 功能组件，参考 [安装 DevOps 系统](../../installation/install-devops)；
- 已有 [DockerHub](http://www.dockerhub.com/) 的账号；
- 已创建了企业空间和 DevOps 工程并且创建了普通用户 `project-regular` 的账号，使用项目管理员 `project-admin` 邀请普通用户 `project-regular` 加入 DevOps 工程并授予 `maintainer` 角色，参考 [多租户管理快速入门 - 邀请成员](../admin-quick-start/#邀请成员)；
- 邮件通知需要单独配置 Jenkins 邮件设置，具体请参考文档 [配置 Jenkins 邮件发送](../../devops/jenkins-email)；
- 参考 [配置 ci 节点](../../system-settings/edit-system-settings/#如何配置-ci-节点进行构建) 为流水线选择执行构建的节点。

## 预估时间

约 30 分钟。

## 操作示例

### 演示视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/KS2.1_10-graphical-pipeline.mp4">
</video>

### 流水线概览

构建可视化流水线共包含以下 6 个阶段 (stage)，先通过一个流程图简单说明一下整个流水线的工作流：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190516091714.png)

> 详细说明每个阶段所执行的任务：
> - **阶段一. Checkout SCM**: 拉取 GitHub 仓库代码；
> - **阶段二. Unit test**: 单元测试，如果测试通过了才继续下面的任务；
> - **阶段三. Code Analysis**: 配置 SonarQube 进行静态代码质量检查与分析；
> - **阶段四. Build and Push**: 构建镜像，并将 tag 为 `SNAPSHOT-$BUILD_NUMBER` 推送至 DockerHub (其中 `$BUILD_NUMBER` 为 pipeline 活动列表的运行序号)；
> - **阶段五. Artifacts**: 制作制品 (jar 包) 并保存；
> - **阶段六. Deploy to DEV**: 将项目部署到 Dev 环境，此阶段需要预先审核，若部署成功后则发送邮件。

### 创建项目

CI/CD 流水线会根据文档网站的 [yaml 模板文件](https://github.com/kubesphere/devops-docs-sample/tree/master/deploy/no-branch-dev)，最终将该示例 Web 部署到开发环境 `kubesphere-sample-dev`，它对应的是 KubeSphere 中的一个项目，该项目需要预先创建，若还未创建请参考 [示例十 - 创建第一个项目](../devops-online/#创建项目) 使用 项目管理员 project-admin 账号创建 `kubesphere-sample-dev` 项目，并邀请项目普通用户 `project-regular` 进入该项目授予 `operator` 角色。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514112245.png)

### 创建凭证

本示例创建流水线时需要访问 DockerHub、Kubernetes (创建 KubeConfig 用于接入正在运行的 Kubernetes 集群) 和 SonarQube 共 3 个凭证 (Credentials)。

1、使用项目普通用户登录 KubeSphere，参考 [创建凭证](../../devops/credential/#创建凭证) 创建 DockerHub 和 Kubernetes 的凭证，凭证 ID 分别为 `dockerhub-id` 和 `demo-kubeconfig`。

2、然后参考 [访问 SonarQube](../../devops/sonarqube/) 创建 Token，创建一个 Java 的 Token 并复制。

3、最后在 KubeSphere 中进入 devops-demo 的 DevOps 工程中，与上面步骤类似，在 凭证 下点击 创建，创建一个类型为 秘密文本 的凭证，凭证 ID 命名为 `sonar-token`，密钥为上一步复制的 token 信息，完成后点击 「确定」。

至此，3 个凭证已经创建完毕，将在流水线中使用它们。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514023424.png)

### 创建流水线

参考以下步骤，创建并运行一个完整的流水线。

#### 第一步：填写基本信息

1、在 DevOps 工程中，选择左侧 **流水线**，然后点击 **创建**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514114907.png)

2、在弹出的窗口中，输入流水线的基本信息，完成后点击 **下一步**。

- 名称：为流水线起一个简洁明了的名称，便于理解和搜索，例如 graphical-pipeline
- 描述信息：简单介绍流水线的主要特性，帮助进一步了解流水线的作用
- 代码仓库：此处不选择代码仓库

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514131501.png)

#### 第二步：高级设置

1、点击 **添加参数**，如下添加 **3 个** 字符串参数，将在流水线的 docker 命令中使用该参数，完成后点击确定。

|参数类型|名称|默认值|描述信息|
|---|---|---|---|
|字符串参数 (string)|REGISTRY|仓库地址，本示例使用 docker.io |Image Registry|
|字符串参数 (string)|DOCKERHUB_NAMESPACE|填写您的 DockerHub 账号 (它也可以是账户下的 Organization 名称)|DockerHub Namespace|
|字符串参数 (string)|APP_NAME|应用名称，填写 devops-sample| Application Name |


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514115433.png)

### 可视化编辑流水线

可视化流水线共包含 6 个阶段 (stage)，以下依次说明每个阶段中分别执行了哪些步骤和任务。

#### 阶段一：拉取源代码 (Checkout SCM)

可视化编辑页面，分为结构编辑区域和内容编辑区域。通过构建流水线的每个阶段 (stage) 和步骤 (step) 即可自动生成 Jenkinsfile，用户无需学习 Jenkinsfile 的语法，非常方便。当然，平台也支持手动编辑 Jenkinsfile 的方式，流水线分为 “声明式流水线” 和 “脚本化流水线”，可视化编辑支持声明式流水线。Pipeline 语法参见 [Jenkins 官方文档](https://jenkins.io/doc/book/pipeline/syntax/)。

1、如下，此处代理的类型选择 `node`，label 填写 `maven`。

> 说明：代理 (Agent) 部分指定整个 Pipeline 或特定阶段将在 Jenkins 环境中执行的位置，具体取决于该 agent 部分的放置位置，详见 [Jenkins Agent 说明](../../devops/jenkins-agent)。

2、在图形化构建流水线的界面，点击左侧结构编辑区域的 **“+”** 号，增加一个阶段 (Stage)，点击界面中的 **添加步骤**，在右侧输入框将其命名为 **Checkout SCM**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514132128.png)

3、然后在此阶段下点击 `添加步骤`。右侧选择 `git`，此阶段通过 Git 拉取仓库的代码，弹窗中填写的信息如下：

 - Url: 填写 GitHub 示例仓库的 URL `https://github.com/kubesphere/devops-java-sample.git`
 - 凭证 ID: 无需填写 (若是私有仓库，如 Gitlab 则需预先创建并填写其凭证 ID)
 - 分支：此处无需填写分支名，不填则默认为 master 分支


 完成后点击「确定」保存，可以看到构建的流水线的第一个阶段。

 ![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514132948.png)

#### 阶段二：单元测试 (Unit Test)

1、在 `Checkout SCM` 阶段右侧点击 **“+”** 继续增加一个阶段用于在容器中执行单元测试，名称为 `Unit Test`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514133941.png)

2、点击 `添加步骤` 选择 `指定容器`，命名为 `maven`，完成后点击 `确定`；

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514134044.png)

3、在右侧 `maven` 容器中点击 `添加嵌套步骤`。然后选择 `shell`，在弹窗中输入以下命令，然后点击保存：

```shell
mvn clean -o -gs `pwd`/configuration/settings.xml test
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514134203.png)

#### 阶段三：代码质量分析 (Code Analysis)

1、同上，在 `Unit Test` 阶段右侧点击 **“+”** 继续增加一个阶段用于配置 SonarQube 在容器中执行静态代码质量分析，名称为 `Code Analysis`。

2、点击 `添加步骤` 选择 `指定容器`，命名为 `maven`，完成后点击 `确定`。

3、右侧点击 `添加嵌套步骤`，选择 `添加凭证`，在弹窗中选择之前创建的凭证 ID `sonar-token`，文本变量填写 `SONAR_TOKEN`，点击 「确定」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514140415.png)

4、在右侧的添加凭证中，点击 `添加嵌套步骤`，然后选择 `SonarQube 配置`，默认名称为 sonar，点击确定。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514140846.png)

5、在右侧的 `SonarQube 配置` 中点击 `添加嵌套步骤`，右侧选择 `Shell`，在弹窗中如下输入 SonarQube 分支和认证配置的命令，点击确定保存信息。

```shell
mvn sonar:sonar -o -gs `pwd`/configuration/settings.xml -Dsonar.branch=$BRANCH_NAME -Dsonar.login=$SONAR_TOKEN
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514141531.png)

6、右侧点击第三个 `添加嵌套步骤`，选择 `超时`，时间输入 1，单位选择 `小时`，点击「确定」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514141926.png)

7、在超时的步骤中，点击 `添加嵌套步骤`，选择 `代码质量检查 (SonarQube)`，弹窗中保留默认的 `检查通过后开始后续任务`，点击「确定」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190529232241.png)

#### 阶段四：构建并推送镜像 (Build and Push)

1、在 `Code Analysis` 阶段右侧点击 **“+”** 继续增加一个阶段用于构建并推送镜像至 DockerHub，名称为 `Build and Push`。

2、点击 `添加步骤` 选择 `指定容器`，命名为 `maven`，完成后点击 `确定`。

3、在右侧点击 `添加嵌套步骤`，右侧选择 `Shell`，在弹窗中如下输入以下命令：

```shell
mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package
```

4、右侧继续点击 `添加嵌套步骤`，选择 `Shell`，在弹窗中如下输入以下命令基于仓库中的 [Dockerfile](https://github.com/kubesphere/devops-java-sample/blob/master/Dockerfile-online) 构建 Docker 镜像，完成后点击确认保存：

```shell
docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER .
```
5、点击 `添加嵌套步骤`，右侧选择 `添加凭证`，在弹窗中填写如下信息，完成后点击「确定」保存信息：

> 说明：因为考虑到用户信息安全，账号类信息都不以明文出现在脚本中，而以变量的方式。

- 凭证 ID：选择之前创建的 DockerHub 凭证，如 `dockerhub-id`
- 密码变量：`DOCKER_PASSWORD`
- 用户名变量：`DOCKER_USERNAME`


6、在 `添加凭证` 步骤中点击 `添加嵌套步骤`，右侧选择 `Shell`，在弹窗中如下输入以下命令登录 Docker Hub：

```shell
echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
```

7、同上，继续点击 `添加嵌套步骤` 添加 `Shell` 输入一条命令推送 SNAPSHOT 镜像至 Docker Hub：

```shell
docker push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190529232407.png)

#### 阶段五：保存制品 (Artifacts)

1、在 `Build and Push` 阶段右侧点击 **“+”** 继续增加一个阶段用于保存制品，本示例用于保存项目的 jar 包，命名为 `Artifacts`。

2、点击 `添加步骤`，选择 `保存制品`，在弹窗中输入 `target/*.jar`，用于设置 .jar 文件最终的保存路径 `(target/*.jar)` 并保存到 Jenkins，点击「确定」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190529232447.png)

#### 阶段六：部署至 Dev 环境 (Deploy to DEV)

1、在 `Artifacts` 阶段右侧点击 **“+”** 增加最后一个阶段，命名为 `Deploy to DEV`，用于将容器镜像部署到开发环境即 `kubesphere-sample-dev` 项目中。

2、点击 `添加步骤`，选择 `审核`，在弹窗中输入 `@project-admin` 指定项目管理员 project-admin 用户来进行流水线审核，点击「确定」。

3、点击 `添加步骤`，选择 `KubernetesDeploy`，在弹窗中参考以下填写，完成后点击「确定」保存信息：

- Kubeconfig：选择 `demo-kubeconfig`
- 配置文件路径：输入 `deploy/no-branch-dev/**`，这里是本示例的 Kubernetes 资源部署 [yaml 文件](https://github.com/kubesphere/devops-java-sample/tree/master/deploy/no-branch-dev) 在代码仓库中的相对路径

4、同上再添加一个步骤，用于在这一步部署和流水线执行成功后给用户发送通知邮件。点击 `添加步骤`，选择 `邮件`，自定义收件人、抄送、主题和内容。

> 注意，配置邮件服务请参考 [配置 Jenkins 邮件发送](../../devops/jenkins-email)，若还未配置可跳过第 4 步 (下一版本将支持流水线共用 KubeSphere 平台统一配置的通知服务)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190529232706.png)

至此，图形化构建流水线的六个阶段都已经添加成功，点击 `确认 → 保存`，可视化构建的流水线创建完成，同时也会生成 Jenkinsfile 文件。

### 运行流水线

1、手动构建的流水线在平台中需要手动运行，点击 `运行`，输入参数弹窗中可看到之前定义的三个字符串参数，此处暂无需修改，点击 `确定`，流水线将开始运行。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514155513.png)

2、在 **活动** 列表中可以看到流水线的运行状态，点击 `活动` 可查看其运行活动的具体情况。


3、在活动列表点击运行序号 `1`，进入序号 `1` 的活动详情页查看流水线的具体运行情况。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514160039.png)

4、登出平台并切换为 `project-admin` 登录后，进入示例 DevOps 工程下的流水线 `graphical-pipeline`。然后点击 `活动` 进入序号 `1` 的活动详情页，可以看到流水线已经运行至 `deploy to dev` 阶段，点击 `继续`，流水线的活动状态转变为 **运行中**。

> 说明：若前面的步骤配置无误则几分钟后可以看到流水线已经成功运行到了最后一个阶段。由于我们在最后一个阶段添加了审核步骤，并指定了用户名为 `project-admin` 的用户。因此流水线运行至此将暂停，等待审核者 `project-admin` 登录进入该流水线运行页面来手动触发。此时审核者可以测试构建的镜像并进一步审核整个流程，若审核通过则点击 **继续**，最终将部署到开发环境中。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514160931.png)

### 查看流水线

1、几分钟后，流水线将运行成功。点击流水线中 `活动` 列表下查看当前正在运行的流水线序列号，页面展示了流水线中每一步骤的运行状态。黑色框标注了流水线的步骤名称，示例中流水线的 6 个 stage 就是以上创建的六个阶段。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514161723.png)

2、当前页面中点击右上方的 `查看日志`，查看流水线运行日志。页面展示了每一步的具体日志、运行状态及时间等信息，点击左侧某个具体的阶段可展开查看其具体的日志，若出现错误可根据日志信息来分析定位问题，日志支持下载至本地查看。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514161819.png)

### 查看代码质量

在流水线中点击 `代码质量`，查看代码质量的检测检测结果，该数据由集群内置的 SonarQube 提供，示例代码较为简单因此未显示 Bug 或代码漏洞的情况。点击右侧的 SonarQube 图标即可在浏览器访问 SonarQube，访问 SonarQube 可参考 [访问内置 SonarQube](../../installation/sonarqube-jenkins)。

> 提示：若需要在外网访问 SonarQube，可能需要绑定公网 EIP 并配置端口转发和防火墙规则。在端口转发规则中将 **内网端口** 例如 31359 转发到**源端口** 31359，然后在防火墙开放这个**源端口**，保证外网流量可以通过该端口，外部才能够访问。例如在 QingCloud 云平台进行上述操作，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514162344.png)

**在 SonarQube 查看测试质量报告**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514163017.png)

### 查看制品

点击 `活动` 然后选择 `制品`，可以查看流水线在运行过程中保存的制品 Jar 包，点击即可下载至本地。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514163948.png)

### 验证运行结果

若流水线的每一步都能执行成功，那么流水线最终 build 的 Docker 镜像也将被成功地 push 到 DockerHub 中，我们在 Jenkinsfile 中已经配置过 Docker 镜像仓库，登录 DockerHub 查看镜像的 push 结果，可以看到 tag 为 SNAPSHOT-xxx 的镜像已经被 push 到 DockerHub。在 KubeSphere 中最终以 deployment 和 service 的形式部署到了开发环境中。

1、切换为 `project-regular` 登录 KubeSphere，进入 `kubesphere-sample-dev` 项目，在左侧的菜单栏点击 **工作负载 → 部署**，可以看到 ks-sample-dev 已创建成功。

|环境|访问地址| 所在项目 (Namespace) | 部署 (Deployment) |服务 (Service)|
|---|---|---|---|---|
|Dev| `http://{$Virtual IP}:{$8080}` <br> 或者 `http://{$内网/公网 IP}:{$30861}`| kubesphere-sample-dev| ks-sample-dev|ks-sample-dev|

**查看部署**
![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514164023.png)

2、在菜单栏中选择 **网络与服务 → 服务** 也可以查看对应创建的服务，可以看到该服务对外暴露的节点端口 (NodePort) 是 `30861`。

**查看服务**
![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514165026.png)

3、查看推送到 DockerHub 的镜像，可以看到 `devops-sample` 就是 **APP_NAME** 的值，而 Tag 则是 `SNAPSHOT-$BUILD_NUMBER` 的值 (`$BUILD_NUMBER` 对应活动的运行序号)，其中 tag 为 `SNAPSHOT-1` 的镜像，正是 `ks-sample-dev` 这个部署所用到的镜像。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514164245.png)

4、由于我们在流水线最后一个阶段设置了邮件通知，因此可在邮箱中验证收到的构建通知邮件。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514200639.png)

### 访问示例服务

若在内网环境访问部署的演示示例服务，可通过 SSH 登陆集群节点，或使用集群管理员登陆 KubeSphere 在 web kubectl 中输入以下命令验证访问，其中 Virtual IP 和节点端口 (NodePort) 可通过对应项目下的服务中查看：

```shell
# curl {$Virtual IP}:{$Port} 或者 curl {$内网 IP}:{$NodePort}
curl 10.233.4.154:8080
Really appreaciate your star, that's the power of our life.
```

> 提示：若需要在外网访问该服务，可能需要绑定公网 EIP 并配置端口转发和防火墙规则。在端口转发规则中将**内网端口** 30861 转发到**源端口** 30861，然后在防火墙开放这个**源端口**，保证外网流量可以通过该端口，外部才能够访问。例如在 QingCloud 云平台进行上述操作，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。

至此，图形化构建流水线的示例已经完成了，若创建过程中遇到问题，可参考 [常见问题](../../devops/devops-faq)。
