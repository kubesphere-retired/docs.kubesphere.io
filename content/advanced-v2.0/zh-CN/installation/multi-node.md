---
title: "Multi-Node 模式"
---

`Multi-Node` 即多节点集群部署，部署前建议您选择集群中任意一个节点作为一台任务执行机 (taskbox)，为准备部署的集群中其他节点执行部署的任务，且 Taskbox 应能够与待部署的其他节点进行 **ssh 通信**。

## 前提条件

<!-- - 下载最新的 [KubeSphere Advanced Edition 2.0.0 - dev](https://kubesphere.io/download/?type=advanced) 至待安装机器中。 -->
已准备 KubeSphere 支持的 [持久化存储服务端](../storage-configuration)，本篇文档以配置 QingCloud-CSI 插件对接 [QingCloud 云平台块存储](https://www.qingcloud.com/products/volume/) 为例，需要有 [QingCloud 云平台](https://console.qingcloud.com/login) 的账号。

## 第一步: 准备主机

您可以参考以下节点规格 准备 **`至少 2 台`** 符合要求的主机节点开始 `multi-node` 模式的部署，若使用 ubuntu 16.04 建议使用其最新的版本 16.04.5。

> 说明：若 Debian 系统未安装 sudo 命令，则需要在安装前使用 root 用户执行 `apt update && apt install sudo` 命令安装 sudo 命令后再进行安装。

| 操作系统 | 最小配置 (根据集群规模)| 
| --- | --- | 
| CentOS 7.5 (64 bit) | 总 CPU 应不小于 8 核， 总内存不小于 16 G， 系统盘：40 G | 
| Ubuntu 16.04/18.04 LTS (64 bit) | 总 CPU 应不小于 8 核， 总内存不小于 16 G， 系统盘：40 G | 
|Red Hat Enterprise Linux Server 7.4 (64 bit) | 总 CPU 应不小于 8 核， 总内存不小于 16 G， 系统盘：40 G | 
|Debian Stretch 9.5 (64 bit)| 总 CPU 应不小于 8 核， 总内存不小于 16 G， 系统盘：40 G | 


以下用一个示例介绍 multi-node 模式部署多节点环境，本示例准备了 `3` 台 CentOS 7.5 的主机并以 `root` 用户准备安装。登录主机名为 Master 的节点作为任务执行机 **Taskbox** 来执行安装步骤。

在 [安装说明](../intro) 已经介绍了 KubeSphere 集群架构是由管理节点 (Master) 和工作节点 (Node) 构成的，这 3 台主机分别部署 1 个 Master 节点和 2 个 Node 节点。

> 说明：高级版支持 Master 和 etcd 节点高可用配置，但本示例仅作为测试部署的演示，因此 3 台主机中仅部署单个 Master 和单个 etcd，正式环境建议配置 Master 和 etcd 节点的高可用，请参阅 [Master 和 etcd 节点高可用配置](../master-ha)。

假设主机信息如下所示：

| 主机 IP | 主机名 | 集群角色 |
| --- | --- | --- |
|192.168.0.1|master|master，etcd|
|192.168.0.2|node1|node|
|192.168.0.3|node2|node|

**集群架构：** 单 master 单 etcd 双 node

![集群架构图](/cluster-architecture-zh.svg)

## 第二步: 准备安装配置文件

**1.** 执行以下命令下载最新的 `KubeSphere Advanced v2.0.0 - dev` 安装包至待安装机器，并解压压缩包。

```bash
$ curl -L https://kubesphere.io/download/nightly/latest -o installer.tgz
```

```bash
$ tar -zxf installer.tgz
```

**2.** 进入 “`kubesphere-all-advanced-2.0.0-dev-{$date}`” 目录。

```bash
$ cd kubesphere-all-advanced-2.0.0-dev-{$date}
```

**3.** 编辑主机配置文件 `conf/hosts.ini`，为了对待部署目标机器及部署流程进行集中化管理配置，集群中各个节点在主机配置文件 `hosts.ini` 中应参考如下配置，建议使用 `root` 用户进行安装。

> 说明：
> - 若以非 root 用户 (如 ubuntu 用户) 进行安装，可参考配置文件 `conf/hosts.ini` 的注释中 `non-root` 用户示例部分编辑。
> - 如果在 taskbox 使用 root 用户无法 ssh 连接到其他机器，也需要参考 `conf/hosts.ini` 的注释中 `non-root` 用户示例部分，但执行安装脚本 `install.sh` 时建议切换到 root 用户，如果对此有疑问可参考 [常见问题 - 问题 2](../../faq)。
> - master, node1, node2 作为集群各个节点的主机名，若需要自定义主机名则所有主机名需要都使用小写形式。

以下示例在 CentOS 7.5 上使用 `root` 用户安装，每台机器信息占一行，不能分行。

**root 配置示例：**

```ini
[all]
master ansible_connection=local  ip=192.168.0.1
node1  ansible_host=192.168.0.2  ip=192.168.0.2  ansible_ssh_pass=PASSWORD
node2  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_ssh_pass=PASSWORD

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

> 说明：
>
> - [all] 中需要修改集群中各个节点的内网 IP 和主机 root 用户密码。主机名为 "master" 的节点作为已通过 SSH 连接的 Taskbox 所以无需填写密码，[all] 中其它节点的参数比如 node1 和 node2 的 `ansible_host` 和 `ip` 都替换为当前 node1 和 node2 的内网 IP，将 `ansible_ssh_pass` 替换为您准备的主机 `root` 用户登录密码。
> -  应将主机名 "master" 填入 [kube-master] 和 [etcd] 部分，因为 "master" 节点作为 taskbox，用来执行整个集群的安装任务，同时 "master" 节点在 KubeSphere 集群架构中也将作为管理节点 Master 和负责保存持久化数据的 etcd。
> - 将主机名 "node1"，"node2" 填入 [kube-node] 部分，作为 KubeSphere 集群的 node 节点。<br>
>
> 参数解释：<br>
> - `ansible_connection`: 与主机的连接类型，此处设置为 `local` 即本地连接。
> - `ansible_host`: 集群中将要连接的主机地址或域名。
> - `ip`: 集群中将要连接的主机 IP。
> - `ansible_ssh_pass`: 待连接主机 root 用户的密码。


**5.** 集群的存储以配置 QingCloud-CSI 插件对接 QingCloud 云平台块存储为例，其中 `qingcloud_access_key_id` 和 `qingcloud_secret_access_key` 通过 [QingCloud 云平台](https://console.qingcloud.com/login) 的右上角账户图标选择 **API 密钥** 创建密钥获得，参数释义详见 [存储配置说明 - QingCloud 云平台块存储](../storage-configuration)。

**存储配置示例：**

```yaml
# Access key pair can be created in QingCloud console
qingcloud_access_key_id: Input your QingCloud key id
qingcloud_secret_access_key: Input your QingCloud access key
# Zone should be the same as Kubernetes cluster
qingcloud_zone: Input your Zone ID (e.g. pek3a, gd2)
···

# Local volume provisioner deployment(Only all-in-one)
local_volume_provisioner_enabled: false
local_volume_provisioner_storage_class: local
local_volume_is_default_class: false

# QingCloud CSI
qingcloud_csi_enabled: true
qingcloud_csi_is_default_class: true
···
```

> 说明：
> - 网络、存储等相关内容需在 `conf/vars.yml` 配置文件中指定或修改，根据配置文件按需修改相关配置项，未做修改将以默认参数执行；
> - 网络：默认插件 `Calico`；
> - 支持存储类型：[QingCloud 云平台块存储](https://docs.qingcloud.com/product/storage/volume/)、[QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)、[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[GlusterFS](https://www.gluster.org/)、[Ceph RBD](https://ceph.com/)、[Local Volume (仅支持 all-in-one)](https://kubernetes.io/docs/concepts/storage/volumes/#local)，存储配置相关的详细信息请参考 [存储配置说明](../storage-configuration)；
> - Multi-Node 安装时需要配置持久化存储，因为它不支持 Local Volume，因此把 Local Volume 的配置修改为 false，然后配置持久化存储如 QingCloud-CSI (QingCloud 块存储插件)；
> - 由于 Kubernetes 集群的 Cluster IP 子网网段默认是 `10.233.0.0/18`，Pod 的子网网段默认是 `10.233.64.0/18`，因此部署 KubeSphere 的节点 IP 地址范围不应与以上两个网段有重复，若遇到地址范围冲突可在配置文件 `conf/vars.yaml` 修改 `kube_service_addresses` 或 `kube_pods_subnet` 的参数。



## 第三步: 安装 KubeSphere

KubeSphere 多节点部署会自动化地进行环境和文件监测、平台依赖软件的安装、Kubernetes 和 etcd 集群的自动化部署，以及存储的自动化配置。Installer 默认安装的 Kubernetes 版本是 v1.13.5，安装成功后可通过 KubeSphere 控制台右上角点击关于查看安装的版本。

参考以下步骤开始 multi-node 部署。

> 说明：由于 multi-node 的安装时间跟网络情况和带宽、机器配置、安装节点个数等因素都有关，此处暂不提供时间标准。

**1.** 进入 `scripts` 目录：

```bash
$ cd scripts
```

**2.** 建议使用 root 用户安装，执行 `install.sh` 脚本：

```bash
$ ./install.sh
```

**3.** 输入数字 `2` 选择第二种 Multi-node 模式开始部署，安装程序会提示您是否已经配置过存储，若已配置过请输入 "yes"，否则输入 "no"，将返回目录继续配置存储并参考 [存储配置说明](../storage-configuration)。

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2018-04-18
################################################
Please input an option: 2

```

**4.** 测试 KubeSphere 集群部署是否成功：

**(1)** 待安装脚本执行完后，当看到如下 `"Successful"` 界面，则说明 KubeSphere 安装成功。

```bash
successsful!
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.1:30880
Account: admin
Password: passw0rd

NOTE：Please modify the default password after login.
#####################################################
```

> 提示：如需要再次查看以上的界面信息，可在安装包目录下执行 `cat kubesphere/kubesphere_running` 命令查看。

**(2)** 若需要在外网访问，则云平台将外网访问的 http 端口 (30880) 进行 **端口转发**，并添加 **防火墙的下行规则**，确保该外网流量可以通过该端口。

例如在 QingCloud 平台配置端口转发和防火墙规则：

**端口转发**
![](https://pek3b.qingstor.com/kubesphere-docs/png/20190424163527.png)

**添加防火墙下行规则**
![](https://pek3b.qingstor.com/kubesphere-docs/png/20190424163607.png)

**(3)** 安装成功后，浏览器访问对应的 URL，如 `http://{$公网IP}:30880`，即可进入 KubeSphere 登录界面，可使用默认的用户名和密码登录 KubeSphere 控制台体验，参阅 [快速入门](../../quick-start/quick-start-guide) 帮助您快速上手 KubeSphere。

![KubeSphere 控制台](/kubesphere-console.png)