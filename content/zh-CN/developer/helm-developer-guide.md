---
title: "Helm 应用开发入门"
---

KubeSphere 支持将应用以 Helm Chart 的形式上传部署到平台中，而 Nginx 是大家熟知的代理和负载均衡软件，比起 Traefik 来说功能更加强大，本篇文档就以 Nginx 的 Helm Chart 文件为例，介绍 Chart 的基本规则，演示如何通过 Helm Chart 应用开发规范准备一个应用并上传部署到 KubeSphere 平台。

## 准备 Helm 客户端工具

KubeSphere 已在 Installer 部署的机器上默认安装了 Helm 客户端工具，若您的个人环境还没有安装 Helm 客户端工具，请参考 [Helm 安装文档](https://github.com/helm/helm/blob/master/docs/install.md#installing-the-helm-client)。


## 准备本地仓库

执行下列命令，在本地创建目录作为本地仓库。

```bash
$ mkdir helm-repo
$ cd helm-repo
```

## 创建应用

执行 `helm create` 创建一个名为 nginx 的文件夹且默认生成一个 nginx 基本的 yaml 文件模板和目录，通常情况下不建议修改生成的一级目录下文件和目录的命名。

```bash
$ helm create nginx
$ tree nginx/
nginx/
├── charts
├── Chart.yaml
├── templates
│   ├── deployment.yaml
│   ├── _helpers.tpl
│   ├── ingress.yaml
│   ├── NOTES.txt
│   └── service.yaml
└── values.yaml

2 directories, 7 files
```

Chart.yaml 是用于描述 Chart 的基本信息，包括名称、API 和应用版本等，其中 appVersion 字段与 version 字段无关。这是一种指定应用程序版本的方法详见 [Chart.yaml 文件](../helm-specification#chartyaml-文件)。

**Chart.yaml 文件示例：**

```yaml
apiVersion: v1
appVersion: "1.0"
description: A Helm chart for Kubernetes
name: nginx
version: 0.1.0
```

包含在 chart 内的默认 values 文件必须命名 values.yaml，可以为 chart 及其任何依赖项提供值。通过 values.yaml 文件提供的值可以从.Values模板中的对象访问。在部署 Helm Chart 类型的应用到 Kuberntes 运行环境时，支持在 UI 界面可以对 values.yaml 进行编辑配置。

**values.yaml：**

```yaml
# Default values for test.
# This is a YAML-formatted file.
# Declare variables to be passed into your templates.

replicaCount: 1

image:
  repository: nginx
  tag: stable
  pullPolicy: IfNotPresent

nameOverride: ""
fullnameOverride: ""

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: false
  annotations: {}
    # kubernetes.io/ingress.class: nginx
    # kubernetes.io/tls-acme: "true"
  path: /
  hosts:
    - chart-example.local
  tls: []
  #  - secretName: chart-example-tls
  #    hosts:
  #      - chart-example.local

resources: {}
  # We usually recommend not to specify default resources and to leave this as a conscious
  # choice for the user. This also increases chances charts run on environments with little
  # resources, such as Minikube. If you do want to specify resources, uncomment the following
  # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
  # limits:
  #  cpu: 100m
  #  memory: 128Mi
  # requests:
  #  cpu: 100m
  #  memory: 128Mi

nodeSelector: {}

tolerations: []

affinity: {}

```

可根据 [Helm 应用开发规范](../helm-specification) 编辑 nginx 目录下文件，编辑好后保存。

### 生成索引文件（可选）

在 KubeSphere 中，若添加 HTTP 或 HTTPS 协议的仓库，则需要预先在对象存储中上传索引文件 `index.yaml`，该文件由 Helm 客户端工具生成。若添加 S3 协议的仓库，在上传应用到仓库时将自动在对象存储中生成索引文件。在 nginx 上一级目录执行以下命令生成索引文件：

```bash
$ helm repo index .
$ ls
index.yaml  nginx

```

## 打包应用

回到 nginx 上级目录，执行打包命令，将生成一个 tgz 格式的压缩文件，即 nginx 应用配置包：

```bash
$ helm package nginx
$ ls
nginx  nginx-0.1.0.tgz
```
至此，应用配置包就已经准备完毕。

## 上传应用

接下来就可以通过开发者来上传应用到平台进一步测试、上传和部署应用到 KubeSphere 中。
