---
title: "基于 GitHub 搭建自有应用仓库"
---

GitHub 是流行的代码仓库，可以直接托管静态文件，利用这个特性可以搭建应用仓库。

## 基于 GitHub 搭建自有应用仓库

根据 [Helm 官方指南](https://helm.sh/docs/developing_charts/) 编写应用，同时可浏览 Kubesphere 应用仓库已有的应用作为参考：官方应用位于 [src/qingcloud](https://github.com/kubesphere/helm-charts/tree/master/src/qingcloud) 目录下，测试应用位于 [src/experimental](https://github.com/kubesphere/helm-charts/tree/master/src/experimental) 目录下。

### 0. 创建 GitHub 仓库

创建一个 GitHub 仓库，比如 https://github.com/kubesphere/helm-repo-example 。所有的应用包都将存放在此处。

### 1. 开发应用

- 根据 [官方文档](https://helm.sh/docs/using_helm/#installing-the-helm-client) 安装 Helm 客户端。

- 打开命令行工具，初始化 Helm 客户端：

  ```bash
  helm init --client-only
  ```

- 根据 [Helm 官方文档](https://helm.sh/docs/chart_template_guide/#a-starter-chart) 创建应用。下面我们创建一个名为 mychart 的示例应用。

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

  然后根据实际需要进行修改和开发。

### 2. 打包应用

开发完成后，在目录 helm-repo-example 下把应用打包（准备上传）：

```
helm package mychart
```

打包完成后的目录结构如下：

```
│ helm-repo-example/
│ └── mychart-0.1.0.tgz       # 可部署的应用包
│ ├── mychart/
│     ├── Chart.yaml
│     ├── templates/
│         └── service.yaml    # 对应 k8s service（服务）的模板文件
│     └── ...
```

### 3. 创建（或更新）索引文件

在目录 helm-repo-example 下利用 helm 命令生成索引文件 index.yaml：

```
helm repo index .
```

最后的目录结构如下：

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

### 4. 上传应用

把上面产生的所有文件都提交到 GitHub 仓库里，此处默认上传到 master 分支。

### 5. 部署应用

如果是第一次部署，参照 [添加应用仓库](../app-repo) 把 https://raw.githubusercontent.com/kubesphere/helm-repo-example/master 添加到 KubeSphere 就可以使用了。
