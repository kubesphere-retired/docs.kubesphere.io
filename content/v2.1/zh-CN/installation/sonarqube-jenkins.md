---
title: "访问内置 SonarQube 和 Jenkins 服务端"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## 访问 SonarQube

[SonarQube](https://www.sonarqube.org/) 是一个开源的代码分析软件，用来持续分析和检测代码的质量，支持检测 Java、C#、C、C++、JavaScript 等二十多种编程语言。通过 SonarQube 可以检测出项目中潜在的 Bug、漏洞、代码规范、重复代码、缺乏单元测试等问题，SonarQube 提供了 UI 界面进行查看和管理。KubeSphere 安装时默认内置了 SonarQube 服务，可参考如下步骤，访问内置 SonarQube。

### 第一步：查看 SonarQube 服务端口

执行如下命令，查看 SonarQube 服务端口，可以看到其端口为 `31359`。

```bash
$ kubectl get svc -n kubesphere-devops-system | grep ks-sonarqube-sonarqube
ks-sonarqube-sonarqube               NodePort    10.233.20.169   <none>        9000:31359/TCP   48m
```

### 第二步：访问 SonarQube

若 KubeSphere 部署在云平台，需要在外网访问 SonarQube，在端口转发规则中将**内网端口** 31359 转发到**源端口** 31359，然后在防火墙开放这个**源端口**，确保流量能够通过该端口，然后通过 `http://{$公网 I}:{$NodePort}` 进行访问。例如在 QingCloud 平台配置端口转发和防火墙规则，可参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。

> 说明：若部署在私有环境，则可以在集群的任意节点通过 `http://{$节点 IP}:{$NodePort}` 进行访问。

如下，在浏览器中访问 SonarQube，初次登录的默认账号密码为 `admin / admin`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190427145105.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190427145209.png)

### 创建 SonarQube Token

可参考 [创建 SonarQube Token](../../devops/sonarqube)。

关于 SonarQube 的使用说明请参考 [SonarQube 官方文档](https://docs.sonarqube.org/latest/)。

## 访问 Jenkins 服务端

Jenkins 是一款由 Java 开发的开源的持续集成工具，KubeSphere 内置的 Jenkins 服务端可参考如下步骤登录访问。

1、Jenkins Dashboard 服务暴露的端口 (NodePort) 默认为 `30180`，若在云平台部署 KubeSphere，则需要进行端口转发和添加防火墙规则，确保外网流量能够正常通过该端口。

2、然后访问公网 IP 和端口号即 `http://${EIP}:${NODEPORT}`，Jenkins 已对接了 KubeSphere 的 LDAP，因此可使用用户名 `admin` 和 KubeSphere 集群管理员的密码 (初始密码为 P@88w0rd) 登录 Jenkins Dashboard。

> 说明：若部署在私有环境，则可以在集群的任意节点通过 `http://{$节点 IP}:30180` 进行访问。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190427235503.png)

关于 Jenkins 的使用说明请参考 [Jenkins 官方文档](https://jenkins.io/doc/)。









