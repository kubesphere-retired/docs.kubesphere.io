---
title: "Multi-node 模式"
---

## Multi-Node 模式

`Multi-Node` 即多节点集群部署，部署前建议您选择集群中任意一个节点作为一台任务执行机 (taskbox)，为准备部署的集群中其他节点执行部署的任务，且 taskbox 应能够与待部署的其他节点进行 **ssh 通信**。

## 前提条件

已购买 KubeSphere 高级版，并已下载了高级版的 Installer 至目标安装机器。

### 第一步: 准备主机

您可以参考以下节点规格 准备 **`至少 2 台`** 符合要求的主机节点开始 `multi-node` 模式的部署。

| 操作系统 | 最小配置 | 推荐配置 |
| --- | --- | --- |
| ubuntu 16.04 LTS 64bit | CPU：12 核 <br/> 内存：24 G <br/> 磁盘：40 G | CPU：16 核 <br/> 内存：32 G <br/> 磁盘：100 G |
| CentOS 7.4 64bit | CPU：12 核 <br/> 内存：24 G <br/> 磁盘：40 G | CPU：16 核 <br/> 内存：32 G <br/> 磁盘：100 G |

以下用一个示例介绍 multi-node 模式部署多节点，此示例准备了 3 台主机，以主机名为 master 的节点作为任务执行机 taskbox，各节点主机名可由用户自定义。

> 说明：高级版支持 Master 节点高可用配置，若需要配置请参阅 [Master 节点高可用配置](../master-ha)。

假设主机信息如下所示：

| 主机IP | 主机名 | 集群角色 |
| --- | --- | --- |
|192.168.0.1|master|master，etcd，node|
|192.168.0.2|node1|node|
|192.168.0.3|node2|node|

**集群架构：** 单 master 单 etcd 多 node

![](/pic04.svg)

> 说明：高级版支持 `etcd` 高可用，etcd 作为一个高可用键值存储系统，etcd 节点个数至少需要 1 个，部署多个 etcd 能够使集群更可靠，etcd 节点个数建议设置为`奇数个`，在 `conf/hosts.ini` 中配置。

### 第二步: 准备安装包

**1.** 在获取安装包后，执行以下命令。

```bash
$ tar -zxvf KubeInstaller-advanced-1.0.0.tar.gz
```

**2.** 进入 “`KubeInstaller-advanced-1.0.0`” 目录

```bash
$ cd KubeInstaller-advanced-1.0.0
```

**3.** 编辑主机配置文件 `conf/hosts.ini`，为了对待部署目标机器及部署流程进行集中化管理配置，集群中各个节点在主机配置文件 `hosts.ini` 中应参考如下配置。以下示例在 CentOS 7.5 上使用 `root` 用户安装，每台机器信息占一行，不能分行。若以 ubuntu 用户进行安装，可参考主机配置文件的注释 `non-root` 示例部分编辑。

**root 配置示例：**

```ini
[all]
master ansible_connection=local  ip=192.168.0.1
node1  ansible_host=192.168.0.2  ip=192.168.0.2  ansible_ssh_pass=PASSWORD
node2  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_ssh_pass=PASSWORD

[kube-master]
master

[kube-node]
master
node1
node2

[etcd]
master

[k8s-cluster:children]
kube-node
kube-master
```

> 说明：
>
> - [all] 中需要修改集群中各个节点的内网 IP 和主机 root 用户密码。主机名为 "master" 的节点作为 taskbox 无需填写密码，[all] 中其它参数比如 node1 和 node2 需要分别替换 `ansible_host` 和 `ip` 为当前 node1 和 node2 的内网 IP，其 `ansible_ssh_pass` 即替换为各自主机的 root 用户登录密码。
> -  "master" 节点作为 taskbox，用来执行整个集群的部署任务，同时 "master" 节点在 kubernetes 集群中也作为 master 和 etcd ，应将主机名 "master" 填入 [kube-master] 和 [etcd] 部分。
> - 主机名为 "master"，"node1"，"node2" 的节点， 作为 kubernetes 集群的 node 节点，应填入 [kube-node] 部分。<br>
>
> 参数解释：<br>
> - `ansible_connection`: 与主机的连接类型，此处设置为 `local` 即本地连接
> - `ansible_host`: 集群中将要连接的主机名 
> - `ip`: 集群中将要连接的主机 IP  
> - `ansible_ssh_pass`: 待连接主机 root 用户的密码


**5.** Multi-Node 模式进行多节点部署时，您需要预先准备好对应的存储端，再参考 [存储配置说明](#存储配置说明) 配置集群的存储类型。网络、存储等相关内容需在 `conf/vars.yml` 配置文件中指定或修改，本文档以青云块存储插件 [qingcloud-csi](../../storage/qingcloud-storage) 为例。

> 说明：
> - 根据配置文件按需修改相关配置项，未做修改将以默认参数执行。
> - 网络：默认插件 `calico`。
> - 支持存储类型：[青云块存储](https://docs.qingcloud.com/product/storage/volume/)、[企业级分布式存储 NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)、[GlusterFS](https://www.gluster.org/)、[CephRBD](https://ceph.com/)、NFS、local-storage，存储配置相关的详细信息请参考 [存储配置说明](#存储配置说明)。
> - Multi-node 安装时需要配置持久化存储，因为它不支持 local storage，因此把 local storage 的配置修改为 false，然后配置持久化存储如 QingCloud-CSI (青云块存储插件)、GlusterFS、CephRBD 等。如下所示为配置 QingCloud-CSI （`qy_access_key_id`、`qy_secret_access_key` 和 `qy_zone` 应替换为您实际环境的参数，详见 [qingcloud-csi](../../storage/qingcloud-storage)）。
> - 安装 KubeSphere 后，如果需要对集群节点扩容，可参考 [集群节点扩容说明](#集群节点扩容说明)。
> - 由于 Kubernetes 集群的 Cluster IP 子网网段默认是 10.233.0.0/18，Pod 的子网网段默认是 10.233.64.0/18，因此部署 KubeSphere 的节点 IP 地址范围不应与以上两个网段有重复，若遇到地址范围冲突可在配置文件 `conf/vars.yaml` 修改 `kube_service_addresses` 或 `kube_pods_subnet` 的参数。

**示例：**

```yaml
# Local volume provisioner deployment(Only all-in-one)
local_volume_provisioner_enabled: false
local_volume_provisioner_storage_class: local
local_volume_is_default_class: false


# QingCloud-CSI 
qy_csi_enabled: true
qy_csi_is_default_class: true
# Access key pair can be created in QingCloud console
qy_access_key_id: ACCESS_KEY_ID
qy_secret_access_key: ACCESS_KEY_SECRET
# Zone should be the same as Kubernetes cluster
qy_zone: ZONE
# QingCloud IaaS platform service url.
qy_host: api.qingcloud.com
qy_port: 443
qy_protocol: https
qy_uri: /iaas
qy_connection_retries: 3
qy_connection_timeout: 30
# The type of volume in QingCloud IaaS platform. 
# 0 represents high performance volume. 
# 3 respresents super high performance volume. 
# 1 or 2 represents high capacity volume depending on cluster‘s zone.
qy_type: 0
qy_maxSize: 500
qy_minSize: 10
qy_stepSize: 10
qy_fsType: ext4

```

### 第三步: 安装 KubeSphere

KubeSphere 多节点部署会自动化地进行环境和文件监测、平台依赖软件的安装、Kubernetes 和 etcd 集群的自动化部署，以及存储的自动化配置。Installer 默认安装的 Kubernetes 版本是 v1.10.5，目前已支持 v1.11.2，如需安装 v1.11.2 可在配置文件 `conf/vars.yaml` 中修改 `kube_version` 的参数为 v1.11.2，再执行安装，安装成功后可通过 KubeSphere 控制台右上角点击关于查看安装的版本。KubeSphere 安装包将会自动安装一些依赖软件，如 Ansible (v2.4+)，Python-netaddr (v0.7.18+)，Jinja (v2.9+)。

参考以下步骤开始 multi-node 部署：

**1.** 进入 `scripts` 目录

```bash
$ cd scripts
```

**2.** 执行 `install.sh` 脚本：

```bash
$ ./install.sh
```

**3.** 输入数字 `2` 选择第二种 Multi-node 模式开始部署，安装程序会提示您是否已经配置过存储，若未配置请输入 "no"，返回目录继续配置存储并参考 [存储配置说明](#存储配置说明)：

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Cluster-scaling
*   4) Uninstall
*   5) Quit
################################################
https://kubesphere.io/               2018-11-08
################################################
Please input an option: 2

```

**4.** 测试 KubeSphere 集群部署是否成功：

**(1)** 待 install.sh 执行完后，当看到如下 `"Successful"` 界面，则说明 KubeSphere 安装成功。若需要在外网访问，可能需要绑定公网 EIP 并配置端口转发，若公网 EIP 有防火墙，请在防火墙添加规则放行对应的端口，外部才能够访问。

```bash
successsful!
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.1:32130
Account: admin
Password: passw0rd

NOTE：Please modify the default password after login.
#####################################################
```
**(2)** 安装成功后，浏览器访问对应的 url，即可进入 KubeSphere 登录界面，可使用默认的用户名和密码登录 KubeSphere 控制台体验，参阅 [快速入门](../../quick-start/quick-start-guide) 帮助您快速上手 KubeSphere。

![KubeSphere 控制台](/kubesphere-console.png)