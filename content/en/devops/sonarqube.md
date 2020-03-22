---
title: "Create SonarQube Token"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Create SonarQube Token'
---

## Fetch SonarQube NodePort

Execute the following command to get SonarQube NodePort. As you can see `31359` is returned in this example:

```bash
$ kubectl get svc -n kubesphere-devops-system | grep ks-sonarqube-sonarqube
ks-sonarqube-sonarqube               NodePort    10.233.20.169   <none>        9000:31359/TCP   48m
```

## Access SonarQube Console

Now access SonarQube console `http://{$Node IP}:{$NodePort}` in your browser using the default account `admin / admin`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003216.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003240.png)

## Create SonarQube Token

1. Click **Create new project** then a pop-up page **Analyze a project** shows up.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213225325.png)

2. Enter a project name like `java-sample`，then click **Generate**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213230427.png)

3. At this point, we've got token as follows. Click **Continue**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213231314.png)

4. Choose **Java** and select `Maven` by default, please be aware that you just need to copy the highlighted serial number, and click on the **Finish this tutorial**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200226171248.png)
