---
title: "上传应用到 KubeSphere 官方应用仓库"
---

KubeSphere 提供了公共应用仓库供开发测试使用，用户可以把做好的应用上传到此仓库，审核后便可以使用。

## 上传应用

根据 [Helm 官方指南](https://helm.sh/docs/developing_charts/) 编写应用，同时可浏览 Kubesphere 应用仓库已有的应用作为参考：官方应用位于 [src/qingcloud](https://github.com/kubesphere/helm-charts/tree/master/src/qingcloud) 目录下，测试应用位于 [src/experimental](https://github.com/kubesphere/helm-charts/tree/master/src/experimental) 目录下。

### 1. 开发应用

- Fork 官方项目 [https://github.com/kubesphere/helm-charts](https://github.com/kubesphere/helm-charts/fork)。

- 根据 [官方文档](https://helm.sh/docs/using_helm/#installing-the-helm-client) 安装 Helm 客户端。

- 打开命令行工具，初始化 Helm 客户端：

  ```bash
  helm init --client-only
  ```

- 根据 [Helm 官方文档](https://helm.sh/docs/chart_template_guide/#a-starter-chart) 创建应用。下面我们创建一个名为 mychart 的示例应用。

  在命令行工具进入到源代码目录 [src/experimental](https://github.com/kubesphere/helm-charts/tree/master/src/experimental)，并初始化一个应用：
  
  ```
  cd src/experimental
  helm create mychart
  cd mychart
  ```

  此时会看到 Helm 工具帮我们生成了一个基于 Nginx 的应用（以模板文件组织）：
  
  ```
  src/
  ├── experimental/
  │   └── mychart/
  │       ├── Chart.yaml
  │       ├── values.yaml
  │       ├── templates/
  │           ├── Notes.txt       # 用户执行 helm install 安装应用时显示的文字
  │           ├── deployment.yaml # 对应 k8s deployment（部署）的模板文件
  │           └── service.yaml    # 对应 k8s service（服务）的模板文件
  │       └── ...
  ```

  然后根据实际需要进行修改和开发。

### 2. 提交应用

开发完成后，先提交到自己 fork 的项目，然后提交 Pull Request 到 [KubeSphere 官方代码仓库](https://github.com/kubesphere/helm-charts)待审核。

### 3. 等待审核

我们会随时关注所有 PR 并尽快完成审核。如果需要紧急处理，建议通过 [青云 QingCloud 控制台](https://console.qingcloud.com/) 提交工单在第一时间得到处理。

### 4. 部署应用

PR 合进主分支后，应用就生效了。如果是第一次部署，参照 [添加应用仓库](../app-repo) 把 https://charts.kubesphere.io/experimenta 添加到 KubeSphere 就可以使用了。
