---
title: "Overview of Role Management"
keywords: 'kubesphere, kubernetes, multi-tenancy, role management'
description: 'Overview of Role Management of KubeSphere'
---


In enterprise bussiness scenarios, the resource hierarchy of KubeSphere is divided into three levels:

- Cluster
- Workspace
- Project / DevOps Project
 
Multi-level design is also the basis to achieve multi-tenancy and resource isolation. For the user to create an account, the first by the cluster admin or workspace by invite new members to join the workspace, and then can be under the same corporate space project or enterprise project admin, invited to join the project and enterprise engineering, invited the admin can give the corresponding role for new members, and different roles with different operating rights, the role of the platform built in several commonly used for use. At the same time, the platform supports the admin to customize the role and permission list. The following describes the authority management and built-in roles at different levels.


## Role Permission Management


Roles are divided into three levels: cluster, workspace, and project/DevOps projects, which relate users to different levels of resources.


![角色权限管理关系](/role-management-design.svg)


## Built-in Role Permissions


The reason why multiple built-in roles are divided in cluster and cluster space is to conduct fine-grained management according to the permissions of different roles, so that members with different roles can more accurately view and manage resources in cluster or workspace. Only after the permissions of different roles are subdivided can the control and isolation of different resources in multi-tenant mode be more secure. The following figure summarizes which permissions different roles have in the cluster and workspace.


**Overview of Built-in Role Permissions**


![角色权限](/cluster-workspace-roles.png)


## Cluster Roles


Cluster includes user management, workspace management and resource management at the level of various clusters. Cluster level authority, mainly for nodes, cluster monitoring, storage type, workspace and other cluster level resource control.


**Built-in cluster role:**


|Built-in Roles|Description|
|---|---|
|cluster-admin |Cluster admin can manage all the resources in the cluster. |
|workspaces-manager| Manage workspaces including creating, deleting and managing the users of a workspace. |
|cluster-regular| Regular users, they do not have any resource operation rights before they are invited to join the workspace. |

**Workspace roles:**

Individual tenants, projects, and Devops projects are all in the workspace, which also has members that can be added from the cluster's user pool. When an workspace is created, the creator defaults to the admin role under that space. The admin of the workspace can create project, DevOps engineering resources in the workspace and invite users to join the workspace from the user pool of the cluster.


**Built-in workspace role:**


|Built-in Roles|Description|
|---|---|
|workspace-admin | Workspace manager, can manage all resources under the workspace. |
|workspace-regular| Workspace regular member to create projects and projects in the workspace. |
|workspace-viewer | Observer of the workspace to view all resource information in the workspace. |



## Project Roles


Cluster computing resource virtual partition, the project has a resource quota limit. When a project, DevOps project is created, the creator defaults to the admin role under the project or DevOps project. Users can be searched and added from the user pool under the workspace by the project admin, who invites members within the project.


**Built-in project role:**


|Built-in Roles|Description|
|---|---|
|admin | project manager, can manage all the resources under the project. |
|operator| project maintainer manages resources under the project in addition to users and roles. |
|viewer | project viewer that can view all the resources under a project. |


**Overview of built-in role permissions**


| Resource/Permission/Role |admin|operator|viewer|
|---|---|---|---|
| Projects management | view/edit/delete | view | view |
| Members management | view/create/edit/delete | /| /|
| Roles management | view/create/edit/delete | /| /|
| Deployments | view/create/edit/delete/scale | view/create/edit/delete/scale | view |
| Statefulsets | view/create/edit/delete/scale | view/create/edit/delete/scale | view |
| Daemonsets | view/create/edit/delete | view/create/edit/delete | view |
| Pods management | remote connection | remote connection | remote connection|
| Service manages | view/create/edit/delete | view/create/edit/delete | view |
| External Access management | view/create/edit/delete | view/create/edit/delete | view |
| Routers management to | view/create/edit/delete | view/create/edit/delete | view |
| Volume | view/create/edit/delete | view/create/edit/delete | view |
| Applications management | view/deploy/delete | view/deploy/delete | view |
| Jobs management | view/create/edit/delete | view/create/edit/delete | view |
| CronJobs management | view/create/edit/delete | view/create/edit/delete | view |
| Secrets management | view/create/edit/delete | view/create/edit/delete | view |
| CofigMaps management | view/create/edit/delete | view/create/edit/delete | view |


### The Role of DevOps

Facilitate fine-grained management of DevOps projects. The admin of the DevOps project search and add users from the user pool under the workspace.

**Built-in DevOps engineering roles:**

|Built-in Roles| Description |
|---|---|
|owner | the owner of the project, can do all the actions of the project. |
| Maintainer | can maintain credentials and pipeline configuration within the project. |
| Developer | can trigger and view pipeline. |
| Reporter | can check pipeline status. |