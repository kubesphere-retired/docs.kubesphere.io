---
title: "创建 SonarQube Token"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

### 访问 SonarQube 

参考 [访问内置 SonarQube](../installation/sonarqube-jenkins/)。

### 创建 SonarQube Token

1、使用默认账号 `admin/admin` 登入 sonar，然后点击右上角加号下的 `Create new project`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-create.png)

2、然后输入 `name`，然后点击 `Generate`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-name.png)

3、即可获取 token，然后点击 `Continue`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-con.png)

4、然后选择 Language `Java` ，选择 build technology 为 `Maven`，**复制 token**。点击 `Finish this tutorial` 即可。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-finish.png)

