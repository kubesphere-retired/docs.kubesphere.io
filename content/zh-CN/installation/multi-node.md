---
title: "Multi-Node 模式"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '在 Linux 安装多节点 KubeSphere 与 Kubernetes'
---

`Multi-Node` 即多节点部署 KubeSphere 与 Kubernetes 集群，安装前建议您选择集群中任意一个节点作为一台任务执行机 (taskbox)，为准备部署的集群中其他节点执行部署的任务，且 Taskbox 应能够与待部署的其他节点进行 **ssh 通信**。

- <font color=red>KubeSphere 2.1 默认仅开启最小化安装，Installer 已支持自定义安装各个可插拔的功能组件，用户可根据业务需求和机器配置选择安装所需的组件，**请确保开启可插拔组件之前机器资源满足最低要求**，参考 [安装说明](../intro/#自定义安装可插拔的功能组件) 开启可选组件的安装。</font>
- <font color=red>若您的机器资源配置充足（所有机器总 CPU 不小于 8 核，总内存不小于 16 G），非常建议您在安装前 [将 KubeSphere 所有功能组件都开启](../complete-installation) 后再执行安装，体验 KubeSphere 容器平台端到端完整的容器管理与运维能力。</font>
- <font color=red>安装时间跟网络情况和带宽、机器配置、安装节点个数等因素有关，可通过调高带宽的方式，或在安装前 [配置镜像加速器](https://kubesphere.com.cn/forum/d/149-kubesphere-v2-1-0) 来加快安装速度。</font>


> 注意：
> - 本安装示例仅作为快速测试部署的演示，因此将使用默认的 [OpenEBS](https://openebs.io/) 基于 [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) 提供持久化存储服务，OpenEBS 支持 [动态申请 PV](https://docs.openebs.io/docs/next/uglocalpv.html#Provision-OpenEBS-Local-PV-based-on-hostpath)，**方便初次安装但没有准备存储服务端的场景下进行部署测试**，**正式环境建议配置使用 KubeSphere 支持的存储类型**，参考 [持久化存储配置说明](../storage-configuration)。
> - Multi-node 支持 Master 和 etcd 节点高可用配置，本示例为了方便多节点的快速测试安装演示，仅部署单个 Master 和单个 etcd，正式环境建议配置多个 Master 节点的高可用，若安装多个 Master 节点，请参阅 [集群高可用部署配置](../master-ha)。

## 视频教程

**视频教程以 QingCloud 云平台创建机器用作安装示例，其它平台安装步骤类似，具体以其官方文档为准。注意，视频中的演示的是下载 v2.1.0，请参考以下文档替换使用 v2.1.1 的下载命令。**

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/video/KSInstall_100P002C202001_MultiNode.mp4">
</video>


## 前提条件

检查安装机器的网络防火墙是否已关闭，若未关闭防火墙则需要开放相关的指定端口，参考 [需开放的端口](../port-firewall)。


## 第一步: 准备主机

您可以参考以下节点规格准备 <font color=red>至少 3 台</font> 符合要求的主机开始 `multi-node` 模式的部署。为防止软件版本冲突，**建议您选择多台干净的机器进行安装**。

<font color=red>Installer 默认执行最小化安装，下表为最小化安装时的最低配置要求，若希望安装使用 KubeSphere 完整的功能组件，请参考 [可插拔功能组件列表](../intro/#自定义安装可插拔的功能组件)，查看各组件资源占用统计，准备资源更充足的机器开启安装其它功能组件。</font>

> 说明：
> - 注意！所有节点需要时间同步，否则安装可能会不成功；
> - 若使用 ubuntu 16.04 建议使用其最新的版本 16.04.5；
> - 若使用 ubuntu 18.04，则需使用 root 用户；
> - 若 Debian 系统未安装 sudo 命令，则需要在安装前使用 root 用户执行 `apt update && apt install sudo` 命令安装 sudo 命令后再进行安装；
> - 若选装 DevOps 功能组件时需保证有一台内存大于 8G 的节点，因为 Jenkins 默认的 JVM 设置会需要 `6~8 G` 的整块内存，若可用内存不足可能会造成该节点崩溃。


| 操作系统 | 最小配置（每台） |
| --- | --- |
| CentOS 7.5 (64 bit) | CPU：2 核， 内存：4 G， 系统盘：40 G  |
| Ubuntu 16.04/18.04 LTS (64 bit) | CPU：2 核， 内存：4 G， 系统盘：40 G   |  
|Red Hat Enterprise Linux Server 7.4 (64 bit) | CPU：2 核， 内存：4 G， 系统盘：40 G   |  
|Debian Stretch 9.5 (64 bit)| CPU：2 核， 内存：4 G， 系统盘：40 G   |  


以下用一个示例介绍 multi-node 模式部署多节点环境，本示例准备了 `3` 台 CentOS 7.5 的主机并以 `root` 用户准备安装。登录主机名为 Master 的节点作为任务执行机 **Taskbox** 来执行安装步骤。

在 [安装说明](../intro) 已经介绍了 KubeSphere 集群架构是由管理节点 (Master) 和工作节点 (Node) 构成的，这 3 台主机分别部署 1 个 Master 节点和 2 个 Node 节点。

假设主机信息如下所示：

| 主机 IP | 主机名 | 集群角色 |
| --- | --- | --- |
|192.168.0.1|master|master，etcd|
|192.168.0.2|node1|node|
|192.168.0.3|node2|node|

**集群架构：** 单 master 单 etcd 双 node

![集群架构图](/cluster-architecture-zh.svg)

## 第二步: 准备安装配置文件

2.1. 下载 `KubeSphere 2.1.1` 安装包至待安装机器，进入 `conf` 目录。

```bash
curl -L https://kubesphere.io/download/stable/v2.1.1 > installer.tar.gz \
&& tar -zxf installer.tar.gz && cd kubesphere-all-v2.1.1/conf
```


2.2. 编辑主机配置文件 `conf/hosts.ini`，为了对目标机器及部署流程进行集中化管理配置，集群中各个节点在主机配置文件 `hosts.ini` 中应参考如下配置，建议使用 `root` 用户进行安装。

> 说明：
> - 若以非 root 用户 (如 ubuntu 用户) 进行安装，[all] 部分可参考配置文件 `conf/hosts.ini` 的注释中 `non-root` 用户示例部分编辑。
> - 如果在 taskbox 使用 root 用户无法 ssh 连接到其他机器，也需要参考 `conf/hosts.ini` 的注释中 `non-root` 用户示例部分，但执行安装脚本 `install.sh` 时建议切换到 root 用户，如果对此有疑问可参考 [安装常见问题 - 问题 2](../../faq/faq-install/#multi-node-安装配置相关问题)。
> - master, node1, node2 作为集群各个节点的主机名，若需要自定义主机名则所有主机名需要都使用小写形式。

以下示例在 CentOS 7.5 上使用 `root` 用户安装，每台机器信息占一行，不能分行。

**root 配置 hosts.ini 示例：**

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
> - `[all]`： 中需要修改集群中各个节点的内网 IP 和主机 root 用户密码：<br>主机名为 "master" 的节点作为已通过 SSH 连接的 Taskbox 所以无需填写密码。<br> Node 节点的参数比如 node1 和 node2 的 `ansible_host` 和 `ip` 都替换为当前 node1 和 node2 的内网 IP，将 `ansible_ssh_pass` 相应替换为 node1 和 node2 的 `root` 用户密码。
>
>   参数解释：<br>
>       - `ansible_connection`: 与主机的连接类型，此处设置为 `local` 即本地连接
>       - `ansible_host`: 集群中将要连接的主机地址或域名
>       - `ip`: 集群中将要连接的主机 IP
>       - `ansible_user`: 默认的 SSH 用户名 (非 root)，例如 ubuntu
>       - `ansible_become_pass`: 默认的 SSH 用户登录密码
>       - `ansible_ssh_pass`: 待连接主机 root 用户的密码
> - `[kube-master]` 和 `[etcd]`：应将主机名 "master" 填入 [kube-master] 和 [etcd] 部分，"master" 节点作为 taskbox，用来执行整个集群的安装任务，同时 "master" 节点在 KubeSphere 集群架构中也将作为 Master 节点管理集群和 etcd 节点负责保存集群的数据。
> - `[kube-node]`：将主机名 "node1"，"node2" 填入 [kube-node] 部分，作为 KubeSphere 集群的 node 节点。<br>
> - `[local-registry]`：离线安装包中该参数值表示设置哪个节点作为本地镜像仓库，默认值为 master 节点。建议给该节点的 `/mnt/registry` 单独挂盘 (参考 fdisk 命令)，使镜像可保存在持久化存储并节省机器空间。


## 第三步: 安装 KubeSphere

KubeSphere 多节点部署会自动化地进行环境和文件监测、平台依赖软件的安装、Kubernetes 和 etcd 集群的自动化部署，以及存储的自动化配置。Installer 默认安装的 **Kubernetes 版本** 是 `v1.16.7`。

> 说明：
> - 通常情况您不需要修改任何配置，直接安装即可。
> - 网络插件默认是 `calico`，存储默认用 [OpenEBS](https://openebs.io/) 基于 [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) 提供持久化存储服务，若您需要自定义安装参数，如网络、存储、负载均衡器插件、可选功能组件等相关配置需在 **`conf/common.yaml`** 文件中指定或修改，参考 [集群组件配置说明](../vars)。
> - 支持存储类型以及存储配置相关的详细信息请参考 [存储配置说明](../storage-configuration)。
> - 由于 Kubernetes 集群的 Cluster IP 子网网段默认是 `10.233.0.0/18`，Pod 的子网网段默认是 `10.233.64.0/18`，因此安装 KubeSphere 的节点 IP 地址范围不应与以上两个网段有重复，若遇到地址范围冲突可在配置文件 `conf/common.yaml` 修改 `kube_service_addresses` 或 `kube_pods_subnet` 的参数。

参考以下步骤开始 multi-node 部署。

> 说明：由于 multi-node 的安装时间跟网络情况和带宽、机器配置、安装节点个数等因素都有关，此处暂不提供时间标准。

3.1. 进入安装目录，建议使用 root 用户执行 `install.sh` 安装脚本：

```bash
cd ..
cd scripts
./install.sh
```

3.2. 输入数字 `2` 选择第二种 Multi-node 模式开始部署，安装程序会提示您的环境是否前提条件，若满足请输入 "yes" 开始安装。

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2020-02-23
################################################
Please input an option: 2

```

3.3. 验证 KubeSphere 集群部署是否成功：

**(1)** 待安装脚本执行完后，请耐心等待，当看到如下 `"Successful"` 的日志，则说明 KubeSphere 安装成功。

```bash
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.1:30880
Account: admin
Password: P@88w0rd

NOTE：Please modify the default password after login.
#####################################################
```

> 提示：如需要再次查看以上的界面信息，可参考 [验证安装](../verify-components) 的查看安装日志命令。


**(2)** 若需要在外网访问，在云平台需要在端口转发规则中将**内网端口** 30880 转发到**源端口** 30880，然后在防火墙开放这个**源端口**，确保外网流量可以通过该端口。

例如在 QingCloud 平台配置端口转发和防火墙规则，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。

**(3)** 安装成功后，浏览器访问对应的 URL，如 `http://{$公网IP}:30880`，即可进入 KubeSphere 登录界面，可使用默认的用户名和密码登录 KubeSphere 控制台体验，**登录后请立即修改默认密码**。参阅 [快速入门](../../quick-start/quick-start-guide) 帮助您快速上手 KubeSphere。

![KubeSphere 控制台](/kubesphere-console.png)

<font color=red>注意：登陆 Console 后请在 "集群状态" 查看服务组件的监控状态，待所有组件启动完成后即可开始使用，通常所有服务组件都将在 15 分钟内启动完成。</font>

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191014095317.png)

## FAQ

KubeSphere 已在阿里云、腾讯云、华为云、青云、AWS 上进行过部署测试，测试结果与相关的解决方法，请参考 [KubeSphere 云平台安装测试结果](https://github.com/kubesphere/ks-installer/issues/23)。另外，常见的安装问题我们也已整理相关的解决方法在 [安装常见问题](../../faq/faq-install)。

若遇到其它的安装问题需要协助支持，请在 [社区论坛](https://kubesphere.com.cn/forum/) 搜索解决方法或发布帖子，我们会尽快跟踪解决。
