---
title: "Application Store"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere integrates open source [OpenPitrix](https://github.com/openpitrix/openpitrix) to set up app store and app repository services which provides full lifecycle of application management. Application Store supports three kinds of application deployment as follows:

> - **Global application store** provides one-click Deployment service for Helm-based applications, integrates ten common applications for testing, supports application lifecycle management.
> - **Application template**, developers and ISV can share applications with users in a workspace, also supports import 3rd-party application repository into workspace.
> - **Composing Application**, means users can quickly compose multiple microservices into a complete application through this kind of creation.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200212172234.png)

## Objective

In this tutorial, we will walk you through how to use [EMQ X](https://www.emqx.io/) as a demo application to demonstrate the **global application store** and **application lifecycle management**, also demonstrates application upload / review / test / release / upgrade / take down.

## Prerequisites

- You need to install [application store (OpenPitrix)](../../installation/install-openpitrix)
- You need to create a workspace and project, see [Get started with multi-tenant management](../admin-quick-start).

## Create Customized Role and Account

In this step, we will create two accounts, i.e. **workspace-admin** (as ISV) and **app-review** (as technical reviewer).

1. Create the role of **app-review** by choosing **Platform → Platform Roles**, then click **Create** and name it **app-review**, choose **App Template** in the authority settings list.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200212174022.png)

Click **Create** when you've done.

2. Create an account and set user name as `reviewer`, then grant the role of **app-review** to this account.

3. Similarly, create an account and name it `isv`, and grant the role of **cluster-regular** to `isv`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200212180757.png)

4. Use `admin` account to invite two accounts that we created above to an existing workspace, and grant them the role of `workspace-admin`.

## Upload and Submit Application

1. Log in KubeSphere with `isv`, enter existing workspace and upload the EMQ X App to this workspace, please download [EMQ X chart](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emqx-v1.0.0-beta.1.tgz) and click **Upload Template** by choosing **App Templates**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200212183110.png)

2. Click **Upload**, then click **Upload Template** and click **Upload Helm Chart Package** to upload helm chart.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200212183634.png)

3. Click **OK**, then [download EMQ Icon](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emqx-logo.png) click on the **Upload icon** to upload App logo. Click **OK** when you've done.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200212232222.png)

4. At this point, you'll be able to see the status displays `draft`, which means this App is in development. The uploaded App is visible for all members in the same workspace.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200212232332.png)

5. Enter app template detailed page by clicking on EMQ X from the list, you can edit the basic information of this App, then click on the **Edit Info** to fill in the basic information table.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200212232811.png)

6. You can customize the App's basic information by filling in the table as following screenshot.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213143953.png)

7. Save the basic information, then you'll be able to test this application by deploying to Kubernetes, click on the **Test Deploy** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213152954.png)

8. Modify the namespace value to your project name in the parameters section, then click **Deploy**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213153820.png)

9. Wait for a few minutes, switch to the tab **Deployed Instances**, you can find EMQ X App has been deployed successfully.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213161854.png)

10. At this point, you can click `Submit Review` to submit this application to `reviewer`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213162159.png)

11. As the following graph shown, the App status has been changed to `Submitted`, thus app reviewer can review, test and release to application store.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213162811.png)

## Review Application

1. Log out, then use `reviewer` account to log in to KubeSphere. Navigate to **Platform → App Management → App review**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213163535.png)

2. Click **Review** from the list, then `Reviewer` can review the App's basic information, introduction, chart file and update log from the pop-up windown.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213163802.png)

3. If this App are qualified with the standards, `Reviewer` can pass it accordingly.

## Create Application Category

Depending on the business needs, `Reviewer` can create multiple categories for different types of applications, it's similar to tag, which can be used in application store to filter applications, e.g. Big data, Middleware, IOT, etc.

As for EMQ X application, we can create a Category and name it `IOT`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213172046.png)

Then click **Uncategorized** and find EMQ X, change its category to `IOT` and save it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213172311.png)

## Release Application to Store

1. Log out and switch to use `isv` to log in KubeSphere, thus `isv` can release his EMQ X application to store, all users in this platform can easily find and deploy this application from global application store.

2. Enter the demo workspace and navigate to the EMQ X app template list, enter its detailed page and expand the version list, then click on the **Release to Store**, choose **OK** in the pop-up windown.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213171324.png)

3. At this point, EMQ X has been released to application store.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213171705.png)

4. Choose `IOT` from the category list in application store.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213172436.png)

5. At this point, we can use any role of users to access EMQ X application. Click into the application detailed page to go through its basic information, you can click **Deploy** on the right, it enables you to click application to Kubernetes via one-click installation.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213172650.png)

## Add New Version

1. KubeSphere supports adding new versions for users to quickly upgrade. let's continue to use `isv` account and enter the EMQ X template page in the workspace.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213173325.png)

2. Download [EMQ X v2](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emqx-v1.0.0-beta.2.tgz), then click on the **New version** on the right, upload the package (emqx-v1.0.0-beta.2.tgz) that you just downloaded.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213173744.png)

3. Click **OK** when you upload successfully.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213174026.png)

4. At this point, you can test deployment and submit this version to `Reviewer`, this process is similar to previous steps.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213174256.png)

5. When you submit the version 2, the process of review and release are also similar to version 1 that we demonstrated above, so we will not add much description in this section.

## Upgrade

After version 2 has been released to application store, all users can upgrade from this application.
