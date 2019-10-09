---
title: "常见问题" 
keywords: ''
description: ''
---

### 如何快速了解 KubeSphere

1、作为新手，如何快速了解 KubeSphere 的使用？

答：我们提供了多个快速入门的示例包括工作负载和 DevOps 工程，建议从 [快速入门](../../zh-CN/quick-start/quick-start-guide) 入手，参考 **快速入门** 并实践和操作每一个示例。

### Multi-Node 安装配置相关问题

2、[Multi-Node 模式](../installation/multi-node) 安装时，如果某些服务器的 **Ubuntu** 系统默认管理员用户为 `ubuntu`，若切换为 `root` 用户进行安装，应该如何配置和操作？

可通过命令 `sudo su` 切换为 root 用户后，在该节点查看是否能 ssh 连接到其他机器，如果 ssh 无法连接，则需要参考 `conf/hosts.ini` 的注释中 `non-root` 用户示例部分，如下面第二步 `hosts.ini` 配置示例所示，而最终执行安装脚本 `install.sh` 时建议以 `root` 用户执行安装。

第一步，查看是否能 ssh 连接到其他机器，若无法连接，则参考第二步配置示例。相反，如果 root 用户能够 ssh 成功连接到其它机器，则可以参考 Installer 中默认的 root 用户配置方式。

```
root@192.168.0.3 # ssh 192.168.0.2
Warning: Permanently added 'node1,192.168.0.2' (ECDSA) to the list of known hosts.
root@192.168.0.2's password: 
Permission denied, please try again.
```
第二步，如下示例使用 3 台机器，参考以下示例修改主机配置文件 `hosts.ini`。

**hosts.ini 配置示例**
```ini
[all]
master ansible_connection=local  ip=192.168.0.1  ansible_user=ubuntu  ansible_become_pass=Qcloud@123
node1  ansible_host=192.168.0.2  ip=192.168.0.2  ansible_user=ubuntu  ansible_become_pass=Qcloud@123
node2  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_user=ubuntu  ansible_become_pass=Qcloud@123

[kube-master]
master 	  	 

[kube-node]
node1 	 
node2

[etcd]
master	 

[k8s-cluster:children]
kube-node
kube-master 

```

### 安装前如何配置 QingCloud vNas

3、KubeSphere 支持对接 [QingCloud vNas](https://www.qingcloud.com/products/nas/) 作为集群的存储服务端，以下说明如何在 [QingCloud 控制台](console.qingcloud.com) 创建文件存储 vNas：

3.1. 选择 **文件存储 vNAS**，点击 **创建**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307223103.png)

3.2. 自定义名称，并选择与待安装机器相同的私有网络。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307223413.png)

3.3. 点击创建的 vNAS 进入详情页，在共享存储目标下点击 **创建**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307223611.png)

3.4. 目标类型保持 NFS，参考如下截图填写信息，完成后点击 **提交**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307223903.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307224027.png)

3.5. 选择 **账户**，点击 **创建**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307224602.png)

3.6. 自定义名称，IP 地址填写集群机器所在的网段，如 `192.168.0.0/24`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307233711.png)
![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307235304.png)

3.7. 查看 vNAS 的详情页，可以看到内网 IP 与 共享目录，这两处信息则需要在 Installer 中进行指定。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307235523.png)

如下，在 `/conf/vars.yml` 中先将 Local Volume Provisioner 设置为 false，然后在 NFS-Client provisioner 进行如下设置：


```bash
# NFS-Client provisioner deployment
nfs_client_enable: true
nfs_client_is_default_class: true
# Hostname of the NFS server(ip or hostname)
nfs_server: 192.168.0.22
# Basepath of the mount point to be used
nfs_path: /mnt/shared_dir
```

完成以上设置后，可参考安装指南继续进行配置和安装。

### 安装失败相关问题

4、安装过程中，如果遇到安装失败并且发现错误日志中有这类信息：`The following packages have pending transactions`，这种情况应该如何处理？

![安装问题](/faq-installation-1.png)

答：这是因为有些 transactions 操作没有完成，可以连接到安装失败的节点上，依次执行下列命令，并重新执行 `install.sh` 脚本：

```shell
$ yum install yum-utils -y
$ yum-complete-transaction
$ yum-complete-transaction --cleanup-only
```


### 流水线运行报错相关问题

5、创建 Jenkins 流水线后，运行时报错怎么处理？

![流水线报错](/faq-pipeline-error.png)

答：最快定位问题的方法即查看日志，点击 **查看日志**，具体查看出错的阶段 (stage) 输出的日志。比如，在 **push image** 这个阶段报错了，如下图中查看日志提示可能是 DockerHub 的用户名或密码错误。

![查看日志](/faq-pipeline-log.png)

6、运行流水线失败时，查看日志发现是 Docker 镜像 push 到 DockerHub 超时问题 (Timeout)，比如以下情况，要怎么处理？

![docker超时问题](/pipeline-docker-timeout.png)

答：可能由于网络问题造成，建议尝试再次运行该流水线。

### 如何查看 kubeconfig 文件

7、如何查看当前集群的 Kubeconfig 文件？

用户可以通过打开 web kubectl 查看 Kubeconfig 文件，仅管理员或拥有 web kubectl 权限的用户有权限。

![查看 Kubeconfig 文件](/view-kubeconfig.png)

### 如何访问 Jenkins 服务端

8、如何访问和登录 Jenkins 服务端？

Installer 安装将会同时部署 Jenkins Dashboard，该服务暴露的端口 (NodePort) 为 `30180`，确保外网流量能够正常通过该端口，然后访问公网 IP 和端口号 (${EIP}:${NODEPORT}) 即可。Jenkins 已对接了 KubeSphere 的 LDAP，因此可使用用户名 `admin` 和 KubeSphere 集群管理员的密码登录 Jenkins Dashboard。

### 关于对 CephRBD、GlusterFS 开源存储的支持方式

9、关于对 CephRBD、GlusterFS 开源存储的支持方式

Installer 集成了这两类开源存储的存储插件，并在安装过程基于配置文件帮助用户完成部署配置工作，但其**存储服务端的部署和运维并不包含在 KubeSphere 平台支持范围中**。

### NeonSAN 存储插件是否支持非 KubeSphere 的 Kubernetes 环境

10、NeonSAN 存储插件是否支持非 KubeSphere 的 Kubernetes 环境

支持，[NeonSAN 存储插件](https://github.com/yunify/qingstor-csi) 基于 CSI 0.3.0 开发，理论上可以支持 Kubernetes **1.11** 及以上版本，经过 KubeSphere 已验证可支持的版本包括 Kubernetes **1.12** 及以上版本，在非 KubeSphere 环境中部署 NeonSAN 存储插件可参考[此链接文档](https://github.com/yunify/qingstor-csi/blob/master/README_zh.md)，关于部署、使用的各种问题可直接在 GitHub 上提 issue。

> 说明：
> 若您在使用中遇到任何产品相关的问题，欢迎在 [GitHub Issue](https://github.com/kubesphere/docs.kubesphere.io/issues) 提问。
> 