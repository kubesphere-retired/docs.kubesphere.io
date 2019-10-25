---
title: "DevOps Project Management"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## Prerequisites 

You need to create an account of `project-admin` role in advance, see the [Admin Quick Start](../admin-quick-start) if not yet.

## Create a DevOps 

1. Sign in with project-admin, choose `DevOps Projects` tap, then click **Create** and select **Create a DevOps project**.

![Create a DevOps](/docs-demo-devops-en.png)

2. Fill in the basic information for this DevOps project.

- Name: A concise and clear name for this DevOps project, which is convenient for users to browse and search, e.g. `demo-devops`.
- Description: A brief introduction to DevOps project.

![devops_create_project](/devops_create_project-1-en.png)

3. Then you will be able to view it has been created successfully. 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190321113132.png)

## View the DevOps Project

4. Enter into `demo-devops` page, it allows DevOps project admin to create CI/CD Pipelines and Credentials, as well as project management which includes basic information, roles and members. 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190321114818.png)

### Pipeline

Pipeline is a suite of plugins which supports implementing and integrating continuous delivery pipelines into Jenkins, see [Pipeline](../pipeline) for its details.

### Credentials

A DevOps project user can configure credentials in the application for dedicated use by Jenkins Pipeline. Once a user (e.g. Owner and Maintainer) adds/configures these credentials in DevOps project, the credentials can be used by DevOps projects to interact with these 3rd party applications, such as GitHub, GitLab, Docker Hub, etc. See [Credentials Management](../credentials) for how to use the credentials.


### Member Roles

Currently, there are 4 kind of built-in roles in DevOps project as following list:

- Owner: The owner of the DevOps project, with the highest authority of the project, can perform all operations.
- Maintainer: The maintainer of the DevOps project can perform credentials and pipeline configuration in the DevOps project.
- Developer: The developer of the DevOps project can trigger and view the pipeline.
- Reporter: The Observer of the DevOps project can only view the resources of the project.

### Project Members

Click on the **Project Members** to see which users are currently in the project. Click the **Invite Member** button to invite developer, testing, or operation colleagues to join this DevOps project. 

![Invite Project Members](https://pek3b.qingstor.com/kubesphere-docs/png/20190321133818.png)

You can search for the member name in the pop-up page, click the “+” sign on the right to invite members from the user pool in the workspace to join the current DevOps project for collaborative work. 

![Project Members Setting](https://pek3b.qingstor.com/kubesphere-docs/png/20190321134103.png)

For example, you can grant invite `project-regular` into this DevOps project, and grant `project-regular` as Maintainer.


Note that after the project-admin invites the member to the current DevOps project, in general, the resources (pipelines, credentials, etc.) created by the other members are visible to each other within the same group.

## Edit or Delete the DevOps Project

Choose **Project Management → Basic Info**, then click **···**, you will see the option for edit and delete button. It allows project admin to modify the basic information of this DevOps project.

![Edit or Delete the DevOps Project](https://pek3b.qingstor.com/kubesphere-docs/png/20190321143523.png)