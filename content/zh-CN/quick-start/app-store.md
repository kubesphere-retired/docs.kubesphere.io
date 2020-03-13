---
title: "应用商店"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

[KubeSphere](https://github.com/kubesphere/kubesphere) 基于开源项目 [OpenPitrix](https://openpitrix.io) 构建了应用商店与应用的生命周期管理，并且在 v2.1 中提供了 `3` 种应用的快速部署方式：

> - 平台全局的应用商店，提供给所有用户访问和快速部署，支持应用的生命周期管理
> - [应用模板](../one-click-deploy)，来自企业空间下的由 ISV 上传的应用，或导入的私有或公有的 Helm 应用仓库
> - [自制应用](../wordpress-deployment)，即通过资源编排的方式将多个微服务快速构建成一个完整的应用


KubeSphere 应用商店 **对内可作为团队间共享企业内部的中间件、大数据、业务应用等**，以应用模板的形式方便用户快速地一键部署常用的应用到 Kubernetes 中；**对外可作为根据行业特性构建行业交付标准、交付流程和交付路径的基础，作为行业通用的应用商店**，可根据不同需求应对不同的业务场景。

本文将介绍 KubeSphere 支持的 **第一种方式** — **应用商店与应用的生命周期管理**，使用物联网应用 [EMQ X](https://www.emqx.io) 作为示例应用，演示应用的 **上传提交、应用审核、测试部署、应用上架、应用升级、应用下架** 这样一个完整的业务流程。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191025011318.png)

## 前提条件

- 已安装了 OpenPitrix（应用商店）功能组件
- 已创建了企业空间和项目（可参考 [管理员快速入门](../../quick-start/admin-quick-start) 创建）

## 示例视频

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/website/%E5%85%A5%E9%97%A8%E6%95%99%E7%A8%8B/KS2.1_14-app-store.mp4">
</video>

## 创建自定义角色与账号

1. 参考 [管理员快速入门](../../quick-start/admin-quick-start)，分别创建一个 workspace-admin (作为 ISV) 和一个 reviewer (作为技术审核，自定义的角色) 的账号，这两个账号在集群层级授予 `cluster-regular` 权限。

> 提示：自定义的技术审核角色，需要在 `平台角色` 下新建一个 `app-review` 的角色，权限仅勾选 `应用管理`，然后基于该角色创建一个 reviewer 的账号。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101143114.png)

2. 使用 admin 账号将以上新建的两个账号 (ISV 和 reviewer)，邀请至已创建的企业空间和项目中，并授予 `workspace-admin` 权限。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101143628.png)

## 上传应用提交审核

1. 切换至 **ISV 账号** workspace-admin 登录，进入企业空间下，准备上传一个示例应用并提交审核。请下载 [EMQ X chart v1.0.0](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emqx-v1.0.0-rc.1.tgz) 打包好的第一个版本 Chart，用于 **初次提交审核**。

> 提示：目前版本由于上传应用的权限仅开放给了 workspace-admin 角色，因此项目下的应用开发者需线下将打包好的 Helm 应用包传递给 ISV，由 ISV 上传应用至企业空间下的应用模板。v3.0 计划将应用上传与发布的权限开放给开发者，对权限进行更精细化的控制，将开发者从应用提交审核到应用上架设计成一个闭环。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101145131.png)

2. 在示例企业空间 `demo-workspace` 下，选择 `应用模板 → 上传模板`。

3. 点击 `开始上传`，然后将 `emqx-v1.0.0.tgz` 上传至平台。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101145237.png)

4. 点击确定，然后上传 EMQ X 应用图标，点击下载 [EMQ X 应用图标](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emqx-logo.png)。完成后，应用已成功上传到了企业空间下的应用模板，此时应用状态为 `开发中`。

> 提示：应用模板上传后，此时该应用已对当前企业空间下的所有用户可见，意味着企业空间下的所有用户都可以通过应用模板一键部署该应用至指定的项目中。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101145501.png)

5. 在列表中点击进入 EMQ X 应用，点击左侧的 `编辑信息`，完善应用的介绍、应用截图，点击下载 [应用截图](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emq-dashboard.png)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101150414.png)

6. 当应用的基本信息完善后，点击展开待提交的应用，ISV 可以对该应用进行 **测试部署**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101150606.png)

7. 点击 `测试部署`，注意，在参数配置的代码中，需要修改 `namespace` 的值为 **您实际的项目名称**，修改再点击 `部署`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101172841.png)

大概几分钟后，在 `部署实例` Tab 下，可以看到测试部署的应用当前运行状态，显示绿色即表示应用被成功部署至 Kubernetes。

> 提示：可进一步点击测试部署的 EMQ X 应用实例，进入服务详情页，查看 EMQ X dashboard 的服务地址并进一步访问该 dashboard，详细可参考 [一键部署 EMQ X](../one-click-deploy)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101173213.png)

8. 点击 `提交审核`，确认应用已经通过了基本功能的测试，下一步在更新日志中可以按需编辑当前应用版本的版本号和更新日志。点击 `确定` 完成应用的提交审核。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101174045.png)

**应用审核进度为等待审核**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101174314.png)

## 审核应用

1. 切换 `reviewer` 账号登录 KubeSphere，进入 `平台管理` → `应用管理`，选择 `应用审核`，可以看到 `待处理` 一栏已收到了 ISV 提交审核的 EMQ X 应用。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101174715.png)

2. 点击应用，reviewer 可以从 **应用信息、介绍、配置文件、更新日志** 等四个维度去审核该应用是否符合应用开发规范以及应用上架的条件。若信息符合应用上架标准即可通过审核。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101174819.png)

3. reviewer 可以在 `应用分类` 下根据业务需要，创建多个应用类型，应用分类最终将作为标签，为应用商店筛选不同类型的应用，例如 **大数据、消息队列、中间件**。如下，点击 `+` 创建一个 **物联网** 的应用分类。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101175257.png)

## 应用上架

1. 切换 `ISV` 账号登录，进入企业空间下找到提交审核的 EMQ X 应用，在该应用的详情页即可看到 `发布至应用商店` 的选项，点击 `发布至应用商店`，然后点击 `确定`，应用将上架到应用商店。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101175834.png)

2. EMQ X 应用的状态为 **已上架**，意味着平台的所有用户都可以访问和部署该应用至 Kubernetes。点击 `在商店查看` 跳转至应用商店。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101180609.png)

3. 在应用商店的 `物联网` 分类下，即可看到已上架的 EMQ X。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101180839.png)

4. 点击应用可进一步查看应用详情，并且可以通过 project-reguar 角色（项目普通用户）访问和部署该应用。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101180935.png)

## 添加新版本

KubeSphere 支持对已上架的应用发布新的版本，方便用户进行升级。继续使用 `ISV` 账号，在应用模板中进入 EMQ X 应用详情页，在右侧点击 `添加版本`，然后上传示例应用 EMQ X 的新版本，点击下载 [EMQ X v4.0.2](https://github.com/kubesphere/tutorial/raw/master/tutorial%205%20-%20app-store/emqx-v4.0.2.tgz)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191101181321.png)

添加新版本后，应用新版本的审核与上架流程与上述步骤类似，本文不作赘述。

## 查看新版本

待应用的新版本通过 reviewer 审核后，即可在应用商店访问 EMQ X 应用的新版本。
