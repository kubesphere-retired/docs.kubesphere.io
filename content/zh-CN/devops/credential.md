---
title: "凭证管理"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

# 凭证

凭证 (Credential) 是包含了敏感数据的对象，例如用户名密码、SSH 密钥和一些 Token 等。流水线运行中，会与很多外部环境交互，如拉取代码，push/pull 镜像，SSH 连接至相关环境中执行脚本等，此过程中需提供一系列凭证，而这些凭证不应明文出现在流水线中，尤其是代码仓库管理 Jenkinsfile 文件的情况，用户需统一管理这些凭证，在流水线中只需要提供凭证的 ID。目前支持以下四种凭证类型：

- 账户凭证：常用于用户名和密码验证登录的代码仓库
- SSH：通过用户名、密码和私钥的方式
- 秘密文本：通过秘钥的方式连接
- kubeconfig：常用于配置跨集群认证，页面将自动获取当前 Kubernetes 集群的 kubeconfig 文件内容


## 前提条件

- 本示例以 GitLab 和 Harbor 为例，参考前请确保正确安装了 [内置 Harbor](../../installation/harbor-installation/) 和 [内置 GitLab](../../installation/gitlab-installation/)。
- 已创建了企业空间和 DevOps 工程并创建了项目普通用户 project-regular，若还未创建请参考 [多租户管理快速入门](../../quick-start/admin-quick-start)。

## 创建凭证

以项目 project-regular 登录 KubeSphere，在 devops-demo 的 DevOps 工程点击 `凭证`，进入凭证管理界面，以下说明几个在 DevOps 工程中常用的凭证。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190427133402.png)

### 创建 DockerHub 凭证

1、点击 **创建**，创建一个用于 DockerHub 登录的凭证；

- 凭证 ID：必填，此 ID 将用于仓库中的 Jenkinsfile，此示例中可命名为 **dockerhub-id**
- 类型：选择 **账户凭证**
- 用户名：填写您个人的 DockerHub 的用户名
- token / 密码：您个人的 DockerHub 的密码
- 描述信息：介绍凭证，比如此处可以备注为 DockerHub 登录凭证


2、完成后点击 **确定**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190427133655.png)

### 创建 GitHub 凭证

同上，创建一个用于 GitHub 的凭证，凭证 ID 可命名为 **github-id**，类型选择 `账户凭证`，输入您个人的 GitHub 用户名和密码，备注描述信息，完成后点击 **确定**。
> 注意：若用户的凭证信息如账号或密码中包含了 `@`，`$`这类特殊符号，可能在运行时无法识别而报错，这类情况需要用户在创建凭证时对密码进行 urlencode 编码，可通过一些第三方网站进行转换 (比如 `http://tool.chinaz.com/tools/urlencode.aspx`)，然后再将转换后的输出粘贴到对应的凭证信息中。

### 创建 kubeconfig 凭证

同上，在 **凭证** 下点击 **创建**，创建一个类型为 `kubeconfig` 的凭证，凭证 ID 可命名为 **demo-kubeconfig**，完成后点击 **确定**。

> 说明：kubeconfig 类型的凭证用于访问接入正在运行的 Kubernetes 集群，在流水线部署步骤将用到该凭证。注意，此处的 Content 将自动获取当前 KubeSphere 中的 kubeconfig 文件内容，若部署至当前 KubeSphere 中则无需修改，若部署至其它 Kubernetes 集群，则需要将其 kubeconfig 文件的内容粘贴至 Content 中。


### 创建 Harbor 凭证

同上，创建一个用于 内置 Harbor 登录的凭证，此处命名为 **harbor-id**，类型选择 **账户凭证**。用户名和密码填写 admin 和 Harbor12345，完成后点击 **确定**。

### 创建 GitLab 凭证

同上，创建一个用于 GitLab 的凭证，凭证 ID 命名为 **gitlab-id**，类型选择 `账户凭证`，GitLab 默认的管理员账号密码与 KubeSphere 一致，输入 GitLab 用户名 (admin) 和密码 (passw0rd)，备注描述信息，完成后点击 **确定**。

## 管理凭证

企业大型的工程往往需要与很多环境交互，会用到较多的凭证，KubeSphere 提供了凭证管理的页面，帮助用户统一集中管理这些凭证。

1. 在左侧的工程管理菜单下，点击 `凭证`，进入凭证管理界面，展示当前工程下的所有可用凭证。

2. 点击任意某一凭证，进入其详情页面。在此页面中可进行凭证的编辑，删除以及查看凭证的使用情况等操作。

   ![credential_detail](/credential_detail.png)

3. 点击左侧编辑信息，弹出窗口，可对凭证进行修改。除凭证 ID，其他都可进行修改。

   ![credential_edit](/credential_edit.png)

4. 点击删除按钮，可删除此凭证。

   ![credential_delete](/credential_delete.png)
