---
title: "Set Email Server for KubeSphere Pipeline"
keywords: 'kubesphere, kubernetes, notification, jenkins, devops, ci/cd, pipeline'
description: 'Set Email Server for KubeSphere CI/CD pipeline'
---


In current version (v2.1.x), the built-in Jenkins cannot share the same email configuration with platform notification system. Thus we need to set email server for KubeSphere DevOps pipeline separately.

> Note: Please be aware that the modification of the email server in `ks-jenkins` deployment below will restart the deployment itself. Consequently, the DevOps system will be unavailable for a few minutes. Please make such modification at an appropriate time.

1. Log in KubeSphere by using `admin` account, navigate to **System-workspace → Projects → kubesphere-devops-system**.

![System Projects](https://pek3b.qingstor.com/kubesphere-docs/png/20200222231148.png)

2. Then go to **Application Workloads → Workloads**, choose **Deployments** and drill into **ks-jenkins**. Then choose **Edit Config Template** from **More** drop-down list. Then choose **Pod Template** in the pop-up window and click the edit icon of the container image **ks-jenkins**. Scroll down the panel you will see the following environments that you need to configure. Finally click **Confirm** to save the changes.

| Environment variable name | Description |
|---|---|
|EMAIL\_SMTP\_HOST | SMTP server address |
|EMAIL\_SMTP\_PORT | SMTP server port (e.g. 25)  |
|EMAIL\_FROM\_ADDR |  Email sender address |
|EMAIL\_FROM\_NAME | Email sender name |
|EMAIL\_FROM\_PASS | Email sender password |
|EMAIL\_USE\_SSL | whether to open SSL configuration |
