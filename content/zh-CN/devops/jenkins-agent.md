---
title: "Jenkins Agent 说明" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## 简介

Agent 部分指定了整个流水线或特定的部分, 将会在 Jenkins 环境中执行的位置，这取决于 Agent 区域的位置，该部分必须在 Pipeline 的顶层 或 Stage 中被定义。

## 内置的 podTemplate

在使用过程当中，每个 Pod 至少包含 jnlp 容器用于 Jenkins Master 与 Jenkins Agent 的通信。除此之外用户可以自行添加 podTemplate 当中的容器，以满足自己的需求。用户可以选择使用自己传入 Pod yaml 的形式来灵活的控制构建的运行环境，通过 `container` 指令可以进行容器的切换。

```groovy
pipeline {
  agent {
    kubernetes {
      //cloud 'kubernetes'
      label 'mypod'
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: maven
    image: maven:3.3.9-jdk-8-alpine
    command: ['cat']
    tty: true
"""
    }
  }
  stages {
    stage('Run maven') {
      steps {
        container('maven') {
          sh 'mvn -version'
        }
      }
    }
  }
}
```

同时为了减少降低用户的使用成本，我们内置了一些 podTemplate，使用户可以避免 yaml 文件的编写。

在目前版本当中我们内置了 4 种类型的 podTemplate，`base`、`nodejs`、`maven`、`go`，并且在 Pod 中提供了隔离的 Docker 环境。

可以通过指定 Agent 的 label 使用内置的 podTempalte，例如要使用 nodejs 的 podTemplate，可以在创建 Pipeline 时指定 label 为 `nodejs`，如下给出示例。

![nodejs-podtemplate](/nodejs-podtemplate.png)

```groovy
pipeline {
  agent {
    node {
      label 'nodejs'
    }
  }
  
  stages {
    stage('nodejs hello') {
      steps {
        container('nodejs') {
          sh 'yarn -v'
          sh 'node -v'
          sh 'docker version'
          sh 'docker images'
        }
      }
     }
   }
}
```



### podTemplate base

| 名称 | 类型 / 版本 |
| --- | --- |
|Jenkins Agent Label | base |
|Container Name | base |
| 操作系统| centos-7 |
|Docker| 18.06.0|
|Helm | 2.11.0 |
|Kubectl| Stable release|
|内置工具 | unzip、which、make、wget、zip、bzip2、git |


### podTemplate nodejs

| 名称 | 类型 / 版本 |
| --- | --- |
|Jenkins Agent Label | nodejs |
|Container Name | nodejs |
| 操作系统| centos-7 |
| Node | 10.16.3 |
| Yarn | 1.16.0 |
| Docker | 18.06.0 |
| Helm | 2.11.0 |
|Kubectl | stable release|
|内置工具| unzip、which、make、wget、zip、bzip2、git|


### podTemplate maven

| 名称 | 类型 / 版本 |
| --- | --- |
| Jenkins Agent Label | maven |
| Container Name | maven |
| 操作系统| centos-7 |
| Jdk | openjdk-1.8.0_222 |
| Maven | 3.5.3|
| Docker| 18.06.0 |
| Helm | 2.11.0 |
| Kubectl| stable release |
| 内置工具 | unzip、which、make、wget、zip、bzip2、git |


### podTemplate go

| 名称 | 类型 / 版本 |
| --- | --- |
| Jenkins Agent Label | go |
| Container Name | go |
| 操作系统| centos-7 |
| Go | 1.12.10 |
| GOPATH | /home/jenkins/go |
| GOROOT | /usr/local/go |
| Docker | 18.06.0 |
| Helm | 2.11.0 |
| Kubectl | stable release |
| 内置工具 | unzip、which、make、wget、zip、bzip2、git |
