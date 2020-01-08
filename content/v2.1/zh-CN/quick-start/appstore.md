---
title: "AppStore - Helm-based App Lifecycle Management"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## What is Application Store

KubeSphere is an open source and application-centric container platform, provides users with the Helm application store and application lifecycle management, which is based on OpenPitrix, the self-developed and open source framework (platform). Application store allows ISV, developers and users to **upload / test / review / deploy / publish / upgrade and remove App** with several clicks.

Meanwhile, the application store can be used to share applications between different teams within workspace, including big data, middleware, AI, etc. Users can share and deploy the helm chart to Kubernetes in an easy way. It can also meet different demands in diverse scenarios.

KubeSphere application store also provides 10 helm chart application for quick testing.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191225205635.png)

## Prerequisites

- You have installed KubeSphere Application Store (OpenPitrix).
- You have created a workspace and a project, see [Get Started with Multi-tenant Management](../admin-quick-start).

## Create Role and Account

1. In this tutorial, we need to create an account with role of `workspace-admin`, 
