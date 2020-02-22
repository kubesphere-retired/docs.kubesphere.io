---
title: "Set Email Server for KubeSphere pipeline"
keywords: 'kubesphere, kubernetes, notification, jenkins, devops, ci/cd, pipeline'
description: 'Set Email Server for KubeSphere CI/CD pipeline'
---

## Set Email Server for KubeSphere Pipeline

<font color="red">
Please note that mofify the email server in `ks-jenkins` deployment will restart the deployment itself, the DevOps project will be unavailber in a few minutes. Please update at the appropriate time.
</font>

In current version (v2.1.x), the built-in Jenkins and platform notification system cannot share the same email configuration. Thus we need to set email server for KubeSphere DevOps pipeline individually.

1. Log in KubeSphere by using `admin` account, navigate to **System-workspace → Projects → kubesphere-devops-system**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222231148.png)

2. Click **···** → **Edit YAML**, scroll down to email configuration section. Modify the highlighted blocks with your actual email server parameters.

Click **Update** to save the changes.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222232208.png)


| Environment variable name | Description |
|---|---|
|EMAIL\_SMTP\_HOST | SMTP server address |
|EMAIL\_SMTP\_PORT | SMTP server port (e.g. 25)  |
|EMAIL\_FROM\_ADDR |  Email sender address |
|EMAIL\_FROM\_NAME | Email sender name |
|EMAIL\_FROM\_PASS | Email sender password |
|EMAIL\_USE\_SSL | whether to open SSL configuration |
