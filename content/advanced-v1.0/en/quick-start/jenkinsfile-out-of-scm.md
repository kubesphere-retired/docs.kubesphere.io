---
title: "Create a CI/CD Pipeline In a Visual Way" 
---

## Objective

We have created a pipeline based on the Jenkinsfile in last tutorial, actually it requires the users be familiar with Jenkinsfile syntax. In this tutorial we will demonstrate how to create a pipeline in a friendly UI, and there is no need to write Jenkinsfile. 

## Prerequisites

- Make sure you have created [DockerHub](http://www.dockerhub.com/) account.
- Create a workspace and DevOps project, see the [Admin Quick Start](../admin-quick-start) if not yet.
- Be familiar with the basics of Dockerfile, see [Docker Documentation](https://docs.docker.com/engine/reference/builder/#usage).

## Estimated Time

About 30 minutes.

### Overview

The following flow chart briefly illustrates the process of entire 6 stages of this pipeline.

![Flow chart](/cicd-pipeline-02.svg)

> - Instructions
> - Stage 1 - Checkout SCM: Pull source code from GitHub.
> - Stage 2 - Get dependencies: Install all of the dependencies using [yarn](https://yarnpkg.com/zh-Hans/).
> - Stage 3 - Unit test: If the unit test passes, then it will continue to execute the following tasks.
> - Stage 4 - Build: Execute the build command to generate the static Web.
> - Stage 5 - Build and push snapshot image: Build an image based on the branch selected in the behavioral strategy, and push the image with tag `SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER` to DockerHub.
> - Stage 6 - Deploy to Dev: Deploy the master branch to the Dev environment, which needs to be reviewed.

For the convenience of demonstration, this document still uses the GitHub repository [devops-docs-sample](https://github.com/kubesphere/devops-docs-sample) as an example. 

### Create a Project

In this step, we'll create a pipeline to deploy the Docs web service to Dev environment, based on the [yaml](https://github.com/kubesphere/devops-docs-sample/tree/master/deploy/no-branch-dev) file. 

> Note: If you have already created the project `kubesphere-docs-dev` in the last tutorial, you can ignore and skip the following 3 steps.

1. Sign in with `project-regular`, click into **Workbench**, choose **Projects → Create** and select **Create a resource project**.

![Create a resource project](https://pek3b.qingstor.com/kubesphere-docs/png/20190326165930.png)

2. Fill in the basic information, name this project as `kubesphere-docs-dev`, others can be customized by yourself. 

![Fill in the basic information](https://pek3b.qingstor.com/kubesphere-docs/png/20190326170053.png)

3. Click **Next**, keep default values in **Advanced Settings** for this demo, then select **Create**.

Project `kubesphere-docs-dev` has been created successfully which represents the Dev environment.

![Created successfully](https://pek3b.qingstor.com/kubesphere-docs/png/20190326195734.png)

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

![Dockerhub Credential](/dockerhub-credential-en.png)

#### Step 2: Create a Kubeconfig Credential

Same as above, click **Create Credentials** to create a credential for `kubeconfig`, name Credential ID as **demo-kubeconfig**, then click **OK** when you're done.

At this point, we have created 2 credentials totally. 

![Credentials list](/credential-list-demo7-en.png) 

### Create a Pipeline

#### Step 1: Basic Information

1. Redirect to **Pipelines** and click **Create**.

![Create a Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20190326200309.png)

2. Fill in the basic information, e.g. `jenkinsfile-out-of-SCM`, then click **Next**.

![Basic information](https://pek3b.qingstor.com/kubesphere-docs/png/20190326200535.png)

#### Step 2: Advanced Settings

1. Check **Discard old branch**, enter 1 in **Days to keep old items**, then enter 3 in **Max period of old items to keep**. Note that this value could be set according to your team's habbit.

![Discard old branch](https://pek3b.qingstor.com/kubesphere-docs/png/20190326200930.png)

2. Click **Add parameter** to add 2 string parameters in this step, they will be used in pipeline later.

|Parameter Category|Name|Default Value|Description|
|---|---|---|---|
|String|DOCKERHUB_NAMESPACE|enter your DockerHub account <br>(It can also be the organization name)|DockerHub Namespace|
|String|APP_NAME|enter `devops-docs-sample`|Application Name|

![Add parameter](https://pek3b.qingstor.com/kubesphere-docs/png/20190326201714.png)


3. Enter `H H * * *` into **Schedule**, which means it will trigger build once a day (no specific time limit). Click **OK** when you're done.

> Note: Timing build is similar to Linux Cron, for syntax details you can see [Jenkins Documentation](https://jenkins.io/doc/book/pipeline/syntax/#cron-syntax).

![Timing build](/advanced-setting-schedule-en.png)

### Create a Pipeline in a visual way

This pipeline includes 6 stages totally, we are going to instruct what steps and tasks within each stage. Firstly we are going to set **Type** and **label** within **Agent**.

- Type: choose `node`.
- label: enter `nodejs`.

![Agent](/agent-settings.png)

#### Stage 1: Checkout SCM

1. Click "+" button to add the first stage, then click **No name** in this stage, name it as **checkout SCM**.

![Create stage1](/pipeline_agent-en.png)

2. Click `Add step`, then choose `git` and enter the URL of sample repository: `https://github.com/kubesphere/devops-docs-sample.git`, click **OK** to finish the first stage.

![Fill SCM address](/git-info-en.png)


#### Stage 2: Get Dependencies

From Stage 2 to Stage 5, actually we need to point these 4 stages into nodejs containers to run the shell scripts in sequence.

1. Click `+` button to add the second stage which is used to get dependencies, thus we can enter **get dependencies** as its name. Then click `Add Step`.

![Get Dependencies](/get-dependencies-en.png)

2. Choose container and name it as `nodejs`, then click **OK**.

![Add container](/add-container-en.png)

3. Click `Add nesting steps` under the nodejs container, and choose `shell` which is used to execute shell command, then enter `yarn` into the popup command window.

![Add nesting steps](/pipeline-shell-en.png) 

#### Stage 3: Unit Test

1. Same as above, click `+` to create the third stage, name it as `unit test`.

![Add stage3](/add-stage3.png)

2. Click `Add step` in stage `unit test` and choose `container`, name it as `nodejs` then click `OK`.

3. Click `Add nesting stage` and choose `shell`, input `yarn test` for unit test in popup window. Click `OK` when you're done.

![Unit Test](/yarn-test-en.png) 

#### Stage 4: Build

1. Same as above, click `+` to create the forth stage which is used to build a web in this container, name it `build`.

![stage4](/stage4-build-en.png)

2. Click `Add step` in stage `build` and choose `container`, name it `nodejs` then click `OK`.

3. Click `Add nesting steps` and select `shell`, then you can input `yarn build`, then click `OK`.

![创建发布包](/pipeline-build-en.png)

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

5. Note that we are going to create two nesting steps into `withCredentials`, both of them are used to run shell scripts. Click `Add nesting steps` within `withCredentials`, then enter following scripts:

```bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
```

![Add nesting steps](/demo7-stage5-en.png)

6. Same as above, click `Add nesting steps` again within `withCredentials`, and the second docker command as following:

```bash
docker push docker.io/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-CRON-BUILD-$BUILD_NUMBER
```

![Add nesting step](/demo7-stage6-step2-en.png)

At this point, we have created 5 stages totally. Next we are going to add a stage to deploy to KubeSphere.

![Push snapshot](/build-push-snapshot-en.png) 

#### Stage 6: Deploy to Dev

1. Click `+` button to add a new stage also the last stage as well. 

2. Click `Add Step` and choose `input` at right sidebar which is used to manual check. Reference the following information:

- id: enter `deploy-to-dev`
- Message: enter `Deploy to dev?`
- Submitter: you can choose and enter `project-admin` to review and approve this pipeline.

![Review the pipeline](/deploy-to-dev-info-en.png)

3. Click `Add Step` in current stage and choose `kubernetesDeploy`, then reference below to fill in the blanks within the popup window:

- Kubeconfig: select `demo-kubeconfig` that we created before.
- Config Files: enter `deploy/no-branch-dev/**`.

Click **OK** to save it.

![Add kubernetesDeploy](/Kubernetes-deploy-info-en.png)

At this point, we have create 6 stages totally, then click **Confirm** and choose **Save** at the right bottom of this page.

![Save pipeline](/overall-stages.png)

### Run the Pipeline

1. Click **Run** to trigger this pipeline manually, then leave the default values and choose **OK** in the popup window.

![run_pipeline](/pipeline_running-en.png)

2. Thus we can see it was triggered and shows running status.

![run_status](/pipeline_status-en.png)

3. Click into the pipeline under `Activity` list to inspect the task status of each stage.

![Activity list](/pipeline-status-inspect.png)

4. Log out KubeSphere, and sigh in with `project-admin`, then enter into `Jenkinsfile-out-of-SCM`. 

5. Once the pipeline runs to `Deploy to dev`, it requires `project-admin` to review and proceed to run. Click `Proceed` in `Deploy to dev` stage.

![Proceed to run](/pipeline-status-inspect-proceed.png)

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

![View DockerHub](/deveops-dockerhub-en.png)

3. As the Docs web service is exposed outside, if you want to access the service, you might need to bind the EIP and configure port forwarding. If the EIP has a firewall, add the corresponding port (e.g. 30860) to the firewall rules to ensure that the external network traffic can pass through these ports. In that case, external access is available.

### Access the service

Accessing the Docs service of Dev and Production environment:

**Dev Environment**

Enter `http://EIP:30860/` in your browser to preview the service.

![](/docs-home-dev-preview-en.png)

At this point, we have successfully created a pipeline in friendly UI, it's recommeded you to follow with the next tutorial.

