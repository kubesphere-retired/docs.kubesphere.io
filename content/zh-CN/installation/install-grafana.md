---
title: "开启安装 Grafana"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Grafana'
---

KubeSphere 平台本身的监控中心与监控指标已经非常丰富，基于 Prometheus 提供了支持多维度与多租户的监控系统。

若需要针对业务应用的自定义监控，则可以开启 Grafana 的安装。

## 安装前如何开启 Grafana 安装

1、安装 KubeSphere 前，在 Installer 中的 conf/common.yaml文件中，参考如下配置修改。

```
···
grafana_enabled: true # 是否额外安装 grafana，若需要自定义监控则开启
```

2、修改后保存，然后继续参考安装指南执行安装脚本，即可通过 Helm Chart 的方式来安装 Grafana。

## 安装后如何开启 Grafana 安装

通过修改 ks-installer 的 configmap 可以选装组件，执行以下命令。

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

**参考如下修改 ConfigMap**

```yaml
  monitoring:
     grafana:
       enabled: True  ## 是否开启安装 Grafana
```

保存退出，参考 [验证可插拔功能组件的安装](../verify-components) ，通过查询 ks-installer 日志或 Pod 状态验证功能组件是否安装成功。

## 访问 Grafana

待 Grafana 安装完成后，在 `kubesphere-monitoring-system` 项目下的服务列表中，进入 `Grafana` 然后点击 `更多操作` → `编辑外网访问`，将服务类型设置为 NodePort，即可通过 `{$NodeIP}:{$NodePort}` 访问 Grafana。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191129222744.png)

使用默认的账号密码 `admin / admin` 可登陆访问 Grafana。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191129223339.png)
