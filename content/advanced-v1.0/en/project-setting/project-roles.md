---
title: "Member Roles"
---

User rights and access management relies on role definitions, which identify the user's identity and define the relationship between the user and the resources that are accessible/operable. When the built-in role does not meet the usage requirements, you can create a custom role for the user based on the actual scenario. The biggest advantage of the custom role is the fine-grained management of the platform resources. Specify which of the specified resources the role has Permissions.

## Prerequisites

You need to create a `project-admin` and `ws-admin`, see the [Admin Quick Start](../admin-quick-start) if not yet.

## Create a Role  

Sign in with project-admin, enter into one project (e.g. demo-namespace), then select **Project Settings → Member Roles**.

![Create a Role](https://pek3b.qingstor.com/kubesphere-docs/png/20190320171425.png)

### Step 1: Fill in the Basic Information

Click the **Create** button to create a role, fill in the basic information and set permissions.

For example, we can create a workload-operator role who only owns the workload operation access.

- Name: A concise and clear name for this ConfigMap, which is convenient for users to browse and search.
- Description: A brief introduction to ConfigMap.

![Basic Information](https://pek3b.qingstor.com/kubesphere-docs/png/20190320172524.png)

### Step 2: Authority Settings

In the authority settings table, the project admin can customize the authority rules of a role to manipulate platform resources, and check the authority settings which are required for the role, such as view, create, edit, and scale out/in of the workload.

> Note: Delete authority on resources should be granted carefully.

![Authority Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190320172701.png)

## View Authority Details

On the Role List page, click on the role (workload-operator), enter into the role details page to see the current list of role permissions and authorized users.

![View Authority Details](https://pek3b.qingstor.com/kubesphere-docs/png/20190320173823.png)

## Modify the Role Authority

Click on the **Edit** button to update description and the authority rules.

## Deleting a Role

Click the **Delete** button to delete the role. Note that you need to unbind the user associated with the role before deleting the role firstly. The role in using cannot be deleted.