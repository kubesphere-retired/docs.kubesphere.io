---
title: "添加代码仓库" 
keywords: ''
description: ''
---

KubeSphere 的 DevOps 工程中，目前已支持了以下几种主流的源代码管理工具 (Source Code Management)，可以在创建 Jenkinsfile-in-SCM 这类流水线的高级设置添加这类源代码仓库，添加代码仓库之前需要预先创建一个账户凭证 (Credentials)。

- GitHub
- SVN
- Git

![SCM 设置](/add-scm.png)

参考如下步骤添加代码仓库：

## 添加 GitHub

添加 GitHub 仓库已在示例六中以示例的方式给出，详见 [添加 GitHub](../../quick-start/jenkinsfile-in-scm/#创建凭证)。

## 添加 Git

添加 Git 类型的代码仓库，原则是只要满足 Git 协议的仓库都支持添加，比如 GitLab、Gitee，添加这类代码仓库与添加 GitHub 步骤类似，需要预先为其创建凭证。在创建流水线的基本信息中，填写 Git 的仓库 URL 和证书 (credentials)，其中的凭证一般选择 **账户凭证** 并填写账户信息，若还未创建凭证可以点击 **新建凭证** 创建。

如下添加 Gitlab 账户凭证。

![添加 Gitlab 凭证](/add-gitlab-credentials.png)

完成代码仓库的基本信息，证书选择上一步创建的 gitlab-id，点击保存。

![添加 Git](/add-git.png)

## 添加 SVN

Subversion (SVN) 是一个开源的版本控制系統，它的版本控制与 Git 协议类型的代码仓库有很大区别，如下所示：

### SVN 仓库目录结构

- branch (分支)：分支开发和主线开发是可以同时并行开发，分支常用于修复 bug 时使用。
- truck (主线 | 主分支)：可以理解为开发分支，新功能的开发应放在主线中，当各部分功能开发完后，如需修改代码就用 branch。
- tag (标记)：类似 GitHub 中的 tag，用于标记某个可用的版本，可以标记已经上线发布的版本，也可以标记正在测试的版本，一般是只读的。

![SVN 目录结构](/svn-directory.png)

添加 SVN 作为代码管理工具，需预先填写 SVN 的远程仓库地址 (URL) 和证书 (credentials)，其中的凭证一般选择 **账户凭证** 并填写账户信息。流水线将扫描 SVN 上存在 Jenkinsfile 的分支然后触发该分支来运行流水线，添加 SVN 详见以下信息：

- 类型
   - 单分支 SVN：如果 Jenkinsfile 在根目录并且流水线在根目录运行，就用单分支 SVN
   - SVN： 如果 Jenkinsfile 在根目录的文件夹中，则选择该类型
- 远程仓库地址：必填，并且是需要公网或者内网能访问到的 SVN 仓库地址
- 证书：同 Git，需要添加账户凭证
- 包括分支：和 GitHub 设置分支的发现策略类似，即选择流水线将要扫描哪些分支 (目录)。如下将扫描这四个分支目录下所有文件
- 排除分支：不扫描哪些分支 (目录)

![证书页面](/pipeline-svn.png)
