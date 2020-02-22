---
title: "Create SonarQube Token"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Create SonarQube Token'
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

1. Use default account `admin/admin` to log in SonarQube, click on the `Create new project` on the top right.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213225325.png)

2. Enter a name in the blank, e.g. **java-sample**, then click on the `Generate`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213230427.png)

3. At this point, you can see the token generated on this page, then click `Continue`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213231314.png)

4. Choose `Java` and select `Maven` by default, copy the highlighted serial number and click on the `Finish this tutorial`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213231633.png)
