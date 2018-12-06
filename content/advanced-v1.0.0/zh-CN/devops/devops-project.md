---
title: "管理 DevOps 工程"
---


## 创建 DevOps 工程

1、登录控制台，进入指定企业空间，点击左侧的 **DevOps 工程**，进入 DevOps 工程管理页面，页面中显示当前用户可查看的 DevOps 工程列表。 

![devops_page](/devops_page.png)

2、点击右侧的创建按钮，创建一个新的工程，输入 DevOps 工程的基本信息。

- 名称：为创建的工程起一个简洁明了的名称，便于浏览和搜索。
- 描述信息：简单介绍 DevOps 工程的主要特性，帮助进一步了解该工程。

![devops_create_project](/devops_create_project.png)

3. 创建完成之后，进入了 DevOps 工程管理页面，可进行创建、编辑和查看当前工程下的 [流水线 (Jenkins Pipeline)](../pipeline) 和创建 [凭证 (Credential)](../credential)，凭证是包含了敏感数据的对象，例如用户名密码，SSH 密钥和一些 Token 等。点击左侧的 `基本信息`，可查看 DevOps 工程的信息和状态。

![devops_basic](/devops_basic.png)
   
4. 另外，还支持管理工程成员和成员角色等操作，点击左侧的 `成员角色`，查看当前工程下已有哪些角色，平台为工程预置了几个常用的角色。 

![devops_roles](/devops-roles.png)

5. 点击 `工程成员`，查看当前工程已有哪些用户。点击 `邀请成员` 按钮，邀请相应组织下的开发、测试或者运维人员进入此 DevOps 工程。在弹出的页面中搜索成员名，点击右侧的 “+” 号，可从企业空间的用户池中邀请成员加入当前的 DevOps 工程进行协同工作。注意，管理员将成员用户邀请到当前的 DevOps 工程后，一般来说，组内成员创建的资源（pipeline、凭证等）在组内是互相可见的。

![devops-invite-member](/devops-invite-member.png)

## 编辑或删除工程

在 DevOps 工程列表页，点击 **"···"** 按钮，可编辑工程的基本信息如名称、指定管理员和描述信息，或删除工程。