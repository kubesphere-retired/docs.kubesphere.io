---
title: "设置自动触发扫描"
---

在含有 SCM (Source Code Management) 的 Pipeline 中，用户如果需要为流水线设置自动发现远程分支的变化，以生成新的 Pipeline 并使其自动地重新运行，可参考以下方式设置自动触发扫描。在 KubeSphere 中根据 SCM 类型的不同，也相应地提供了不同的方式进行触发。


## Github SCM

在 Github SCM 中，我们提供了两种方式可以让用户配置以实现自动扫描，我们推荐用户同时配置两个设置以达到最佳的效果：触发 Jenkins 自动扫描应该以 Webhook 为主，以在 KubeSphere 设置定期扫描为辅。

### 第一步：设置定期扫描

Webhook 是一种高效的方式可以让我们发现远程仓库的变化，但是因为网络等问题，Webhook 消息可能不是总能被收到，因此推荐用户在 KubeSphere 创建 DevOps 工程的高级设置中，勾选 **如果没有扫描触发，则定期扫描**，并将时间间隔设置为可以容忍的最大时长 (推荐 1 小时到 1 天之间)。

![自动扫描](/auto-scan.png)

### 第二步：设置 GitHub Webhook

1、Webhook 需要用户自行到 Github 的 **Settings → Webhooks** 自行进行配置，并且需要 Github 能够访问到您安装的 KubeSphere 控制台地址。进入 Github，访问需要配置 Webhook 的仓库，比如当前的示例仓库 devops-docs-sample，选择  **Settings → Webhooks** 进行设置。

![设置 GitHub Webhook](/webhook-setting-1.png)

2、点击左侧 **Webhooks**，进入 Webhook 配置页面。点击 **Add webhook** 即可添加新的 webhook。

![添加 GitHub Webhook](/webhook-setting-2.png)

注意，Payload 地址填写为关联的流水线 **Webhook 推送** 的默认地址，

![添加 GitHub Webhook](/webhook-setting-3.png)

3、点击 **Add Webhook** 完成 Webhook 的添加，可以看到 Webhook 已经创建成功。

![完成 Webhook 添加](/webhook-created-successfully.png)

## Git SCM (以 Gitlab 为例)

与 Github SCM 类似，Git SCM 也是以 webhook 为主，定期扫描为辅的方式进行配置。下面我们将以 Gitlab 为例配置 Webhook。

1、在项目设置按钮下点击 Webhooks 进入 webhook 设置页面

![gitlab-webhook 设置](/gitlab-webhook-1.png)

2、同上，输入 pipeline 配置的地址，最后点击页面最下方完成创建

![gitlab-webhook 设置](/gitlab-webhook2.png)

## SVN SCM

在传统的 SVN 当中不包含 webhook 的概念，因此推荐在 KubeSphere 设置时间间隔较短的定期扫描来进行远程构建的触发，通常我们会将时间间隔设置为 15 分钟到 1 小时，团队可以根据自己的实际情况来设置定时扫描。