---
Title: "Platform Roles Management"
---

As mentioned in [account-management](../account-management), role management is also a very important part of user management. Role management is used to manage the role information of platform users. Role is a generalization of the identity of a certain group of people with common characteristics. In the role management module, we need to describe the role information and set permission rules, so that administrators can easily identify the characteristics of roles, and give corresponding role identities to different users to manage resources in a more granular way. The platform has preset three common roles, cluster-admin, wordspace-manager and cluster-regular, and supports administrator custom roles. This document describes the permissions of built-in roles and how to customize new roles.

## Prerequisites

An account for the cluster-admin role already exists and is logged into the console.

## Create roles

Before creating a new role, understand what permissions the built-in cluster role has.

**Built-in cluster role:**

|Built-in Roles|Description|
|---|---|
|cluster-admin |Cluster admin can manage all the resources in the cluster. |
|workspaces-manager| Manage all the workspaces in the cluster and the projects and engineering resources below. |
|cluster-regular| Regular users, they do not have any resource operation rights before they are invited to join the workspace. |

The cluster-admin can view all the roles in the platform. If the above roles do not meet the actual needs, the administrator can customize the platform roles and permission rules. Under platform management, select ** platform role ** and click create.

! [create platform role](/ create-platform-role-png)

## Authority Settings

1. Fill in the basic information.

- name: give a clear and concise name to the role for users to browse and search.
- description information: introduce the workspace in detail. When users want to know more about the workspace, the description content will become particularly important.

2. Permission setting, which supports fine-grained control of all resource operations (such as workspace, monitoring, account, role, storage type, etc.) in the platform. If a certain operation is checked, it means that the user will have corresponding permissions. Deletion is not reversible for resources in the platform, so choose carefully.

! [permission Settings](/authority-management-en.png)

## Edit or delete roles

To modify the basic information or permission rules of the role, click the ** "... "** button on the right side of the role list to edit or delete the role.