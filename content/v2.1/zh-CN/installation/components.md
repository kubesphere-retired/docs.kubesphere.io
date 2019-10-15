---
title: "自定义组件安装（安装后）"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

安装完成后，Installer 支持开启安装可选功能组件，您可以根据**业务需求和机器配置选择安装所需的组件**，体验 KubeSphere **完整的端到端的容器产品解决方案**，并且**所有组件都是开源免费**的。


## 可选安装组件介绍

注意：开启可选功能组件之前，请先参考下表确认集群的可用 CPU 与内存空间是否充足，否则可能会因为资源不足而导致的机器崩溃或其它问题。

## 自定义可选组件安装方法

1、通过修改 ks-installer 的 configmap 可以选装组件。可选组件包括：metrics-server、openpitrix、alerting、devops、servicemesh、notification、alerting、harbor、gitlab。执行以下命令，将需要安装的组件 enabled 值由 False 改成 True ，保存退出。

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

<br>

<details><summary> ks-installer ConfigMap 文件（点击展开）</summary>

```yaml
apiVersion: v1
data:
  ks-config.yaml: |
    ---
    kubernetes:
      apiserverAddr: https://192.168.0.3:6443      # master 地址 或多个 master 的负载均衡器地址

    etcd:
      endpointIps: 192.168.0.3
      port: 2379
      tlsEnable: True

    persistence:
      storageClass: ""    # 持久化存储依赖的存储类型

    plugins:
      storage: "openebs-hostpath"    # 存储插件，如 "csi-qingcloud"

    common:
      mysqlVolumeSize: 20Gi   
      minioVolumeSize: 20Gi
      etcdVolumeSize: 20Gi
      openldapVolumeSize: 2Gi
      redisVolumSize: 2Gi

    metrics-server:    
      enabled: True                # 是否安装 Metrics-server，若禁止则 HPA 将无法使用

    console:
      disableMultiLogin: True      # 是否开启控制台账号的多点登录
      port: 30880

    monitoring: 
      prometheusReplica: 2
      prometheusMemoryRequest: 400Mi
      prometheusVolumeSize: 20Gi
      grafana:
        enabled: True              # 是否安装 grafana，若有自定义监控需求可选装此组件

    logging:        
      enabled: True                # 是否安装内置的日志系统，建议开启，否则 KubeSphere 将无法看到任何日志
      elasticsearchMasterReplica: 1
      elasticsearchDataReplica: 2
      elasticsearchVolumeSize: 20Gi
      logMaxAge: 7
      elkPrefix: logstash
      containersLogMountedPath: ""  # 容器日志挂盘路径
      kibana:
        enabled: True               # 是否安装 Kibana，
      logsidecarInjector:
        enabled: True               # 是否安装和增加落盘日志收集器到用户创建的工作负载副本中

    openpitrix:
      enabled: True                 # 是否安装内置的应用商店，若机器配置充裕建议安装

    devops:
      enabled: True                 # 是否安装内置的应用商店，若机器配置充裕建议安装
      jenkinsMemoryLim: 8Gi
      jenkinsMemoryReq: 4Gi
      jenkinsVolumeSize: 8Gi
      jenkinsJavaOpts_Xms: 3g
      jenkinsJavaOpts_Xmx: 6g
      jenkinsJavaOpts_MaxRAM: 8g
      sonarqube:
        enabled: True               # 是否安装内置的 SonarQube （代码静态分析工具）

    servicemesh:                    # 是否安装内置的应用与服务治理，若机器配置充裕建议安装
      enabled: True
    
    notification:                   # 是否安装内置的邮件通知系统，若机器配置充裕建议安装
      enabled: True

    alerting:
      enabled: True                 # 是否安装内置的告警系统，若机器配置充裕建议安装

    harbor:
      enabled: True                 # 是否安装 Harbor（第三方应用）作为私有镜像仓库
      domain: harbor.devops.kubesphere.local
    gitlab:
      enabled: True                 # 是否安装 GitLab（第三方应用）作为私有代码仓库
      domain: devops.kubesphere.local
kind: ConfigMap
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
    ···
```

</details>


-------

<br>

2、查看 ks-installer 安装过程中产生的动态日志，等待安装成功：

```bash
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

3、安装成功后，可登陆控制台，在`服务组件`下查看所有组件是否都已经安装启动完毕。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191014190116.png)