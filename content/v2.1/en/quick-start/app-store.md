---
title: "Application Store"
keywords: 'kubepshere, kubernetes, docker, helm, openpitrix, application store'
description: 'Application lifecycle management in Helm-based application store'
---

KubeSphere integrates open source [OpenPitrix](https://github.com/openpitrix/openpitrix) to set up app store and app repository services which provide full lifecycle of application management. Application Store supports three kinds of application deployment as follows:

> - **Global application store** provides one-click deployment service for Helm-based applications. It provides nine built-in applications for testing.
> - **Application template** provides a way for developers and ISVs to share applications with users in a workspace. It also supports importing third-party application repositories within workspace.
> - **Composing application** means users can quickly compose multiple microservices into a complete application through the one-stop console.

![App Store](https://pek3b.qingstor.com/kubesphere-docs/png/20200212172234.png)

## Objective

In this tutorial, we will walk you through how to use [EMQ X](https://www.emqx.io/) as a demo application to demonstrate the **global application store** and **application lifecycle management**, also demonstrate application upload / review / test / release / upgrade / take down.

## Prerequisites

- You need to install [application store (OpenPitrix)](../../installation/install-openpitrix)
- You need to create a workspace and a project, see [Get started with multi-tenant management](../admin-quick-start).

## Hands-on Lab

### Step 1: Create Customized Role and Account

In this step, we will create two accounts, i.e. `workspace-admin` for ISV and `app-review` for app technical reviewer.

1.1. Log in KubeSphere console with the account `admin`, go to **Platform → Platform Roles**, then click **Create** and name it `app-review`, choose **App Template** in the authorization settings list, then click **Create**.

![Authorization Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20200212174022.png)

1.2. Create an account `reviewer`, and grant the role of **app-review** to it.

1.3. Similarly, create an account `isv`, and grant the role of **cluster-regular** to it.

![Create Roles](https://pek3b.qingstor.com/kubesphere-docs/png/20200212180757.png)

1.4. Invite the accounts that we created above to an existing workspace such as `demo-workspace`, and grant them the role of `workspace-admin`.

### Step 2: Upload and Submit Application

2.1. Log in KubeSphere with `isv`, enter the workspace and upload the EMQ X App to this workspace. First please download [EMQ X chart](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emqx-v1.0.0-beta.1.tgz) and click **Upload Template** by choosing **App Templates**.

![App Templates](https://pek3b.qingstor.com/kubesphere-docs/png/20200212183110.png)

2.2. Click **Upload**, then click **Upload Template** and click **Upload Helm Chart Package** to upload helm chart.

![Upload Template](https://pek3b.qingstor.com/kubesphere-docs/png/20200212183634.png)

2.3. Click **OK**, then [download EMQ Icon](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emqx-logo.png) click on the **Upload icon** to upload App logo. Click **OK** when you've done.

![EMQ Template](https://pek3b.qingstor.com/kubesphere-docs/png/20200212232222.png)

2.4. At this point, you'll be able to see the status displays `draft`, which means this App is in development. The uploaded App is visible for all members in the same workspace.

![Template List](https://pek3b.qingstor.com/kubesphere-docs/png/20200212232332.png)

2.5. Enter app template detailed page by clicking on EMQ X from the list, you can edit the basic information of this App, then click on the **Edit Info** to fill in the basic information table.

![Edit Template](https://pek3b.qingstor.com/kubesphere-docs/png/20200212232811.png)

2.6. You can customize the App's basic information by filling in the table as following screenshot.

![Customize Template](https://pek3b.qingstor.com/kubesphere-docs/png/20200213143953.png)

2.7. Save the basic information, then you'll be able to test this application by deploying to Kubernetes, click on the **Test Deploy** button.

![Save Template](https://pek3b.qingstor.com/kubesphere-docs/png/20200213152954.png)

2.8. Modify the namespace value to your project name in the parameters section, then click **Deploy**.

![Deploy Template](https://pek3b.qingstor.com/kubesphere-docs/png/20200213153820.png)

2.9. Wait for a few minutes, switch to the tab **Deployed Instances**, you can find EMQ X App has been deployed successfully.

![Template Instance](https://pek3b.qingstor.com/kubesphere-docs/png/20200213161854.png)

2.10. At this point, you can click `Submit Review` to submit this application to `reviewer`.

![Submit Template](https://pek3b.qingstor.com/kubesphere-docs/png/20200213162159.png)

2.11. As the following graph shown, the App status has been changed to `Submitted`, thus app reviewer can review, test and release to application store.

![Template Status](https://pek3b.qingstor.com/kubesphere-docs/png/20200213162811.png)

### Step 3: Review Application

3.1. Log out, then use `reviewer` account to log in to KubeSphere. Navigate to **Platform → App Management → App review**.

![Review List](https://pek3b.qingstor.com/kubesphere-docs/png/20200213163535.png)

3.2. Click **Review** from the list, then `Reviewer` can review the App's basic information, introduction, chart file and update log from the pop-up windown.

![EMQ Info](https://pek3b.qingstor.com/kubesphere-docs/png/20200213163802.png)

3.3. If this App are qualified with the standards, `Reviewer` can pass it accordingly.

### Step 4: Create Application Category

Depending on the business needs, `Reviewer` can create multiple categories for different types of applications, it's similar to tag, which can be used in application store to filter applications, e.g. Big data, Middleware, IOT, etc.

As for EMQ X application, we can create a Category and name it `IOT`.

![Create Category](https://pek3b.qingstor.com/kubesphere-docs/png/20200213172046.png)

Then click **Uncategorized** and find EMQ X, change its category to `IOT` and save it.

![Categorize EMQ](https://pek3b.qingstor.com/kubesphere-docs/png/20200213172311.png)

### Step 5: Release Application to Store

5.1. Log out and switch to use `isv` to log in KubeSphere, thus `isv` can release his EMQ X application to store, all users in this platform can easily find and deploy this application from global application store.

5.2. Enter the demo workspace and navigate to the EMQ X app template list, enter its detailed page and expand the version list, then click on the **Release to Store**, choose **OK** in the pop-up windown.

![Release EMQ](https://pek3b.qingstor.com/kubesphere-docs/png/20200213171324.png)

5.3. At this point, EMQ X has been released to application store.

![Audit Records](https://pek3b.qingstor.com/kubesphere-docs/png/20200213171705.png)

5.4. Choose `IOT` from the category list in application store.

![EMQ on Store](https://pek3b.qingstor.com/kubesphere-docs/png/20200213172436.png)

5.5. At this point, we can use any role of users to access EMQ X application. Click into the application detailed page to go through its basic information, you can click **Deploy** on the right, it enables you to click application to Kubernetes via one-click installation.

![Deploy EMQ](https://pek3b.qingstor.com/kubesphere-docs/png/20200213172650.png)

### Step 6: Add New Version

6.1. KubeSphere supports adding new versions for users to quickly upgrade. let's continue to use `isv` account and enter the EMQ X template page in the workspace.

![Create New Version](https://pek3b.qingstor.com/kubesphere-docs/png/20200213173325.png)

6.2. Download [EMQ X v2](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emqx-v1.0.0-beta.2.tgz), then click on the **New version** on the right, upload the package (emqx-v1.0.0-beta.2.tgz) that you just downloaded.

![Upload New Version](https://pek3b.qingstor.com/kubesphere-docs/png/20200213173744.png)

6.3. Click **OK** when you upload successfully.

![New Version Info](https://pek3b.qingstor.com/kubesphere-docs/png/20200213174026.png)

6.4. At this point, you can test deployment and submit this version to `Reviewer`, this process is similar to previous steps.

![Submit New Version](https://pek3b.qingstor.com/kubesphere-docs/png/20200213174256.png)

6.5. When you submit the version 2, the process of review and release are also similar to version 1 that we demonstrated above, so we will not add much description in this section.

### Step 7: Upgrade

After version 2 has been released to application store, all users can upgrade from this application.
