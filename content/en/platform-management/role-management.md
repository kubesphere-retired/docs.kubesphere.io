---
title: "Platform Roles Management"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

As mentioned in [Account-Management](../account-management), role management is also a very important part of user management. Role management is used to manage the role information and authorities of platform users. Role is an identity generalization of the certain group of people with common characteristics. In the role management module, we need to describe the role information and set permission rules, so that admin can easily identify the characteristics of roles, and give corresponding role identities to different users to manage resources in a more fine-grained way. The platform has preset three common roles, i.e. cluster-admin, wordspace-manager and cluster-regular, as well as supports admin to add custom roles. This document describes the permissions of built-in roles and how to customize new roles.

## Prerequisites

You need an account for the `cluster-admin` role, then sign in KubeSphere.

## Create roles

Before creating a new role, understand what permissions the built-in cluster role has.

**Built-in cluster role:**

|Built-in Roles|Description|
|---|---|
|cluster-admin |cluster-admin can manage all the resources in the cluster. |
|workspaces-manager| Manage workspaces in the cluster including creating, deleting and managing the users of a workspace. |
|cluster-regular| Regular users, they do not have any resource operation rights before they are invited to join the workspace. |

The cluster-admin can view all the roles in the platform. If the above built-in roles do not meet the actual needs, the cluster-admin can customize the platform roles and permission rules. 

Click **Platform**, then select **Platform Roles** and click **Create**.

![create platform role](/create-platform-role-en.png)

## Authority Settings

1. Fill in the basic information.

- Name: a concise name for the application repository can help users to browse and search.
- Description: introduce the role in detail. When users want to know more about this role, this part will become particularly important.

2. Authority settings, which support fine-grained control of all resource operations (such as workspace, monitoring, account, role, storage class, etc.) in the platform. If a certain operation has been checked, it means that the user will have corresponding permissions. 

> Note: Delete operation is not reversible for resources in the platform, so choose carefully.

![permission Settings](/authority-management-en.png)

## Edit or delete roles

To modify the basic information or permission rules of the role, click **"..."** button on the right side of the role list to edit or delete the role.