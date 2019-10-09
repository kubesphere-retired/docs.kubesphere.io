---
title: "入门必读" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere Advanced 2.0.0 相比较 1.0.1 提供了更强大的功能，比如新增微服务治理、Source-to-Image、日志收集与查询、监控告警、更多监控指标、代码质量检查工具 SonarQube 等，并提供适用于物理机部署 Kubernetes 的负载均衡器 [Porter](https://github.com/kubesphere/porter)，满足企业更复杂的业务场景和需求。

本文旨在通过多个快速入门的示例帮助您了解 KubeSphere 容器平台的基本使用流程，带您快速上手 KubeSphere。建议参考示例文档的步骤实践操作一遍。为了帮助用户更快地了解 KubeSphere 并进一步理解底层 Kubernetes 的基础概念和知识，我们还精心准备了 [Kubernetes 入门视频教程](https://yunify.anybox.qingcloud.com/s/YTU9bP3YtzKanMkawJqv8Zd9TTZAwiMa)。

## 多租户管理快速入门

若您是初次安装使用 KubeSphere 的集群管理员用户，请先参考 [多租户管理快速入门](../admin-quick-start)，将引导新手用户创建企业空间、创建新的账户角色并邀请加入，它是创建工作负载和 DevOps 工程的前提条件。

## 应用路由与服务示例

KubeSphere 在项目中为用户项目内置了一个全局的负载均衡器，即应用路由控制器 (Ingress Controller)，为了代理不同后端服务 (Service) 而设置的负载均衡服务，用户访问 URL 时，应用路由可以把请求转发给不同的后端服务，[服务与应用路由示例](../ingress-demo) 在 KubeSphere 创建相关资源来说明这个应用路由的示例。

## 工作负载快速入门

- [部署 MySQL](../mysql-deployment)

本文以创建一个有状态副本集 (statefulset) 为例，使用 `mysql:5.6` 镜像部署一个有状态的 MySQL 应用，作为 [Wordpress](https://wordpress.org/) 网站的后端。示例二依赖于示例一，请按顺序完成这两个示例。

- [部署 Wordpress](../wordpress-deployment)

本文以创建一个部署 (deployment) 为例，使用 `wordpress:4.6-apache` 镜像部署一个无状态的 Wordpress 应用，最终可通过公网访问的 [Wordpress](https://wordpress.org/) 网站，其后端为示例一所演示的 MySQL 应用。

- [创建简单任务](../job-quick-start)

任务 (Job) 是 Kubernetes 中用来控制批处理型任务的资源对象，定时任务 (CronJob) 是基于时间的任务，可以定时地执行 Job，当您熟悉了任务的使用示例，那么上手定时任务也就不是一件难事了。本文以创建一个并行任务去执行简单的命令计算并输出圆周率到小数点后 2000 位作为示例，说明任务的基本功能。

- [一键部署应用](../one-click-deploy)

一键部署应用基于 KubeSphere 应用模板，部署的应用一般包含相应的工作负载和服务，可通过 **应用** 列表查看，用户可以配置外网访问方式来访问该应用。

- [设置弹性伸缩 (HPA)](../hpa)

弹性伸缩 (HPA) 是高级版独有的功能，支持 Pod 的水平自动伸缩，本示例以文档和视频的方式演示平台中如何设置 Pod 水平自动伸缩的功能。

## DevOps 工程快速入门

- [Source to Image](../source-to-image)

Source to Image(S2I) 是一个创建 Docker 镜像的工具。它可以通过将源代码放入一个单独定义的负责编译源代码的 Builder image中，来将编译后的代码打包成 Docker 镜像。

- [基于Spring Boot项目构建流水线](../devops-online)

本示例以文档和视频演示如何通过 GitHub 仓库中的 Jenkinsfile 来创建 CI/CD 流水线，包括拉取代码、单元测试、代码质量检测、构建镜像、推送和发布版本，最终示例 Web 部署到 KubeSphere 集群中的开发环境和生产环境，并且能够通过公网访问。

- [Harbor + GitLab 流水线示例(离线版)](../harbor-gitlab-devops-offline)

本示例演示如何在离线环境下使用内置的 Harbor 和 GitLab，仓库中的 Jenkinsfile 来创建 CI/CD 流水线，包括拉取代码、单元测试、代码质量检测、构建镜像、推送和发布版本，最终示例网站部署到 KubeSphere 集群中的开发环境和产品环境，并且能够通过公网访问。

- [Jenkinsfile out of SCM](../jenkinsfile-out-of-scm)

本示例以文档和视频演示如何以可视化的方式构建 CI/CD 流水线 (包含示例六的前六个阶段)，最终将示例 Web 部署到 KubeSphere 集群中的开发环境且能够通过公网访问。




