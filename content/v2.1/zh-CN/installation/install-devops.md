---
title: "KubeSphere DevOps 系统"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'DevOps'
---

KubeSphere 针对容器与 Kubernetes 的应用场景，基于 Jenkins 提供了一站式 DevOps 系统，包括丰富的 CI/CD 流水线构建与插件管理功能，还提供 Binary-to-Image（B2I）、Source-to-Image（S2I），为流水线、S2I、B2I 提供代码依赖缓存支持，以及代码质量管理与流水线日志等功能。

内置的 DevOps 系统将应用的开发和自动发布与容器平台进行了很好的结合，还支持对接第三方的私有镜像仓库和代码仓库形成完善的私有场景下的 CI/CD，提供了端到端的用户体验。

可参考如下文档进一步了解 KubeSphere DevOps 系统的功能：

> - [Binary-to-Image](../../quick-start/b2i-war)：将 WAR、JAR、Binary 这一类的制品快速打包成 Docker 镜像，并发布到镜像仓库中，最终将服务自动发布至 Kubernetes；
> - [Source-to-Image](../../quick-start/source-to-image)：无需写 Dockerfile，仅输入源代码地址即可自动打包成可运行程序到 Docker 镜像的工具，方便构建镜像发布至镜像仓库和 Kubernetes；
> - [图形化构建流水线](../../quick-start/jenkinsfile-out-of-scm)：通过图形化编辑的界面构建流水线，无需写 Jenkinsfile，交互更友好；
> - [基于 Jenkinsfile 构建流水线](../../quick-start/devops-online)：基于项目仓库中已有的 Jenkinsfile 快速构建流水线；
> - [基于 GitLab + Harbor 构建流水线](../../harbor-gitlab-devops-offline)：支持对接第三方的镜像仓库和代码仓库；

## 安装前如何开启安装 DevOps 系统

<font color=red> 注意：开启可选功能组件之前，请先参考 [可插拔功能组件列表](../../installation/intro/#可插拔功能组件列表)，确认集群的可用 CPU 与内存空间是否充足，开启安装前可能需要提前扩容集群或机器配置，否则可能会因为资源不足而导致的机器崩溃或其它问题。</font>

> 注意，本篇文档仅适用于 Linux Installer 安装的环境，若 KubeSphere 部署在 Kubernetes 之上，需提前创建 CA 证书，请参考 [ks-installer](https://github.com/kubesphere/ks-installer)。

安装前，在 installer 目录下编辑 `conf/common.yaml` 文件，然后参考如下开启。

> 提示：KubeSphere 支持对接外置的 SonarQube，若您已有外置的 SonarQube，建议在以下参数中配置对接，可减少 KubeSphere 集群的资源消耗。

```yaml
#DevOps Configuration
devops_enabled: true # 是否安装内置的 DevOps 系统（支持流水线、 S2i 和 B2i 等功能），若机器配置充裕建议安装
jenkins_memory_lim: 8Gi # Jenkins 内存限制，默认 8 Gi
jenkins_memory_req: 4Gi # Jenkins 内存请求，默认 4 Gi
jenkins_volume_size: 8Gi # Jenkins 存储卷大小，默认 8 Gi
jenkinsJavaOpts_Xms: 3g # 以下三项为 jvm 启动参数
jenkinsJavaOpts_Xmx: 6g
jenkinsJavaOpts_MaxRAM: 8g
sonarqube_enabled: true # 是否安装内置的 SonarQube （代码静态分析工具）
#sonar_server_url: SHOULD_BE_REPLACED # 安装支持对接外部已有的 SonarQube，此处填写 SonarQube 服务的地址
#sonar_server_token: SHOULD_BE_REPLACED  # 此处填写 SonarQube 的 Token
```

## 安装后如何开启安装 DevOps 系统

通过修改 ks-installer 的 configmap 可以选装组件，执行以下命令（kubectl 命令需要以 root 用户执行）。

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

**参考如下修改 ConfigMap**

```yaml
devops:
      enabled: True
      jenkinsMemoryLim: 2Gi
      jenkinsMemoryReq: 1500Mi
      jenkinsVolumeSize: 8Gi
      jenkinsJavaOpts_Xms: 512m
      jenkinsJavaOpts_Xmx: 512m
      jenkinsJavaOpts_MaxRAM: 2g
      sonarqube:
        enabled: True
```

保存退出，参考 [验证可插拔功能组件的安装](../verify-components) ，无需再次执行安装命令 ./install.sh，仅需通过查询 ks-installer 日志或 Pod 状态即可验证功能组件是否安装成功。
