---
title: "DevOps 工程概述"
---

对比 KubeSphere Express Edition (易捷版)，DevOps 工程是 Advance Edition (高级版) 独有的功能，针对企业实际的业务需求和场景，提供从仓库 (SVN/Git)、代码编译、镜像制作、镜像安全、推送到仓库、应用版本、到定时构建的端到端流水线设置，支持用户在开发、测试等环境下的端到端高效流水线能力，同时提供完整的日志功能，记录 CI/CD 流水线的每个过程。


## 创建 DevOps 工程

1、登录控制台，进入指定企业空间，点击左侧的 DevOps 工程菜单，进入 DevOps 工程管理页面，页面中显示当前用户可查看的 DevOps 工程列表。 

![devops_page](/devops_page.png)

2、点击右侧的创建按钮，创建一个新的工程，输入 DevOps 工程的基本信息。

- 名称：为创建的工程起一个简洁明了的名称，便于浏览和搜索。
- 描述信息：简单介绍 DevOps 工程的主要特性，帮助进一步了解该工程。

![create_project](/devops_create_project.png)

3. 创建完成之后，进入了 DevOps 工程管理页面，可进行创建、编辑和查看当前工程下的流水线（Pipeline），以及管理工程成员和成员角色等操作。点击左侧的 `基本信息`，查看 DevOps 工程的状态。

![devops_basic](/devops_basic.png)
   
4. 点击左侧的 `成员角色`，查看当前工程下已有哪些角色。 

5. 点击 `工程成员`，查看当前工程已有哪些用户。点击 `邀请成员` 按钮，邀请相应组织下的开发、测试或者运维人员进入此 DevOps 工程。在弹出的页面中搜索成员名，点击右侧的 “+” 号，选择成员的角色。

## 创建流水线

Jenkins Pipeline (流水线) 是一套插件，支持将连续输送 Pipeline 实施和整合到 Jenkins。Pipeline 提供了一组可扩展的工具，用于通过 Pipeline DSL 代码创建简单到复杂的传送 Pipeline。DevOps 工程提供 Pipeline 的创建和设置，用户只需简单配置即可创建 Pipeline，详见
 [流水线](../pipeline)。

## 创建凭证

凭证 (Credential) 是包含了敏感数据的对象，例如用户名密码，SSH 密钥和一些 Token 等，详见 [凭证管理](../credential)。


