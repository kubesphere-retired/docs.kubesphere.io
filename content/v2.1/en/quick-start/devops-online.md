---
title: "a CI/CD Pipeline based on Spring Boot Project"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## Objective

In this tutorial we will show you how to create a pipeline based on the built-in Jenkinsfile of the GitHub repository. There are 8 stages in the pipeline. There is a demo application that will be deployed to Development and Production namespace. At the same time , there is a branch that is used to test dependency cache, you can compare the build time with the master branch.

> Note:
> KubeSphere supports two kinds of pipeline, i.e. jenkinsfile in SCM and jenkinsfile out of SCM. Jenkinsfile in SCM requires a internal Jenkinsfile in SCM, it serves as a part of the Source Control Management. KubeSphere DevOps system will automatically build a CI/CD pipeline depends on existing Jenkinsfile of the code repository, you can define workflow lke Stage, Step and Job.

## Prerequisites

- You have enabled KubeSphere DevOps System installation
- You have an account for DokcerHub and GitHub.
- You have created a workspace, a DevOps project, and a **project-regular** user account, and this account has been invited into a DevOps project, see [Get started with multi-tenant management](../admin-quick-start).
- Set CI dedicated node for building pipeline.

## Hands-on Lab

### Pipeline Overview

The flow chart below illustrates the pipeline's complete work process:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190512155453.png#align=left&display=inline&height=1302&originHeight=1302&originWidth=2180&search=&status=done&width=2180)

> Note：
> - **Stage 1. Checkout SCM**: Checkout source code from GitHub repository.
> - **Stage 2. Unit test**: It will continue to execute next stage after unit test passed.
> - **Stage 3. SonarQube analysis**：Process sonarQube code quality analysis.
> - **Stage 4.** **Build & push snapshot image**: Build the image based on selected branches in the behaviour strategy. Push the tag of `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` to DockerHub, among which, the `$BUILD_NUMBER` is the operation serial number in the pipeline's activity list.
> - **Stage 5. Push the latest image**: Tag the master branch as latest and push it to DockerHub.
> - **Stage 6. Deploy to dev**: Deploy master branch to Dev environment. verification is needed for this stage.
> - **Stage 7. Push with tag**: Generate tag and released to GitHub. Then push the tag to DockerHub.
> - **Stage 8. Deploy to production**: Deploy the released tag to the Production environment.


## Create Credentials

> Attention: If there is special characters in your account or password, please encode it in https://www.urlencoder.org/, then paste the encoded result into credentials below.

1. Login KubeSphere with `project-regular`, enter into the created DevOps project and create following 3 credentials:

|Credential ID| Type | Where to use |
| --- | --- | --- |
| dockerhub-id | Account Credentials | DockerHub |
| github-id | Account Credentials | GitHub |
| demo-kubeconfig | kubeconfig | Kubernetes |


2. Then we need to create a credential for SonarQube token, which will be used in stage 3 (SonarQube analysis). Refer to [Access SonarQube Console and Create Token](../../installation/install-sonarqube).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107105041.png)


In total, we've created 4 credentials in this section.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107105153.png)

## Modify Jenkinsfile in repository

### Fork Project

Login GitHub. Fork the [devops-java-sample](https://github.com/kubesphere/devops-java-sample) from  GitHub repository to your own GitHub.

![](https://pek3b.qingstor.com/kubesphere-docs/png/fork-repo.png#align=left&display=inline&height=910&originHeight=910&originWidth=2034&search=&status=done&width=2034)


### Edit Jenkinsfile

1. After forking to your own GitHub. Enter into the **Jenkinsfile-online** from the **Root Directory**.

![](https://kubesphere-docs.pek3b.qingstor.com/png/jenkinsonline.png#align=left&display=inline&height=1140&originHeight=1140&originWidth=2192&search=&status=done&width=2192)

2. Click the editing logo in GitHub UI to edit the values of environment variables.

![](https://kubesphere-docs.pek3b.qingstor.com/png/env.png#align=left&display=inline&height=1538&originHeight=1538&originWidth=1956&search=&status=done&width=1956)

| Editing Items | Value | Description |
| :--- | :--- | :--- |
| DOCKER_CREDENTIAL_ID | dockerhub-id | Fill in DockerHub's credential ID to log in your DockerHub. |
| GITHUB_CREDENTIAL_ID | github-id | Fill in the GitHub credential ID to push the tag to GitHub repository. |
| KUBECONFIG_CREDENTIAL_ID | demo-kubeconfig | kubeconfig credential ID is used to access to the running Kubernetes cluster. |
| REGISTRY | docker.io | Set the web name of docker.io by default for pushing images. |
| DOCKERHUB_NAMESPACE | your-dockerhub-account | Replace it to your DockerHub's account name. (It can be the Organization name under the account.) |
| GITHUB_ACCOUNT | your-github-account | Change your GitHub account name, such as `https://github.com/kubesphere/`. Fill in `kubesphere` which can also be the account's Organization name. |
| APP_NAME | devops-java-sample | Application name |
| SONAR_CREDENTIAL_ID | sonar-token | Fill in the SonarQube token credential ID for code quality test. |


**Note: The command parameter `-o` of Jenkinsfile's `mvn` indicates that the offline mode is on. This tutorial has downloaded relevant dependencies to save time and to adapt to network interference in certain environments. The offline mode is on by default.**

3. After editing the environmental variables, click **Commit changes** and submit the updates to the master branch.

![](https://kubesphere-docs.pek3b.qingstor.com/png/commit-jenkinsfile.png#align=left&display=inline&height=722&originHeight=722&originWidth=1396&search=&status=done&width=1396)


## Create Projects

In this section, we'll create 2 projects, i.e. `kubesphere-sample-dev` and `kubesphere-sample-prod`, serve as development and production environment.


### Create The First Project

> Tip：The account of `project-admin` should be created in advance, `project-admin` will be regarded as the reviewer of the CI/CD Pipeline.


1. Use the account of `project-admin` to log in KubeSphere. Enter into `demo-workspace`, click **Project → Create, then choose **Create a resource project**. Fill in this project's basic information. Click **Next** after completion.


- Name: enter `kubesphere-sample-dev`.
- Alias: e.g. **development environment**.


2. Click **Next**, leave the default values at Advanced Settings. Click **Create**.

3. Then, use the `project-admin` to invite  `project-regular` user into `kubesphere-sample-dev`. Choose **Project Setting→Project Member**. Click **Invite Members** to invite `project-regular` and grant this account the role of `operator`.


### Step 3: Create the Second Project

Similarly, create a project named `kubesphere-sample-prod` following the two steps above. This project is the production environment. Then invite `project-regular` to the project of `kubesphere-sample-prod`, and grant it the role of `operator` as well.

> Note: When the CI/CD pipeline succeeded. You will see the demo application's Deployment and Service has been deployed to `kubesphere-sample-dev` and `kubesphere-sample-prod.` respectively.


![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107142252.png)

## Create a Pipeline

### Fill in Basic Information

1. Enter into the DevOps project `demo-devops`. click **Create** to build a new pipeline.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107142659.png)

2. Fill in the pipeline's basic information in the pop-up window, name it as `jenkinsfile-in-scm`, click `Code Repository`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107143247.png)



### Add Repository

1. Click **Get Token** to generate a new GitHub token.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107143539.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107143648.png)

2. Click **Confirm**, choose your account, all the code repositories relating to this Token will be listed on the right. Select [devops-java-sample](https://github.com/kubesphere/devops-java-sample) and click **Select this repo** → **Next**. 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107143818.png)

### Step 3: Advanced Settings

After completing the repositories' configurations, enter into the advanced setting page.

<!--
> Note:
> The branches can be controlled by both of the preservation days and the branch number. If the branch has expired the preservation dates or exceeded the limitation number, the branch should be discarded. For example, if the preservation day is 2 and the branch number is  3, any branches that do not meet the requirements should be discarded. Set both of the limitation to -1 by default means not to delete branched automatically. 
>
> Discarding old branches means that you will discard the branch record all together. The branch record includes console output, archive artifacts and other relevant data. Keeping less branches saves Jenkins' disk space. We provide two options to determine when to discard old branches:
>
> - Days for preserving the branches: If branch reaches the days, it must be discarded.
> - Number of branches: If there is a significant number of branches, the oldest branches should be discarded. -->


2. In the behaviour strategy, KubeSphere pipeline has set three strategies by default. Since this demo has not applied the strategy of **Discover PR from Forks,** this strategy can be deleted. 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107144107.png)

<!-- > Note：
> There types of discovering strategies are supported. When the Jenkins pipeline is activated, the Pull Request (PR) submitted by the developer will also be regarded as a separate branch.
> Discover the branch:
> - Exclude the branch as PR: Select this option means that CI will not scan the source branch as such Origin's master branch. These branches needs to be merged.
> - Only the branched submitted as PR: Only scan the PR branch.
> - All the branches: extract all the branches from the repository origin.
>
> Discover PR from the origin repository:
> - The source code after PR merges with the branch: Once discovery operation is based on the source codes derived from merging the PR and the target branch. It is also based on the running pipeline.
> - PR's source code edition: Once discovery operation is based on the pipeline build by PR's source codes.
> - There will be two pipelines when the PR is found. One pipeline applies PR's source code and the other one uses the source code from  merging the PR with the target branch: This is twice discovery operation.  -->


3. The path is **Jenkinsfile** by default. Please change it to  [Jenkinsfile-online](https://github.com/kubesphere/devops-java-sample/blob/master/Jenkinsfile-online), this is the file name of jenkinsfile in the repository, located in root directory.

> Note: Script path is the Jenkinsfile path in the code repository. It indicates the repository's root directory. If the file location changes, the script path should also be changed. 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107145113.png)

4. **Scan Repo Trigger** can be customized according to the team's development preference. The example here we set it as `5 minutes`.

<!-- > Note: Regular scaning is to set a cycle to require the pipeline scan remote repositories regularly. According to the **Behaviour Strategy **to check whether there is a code update or a new PR.
>
> Webhook Push:
> Webhook is a high-efficiency way to detect the changes in the remote repository and automatically activate new operations. Webhook should play the main role in scanning Jenkins for GitHub and Git (like Gitlab). Please refer to the cycle time setting in the previous step. In this sample, you can run the pipeline manually. If you need to set automatic scanning for remote branches and active the operation, please refer to Setting automatic scanning - GitHub SCM. 
> -->


Click **Create** when complete advanced settings.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107145528.png)

### Run the Pipeline

Refresh browser manually, then you can find two pipelines will be triggered automatically.

1. Click **Run** on the right. According to the **Behaviour Strategy**, it will load the branches which has jenkinsfile. Just keep the default branch `master`.

2. Since there is no default option for `TAG_NAME: defaultValue` in  Jenkinsfile-online, put in a tag number in the  `TAG_NAME` such as v0.0.1. Click **OK** to trigger a new pipeline.

> Note: TAG_NAME is used to generate release and images with tag in GitHub and DockerHub. Please notice that `TAG_NAME` should not duplicate the existing `tag` name in the code repository. If the repetition occurs the pipeline cannot run.  

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107230822.png)

At this point, the pipeline based on master branch is running.

> Note: Click **Branch** to switch to the branch list and review which branches are running pipeline. The branch here is determined by the **Behaviour Strategy.**


![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107232100.png)

### Review Pipeline

When the pipeline runs to the step of `input`
it will pause. You need to click **Continue** manually. Please note that there are three stages defined in the Jenkinsfile-online. Therefore, the pipeline will be reviewed three times in the three stages of `deploy to dev, push with tag, deploy to production`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108001020.png)

> Note: In real development or production scenario, it requires someone who has higher authority (e.g. release manager) to review the pipeline and the image, as well as the code analysis result. They have access to determine whether to approve push and deploy. In Jenkinsfile, the `input` step supports you to specifie who's user name to review the pipeline. If you want to specify a user named `project-admin` to review, you can add a field in the Jenkinsfile. If there are multiple users, you need to use commas to separate them as follows:


```groovy
···
input(id: 'release-image-with-tag', message: 'release image with tag?', submitter: 'project-admin,project-admin1')
···
```


## Check Pipeline Status

1. Click into **Activity → master → Task Status**, you can see the pipeline running status. Please note that the pipeline will keep initializing for several minutes when the creation just completed. There are 8 stages in the sample pipeline and they have been defined individually in [Jenkinsfile-online](https://github.com/kubesphere/devops-java-sample/blob/master/Jenkinsfile-online).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108002652.png)

2. Check the pipeline's running log by clicking `Show Logs` at the top right corner. The page shows dynamic logs outputs, operating status and time etc.

For each step, click specific stage on the left to inspect the log. The logs can be downloaded to local for further analysis.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108003016.png)


## Verify Pipeline Running Results


1. Once you successfully excuted the pipeline, click `Code Quality` to check the code quality check results through  sonarQube as the follows (reference only).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108003257.png)


2. The Docker image built by the pipeline has been successfully pushed to DockerHub, since We have defined `push to DockerHub` stage in Jenkinsfile-online. The pushed images can be seen from DockerHub. It can be seen that the tag of v0.0.1 (the tag we defined before running),  `SNAPSHOT-master-6`(SNAPSHOT-branch-serial number) and `latest` have been pushed to DockerHub.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108134653.png)

At the same time, a new tag and a new release have been generated in GitHub.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108133933.png)


The sample application will be deployed to `kubesphere-sample-dev` and `kubesphere-sample-prod` as  deployment and service.

| Environment | URL | Namespace | Deployment | Service |
| :--- | :--- | :--- | :--- | :--- |
| Dev | `http://{NodeIP}:{$30861}` | kubesphere-sample-dev | ks-sample-dev | ks-sample-dev |
| Production | `http://{$NodeIP}:{$30961}` | kubesphere-sample-prod | ks-sample | ks-sample |



3. Enter into these two projects, you can find the application's resources have been deployed to Kubernetes successully. For example, lets verify the Deployments and Services under project `kubesphere-sample-dev`:

**Deployments**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108135508.png)

**Services**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108135541.png)

## Visit Sample Service

1. You can switch to use `admin` account to open **web kubctl** from **Toolbox**. Enter into project `kubesphere-sample-dev`, select **Application Workloads → Services** and click into `ks-sample-dev` service.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200108140233.png)

2. Open **web kubctl** from **Toolbox**, try to access as following:


```
# Note: curl Endpoints or {$Virtual IP}:{$Port} or {$Node IP}:{$NodePort}
$ curl 10.233.90.9:8080
Really appreaciate your star, that's the power of our life.
```

3. Similarly, you can test the service in project `kubesphere-sample-pro`

```
# Note: curl Endpoints or {$Virtual IP}:{$Port} or {$Node IP}:{$NodePort}
$ curl 10.233.90.17:8080
Really appreaciate your star, that's the power of our life.
```


Configurations! You've been familiar with KubeSphere DevOps pipeline, you can continue to learn how to build CI/CD pipeline with a graphical panel and visualize your workflow in the next tutorial.
