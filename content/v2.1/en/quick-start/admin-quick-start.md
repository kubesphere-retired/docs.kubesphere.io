---
title: "Getting Started with Multi-tenant Management"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---


## Objective

This is the first lab exercise of KubeSphere. We strongly suggest you to learn it with your hands. This guide shows how to create workspace, role and user account which are required for next lab exercises. After inviting user to the created workspace, you will learn how to create project and DevOps project within your workspace. After this lab, you will get familiar with the multi-tenant management system.

## Prerequisites

You need to have a KubeSphere installed, and log in the environment with admin account.

## Estimated Time

About 15 minutes


## Hands-on Lab

KubeSphere system is organized into **three** hierarchy levels which are Cluster, Workspace and Project. Here a project is a Kubernetes namespace.

As shown below, you can create multiple workspaces within a Kubernetes cluster. Under each workspace you can also create multiple projects.

For each level, there are multiple built-in roles. It allows you to create role with customized authorization as well. This hierarchy is appropriate for enterprise uaers who have different teams or groups, as well as different roles within each team.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105121616.png)

### Cluster Admin

#### Step 1: Create roles and accounts

The cluster-admin can create accounts and assign roles for other users. There are three built-in roles in the cluster level as shown below.

| Built-in Roles | Description |
| --- | --- |
| cluster-admin | Has the privilege to manage any resources in the cluster. |
| workspaces-manager | Be able to manage all workspaces and the resource in any workspace including projects and the DevOps projects. |
| cluster-regular | Regular users have no authority to manage resources before being invited to a workspaces. The access right is decided by the role invited to a specific workspace or project.|



Here is an example showing you how to create a new `role` named _users-manager_, grant **account management** and **role management** capabilities to the role, then create a new `account` named _user-manager_ and grant it the users-manager role.

| Account Name | Cluster Role | Responsibility |
| --- | --- | --- |
| user-manager | users-manager | Manage cluster accounts and roles |



1.1 Click **Platform** **→** **Platform Roles**. You can see the role list as follows. Click **Create** to create a role which is used to manage all accounts and roles.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716112614.png#align=left&display=inline&height=998&originHeight=998&originWidth=2822&search=&status=done&width=2822)

1.2. Fill in the basic information and authority settings of the role.

  - Name: `users-manager`
  - Description: Describe the role's responsibility, here we type `Manage accounts and roles`


1.3. Check all the authorities for account management and role management; then click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105151033.png)

1.4. Click **Platform→Accounts**. You can see the account list in the current cluster. Then click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716112945.png#align=left&display=inline&height=822&originHeight=822&originWidth=2834&search=&status=done&width=2834)

1.5. Fill in the new user's basic information. Set the username as `user-manger`; select the role `users-manger`. Other items can be customized. Then click **OK** to create this account.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105152641.png)

1.6. Then use **user-manager** to create the following four accounts which will be used in next lab exercises. `ws-manger` will be used to create a workspace and assign the `ws-admin` as the workspace manager. Switch to use the `user-manger` account and log in KubeSphere, enter **Platform** → **Account**, then create four accounts in the following table.

| Account Name | Cluster Role | Responsibility |
| --- | --- | --- |
| ws-manager | workspaces-manager | Create and manage all workspaces |
| ws-admin | cluster-regular | Manage all resources under the specified workspace  (This example is used to invite new members to join the workspace.) |
| project-admin | cluster-regular | Create and manage projects and invite new members into the projects |
| project-regular | cluster-regular | The regular user will be invited to the project by the project-admin. We use this account to create workloads and other resources under the specified project. |



1.7. Verify the four accounts that we have created.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716114245.png#align=left&display=inline&height=1494&originHeight=1494&originWidth=2794&search=&status=done&width=2794)


### Workspace Admin


#### Step 2: Create a Workspace

Workspace is the base for KubeSphere's multi-tenant management. It's also the basic logic unit for projects, DevOps projects and organization members.

2.1. Log in KubeSphere with `ws-manager` which has the authority to check and manage all workspaces on the platform.

Click `Platform`→ `Workspace` on the left top corner. You can see there is only one default workspace **system-workspace**, for running system related components and services. You are not allowed to delete this workspace.

Click **Create** in the workspace list:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716130007.png#align=left&display=inline&height=736&originHeight=736&originWidth=1804&search=&status=done&width=1804)

2.2. Logout and sign in with `ws-admin` after `demo-workspace` has been created. Then click **View Workspace**, select **Workspace Settings → Workspace Members** and click **Invite Member**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105155226.png)

2.3. Invite both `project-admin` and `project-regular` and grant them `workspace-regular` accordingly, click **OK** to save it. Now there are three members in the `demo-workspace`.

| User Name | Role in the Workspace | Responsibility |
| --- | --- | --- |
| ws-admin | workspace-admin | Manage all resources under the workspace (We use this account to invite new members into the workspace) |
| project-admin | workspace-regular | Create and manage projects, DevOps projects, and invite new members to join |
| project-regular | workspace-viewer | Will be invited by project-admin to join the project and DevOps project. We use this account to create workloads, pipelines, etc |


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716130517.png#align=left&display=inline&height=1146&originHeight=1146&originWidth=1318&search=&status=done&width=1318)


### Project Admin and DevOps Admin


#### Step 3: Create a Project

3.1. Sign in with `project-admin` that we created in Step 1, then click **Create** and select **Create a resource project**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716131852.png#align=left&display=inline&height=1322&originHeight=1322&originWidth=2810&search=&status=done&width=2810)

3.2. Name it as `demo-project`, then set the CPU limit as 1 Core and memory limit as 1000 Mi in the Advanced Settings, then click **Create**.

3.3. Choosing **Project Settings → Project Members** and click **Invite Member**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105160247.png)

3.4. Invite `project-regular` to this project and grant this user **operator** accordingly.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716132840.png#align=left&display=inline&height=1038&originHeight=1038&originWidth=1646&search=&status=done&width=1646)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716132920.png#align=left&display=inline&height=518&originHeight=518&originWidth=2288&search=&status=done&width=2288)


#### Step 4: Set the Gateway

Before creating a route, you need to enable a gateway for this project, the gateway is a [Nginx ingress controller](https://github.com/kubernetes/ingress-nginx) of each K8s namespace.

4.1. We still use `project-admin`, Choose **Project Settings → Advanced Settings** and click **Set Gateway**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105161214.png)

4.2. Keep the access method as `NodePort` and click `Save`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716134742.png#align=left&display=inline&height=946&originHeight=946&originWidth=2030&search=&status=done&width=2030)

4.3. Now we are able to see the Gateway Address (192.168.0.53
), the NodePort of http and https respectively.

> Note: If you want expose services using LoadBalancer type, it requires the [LoadBalancer plugin of cloud provider](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/), if your K8s cluster are running on bare metal environment, we recommend you to adopt [Porter](https://github.com/kubesphere/porter) as your LoadBalancer plugin.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105161335.png)

#### Step 5: Create DevOps Project (Optional)

> Prerequisite: You have to install [KubeSphere DevOps system](../../installation/install-devops), which is a pluggable component provides CI/CD pipeline, Binary-to-image and Source-to-image features.

5.1. In this step, we still use `project-admin` to demonstrate. Click **Workbench** and click `Create` button, then select **Create a DevOps project**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105162512.png)

5.2. Fill in the basic information, e.g. `demo-devops`, then click **Create** button, it will jump to `demo-devops` page.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105162623.png)

5.3. Similarly, navigate to **Project Management → Project Members**, then click **Invite Member** and grant `project-regular` as the role of `maintainer`, which is used to create pipeline, credentials, etc.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200105162710.png)

Congratulations! You've been familiar with KubeSphere multi-tenant management mechanism. In the next few tutorials, we will use account `project-regular` to demonstrate how to create applications and resources under project and DevOps project.
