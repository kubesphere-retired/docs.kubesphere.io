---
title: "Jenkins Agent 说明" 
---

## 简介

Agent 部分指定了整个流水线或特定的部分, 将会在 Jenkins 环境中执行的位置，这取决于 agent 区域的位置。该部分必须在 pipeline 的顶层 或 Stage 中被定义。

## 内置的 podTemplate

在使用过程当中，每个 pod 至少包含 jnlp 容器用于 Jenkins Master 与 Jenkins Agent 的通信。除此之外用户可以自行添加 podTemplate 当中的容器，以满足自己的需求。用户可以选择使用自己传入 pod yaml 的形式来灵活的控制构建的运行环境，通过 `container` 指令可以进行容器的切换。

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

同时为了减少降低用户的使用成本，我们内置了一些podTemplate，使用户可以避免yaml文件的编写。

在目前版本当中我们内置了4种类型的podTemplate，`base`、`nodejs`、`maven`、`go`。并且在pod当中提供了隔离的docker环境。

可以通过指定 agent 的 label 使用内置的 podTempalte

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

Jenkins Agent Label: base

Container Name:base

操作系统版本: centos-7

内置工具: unzip、which、make、wget、zip、bzip2、git

docker 18.06.0

Helm 2.11.0

Kubectl stable release



### podTemplate nodejs

Jenkins Agent Label: nodejs

Container Name:nodejs

操作系统版本: centos-7

Node版本: 9.11.2

Yarn版本: 1.3.2

内置工具: unzip、which、make、wget、zip、bzip2、git

docker 18.06.0

Helm 2.11.0

Kubectl stable release



### podTemplate maven

Jenkins Agent Label: maven

Container Name:maven

操作系统版本: centos-7

Jdk版本:  openjdk-1.8.0

Maven版本: 3.5.3

内置工具: unzip、which、make、wget、zip、bzip2、git

docker 18.06.0

Helm 2.11.0

Kubectl stable release



### podTemplate go

Jenkins Agent Label: go

Container Name:go

操作系统版本: centos-7

Go版本:  1.11

GOPATH: /home/jenkins/go

GOROOT: /usr/local/go

内置工具: unzip、which、make、wget、zip、bzip2、git

docker 18.06.0

Helm 2.11.0

Kubectl stable release