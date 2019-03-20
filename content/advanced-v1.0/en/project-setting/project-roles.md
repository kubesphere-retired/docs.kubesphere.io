---
title: "Member Roles"
---

User rights management relies on role definitions, which identify the user's identity and define the relationship between the user and the resources that are accessible/operable. When the KubeSphere Pre-configuration role does not meet the usage requirements, you can create a custom role for the user based on the actual situation. The biggest advantage of the custom role is the fine-grained management of the platform resources. Specify which of the specified resources the role has. Permissions.

## Creating a Role  

Log in to the KubeSphere Management Console, go to the created project, go to the left menu bar and select **Project Settings → Member Roles**. As a project administrator, you can view all the role information under the current project.

Click the **Create** button to create a role, fill in the basic information and set permissions.

### Step 1: Fill in the basic information

- Name: A concise name for the role, so that users can quickly understand the meaning of the role.
- Descriptive information: Describes the characteristics of the role in detail. When the user wants to know more about the role, the description will become more important.

![role basic information] (/ae-role-basic.png)

### Step 2: Permission Settings

In the permission setting, the administrator can customize the operation authority of a role to have KubeSphere platform resources, and select the permission rules required for the role, such as viewing, creating, editing, and horizontal scaling of the deployment.

![](/ae-role-setting.png)


## View role details

On the Role List page, click on a role to open the Role Details page to see the current list of role permissions and authorized users.

![role details](/ae-role-details.png)

## Modify role permissions

Go to the role details page and click the **Edit Info** button for the role name and description.

## Deleting a role

Go to the role details page and click the **Delete** button to delete the role. Note that you need to unbind the user associated with the role before deleting the role. The role in use cannot be deleted.