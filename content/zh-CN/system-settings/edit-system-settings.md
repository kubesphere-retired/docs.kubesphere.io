---
title: "系统配置修改"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## 如何配置 CI 节点进行构建

应用程序在构建过程中往往需要拉取很多依赖，这会导致一些问题，如拉取时间长，网络不稳定导致构建异常等。为了更加稳定的运行流水线，以及更加充分的利用缓存加快构建速度，可以配置一个或一组 CI 节点，流水线以及 S2I 构建任务会更加偏向于绑定至 CI 节点上。

 1. 使用 admin 账户登陆 KubeSphere，点击 `平台管理`，并进入 `基础设置` 界面。
 ![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat758b433a7469f64fee9fffc59aac275b.png)

 2. 选择希望作为构建 CI 任务的节点，进入详情页，然后选择 `更多操作` 下的 `编辑标签`。
 ![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat947ac3c7ab08ea8b0c7121044c1d93a2.png)

 3. 为该节点设置标签: `node-role.kubernetes.io/worker=ci`，然后点击保存即可。
 ![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChatf4976c9ae64d596b7b7a5c5ac1f97c31.png)

流水线以及 S2I 构建任务会根据 [Node affinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity) 的特性优先调度至该节点。若希望设置 CI 节点组为构建任务专用节点，不允许或者尽量不允许其他 Pod 调度至 CI 节点，可以按照下列操作为 CI 节点设置 [污点](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/)。

 1. 在节点所在界面选择 `更多操作` 下的 `污点管理`。
 ![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat29f987aa5df21b3fb91fa9152bfed8d6.png)

 2. 设置污点的键为 `node.kubernetes.io/ci`，无需设置污点的值，并可根据自己的情况选择 `不允许调度` 或 `尽量不调度`。
 ![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat97eea56f0a74d899fa497b8e9a165826.png)

 3. 最后点击保存即可，至此就完成了快速入门示例的前提条件，**可返回快速入门下的 DevOps 流水线示例继续操作**。


 --------

## 如何修改 CoreDNS 配置

一、通过 CoreDNS 的 hosts 插件配置 KubeSphere 集群的 DNS 服务，使集群内部可通过 hostname 域名访问外部服务。

​	1.登陆集群控制节点，执行命令 `kubectl edit configmap coredns -n kube-system -o yaml`，该命令可编辑 coredns 的配置文件，编辑 data 字段，如下， hosts 的内容为新增内容。

```bash
data:
  Corefile: |
    .:53 {
        errors
        health
        hosts {
          192.168.0.2  harbor.devops.kubesphere.local
          192.168.0.2  gitlab.devops.kubesphere.local
          fallthrough
        }
        kubernetes cluster.local in-addr.arpa ip6.arpa {
          pods insecure
          upstream /etc/resolv.conf
          fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        proxy . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

**说明：`192.168.0.2`** 是 KubeSphere 集群的内任意节点IP，请根据实际情况填写。`harbor.devops.kubesphere.local` 和 `gitlab.devops.kubesphere.local` 分别为 Harbor 和 GitLab 的域名。

## 如何修改 Jenkins 初始化配置

通过修改 Jenkins 初始化配置，使在执行构建任务的容器中配置--insecure-registry，使 Harbor 能正常推拉镜像。

1. 以集群管理员账号 admin 登录 KubeSphere，先点击平台管理，然后进入企业空间。

![workspace](https://kubesphere-docs.pek3b.qingstor.com/png/workspace.png)

2. 选择 `system-workspace`，点击进入该企业空间

![sapce](https://kubesphere-docs.pek3b.qingstor.com/png/sapce.png)

3. 选择 `项目管理`，进入项目`kubesphere-devops-system`。

![namespace](https://kubesphere-docs.pek3b.qingstor.com/png/namespace.png)

4. 点击配置中心下的 `配置`，然后找到名称为 `jenkins-casc-config` 的配置文件，点击进入。

![configmap](https://kubesphere-docs.pek3b.qingstor.com/png/configmap.png)

5. 进入配置后，点击 `更多操作` 下面的 `编辑配置文件` 。

![editcm](https://kubesphere-docs.pek3b.qingstor.com/png/editcm.png)

6. 该配置文件共有配置4个服务，在 data.jenkins.yam.jenkins.clouds.kubernetes.templates 下，name 分别为 `base`、`nodejs`、`maven`、`go`，分别修改其各个 `name` 为 `docker-server` 下的 args 参数，将原来的 `args: "--insecure-registry harbor.devops.kubesphere:30280"` 改为 `args: "--insecure-registry harbor.devops.kubesphere.local:30280`。以 go 为示例，修改完后的配置如下(其中标注*的为修改行)：

```go
          - name: "go"
            namespace: "kubesphere-devops-system"
            label: "go"
            nodeUsageMode: "EXCLUSIVE"
            idleMinutes: 0 # Do not reuse pod.
            containers:
            - name: "go"
              image: "kubesphere/builder-go:advanced-1.0.0"
              command: "cat"
              ttyEnabled: true
              envVars:
              - containerEnvVar:
                  key: "DOCKER_HOST"
                  value: "tcp://localhost:2375"
            - name: "jnlp"
              image: "jenkins/jnlp-slave:3.27-1"
              args: "${computer.jnlpmac} ${computer.name}"
              resourceRequestCpu: "100m"
              resourceRequestMemory: "32Mi"
            - name: "docker-server"
              image: "docker:18.06.1-ce-dind"
              ttyEnabled: true
              privileged: true
              * args: "--insecure-registry harbor.devops.kubesphere.local:30280"
              envVars:
              - containerEnvVar:
                  key: "DOCKER_HOST"
                  value: "tcp://localhost:2375"
            workspaceVolume:
              emptyDirWorkspaceVolume:
                memory: false
```

修改更新后，需要登陆 Jenkins 重新加载，具体步骤请参考 [登陆 Jenkins 重新加载](../../devops/jenkins-setting/#%E7%99%BB%E9%99%86-jenkins-%E9%87%8D%E6%96%B0%E5%8A%A0%E8%BD%BD>)。
