---
title: "Create a CI/CD Pipeline Based on Jenkinsfile" 
---

## Target

In this tutorial we will demonstrate how to setup a CI/CD pipeline within KubeSphere using an example repository, it includes 8 stages and will deploy a Docs web service to Dev and Production environment respectively. 

## Prerequisites

For this tutorial you will need

- Make sure you have created [GitHub](https://github.com/) and [DockerHub](http://www.dockerhub.com/) account.
- Create a workspace and DevOps project, see the [Admin Quick Start](../admin-quick-start) if not yet.
- Be familiar with the basics of Git and version control.

## Estimated Time

About 30 - 50 minutes.

### Overview

The following flow chart briefly illustrates the process of the entire pipeline.

![流程图](/cicd-pipeline-01.svg)

- Instructions
- Stage 1 - Checkout SCM: Pull source code from GitHub.
- Stage 2 - Get dependencies: install all of the dependencies via [yarn](https://yarnpkg.com/zh-Hans/).
- Stage 3 - Unit test: If the unit test passes, then continue the following tasks.
- Stage 4 - Build and push snapshot image: Build an image based on the branch selected in the behavioral strategy, and push the image with tag `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` to DockerHub.
- Stage 5 - Push the latest image: Put the tag of master branch as "latest" and push it to DockerHub.
- Stage 6 - Deploy to Dev: Deploy the master branch to the Dev environment, which needs to be reviewed.
- Stage 7 - Push with tag: Generate the tag and release to GitHub and DockerHub.
- Stage 8 - Deploy to production: Deploy the published package to the Production environment.

For the convenience of demonstration, this document uses the GitHub repository [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) as an example. You can fork it into your GitHub and modify the environment variables to actual parameters.

### Create Credentials

Sign in with `project-regular`, enter into `devops-demo`, we are going to create 3 credentials totally.


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

#### Step 2: Create a GitHub Credential

Same as above, create a credential for GitHub, then fill in the basic information, Credential ID is named **github-id**, other blanks according to your personal GitHub information.

#### Step 3: Create a Kubeconfig Credential

Same as above, click **Create Credentials** to create a credential for `kubeconfig`, name Credential ID as **demo-kubeconfig**, then click **OK** when you're done.

At this point, we have created 3 credentials totally. 

![凭证列表](/credential-list-demo-en.png) 

The next step is to modify the corresponding 3 credential IDs to above 3 ones in jenkinsfile.

### Modify the Jenkinsfile

#### Step 1: Fork Project

Fork the repository [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) to your GitHub.

![Fork 项目](/fork-repo-en.png)

#### Step 2: Modify the Jenkinsfile

1. Enter into `Jenkinsfile` in the root directory.

![进入 Jenkinsfile](/jenkinsfile-location.png)

2. Click `edit` icon to edit Jenkinsfile, then modify values to yours in "environment".

![修改 Jenkinsfile](/modify-jenkinsfile-en.png)

|Key|Value|Description|
|---|---|---|
|DOCKERHUB\_CREDENTIAL\_ID|'dockerhub-id'|This is the Dockerhub credential we created earlier, which is used to log in to your DockerHub|
|GITHUB\_CREDENTIAL\_ID|'github-id'|This is the GitHub credential created earlier which is used to push the tag to your GitHub|
|KUBECONFIG\_CREDENTIAL\_ID|'demo-kubeconfig'| This is the kubeconfig credential ID we created earlier, which is used to access a running Kubernetes cluster |
|DOCKERHUB_NAMESPACE|'your-dockerhub-account'| Replace with your DockerHub account name <br> (It can also be the organization name under your account)|
|GITHUB_ACCOUNT|'your-github-account' | Replace with your GitHub account name <br> (It can also be the organization name under the account) |
|APP_NAME|devops-docs-sample |Application name, you can keep default value.|

```bash
      ···
environment {
    DOCKERHUB_CREDENTIAL_ID = 'dockerhub-id'
    GITHUB_CREDENTIAL_ID = 'github-id'
    KUBECONFIG_CREDENTIAL_ID = 'demo-kubeconfig'
    DOCKERHUB_NAMESPACE = 'your-dockerhub-account'
    GITHUB_ACCOUNT = 'your-github-account'
    APP_NAME = 'devops-docs-sample'
  }
      ···
```

3. Click **Commit changes** when you've modified above environments.

![提交更新](/commit-jenkinsfile-en.png)

### Create Two Projects

Pipeline will deploy the Docs web service to both Dev and Production environment according to the [yaml](https://github.com/kubesphere/devops-docs-sample/tree/master/deploy) file, thus we are going to create 2 projects (i.e. `kubesphere-docs-dev` and `kubesphere-docs-prod`) as environment.

#### Step 1: Basic Information

1. Redirect to the Workbench, choose **Projects → Create** and select **Create a resource project**.

2. Fill in the basic information, name this project as `kubesphere-docs-dev`, others can be customized by yourself. 

3. Click **Next**, keep default values in **Advanced Settings** for this demo, then select **Create**.

The first project `kubesphere-docs-dev` has been created successfully which represents the Dev environment.


#### Step 2: Create the Second Project

Same as above, create the second project `kubesphere-docs-prod` as the Production environment, you can reference above step to create this project.

At this point, we have created two projects as the Dev and Production environment, thus the pipeline will deploy the web service and deployment to Dev and Production in sequence.

### Create a Pipeline

#### Step 1: Basic Information

1. Redirect to **Workbench**, then select **DevOps Projects** tab and enter **demo-devops** that we created in the [Admin Quick Start](../admin-quick-start).

2. Click **Create**, fill in the basic information, e.g. `jenkinsfile-in-SCM`. Then click the **Code Repository (Optional)** to add GitHub repo.

#### Step 2: Add a Repository

1. Click **get token** to create a new personal access token for your GitHub account.

2. Enter any description into **Token description** in GitHub page, e.g. `DevOps demo`. Leave the default selections in **Select scopes**, then click `Generate token`,  you will see a new access token generated by GitHub which is used to authentication.

3. Copy your access token and switch to KubeSphere, paste it into **Token** and choose **Confirm**.

4. In this step you will see all of the repositories under your personal account,  then click **Select this repo** to choose the [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) which already has its own Jenkinsfile in the root of this repository.

5. Click **Next** when you've completed basic information.

#### Step 3: Advanced Settings

1. Check **Discard old branch** and leave the default value (-1) in **Days to keep old items** and **Max period of old items to keep**.

2. As for **Behavioral strategy**,  reference the following selections:

- Discover Branches: choose `Exclude branches that are also filed as PRs`.
- Discover PR from the original repo: choose `Source code version of PR itself`.
- Discover PR from the forking repo: click `delete` icon since this example will not use this strategy.

3. Leave the default value in **Script Path** since the Jenkinsfile location is in the root folder.

4. Choose **Scan interval** as `5 minutes` in **Scan Repo Trigger**, then click **Create**.

<!-- #### 第四步：运行流水线

流水线创建后，点击浏览器的 **刷新** 按钮，可见一条自动触发远程分支后的运行记录。

1、点击右侧 **运行**，将根据上一步的 **行为策略** 自动扫描代码仓库中的分支，在弹窗选择需要构建流水线的 `master` 分支，系统将根据输入的分支加载 Jenkinsfile (默认是根目录下的 Jenkinsfile)。

2、由于仓库的 Jenkinsfile 中 `TAG_NAME: defaultValue` 没有设置默认值，因此在这里的 `TAG_NAME` 可以输入一个 tag 编号，比如输入 v0.0.1。

3、点击 **确定**，将新生成一条流水线活动开始运行。

> 说明: tag 用于在 GitHub 和 DockerHub 中分别生成带有 tag 的 release 和镜像。
> 注意: 在主动运行流水线以发布 release 时，`TAG_NAME` 不应与之前代码仓库中所存在的 `tag` 名称重复，如果重复会导致流水线的运行失败。

![运行流水线](/run-pipeline-demo1.png)

至此，Jenkinsfile in SCM 已完成创建并开始运行。

> 注：点击 **分支** 切换到分支列表，查看流水线具体是基于哪些分支运行，这里的分支则取决于上一步 **行为策略** 的发现分支策略。
   
![查看流水线](/pipeline_scan.png) -->

#### Step 4: Run the Pipeline

1. Refresh your browser then you will be able to see there is a pipeline in **Running** status, which is triggered automatically.

2. Click **Run** button, then leave the default branch (master) and input a version number in **TAG_NAME** (e.g. v0.0.1). Note that this tag is used to generate release and image in GitHub and DockerHub respectively.

3. Choose **OK**, you will see it generates a new pipeline in activity list.

At this point, this pipeline is already been triggered and showing running. 

<!-- #### 第五步：审核流水线

为方便演示，此处默认用当前账户来审核，当流水线执行至 `input` 步骤时状态将暂停，需要手动点击 **继续**，流水线才能继续运行。注意，在 Jenkinsfile 中分别定义了三个阶段 (stage) 用来部署至 Dev 环境和 Production 环境以及推送 tag，因此在流水线中依次需要对 `deploy to dev, push with tag, deploy to production` 这三个阶段审核 `3` 次，若不审核或点击 **终止** 则流水线将不会继续运行。

![审核流水线](/devops_input.png)

> 说明：在实际的开发生产场景下，可能需要更高权限的管理员或运维人员来审核流水线和镜像，并决定是否允许将其推送至代码或镜像仓库，以及部署至开发或生产环境。Jenkinsfile 中的 `input` 步骤支持指定用户审核流水线，比如要指定用户名为 project-admin 的用户来审核，可以在 Jenkinsfile 的 input 函数中追加一个字段，如果是多个用户则通过逗号分隔，如下所示：

```groovy
···
input(id: 'release-image-with-tag', message: 'release image with tag?', submitter: 'project-admin,project-admin1')
···
``` -->

#### Step 5: Review the Pipeline

Enter into this pipeline that we ran it manually, then watch its running status. It will be paused when it runs to `deploy to dev` stage, thus you could choose `Proceed` in this stage. For the convenience, we will use project-regular to review directly.

Accordingly, the last 3 stages including `deploy to dev`, `push with tag`, `deploy to production` require review 3 times in sequence. Note that it will not proceed to run unless you click **Proceed** button.

![审核流水线](/devops_input-en.png)

> Note: If you would like to point someone like project-admin to review, you can specify the name in Jenkinsfile as following:

```groovy
···
input(id: 'release-image-with-tag', message: 'release image with tag?', submitter: 'project-admin')
···
```

<!-- ### 查看流水线
   
1、点击流水线中 `活动` 列表下当前正在运行的流水线序列号，页面展现了流水线中每一步骤的运行状态，注意，流水线刚创建时处于初始化阶段，可能仅显示日志窗口，待初始化 (约一分钟) 完成后即可看到流水线。黑色框标注了流水线的步骤名称，示例中流水线共 8 个 stage，分别在 [Jenkinsfile](https://github.com/kubesphere/devops-docs-sample/blob/master/Jenkinsfile) 中被定义。
   
![run_status](/pipeline_status.png)

2、当前页面中点击右上方的 `查看日志`，查看流水线运行日志。页面展示了每一步的具体日志、运行状态及时间等信息，点击左侧某个具体的阶段可展开查看其具体的日志。日志可下载至本地，如出现错误，下载至本地更便于分析定位问题。
   
![log](/pipeline_log.png) -->

### View the Pipeline

1. Click into the pipeline under the activity list to inspect the running status and build progress in a visual way. Note that it might only display a log output page since it's still in the initialization phase, once the initialization finished it will direct to the visual page.

![run_status](/pipeline_status.png)

2. It also supports you to inspect logs for each stage, click **Show Log** button it will direct to a detailed popup window.

![log](/pipeline_log-en.png)


### Verify the Result

Once each stage of this pipeline ran successfully, the image with different tag (e.g. snapshot, TAG_NAME(v0.0.1), latest) will be pushed to DockerHub, then it will also generate a new release in GitHub, as well as the deployment and service will be deployed to `kubesphere-docs-dev` and `kubesphere-docs-prod` respectively, see the table as following:

|Environment|Accessing URL| Project | Deployment | Service |
|---|---|---|---|---|
|Dev| `http://EIP:30860` (i.e. ${EIP}:${NODEPORT} )| kubesphere-docs-dev| ks-docs-sample-dev|ks-docs-sample-dev|
|Production|`http://EIP:30960` (i.e. ${EIP}:${NODEPORT} )|kubesphere-docs-prod|ks-docs-sample |ks-docs-sample|

1. At this point, you can verify the status of their deployment and service in related project.

2. Then you can visit your profile in DockerHub and look at the image details.

![查看 DockerHub](/deveops-dockerhub.png)

3. Redirect to tour GitHub, you can verify the release result.

![查看 release](/demo6-view-releases.png)

![查看 release](/verify-github-release.png)

4. As the Docs web service is exposed outside, if you want to access the service, you might need to bind the EIP and configure port forwarding. If the EIP has a firewall, add the corresponding port (e.g. 30860 and 30960) to the firewall rules to ensure that the external network traffic can pass through these ports. In that case, external access is available.

<!-- ### 访问示例服务

在浏览器访问部署到 KubeSphere Dev 和 Production 环境的服务：

**Dev 环境**

访问 `http://127.0.0.1:30860/` 或者 `http://EIP:30860/`。

![](/docs-home-dev-preview.png)

**Prodcution 环境**

访问 `http://127.0.0.1:30960/` 或者 `http://EIP:30960/`。

![](/docs-home-production-preview.png) -->

### Access the service

Accessing the Docs service of Dev and Production environment:

**Dev Environment**

Enter `http://EIP:30860/` in your browser to preview the service.

![](/docs-home-dev-preview-en.png)

**Production Environment**

Enter `http://EIP:30960/` in your browser to preview the service.

![](/docs-home-production-preview-en.png) 

<!-- 至此，创建一个 Jenkinsfile in SCM 类型的流水线已经完成了，若创建过程中遇到问题，可参考 [常见问题](../../faq)。 -->

At this point, we have successfully created a pipeline based on the Jenkinsfile in the repository, it's recommeded you to follow with the next tutorial.