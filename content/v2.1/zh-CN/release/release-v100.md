---
title: "Release Notes For 1.0.0"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere 高级版 (Advanced Edition 1.0.0) 已于 2018 年 12 月 10 日 正式发布。

## 关于 KubeSphere 高级版  

KubeSphere 共提供社区版、易捷版以及高级版三个版本，其中社区版和易捷版主要提供多租户管理、集群运维、应用管理等功能，而高级版主要针对企业用户，目的是满足企业内不同角色用户、提供多种以容器为资源载体的的业务功能模块。

## 下载高级版 1.0.0

请前往 KubeSphere 官网下载最新的 [KubeSphere Advanced Edition 1.0.0](/download)。

## 安装

请参考 [安装指南](../../installation/intro)。

## 功能介绍  

 - 基于 [Kubernetes 1.12.3](https://github.com/kubernetes/kubernetes/releases/tag/v1.12.3)    
 - 提供企业空间、项目、DevOps 工程多层级租户管理，支持预置以及自定义角色  
 - 支持 LDAP 统一认证  
 - 支持部署（Deployments）、有状态副本集（StatefulSets）、守护进程集（DaemonSets）、任务（Jobs）、定时任务（CronJob）多种工作负载
 - 支持 Pod 水平自动弹性伸缩（HPA，Horizonal Pod Autoscaler）  
 - 支持配额管理  
 - 支持密码、配置管理  
 - 支持镜像仓库管理  
 - 支持服务和应用路由  
 - 支持 Calico、Flannel 开源网络插件  
 - 支持 GlusterFS、Ceph RBD 和 NFS 开源存储插件  
 - 基于青云平台上的主机部署，可以使用 [青云块存储](https://github.com/yunify/qingcloud-csi)、[SDN 直通网络](https://github.com/yunify/hostnic-cni) 以及 [负载均衡器](https://github.com/yunify/qingcloud-cloud-controller-manager)  
 - 支持 [QingStor NeonSAN](https://github.com/yunify/qingstor-csi) 存储  
 - 提供基于 Jenkins 的流水线可视化编辑，预置多种功能属性的任务，支持 Jenkinsfile in & out SCM 两种模式  
 - 代码仓库支持 github/git/svn  
 - DevOps 提供统一凭证管理功能  
 - 可选装 Harbor 镜像仓库和 GitLab 代码仓库，并与 Jenkins 集成  
 - 基于 Prometheus 提供多维度监控服务，涵盖集群、主机、企业空间、项目、工作负载、Pod、容器等多个层面，以实时、历史、排行等多种展现方式展现 CPU、内存、网络、存储、IO 等多项监控指标，并提供 API 接口以便和已有监控系统集成
 - 基于 [OpenPitrix](https://openpitrix.io)，提供应用仓库管理功能  
 - 最小单节点安装，可部署于现有 Kubernetes 集群。支持物理机、虚拟机和云主机等多种基础设施，支持混合部署方式  
 - 支持控制节点、etcd、监控高可用  