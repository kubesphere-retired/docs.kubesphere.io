---
title: "Enable GitLab Installation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

[GitLab](https://gitlab.com/) is a complete CI/CD platform, the community version of GitLab has been integrated into KubeSphere installer, you can enable it as your private **source code management tool**. KubeSphere DevOps system supports to use GitLab as SCM in CI/CD pipeline.

<font color="red">Attention: We only recommend you to use built-in GitLab in test and development environment, please reference [GitLab Documentaion](https://docs.gitlab.com/) for production.</font>

## Enable GitLab Before Installation

1. Before installing KubeSphere, you can set `gitlab_enable: true` in `conf/common.yml` to enable GitLab installation.

```
# GitLab deployment
gitlab_enable: true
gitlab_domain: gitlab.devops.kubesphere.local
```

2. Save it, then you can back to follow all-in-one or multi-node guide to execute the installation, finally you can install gitlab together with KubeSphere.

## Enable gitlab After Installation

1. Edit the ConfigMap of ks-installer using following command:

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

Then set **enabled** from False to True:

```bash
gitlab:
      enabled: True
      domain: devops.kubesphere.local
```

Save it and exit, it will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.

## Access GitLab Console

First, you need to add a mapping record into `/etc/hosts` as following after successful installation, then you'll be able to access GitLab console in your browser.

```
# {$IP} {$GitLab domain}
139.198.10.10 gitlab.devops.kubesphere.local
```

Make sure the traffic can pass the nodeport `30880`, then enter `http://gitlab.devops.kubesphere.local:30080` in your browser, at this point, you can login GitLab with `admin / P@88w0rd` (the default admin account of KubeSphere).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200104173756.png)
