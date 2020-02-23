---
title: "验证可插拔功能组件的安装"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## 查看安装日志

开启可插拔功能组件的安装后，需要通过日志或 Pod 状态验证功能组件是否安装成功。

1. 查看 ks-installer 安装过程中产生的动态日志，等待安装成功：

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

当动态日志出现如下提示，说明开启的组件已安装成功。


```
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.53:30880
Account: admin
Password: P@88w0rd

NOTES：
  1. After logging into the console, please check the
     monitoring status of service components in
     the "Cluster Status". If the service is not
     ready, please wait patiently. You can start
     to use when all components are ready.
  2. Please modify the default password after login.

#####################################################
```

2. 安装成功后，可登陆控制台，在 `服务组件` 下查看可插拔功能组件下的所有组件是否都已经安装启动完毕。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191014190116.png)

## 验证可插拔功能组件的运行结果

除了在控制台查看组件状态，还可以通过 kubectl 命令确认可插拔的组件是否安装成功。

**通常情况下，当该 namespace 下的所有 Pod 状态都为 Running，并且 Job 都为 Completed 状态，则说明该组件安装成功。**

### 验证 KubeSphere 最小化安装

KubeSphere Installer 默认仅开启最小化安装，依次查看以下 3 个 namespace 下的 Pod 与 Job 状态：

```bash
kubectl get pod -n kubesphere-system
kubectl get pod -n kubesphere-monitoring-system
kubectl get pod -n kube-system
```

### 验证应用商店的安装

若开启安装了 [KubeSphere 应用商店](../install-openpitrix)，可通过以下命令来验证 Pod 与 Job 状态：


```bash
kubectl get pod -n openpitrix-system
```

### 验证 DevOps 系统的安装

若开启安装了 [KubeSphere DevOps 系统](../install-devops)，可通过以下命令来验证 Pod 与 Job 状态：


```bash
kubectl get pod -n kubesphere-devops-system
```

### 验证日志系统的安装

若开启安装了 [KubeSphere 日志系统](../install-logging)，可通过以下命令来验证 Pod 与 Job 状态：


```bash
kubectl get pod -n kubesphere-logging-system
```

### 验证 ServiceMesh（Istio）的安装

若开启安装了 [KubeSphere 微服务治理系统（Istio）](../install-servicemesh)，可通过以下命令来验证 Pod 状态：


```bash
kubectl get pod -n istio-system
```

### 验证 Metrics-server 的安装

若开启安装了 [Metrics-server](../install-metrics-server)，可通过以下命令来验证 Pod 状态：


```bash
kubectl get pod -n kube-system | grep metrics-server
```

## 如何重启 ks-installer

若需要重新执行安装任务，可以将 ks-installer 的 Pod 删除，手动重启 ks-installer：

```
$ kubectl delete pod ks-installer-xxxxxx-xxxxx -n kubesphere-system
```
