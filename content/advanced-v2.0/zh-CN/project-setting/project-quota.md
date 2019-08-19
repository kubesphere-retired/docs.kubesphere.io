---
title: "基本信息"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

基本信息支持管理当前项目的信息、配额和资源默认请求。其中配额信息是针对项目级别的，用于限制项目内的资源使用上限。而资源默认请求是相对容器级别的，在创建工作负载添加容器组时，默认情况下容器的 CPU 和内存的 requests 和 limits 值将使用其设置的值。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514094619.png)

## 基本信息管理

点击 **“···”** 选择 **编辑信息**，即可修改该项目的别名和描述信息。

![编辑默认资源](/modify-ns-info.png)

## 配额信息管理

使用项目管理员账号 `project-admin` 登录 KubeSphere 可进行配额信息管理。默认情况下，项目中没有设置资源的使用量上限。配额管理支持对多种类型的资源如工作负载、CPU、内存等资源设置上限，点击 **编辑配额**，即可设置各类资源如的使用上限。

![配额](/quata-management.png)

## 资源默认请求

在创建项目时，管理员已为该项目设置了资源默认请求，它是相对容器级别的，若需要修改其资源的默认请求，可点击 **“···”** 选择 **编辑**。

![资源默认请求](/default-request-limit.png)

比如，在创建部署时，容器组模板的高级选项中，若不填 CPU 和内存的 requests 和 limits 值，那么这两项的资源请求和限制值默认是上图中设置的值。

![容器组模板](/cpu-and-memory-setting.png)
