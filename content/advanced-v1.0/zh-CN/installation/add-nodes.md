---
title: "集群节点扩容"
---

安装 KubeSphere 后，在正式环境使用时可能会遇到服务器容量不足的情况，这时就需要添加新的服务器，然后将应用系统进行水平扩展来完成对系统的扩容。此时您可以根据实际业务需要对 Kubernetes 集群的 Node 节点进行扩容，KubeSphere 对于在 Kubernetes 集群中加入新 Node 是非常简单的，仅需简单两步即可完成集群节点扩容。节点扩容基于 Kubelet 的自动注册机制，新的 Node 将会自动加入现有的 Kubernetes 集群中。

需要说明的是，若以 all-in-one 模式安装的环境，集群默认存储为 local volume，不建议直接对其增加节点，增加节点适用于 multi-node 模式安装的环境。下面以 root 用户增加 node3 的配置为例。

### 第一步：修改主机配置文件

KubeSphere 支持混合扩容，即扩容新增的主机系统可以是 CentOS，也可以是 Ubuntu。当申请完新的主机后，在主机配置文件 `conf/hosts.ini` 根据需要增加的主机信息在 [all] 和 [kube-node] 部分对应添加一行参数，若扩容多台主机则依次添加多行参数。需要注意的是，扩容新的节点时不能修改原节点的主机名如 master、node1 和 node2，如下添加新节点 node3：

```
[all]
master ansible_connection=local  ip=192.168.0.1
node1  ansible_host=192.168.0.2  ip=192.168.0.2  ansible_ssh_pass=PASSWORD
node2  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_ssh_pass=PASSWORD    
node3  ansible_host=192.168.0.4  ip=192.168.0.4  ansible_ssh_pass=PASSWORD  
···
[kube-node]
master
node1
node2 
node3
···
```

### 第二步：执行扩容脚本

在 "/script" 目录执行 `add-nodes.sh` 脚本。待扩容脚本执行成功后，即可看到包含新节点的集群节点信息，可通过 KubeSphere 控制台的菜单选择 **基础设施** 然后进入 **主机管理** 页面查看，或者通过 Kubectl 工具执行 `kubectl get node` 命令，查看扩容后的集群节点详细信息。

```bash
$ ./add-nodes.sh
```

## 停用集群节点

同样，若需要停用或隔离集群中的节点，比如在硬件升级、硬件维护等情况下需要将某些 Node 进行隔离，集群管理员可以在 KubeSphere 控制台菜单选择 **基础设置 → 主机管理** 页面执行停用主机，可参考主机管理说明的 [停用或启用主机](../../infrastructure/nodes/#停用或启用主机)。
