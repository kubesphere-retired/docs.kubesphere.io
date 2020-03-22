---
title: "Add Source Code Management" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

DevOps project currently supports the following mainstream source code management tools (Source Code Management) in KubeSphere, which can be added to the pipeline using Jenkinsfile-in-SCM. Before adding the code repository, you need to create an account credential in advance.

- GitHub
- SVN
- Git

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190322212812.png)


Add the source code repository by following the steps below:

## Add GitHub

There is an example walk you through how to add a GitHub repository, see [Quick Start - Create a CI/CD Pipeline Based on Jenkinsfile](../../quick-start/jenkinsfile-in-scm/).

## Add Git

If you are going to add a Git-based source code repository, the principle is that as long as the SCM are Git protocol, such as GitLab, Gitee. Actually, add such a code repository is similar to add a GitHub, you need to create account credentials in advance. 

Add Gitlab account credentials as following.

![Add GitLab](https://pek3b.qingstor.com/kubesphere-docs/png/20190322214750.png)

1. When you creating a Pipeline, click on **Code Repository**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190321162726.png)

2. Choose **Git**, then select **gitlab-id** that we created at the last step. Thus you can use it directly.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190321162904.png)

## Add SVN

Subversion (SVN) 是一个开源的版本控制系統，它的版本控制与 Git 协议类型的代码仓库有很大区别，如下所示：

Subversion (SVN) is an open source version control system that is quite different from the Git protocol type code repository, as shown below: 

### SVN Architecture

Subversion usually uses structure with 3 folders:

- Branches: contains different branches of project. Developers can work on multiple, simultaneous features without affecting others. Branches can be merged later after feature has been implemented
- Trunk: contains latest source code, which is on development
- Tags: contains snapshot of project. For example: Project A releases version 1.0, all sources inside trunk will be tagged into 1.0 tag, and later, when we need to build/deploy or review version 1.0 again, we will get the tag 1.0

![SVN 目录结构](/svn-directory.png)

添加 SVN 作为代码管理工具，需预先填写 SVN 的远程仓库地址 (URL) 和证书 (credentials)，其中的凭证一般选择 **账户凭证** 并填写账户信息。

流水线将扫描 SVN 上存在 Jenkinsfile 的分支然后触发该分支来运行流水线，添加 SVN 详见以下信息：

To add SVN as a code management tool, you need to pre-set the SVN's remote repository address (URL) and credentials.

The pipeline will scan the branch where Jenkinsfile exists on the SVN and then trigger the branch to run the pipeline. Refer to following information to add SVN as Source Code Management:

- Type
   - Single SVN：If the Jenkinsfile is in the root directory and the pipeline will run based on the root directory, select **Single SVN**
   - SVN：You can select this type if the Jenkinsfile is in the folder of the root directory
- Remote URL：The SVN server address, it should be accessable internally or externally.
- Certificate：Same as Git，it requires create an account credential in advance.
- Includes branch：Select which branches (directories) the pipeline will scan. For example, it will scan all files in these four branches shown in following screenshot
- Excludes branch：Which branches (directories) will not be scanned 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190322220004.png)
