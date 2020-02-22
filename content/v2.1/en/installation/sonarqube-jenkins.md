---
title: "Access Built-in SonarQube and Jenkins"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Access Built-in SonarQube and Jenkins'
---

## What is SonarQube

[SonarQube](https://www.sonarqube.org/) is an open-source platform developed by SonarSource for continuous inspection of code quality to perform automatic reviews with static analysis of code to detect bugs, code smells, and security vulnerabilities on 20+ programming languages. KubeSphere integrates SonarQube in DevOps component, you can access SonarQube UI according to the following steps.

## Prerequisite

You need to enable [KubeSphere DevOps system](../install-devops) installation and make sure SonarQube is set to true.

## Access SonarQube

### Get SonarQube NodePort

Run the command to get the NodePort of SonarQube, for example, `31359` is the NodePort of SonarQube service:

```
$ kubectl get svc -n kubesphere-devops-system | grep ks-sonarqube-sonarqube
ks-sonarqube-sonarqube               NodePort    10.233.20.169   <none>        9000:31359/TCP   48m
```

### Access SonarQube Console

As follows, we can access SonarQube login page via `http://{$NodeIP}:{$NodePort}` in browser, use default account `admin/admin` to log in.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213224148.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200213224500.png)

### Create SonarQube Token

See [How to create SonarQube Token](../../devops/sonarqube).

For further information, see [SonarQube Documentation](https://docs.sonarqube.org/latest/).

## Access Jenkins Server

Jenkins is an open source automation tool written in Java with plugins built for Continuous Integration purpose. KubeSphere integrates Jenkins to design and provide DevOps system, you can access built-in Jenkins server as follows.

1. The NodePort of Jenkins dashboard is `30180` by default, please make sure the traffic can pass through that NodePort, you may need to forward port and configure firewall to allow this rule in public cloud scenario.

2. Access Jenkins server via `http://${NodeIP}:${NODEPORT}` in your browser, use the default admin account of KubeSphere to log in since Jenkins server has connected with KubeSphere LDAP.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190427235503.png)

Reference [Jenkins Documentation](https://jenkins.io/doc/) for further information.
