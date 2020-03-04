---
title: "基于 GitHub 搭建自有应用仓库"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

GitHub 是流行的代码仓库，可以直接托管静态文件，利用这个特性可以搭建应用仓库。

## 基于 GitHub 搭建自有应用仓库

根据 [Helm 官方指南](https://helm.sh/docs/developing_charts/) 编写应用，同时可浏览 Kubesphere 应用仓库已有的应用作为参考：官方应用位于 [src/qingcloud](https://github.com/kubesphere/helm-charts/tree/master/src/qingcloud) 目录下，测试应用位于 [src/experimental](https://github.com/kubesphere/helm-charts/tree/master/src/experimental) 目录下。

## 前提条件

创建一个 GitHub 仓库，比如创建一个示例仓库 `https://github.com/FeynmanZhou/helm-repo-example`，所有的应用包都可以存放在此处。

### 第一步：开发应用

1、参考 [官方文档](https://helm.sh/docs/using_helm/#installing-the-helm-client) 安装 Helm 客户端。


2、打开命令行工具，初始化 Helm 客户端：

  ```bash
  helm init --client-only
  ```

3、根据 [Helm 官方文档](https://helm.sh/docs/chart_template_guide/#a-starter-chart) 创建应用。下面我们创建一个名为 mychart 的示例应用。

  在命令行窗口初始化一个应用：

  ```
  cd helm-repo-example
  helm create mychart
  ```

  此时会看到 Helm 工具帮我们生成了一个基于 Nginx 的应用（以模板文件组织）：

  ```
  │ helm-repo-example/
  │ └── mychart/
  │     ├── Chart.yaml
  │     ├── values.yaml
  │     ├── templates/
  │         ├── Notes.txt       # 用户执行 helm install 安装应用时显示的文字
  │         ├── deployment.yaml # 对应 k8s deployment（部署）的模板文件
  │         └── service.yaml    # 对应 k8s service（服务）的模板文件
  │     └── ...
  ```

4、然后根据实际需要进行修改和开发。

### 第二步：打包应用

1、开发完成后，在目录 helm-repo-example 下把应用打包（准备上传）：

```
helm package mychart
```

2、打包完成后的目录结构如下：

```
│ helm-repo-example/
│ └── mychart-0.1.0.tgz       # 可部署的应用包
│ ├── mychart/
│     ├── Chart.yaml
│     ├── templates/
│         └── service.yaml    # 对应 k8s service（服务）的模板文件
│     └── ...
```

### 第三步：上传应用

1、在目录 helm-repo-example 下利用 helm 命令生成索引文件 index.yaml：

```
helm repo index .
```

2、最后的目录结构如下：

```
│ helm-repo-example/
│ ├── index.yaml              # 可部署的应用包
│ ├── mychart-0.1.0.tgz       # 可部署的应用包
│ ├── mychart/
│     ├── Chart.yaml
│     ├── templates/
│         └── service.yaml    # 对应 k8s service（服务）的模板文件
│     └── ...
```

### 第四步：上传应用

上传应用到 KubeSphere 支持两种方式，第一种方法是直接将上述生成的 tgz 文件上传到企业空间下的应用模板，请参考 [应用商店](../../quick-start/app-store)。

第二种方法将上述的 Github 仓库作为应用仓库导入到 KubeSphere 中。以下介绍第二种方法。

### 第五步：添加应用仓库

以下简单说明如何将该 GitHub 仓库作为应用仓库添加至 KubeSphere，详见 [添加应用仓库](../app-repo)。

1、使用企业空间管理员的账号，进入企业空间，进入 `企业空间管理 → 应用仓库`，点击 `创建应用仓库`。

然后输入示例仓库 `https://raw.githubusercontent.com/FeynmanZhou/helm-repo-example/master` 点击验证通过后再点击确定。


> 提示：获取 GitHub 仓库中文件的 Raw 地址可参考如下截图。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190910004851.png)

2、使用普通用户的账号，进入企业空间下的任意一个项目中，进入 「应用负载」 → 「应用」，点击 **部署新应用 → 来自应用模板**，然后选择上一步添加的 GitHub repo，即可看到该仓库中的应用。


3、以下已成功将 mychart 应用部署至项目中，关于如何部署应用可参考 [一键部署应用](../../quick-start/one-click-deploy)。


## 自动化上传

上述第二〜三步可以自动化，解放手工操作并减少人工错误。大体流程如下：

```bash
# 下载代码
git clone https://github.com/FeynmanZhou/helm-repo-example

# 拉取分支
git fetch
git checkout app/mychart

# 初始化
helm init --client-only

# 打包
helm package mychart

# 更新索引
helm repo index .

# 提交
git commit -a -m "[CI Build] Upload App"
git push origin HEAD:app/mychart

# Merge PR（人工或自动）
```
