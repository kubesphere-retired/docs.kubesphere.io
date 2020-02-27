---
title: "多租户管理快速入门"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## 目的

本文档面向初次使用 KubeSphere 的集群管理员用户，引导新手用户创建企业空间、创建新的角色和账户，然后邀请新用户进入企业空间后，创建项目和 DevOps 工程，帮助用户熟悉多租户下的用户和角色管理，快速上手 KubeSphere。

## 前提条件

已安装 KubeSphere，并使用默认的 admin 用户名和密码登录了 KubeSphere。

## 预估时间

约 15 分钟。

## 操作示例

**视频演示**

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/KS2.1_1-multi-tenancy.mp4">
</video>

目前，平台的资源一共有三个层级，包括 **集群 (Cluster)、 企业空间 (Workspace)、 项目 (Project) 和 DevOps Project (DevOps 工程)**，层级关系如下图所示，即一个集群中可以创建多个企业空间，而每个企业空间，可以创建多个项目和 DevOps工程，而集群、企业空间、项目和  DevOps工程中，默认有多个不同的内置角色。


![](https://pek3b.qingstor.com/kubesphere-docs/png/20191026004813.png)

### 集群管理员

#### 第一步：创建角色和账号

平台中的 cluster-admin 角色可以为其他用户创建账号并分配平台角色，平台内置了集群层级的以下三个常用的角色，同时支持自定义新的角色。

|内置角色|描述|
|---|---|
|cluster-admin |集群管理员，可以管理集群中所有的资源。|
|workspaces-manager|集群中企业空间管理员，仅可创建、删除企业空间，维护企业空间中的成员列表。|
|cluster-regular|集群中的普通用户，在被邀请加入企业空间之前没有任何资源操作权限。|


本示例首先新建一个角色 (users-manager)，为该角色授予账号管理和角色管理的权限，然后新建一个账号并给这个账号授予 users-manager 角色。

|账号名|集群角色|职责|
|---|---|---|
|user-manager|users-manager|管理集群的账户和角色|

通过下图您可以更清楚地了解本示例的逻辑：
![](https://hello-world-20181219.pek3b.qingstor.com/KS2.1/%E5%A4%9A%E7%A7%9F%E6%88%B7%E7%AE%A1%E7%90%86%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8.png
)

1.1. 点击控制台左上角 **平台管理 → 平台角色**，可以看到当前的角色列表，点击 **创建**，创建一个角色用于管理所有账户和角色。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027144314.png)

1.2. 填写角色的基本信息和权限设置。

- 名称：起一个简洁明了的名称，便于用户浏览和搜索，如 `users-manager`
- 描述信息：简单介绍该角色的职责，如 `管理账户和角色`


1.3. 权限设置中，勾选账户管理和角色管理的所有权限，点击 **创建**，自定义的用户管理员的角色创建成功。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027144441.png)

1.4. 点击控制台左上角 **平台管理 → 账户管理**，可以看到当前集群中所有用户的列表，点击 **创建** 按钮。


1.5. 填写新用户的基本信息，如用户名设置为 `user-manager`，角色选择 `users-manager`，其它信息可自定义，点击 **确定**。

> 说明：上述步骤仅简单地说明创建流程，关于账号管理与角色权限管理的详细说明，请参考 [角色权限概览](../../multi-tenant/role-overview) 和 [账号管理](../../platform-management/account-management)。


1.6. 然后用 **user-manager** 账户登录来创建下表中的四个账号，`ws-manager` 将用于创建一个企业空间，并指定其中一个用户名为 `ws-admin` 作为企业空间管理员。切换 `user-manager` 账号登录后在 **账号管理** 下，新建四个账号，创建步骤同上，参考如下信息创建。

|用户名|集群角色|职责|
|---|---|---|
|ws-manager|workspaces-manager|创建和管理企业空间|
|ws-admin|cluster-regular|管理企业空间下所有的资源<br> (本示例用于邀请新成员加入企业空间)|
|project-admin|cluster-regular|创建和管理项目、DevOps 工程，邀请新成员加入|
|project-regular|cluster-regular|将被 project-admin 邀请加入项目和 DevOps 工程，<br>用于创建项目和工程下的工作负载、Pipeline 等资源|

1.7. 查看新建的四个账号信息。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027145948.png)

### 企业空间管理员

#### 第二步：创建企业空间

企业空间 (workspace) 是 KubeSphere 实现多租户模式的基础，是用户管理项目、DevOps 工程和企业成员的基本单位。

2.1. 切换为 `ws-manager` 登录 KubeSphere，ws-manager 有权限查看和管理平台的所有企业空间。

点击左上角的 `平台管理` → `企业空间`，可见新安装的环境只有一个系统默认的企业空间 **system-workspace**，用于运行 KubeSphere 平台相关组件和服务，禁止删除该企业空间。

在企业空间列表点击 **创建**；

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027150555.png)

2.2. 参考如下提示填写企业空间的基本信息，然后点击 **确定**。企业空间的创建者同时默认为该企业空间的管理员 (workspace-admin)，拥有企业空间的最高管理权限。

- 企业空间名称：请尽量保持企业名称简短，便于用户浏览和搜索，本示例是 `demo-workspace`
- 企业空间管理员：可从当前的集群成员中指定，这里指定上一步创建的 `ws-admin` 用户为管理员，相当于同时邀请了 `ws-admin` 用户进入该企业空间
- 描述信息：简单介绍该企业空间

![填写基本信息](/demo-workspace.png)

> 说明：企业空间管理的详细说明请参考 [企业空间管理](../../platform-management/workspace-management)。

2.3. 企业空间 `demo-workspace` 创建完成后，切换为 `ws-admin` 登录 KubeSphere，点击左侧「进入企业空间」进入企业空间详情页。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190512180433.png)

`ws-admin` 可以从集群成员中邀请新成员加入当前企业空间，然后创建项目和 DevOps 工程。在左侧菜单栏选择 `企业空间管理` → `成员管理`，点击 `邀请成员`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027151427.png)

2.4. 这一步需要邀请在 **步骤 1.6.** 创建的两个用户 `project-admin` 和 `project-regular` 进入企业空间，且分别授予 `workspace-regular` 和 `workspace-viewer` 的角色，此时该企业空间一共有如下三个用户：

|账号名|企业空间角色|职责|
|---|---|---|
|ws-admin|workspace-admin|管理企业空间下所有的资源<br> (本示例用于邀请新成员加入企业空间)|
|project-admin|workspace-regular|创建和管理项目、DevOps 工程，邀请新成员加入|
|project-regular|workspace-viewer|将被 project-admin 邀请加入项目和 DevOps 工程，<br>用于创建工作负载、流水线等业务资源|

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027151120.png)

### 项目和 DevOps 工程管理员

#### 第三步：创建项目

创建工作负载、服务和 CI/CD 流水线等资源之前，需要预先创建项目和 DevOps 工程。

3.1. 上一步将用户项目管理员 `project-admin` 邀请进入企业空间后，可切换为 `project-admin` 账号登录 KubeSphere，默认进入 demo-workspace 企业空间下，点击 **创建**，选择 **创建资源型项目**。

![创建项目](https://pek3b.qingstor.com/kubesphere-docs/png/20190428113548.png)

3.2. 填写项目的基本信息和高级设置，完成后点击 **下一步**。

**基本信息**
- 名称：为项目起一个简洁明了的名称，便于用户浏览和搜索，比如 `demo-project`
- 别名：帮助您更好的区分资源，并支持中文名称，比如 `示例项目`
- 描述信息：简单介绍该项目


**高级设置**

3.3. 此处将默认的最大 CPU 和内存分别设置 `1 Core` 和 `1000 Mi`，后续的示例都可以在这个示例项目中完成，在项目使用过程中可根据实际情况再次编辑资源默认请求。

完成高级设置后，点击 **创建**。

> 说明：高级设置是在当前项目中配置容器默认的 CPU 和内存的请求与限额，相当于是给项目创建了一个 Kubernetes 的 LimitRange 对象，在项目中创建工作负载后填写容器组模板时，若不填写容器 CPU 和内存的请求与限额，则容器会被分配在高级设置的默认 CPU 和内存请求与限额值。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027154343.png)

> 提示：项目管理和设置的详细说明，请参考用户指南下的项目设置系列文档。

##### 邀请成员

3.4. 示例项目 demo-project 创建成功后，点击进入示例项目。在 **步骤 2.4.** 已邀请用户 `project-regular` 加入了当前企业空间 `demo-workspace`，下一步则需要邀请 **project-regular** 用户进入该企业空间下的项目 demo-project。点击项目列表中的 demo-project 进入该项目。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027154644.png)

3.5. 在项目的左侧菜单栏选择 **项目设置 → 项目成员**，点击 **邀请成员**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027154722.png)

3.6. 在弹窗中的 `project-regular` 点击 `"+"`，在项目的内置角色中选择 `operator` 角色。因此，后续在项目中创建和管理资源，都可以由 `project-regular` 用户登录后进行操作。


##### 设置外网访问

在创建应用路由之前，需要先启用外网访问入口，即网关。这一步是创建对应的应用路由控制器，负责接收项目外部进入的流量，并将请求转发到对应的后端服务。

3.7. 请使用项目管理员 `project-admin` 设置外网访问，选择 「项目设置」 → 「外网访问」，点击 「设置网关」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027154926.png)

3.8. 在弹窗中，默认 NodePort 即可，然后点击 「保存」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190507222321.png)

> 提示：若希望开启 LoadBalancer 类型暴露集群内部服务，则需要安装云厂商支持 LoadBalancer 插件，例如 [QingCloud 负载均衡器插件](../../installation/qingcloud-lb)；若 KubeSphere 部署在阿里云或其它云平台，则需要手动安装其支持的 LB 插件；若 KubeSphere 部署在物理机环境，可安装配置 [Porter - 面向物理环境的 K8s LB 插件](https://github.com/kubesphere/porter)。

3.9. 当前可以看到网关地址、http/https 端口号都已经开启。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027155527.png)

#### 第四步：创建 DevOps 工程（可选）

> 说明：DevOps 功能组件作为可选安装项，提供 CI/CD 流水线、B2i/S2i 等丰富的企业级功能，若还未安装可参考 [自定义组件安装（安装后）](../../installation/components) 开启 DevOps 组件安装，然后参考以下步骤。

4.1. 继续使用 `project-admin` 用户创建 DevOps 工程。点击 **工作台**，在当前企业空间下，点击 **创建**，在弹窗中选择 **创建一个 DevOps 工程**。DevOps 工程的创建者 `project-admin` 将默认为该工程的 Owner，拥有 DevOps 工程的最高权限。

![创建 DevOps 工程](https://pek3b.qingstor.com/kubesphere-docs/png/20190428131518.png)

4.2. 输入 DevOps 工程的名称和描述信息，比如名称为 `demo-devops`。点击 **创建**，注意创建一个 DevOps 有一个初始化环境的过程需要几秒钟。

> 说明：DevOps 工程管理的详细说明请参考 [管理 DevOps 工程](../../devops/devops-project)。

4.3. 点击 DevOps 工程列表中的 `demo-devops` 进入该工程的详情页。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027160905.png)

4.4. 同上，这一步需要在 `demo-devops` 工程中邀请用户 `project-regular`，并设置角色为 `maintainer`，用于对工程内的 Pipeline、凭证等创建和配置等操作。菜单栏选择 **工程管理 → 工程成员**，然后点击 **邀请成员**，为用户 `project-regular` 设置角色为 `maintainer`。后续在 DevOps 工程中创建 Pipeline 和凭证等资源，都可以由 `project-regular` 用户登录后进行操作。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191027160949.png)


至此，本文档为您演示了如何在多租户的基础上，使用账户管理和角色管理的功能，以示例的方式介绍了常用内置角色的用法，以及创建项目和 DevOps 工程。请继续参考 [快速入门](../quick-start-guide) 系列的第二篇文档。
