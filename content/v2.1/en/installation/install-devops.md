---
title: "Enable KubeSphere DevOps System Installation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Enable KubeSphere DevOps System Installation'
---

## What is KubeSphere DevOps System

KubeSphere DevOps System is designed for CI/CD workflow in Kubernetes, based on [Jenkins](https://jenkins.io/), provides one-stop DevOps system which helps developers and maintainers to build, test and publish their application to Kubernetes in an easy way.

The DevOps system combines application development and automatic publishing in the same platform, also supports to connect with third-party private image registry (e.g. Harbor) and code repositories (e.g. GitLab/GitHub/SVN/BitBucket) to construct a complete CI/CD pipeline in private scenarios, providing end-to-end users experience and visualize your CI/CD pipeline.

In KubeSphere v2.1, there are abundant features within DevOps system:

- CI/CD pipeline (Based on Jenkinsfile)
- CI/CD pipeline graphical editing panel (No need to write Jenkinsfile)
- Binary to image - upload and publish your binary to Kubernetes in one click
- Source to image - publish your application from source code repository to Kubernetes


## Enable DevOps System Before Installation

<font color=red>KubeSphere DevOps system requires at least 34 m (CPU request) and 2.69 G (Memory request) for all-in-one installation, or at least 0.47 core (CPU request) and 8.6 G (Memory request) for multi-node installation, make sure your cluster has enough resource.</font>

> Note: This guide is only used for Linux installer, if you are going to install KubeSphere and DevOps system on your existing Kubernetes, see [ks-installer](https://github.com/kubesphere/ks-installer).

Before execute installation, you can enable `devops_enabled` and `sonarqube_enabled` in `conf/common.yaml` to allow DevOps system and SonarQube installation according to the following configuration, then you can back to All-in-one or Multi-node guide to continue installation.

```bash
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

## Enable Application Store After Installation

Edit the ConfigMap of ks-installer using following command:

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

Then set OpenPitrix from False to True:

```bash
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

Save it and exit, it will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.
