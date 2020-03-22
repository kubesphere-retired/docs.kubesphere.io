---
title: "在 Kubernetes 离线部署 KubeSphere"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '将 KubeSphere 部署在 Kubernetes 之上'
---

KubeSphere 支持在已有 Kubernetes 集群之上部署 [KubeSphere](/zh-CN/)，以下方式适合无外网情况下的离线安装 KubeSphere 在 Kubernetes 之上。在安装之前，请确认您的环境满足以下 [前提条件](../prerequisites)：


> - `Kubernetes` 版本： `1.13.0 ≤ K8s version ≤ 1.16`
> - `Helm`，版本 `>= 2.10.0`
> - 集群可用`内存 >= 10G`
> - 建议配合持久化存储使用（可选）

可参考 [前提条件](../prerequisites) 验证，若待安装的环境满足以上条件则可以开始部署 KubeSphere。


## 部署 KubeSphere

1. 下载镜像包并解压。

```bash
$ wget https://kubesphere-installer.pek3b.qingstor.com/ks-only/kubesphere-images-advanced-2.0.2.tar.gz
```

```bash
$ tar -zxvf kubesphere-images-advanced-2.0.2.tar.gz
```

2. 导入镜像（由于镜像包较大，导入时间较久）。

```
$ docker load < kubesphere-images-advanced-2.0.2.tar
```

3. 克隆远端代码仓库，然后执行脚本将安装所需镜像导入本地镜像仓库。

```
$ git clone https://github.com/kubesphere/ks-installer.git
$ cd scripts
$ ./download-docker-images.sh 仓库地址
```

> 注意：“仓库地址” 请替换为本地镜像仓库地址，例： `./download-docker-images.sh  192.168.1.2:5000`

4. 替换 `deploy/kubesphere-installer.yaml` 中的镜像。

> 注：以下命令中 `192.168.1.2:5000/kubespheredev/ks-installer:advanced-2.0.2` 为示例镜像，执行时请替换。

```yaml
$ sed -i 's|kubespheredev/ks-installer:advanced-2.0.2|192.168.1.2:5000/kubespheredev/ks-installer:advanced-2.0.2|g' deploy/kubesphere-installer.yaml
```

5. 参考 [部署 KubeSphere](../install-on-k8s/#部署-kubesphere) 中的步骤继续执行安装。
