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

In this tutorial, we will walk you through how to use [EMQ X](https://www.emqx.io/) as a demo application to demonstrate the **global application store** and **application lifecycle management**, also demonstrates application upload / review / test / publish / upgrade / take down.

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

## Upload and Submit App

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
