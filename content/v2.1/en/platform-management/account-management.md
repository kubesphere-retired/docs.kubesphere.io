---
title: "Account Management"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

User management usually consists of three parts, account management, role and authority management, which are the necessary modules of any product. Account management is the most commonly used function of the administrator. The cluster-admin role in the platform allows you to create accounts and assign platform roles to other users, as well as three commonly used roles built in for admin. This document explains how to create an account for a new user.


## Prerequisites


You need an account of cluster-admin role and sign in KubeSphere, see the [Admin Quick Start](../admin-quick-start) if not yet.


## Create an Account


1. Click the top left corner of the console **Platform → Account**, you can see the list of all users in the current cluster, it also supports search by user name, then click **Create** button.

![left sidebar](/left-sidebar-account.png)


2. Fill in the basic information of the new user, and the built-in roles are shown in the table below.

**Built-in cluster role:**

|Built-in Roles|Description|
|---|---|
|cluster-admin |Cluster admin can manage all the resources in the cluster. |
|workspaces-manager| Manage workspaces including creating, deleting and managing the users of a workspace. |
|cluster-regular| Regular users, they do not have any resource operation rights before they are invited to join the workspace. |

![create account](/create-account.png)

Click **OK** when you're done.

## Edit or Delete Accounts

Click the right side of the list **"..."** to edit or delete the user account.

## Change Password

If you need to change your account password, click the account you have created to enter the account details page, and click **More → Modify Password**.