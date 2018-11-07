---
title: "凭证管理"
---

# 凭证

凭证 (Credential) 是包含了敏感数据的对象，例如用户名密码，SSH 密钥和一些 Token 等。流水线运行中，会与很多外部环境交互，如拉取代码，push/pull 镜像，SSH 连接至相关环境中执行脚本等，此过程中需提供一系列凭证，而这些凭证不应明文出现在流水线中，用户需统一管理这些凭证，在流水线中只需要提供凭证的 ID。

## 创建凭证

1. 在左侧的工程管理菜单下。点击 `凭证管理`，进入凭证管理界面，界面会展示当前工程所需的所有可用凭证。

   ![credential_page](/devops_credentials.png)

2. 点击创建按钮，创建一个用于拉取私人代码的 git 代码仓库的用户名和密码。页面中会显示此凭证 ID，在流水线中需要用此 ID 获取凭证。

   ![create_credential](/devops_create_credential.png)

3. 创建一个使用此凭证的流水线，其使用的模式是 Jenkinsfile Out of SCM，及不关联代码仓库 (代码仓库中不含 Jenkinsfile)。 

    ![credential_create_pipeline](/devops_create_credential_pipeline.png)

4. Jenkinsfile 中 `git` 的定义如下，这里说明一下，此 git 为一个 gitlab 上的私有仓库，需使用对应的用户名和密码才可拉取代码，在凭证 ID 一栏填入刚才的 ID，如下图：

    ![git_step](/credential_git.png)

5. 运行此流水线，查看是否如期地正常运行。


## 管理凭证

企业大型的工程往往需要与很多环境交互，会用到较多的凭证，KubeSphere 提供了凭证管理的页面，帮助用户统一集中管理这些凭证。

1. 在左侧的工程管理菜单下，点击`凭证管理`，进入凭证管理界面，展示当前工程下的所有可用凭证。
   
   ![credential_page](/devops_credentials.png)

2. 点击任意某一凭证，进入其详情页面。在此页面中可进行凭证的编辑，删除以及查看凭证的使用情况等操作。

   ![credential_detail](/credential_detail.png)

3. 点击左侧编辑信息，弹出窗口，可对凭证进行修改。除凭证 ID，其他都可进行修改。

   ![credential_edit](/credential_edit.png)

4. 点击删除按钮，可删除此凭证。

   ![credential_delete](/credential_delete.png)

5. 点击右侧的活动页面，可查看此凭证最近的使用情况。

   ![credential_activity](/credential_delete.png)

