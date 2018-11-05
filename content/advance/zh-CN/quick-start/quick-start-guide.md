---
title: "入门必读" 
---

在易捷版的基础上，KubeSphere 高级版提供更强大灵活的功能，提供企业级容器应用管理服务，满足企业复杂的业务需求，比如新增 HPA (水平自动伸缩)、 CI/CD、监控日志、LDAP 集成、多租户管理等功能，以及 Secrets、ConfigMaps 的配置管理。

本文旨在通过几个快速入门的示例帮助您了解 KubeSphere 容器管理苹果的基本使用流程，带您快速上手 KubeSphere。快速入门包含五篇文档，建议参考文档步骤实践操作一遍。

**工作负载快速入门**

- [快速入门 - 部署 MySQL](../mysql-deployment)

本文以创建一个有状态副本集（statefulset）为例，使用 `Mysql:5.6` 镜像部署一个有状态的 MySQL 应用，作为 [Wordpress](https://wordpress.org/) 网站的后端。

- [快速入门 - 部署 Wordpress](../wordpress-deployment)

本文以创建一个部署（deployment）为例，使用 `Wordpress:4.6-apache` 镜像部署一个无状态的 Wordpress 应用，即一个最终可通过公网访问的 [Wordpress](https://wordpress.org/) 网站，其后端为上一篇文档所演示的 MySQL 应用。

- [快速入门 - HPA 水平自动伸缩](../hpa)

HPA 是高级版独有的功能，支持 Pod 的水平自动伸缩，本示例以文档和视频的方式演示平台中如何设置 Pod 水平自动伸缩的功能。

**DevOps 工程快速入门**

- [示例一 - Jenkinsfile in SCM](../../devops/jenkinsfile-in-scm)

本示例以文档和视频演示如何通过 GitHub 仓库中的 Jenkinsfile 来创建流水线将仓库的代码打包成 docker 镜像并推送到 DockerHub

- [示例二 - Jenkinsfile out of SCM](../../devops/jenkinsfile-out-of-scm)

本示例以文档和视频演示如何通过手动创建流水线将仓库的代码打包成 Docker 镜像，并通过 archiveArtifacts (保存制品) 生成压缩文件可供下载，常见的制品一般是编译好的代码或者测试报告。