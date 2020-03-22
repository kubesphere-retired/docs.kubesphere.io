---
title: "Access SonarQube Console and Create Token"
keywords: 'kubesphere, kubernetes, docker, jenkins, sonarqube'
description: 'Create token for code quality analysis through SonarQube console'
---

## Fetch SonarQube NodePort

Execute the following command to get SonarQube NodePort. As you can see `31359` is returned in this example:

```bash
$ kubectl get svc -n kubesphere-devops-system | grep ks-sonarqube-sonarqube
ks-sonarqube-sonarqube               NodePort    10.233.20.169   <none>        9000:31359/TCP   48m
```

## Access SonarQube Console

Now access SonarQube console `http://{$Node IP}:{$NodePort}` in your browser using the default account `admin / admin`.

![SQ Login Page](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003216.png)

## Create SonarQube Token

1. Click **Create new project** then a pop-up page **Analyze a project** shows up.

![Create New Project](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003338.png)

![Analyze Project](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003240.png)

2. Enter a project name like `java-sample`，then click **Generate**.

![Provide Token Name](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003729.png)

3. At this point, we have got token as follows. Click **Continue**.

![Generate Token](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003848.png)

4. Select language **Java** and build technology **Maven**, then copy the string in the red rectangle of the black box and click **Finish this tutorial**. Then you can go back to the DevOps pipeline tutorial.

![Copy Token](https://pek3b.qingstor.com/kubesphere-docs/png/20200107004047.png)
