---
title: "应用仓库管理"
---

KubeSphere 基于 [OpenPitrix](https://openpitrix.io) 构建了应用仓库服务，OpenPitrix 是由 [QingCloud](https://www.qingcloud.com) 主导开源的跨云应用管理平台，可以支持基于 Helm 的 Kubernetes 应用。

本节通过以下几个方面介绍如何应用仓库：

- 添加应用仓库
- 查看或编辑应用仓库
- 删除应用仓库


## 添加应用仓库

首先登录 KubeSphere 管理控制台，访问左侧菜单栏，在 **应用管理** 菜单下，点击 **应用仓库** 按钮进入列表页。

![应用仓库列表](/apprepo_list.png)

1. 点击右上角 **添加应用仓库** 按钮。

2. 在弹出窗口填入应用仓库的基本信息并点击 **验证** 按钮。

3. 验证通过后，点击 **确认** 按钮完成应用仓库的添加。当添加应用仓库后，KubeSphere 会自动加载此仓库下的所有应用模板。

![创建应用仓库](/appfactory_create.png)

Google 有两个应用仓库可以试用，QingStor 对其中稳定的仓库做了一个 mirror (后续我们会开发商业版的应用仓库供企业使用)，用户可根据需要添加所需应用仓库：

> - Google Stable Helm Repo: https://kubernetes-charts.storage.googleapis.com/
> - Google Incubator Helm Repo: https://kubernetes-charts-incubator.storage.googleapis.com/
> - QingStor Helm Repo: https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/

在企业内私有云场景下，用户可以基于 [Helm](https://helm.sh) 规范去构建自己的应用仓库，并且可以开发和上传满足企业业务需求的应用到自己的应用仓库中，然后基于 KubeSphere 完成应用的分发部署。

## 查看或编辑应用仓库

在应用仓库列表页，点击某个应用仓库，选择 **编辑** 按钮，打开详情页，可以查看或者编辑此仓库信息。

## 删除应用仓库

在应用仓库列表页，点击某个应用仓库，选择 **删除** 按钮，可以删除此仓库信息。

![删除应用仓库](/apprepo_delete.png)