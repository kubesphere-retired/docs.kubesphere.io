---
title: "上传应用"
---

KubeSphere 提供了公共应用仓库供测试使用，用户可以把做好的应用上传到 [helm-charts](https://github.com/kubesphere/helm-charts)，简单审核后便可以通过仓库地址 https://charts.kubesphere.io/experimental 使用。


## 上传应用

根据 [Helm 官方指南](https://helm.sh/docs/developing_charts/) 编写应用，同时可浏览 Kubesphere 应用仓库已有的应用作为参考：官方应用位于 [src/qingcloud](https://github.com/kubesphere/helm-charts/tree/master/src/qingcloud) 目录下，测试应用位于 [src/experimental](https://github.com/kubesphere/helm-charts/tree/master/src/experimental) 目录下。

1. Fork 项目
2. 提交 Pull Request
3. 等待审核
可以通过 [青云 QingCloud 控制台](https://console.qingcloud.com/) 提交工单和一时间得到处理。
4. 添加仓库（https://charts.kubesphere.io/experimental）
