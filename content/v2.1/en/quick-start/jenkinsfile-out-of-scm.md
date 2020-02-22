---
title: "Jenkinsfile-free CI/CD pipeline with graphical editing panel"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Create a Jenkinsfile-free CI/CD pipeline with graphical editing panel'
---

We've demonstrated how to create a Jenkinsfile-based pipeline for Spring Boot Project in the last tutorial, it requires users are familiar with Jenkinsfile. Unlike the last tutorial, Jenkinsfile-free CI/CD pipeline allows users to create a CI/CD workflow with graphical editing panel, which means you don't need to write Jenkinsfile in this tutorial. KubeSphere delivers complete visibility to simplify user interaction for creating pipelines.


## Objective

This guide is similar to the [Sample project](https://github.com/kubesphere/devops-java-sample) that we used in the last tutorial, we will use the graphical editing panel to create a pipeline, automating some processes and release the sample project to Kubernetes development environment, namely, Namespace. If you've tried the Jenkinsfile-based pipeline, the build steps for this tutorial are well understood.

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

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221223754.png)

### Create Pipeline

Follow with the steps below to create a pipeline using graphical editing panel.

#### Step 1: Fill in the basic information

1. In the DevOps project, select the **Pipeline** on the left and click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221225029.png)

2. In the pop-up window, name it `graphical-pipeline`, click **Next**.


#### Step 2: Advanced Settings

1. Click **Add Parameter** to add **3** string parameters as follows. These parameters will be used in the docker command of the pipeline. Click **OK** when you've done.

| Parameter Type | Name | Default Value | Description |
| --- | --- | --- | --- |
| String  | REGISTRY | The sample repository address is  docker.io. | Image Registry |
| String  | DOCKERHUB_NAMESPACE | Fill in your  DockerHub account (which can also be the Organization name under the account). | DockerHub Namespace |
| String parameter | APP_NAME | Fill the application name with `devops-sample`. | Application Name |


![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221231907.png)

### Visual editing pipeline

This pipeline consists of six stages, we will demonstrate steps and tasks in each stage.

#### Stage 1: Pull Source Code (Checkout SCM)

The graphical editing panel includes two sections which are architecture and plugin editing part. It can generate jenkinsfile after creating a pipeline in the panel, which is much user-friendly for developers.

> Note: Pipeline includes `scripted pipeline` and `declairative pipeline`, the panal supports `declairative pipeline`. For Pipeline syntax, see [Jenkins Documentation](https://jenkins.io/doc/book/pipeline/syntax/).

1. As follows，select `node` in the agent type, input `maven` in the label.

> Note: The agent is used to define execution environment. The agent directive tells Jenkins where and how to execute the Pipeline, or subset thereof, please refer to [Jenkins Agent](https://jenkins.io/doc/pipeline/tour/agents/) for further information.

2. In the graphical panel, click the **+** button on the left to add a stage. Click the **Add Step**, name it **Checkout SCM** on the right input box.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221234417.png)

3. Then click `Add Step` at this stage. Select `git` on the right. For now, fill in the pop-up window as follows:

- Url: Input GitHub repository URL `https://github.com/kubesphere/devops-java-sample.git`
- Credential ID: Leave it as blank (This box is for using a private repository)
- Branch: Leave it as blank, blank is default to master.

When you have done, click **OK** to save itm and you will see the first stage .

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221234935.png)

#### Stage 2: Unit Test

1. Click **+** on the right of the **Checkout SCM** to add one stage for performing a unit test in the container, name it `Unit Test`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221235115.png)

2. Click **Add Step** and select **container** on the right, name it `maven`, then click **OK**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221235323.png)

3. Click **Add nesting steps** in the `maven` container. Then select `shell` and enter the following command in the pop-up window:

```shell
mvn clean -o -gs `pwd`/configuration/settings.xml test
```

Then click OK to save it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200221235629.png)

#### Stage 3: Code Analysis

1. Same as above, click **+** on the right of the stage `Unit Test` to continue adding a stage for configuring SonarQube, which is used to perform static code quality analysis in the container, name it `Code Analysis`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000007.png)

2. Click **Add Step** in `Code Analysis`, and select `container`，name it `maven`，then click **OK**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000204.png)

3. Click **Add nesting steps** on the right and select `withCredentials`, Select the previously created credential ID `sonar-token` and input `SONAR_TOKEN` in the text variable, then click **OK**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000531.png)

4. In the task `withCredential` on the right, click **Add nesting steps** (the first one)，then select `withSonarQubeEnv`, leave the default name `sonar`, click **OK** to save it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000743.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222000936.png)

5. Click **Add nesting steps** (the first one) in the `withSonarQubeEnv`. Then select `Shell` on the right, enter the SonarQube branch and authentication configuration commands in the pop-up window as follows, and click **OK** to save the information.

```shell
mvn sonar:sonar -o -gs `pwd`/configuration/settings.xml -Dsonar.branch=$BRANCH_NAME -Dsonar.login=$SONAR_TOKEN
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222001319.png)

6. Click on the **Add nesting steps** (the third one) on the right, select **timeout**. Input `1` to time and the unit select `Hours`.

Click **OK** to save it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222001544.png)

7. In the `timeout`, click **Add nesting steps** (the first one). Then select `waitforSonarQubeGate` and keep the default `Start the follow-up task after inspection` in the popup window.

Click **OK** to save it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222001847.png)

#### Stage 4: Build and Push the Image

1. Similarly, click **+** on the right of the stage of `Code Analysis` to add another stage to build and push images to DockerHub, name it `Build and Push`.

2. Click **Add Step** and select **container**，name it `maven`，then click **OK**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222112517.png)

3. Click **Add nesting steps** in the contain `maven`, and select **Shell** on the right, enter the following command in the pop-up window:

```shell
mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package
```

4. Then continue to click **Add nesting steps** on the right, select `Shell` in the pop-up window, enter the following command to build a Docker image based on the [Dockerfile](https://github.com/kubesphere/devops-java-sample/blob/master/Dockerfile-online):

```shell
docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER .
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222113131.png)

Click **OK** to save it.

5. Similarly, click `Add nesting steps` again and select `withCredentials` on the right. Fill in the pop-up window as follows:

> Note: Considering the security, the account information are not allowed to be exposed in plaintext in the script.

- Credential ID：Select the DockerHub credentials you created, e.g. `dockerhub-id`
- Password variable：Enter `DOCKER_PASSWORD`
- Username variable：Enter `DOCKER_USERNAME`

Click **OK** to save the it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222113442.png)

6. Click `Add nesting steps` (the first one) in the `withCredentials` stage, select `Shell` on the right, enter the following command in the pop-up window, which is used to log in Docker Hub:

```shell
echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
```

Click **OK** to save the it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222114937.png)

7. As above, click **Add nesting steps** in the `withCredentials`, choose `Shell` and enter the following command to push the SNAPSHOT image to DockerHub:

```shell
docker push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222120214.png)

#### 阶段六：部署至 Dev 环境 (Deploy to DEV)

1、在 `Artifacts` 阶段右侧点击 **“+”** 增加最后一个阶段，命名为 `Deploy to DEV`，用于将容器镜像部署到开发环境即 `kubesphere-sample-dev` 项目中。

2、点击 `添加步骤`，选择 `审核`，在弹窗中输入 `@project-admin` 指定项目管理员 project-admin 用户来进行流水线审核，点击「确定」。

3、点击 `添加步骤`，选择 `KubernetesDeploy`，在弹窗中参考以下填写，完成后点击「确定」保存信息：

- Kubeconfig：选择 `demo-kubeconfig`
- 配置文件路径：输入 `deploy/no-branch-dev/**`，这里是本示例的 Kubernetes 资源部署 [yaml 文件](https://github.com/kubesphere/devops-java-sample/tree/master/deploy/no-branch-dev) 在代码仓库中的相对路径

4、同上再添加一个步骤，用于在这一步部署和流水线执行成功后给用户发送通知邮件。点击 `添加步骤`，选择 `邮件`，自定义收件人、抄送、主题和内容。

> 注意，配置邮件服务请参考 [配置 Jenkins 邮件发送](../../devops/jenkins-setting#修改-jenkins-邮件服务器设置)，若还未配置可跳过第 4 步 (下一版本将支持流水线共用 KubeSphere 平台统一配置的通知服务)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190529232706.png)

至此，图形化构建流水线的六个阶段都已经添加成功，点击 `确认 → 保存`，可视化构建的流水线创建完成，同时也会生成 Jenkinsfile 文件。

#### Stage 5: Save Artifacts

1. Click **+** on the right of the `Build and Push` stage, here we add another stage to save artifacts. This example uses the jar package and name it `Artifacts`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222120540.png)

2. Click `Add Step` in `Artifacts` stage, select `archiveArtifacts`. Enter `target/*.jar` in the pop-up window, which is used to set the archive path of artifact in Jenkins.

Click **OK** to save the it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222121035.png)


#### Stage 6: Deploy to DEV

1. Click **+** on the right of the stage `Artifacts` to add the last stage, name it `Deploy to DEV`. This stage is used to deploy resources to development environment, namely, the project of `kubesphere-sample-dev`.

2. Click **Add Step** in `Deploy to DEV`, select `input` and enter `@project-admin` in the pop-up window, assigning account `project-admin` to review this pipeline.

Click **OK** to save the it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222123026.png)

3. Click **Add Step**，select `kubernetesDeploy`. Fill in the pop-up window as below and click "Confirm" to save the information:


- Kubeconfig: select `demo-kubeconfig`
- Configuration file path: Enter `deploy/no-branch-dev/**` which is the related path of the Kubernetes [yaml](https://github.com/kubesphere/devops-java-sample/tree/master/deploy/no-branch-dev). 

Click **OK** to save the it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222124016.png)

4. Similarly, Click `Add Step` to send an email notification to the user after the pipeline runs successfully, select `Email` and fill in the information.

> Note: Make sure you've configured email server in `ks-jenkins`, please refer to Jenkins email configuration. If not yet, skip this step and run this pipeline are well.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222125008.png)

At this point, the total six stages of the pipeline have been edited completely, click `Confirm → Save`，the pipeline of the visual build is created and the Jenkinsfile is also generated.


### Run Pipeline

1、Manually built pipelines need to be manually run in the platform. Click `Run`，In the input parameter pop-up window, you can see the three string parameters defined earlier. No modification is needed here. Click `Confirm` and the pipeline will start running.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514155513.png#align=left&display=inline&height=1060&originHeight=1060&originWidth=2782&search=&status=done&width=2782)

2、You can see the status of the pipeline in the **Activity** list，click `Activity` to view the specific situation of the activity.

> Note: The pipeline cannot be seen when it is started. This is because it has an initialization process. When the pipeline starts running, the Jenkins slave starts and starts parsing and executing the Jenkinsfile automatically generated by the pipeline. You can see the page where the graphical pipeline runs.


3. Click Run Sequence `1` in the activity list to enter the activity details page of Sequence  `1`  to view the specific operation of the pipeline.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514160039.png#align=left&display=inline&height=722&originHeight=722&originWidth=2804&search=&status=done&width=2804)

4. Log in the platform and shift the user to  `project-admin`. Enter into the `graphical-pipeline` under the DevOps project. Then click `Activity` to enter the No. `1` activity page. You can see the pipeline has run to the `deploy to dev` stage. Click `Continue` to change the pipeline status as **In Operation**.

> Note: If the previous steps are configured correctly, you can see that the pipeline has successfully run to the last stage in a few minutes. Since we added the review step in the last phase and specified the user with the user name `project-admin`. Therefore, the pipeline will be suspended until now, waiting for the auditor `project-admin` to log into the pipeline running page to manually trigger. 此时审核者可以测试构建的镜像并进一步审核整个流程，若审核通过则点击 **继续**，最终将部署到开发环境中。


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514160931.png#align=left&display=inline&height=834&originHeight=834&originWidth=2178&search=&status=done&width=2178)


### View Pipeline

1. After a few minutes, the pipeline will run successfully. Click `Activity` list in the pipeline to view the current running pipeline serial number, the page shows the operational status of each step in the pipeline. The black box marks the name of the step in the pipeline. The six stages of the pipeline in the example are the six stages created above. At this point, the reviewer can test the built image and further review the entire process. If the review is approved, click Continue and the solution will eventually be deployed to the development environment.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514161723.png#align=left&display=inline&height=630&originHeight=630&originWidth=2146&search=&status=done&width=2146)

2. Click  `Check Logs` on the top right of the current page to view the pipeline run log. The page shows the specific log, running status and time of each step. Click on a specific stage on the left to view its specific log. If an error occurs, the positioning problem can be analyzed according to the log information. The log can be downloaded to the local view. .

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514161819.png#align=left&display=inline&height=1216&originHeight=1216&originWidth=2536&search=&status=done&width=2536)


### View code quality

Click `Code quality` in the pipeline to check the detection results of the code quality, which is provided by the SonarQube built into the cluster. The sample code is simple and therefore does not show bugs or code vulnerabilities. Click on the SonarQube icon on the right to access SonarQube in your browser and visit SonarQube for reference [访问内置 SonarQube](../../installation/sonarqube-jenkins).

> Tip: If you need to access SonarQube on the external network, you may need to bind the public network EIP and configure port forwarding and firewall rules. In the port forwarding rule, the **intranet port**, for example, 31359, is forwarded to the **source port** 31359, and then open the **source port** in the firewall to ensure that the external network traffic can pass through the port before the external can access. For example, if you are doing the above operations on the QingCloud cloud platform, you can refer to [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514162344.png#align=left&display=inline&height=716&originHeight=716&originWidth=2172&search=&status=done&width=2172)

**View test quality report at SonarQube**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514163017.png#align=left&display=inline&height=1444&originHeight=1444&originWidth=2362&search=&status=done&width=2362)


### View Articraft

Click `Activity` and select `Product`, you can view the articraft Jar package saved by the pipeline during the running process, and click to download it to the local.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514163948.png#align=left&display=inline&height=596&originHeight=596&originWidth=2156&search=&status=done&width=2156)


### Verify the results of the process

If every step of the pipeline can be successfully executed, the Docker image of the final build of the pipeline will also be successfully pushed to DockerHub. We have configured the Docker mirror repository in Jenkinsfile, log in to DockerHub to see the mirror's push result, and you can see the tag. The image for SNAPSHOT-xxx has been pushed to DockerHub. It was finally deployed to the development environment as a deployment and service in KubeSphere.

1. Login KubeSphere as `project-regular` , enter `kubesphere-sample-dev`, click **Workload → Deployment** on the menu bar on the left to see that ks-sample-dev has been created successfully.
| Environment | URL | Namespace | Deployment | Service |
| --- | --- | --- | --- | --- |
| Dev | `http://{$Virtual IP}:{$8080}`
or `http://{$Intranet/Public IP}:{$30861}` | kubesphere-sample-dev | ks-sample-dev | ks-sample-dev |



**View Deployment**![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514164023.png#align=left&display=inline&height=666&originHeight=666&originWidth=2792&search=&status=done&width=2792)

2. In the menu bar, select **Network & Services → Service**. You can also view the corresponding created service. You can see that the NodePort exposed by the service is`30861`.

**View Service**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514165026.png#align=left&display=inline&height=770&originHeight=770&originWidth=2820&search=&status=done&width=2820)

3. Check the mirror pushed to DockerHub you can see that `devops-sample` is the value of **APP_NAME**, while Tag is the value of `SNAPSHOT-$BUILD_NUMBER`  (`$BUILD_NUMBER`, running number of the according activity),  in which tag is the mirror of `SNAPSHOT-1` , also used in `ks-sample-dev`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514164245.png#align=left&display=inline&height=1206&originHeight=1206&originWidth=2208&search=&status=done&width=2208)

4. Since we have set up email notifications in the final phase of the pipeline, we can verify the received build notification emails in the mailbox.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514200639.png#align=left&display=inline&height=458&originHeight=458&originWidth=1448&search=&status=done&width=1448)


### Access sample service

If you access to the deployed HelloWorld sample service in the intranet environment, you can log in to the cluster node through SSH. In another way, you can use the cluster administrator to log in to KubeSphere and enter the following command in web kubectl to verify access. The Virtual IP and node port (NodePort) can pass the corresponding project. View in the service:

```shell
# curl {$Virtual IP}:{$Port} or curl {$Intranet IP}:{$NodePort}
curl 10.233.4.154:8080
Hello,World!
```

At this point, the example of the graphical build pipeline has been completed. If you encounter problems during the creation process, you can refer to [FAQ](../../devops/devops-faq).
