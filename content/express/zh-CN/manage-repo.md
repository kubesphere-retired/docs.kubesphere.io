---
title: "应用仓库管理"
---

KubeSphere 基于 [OpenPitrix](https://openpitrix.io) 构建了应用仓库服务，OpenPitrix 是由 QingCloud 主导开源的跨云应用管理平台，可以支持基于 Helm 的 Kubernetes 应用。 KubeSphere 已添加了 Google、 QingCloud 和 incubator 等三个应用仓库, 通过控制台可以管理应用仓库。

本节通过以下几个方面介绍如何管理部署：

- 如何管理应用仓库
  - 添加应用仓库
  - 查看或编辑应用仓库
  - 删除应用仓库

# 如何管理应用仓库

登录 KubeSphere 管理控制台，访问左侧菜单栏，在**应用管理**菜单下，点击**应用仓库**按钮，进入应用仓库列表页面。
![](/apprepo_list.png)

## 添加应用仓库
1. 点击右上角**添加应用仓库**按钮

2. 在弹出窗口填入应用仓库的基本信息并点击**验证**按钮。

3. 验证通过后，点击**确认**按钮完成应用仓库的添加。

在企业内私有云场景下，用户可以基于 [Helm](https://helm.sh) 规范去构建自己的应用仓库，并且能够开发和上传满足企业业务需求的应用到 Helm Charts 仓库，然后基于 KubeSphere 完成应用的分发部署。QingStor 应用仓库中已有近百种应用，例如：Jenkins、Mysql、MariaDB 等常用应用。以下用添加 QingStor 应用仓库 作为示例，当添加 QingStor 应用仓库后，KubeSphere 会自动加载此仓库下的所有应用模板，基于应用模板可以快速地一键部署应用。参考如下截图完成应用仓库的添加：

> - QingStor URL: https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/

![](/appfactory_create.png)

常用的应用仓库还有 Google 和 Incubator，用户可根据需要添加此类应用仓库：

> - Google Helm Repo: https://kubernetes-charts.storage.googleapis.com
> - Incubator Helm Repo: https://kubernetes-charts-incubator.storage.googleapis.com/


## 查看或编辑应用仓库
在应用仓库列表页，点击某个应用仓库，选择**编辑**按钮，打开详情页，可以查看或者编辑此仓库信息。


## 删除应用仓库
在应用仓库列表页，点击某个应用仓库，选择**删除**按钮，可以删除此仓库信息。

![](/apprepo_delete.png)