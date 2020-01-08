---
title: "Access SonarQube Console and Create Token"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## Inspect SonarQube NodePort

Execute following command to ensure SonarQube NodePort, as you can see `31359` is returned:

```
$ kubectl get svc -n kubesphere-devops-system | grep ks-sonarqube-sonarqube
ks-sonarqube-sonarqube               NodePort    10.233.20.169   <none>        9000:31359/TCP   48m
```

## Access SonarQube Console

Using `http://{$Node IP}:{$NodePort}` to access SonarQube console in your browser, the default account is `admin / admin`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003216.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003240.png)

## Create SonarQube Token

1. Sign in with admin account, then click **Create new project**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003338.png)

2. Enter a project name，then click **Generate**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003729.png)

3. At this point, we've got token as following. Click **Continue**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107003848.png)

4. Select **Java** as language, remain build technology as **Maven**, then click **Copy** and choose **Finish this tutorial**. Then you can back to DevOps pipeline tutorial.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200107004047.png)
