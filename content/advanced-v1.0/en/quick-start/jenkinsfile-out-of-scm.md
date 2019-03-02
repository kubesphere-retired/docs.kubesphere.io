---
title: "Create a CI/CD Pipeline In a Visual Way" 
---

<!-- 上一篇文档示例六是通过代码仓库中的 Jenkinsfile 构建流水线，需要对声明式的 Jenkinsfile 有一定的基础。而 Jenkinsfile out of SCM 不同于 [Jenkinsfile in SCM](../jenkinsfile-in-scm)，其代码仓库中可以无需 Jenkinsfile，支持用户在控制台通过可视化的方式构建流水线或编辑 Jenkinsfile 生成流水线，用户操作界面更友好。

## 目的

本示例演示基于 [示例六 - Jenkinsfile in SCM](../jenkinsfile-in-scm)，通过可视化构建流水线 (包含示例六的前六个阶段)，最终将一个文档网站部署到 KubeSphere 集群中的开发环境且能够通过公网访问，这里所谓的开发环境在底层的 Kubernetes 里是以项目 (Namespace) 为单位进行资源隔离的。若熟悉了示例六的流程后，对于示例七的手动构建步骤就很好理解了。为方便演示，本示例仍然以 GitHub 代码仓库 [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) 为例。

## 前提条件

- 已有 [DockerHub](http://www.dockerhub.com/) 的账号。
- 已创建了企业空间和 DevOps 工程，若还未创建请参考 [管理员快速入门](../../quick-start/admin-quick-start)。
- 熟悉 Dockerfile 常用命令，可参考 [Docker 官方文档](https://docs.docker.com/engine/reference/builder/#usage)。

## 预估时间

约 30 分钟。 -->

## Target

We have created a pipeline based on the Jenkinsfile in last tutorial which requires you are familiar with Jenkinsfile syntax. In this tutorial we will demonstrate how to create a pipeline in a friendly UI, and there is no need to write Jenkinsfile. 

## Prerequisites

For this tutorial you will need

- Make sure you have created [DockerHub](http://www.dockerhub.com/) account.
- Create a workspace and DevOps project, see the [Admin Quick Start](../admin-quick-start) if not yet.
- Be familiar with the basics of Dockerfile, see [Docker Documentation](https://docs.docker.com/engine/reference/builder/#usage).

## Estimated Time

About 30 minutes.

<!-- ## 操作示例

### 演示视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docsvideo.gd2.qingstor.com/demo7-jenkinsfile-out-of-scm.mp4">
</video>

### 流水线概览

构建可视化流水线共包含以下 6 个阶段 (stage)，先通过一个流程图简单说明一下整个 pipeline 的工作流：

![流程图](/cicd-pipeline-02.svg)

> 详细说明每个阶段所执行的任务：
> - **阶段一. Checkout SCM**: 拉取 GitHub 仓库代码
> - **阶段二. Get dependencies**: 通过包管理器 [yarn](https://yarnpkg.com/zh-Hans/) 安装项目的所有依赖
> - **阶段三. Unit test**: 单元测试，如果测试通过了才继续下面的任务
> - **阶段四. Build**:  执行项目中 `package.json` 的 scripts 里的 build 命令，本例中用于生成静态网站。
> - **阶段五. Build & push snapshot image**: 构建镜像，并将 tag 为 `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` 推送至 DockerHub (其中 `$BUILD_NUMBER` 为 pipeline 活动列表的运行序号)。
> - **阶段六. Deploy to dev**: 将 master 分支部署到 Dev 环境，此阶段需要审核。 -->

### Overview

The following flow chart briefly illustrates the process of entire 6 stages of this pipeline.

![流程图](/cicd-pipeline-02.svg)

> - Instructions
> - Stage 1 - Checkout SCM: Pull source code from GitHub.
> - Stage 2 - Get dependencies: Install all of the dependencies via [yarn](https://yarnpkg.com/zh-Hans/).
> - Stage 3 - Unit test: If the unit test passes, then continue the following tasks.
> - Stage 4 - Build: Execute the build command to generate the static Web.
> - Stage 5 - Build and push snapshot image: Build an image based on the branch selected in the behavioral strategy, and push the image with tag `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` to DockerHub.
> - Stage 6 - Deploy to Dev: Deploy the master branch to the Dev environment, which needs to be reviewed.

For the convenience of demonstration, this document still uses the GitHub repository [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) as an example. 

### Create a Project

Pipeline will deploy the Docs web service to Dev environment according to the [yaml](https://github.com/kubesphere/devops-docs-sample/tree/master/deploy/no-branch-dev) file, thus we are going to create a project as Dev environment. 

> Note: If you have already created the project `kubesphere-docs-dev` in the last tutorial, you can ignore and skip the following 3 steps.

1. Sign in with `project-regular`, click into **Workbench**, choose **Projects → Create** and select **Create a resource project**.

2. Fill in the basic information, name this project as `kubesphere-docs-dev`, others can be customized by yourself. 

3. Click **Next**, keep default values in **Advanced Settings** for this demo, then select **Create**.

Project `kubesphere-docs-dev` has been created successfully which represents the Dev environment.

<!-- ### 创建凭证

本示例创建流水线时需要访问 DockerHub 和 Kubernetes (创建 KubeConfig 用于接入正在运行的 Kubernetes 集群) 的 2 个凭证 (credentials) ，先依次创建这 2 个凭证。

> 注意：
> - 若示例七与示例六在同一 DevOps 工程，且示例六已创建了这两个凭证，则无需再次创建，可跳过创建凭证步骤，因为同一 DevOps 工程下的凭证对多个流水线是共用的。
> - 若代码仓库属于私有仓库如 Gitlab 或 SVN，可能还需要再创建这类账户的凭证。

#### 第一步：创建 DockerHub 凭证

1、在左侧的工程管理菜单下。点击 `凭证`，进入凭证管理界面，界面会展示当前工程所需的所有可用凭证。

![credential_page](/devops_credentials.png)

2、点击创建按钮，创建一个用于 DockerHub 登录的凭证，完成后点击 **确定**。

- 凭证 ID：必填，此 ID 将用于仓库中的 Jenkinsfile，可自定义，此处命名为 **dockerhub-id**
- 类型：选择 **账户凭证**
- 用户名/密码：输入您个人的 DockerHub 用户名和密码
- 描述信息：介绍凭证，比如此处可以备注为 DockerHub 登录凭证

![Dockerhub 凭证](/dockerhub-credential.png) -->

### Create Credentials

Enter into DevOps Project `devops-demo`, we are going to create 2 credentials totally.

#### Step 1: Create a DockerHub Credential

1. Choose **Credentials** and click **Create Credentials**.

2. Fill in the basic information for DockerHub Credential.


- Credential ID: enter **dockerhub-id**
- Type: Account Credentials 
- Username: Your personal username for DockerHub
- Token/password: Your personal password for DockerHub
- Description: DockerHub Credential

Click **OK** when you're done.

![Dockerhub 凭证](/dockerhub-credential-en.png)

#### Step 2: Create a Kubeconfig Credential

Same as above, click **Create Credentials** to create a credential for `kubeconfig`, name Credential ID as **demo-kubeconfig**, then click **OK** when you're done.

At this point, we have created 2 credentials totally. 

![凭证列表](/credential-list-demo7-en.png) 

<!-- ### 创建流水线

参考以下步骤，创建并运行一个完整的流水线。

#### 第一步：填写基本信息

1、进入已创建的 DevOps 工程，选择左侧 **流水线** 菜单项，然后点击 **创建**。

![创建流水线](/create_manual_pipeline.png)

2、在弹出的窗口中，输入流水线的基本信息，完成后点击 **下一步**。

- 名称：为流水线起一个简洁明了的名称，便于理解和搜索
- 描述信息：简单介绍流水线的主要特性，帮助进一步了解流水线的作用
- 代码仓库：此处不选择代码仓库

![基本信息](/manaul_pipeline_info.png) -->

### Create a Pipeline

#### Step 1: Basic Information

1. Redirect to **Pipeline** and click **Create**.
2. Fill in the basic information, e.g. `jenkinsfile-out-of-SCM`, then click **Next**.

<!-- #### 第二步：高级设置

1、填写基本信息后，进入高级设置页面。此处需勾选 `丢弃旧的构建`，本示例中 **保留构建的天数** 设置为 `1`，**保持构建的最大个数** 设置为 `3` (这个数值大小可根据团队习惯来设置)。

> 说明：高级设置支持对流水线的构建记录、参数化构建、定期扫描等设置的定制化。例如 **丢弃旧的构建** 可以决定何时应丢弃项目的构建记录。构建记录包括控制台输出，存档工件以及与特定构建相关的其他元数据。保持较少的构建可以节省 Jenkins 所使用的磁盘空间。

![丢弃旧的构建](/pipeline-advanced-setting-1.png)

2、点击 **添加参数**，如下添加 **两个** 字符串参数，将在流水线的 docker 命令中使用该参数。

|参数类型|名称|默认值|描述信息|
|---|---|---|---|
|字符串参数 (string)|DOCKERHUB_NAMESPACE|填写您的 DockerHub 账号 (它也可以是账户下的 Organization 名称)|DockerHub Namespace|
|字符串参数 (string)|APP_NAME|填写 devops-docs-sample|Application Name|

![高级设置](/pipeline-advanced-setting.png)

3、设置 **构建触发器**，此处勾选 **定时构建**，日程表 (cron) 填写 `H H * * *`，表示每天构建一次 (不限具体时刻)。完成后点击 **创建**，创建完成后页面将自动跳转至流水线的可视化编辑页面。

> 说明：这里的定时构建是提供类似 Linux cron 的功能来定期执行此流水线，定时构建的语法以下作一个简单释义，语法详见 [Jenkins 官方文档](https://jenkins.io/doc/book/pipeline/syntax/#cron-syntax)。

![定时构建](/advanced-setting-schedule.png)

> 定时构建语法：
> `* * * * *`
> - 第一个 * : 表示分钟，取值 0~59
> - 第二个 * : 表示小时，取值 0~23
> - 第三个 * : 表示一个月的第几天，取值 1~31
> - 第四个 * : 表示第几月，取值 1~12
> - 第五个 * : 表示一周中的第几天，取值 0~7，其中 0 和 7 代表的都是周日
>
> 常用的定时构建比如：
> - `H H/2 * * *`: 每两小时构建一次
> - `0 18 * * *`: 每天 18:00 下班前定时构建一次
> - `H H(9-18)/2 * * 1-5`: 在工作日的 9 AM ~ 6 PM 期间每两个小时构建一次 (或许在 10:38 AM, 12:38 PM, 2:38 PM, 4:38 PM) -->

#### Step 2: Advanced Settings

1. Check **Discard old branch**, enter 1 in **Days to keep old items**, then enter 3 in **Max period of old items to keep**. Note that this value could be set according to your team's habbit.

2. Click **Add parameter** to add 2 string parameters in this step, they will be used in pipeline later.

|Parameter Category|Name|Default Value|Description|
|---|---|---|---|
|String|DOCKERHUB_NAMESPACE|enter your DockerHub account <br>(It can also be the organization name)|DockerHub Namespace|
|String|APP_NAME|enter `devops-docs-sample`|Application Name|

3. Enter `H H * * *` into **Schedule**, which means it will trigger build once a day (no specific time limit). Click **OK** when you're done.

> Note: Timing build is similar to Linux Cron, for syntax details you can see [Jenkins Documentation](https://jenkins.io/doc/book/pipeline/syntax/#cron-syntax).

![定时构建](/advanced-setting-schedule-en.png)


<!-- ### 可视化编辑流水线

可视化流水线共包含 6 个阶段 (stage)，以下依次说明每个阶段中分别执行了哪些步骤和任务。

#### 阶段一：Checkout SCM

1、可视化编辑页面，分为结构编辑区域和内容编辑区域。通过构建流水线的每个阶段 (stage) 和步骤 (step) 即可自动生成 Jenkinsfile，用户无需学习 Jenkinsfile 的语法，非常方便。当然，平台也支持手动编辑 Jenkinsfile 的方式，流水线分为 “声明式流水线” 和 “脚本化流水线”，可视化编辑支持声明式流水线。Pipeline 语法参见 [Jenkins 官方文档](https://jenkins.io/doc/book/pipeline/syntax/)。

如下，此处代理的类型选择 `node`，label 填写 `nodejs`。

> 说明：代理 (Agent) 部分指定整个 Pipeline 或特定阶段将在 Jenkins 环境中执行的位置，具体取决于该 agent 部分的放置位置，详见 [Jenkins Agent 说明](../../devops/jenkins-agent)。

![代理设置](/pipeline_agent.png)

2、点击左侧结构编辑区域的 **“+”** 号，增加一个阶段 (Stage)，点击界面中的 **No name**，在右侧将其命名为 **checkout SCM**。

3、然后在此阶段下点击 `添加步骤`。右侧选择 `git`，此阶段通过 Git 拉取仓库的代码，弹窗中填写的信息如下：

 - Url: 填写 GitHub 示例仓库的 url `https://github.com/kubesphere/devops-docs-sample.git`
 - 凭证 ID: 无需填写 (若是私有仓库，如 Gitlab 则需预先创建并填写其凭证 ID)
 - 分支：此处无需填写分支名，不填则默认为 master 分支

![填写 SCM 地址](/git-info.png)

填写后点击 **确定**，可以看到构建的流水线的第一个阶段。 -->

### Create a Pipeline in a visual way

This pipeline includes 6 stages totally, we are going to instruct what steps and tasks within each stage. Firstly we are going to set **Type** and **label** within **Agent**.

- Type: choose `node`.
- label: enter `nodejs`.

![Agent](/agent-settings.png)

#### Stage 1: Checkout SCM

1. Click "+" button to add the first stage, then click **No name** in this stage, name it as **checkout SCM**.

![创建stage1](/pipeline_agent-en.png)

2. Click `Add step`, then choose `git` and enter the URL of sample repository: `https://github.com/kubesphere/devops-docs-sample.git`, click **OK** to finish the first stage.

![填写 SCM 地址](/git-info-en.png)

<!-- #### 阶段二：Get dependencies

1、在第一个阶段 checkout SCM 右侧点击 **“+”** 继续增加一个阶段，此阶段用于获取依赖，命名为 **get dependencies**。

2、由于这个阶段需要在容器中执行 shell 脚本，因此点击 `添加步骤`，在右侧内容编辑区域首先选择 `container`，然后命名为 **nodejs**，完成后点击 `确定`。

![获取依赖](/get-dependencies.png)

3、然后在右侧内容编辑区域 nodejs 容器中点击 `添加嵌套步骤`，选择 `shell`，用于在创建的容器中执行 shell 命令，命令填写 `yarn`，完成后点击 `确定`。

> 说明：命令 `yarn` 等同于 `yarn install`。本文档网站使用包管理器 [yarn](https://yarnpkg.com/zh-Hans/) 管理依赖，执行 `yarn` 命令可以安装项目需要的所有依赖。

![添加嵌套步骤](/pipeline-shell.png) -->

#### Stage 2: Get Dependencies

From Stage 2 to Stage 5, actually we need to point these 4 stages into nodejs containers to run the shell scripts in sequence.

1. Click `+` button to add the second stage which is used to get dependencies, thus we can enter **get dependencies** as its name. Then click `Add Step`.

![获取依赖](/get-dependencies-en.png)

2. Choose container and name it as `nodejs`, then click **OK**.

![Add container](/add-container-en.png)

3. Click `Add nesting steps` under the nodejs container, and choose `shell` which is used to execute shell command, then enter `yarn` into the popup command window.

![添加嵌套步骤](/pipeline-shell-en.png) 

<!-- #### 阶段三：Unit test

1、同上，在 `get dependencies` 阶段右侧点击 **“+”** 继续增加一个阶段用于在容器中执行单元测试，名称为 `unit test`。

2、点击 `添加步骤` 选择 `container`，命名为 `nodejs`，完成后点击 `确定`；

![添加嵌套步骤](/demo7-stage3.png)

3、然后在 nodejs 容器中点击 `添加嵌套步骤`，选择 `shell`，shell 命令填写 `yarn test`，用于单元测试，完成后点击 `确定`。

> 说明：如果单元测试通过了才允许继续下面的任务，由于本文档网站是静态网页，测试环节仅包含了单元测试。对于复杂的项目除了单元测试，通常还有端到端测试、集成测试、功能测试等步骤，这些都是项目持续部署的基础。

![添加单元测试](/yarn-test.png) -->

#### Stage 3: Unit Test

1. Same as above, click `+` to create the third stage, name it `unit test`.

![添加stage3](/add-stage3.png)

2. Click `Add step` in stage `unit test` and choose `container`, name it `nodejs` then click `OK`.

3. Click `Add nesting stage` and choose `shell`, input `yarn test` for unit test in popup window. Click `OK` when you're done.

![添加单元测试](/yarn-test-en.png) 

<!-- #### 阶段四：Build

1、同上，在 `unit test` 阶段右侧点击 **“+”** 新添加一个阶段 `build` 用于在容器中执行生成静态网站的命令，名称为 `build`。

2、点击 `添加步骤` 选择 `container`，命名为 `nodejs`，完成后点击 `确定`；

![添加步骤](/demo7-stage4.png)

3、然后点击 `添加嵌套步骤`，选择 `shell`，shell 命令填写 `yarn build`，完成后点击 `确定` ( **yarn build** 用于执行项目中 `package.json` 的 scripts 里的 **build** 命令，如果 build 通过了流水线才会继续执行下面的任务)。

![创建发布包](/pipeline-build.png) -->

#### Stage 4: Build

1. Same as above, click `+` to create the forth stage which is used to build a web in this container, name it `build`.

![stage4](/stage4-build-en.png)

2. Click `Add step` in stage `build` and choose `container`, name it `nodejs` then click `OK`.

3. Click `Add nesting steps` and select `shell`, then you can input `yarn build`, then click `OK`.

![创建发布包](/pipeline-build-en.png)

<!-- #### 阶段五：Build and push snapshot image

1、在 `build` 阶段右侧点击 **“+”** 新添加一个阶段，名称为 `Build and push snapshot image`。

> 说明：该阶段用于在容器中构建 snapshot 镜像，并将 tag 为 `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` 推送至 DockerHub，其中 `$BRANCH_NAME` 为分支名称，`$BUILD_NUMBER` 为 pipeline 活动列表的运行序号。

2、点击 `添加步骤` 选择 `container`，名称为 `nodejs`，完成后点击 `确定`；

3、然后点击 `添加嵌套步骤`，选择 `shell`，shell 命令填写如下一行 docker 命令，完成后点击 `确定`：

```shell
docker build -t docker.io/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-CRON-BUILD-$BUILD_NUMBER .
```

![构建镜像](/docker-build-image.png)


4、在当前阶段的 nodejs 容器中继续点击 `添加嵌套步骤` 在右侧选择 `withCredentials`，并填写如下信息用于登录 DockerHub，完成后点击 `确定`。

> 说明：因为考虑到用户信息安全，账号类信息都不以明文出现在脚本中，而以变量的方式。

- 凭证 ID：选择之前创建的 DockerHub 凭证，如 `dockerhub-id`
- 密码变量：`DOCKER_PASSWORD`
- 用户名变量：`DOCKER_USERNAME`

![添加凭证信息](/withcredentials-info.png) -->

#### Stage 5: Build and Push Snapshot Image

1. Same as above, click `+` button to add the fifth stage, name as `build and push snapshot image`. This stage is used to build snapshot image and push to DockerHub.

![stage5](/stage5-build-image.png)

2. Click **Add Step** and choose `container`, then name it `nodejs` and click `OK` to save it.

3. Choose `Add nesting steps` and select `shell`, enter a line of docker command as following:

```shell
docker build -t docker.io/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-CRON-BUILD-$BUILD_NUMBER .
```

![构建镜像](/docker-build-image-en.png)

4. In the current stage, continue to click `Add nesting steps` at the right zone, then choose `withCredentials` and enter following values into a popup window, click **OK** to save it when you're done.


- Credential ID: Choose `dockerhub-id` that we created before.
- Password Variable: `DOCKER_PASSWORD`.
- Username Variable: `DOCKER_USERNAME`.

> Note: Because of the security of user information, account information is not allowed to appear in the script with clear text, but in the form of variables.

![stage5](/stage5-add-credential.png)

![stage5](/stage5-add-credential-2.png)

<!-- 5、注意，下一步需要在 `withCredentials` 中依次添加两个 `嵌套步骤`，并且都选择 `shell`，用于登录 DockerHub 并推送镜像。在右侧点击 `添加嵌套步骤`，其中第一条 shell 命令填写如下，完成后点击 `确定`：

![添加嵌套步骤](/demo7-stage5.png)

```bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
```

6、同上，再次点击 `添加嵌套步骤`，第二条 shell 命令如下，完成后点击 `确定`：

![添加嵌套步骤-2](/demo7-stage6-step2.png)

```bash
docker push docker.io/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-CRON-BUILD-$BUILD_NUMBER
```

阶段五完成后的截图如下所示：

![推送 snapshot](/build-push-snapshot.png) -->

5. Note that we are going to create two nesting steps into `withCredentials`, both of them are used to run shell scripts. Click `Add nesting steps` within `withCredentials`, then enter following scripts:

```bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
```

![添加嵌套步骤](/demo7-stage5-en.png)

6. Same as above, click `Add nesting steps` again within `withCredentials`, and the second docker command as following:

```bash
docker push docker.io/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-CRON-BUILD-$BUILD_NUMBER
```

![add nesting step](/demo7-stage6-step2-en.png)

At this point, we have created 5 stages totally. Next we are going to add a stage to deploy to KubeSphere.

![推送 snapshot](/build-push-snapshot-en.png) 

<!-- #### 阶段六：Deploy to dev

1、最后一步，在阶段五右侧点击  **“+”**  增加最后一个阶段，此阶段用于人工审核，并部署到 Dev 环境，命名为 **deploy to dev**。

![deploy to dev](/demo7-stage6-step1.png)

> 说明：因为在实际项目过程中，比如开发者提交了一次代码，测试也通过了，镜像也打包上传了，但是这个版本并不一定就是要立刻上线到生产环境的，可能需要将该版本先发布到开发环境、测试环境、或者预览环境之类，所以通常需要在 CD 的环节增加人工审核。

2、点击 `添加步骤`，右侧选择 `input`。该步骤用于人工审核，当流水线执行至审核步骤时将暂停，待审核通过后才可以继续进行。审核信息参考如下填写，完成后点击 **确定**：

- id：可选，填写步骤的 ID，如 `deploy-to-dev`
- 消息 (message)：必填，在用户人工审核时呈现给用户，此处可填 `Deploy to dev?`
- 审核者 (submitter)：本示例指定用户名为 `project-admin` 的用户，支持输入 **用户名** 指定用户人工审核。注意，此处审核者如果为空则默认此工程下包括当前用户在内的所有用户 (不限角色) 都具有审核权限。

![审核流水线](/deploy-to-dev-info.png)
![Deploy to dev](/deploy-to-dev-step3.png)

3、在当前阶段点击 `添加步骤`，右侧选择 `kubernetesDeploy`，这是 [Kubernetes Continuous Deploy Plugin](https://jenkins.io/doc/pipeline/steps/kubernetes-cd/#kubernetes-continuous-deploy-plugin) 中的函数，该步骤可将项目中指定路径的 yaml 模板部署到 Kubernetes 中，配置信息如下，填写后点击 **确定**：

- Kubeconfig：选择之前创建的 kubeconfig 凭证
- 配置文件路径 (configs)：yaml 模板在项目中的相对路径，填写 `deploy/no-branch-dev/**`
- 在配置中启用变量替换 (enableConfigSubstitution)，保持默认，允许在流水线中通过变量动态传值 (比如以上用到的 `$DOCKER_PASSWORD`、`$APP_NAME`)

![部署到 Kubernetes 配置](/Kubernetes-deploy-info.png)

至此，流水线的 6 个阶段都已构建完成，点击 `确认 → 保存`，可视化创建的 pipeline 会默认生成 Jenkinsfile 文件。

![流水线总览](/pipeline-overview.png) -->

#### Stage 6: Deploy to Dev

1. Click `+` button to add a new stage also the last stage as well. 

2. Click `Add Step` and choose `input` at right sidebar which is used to manual check. Reference the following information:

- id: enter `deploy-to-dev`
- Message: enter `Deploy to dev?`
- Submitter: you can choose and enter `project-admin` to review and approve this pipeline.

![审核流水线](/deploy-to-dev-info-en.png)

3. Click `Add Step` in current stage and choose `kubernetesDeploy`, then reference below to fill in the blanks within the popup window:

- Kubeconfig: select `demo-kubeconfig` that we created before.
- Config Files: enter `deploy/no-branch-dev/**`.

Click **OK** to save it.

![部署到 Kubernetes 配置](/Kubernetes-deploy-info-en.png)

At this point, we have create 6 stages totally, then click **Confirm** and choose **Save** at the right bottom of this page.

![pipeline](/overall-stages.png)

<!-- ### 运行流水线

1、手动构建的流水线在平台中需要手动运行，点击 `运行`，输入参数弹窗中可编辑之前定义的两个字符串参数，此处无需修改，点击 `确定`，流水线将开始运行。

![运行流水线](/run-pipeline.png)

2、在 **活动** 列表中可以看到流水线的运行状态，点击活动项可查看其运行活动的具体情况，例如以下查看 **运行序号** 为 `1` 和 `2` 的活动。

> 说明：流水线刚启动时可能仅显示其日志输出而无法看到其图形化运行的页面，这是因为它有个初始化的过程，流水线刚开始运行时，slave 启动并开始解析和执行流水线自动生成的 Jenkinsfile，待初始化完成即可看到图形化流水线运行的页面。

![活动列表](/pipeline-status.png)

3、在活动列表点击运行序号 `1`，进入序号 `1` 的活动详情页查看流水线的具体运行情况。

4、登出平台并切换为 `project-admin` 登录后，进入示例 DevOps 工程下的流水线 jenkinsfile-out-of-scm。然后点击 `活动` 进入序号 `1` 的活动详情页，可以看到流水线已经运行至 `deploy to dev` 阶段，点击 `继续`，流水线的活动状态转变为 **运行中**。

> 说明：若前面的步骤配置无误则几分钟后可以看到流水线已经成功运行到了最后一个阶段。由于我们在最后一个阶段添加了 `input` 即人工审核步骤，并指定了用户名为 `project-admin` 的用户。因此流水线运行至此将暂停，等待审核者 `project-admin` 登录进入该流水线运行页面来手动触发。此时审核者可以测试构建的镜像并进一步审核整个流程，若审核通过则点击 **继续**，最终将部署到开发环境中。

![审核部署阶段](/pipeline-deploy-to-dev.png) -->

### Run the Pipeline

1. Click **Run** to trigger this pipeline manually, then leave the default values and choose **OK** in the popup window.

![run_pipeline](/pipeline_running-en.png)

2. Thus we can see it was triggered and shows running status.

![run_status](/pipeline_status-en.png)

3. Click into the pipeline under `Activity` list to inspect the task status of each stage.

![活动列表](/pipeline-status-inspect.png)

4. Log out KubeSphere, and sigh in with `project-admin`, then enter into `Jenkinsfile-out-of-SCM`. 

5. Once the pipeline runs to `Deploy to dev`, it requires `project-admin` to review and proceed to run. Click `Proceed` in `Deploy to dev` stage.

![proceed](/pipeline-status-inspect-proceed.png)


<!-- ### 查看流水线
   
1、几分钟后，流水线将运行成功。点击流水线中 `活动` 列表下查看当前正在运行的流水线序列号，页面展示了流水线中每一步骤的运行状态。黑色框标注了流水线的步骤名称，示例中流水线的 6 个 stage 就是以上创建的六个阶段。
   
![run_status](/pipeline_status.png)

2、当前页面中点击右上方的 `查看日志`，查看流水线运行日志。页面展示了每一步的具体日志、运行状态及时间等信息，点击左侧某个具体的阶段可展开查看其具体的日志，若出现错误可根据日志信息来分析定位问题，日志支持下载至本地查看。
   
![log](/pipeline_log.png)

-->


<!-- ### 验证运行结果

若流水线的每一步都能执行成功，那么流水线最终 build 的 Docker 镜像也将被成功地 push 到 DockerHub 中，我们在 Jenkinsfile 中已经配置过 Docker 镜像仓库，登录 DockerHub 查看镜像的 push 结果，可以看到 tag 为 SNAPSHOT-CRON-BUILD-xxx 的镜像已经被 push 到 DockerHub。在 KubeSphere 中最终以 deployment 和 service 的形式部署到了开发环境中。

1、切换为 `project-regular` 登录 KubeSphere，进入 `kubesphere-docs-dev` 项目，在左侧的菜单栏点击 **工作负载 → 部署**，可以看到 ks-docs-sample-dev 已创建成功。

|环境|访问地址| 所在项目 (Namespace) | 部署 (Deployment) |服务 (Service)|
|---|---|---|---|---|
|Dev| 公网IP : 30860 (`${EIP}:${NODEPORT}`)| kubesphere-docs-dev| ks-docs-sample-dev|ks-docs-sample-dev|

**查看部署**
![查看部署](/demo7-deployment.png) 


2、在菜单栏中选择 **网络与服务 → 服务** 也可以查看对应创建的服务，可以看到该服务对外暴露的节点端口 (NodePort) 是 `30860`。

**查看服务**
![查看服务](/demo7-service.png)

3、查看推送到 DockerHub 的镜像，可以看到 `devops-docs-sample` 就是 **APP_NAME** 的值，而 **Tag Name** 则是 `SNAPSHOT-CRON-BUILD-$BUILD_NUMBER` 的值 (`$BUILD_NUMBER` 对应活动的运行序号)，而 tag 为 `SNAPSHOT-CRON-BUILD-1` 的镜像，正是 `kubesphere-docs-dev` 这个部署所用到的镜像。
  
![查看镜像](/deveops-dockerhub.png) -->

### Verify the Result

Once each stage of this pipeline run successfully, we can see the status showing `Success` in this panel.

![Success pipeline](/pipeline-success.png)

Thus the image with different tag will be pushed to DockerHub, also the deployment and service will be deployed to `kubesphere-docs-dev`. See the table as following:

|Environment|Accessing URL| Project | Deployment | Service |
|---|---|---|---|---|
|Dev| `http://EIP:30860` (i.e. ${EIP}:${NODEPORT} )| kubesphere-docs-dev| ks-docs-sample-dev|ks-docs-sample-dev|

1. At this point, you can verify the status of their deployment and service in related project.

![demo7-deployment-status](/demo7-deployment-status.png)

![demo7-service-status](/demo7-service-status.png)

2. Then you can visit your profile in DockerHub and look at the image details.

![查看 DockerHub](/deveops-dockerhub-en.png)

3. As the Docs web service is exposed outside, if you want to access the service, you might need to bind the EIP and configure port forwarding. If the EIP has a firewall, add the corresponding port (e.g. 30860) to the firewall rules to ensure that the external network traffic can pass through these ports. In that case, external access is available.

<!-- 若需要在外网访问，可能需要进行端口转发并开放防火墙，才能访问到成功部署的文档网站示例。

例如，在 QingCloud 云平台上，如果使用了 VPC 网络，则需要将 KubeSphere 集群中的任意一台主机上暴露的节点端口 (NodePort) `30860` 在 VPC 网络中添加端口转发规则，然后在防火墙放行该端口。

**添加端口转发规则**

![添加端口转发规则](/demo7-vpc-nodeport-forward.png)

**防火墙添加下行规则**

![防火墙添加下行规则](/demo7-firewall-nodeport.png)

### 访问示例服务

如下在浏览器访问部署到 KubeSphere 的开发环境的服务：`http://127.0.0.1:30860/`。

**Dev 环境**
![](/docs-home-dev-preview.png)


至此，创建一个 Jenkinsfile Out of SCM 类型的流水线已经完成了，若创建过程中遇到问题，可参考 [常见问题](../../faq)。 -->

### Access the service

Accessing the Docs service of Dev and Production environment:

**Dev Environment**

Enter `http://EIP:30860/` in your browser to preview the service.

![](/docs-home-dev-preview-en.png)

At this point, we have successfully created a pipeline in friendly UI, it's recommeded you to follow with the next tutorial.

