---
title: "入门必读" 
---

相比较易捷版，KubeSphere 高级版提供了更强大更灵活的功能，满足企业更复杂的业务需求，比如新增 HPA (水平自动伸缩)、 CI/CD、监控日志、LDAP 集成、多租户管理、Job/CronJob 等功能，以及 Secrets、ConfigMaps 配置管理。

本文旨在通过几个快速入门的示例帮助您了解 KubeSphere 容器管理平台的基本使用流程，带您快速上手 KubeSphere。快速入门包含六个示例，建议参考文档示例的步骤实践操作一遍。

## 管理员快速入门

若您是初次安装使用 KubeSphere 的集群管理员用户，请先参考 [管理员快速入门](../admin-quick-start)，将引导新手用户创建企业空间、创建新的账户角色并邀请加入，它是创建工作负载和 DevOps 工程的前提条件。

## 工作负载快速入门

- [示例一 - 部署 MySQL](../mysql-deployment)

本文以创建一个有状态副本集 (statefulset) 为例，使用 `Mysql:5.6` 镜像部署一个有状态的 MySQL 应用，作为 [Wordpress](https://wordpress.org/) 网站的后端。示例二依赖于示例一，请按顺序完成这两个示例。

- [示例二 - 部署 Wordpress](../wordpress-deployment)

本文以创建一个部署 (deployment) 为例，使用 `Wordpress:4.6-apache` 镜像部署一个无状态的 Wordpress 应用，最终可通过公网访问的 [Wordpress](https://wordpress.org/) 网站，其后端为示例一所演示的 MySQL 应用。

- [示例三 - 创建简单任务](../job-quick-start)

任务 (Job) 是 Kubernetes 中用来控制批处理型任务的资源对象，定时任务 (CronJob) 是基于时间的任务，可以定时地执行 Job，当您熟悉了任务的使用示例，那么上手定时任务也就不是一件难事了。本文以创建一个并行任务去执行简单的命令计算并输出圆周率到小数点后 2000 位作为示例，说明任务的基本功能。

- [示例四 - 设置弹性伸缩 (HPA)](../hpa)

HPA 是高级版独有的功能，支持 Pod 的水平自动伸缩，本示例以文档和视频的方式演示平台中如何设置 Pod 水平自动伸缩的功能。

## DevOps 工程快速入门

- [示例五 - Jenkinsfile in SCM](../jenkinsfile-in-scm)

本示例以文档和视频演示如何通过 GitHub 仓库中的 Jenkinsfile 来创建 CI/CD 流水线，包括拉取代码、单元测试、构建镜像、推送和发布版本，最终将一个文档网站部署到 KubeSphere 集群中的开发环境和产品环境，并且能够通过公网访问。

- [示例六 - Jenkinsfile out of SCM](../jenkinsfile-out-of-scm)

本示例以文档和视频演示如何基于 [示例五 - Jenkinsfile in SCM](../jenkinsfile-in-scm)，以可视化的方式构建 CI/CD 流水线 (包含示例一的前六个阶段)，最终将本文档网站部署到 KubeSphere 集群中的开发环境且能够通过公网访问。