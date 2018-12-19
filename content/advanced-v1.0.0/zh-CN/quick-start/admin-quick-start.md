---
title: "管理员快速入门"
---

## 目的

本文档面向初次使用 KubeSphere 的集群管理员用户，引导新手用户创建企业空间、创建新的角色和账户，然后通过新用户来创建项目和 DevOps 工程，帮助用户快速上手 KubeSphere。

## 前提条件

已安装 KubeSphere，并使用默认的 admin 用户名和密码登录了 KubeSphere。

## 预估时间

约 10 分钟。

## 操作示例

### 查看概览页

登录 KubeSphere 后，集群管理员将看到整个集群的资源运行概览和监控，以及集群的资源使用情况和组件状态。这对了解集群的资源消耗和使用情况是非常有帮助的。比如节点和企业空间的资源用量排行，管理员通过按指标进行排序即可快速发现潜在问题或定位某台节点资源不足的情况。

![资源概览](/admin-overview.png)

### 集群用户管理

#### 第一步：创建角色和账号

平台中的 cluster-admin 角色可以为其他用户创建账号并分配平台角色，平台内置了 cluster-admin、cluster-regular 和 workspaces-manager 三个常用的角色，同时支持自定义新的角色。

本示例首先新建一个角色 (user-manager) 和一个账号，并给这个账号授予 user-manager 角色。然后用 user-manager 来创建两个角色为 workspace-manager 和 cluster-regular 的账号，workspace-manager 将创建一个企业空间并指定 cluster-regular 的用户为企业空间管理员。

|账号名|集群角色|职责|
|---|---|---|
|user-manager|user-manager|管理集群的账户和角色|

1.1. 点击控制台左上角 **平台管理 → 平台角色**，可以看到当前的角色列表，点击 **创建**，创建一个角色用于管理所有账户和角色。

![创建角色](/admin-create-role.png)

1.2. 填写角色的基本信息和权限设置。

- 名称：起一个简洁明了的名称，便于用户浏览和搜索，如 `user-manager`
- 描述信息：简单介绍该角色的职责，如 `管理账户和角色`

![基本信息](/role-basic.png)

1.3. 权限设置中，勾选账户管理和角色管理的所有权限，点击 **创建**。

![权限列表](/authority-list.png)

1.4. 点击控制台左上角 **平台管理 → 账号管理**，可以看到当前集群中所有用户的列表，点击 **创建** 按钮。

![创建账号](/account-list.png)

1.5. 填写新用户的基本信息，如用户名设置为 `user-manager`，角色选择 `user-manager`，其它信息可自定义，点击 **创建**。

> 说明：上述步骤仅简单地说明创建流程，关于账号管理与角色权限管理的详细说明，请参考 [角色权限概览](../../multi-tenant/role-overview) 和 [账号管理](../../platform-management/account-management)。

![添加用户](/demo-account.png)

1.6. 切换成上一步创建的 `user-manager` 账号登录 KubeSphere，在 **账号管理** 下，新建两个角色为 workspace-manager 和 cluster-regular 的账号，步骤同上，参考如下信息创建。

|账号名|集群角色|企业空间角色|职责|
|---|---|---|---|
|ws-manager|workspaces-manager|默认 workspace-admin|创建和管理企业空间|
|ws-admin|cluster-regular|workspace-admin|管理企业空间下所有的资源|

1.7. 查看新建的两个账号信息：

![查看账号列表](/user-manager-list.png)

### 第二步：创建企业空间

企业空间 (workspace) 是 KubeSphere 实现多租户模式的基础，是用户管理项目、DevOps 工程和企业成员的基本单位。因此，上一步的两个账号创建成功后，则需要 workspaces-manager 创建企业空间并指定 ws-admin 为企业空间的管理员。

2.1. 切换为 ws-manager 登录 KubeSphere，点击控制台左上角 **平台管理 → 企业空间**，可以看到当前集群中所有企业空间的列表，新安装的环境只有 **system-workspace** 一个系统默认的企业空间，用于运行 KubeSphere 平台相关组件和服务，禁止删除该企业空间。在右侧点击 **创建** 按钮，企业空间的创建者同时默认为它的管理员 (workspace-admin)，拥有企业空间的最高管理权限。

![企业空间列表](/how-to-create-workspace.png)

2.2. 填写企业空间的基本信息。

- 企业空间名称：请尽量保持企业名称简短，便于用户浏览和搜索
- 企业空间管理员：可从当前的集群成员中指定，这里指定上一步创建的 `demo` 用户为管理员，相当于邀请 demo 用户进入该企业空间
- 描述信息：简单介绍该企业空间

![填写基本信息](/demo-workspace.png)

> 说明：企业空间管理的详细说明请参考 [企业空间管理](../../platform-management/workspace-management)。

### 第三步：创建项目和 DevOps 工程

#### 创建项目

创建工作负载、服务和 CI/CD 流水线等资源，需要先创建好项目和 DevOps 工程。

3.1. 当创建企业空间后，使用 `demo` 账号登录 KubeSphere，可以看到 cluster-admin 为其创建的企业空间。如果用户只有一个企业空间，登录进去后会直接进入该空间。左侧菜单栏选择 **项目管理**，点击 **创建项目**。

![企业空间列表](/workspace-list-demo.png)

3.2. 填写项目的基本信息和高级设置。

**基本信息**
- 名称：为项目起一个简洁明了的名称，便于用户浏览和搜索
- 别名：帮助您更好的区分资源，并支持中文名称
- 描述信息：简单介绍该项目

![创建项目](/create-project-basic.png)

**高级设置**

3.3. 此处可使用默认的请求值 (requests) 与限额值 (limits)，在项目使用过程中可根据实际情况再次编辑资源默认请求。高级设置是在当前项目中配置容器默认的 CPU 和内存的请求与限额，相当于是给项目创建了一个 Kubernetes 的 LimitRange 对象，在项目中创建工作负载后填写容器组模板时，若不填写容器 CPU 和内存的请求与限额，则容器会被分配在高级设置的默认 CPU 和内存请求与限额值。

完成高级设置后，点击 **创建**。

![高级设置](/namespace-limit-request-1.png)

> 说明：项目管理和设置的详细说明，请参考用户指南下的项目设置系列文档。

3.4. 示例项目创建成功，下一步需要创建 DevOps 工程。

![示例项目](/demo-namespace-list.png)

#### 创建 DevOps 工程

3.5. 在当前企业空间下，菜单栏选择 **DevOps 工程**，点击 **创建 DevOps 工程**，在弹窗中选择 **创建一个 DevOps 工程**。 

![创建 DevOps](/docs-demo-devops.png)

3.6. 输入 DevOps 工程的基本信息，点击 **创建**，注意创建一个 DevOps 有一个初始化环境的过程需要几秒钟。

![devops_create_project](/devops_create_project-1.png)

> 说明：DevOps 工程管理的详细说明请参考 [管理 DevOps 工程](../../devops/devops-project)。

![创建成功](/demo-devops-list1.png)

至此，项目和 DevOps 工程都已经创建完毕，当前 demo 用户可以在项目或工程下面再邀请成员并授予角色来参与项目或工程的协作，请参考 [快速入门](../quick-start-guide) 系列文档的 7 个示例，动手实践操作一遍，创建具体的工作负载、服务和 CI / CD 流水线。