---
title: "KubeSphere 安装指南"
---

## 简介

[KubeSphere](https://kubesphere.io) 是在目前主流容器调度平台 [Kubernetes](https://kubernetes.io) 之上构建的 **企业级分布式多租户容器管理平台**，为用户提供简单易用的操作界面以及向导式操作方式，KubeSphere 提供了在生产环境集群部署的全栈化容器部署与管理平台。

## 部署 KubeSphere

KubeSphere 部署支持 **`all-in-one`** 和 **`multi-node`** 两种部署模式， KubeSphere Installer 采用 **Ansible** 对部署目标机器及部署流程进行集中化管理配置。采用预配置模板，可以在部署前通过对相关配置文件进行自定义实现对部署过程的预配置，以适应不同的 IT 环境，帮助您快速部署 KubeSphere。

- KubeSphere 集群中由于部署服务的不同，分为管理节点和计算节点两个角色。
- 当进行 all-in-one 模式进行单节点部署时，这个节点既是管理节点，也是计算节点。
- 当进行 multi-node 模式部署多节点集群时，可在配置文件中设置集群角色。
- 由于部署过程中需要更新操作系统和从镜像仓库拉取镜像，因此必须能够访问外网。无外网环境需先下载离线安装包安装。
- 如果是新装系统，在 Software Selection 界面需要把 OpenSSH Server 选上。


## All-in-One 模式

`All-in-One` 模式即单节点部署，仅建议您用来测试或熟悉部署流程和了解 KubeSphere 功能特性，在正式使用环境建议使用 `multi-node` 模式，请参考下文的 `multi-node` 模式。

### 第一步: 准备主机（单节点）

您可以参考以下节点规格准备一台符合要求的主机节点开始 `all-in-one` 模式的部署。

| 操作系统 | 最小配置 | 推荐配置 |
| --- | --- | --- |
| Ubuntu 16.04 LTS 64bit | CPU：8 核 <br/> 内存：12 G <br/> 磁盘：40 G | CPU：16 核 <br/> 内存：32 G <br/> 磁盘：100 G |
| CentOS 7.4 64bit | CPU：8 核 <br/> 内存：12 G <br/> 磁盘：40 G | CPU：16 核 <br/> 内存：32 G <br/> 磁盘：100 G |

### 第二步: 准备安装包（单节点）

**1.**  下载 [KubeSphere Installer](https://kubesphere.io/download/)，跳转到下载页面后也可以通过 `curl -O url` 或 `wget url` 命令获取 Installer。

|KubeSphere 版本|支持系统（将支持更多系统）|
|--------------|-------|
|Dev 版|Ubuntu 16.04 LTS 64bit， <br> CentOS 7.4 64bit| 
|Stable (Alpha 版)|Ubuntu 16.04 LTS 64bit| 
|Offline 版|Ubuntu 16.04.4 LTS 64bit，<br> Ubuntu 16.04.5 LTS 64bit|


**2.** 获取 KubeSphere 安装包后，以 Alpha 版本的安装包为例，执行以下命令解压安装包。若下载的是 Dev 或 Offline 版本，则替换为 Dev 或 Offline 对应的包名和目录名。

```bash
$ tar -zxvf kubesphere-all-express-1.0.0-alpha.tar.gz
```

**3.** 进入 “`kubesphere-all-express-1.0.0-alpha`” 文件夹

```bash
$ cd kubesphere-all-express-1.0.0-alpha
```

### 第三步: 安装 KubeSphere（单节点）

> 说明：
> - 通常情况您不需要修改任何配置，直接安装即可。
> - 若您需要自定义配置文件的安装参数，如网络、存储等相关内容需在 **`conf/vars.yml`** 配置文件中指定或修改。
> - 由于 Kubernetes 集群的 Cluster IP 子网网段默认是 10.233.0.0/18，Pod 的子网网段默认是 10.233.64.0/18，因此部署 KubeSphere 的节点 IP 地址范围不应与以上两个网段有重复，若遇到地址范围冲突可在配置文件 `conf/vars.yaml` 修改 `kube_service_addresses` 或 `kube_pods_subnet` 的参数。
> - 网络：默认插件 `calico`。
> - 支持存储类型：QingCloud-CSI（Dev 版支持）、GlusterFS、CephRBD、local-storage，存储配置相关的详细信息请参考 [存储配置说明](#存储配置说明)。
> - All-in-One 默认会用 local storage 作为存储类型，由于 local storage 不支持动态分配，installer 会预先创建 8 个可用的 10G PV 供使用，若存储空间不足则需要手动创建 Persistent Volume (PV)，参见 [Local Volume 使用方法](/express/zh-CN/manage-storages/#local-volume-使用方法)。

KubeSphere 部署过程中将会自动化地进行环境和文件监测、平台依赖软件的安装、Kubernetes 和 etcd 的自动化部署，以及存储的自动化配置。Installer 默认安装的 Kubernetes 版本是 v1.10.5，目前已支持 v1.11.2，如需安装 v1.11.2 可在配置文件 `conf/vars.yaml` 中修改 `kube_version` 的参数为 v1.11.2，再执行安装，安装成功后可通过 KubeSphere 控制台右上角点击关于查看安装的版本。KubeSphere 安装包将会自动安装一些依赖软件，如 Ansible (v2.4+)，Python-netaddr (v0.7.18+)，Jinja (v2.9+)。

参考以下步骤开始 all-in-one 部署：

**1.** 进入 `scripts` 目录

```bash
$ cd scripts
```

**2.** 执行 `install.sh` 脚本：

```bash
$ ./install.sh
```

**3.** 输入数字 `1` 选择第一种即 all-in-one 模式开始部署：

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Cluster-scaling
*   4) Quit
################################################
https://kubesphere.io/               2018-07-27
################################################
Please input an option: 1

```

**4.** 测试 KubeSphere 单节点部署是否成功：

**(1)** 待 install.sh 执行完后，当看到如下 `"Successful"` 界面，则说明 KubeSphere 安装成功。

```bash
PLAY RECAP *********************************************
KubeSphere     : ok=69 changed=68 unreachable=0 failed=0
Successful!
########################################################
KubeSphere is running！
Matser IP: 192.168.100.10
ks-console-nodeport: 32117
ks-apiserver-nodeport: 32002
########################################################
```


**(2)** 以上可以看到两个 nodeport，也可以通过命令 `kubectl get svc -n kubesphere-system` 查看端口号。在 Kubernetes 中 nodeport 是提供给集群外部客户访问该 Service 入口的一种方式，Kubernetes 中的 nodeport 一般是高位 30000 - 32767。您可以通过浏览器，使用集群中任一节点的 IP 地址和端口号即 `<NodeIP>:ks-console-nodeport` 访问 KubeSphere 控制台，如上图 [http://192.168.100.10:32117](http://192.168.100.10:32117，)。由于服务的常用访问端口通常是低位，因此也可以通过公网 IP 并将高位端口转发后访问控制台，如：[http://139.198.121.143:8080](http://139.198.121.143:8080)， 即可进入 KubeSphere 登录界面，能看到如下用户界面说明 KubeSphere 能够正常访问和使用：

> 注： 若公网 IP 有防火墙，请在防火墙添加规则放行对应的端口，外部才能够访问。

![KubeSphere console](/pic02.png)

KubeSphere 部署成功后，可以使用以下的用户名和密码登录 KubeSphere 控制台体验：

> Account: admin@kubesphere.io 
>
> Password: passw0rd

关于如何使用请参考 [《KubeSphere 用户指南》](/express/zh-CN/user-case/)。



## Multi-Node 模式

`Multi-Node` 即多节点集群部署，部署前建议您选择集群中任意一个节点作为一台任务执行机 `(taskbox)`，为准备部署的集群中其他节点执行部署的任务，且 taskbox 应能够与待部署的其他节点进行 `ssh 通信`。

### 第一步: 准备主机（多节点）

您可以参考以下节点规格 准备 **`至少 2 台`** 符合要求的主机节点开始 `multi-node` 模式的部署。

| 操作系统 | 最小配置 | 推荐配置 |
| --- | --- | --- |
| ubuntu 16.04 LTS 64bit | CPU：8 核 <br/> 内存：12 G <br/> 磁盘：40 G | CPU：16 核 <br/> 内存：32 G <br/> 磁盘：100 G |
| CentOS 7.4 64bit | CPU：8 核 <br/> 内存：12 G <br/> 磁盘：40 G | CPU：16 核 <br/> 内存：32 G <br/> 磁盘：100 G |

以下用一个示例介绍 multi-node 模式部署多节点，此示例准备了 3 台主机，以主机名为 master 的节点作为任务执行机 taskbox，各节点主机名可由用户自定义。假设主机信息如下所示：

| 主机IP | 主机名 | 集群角色 |
| --- | --- | --- |
|192.168.0.10|master|master，etcd，node|
|192.168.0.20|node1|node|
|192.168.0.30|node2|node|

**集群架构：** 单 master 单 etcd 多 node

![](/pic04.svg)

> `etcd` 作为一个高可用键值存储系统，etcd 节点个数至少需要 1 个，部署多个 etcd 能够使集群更可靠，etcd 节点个数建议设置为`奇数个`，在当前 KubeSphere Express 版本暂支持单个 etcd 节点，将会在下一个 Advanced Edition 版本中支持 etcd 多节点部署。

### 第二步: 准备安装包（多节点）

**1.**  下载 [KubeSphere Installer](https://kubesphere.io/download/)，跳转到下载页面后也可以通过 `curl -O url` 或 `wget url` 命令获取 Installer。

|KubeSphere 版本|支持系统（将支持更多系统）|
|--------------|-------|
|Dev 版|Ubuntu 16.04 LTS 64bit， <br> CentOS 7.4 64bit| 
|Stable (Alpha 版)|Ubuntu 16.04 LTS 64bit| 
|Offline 版|Ubuntu 16.04.4 LTS 64bit，<br> Ubuntu 16.04.5 LTS 64bit|



**2.** 获取 KubeSphere 安装包后，以 Alpha 版本的安装包为例，执行以下命令解压安装包。若下载的是 Dev 或 Offline 版本，则替换为 Dev 或 Offline 对应的包名和目录名。

```bash
$ tar -zxvf kubesphere-all-express-1.0.0-alpha.tar.gz
```

**3.** 进入 “`kubesphere-all-express-1.0.0-alpha`” 文件夹

```bash
$ cd kubesphere-all-express-1.0.0-alpha
```

**4.** 编辑主机配置文件 `conf/hosts.ini`，为了对待部署目标机器及部署流程进行集中化管理配置，集群中各个节点在主机配置文件 `hosts.ini` 中应参考如下配置，以 Alpha 版本的主机配置文件为例。以下示例在 Ubuntu 16.04 上使用 `ubuntu` 用户安装，每台机器信息占一行，不能分行。

**Alpha 版示例：**

```ini
[all]
maser  ansible_connection=local local_release_dir={{ansible_env.HOME}}/releases ansible_user=ubuntu ansible_become=yes ansible_become_user=root ansible_become_pass=password
node1  ansible_host=192.168.0.20 ip=192.168.0.20 ansible_user=ubuntu ansible_become=yes ansible_become_user=root ansible_become_pass=password
node2  ansible_host=192.168.0.30 ip=192.168.0.30 ansible_user=ubuntu ansible_become=yes ansible_become_user=root ansible_become_pass=password

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
> - [all] 中需要修改集群中各个节点的内网 IP 和主机 ubuntu 用户密码。主机名为 "master" 的节点作为 taskbox 仅需要将 `ansible_become_pass` 替换为当前任务执行机的 ubuntu 用户登录密码，[all] 中其它参数比如 node1 和 node2 需要分别替换 `ansible_host` 和 `ip` 为当前 node1 和 node2 的内网 IP，node1 和 node2 的 `ansible_become_pass` 即替换为各自主机的 ubuntu 用户登录密码。
> -  "master" 节点作为 taskbox，用来执行整个集群的部署任务，同时 "master" 节点在 kubernetes 集群中也作为 master 和 etcd ，应将主机名 "master" 填入 [kube-master] 和 [etcd] 部分。
> - 主机名为 "master"，"node1"，"node2" 的节点， 作为 kubernetes 集群的 node 节点，应填入 [kube-node] 部分。<br>
>
> 参数解释：<br>
> 
> - `ansible_host`: 集群中将要连接的主机名 
> - `ip`: 集群中将要连接的主机 IP 
> - `ansible_user`: 默认使用的 SSH 登录用户名 
> - `ansible_become`: 是否允许权限升级 (yes/no)
> - `ansible_become_user`: 权限升级用户（root） 
> - `ansible_become_pass`: 待连接主机的密码. 


- 若下载的是 Dev 或 Offline 版本的安装包， 安装包中 `conf/hosts.ini` 的 `[all]` 部分参数如 `ansible_host` 、 `ip` 、 `ansible_become_pass` 和 `ansible_ssh_pass` 需替换为您实际部署环境中各节点对应的参数。注意 `[all]` 中参数的配置方式分为 root 和 非 root 用户，非 root 用户的配置方式在安装包的 `conf/hosts.ini` 的注释部分已给出示例，请根据实际的用户身份修改配置参数。


**5.** Multi-Node 模式进行多节点部署时，您需要预先准备好对应的存储端，再参考 [存储配置说明](#存储配置说明) 配置集群的存储类型。网络、存储等相关内容需在 `conf/vars.yml` 配置文件中指定或修改。

> 说明：
> - 根据配置文件按需修改相关配置项，未做修改将以默认参数执行。
> - 由于 Kubernetes 集群的 Cluster IP 子网网段默认是 10.233.0.0/18，Pod的子网网段默认是 10.233.64.0/18，因此部署 KubeSphere 的节点 IP 地址范围不应与以上两个网段有重复，若遇到地址范围冲突可在配置文件 `conf/vars.yaml` 修改 `kube_service_addresses` 或 `kube_pods_subnet` 的参数。
> - 网络：默认插件 `calico`。
> - 支持存储类型：QingCloud-CSI（Dev 版支持）、GlusterFS、CephRBD 等， 存储配置相关的详细信息请参考 [存储配置说明](#存储配置说明)
> - 通常情况您需要配置持久化存储，multi-node 不支持 local storage，因此把 local storage 的配置修改为 false，然后配置持久化存储如 QingCloud-CSI、GlusterFS、CephRBD 等。如下所示为配置 QingCloud-CSI （`qy_access_key_id`、`qy_secret_access_key` 和 `qy_zone` 应替换为您实际环境的参数）。
> - 安装 KubeSphere 后，如果需要对集群节点扩容，可参考 [集群节点扩容说明](#集群节点扩容说明)。

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

### 第三步: 安装 KubeSphere（多节点）

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

**3.** 输入数字 `2` 选择第二种 Multi-node 模式开始部署：

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Cluster-scaling
*   4) Quit
################################################
https://kubesphere.io/               2018-07-27
################################################
Please input an option: 2

```


**提示：**

> - 安装程序会提示您是否已经配置过存储，若未配置请输入 "no"，返回目录继续配置存储并参考 [存储配置说明](#存储配置说明)
> - Dev 和 Offline 版本的安装包不再需要配置 ssh 免密登录，只提示用户是否配置过存储。
> - 若下载的是 Alpha 版本的安装包， taskbox 需配置与待部署集群中所有节点的 `ssh 免密登录`，若还未配置 ssh 免密登录，在执行 `install.sh` 安装脚本时会提示用户是否已经配置免密登录，输入 "no" 安装程序将会帮您自动配置 ssh 免密登录，如下图所示:

```bash
######################################################################
         KubeSphere Installer Menu
######################################################################
*   1) All-in-one
*   2) Multi-node
*   3) Cluster-scaling
*   4) Quit
######################################################################
https://kubesphere.io/                                      2018-07-27
######################################################################
Please input an option: 2
2
Have you configured storage parameters in conf/vars.yml yet?  (yes/no) 
yes
Password-less SSH communication is necessary，have you configured yet? 
If not，it will be created automatically. (yes/no) 
no 
Generating public/private rsa key pair.
Created directory '/home/ubuntu/.ssh'.
Your identification has been saved in /home/ubuntu/.ssh/id_rsa.
Your public key has been saved in /home/ubuntu/.ssh/id_rsa.pub.
```





**4.** 测试 KubeSphere 集群部署是否成功：

**(1)** 待 install.sh 执行完后，当看到如下 "Successful" 界面，则说明 KubeSphere 安装成功：

```bash
PLAY RECAP *********************************************
KubeSphere     : ok=69 changed=68 unreachable=0 failed=0
Successful!
########################################################
KubeSphere is running！
Matser IP: 192.168.100.10
ks-console-nodeport: 32117
ks-apiserver-nodeport: 32002
########################################################
```

**(2)** 以上可以看到两个 nodeport，也可以通过命令 `kubectl get svc -n kubesphere-system` 查看端口号。在 Kubernetes 中 nodeport 是提供给集群外部客户访问该 Service 入口的一种方式，Kubernetes 中的 nodeport 一般是高位 30000 - 32767。您可以通过浏览器，使用集群中任一节点的 IP 地址和端口号即 `<NodeIP>:ks-console-nodeport` 访问 KubeSphere 控制台，如上图 [http://192.168.100.10:32117](http://192.168.100.10:32117，)。由于服务的常用访问端口通常是低位，因此也可以通过公网 IP 并将高位端口转发后访问控制台，如：[http://139.198.121.143:8080](http://139.198.121.143:8080)， 即可进入 KubeSphere 登录界面，能看到如下用户界面说明 KubeSphere 能够正常访问和使用：

> 注： 若公网 IP 有防火墙，请在防火墙添加规则放行对应的端口，外部才能够访问。

![](/pic02.png)

KubeSphere 部署成功后，可以使用以下的用户名和密码登录 KubeSphere 控制台体验：

> Account: admin@kubesphere.io 
>
> Password: passw0rd

关于如何使用请参考  [《KubeSphere 用户指南》](/express/zh-CN/user-case/)。



## 存储配置说明


可使用 [青云云平台块存储](https://docs.qingcloud.com/product/storage/volume/)、[GlusterFS](https://www.gluster.org/) 或 [CephRBD](https://ceph.com) 作为持久化存储（更多的存储类型持续更新中），使用青云云平台块存储需要安装 [QingCloud-CSI 插件](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md)，且需要有操作 [QingCloud IaaS 平台](https://console.qingcloud.com/login) 资源的权限，GlusterFS 和 CephRBD 需提前准备相关存储服务端。

> 1. [QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) 插件已通过 KubeSphere 测试，仅需在 `vars.yml` 配置对应的参数，则 Installer 会根据配置项自动安装 QingCloud-CSI。
> 2. KubeSphere 测试过的存储服务端 `Ceph` Server 版本为 v0.94.10，`Ceph` 服务端集群部署可参考 [部署 Ceph 存储集群](/express/zh-CN/ceph-ks-install/)，正式环境搭建 Ceph 存储服务集群请参考 [Install Ceph](http://docs.ceph.com/docs/master/)。
> 3. KubeSphere 测试过的存储服务端 `GlusterFS` Server 版本为 v3.7.6，`GlusterFS` 服务端部署可参考 [部署 GlusterFS 存储集群](/express/zh-CN/glusterfs-ks-install/)， 正式环境搭建 GlusterFS 集群请参考 [Install Gluster](https://www.gluster.org/install/) 或 [Gluster Docs](http://gluster.readthedocs.io/en/latest/Install-Guide/Install/) 并且需要安装 [Heketi 管理端](https://github.com/heketi/heketi/tree/master/docs/admin)，Heketi 版本为 v3.0.0。
> 4. KubeSphere 安装过程中程序将会根据用户在 vars.yml 里选择配置的存储类型如 GlusterFS 或 Ceph RBD，进行自动化地安装对应 Kubernetes 集群所需的GlusterFS Client 或 Ceph RBD Client，无需手动安装 Client。KubeSphere 自动安装的 GlusterFS Client 版本为 v3.12.10，可通过 `glusterfs -V` 命令查看，RBD Client 版本为 v12.2.5，可用 `rbd -v` 命令查看。
> 5. Kubernetes 集群中不可同时存在两个默认存储类型，若要指定默认存储类型前请先确保当前集群中无默认存储类型。

在您准备好存储服务端以后，只需要参考以下表中的参数说明，在 `conf` 目录下的 `vars.yml` 中，根据您存储服务端所支持的存储类型，在 `vars.yml` 的 `#QingCloud-CSI`、`# Ceph_rbd  deployment` 、 `# GlusterFS  provisioner deployment` 或 `# Local volume provisioner deployment(Only all-in-one)` 部分，参考脚本中的示例修改对应参数，即可完成 Kubernetes 集群存储类型的配置。以下对存储相关配置做简要说明 (参数详解请参考 [storage classes](https://kubernetes.io/docs/concepts/storage/storage-classes/) )：

### Local Volume

| **Local Volume** | **Description** |
| --- | --- |
| local\_volume\_provisioner\_enabled | 是否使用 local\_volume 作为持久化存储，  是：true；否：false |
| local\_volume\_provisioner\_storage\_class | storage\_class 名称，   默认：local |
| local\_volume\_is\_default\_class | 是否设定为默认 storage\_class， 是：true；否：false <br/> 注：系统中存在多种 storage\_class 时，只能设定一种为 default\_class |

> 说明： 在您配置好 local Volume (只有 all-in-one 支持这类存储) 并成功安装 KubeSphere 后，请参考 [Local Volume 使用方法](/express/zh-CN/manage-storages/#local-volume-使用方法)。

### QingCloud-CSI

[QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) 块存储插件实现了 CSI 接口，并且支持 KubeSphere 能够使用 QingCloud 云平台的存储资源。块存储插件部署后，用户可创建访问模式（Access Mode）为单节点读写（ReadWriteOnce）的基于 QingCloud 的超高性能型 （超高性能型硬盘只能用在超高性能型主机）、性能型（性能型硬盘只能用在性能型主机）或容量型硬盘的存储卷并挂载至工作负载。

|**QingCloud-CSI** | **Description**|
| --- | ---|
|qy\_csi\_enabled|是否使用 QingCloud-CSI 作为持久化存储，是：true； 否：false |
|qy\_csi\_is\_default\_class|是否设定为默认 storage\_class， 是：true；否：false <br/> 注：系统中存在多种 storage\_class 时，只能设定一种为 default\_class
| qy\_access\_key\_id ， <br> qy\_secret\_access\_key|通过[青云控制台](https://console.qingcloud.com/login) 的右上角账户图标选择 **API 密钥** 创建密钥获得|
|qy\_zone| zone 应与 Kubernetes 集群所在区相同，CSI 插件将会操作此区的存储卷资源。例如：zone 可以设置为 sh1a（上海一区-A）、sh1b（上海1区-B）、 pek2（北京2区）、pek3 （北京3区）、pek3a（北京3区-A）、gd1（广东1区）、gd2a（广东2区-A）、ap1（亚太1区）、ap2a（亚太2区-A）、 |




### Ceph RBD

| **Ceph\_RBD** | **Description** |
| --- | --- |
| ceph\_rbd\_enabled | 是否使用 ceph\_RBD 作为持久化存储，是：true；否：false |
| ceph\_rbd\_storage\_class | storage\_class 名称 |
| ceph\_rbd\_is\_default\_class | 是否设定为默认 storage\_class， 是：true；否：false <br/> 注：系统中存在多种 storage\_class 时，只能设定一种为 default\_class |
| ceph\_rbd\_monitors | 根据 Ceph RBD 服务端配置填写，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_admin\_id | 能够在存储池中创建  的客户端 ID ，默认: admin，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_admin\_secret | Admin_id 的 secret，安装程序将会自动在 kube-system 项目内创建此 secret，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_pool | 可使用的 CephRBD 存储池，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_user\_id | 用于映射 RBD  的 ceph 客户端 ID 默认: admin，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_user\_secret | User_id 的 secret，需注意在所使用 rbd image 的项目内都需创建此 Secret，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_fsType | kubernetes 支持的 fsType，默认：ext4，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_imageFormat | CephRBD  格式，默认："1"，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
|ceph\_rbd\_imageFeatures| 当 ceph_rbd_imageFormat 字段不为 1 时需填写此字段，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd)|

> 注： 存储类型中创建 secret 所需 ceph secret 如 `ceph_rbd_admin_secret` 和 `ceph_rbd_user_secret` 可在 ceph 服务端通过以下命令获得：

```bash
$ ceph auth get-key client.admin
```

### GlusterFS 

| **GlusterFS（需提供 heketi 所管理的 glusterfs 集群）**| **Description** |
| --- | --- |
| glusterfs\_provisioner\_enabled | 是否使用 GlusterFS 作为持久化存储，是：true；否：false |
| glusterfs\_provisioner\_storage\_class | storage\_class 名称 |
| glusterfs\_is\_default\_class | 是否设定为默认 storage\_class，是：true；否：false <br/> 注：系统中存在多种 storage\_class 时，只能设定一种为 default\_class| --- | --- |glusterfs\_provisioner\_resturl | Heketi 服务 url，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) | glusterfs\_provisioner\_clusterid | Heketi 服务端输入 heketi-cli cluster list 命令获得，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_restauthenabled | Gluster 启用对 REST 服务器的认证，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_resturl | Heketi 服务端 url，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_clusterid | Gluster 集群 id，登录 heketi 服务端输入 heketi-cli cluster list 得到 Gluster 集群 id，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_restuser | 能够在 Gluster pool 中创建 volume 的 Heketi 用户，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_secretName | secret 名称，安装程序将会在 kube-system 项目内自动创建此 secret，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_gidMin | glusterfs\_provisioner\_storage\_class 中 GID 的最小值，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_gidMax | glusterfs\_provisioner\_storage\_class 中 GID 的最大值，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_volumetype | Volume 类型，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| jwt\_admin\_key | heketi 服务器中 /etc/heketi/heketi.json 的 jwt.admin.key 字段 |

> 注： Glusterfs 存储类型中所需的 `glusterfs_provisioner_clusterid` 可在 glusterfs 服务端通过以下命令获得：

```bash
$ export HEKETI_CLI_SERVER=http://localhost:8080
$ heketi-cli cluster list
```

## 集群节点扩容说明

安装 KubeSphere 后，在正式环境使用时可能会遇到服务器容量不足的情况，这时就需要添加新的服务器，然后将应用系统进行水平扩展来完成对系统的扩容。通过 KubeSphere 控制台，您可以根据实际业务需要对 Kubernetes 集群的 Node 节点进行扩容（暂不支持 Master 节点扩容），KubeSphere 对于在 Kubernetes 集群中加入新 Node 是非常简单的，仅需简单两步即可完成集群节点扩容。节点扩容基于 Kubelet 的自动注册机制，新的 Node 将会自动加入现有的 Kubernetes 集群中，以 root 用户增加 node3 的配置为例。

1. 当申请完新的主机后，在主机配置文件 `conf/hosts.ini` 根据需要增加的主机信息在 [all] 和 [kube-node] 部分对应添加一行参数，若扩容多台主机则依次添加多行参数。需要注意的是，扩容新的节点时不能修改原节点的主机名如 master、node1 和 node2， 如下添加新节点 node3：

```
[all]
master ansible_connection=local  ip=192.168.0.2
node1  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_ssh_pass=PASSWORD
node2  ansible_host=192.168.0.4  ip=192.168.0.4  ansible_ssh_pass=PASSWORD    
node3  ansible_host=192.168.0.5  ip=192.168.0.5  ansible_ssh_pass=PASSWORD  
···
[kube-node]
master
node1
node2 
node3
···
```

2. 在 script 目录执行 install.sh 脚本，选择 `3). Cluster-scaling`。待扩容脚本执行成功后，即可看到包含新节点的集群节点信息，可通过 KubeSphere 控制台的菜单选择 **资源** 然后进入 **主机管理** 页面，或者通过 Kubectl 工具执行 `kubectl get node` 命令，查看扩容后的集群节点详细信息。同样，若需要停用或隔离集群中的节点，比如在硬件升级、硬件维护等情况下需要将某些 Node 进行隔离，可以通过 KubeSphere 控制台菜单中选择 **资源** 进入 **主机管理** 页面执行停用或启用主机，可参考主机管理说明的 [停用或启用主机](/express/zh-CN/manage-nodes/#停用或启用主机)。



## 组件版本信息

|  组件 |  版本 |
|---|---|
|KubeSphere| 1.0 Alpha (20180705.1800)|
|KubeSphere Console| Express Edition |
|Kubernetes| v1.10.5|
|OpenPitrix| v0.1.6|