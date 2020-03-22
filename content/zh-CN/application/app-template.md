---
title: "应用模板"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

应用模板是 KubeSphere 中应用的存储、交付、管理途径，应用模板所纳管的应用基于 [Helm](https://helm.sh/) 打包规范构建，并通过统一的公有或私有的应用仓库交付使用，应用可根据自身特性由一个或多个 Kubernetes 工作负载 (workload) 和服务 (Service) 组成。

应用模板通过可视化的方式在 KubeSphere 中展示并提供部署和管理的功能，用户能够基于应用模板快速地一键部署应用至所选的项目中。应用模板对内可作为团队间共享企业创造的中间件、业务系统等，对外可作为根据行业特性构建行业交付标准、交付流程和交付路径的基础，用户根据不同场景需求和可见级别服务于不同的业务场景。

在使用应用模板前，需要预先添加应用仓库。KubeSphere 基于 [OpenPitrix](https://openpitrix.io) 构建了应用仓库服务，在使用应用模板前需要先将符合 Helm 规范的应用配置包上传至应用仓库后端的对象存储中，然后在应用仓库下基于该对象存储添加一个应用仓库，KubeSphere 会自动加载此仓库下的所有应用，详见 [添加应用仓库](../../platform-settings/app-repo)。

![使用应用模板流程](/app-template.svg)

除此之外，应用模板还可以结合 OpenPitrix 的应用全生命周期管理的功能，支持对接应用服务商、开发者和普通用户，通过应用上传、应用审核、部署测试、应用发布、应用版本管理等功能，构建公有或私有的应用商店，为 KubeSphere 提供应用模板服务，企业也可以基于此来建立行业公有或专有应用商店，实现标准化的应用一键交付部署，详见 [OpenPitrix 官方文档](https://docs.openpitrix.io/v0.3/zh-CN/user-guide/introduction/)。

## 应用列表

在所有的项目中，都提供了一个 **应用** 入口，这里作为应用模板的入口，应用部署后其也可以作为一个应用列表来管理当前项目下的所有应用。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190513211127.png)

点击 **部署新应用** → **应用模板部署**，即可进入 **应用模板** 页。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190513211356.png)

## 应用模板

### 添加示例仓库

在前面提到过，使用应用模板前，需要 **集群管理员** 预先添加可用的应用仓库，用户才可以在应用模板中访问和部署应用。

本文档提供了一个示例应用仓库仅用于功能演示，用户可根据需求自行在对象存储中上传应用配置包然后添加应用仓库。

1、使用 `集群管理员` 账户登录 KubeSphere 管理控制台，点击左上角 **平台管理 → 平台设置**，选择 **应用仓库**，进入列表页。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190513211736.png)

2、点击右上角 **添加应用仓库** 按钮。

3、在弹出窗口填写示例应用仓库的基本信息，URL 选择 https，地址填写 `https://helm-chart-repo.pek3a.qingstor.com/kubernetes-charts/`，然后点击 **验证** 按钮，待验证通过后点击 **确定**，完成应用仓库的添加。

![示例仓库信息](/app-repo-demo.png)

### 访问应用模板

切换为项目的普通用户 project-regular 登录 KubeSphere, 点击控制台顶部的 **应用模板**，即可看到示例应用仓库中的所有应用已被导入到了应用模板中，此时用户即可浏览或搜索所需应用进行一键部署至所需的项目中。

![应用模板页](/app-template-page.png)

关于一键部署应用的步骤示例，参考 [快速入门 - 一键部署应用](../../quick-start/one-click-deploy)




