---
title: "Jenkins 系统设置"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## 修改 Jenkins 系统设置

Jenkins 功能强大的同时其本身也非常灵活，如今已成为 CI / CD 的事实标准，拥有一个活跃的社区来维护几乎任何工具和用例组合的插件。但灵活性需要付出代价：因为除 Jenkins 核心外，许多插件还需要设置一些系统级的配置才能完成工作。

KubeSphere 的 DevOps 工程底层基于 Jenkins 实现了容器化的 CI / CD 功能。为了给用户提供一个可调度的 Jenkins 环境，KubeSphere 使用了 **Configuration-as-Code** 进行 Jenkins 的系统设置，该设置需要用户在 KubeSphere 修改配置文件后再登录到 Jenkins Dashboard 的系统管理中执行重新加载。在当前的版本当中，在控制台中还未提供 Jenkins 的系统设置选项，将在后续版本中支持。

### 修改 ConfigMap

如果您是 KubeSphere 的系统管理员，若需要修改 Jenkins 的系统配置，建议您在 KubeSphere 使用 Configuration-as-Code (CasC) 进行系统设置，需要先在 KubeSphere 的配置 (ConfigMap) 中修改 `jenkins-casc-config`，然后再登录 Jenkins Dashboard 执行 **重新加载**。(因为通过 Jenkins Dashborad 直接写入的系统设置在 Jenkins 重新调度以后可能会被 CasC 配置所覆盖)。

系统内置的 Jenkins CasC 文件以 **ConfigMap** 的形式存储在 `/system-workspace/kubesphere-devops-system/configmaps/jenkins-casc-config/` 中，如下所示，若需修改可点击 **编辑 ConfigMap**。

![configmap设置](/jenkins-setting-configmap.png)

如下所示是 jenkins-casc-config 的配置模板，是一个 yaml 类型的文件。比如，可以在 ConfigMap 修改代理 (Kubernetes Jenkins agent) 中的容器镜像、label 等这类信息或新增 podTemplate 中的容器。

![yaml模板文件](/jenkins-casc.png)

在 KubeSphere 修改 **jenkins-casc-config** 以后，您需要在 Jenkins Dashboard 系统管理下的 **configuration-as-code** 页面重新加载您更新过的系统配置。

### 登陆 Jenkins 重新加载

1、Installer 安装将会同时部署 Jenkins Dashboard，Jenkins 已对接了 KubeSphere 的 LDAP，因此可使用用户名 `admin` 和 KubeSphere 集群管理员的密码登录 Jenkins Dashboard，访问公网 IP (EIP) + Nodeport (30180) 并登陆 Jenkins Dashboard。登陆后，在左侧导航栏点击 `系统管理`。

> 说明：访问 Jenkins Dashboard 可能需要将端口转发和防火墙放行该端口才可以在公网访问。

![系统管理](/jenkins-setting-1.png)

2、在控制台底部找到 `Configuration as Code`，点击进入。

![Configuration as Code](/jenkins-setting-2.png)

3、在 Configuration as Code 部分点击 `重新加载`，即可将在 KubeSphere 的 ConfigMap 修改的系统配置重新加载并更新到 Jenkins Dashboard。

![Configuration as Code](/jenkins-setting-3.png)


有关如何通过 CasC 进行系统设置，详见 [官方文档](https://github.com/jenkinsci/configuration-as-code-plugin)。

> 注: 在现在版本当中，并不是所有插件都支持 CasC 的设置。CasC 只会覆盖使用 CasC 进行设置的插件配置。
