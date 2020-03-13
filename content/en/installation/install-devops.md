---
title: "Enable DevOps System"
keywords: 'kubesphere, kubernetes, docker, jenkins, sonarqube, devops, CI/CD'
description: 'How to Enable DevOps System on KubeSphere'
---

## What is KubeSphere DevOps System

KubeSphere DevOps System is designed for CI/CD workflow in Kubernetes. It is based on [Jenkins](https://jenkins.io/) and provides one-stop DevOps console helping developers and maintainers build, test and publish their applications to Kubernetes in a straight-forward way. It also supports plugins management, Binary-to-Image (B2I), Source-to-Image (S2I), code dependency caching, code quality analysis and pipeline logging, etc.

The DevOps system combines application development and automatic publishing on the same platform, also supports to connect with third-party private image registry (e.g. Harbor) and code repositories (e.g. GitLab/GitHub/SVN/BitBucket) to visually construct a complete CI/CD pipeline which is usually useful for air gapped environment.

In KubeSphere v2.1, there are rich features within DevOps system:

- [Binary to Image](../../quick-start/b2i-war): Automatically pack your artifact such as WAR, JAR, Binary executables into Docker without writing Dockerfile and push to image repository, and finally deploy the image into Kubernetes cluster.
- [Source to Image](../../quick-start/source-to-image): Automatically compile and build your source code from code repository and pack the result into Docker without writing Dockerfile, push to image repository and finally deploy the image into Kubernetes cluster.
- [Jenkinsfile-free CI/CD pipeline with graphical editing panel](../../quick-start/jenkinsfile-out-of-scm): Without writing Jenkinsfile, you can compose pipeline using graphical editing panel which makes the user experience much better that other solutions.
- [Jenkinsfile-based CI/CD pipeline](../../quick-start/devops-online): If your code repository already has Jenkinsfile, you'd better to use this way to create pipeline.
- [GitLab and Harbor based CI/CD pipeline](../../harbor-gitlab-devops-offline)：Using on-premise GitLab and Harbor to create pipeline, which is useful for air gapped environment.

## Enable DevOps System before Installation

<font color=red>KubeSphere DevOps system requires at least 34m of CPU request and 2.69G of memory request for all-in-one installation, or at least 0.47 core of CPU request and 8.6G of memory request for multi-node installation. Please make sure your cluster has enough resource.</font>

> Note: This document is for installing KubeSphere on Linux machines. If you want to install KubeSphere and DevOps system on your existing Kubernetes cluster, please see [ks-installer](https://github.com/kubesphere/ks-installer).

Before starting the installation, you can change the values of `devops_enabled` and `sonarqube_enabled` in `conf/common.yaml` from `false` to `true` to enable DevOps system and SonarQube, then you can continue your installation by following the instructions of [All-in-One](../all-in-one) or [Multi-Node](../multi-node).

```yaml
#DevOps Configuration
devops_enabled: true
jenkins_memory_lim: 8Gi
jenkins_memory_req: 4Gi
jenkins_volume_size: 8Gi
jenkinsJavaOpts_Xms: 3g
jenkinsJavaOpts_Xmx: 6g
jenkinsJavaOpts_MaxRAM: 8g
sonarqube_enabled: true
#sonar_server_url: SHOULD_BE_REPLACED  # Supports connect with external SonarQube if you have, you can replace in these two fields.
#sonar_server_token: SHOULD_BE_REPLACED
```

## Enable DevOps System after Installation

If you already have a minimal KubeSphere setup, you still can edit the ConfigMap of ks-installer using the following command.

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

Then set devops from `False` to `True`.

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

Save it and exit. DevOps component will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.
