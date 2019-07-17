---
title: "Create a CI/CD Pipeline Based on Jenkinsfile" 
keywords: ''
description: ''
---

## Objective

In this tutorial, it will demonstrate how to setup a CI/CD pipeline in KubeSphere using an example GitHub repository, it includes 8 stages and will deploy a Documentation web service to Dev and Production environment respectively. 

## Prerequisites

- Make sure you have created your personal [GitHub](https://github.com/) and [DockerHub](http://www.dockerhub.com/) account.
- Create a workspace and DevOps project, see the [Admin Quick Start](../admin-quick-start) if not yet.
- Be familiar with the basics of Git and version control.

## Estimated Time

About 30 - 50 minutes.

### Overview

The following flow chart briefly illustrates the process of the entire pipeline.

![Flow chart](/cicd-pipeline-01.svg)

> - Instructions
> - Stage 1 - Checkout SCM: Pull source code from GitHub.
> - Stage 2 - Get dependencies: install all of the dependencies via [yarn](https://yarnpkg.com/zh-Hans/).
> - Stage 3 - Unit test: If the unit test passes, then continue the following tasks.
> - Stage 4 - Build and push snapshot image: Build an image based on the branch selected in the behavioral strategy, and push the image with tag `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` to DockerHub.
> - Stage 5 - Push the latest image: Put the tag of master branch as "latest" and push it to DockerHub.
> - Stage 6 - Deploy to Dev: Deploy the master branch to the Dev environment, which needs to be reviewed.
> - Stage 7 - Push with tag: Generate the tag and release to GitHub and DockerHub.
> - Stage 8 - Deploy to production: Deploy the published package to the Production environment.

For the convenience of demonstration, this document uses the GitHub repository [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) as an example. You can fork it into your GitHub and modify the environment variables to actual parameters.

### Create Credentials

Sign in with `project-regular`, enter into `devops-demo`, we are going to create 3 credentials totally.


#### Step 1: Create a DockerHub Credential

1. Choose **Credentials** and click **Create credentials**.

![Create a Credential](https://pek3b.qingstor.com/kubesphere-docs/png/20190326174548.png)

2. Fill in the basic information for DockerHub Credential.


- Credential ID: enter **dockerhub-id**
- Type: Account Credentials 
- Username: Your personal username for DockerHub
- Token/password: Your personal password for DockerHub
- Description: DockerHub Credential

Click **OK** when you're done.

![Dockerhub credential](/dockerhub-credential-en.png)

#### Step 2: Create a GitHub Credential

Same as above, create a credential for GitHub, then fill in the basic information, Credential ID is named **github-id**, other blanks according to your personal GitHub information.

#### Step 3: Create a Kubeconfig Credential

Same as above, click **Create Credentials** to create a credential for `kubeconfig`, name Credential ID as **demo-kubeconfig**, then click **OK** when you're done.

At this point, we have created 3 credentials totally. 

![Credential list](/credential-list-demo-en.png) 

The next step is to modify the corresponding 3 credential IDs to above 3 ones in jenkinsfile.

### Modify the Jenkinsfile

#### Step 1: Fork Project

Fork the repository [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) to your GitHub.

![Fork project](/fork-repo-en.png)

#### Step 2: Modify the Jenkinsfile

1. Enter into `Jenkinsfile` in the root directory.

![Inspect Jenkinsfile](/jenkinsfile-location.png)

2. Click `edit` icon to edit Jenkinsfile, then modify values to yours in "environment".

![Modify Jenkinsfile](/modify-jenkinsfile-en.png)

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

![Commit changes](/commit-jenkinsfile-en.png)

### Create Two Projects

Pipeline will deploy the Docs web service to both Dev and Production environment according to the [yaml](https://github.com/kubesphere/devops-docs-sample/tree/master/deploy) file, thus we are going to create 2 projects (i.e. `kubesphere-docs-dev` and `kubesphere-docs-prod`) as the Dev and Production environment respectively.

#### Step 1: Basic Information

1. Redirect to the **Workbench**, choose **Projects → Create** and select **Create a resource project**.

![Create a resource project](https://pek3b.qingstor.com/kubesphere-docs/png/20190326165930.png)

2. Fill in the basic information, name this project as `kubesphere-docs-dev`, others can be customized by yourself. 

![Fill in the basic information](https://pek3b.qingstor.com/kubesphere-docs/png/20190326170053.png)

3. Click **Next**, keep default values in **Advanced Settings** for this demo, then select **Create**.

The first project `kubesphere-docs-dev` has been created successfully which represents the Dev environment.

#### Step 2: Create the Second Project

Same as above, create the second project `kubesphere-docs-prod` as the Production environment, you can reference above step 1 to create this project.

At this point, we have created two projects as the Dev and Production environment, thus the pipeline will deploy the web service and deployment to Dev and Production in sequence.

![Create the Second Project](https://pek3b.qingstor.com/kubesphere-docs/png/20190326170324.png)

### Create a Pipeline

#### Step 1: Basic Information

1. Redirect to **Workbench**, then select **DevOps Projects** tab and enter **demo-devops** that we created in the [Admin Quick Start](../admin-quick-start).

2. Click on **Create** button.

![Create a Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20190326170534.png)

3. Fill in the basic information, e.g. `jenkinsfile-in-SCM`. Then click the **Code Repository (Optional)** to add GitHub repo.

![Fill in the basic information](https://pek3b.qingstor.com/kubesphere-docs/png/20190326170710.png)

#### Step 2: Add a Repository

1. Click **get token** to create a new personal access token for your GitHub account.

![Get token](https://pek3b.qingstor.com/kubesphere-docs/png/20190326170859.png)

2. Enter any description into **Token description** in GitHub page, e.g. `DevOps demo`. Leave the default selections in **Select scopes**, then click `Generate token`, you will see a new access token generated by GitHub which is used to authentication.

3. Copy your access token and switch to KubeSphere, paste it into **Token** and choose **Confirm**.

4. In this step you will see all of the repositories under your personal account,  then click **Select this repo** to choose the [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) which already has its own Jenkinsfile in the root of this repository.

![Select this repo](https://pek3b.qingstor.com/kubesphere-docs/png/20190326171149.png)

5. Click **Next** when you've completed basic information.

#### Step 3: Advanced Settings

1. Check **Discard old branch** and leave the default value (-1) in **Days to keep old items** and **Max period of old items to keep**.

![Discard old branch](https://pek3b.qingstor.com/kubesphere-docs/png/20190326171416.png)

2. As for **Behavioral strategy**, choose the following option:


- Discover Branches: choose `Exclude branches that are also filed as PRs`.
- Discover PR from the original repo: choose `Source code version of PR itself`.
- Discover PR from Forks: click `delete` icon since this example will not use this strategy.

![Behavioral strategy](https://pek3b.qingstor.com/kubesphere-docs/png/20190326173022.png)

3. Leave the default value in **Script Path** since the Jenkinsfile location is in the root folder.

4. Choose **Scan interval** as `5 minutes` in **Scan Repo Trigger**, then click **Create**.

![Scan Repo Trigger](https://pek3b.qingstor.com/kubesphere-docs/png/20190326173122.png)

#### Step 4: Run the Pipeline

1. Refresh your browser then you will be able to see there is a pipeline in **Running** status, which is triggered automatically.

![Run the Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20190326173307.png)

2. Click **Run** button, then leave the default branch (master) and input a version number in **TAG_NAME** (e.g. v0.0.1). Note that this tag is used to generate release and image in GitHub and DockerHub respectively.

![Input a version number](https://pek3b.qingstor.com/kubesphere-docs/png/20190326175936.png)

3. Choose **OK**, you will see it generates a new pipeline in activity list.

At this point, this pipeline has already been triggered and showing running. 


#### Step 5: Review the Pipeline

Enter into this pipeline that we ran it manually, then watch its running status. 

It will be paused when it runs to `deploy to dev` stage, thus you could choose `Proceed` in this stage. For the convenience, we will use project-regular to review directly.

Accordingly, the last 3 stages including `deploy to dev`, `push with tag`, `deploy to production` require review 3 times in sequence. Note that it will not continue to run unless you click **Proceed** button.

![Review the Pipeline](/devops_input-en.png)

> Note: If you would like to point someone like project-admin to review, you can specify the name in Jenkinsfile as following:

```groovy
···
input(id: 'release-image-with-tag', message: 'release image with tag?', submitter: 'project-admin')
···
```


### View the Pipeline

1. Click into the pipeline under the activity list to inspect the running status and build progress in a visual way. Note that it might only display a log output page since it's still in the initialization phase, once the initialization finished it will direct to the visual page.

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

![View DockerHub](/deveops-dockerhub.png)

3. Redirect to tour GitHub, you can verify the release result.

![Verify release](/demo6-view-releases.png)

![Verify release](/verify-github-release.png)

4. As the Docs web service is exposed outside, if you want to access the service, you might need to bind the EIP and configure port forwarding. Then add the corresponding port (e.g. 30860 and 30960) to the firewall rules to ensure that the external network traffic can pass through these ports. In that case, external access will be available.

### Access the service

Accessing the Docs service of Dev and Production environment:

**Dev Environment**

Enter `http://EIP:30860/` in your browser to preview the service.

![preview the service dev](/docs-home-dev-preview-en.png)

**Production Environment**

Enter `http://EIP:30960/` in your browser to preview the service.

![preview the service production](/docs-home-production-preview-en.png) 


At this point, we have successfully created a pipeline based on the Jenkinsfile in the repository, it's recommeded you to follow with the next tutorial.