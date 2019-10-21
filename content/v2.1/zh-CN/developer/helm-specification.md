---
title: "开发模板规范"
---

Helm Chart 是一种打包规范，将各种 Kubernetes 资源以配置文件的形式组织。更详细的介绍请参考 [Chart 官网文档](https://github.com/helm/helm/blob/master/docs/charts.md)

## Chart 文件结构

一个 Chart 包由以下几个配置文件组成：

```
wordpress/
  Chart.yaml          # Yaml文件，用于描述 Chart 的基本信息，包括名称版本等
  LICENSE             # [可选] 文本格式的协议
  README.md           # [可选] 应用介绍、使用说明
  requirements.yaml   # [可选] 用于存放当前 Chart 依赖的其它 Chart 的说明文件
  values.yaml         # Chart 的默认值配置文件
  charts/             # [可选] 该目录中放置当前 Chart 依赖的其它 Chart
  templates/          # [可选] 部署文件模版目录，模版填入 values.yaml 中相应值，生成最终的 kubernetes 配置文件
  templates/NOTES.txt # [可选] 使用指南
```

## Chart.yaml 文件

```
apiVersion: [必须] Chart API 版本，可用值 v1
name: [必须] Chart 名称
version: [必须] 版本，遵循 [SemVer 2 标准](https://semver.org/)
kubeVersion: [可选] 兼容的 Kubernetes 版本，遵循 [SemVer 2 标准](https://semver.org/)
description: [可选] 一句话的应用描述
keywords:
  - [可选] 应用关键字列表
home: [可选] 应用主页 URL
sources:
  - [可选] 当前应用下载地址列表
maintainers: [可选]
  - name: [必须] name 
    email: [可选] email
    url: [可选] url
engine: [可选] 模板引擎，默认值是 gotpl
icon: [可选] SVG 或者 PNG 格式的图片地址
appVersion: [可选] 应用版本
deprecated: [可选] boolean 类型，是否不建议使用
tillerVersion: [可选] Chart 需要的 Tiller 版本，遵循 [SemVer 2 标准](https://semver.org/)，需要 ">2.0.0"
```

## Requirements.yaml 文件和 Charts 目录

Chart支持两种方式表示依赖关系，可以写入 requirements.yaml 文件动态链接[推荐]，也可以将依赖的 Chart 放入 charts 目录手动管理。

`requirements.yaml` 文件样例：

```
dependencies:
  - name: apache
    version: 1.2.3
    repository: http://example.com/charts
  - name: mysql
    version: 3.2.1
    repository: http://another.example.com/charts
```

* name：Chart 名称
* version：Chart 版本
* repository: Chart 仓库 URL 地址

有了 `requirements.yaml` 文件，可以运行 `helm dependency update`，依赖的 Chart 会被自动的下载到 `charts` 目录下。

## Values.yaml 文件和 Templates 目录

`values.yaml` 文件中记录了模板中引用的默认值。
`templates` 目录中存放了 Kubernetes 部署文件的模版，遵循 [Go template 语法](https://golang.org/pkg/text/template/)

`templates` 中模板文件样例：

```
apiVersion: v1
kind: ReplicationController
metadata:
  name: deis-database
  namespace: deis
  labels:
    app.kubernetes.io/managed-by: deis
spec:
  replicas: 1
  selector:
    app.kubernetes.io/name: deis-database
  template:
    metadata:
      labels:
        app.kubernetes.io/name: deis-database
    spec:
      serviceAccount: deis-database
      containers:
        - name: deis-database
          image: {{.Values.imageRegistry}}/postgres:{{.Values.dockerTag}}
          imagePullPolicy: {{.Values.pullPolicy}}
          ports:
            - containerPort: 5432
          env:
            - name: DATABASE_STORAGE
              value: {{default "minio" .Values.storage}}
```

上述样例是一个 Kubernetes 中 replication controller 的模板文件定义，其中引用了以下几个值（一般定义在 values.yaml 中）

* imageRegistry：Docker 映像仓库
* dockerTag: Docker 映像标签
* pullPolicy: 下载映像策略
* storage: 存储后端，默认值是 "minio"

`values.yaml` 文件样例：

```
imageRegistry: "quay.io/deis"
dockerTag: "latest"
pullPolicy: "Always"
storage: "s3"
```

