---
title: "Create a CI/CD Pipeline in a Graphical Panel" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

From last CI/CD tutorial, the pipeline was built from existing Jenkinsfile of its source code repository, requiring some experiences of the declarative Jenkinsfile. For beginners, who prefer graphical panel to help them quickly create a CI/CD pipeline without Jenkinsfile. Luckily, KubeSphere enables users to build a pipeline in a graphical panel, as well as generate a pipeline to Jenkinsfile which allows users to edit, friendly UI manipulation which makes a team’s delivery in high efficiency.


## Objective

This guide is based on guide 10-Jenkinsfile in SCM. By building the pipeline in a visual way, deploy a HelloWorld sample service to a development environment in a KubeSphere cluster. Besides, that is accessible to users. The so-called development environment is resource isolated in Namespace in the underlying Kubernetes. For presentation purpose, this example still uses the GitHub repository devops-java-sample.


## Hands-on Lab

### Pipeline Overview

The construction of visual pipeline consists of the following six stages. Firstly, the flowchart below briefly describes the workflow of the entire pipeline:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190516091714.png#align=left&display=inline&height=1278&originHeight=1278&originWidth=2190&search=&status=done&width=2190)

> The explanation of every stage：
> - **Stage 1. Checkout SCM: **Pull the GitHub repository code；
> - **Stage 2. Unit test**: Unit tests; proceed to the next task only if the tests are passed；
> - **Stage 3. Code Analysis**: Configure SonarQube for static code quality checking and analysis；
> - **Stage 4. Build and Push**: Build the image and push the tag as snapshot-$BUILD_NUMBER to DockerHub (where $BUILD_NUMBER is the run number of the pipeline active list)；
> - **Stage 5. Artifacts**: Make the artifact (jar package) and save it；
> - **Stage 6. Deploy to DEV**: Deploy the project to the Dev environment, which requires a pre-audit and an email if the deployment is successful.



### Create Project

CI/CD pipeline will eventually deploy the sample Web to the development environment `kubesphere-sample-dev` based on the [yaml 模板文件](https://github.com/kubesphere/devops-docs-sample/tree/master/deploy/no-branch-dev) of the documentation website. It corresponds to a project in KubeSphere that needs to be created in advance. If not please refer to [示例十 - 创建第一个项目](../devops-online/#%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE); use a project-admin account to create a `kubesphere-sample-dev` project. Then invite project regular user `project-regular` to enter the project and give it an `operator` character.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514112245.png#align=left&display=inline&height=1174&originHeight=1174&originWidth=3462&search=&status=done&width=3462)


### Create Credentials

This example creates pipelines with DockerHub, Kubernetes (create KubeConfig to access the running Kubernetes cluster), and SonarQube (three Credentials).

1. Log in KubeSphere with the project regular user. Refer to [Create Credentials](../../devops/credential/#%E5%88%9B%E5%BB%BA%E5%87%AD%E8%AF%81) create the credential of DockerHub and Kubernetes. Name the credential ID as `dockerhub-id` and `demo-kubeconfig.`

2. Create a Java Token refer to [访问 SonarQube](../../devops/sonarqube/) and copy the Token。

3. Lastly, enter devops-demo's DevOps project in KubeSphere. Similarly, click Create in the Credential, to create a Secret Text type credential. Name the credential ID as `sonar-token`, the token is the one copied in the previous step, then click Confirm.

At this point, the three credentials have been created and will be used in the pipeline.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514023424.png#align=left&display=inline&height=890&originHeight=890&originWidth=2794&search=&status=done&width=2794)


### Create Pipeline

Follow  steps below to create and run a complete pipeline.


#### Step 1: Fill in the basic information

1. In the DevOps project, select the **Pipeline** on the left and click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514114907.png#align=left&display=inline&height=854&originHeight=854&originWidth=2820&search=&status=done&width=2820)

2. In the pop-up window, enter the basic information of the pipeline. When finished, click **Next**.

- Name: A concise name for the pipeline to understand and search, for example, graphical-pipeline.
- Description: A brief introduction to the main features of the pipeline to help you understand the role of the pipeline.
- Code Registry: No code registry is selected here.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514131501.png#align=left&display=inline&height=682&originHeight=682&originWidth=2024&search=&status=done&width=2024)


#### Step 2: Advanced Settings

1. Click **Add Parameter** to add **3** string parameters as follows. This parameter will be used in the docker command of the pipeline. Click OK when done.
| Parameter Type | Name | Default Value | Description |
| --- | --- | --- | --- |
| string parameter | REGISTRY | The sample repository address is  docker.io. | Image Registry |
| string parameter | DOCKERHUB_NAMESPACE | Fill in your  DockerHub account (which can also be the Organization name under the account). | DockerHub Namespace |
| string parameter | APP_NAME | Fill the application name as devops-sample. | Application Name |


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514115433.png#align=left&display=inline&height=1184&originHeight=1184&originWidth=1726&search=&status=done&width=1726)


### Visual editing pipeline

The visualization pipeline consists of six stages, which in turn describe which steps and tasks were performed in each stage.


#### Stage 1: Pull Source Code (Checkout SCM)

The visual editing page is divided into a structure editing area and a content editing area. Jenkinsfile is automatically generated by building each stage and step of the pipeline, so users don't need to learn the syntax of Jenkinsfile, which is very convenient. Of course, the platform also supports the manual editing of Jenkinsfile. The pipeline is divided into "declarative pipeline" and "scripted pipeline". Visual editing supports declarative pipeline. For Pipeline syntax, see [Jenkins 官方文档](https://jenkins.io/doc/book/pipeline/syntax/).

1. As follows，select `node` in the agent type, input `maven` in the label.

> Note: The Agent section specifies where the entire Pipeline or a particular stage will be executed in the Jenkins environment, depending on where the agent part is placed, see [Jenkins Agent 说明](../../devops/jenkins-agent)。


2. In the graphical build pipeline interface, click the "+" button in the edit area on the left side. Add a stage. Click the **Add Step** in the interface, and name it **Checkout SCM** in the right input box.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514132128.png#align=left&display=inline&height=588&originHeight=588&originWidth=1400&search=&status=done&width=1400)

3、Then click `Add steps` at this stage. Select `git` on the right. For now, pull the repository's codes through  Git, and the information filled in the pop-up window is as follows:

- Url: GitHub repository URL `https://github.com/kubesphere/devops-java-sample.git`
- Credential ID: No need to fill in (if it is a private warehouse, such as Gitlab, you need to create and fill in the voucher ID in advance)
- Branch: There is no need to fill in the branch name here. If not, the default is the master branch.

When you are done, click "OK" to save and you will see the first stage of the build pipeline.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514132948.png#align=left&display=inline&height=658&originHeight=658&originWidth=2752&search=&status=done&width=2752)


#### Stage 2: Unit Test

1. Click "+" on the right of the `Checkout SCM`   to add one stage for performing a unit test in the container, name it `Unit Test`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514133941.png#align=left&display=inline&height=634&originHeight=634&originWidth=2552&search=&status=done&width=2552)

2. Click `Add` and select `the Pod`, name it `maven`, then click `Confirm`；

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514134044.png#align=left&display=inline&height=556&originHeight=556&originWidth=2060&search=&status=done&width=2060)

3、Click `Add nesting steps` in the `maven` pod. Then select `shell` and enter the following command in the popup window, then click Save：

```shell
mvn clean -o -gs `pwd`/configuration/settings.xml test
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514134203.png#align=left&display=inline&height=612&originHeight=612&originWidth=1966&search=&status=done&width=1966)


#### Stage 3: Code Analysis

1. Same as above, click “+” on the right side of the  `Unit Test`  stage to continue adding a stage for configuring SonarQube to perform static code quality analysis in the container, name it `Code Analysis`。

2. Click `Add`  and select `the Pod`，name it `maven`，then click `Confirm`。

3. Click `Add nesting steps` on the right and select `Add credentials`，Select the previously created credential ID `sonar-token` in the popup window input `SONAR_TOKEN` in the text variable, then click Confirm.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514140415.png#align=left&display=inline&height=716&originHeight=716&originWidth=2228&search=&status=done&width=2228)

4. In the Add Credential on the right，click `Add nesting steps`，then select `SonarQube configuration`，keep the default  name sonar，click Confirm。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514140846.png#align=left&display=inline&height=920&originHeight=920&originWidth=1968&search=&status=done&width=1968)

5. Click `Add nesting steps` in the `SonarQube configuration` . Select `Shell` on the right, enter the SonarQube branch and authentication configuration commands in the pop-up window as follows, and click confirm to save the information.

```shell
mvn sonar:sonar -o -gs `pwd`/configuration/settings.xml -Dsonar.branch=$BRANCH_NAME -Dsonar.login=$SONAR_TOKEN
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514141531.png#align=left&display=inline&height=1062&originHeight=1062&originWidth=2028&search=&status=done&width=2028)

6. Click on the third `Add` on the right and select `Overtime`. Input 1 to time and the unit select `Hour`. Click Confirm.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514141926.png#align=left&display=inline&height=1238&originHeight=1238&originWidth=2026&search=&status=done&width=2026)

7. In the overtime steps, click `Add nesting steps`. Select `Code quality Cehck (SonarQube)` and keep the default `Process the following job after pass the test` in the popup window then click Confirm.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190529232241.png#align=left&display=inline&height=1314&originHeight=1314&originWidth=2540&search=&status=done&width=2540)


#### Stage 4: Build and Push the Image

1. Click "+" on the right of the stage of `Code Analysis` to add another stage to build and push images to  DockerHub. Name it as `Build and Push`。

2. Click `Add steps` and select `The Pod`，name it as `maven`，then click `Confirm`.

3. Click `Add nesting steps` and select `Shell` on the right, enter the following command in the popup window:

```shell
mvn -o -Dmaven.test.skip=true -gs `pwd`/configuration/settings.xml clean package
```

4. Then continue to click `Add nesting steps` on the right, select `Shell`. In the popup window, enter the following command to build a Docker image based on the [Dockerfile](https://github.com/kubesphere/devops-java-sample/blob/master/Dockerfile-online) in the repository. Click Finish to save when done:

```shell
docker build -f Dockerfile-online -t $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER .
```

5. Click `Add nesting steps` and select `Add credentials` on the right. Fill  the following information in the popup window, and click "confirm" to save the information:

> Note: For users' information security, the account type information does not appear in the script in clear text, but in the form of variables.


- Credential ID：Select the DockerHub credentials you created earlier such as `dockerhub-id`
- Password variable：`DOCKER_PASSWORD`
- Username variable：`DOCKER_USERNAME`

6. Click `Add nesting steps` in the `Add credentials` stage, select `Shell` on the right, enter the following command in the popup window to log in to Docker Hub:

```shell
echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin
```

7、Then click `Add nesting steps` to add `Shell` input a command to push the SNAPSHOT image to Docker Hub:

```shell
docker push $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:SNAPSHOT-$BUILD_NUMBER
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190529232407.png#align=left&display=inline&height=1358&originHeight=1358&originWidth=2630&search=&status=done&width=2630)


#### Stage 5: Save Artifacts

1. Click "+" at right of the `Build and Push` stage to add another stage to protect artifacts. This example uses the jar package as `Artifacts`.

2. Click `Add steps` and select `Save Artifacts`. Input `target/*.jar` in the popup window to capture the build file containing the pattern match (target/*.jar) and save it to Jenkins，then click Confim.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190529232447.png#align=left&display=inline&height=1366&originHeight=1366&originWidth=2548&search=&status=done&width=2548)


#### Stage 6: Deploy to DEV

1. Click "+" at right of the `Artifacts` stage to add the last stage and name it as `Deploy to DEV`. This stage will be used to deploy pod image to development environment namely, the project of `kubesphere-sample-dev`.

2. Click `Add steps` and select `Review`. Input `@project-admin` in the pop-up window and demand the project-admin account to review the pipeline. Click Confirm.

3. Click `Add steps`，select `KubernetesDeploy`. Fill in the pop-up window as below and click "Confirm" to save the information:
- Kubeconfig: select `demo-kubeconfig`
- Configuration file path: Input `deploy/no-branch-dev/**` which is the according path of the Kubernetes source deployment's [yaml 文件](https://github.com/kubesphere/devops-java-sample/tree/master/deploy/no-branch-dev). 

4. Add a step to the same as above to send a notification email to the user after this step of deployment and pipeline execution is successful. Click `Add steps`, select `Email`, and custom edit recipients, CCs, topics, and content.

> Note: sending mail in the pipeline requires pre-installing the mail server in the Installer. Please refer to [集群组件配置释义](../../installation/vars) for configuration. If not already configured, skip step 4 (the next version will support the unified configuration of mail in the UI after installation server).


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190529232706.png#align=left&display=inline&height=1446&originHeight=1446&originWidth=3198&search=&status=done&width=3198)

At this point, the six stages of the graphical  pipeline building have been added successfully, click `Confirm → Save`，the pipeline of the visual build is created and the Jenkinsfile is also generated.


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

