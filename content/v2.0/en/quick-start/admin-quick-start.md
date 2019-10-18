---
title: "Getting Started with Multi-tenant Management"
keywords: ''
description: ''
---
 

## Objective

This guidebook is for new KubeSphere's cluster amin users. The aim is to lead you to create workspaces, roles and user accounts. After inviting the new users to the workspace, you will learn how to create projects and learn about DevOps projects. By familiarizing you with the accounts and multi-tenant management, this guidbook will help you start KubeSphere quickly.

## Prerequisites

- KubeDphere has been installed.
- KubeSphere has been logged in with the default admin username and its password.


## Estimated Time

- About 15 minutes.


## Hands-on Lab

Currently, the platform resources have three levels which are Cluster, Project and DevOps Project. As it shown below, there are multiple built-in roles in each organization and in each level.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716231511.png#align=left&display=inline&height=746&originHeight=746&originWidth=1694&search=&status=done&width=1694)


### Cluster Admin

#### Step 1: Create roles and accounts

The cluster-admin can create accounts and assign roles for other users. There are three common roles in the cluster level. The platform also supports customizing new roles.

| Built-in Roles | Descripition |
| --- | --- |
| cluster-admin | Have the privilage to manage any resources in the cluster. |
| workspaces-manager | Be able to manage all the workspaces and the belonging projects and the enginerring resources. |
| cluster-regular | Regular users have no authority to manage resources after being invited to the workspaces. |



Here is an example showing you how to create a new role (user-manager), grant the role account management and role management permission and how to create a new account and grant it as the users-manager.

| Account Name | Cluster Role | Responsibility |
| --- | --- | --- |
| user-manager | user-manager | Manage cluster accounts and roles |



1.1 Click **Platform** **→** **Platform Roles**. You can see the role list as follows. Click **Create** to create a role which is used to manage all accounts and roles.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716112614.png#align=left&display=inline&height=998&originHeight=998&originWidth=2822&search=&status=done&width=2822)

1.2. Fill in the basic information and authority settings of the role.

- Name: Use a simple name for browse and search such as `user-manager`.
- Description: Describe the role's responsibility, such as `Manage accounts and roles`.

1.3. Check all the authorities for accound and role management; then click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716112826.png#align=left&display=inline&height=616&originHeight=616&originWidth=1944&search=&status=done&width=1944)

1.4. Click **Platform→Accounts**. You can see the account list in the current cluster. Then click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716112945.png#align=left&display=inline&height=822&originHeight=822&originWidth=2834&search=&status=done&width=2834)

1.5. Fill in the new user's basic information. Set the username as `user-manger`; select the role `user-manger`. Other information can be customized. Then click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716113050.png#align=left&display=inline&height=1216&originHeight=1216&originWidth=1366&search=&status=done&width=1366)

1.6. Then use user-manager to create the following 4 accounts. `ws-manger` will be used to crease a workspace and assign the `ws-admin` as the workspace manager. Shift to the `user-manger` account and log into KubeSphere. Under the **Account**, create 4 accounts as mentioned above. Please refer to the following information for your accounts.

| Account Name | Cluster Role | Responsibility |
| --- | --- | --- |
| ws-manager | workspaces-manager | Create and manage all workspaces |
| ws-admin | cluster-regular | Manage all resources under the specified workspace
 (This example is used to invite new members to join the workspace.) |
| project-admin | cluster-regular | Create and manage projects, DevOps projects, invite new members |
| project-regular | cluster-regular | The regular user will be invited to the project and DevOps project by the project-admin, 
 we use this account to create workloads, pipelines and other resources under the specified project |



1.7. Verify the 4 accounts that we have created.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716114245.png#align=left&display=inline&height=1494&originHeight=1494&originWidth=2794&search=&status=done&width=2794)


### Workspace Admin


#### Step 2: Create a Workspace

Workspace is the base for KubeSphere's multi-tenant mode. It's also the base unit for user management projecs, DevOps projects and corporate members.

2.1. Log in KubeSphere with `ws-manager` which has the authority to check and manage all the workspaces on the platform.

Click `platform management`→ `Workspace` on the left top corner. You can see there is only one default workspace **system-workspace**, for running KubeSphere platform's related components and services. You are forbidden to delete this workspace.

Click **Creare** in the workspace list:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716130007.png#align=left&display=inline&height=736&originHeight=736&originWidth=1804&search=&status=done&width=1804)

2.2. Logout and sign in with `ws-admin` after `demo-workspace` has been created. Then click **View Workspace**, select **Worksapce Management → Members Management** and click **Invite Member**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716130330.png#align=left&display=inline&height=882&originHeight=882&originWidth=2822&search=&status=done&width=2822)

2.3. Invite both `project-admin` and `project-regular` and grant them `workspace-regular` accordingly, click **OK** to save it. Now there are 3 members in the `demo-workspace`.

| User Name | Role in the Workspace | Responsibility |
| --- | --- | --- |
| ws-admin | workspace-admin | Manage all resources under the workspace
 (We use this account to invite new members into the workspace) |
| project-admin | workspace-regular | Create and manage projects, DevOps projects, and invite new members to join |
| project-regular | workspace-viewer | Will be invited by project-admin to join the project and DevOps project. 
 we use this account to create workloads, pipelines, etc |



![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716130517.png#align=left&display=inline&height=1146&originHeight=1146&originWidth=1318&search=&status=done&width=1318)


### Project Admin and DevOps Admin


#### Step 3: Create a Project

3.1. Sign in with `project-admin` that we created in Step 1, then click **Create** and select **Create a resource project**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716131852.png#align=left&display=inline&height=1322&originHeight=1322&originWidth=2810&search=&status=done&width=2810)

3.2. Name it as `demo-project` and keep the advanced settings as the default values, then click **Create**.

3.3. Choosing **Project Settings → Project Members** and click **Invite Member**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716132750.png#align=left&display=inline&height=1230&originHeight=1230&originWidth=2826&search=&status=done&width=2826)

3.4. Invite `project-regular` to this project and grant this user **operator** accordingly.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716132840.png#align=left&display=inline&height=1038&originHeight=1038&originWidth=1646&search=&status=done&width=1646)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716132920.png#align=left&display=inline&height=518&originHeight=518&originWidth=2288&search=&status=done&width=2288)


#### Step 4: Set the Gateway

Before creating a route, you need to enable a gateway for this project.

4.1. We still use `project-admin`, Choose **Project Settings → Internet Access** and click **Set Gateway**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716134430.png#align=left&display=inline&height=1204&originHeight=1204&originWidth=2816&search=&status=done&width=2816)

4.2. Keep the access method as `NodePort` and click `Save`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716134742.png#align=left&display=inline&height=946&originHeight=946&originWidth=2030&search=&status=done&width=2030)

4.3. Now we are able to see the Gateway Address (192.168.0.88), the NodePort of http and https respectively.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716134849.png#align=left&display=inline&height=770&originHeight=770&originWidth=2848&search=&status=done&width=2848)


#### Step 5: Create DevOps Project

5.1. In this step, click **Projects** and click `Create Project` button, then select **Create a DevOps project**.

5.2. Fill in the basic information, e.g. `demo-devops`, then click **Create** button, it will jump to `demo-devops` page.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716133420.png#align=left&display=inline&height=922&originHeight=922&originWidth=2832&search=&status=done&width=2832)

5.3. Similarly, navigate to **Project Management → Project Members**, then click **Invite Member** and grant `project-regular` as the role of `maintainer`, which is used to create pipeline, credentials, etc.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716133626.png#align=left&display=inline&height=692&originHeight=692&originWidth=2304&search=&status=done&width=2304)