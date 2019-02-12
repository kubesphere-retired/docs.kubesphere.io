---
title: "Admin Quick Start Guide"
---

## Target

This document is intended for cluster admin who are new to KubeSphere, guiding users to create workspace, creating new roles and accounts, and then inviting new users into the workspace to create their projects and DevOps projects, as well as guiding cluster admin to use the web Kubectl tool. Help users become familiar with users and roles management under multi-tenancy, and the use of web Kubectl tools to get started with KubeSphere.

## Prerequisites

- You need to install KubeSphere to the target machine. 
- You need a default admin account which is used to log in to KubeSphere.

### Estimated time

About 15 minutes.

## Example

### Cluster Admin

#### Step 1: Create roles and accounts

The cluster-admin role is able to create accounts for other users and assign them roles. There are three common roles:

- cluster-admin
- cluster-regular 
- workspaces-manager

As well as support user-defined roles which is much fine-grained.

This example first creates a new role (user-manager), grants account management and role management permissions to the role, then creates an account and grants the user-manager role to the account.

|Account Name|Cluster Role|Responsibility|
|---|---|---|
|user-manager|user-manager|Manage cluster accounts and roles|

1.1 Click **Platform**, then navigate to **Platform Roles** page and click **Create** to create a role which is used to manage all accounts and roles.

![create roles](/admin-create-role-en.png)

1.2. Fill in the basic information and permission settings of the role.

- Name: A simple and concise name for users to browse and search, such as user-manager.
- Description: A brief description of the role, such as managing accounts and roles.

![基本信息](/role-basic-en.png)

1.3. Check all of the boxes for both Account Management and Role Management, then click **Create**.

![权限列表](/authority-list-en.png)

1.4. Click **Platform**, then navigate to **Accounts** page and click **Create** to create a account.

![创建账号](/account-list-en.png)

1.5. Fill in the basic information, notice that select `user-manger` as its role.
 
![添加用户](/demo-account-en.png)

1.6. Sign in with the `user manager`, then navigate to **Account** and create 4 accounts according to the following chart. Please reference the above steps to create these 4 accounts since .

|Account Name|Cluster Role|Workspace Role|Responsibility|
|---|---|---|---|
|ws-manager|workspaces-manager|workspace-admin (Default)|Create and manage all workspaces|
|ws-admin|cluster-regular|workspace-admin|Manage all resources under the workspaces<br> (This example is used to invite new members to join the workspace.)|
|project-admin|cluster-regular|workspace-regular|Create and manage projects, DevOps projects, invite new members|
|project-regular|cluster-regular|workspace-regular|The user named project-regular will be invited to the project and DevOps project by the project-admin, <br> and project-regular is used to create workloads, Pipeline and other resources under the project|

1.7. Verify the newly created four accounts.

![查看账号列表](/user-manager-list-en.png)

### Workspace Admin

#### Step 2: Create a Workspace

KubeSphere Workspace is multi-tenancy based and is the basic unit for projects, DevOps projects, and workspace members management.

2.1. Sign in with `ws-manager` who is able to manage all workspaces.

There is only a system-workspace which is used to run the related components and services in KubeSphere, do not delete system-workspace.

First, click **Create** button.

![企业空间列表](/how-to-create-workspace-en.png)

2.2. Fill in the basic information according to the following screenshot. Generally, the creator of the workspace also serve as the workspace admin who has the highest administrative rights of the workspace.

![填写基本信息](/demo-workspace-en.png)

2.3. Sign in with `ws-admin` after `demo-workspace` has been created. Then choose **Worksapce Management → Members Management** and click **Invite Member**.

![邀请成员](/workspace-member-list-en.png)

2.4. Invite both `project-admin` and `project-regular` and grant them `workspace-regular` accordingly.

![邀请 project-regular](/invite-operator-user-en.png)

### Project and DevOps Admin

#### Step 3: Create a Project

3.1. Sign in with `project-admin` and choose **create**, then select **Create a resource project**.

![企业空间列表](/workspace-list-demo-en.png)

3.2. Fill in the basic information and advanced settings of the project according to the following screenshot, then click **Next**.

![创建项目](/create-project-basic-en.png)

3.3. The requests and limits can be remained as default value if you don't have special requirements. You can click **create** directly using the default values in this demo.

![高级设置](/namespace-limit-request-1-en.png)

3.4. Enter into the demo-namespace, then invite `project-regular` to demo-namespace.

3.5. Choosing **Project Settings → Project Members** and click **Invite Member**.

![邀请成员](/invite-operator-to-ns-en.png)

3.6. Invite `project-regular` to this project and grant this user **operator** accordingly.

![邀请 operator](/grant-role-to-operator-en.png)

#### Step 4: Create DevOps Project

4.1. In this step, navigate to the **Workbench** and choose `DevOps Projects` tap, then click **Create** and select **Create a DevOps project**.

![创建 DevOps](/docs-demo-devops-en.png)

4.2. Fill in the basic information, e.g. `demo-devops`.

![devops_create_project](/devops_create_project-1-en.png)

4.3. Enter into `demo-devops` page.

4.4. Similarly, navigate to **Project Management → Project Members**. Then click **Invite Member** and grant `project-regular` as the role of `maintainer`, which is used to create pipeline, credentials, etc.



