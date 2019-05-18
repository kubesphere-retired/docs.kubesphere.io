---
title: "Multi-Node 模式"
---

`Multi-Node` 即多节点集群部署，部署前建议您选择集群中任意一个节点作为一台任务执行机 (taskbox)，为准备部署的集群中其他节点执行部署的任务，且 Taskbox 应能够与待部署的其他节点进行 **ssh 通信**。

> 提示：若需要安装 Harbor 和 GitLab 请在**安装前**参考 [安装内置 Harbor](../harbor-installation) 和 [安装内置 GitLab](../gitlab-installation)。
 
## 前提条件

<!-- - 下载最新的 [KubeSphere Advanced Edition 2.0.0 - dev](https://kubesphere.io/download/?type=advanced) 至待安装机器中。 -->
- 已准备 KubeSphere 支持的 [持久化存储服务端](../storage-configuration)，本篇文档以配置 QingCloud-CSI 插件对接 [QingCloud 云平台块存储](https://www.qingcloud.com/products/volume/) 为例，需要有 [QingCloud 云平台](https://console.qingcloud.com/login) 的账号。
- <font color=red>注意，使用 QingCloud 云平台块存储作为存储服务，安装前需要确保用户账号在当前 Zone 资源配额满足最低要求。Multi-node 安装最少需要 14 块硬盘，本示例默认使用容量型硬盘，所需的容量型硬盘容量的最低配额为 1400 GB，若硬盘数量和容量配额不够请提工单申请配额。</font> 若使用其他类型的硬盘，参考 [QingCloud 各类型块存储配额表](../storage-configuration)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190509171820.png)

## 第一步: 准备主机

您可以参考以下节点规格准备 <font color=red>至少 3 台</font> 符合要求的主机开始 `multi-node` 模式的部署。

> 说明：
> - 若使用 ubuntu 16.04 建议使用其最新的版本 16.04.5；
> - 若使用 ubuntu 18.04，则需要使用 root 用户；
> - 若 Debian 系统未安装 sudo 命令，则需要在安装前使用 root 用户执行 `apt update && apt install sudo` 命令安装 sudo 命令后再进行安装。

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

**1.** 下载最新的 `KubeSphere Advanced v2.0.0` 安装包至任务执行机，并解压压缩包。

```bash
$ curl -L https://kubesphere.io/download/stable/advanced-2.0.0 > advanced-2.0.0.tar.gz
```

```bash
$ tar -zxf advanced-2.0.0.tar.gz
```

**2.** 进入 “`kubesphere-all-advanced-2.0.0`” 目录。

```bash
$ cd kubesphere-all-advanced-2.0.0
```
 
**3.** 编辑主机配置文件 `conf/hosts.ini`，为了对目标机器及部署流程进行集中化管理配置，集群中各个节点在主机配置文件 `hosts.ini` 中应参考如下配置，建议使用 `root` 用户进行安装。

> 说明：
> - 若以非 root 用户 (如 ubuntu 用户) 进行安装，可参考配置文件 `conf/hosts.ini` 的注释中 `non-root` 用户示例部分编辑。
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




**4.** 编辑 `conf/vars.yml` 配置文件，集群的存储以配置 QingCloud-CSI 插件对接 QingCloud 云平台块存储为例。

- 其中值带有 * 号的值为必配项，参数释义详见 [存储配置说明 - QingCloud 云平台块存储](../storage-configuration/#qingcloud-云平台块存储)：
    - `qingcloud_access_key_id` 和 `qingcloud_secret_access_key`： 通过 [QingCloud 云平台](https://console.qingcloud.com/login) 的右上角账户图标选择 **API 密钥** 创建密钥并下载获得 (填写时仅粘贴单引号内的值)；
    - `qingcloud_zone`：根据您的机器所在的 Zone 填写，例如：sh1a（上海一区-A）、sh1b（上海1区-B）、 pek2（北京2区）、pek3a（北京3区-A）、gd1（广东1区）、gd2a（广东2区-A）、ap1（亚太1区）、ap2a（亚太2区-A）；
    - `qingcloud_csi_enabled`：是否使用 QingCloud-CSI 作为持久化存储，此处改为 true；
    - `qingcloud_csi_is_default_class`：是否设定为默认的存储类型，此处改为 true；
- 不带 * 号的最后六行为可配项所以在示例中无需修改，当前默认配置了容量型硬盘，type 为 2(可挂载至任意类型主机)。<br> <font color=red>注意，安装前需要确认您 QingCloud 账号在当前 Zone 的容量型硬盘的配额是否大于 14。</font> 若需要使用其他类型的硬盘，也需要满足最低配额，修改配置可参考 [存储配置说明 - QingCloud 云平台块存储](../storage-configuration/#qingcloud-云平台块存储)。


**vars.yml 配置存储示例：**

```yaml
# Access key pair can be created in QingCloud console
qingcloud_access_key_id: * Input your QingCloud key id *
qingcloud_secret_access_key: * Input your QingCloud access key *
# Zone should be the same as Kubernetes cluster
qingcloud_zone: * Input your Zone ID (e.g. pek3a, gd2) *
···

# QingCloud CSI
qingcloud_csi_enabled: * true *
qingcloud_csi_is_default_class: * true *
qingcloud_type: 2
qingcloud_maxSize: 5000
qingcloud_minSize: 100
qingcloud_stepSize: 50
qingcloud_fsType: ext4
qingcloud_disk_replica: 2
```

> 说明：
> - 网络、存储、GitLab、Harbor、负载均衡器插件等相关内容可在 `conf/vars.yml` 配置文件中修改或开启安装，其中网络的默认插件是 `Calico`。可按需修改相关配置项，未做修改将以默认参数执行；
> - 支持存储类型：[QingCloud 云平台块存储](https://docs.qingcloud.com/product/storage/volume/)、[QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)、[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[GlusterFS](https://www.gluster.org/)、[Ceph RBD](https://ceph.com/)，存储配置相关的详细信息请参考 [存储配置说明](../storage-configuration)；
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

**3.** 输入数字 `2` 选择第二种 Multi-node 模式开始部署，安装程序会提示您是否已经配置过存储，若您已参考上述步骤配置了存储请输入 "yes" 开始安装。

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2018-05-18
################################################
Please input an option: 2

```

**4.** 验证 KubeSphere 集群部署是否成功：

**(1)** 待安装脚本执行完后，当看到如下 `"Successful"` 界面，则说明 KubeSphere 安装成功。

```bash
successsful!
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.1:30880
Account: admin
Password: P@88w0rd

NOTE：Please modify the default password after login.
#####################################################
```

> 提示：如需要再次查看以上的界面信息，可在安装包目录下执行 `cat kubesphere/kubesphere_running` 命令查看。

**(2)** 若需要在外网访问，在云平台需要在端口转发规则中将**内网端口** 30880 转发到**源端口** 30880，然后在防火墙开放这个**源端口**，确保外网流量可以通过该端口。

例如在 QingCloud 平台配置端口转发和防火墙规则，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。

**(3)** 安装成功后，浏览器访问对应的 URL，如 `http://{$公网IP}:30880`，即可进入 KubeSphere 登录界面，可使用默认的用户名和密码登录 KubeSphere 控制台体验，参阅 [快速入门](../../quick-start/quick-start-guide) 帮助您快速上手 KubeSphere。

![KubeSphere 控制台](/kubesphere-console.png)

<font color=red>注意：登陆 Console 后请在 "集群状态" 查看服务组件的监控状态，待所有组件启动完成后即可开始使用，通常所有服务组件都将在 15 分钟内启动完成。</font>

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190519012928.png)