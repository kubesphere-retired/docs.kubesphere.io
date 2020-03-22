---
title: "入门必读"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

本章节旨在通过多个快速入门的示例帮助您了解 KubeSphere 容器平台的基本使用流程，带您快速上手 KubeSphere。建议参考示例文档的步骤动手实践操作一遍。为了帮助用户更快地了解 KubeSphere 并进一步理解底层 Kubernetes 的基础概念和知识，我们还精心准备了 [Kubernetes 入门视频教程](https://kubesphere.com.cn/zh-CN/videos/)。

## 多租户管理快速入门

若您是初次安装使用 KubeSphere 的集群管理员用户，请先参考 [多租户管理快速入门](../admin-quick-start)，将引导新手用户创建企业空间、创建新的账户角色并邀请加入，它是创建工作负载和 DevOps 工程的前提条件。

## 编排微服务应用

参考 [创建 Wordpress 应用并发布至 Kubernetes](../wordpress-deployment)

## 应用路由与服务示例

KubeSphere 在项目中为用户项目内置了一个全局的负载均衡器，即应用路由控制器 (Ingress Controller)，为了代理不同后端服务 (Service) 而设置的负载均衡服务，用户访问 URL 时，应用路由可以把请求转发给不同的后端服务，[服务与应用路由示例](../ingress-demo) 在 KubeSphere 创建相关资源来说明这个应用路由的示例。


## 创建任务

任务 (Job) 是 Kubernetes 中用来控制批处理型任务的资源对象，定时任务 (CronJob) 是基于时间的任务，可以定时地执行 Job，当您熟悉了任务的使用示例，那么上手定时任务也就不是一件难事了。本文以创建一个并行任务去执行简单的命令计算并输出圆周率到小数点后 2000 位作为示例，说明任务的基本功能。

参考 [创建简单任务](../job-quick-start)

## 应用仓库与部署应用

参考 [一键部署应用](../one-click-deploy)

一键部署应用基于 KubeSphere 内置应用仓库，部署的应用一般包含相应的工作负载和服务。

- [设置弹性伸缩 (HPA)](../hpa)

弹性伸缩 (HPA) 是高级版独有的功能，支持 Pod 的水平自动伸缩，本示例以文档和视频的方式演示平台中如何设置 Pod 水平自动伸缩的功能。

## DevOps 快速入门

- [Binary to Image](../b2i-war)

Binary to Image 旨在帮助开发者和运维在项目打包成 WAR、JAR、Binary 这一类的制品后，快速将制品或二进制的 Package 打包成 Docker 镜像，并发布到 DockerHub 或 Harbor 等镜像仓库中。并且支持以创建服务的形式，一键将制品生成镜像推送到仓库，并创建其部署 (Deployment) 和服务 (Service) 最终自动发布到 Kubernetes 中。

- [Source to Image](../source-to-image)

Source to Image(S2I) 是一个创建 Docker 镜像的工具。它可以通过将源代码放入一个单独定义的负责编译源代码的 Builder image中，来将编译后的代码打包成 Docker 镜像。

- [基于Spring Boot项目构建流水线](../devops-online)

本示例以文档和视频演示如何通过 GitHub 仓库中的 Jenkinsfile 来创建 CI/CD 流水线，包括拉取代码、单元测试、代码质量检测、构建镜像、推送和发布版本，最终示例 Web 部署到 KubeSphere 集群中的开发环境和生产环境，并且能够通过公网访问。

- [Harbor + GitLab 流水线示例(离线版)](../harbor-gitlab-devops-offline)

本示例演示如何在离线环境下使用内置的 Harbor 和 GitLab，仓库中的 Jenkinsfile 来创建 CI/CD 流水线，包括拉取代码、单元测试、代码质量检测、构建镜像、推送和发布版本，最终示例网站部署到 KubeSphere 集群中的开发环境和产品环境，并且能够通过公网访问。

- [Jenkinsfile out of SCM](../jenkinsfile-out-of-scm)

本示例以文档和视频演示如何以可视化的方式构建 CI/CD 流水线 (包含示例六的前六个阶段)，最终将示例 Web 部署到 KubeSphere 集群中的开发环境且能够通过公网访问。

## 应用商店

KubeSphere 基于开源项目 OpenPitrix 构建了应用商店与应用的生命周期管理，并且在 v2.1 中提供了 3 种应用的快速部署方式，参考 [应用商店](../app-store)。
