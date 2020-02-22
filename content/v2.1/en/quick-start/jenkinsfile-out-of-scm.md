---
title: "Jenkinsfile-free CI/CD pipeline with graphical editing panel"
keywords: 'kubernetes, docker, helm, jenkins, cicd, graphical pipeline'
description: 'Create a Jenkinsfile-free CI/CD pipeline with graphical editing panel'
---

We've demonstrated how to create a Jenkinsfile-based pipeline for Spring Boot Project in the last tutorial, it requires users are familiar with Jenkinsfile. Unlike the last tutorial, Jenkinsfile-free CI/CD pipeline allows users to create a CI/CD workflow with graphical editing panel, which means you don't need to write Jenkinsfile in this tutorial. KubeSphere delivers complete visibility to simplify user interaction for creating pipelines.


## Objective

We will use the graphical editing panel to create a pipeline, automating some processes and release the sample project to Kubernetes development environment, namely, Namespace. If you've tried the Jenkinsfile-based pipeline, the build steps for this tutorial are well understood. The sample project in this tutorial is similar to the [Sample project](https://github.com/kubesphere/devops-java-sample) that we used in the [last guide](../devops-online).

## Prerequisites

- You need to [enable KubeSphere DevOps System](../../installation/install-devops).
- You need to create [DockerHub](http://www.dockerhub.com/) account.
- You need to create a workspace, a DevOps project, and a **project-regular** user account, and this account needs to be invited into a DevOps project, please refer to [Get started with multi-tenant management](../admin-quick-start).
- Configure email server for notification in pipeline, please refer to Jenkins email configuration.
- Set CI dedicated node for building pipeline, please refer to [Set CI Node for Dependency Cache](../../devops/devops-ci-node)

## Hands-on Lab

### Pipeline Overview

The sample pipeline includes the following six stages.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190516091714.png#align=left&display=inline&height=1278&originHeight=1278&originWidth=2190&search=&status=done&width=2190)

> To elaborate every stage：
> - **Stage 1. Checkout SCM:** Pull the GitHub repository code；
> - **Stage 2. Unit test**: Unit test; The pipeline will continue running the next stage only if the unit test is passed；
> - **Stage 3. Code Analysis**: Configure SonarQube for static code quality check and analysis；
> - **Stage 4. Build and Push**: Build the image and push the it to DockerHub with tag `snapshot-$BUILD_NUMBER` (where `$BUILD_NUMBER` is the serial number of the pipeline active list)；
> - **Stage 5. Artifacts**: Generate the artifact (jar package) and save it；
> - **Stage 6. Deploy to DEV**: Deploy the project to the Dev environment, it requires an audit in this stage, an email will be sent until the deployment is successful.

### Create Project

The sample pipeline will deploy the [Sample project](https://github.com/kubesphere/devops-java-sample) to Kubernetes Namespace, thus we need to create a project in KubeSphere. Please refer to the [last tutorial](../devops-online/#create) to create a project named `kubesphere-sample-dev` by using `project-admin`, then invite the account `project-regular` into this project and assign the role of `operator` to this account.


### Create Credentials

We need to create `three` Credentials for DockerHub, Kubernetes and SonarQube respectively.

1. Log in KubeSphere with `project-regular` account please refer to [Create Credentials](../../devops/credential) for DockerHub and Kubernetes (KubeConfig), input name as `dockerhub-id` and `demo-kubeconfig` respectively.

2. Create a Java token and copy it, please refer to [Access SonarQube](../../devops/sonarqube).

3. Enter devops-demo's project in KubeSphere. Similarly, click **Create** in the Credential, name the credential ID as `sonar-token`, choose `secret_text` as its type, paste the SonarQube token that we copied from the previous step, then click Confirm.

At this point, the three credentials have been created, which will be used in the pipeline.

![Create Credentials](https://pek3b.qingstor.com/kubesphere-docs/png/20200221223754.png)

### Create Pipeline

Follow with the steps below to create a pipeline using graphical editing panel.

#### Step 1: Fill in the basic information

1. In the DevOps project, select the **Pipeline** on the left and click **Create**.

![Create Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20200221225029.png)

2. In the pop-up window, name it `graphical-pipeline`, click **Next**.


#### Step 2: Advanced Settings

1. Click **Add Parameter** to add **3** string parameters as follows. These parameters will be used in the docker command of the pipeline. Click **OK** when you've done.

| Parameter Type | Name | Default Value | Description |
| --- | --- | --- | --- |
| String  | REGISTRY | The sample repository address is  docker.io. | Image Registry |
| String  | DOCKERHUB_NAMESPACE | Fill in your  DockerHub account (which can also be the Organization name under the account). | DockerHub Namespace |
| String parameter | APP_NAME | Fill the application name with `devops-sample`. | Application Name |


![Advanced Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20200222155944.png)

### Editing pipeline

This pipeline consists of six stages, we will demonstrate steps and tasks in each stage.

#### Stage 1: Pull Source Code (Checkout SCM)

The graphical editing panel includes two sections which are architecture and plugin editing part. It can generate jenkinsfile after creating a pipeline in the panel, which is much user-friendly for developers.

> Note: Pipeline includes `scripted pipeline` and `declairative pipeline`, the panel supports `declairative pipeline`. For Pipeline syntax, see [Jenkins Documentation](https://jenkins.io/doc/book/pipeline/syntax/).

1. As follows，select `node` in the agent type, input `maven` in the label.

> Note: The agent is used to define execution environment. The agent directive tells Jenkins where and how to execute the Pipeline, or subset thereof, please refer to [Jenkins Agent](https://jenkins.io/doc/pipeline/tour/agents/) for further information.

2. In the graphical panel, click the **+** button on the left to add a stage. Click the **Add Step**, name it **Checkout SCM** on the right input box.

![Checkout SCM](https://pek3b.qingstor.com/kubesphere-docs/png/20200221234417.png)

3. Then click `Add Step` at this stage. Select `git` on the right. For now, fill in the pop-up window as follows:

- Url: Input GitHub repository URL `https://github.com/kubesphere/devops-java-sample.git`
- Credential ID: Leave it as blank (This box is for using a private repository)
- Branch: Leave it as blank, blank is default to master.

When you have done, click **OK** to save itm and you will see the first stage .

![GitHub repository](https://pek3b.qingstor.com/kubesphere-docs/png/20200221234935.png)

#### Stage 2: Unit Test

1. Click **+** on the right of the **Checkout SCM** to add one stage for performing a unit test in the container, name it `Unit Test`.

![Unit Test](https://pek3b.qingstor.com/kubesphere-docs/png/20200221235115.png)

2. Click **Add Step** and select **container** on the right, name it `maven`, then click **OK**.

![maven](https://pek3b.qingstor.com/kubesphere-docs/png/20200221235323.png)

3. Click **Add nesting steps** in the `maven` container. Then select `shell` and enter the following command in the pop-up window:

```shell
mvn clean -o -gs `pwd`/configuration/settings.xml test
```

Then click OK to save it.

![maven container](https://pek3b.qingstor.com/kubesphere-docs/png/20200221235629.png)

#### Stage 3: Code Analysis

1. Same as above, click **+** on the right of the stage `Unit Test` to continue adding a stage for configuring SonarQube, which is used to perform static code quality analysis in the container, name it `Code Analysis`.

![Code Analysis](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000007.png)

2. Click **Add Step** in `Code Analysis`, and select `container`，name it `maven`，then click **OK**.

![Code Analysis](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000204.png)

3. Click **Add nesting steps** on the right and select `withCredentials`, Select the previously created credential ID `sonar-token` and input `SONAR_TOKEN` in the text variable, then click **OK**.

![withCredentials](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000531.png)

4. In the task `withCredential` on the right, click **Add nesting steps** (the first one)，then select `withSonarQubeEnv`, leave the default name `sonar`, click **OK** to save it.

![Code Analysis](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000743.png)

![withSonarQubeEnv](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000936.png)

5. Click **Add nesting steps** (the first one) in the `withSonarQubeEnv`. Then select `Shell` on the right, enter the following commands in the pop-up window for SonarQube branch and authentication, and click **OK** to save the information.

```shell
mvn sonar:sonar -o -gs `pwd`/configuration/settings.xml -Dsonar.branch=$BRANCH_NAME -Dsonar.login=$SONAR_TOKEN
```

![SonarQube branch](https://pek3b.qingstor.com/kubesphere-docs/png/20200222161853.png)

6. Click on the **Add nesting steps** (the third one) on the right, select **timeout**. Input `1` to time, and select `Hours` in unit.

Click **OK** to save it.

![SonarQube timeout](https://pek3b.qingstor.com/kubesphere-docs/png/20200222001544.png)

7. In the `timeout`, click **Add nesting steps** (the first one). Then select `waitforSonarQubeGate` and keep the default `Start the follow-up task after inspection` in the popup window.

Click **OK** to save it.

![waitforSonarQubeGate](https://pek3b.qingstor.com/kubesphere-docs/png/20200222001847.png)

#### Stage 4: Build and Push the Image

1. Similarly, click **+** on the right of the stage of `Code Analysis` to add another stage to build and push images to DockerHub, name it `Build and Push`.

2. Click **Add Step** and select **container**，name it `maven`，then click **OK**.

![maven container](https://pek3b.qingstor.com/kubesphere-docs/png/20200222112517.png)

3. Click **Add nesting steps** in the contain `maven`, and select **Shell** on the right, enter the following command in the pop-up window:

```shell
mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package
```

4. Then continue to click **Add nesting steps** on the right, select `Shell` in the pop-up window, enter the following command to build a Docker image based on the [Dockerfile](https://github.com/kubesphere/devops-java-sample/blob/master/Dockerfile-online):

```shell
docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER .
```

![Build Docker image](https://pek3b.qingstor.com/kubesphere-docs/png/20200222113131.png)

Click **OK** to save it.

5. Similarly, click `Add nesting steps` again and select `withCredentials` on the right. Fill in the pop-up window as follows:

> Note: Considering the security, the account information are not allowed to be exposed in plaintext in the script.

- Credential ID：Select the DockerHub credentials you created, e.g. `dockerhub-id`
- Password variable：Enter `DOCKER_PASSWORD`
- Username variable：Enter `DOCKER_USERNAME`

Click **OK** to save the it.

![DockerHub credentials](https://pek3b.qingstor.com/kubesphere-docs/png/20200222113442.png)

6. Click `Add nesting steps` (the first one) in the `withCredentials` stage, select `Shell` on the right, enter the following command in the pop-up window, which is used to log in Docker Hub:

```shell
echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
```

Click **OK** to save the it.

![docker login](https://pek3b.qingstor.com/kubesphere-docs/png/20200222114937.png)

7. As above, click **Add nesting steps** in the `withCredentials`, choose `Shell` and enter the following command to push the SNAPSHOT image to DockerHub:

```shell
docker push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
```

![docker push](https://pek3b.qingstor.com/kubesphere-docs/png/20200222120214.png)

#### Stage 5: Generate Artifact

1. Click **+** on the right of the `Build and Push` stage, here we add another stage to save artifacts. This example uses the jar package and name it `Artifacts`.

![Save Artifacts](https://pek3b.qingstor.com/kubesphere-docs/png/20200222120540.png)

2. Click `Add Step` in `Artifacts` stage, select `archiveArtifacts`. Enter `target/*.jar` in the pop-up window, which is used to set the archive path of artifact in Jenkins.

Click **OK** to save the it.

![Artifacts](https://pek3b.qingstor.com/kubesphere-docs/png/20200222121035.png)

#### Stage 6: Deploy to Dev

1. Click **+** on the right of the stage `Artifacts` to add the last stage, name it `Deploy to Dev`. This stage is used to deploy resources to development environment, namely, the project of `kubesphere-sample-dev`.

2. Click **Add Step** in `Deploy to Dev`, select `input` and enter `@project-admin` in the pop-up window, assigning account `project-admin` to review this pipeline.

Click **OK** to save the it.

3. Click **Add Step**，select `kubernetesDeploy`. Fill in the pop-up window as below and click "Confirm" to save the information:


- Kubeconfig: select `demo-kubeconfig`
- Configuration file path: Enter `deploy/no-branch-dev/**` which is the related path of the Kubernetes [yaml](https://github.com/kubesphere/devops-java-sample/tree/master/deploy/no-branch-dev). 

Click **OK** to save the it.

![Deploy to Kubernetes](https://pek3b.qingstor.com/kubesphere-docs/png/20200222153404.png)

4. Similarly, click `Add Step` to send an email notification to the user after the pipeline runs successfully, select `mail` and fill in the information.

> Note: Make sure you've configured email server in `ks-jenkins`, please refer to Jenkins email configuration. If not yet, skip this step and run this pipeline are well.


At this point, the total six stages of the pipeline have been edited completely, click `Confirm → Save`, it will generate  Jenkinsfile as well.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222154407.png)

### Run Pipeline

1. The pipeline created by the graphical editing panel needs to be manually ran. Click `Run`, you can see the three string parameters that we defined in the previous steps. Click `OK` to start this pipeline.

![Run Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20200222160330.png)

2. You can see the status of the pipeline in the **Activity** list，click `Activity` to view the specific running status.

3. Enter the first activity to view detailed page.

![View detailed page](https://pek3b.qingstor.com/kubesphere-docs/png/20200222163341.png)

> Note: If the previous steps are running correctly, you can see that the pipeline has successfully run to the last stage in a few minutes. Since we set the review step and specify the account `project-admin` as the reviewer. Therefore, we need to switch using `project-admin` to manually review and approve it.

4. Log out, and log in with account `project-admin`. Enter into the pipeline `graphical-pipeline` of the DevOps project that we used above. Drill into `Activity` to view the running status. You can see the pipeline has run to the `Deploy to DEV` stage. Click `Proceed` to approve its run.

![Activity](https://pek3b.qingstor.com/kubesphere-docs/png/20200222170334.png)

### View Pipeline

1. After a few minutes, the pipeline runs successfully. Click `Activity` list in the pipeline to view the current running pipeline serial number, this page shows the running status of each stage in the pipeline.

![View Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20200222182230.png)

2. Click `Show Logs` on the top right of the current page to inspect the log. The pop-up window shows the specific logs, running status and time of each stage. Click on a specific stage and expand its specific log on the right. If an error occurs, the problems can be analyzed according to the logs output. The log can be downloaded to the local.

![Show Logs](https://pek3b.qingstor.com/kubesphere-docs/png/20200222171027.png)

### Check Code Quality

Back to the **Activity** page, click `Code quality` to check the analysis of the code quality for the demo project, which is provided by the SonarQube. The sample code is simple and does not show bugs or vulnerabilities. Click on the SonarQube icon on the right to access SonarQube, please refer to [Access SonarQube](../../installation/sonarqube-jenkins) to log in.

![Check Code Quality](https://pek3b.qingstor.com/kubesphere-docs/png/20200222171426.png)

**View the quality report at SonarQube**

![Quality report](https://pek3b.qingstor.com/kubesphere-docs/png/20200222171539.png)

### Download Articraft

Enter the first activity and select `Articrafts`, you can find the articraft of jar package generated by the pipeline, you can download it.

![Download Articraft](https://pek3b.qingstor.com/kubesphere-docs/png/20200222172157.png)

### Verify the Kubernetes Resource

If every stage of the pipeline runs successfully, the Docker image will be automatically built and pushed to your DockerHub account. Since we have created credential for DockerHub, you can log in DockerHub to verify it. Finally, the project is deployed to the Kubernetes with a deployment and service by using graphical editing pipeline.

1. Log out, and log in KubeSphere with account `project-regular`, enter the project `kubesphere-sample-dev`, click **Application Workloads → Workloads** to see that `ks-sample-dev` has been created successfully.

| Environment | Address | Namespace | Deployment | Service |
| --- | --- | --- | --- | --- |
| Dev | `http://{$Virtual IP}:{$8080}` or `http://{$Intranet/Public IP}:{$30861}` | kubesphere-sample-dev | ks-sample-dev | ks-sample-dev |

**View Deployment**

![View Deployment](https://pek3b.qingstor.com/kubesphere-docs/png/20200222173254.png)

2. Navigate to **Service** list, you can find the corresponding service has been created. The NodePort exposed by the service is`30861`.

**View Service**

![View Service](https://pek3b.qingstor.com/kubesphere-docs/png/20200222173213.png)

3. Then verify the images pushed to DockerHub, you can see that `devops-sample` is the value of **APP_NAME**, while the tag is the value of `SNAPSHOT-$BUILD_NUMBER` (`$BUILD_NUMBER` is the serial number of the activity within pipeline). This tag has also been used in deployment `ks-sample-dev`.

![View DockerHub](https://pek3b.qingstor.com/kubesphere-docs/png/20200222173907.png)

![View DockerHub](https://pek3b.qingstor.com/kubesphere-docs/png/20200222173802.png)

4. Since we set an email notification in the pipeline, thus we can verify the email in the mailbox.

![Email notification](https://pek3b.qingstor.com/kubesphere-docs/png/20200222173444.png)

### Access the Sample Service

We can access the sample service using command or access in browser. For example, you can use the web kubectl by using account `admin` as follows:

```shell
# curl {$Virtual IP}:{$Port} or curl {$Node IP}:{$NodePort}
curl 10.233.4.154:8080
Really appreciate your star, that's the power of our life.
```

Congratulation! You've been familiar with using graphical editing panel to visualize your CI/CD workflow.
