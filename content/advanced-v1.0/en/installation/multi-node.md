---
title: "Multi-node"
---
<!-- 
`Multi-Node` 即多节点集群部署，部署前建议您选择集群中任意一个节点作为一台任务执行机 (taskbox)，为准备部署的集群中其他节点执行部署的任务，且 Taskbox 应能够与待部署的其他节点进行 **ssh 通信**。

## 前提条件

- 请下载 [KubeSphere 高级版](https://kubesphere.io/download) 至待安装机器中。
- 建议使用 KubeSphere 支持的存储服务，并准备相应的存储服务端，存储服务端的磁盘容量参考主机规格表中的推荐配置或选择更高的容量。为方便初次安装但没有准备存储服务端时进行部署测试，也可配置部署 NFS server in Kubernetes 到当前集群。 -->


`Multi-Node` mode means install KubeSphere on multiple instances. Typically, select any one host in the cluster being served as a role of "`taskbox`" to execute the installation task for other hosts before multi-node installation,  `SSH Communication` is required to be established between "taskbox" and other hosts.

## Prerequisites

- Please download [KubeSphere Advanced Edition](https://kubesphere.io/download) to the target machine.
- It is recommended to use the storage services which are recommended by KubeSphere and prepare the corresponding storage server. If you are not prepare the storage server yet, you can also configure NFS-Server in Kubernetes as the default storage only for testing installation.

<!-- 
## 第一步: 准备主机

您可以参考以下节点规格 准备 **`至少 2 台`** 符合要求的主机节点开始 `multi-node` 模式的部署，若使用 ubuntu 16.04 建议使用其最新的版本 16.04.5。

| 操作系统 | 最小配置 | 推荐配置 |
| --- | --- | --- |
| CentOS 7.5 (64 bit) | CPU：4 核 <br/> 内存：8 G <br/> 磁盘：40 G | CPU：8 核 <br/> 内存：16 G <br/> 磁盘：大于 300 G |
| Ubuntu 16.04/18.04 LTS (64 bit) | CPU：4 核 <br/> 内存：8 G <br/> 磁盘：40 G | CPU：8 核 <br/> 内存：16 G <br/> 磁盘：大于 300 G |
|Red Hat Enterprise Linux Server 7.4 (64 bit) | CPU：4 核 <br/> 内存：8 G <br/> 磁盘：40 G | CPU：8 核 <br/> 内存：16 G <br/> 磁盘：大于 300 G |

以下用一个示例介绍 multi-node 模式部署多节点环境，本示例准备了 `3` 台 CentOS 7.5 的主机并以 `root` 用户准备安装。登录主机名为 Master 的节点作为任务执行机 **Taskbox** 来执行安装步骤。在 [安装说明](../intro) 已经介绍了 KubeSphere 集群架构是由管理节点 (Master) 和工作节点 (Node) 构成的，这 3 台主机分别部署 1 个 Master 节点和 2 个 Node 节点，也称 Worker 节点，在底层的 Kubernetes 中 Worker 节点跟 Master 节点都运行着一个 **kubelet** 组件，但 Master 节点上还会运行 **kube-apiserver、kube-scheduler、kube-controller-manager** 这三个系统 Pod。

> 说明：高级版支持 Master 和 etcd 节点高可用配置，但本示例仅作为测试部署的演示，因此 3 台主机中仅部署单个 Master 和单个 etcd，正式环境建议配置 Master 和 etcd 节点的高可用，请参阅 [Master 和 etcd 节点高可用配置](../master-ha)。

假设主机信息如下所示：

| 主机 IP | 主机名 | 集群角色 |
| --- | --- | --- |
|192.168.0.1|master|master，etcd|
|192.168.0.2|node1|node|
|192.168.0.3|node2|node|

**集群架构：** 单 master 单 etcd 双 node

![集群架构图](/cluster-architecture-zh.svg) -->

## Step 1: Provision Linux Host

The following section identifies the hardware specifications and system-level requirements of hosts for installation. To get started with multi-node mode, you may need to prepare at least `2` hosts refer to the following specification. For `ubuntu 16.04` OS, it's recommended to select the latest `16.04.5`.

### Hardware Recommendations

| System | Minimum Requirements |  Recommendations |
| --- | --- | --- |
| CentOS 7.5 (64 bit) | CPU：4 Core <br/> Memory：8 G <br/> Disk Space：40 G | CPU：8 Core <br/> Memory：16 G <br/> Disk Space：more than 300 G |
| Ubuntu 16.04/18.04 LTS (64 bit) | CPU：4 Core <br/> Memory：8 G <br/> Disk Space：40 G | CPU：8 Core <br/> Memory：16 G <br/> Disk Space：more than 300 G |
| Red Hat Enterprise Linux Server 7.4 (64 bit) | CPU：4 Core <br/> Memory：8 G <br/> Disk Space：40 G | CPU：8 Core <br/> Memory：16 G <br/> Disk Space：more than 300 G |


The following section describes an example to introduce multi-node installation. This example showing 3 hosts installation that "master" serves as the taskbox who is supposed to execute the installation. The KubeSphere cluster architecture consists of management nodes (Master) and working nodes (Node), the following cluster consists of one Master and two Nodes. In the underlying Kubernetes, the Worker nodes and the Master nodes all running a kubelet, but there are three system pods running on Master : kube-apiserver, kube-scheduler, and kube-controller-manager. Assume that the host information as following table showing:

> Note: The Advanced Edition supports the high-availability configuration of the Master and etcd nodes, but this example is only for testing installation, so only a single Master and a single etcd are deployed. The formal environment is recommended to create highly available Master and etcd cluster, see [Creating Highly Available Master and Etcd Cluster](../master-etcd-ha).

| Host IP | Host Name | Role |
| --- | --- | --- |
|192.168.0.1|master|master, etcd|
|192.168.0.2|node1|node|
|192.168.0.3|node2|node|


### Cluster Architecture

**Single master, Single etcd, Double nodes**

![Architecture](/cluster-architecture.svg)

<!-- ## 第二步: 准备安装配置文件

**1.** [下载安装包](https://kubesphere.io/download)，获取下载链接后可使用 `curl -O url` or `wget url` 命令下载至待安装机器，并执行以下命令。

```bash
$ tar -zxf kubesphere-all-advanced-1.0.0.tar.gz
```

**2.** 进入 “`kubesphere-all-advanced-1.0.0`” 目录

```bash
$ cd kubesphere-all-advanced-1.0.0
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
``` -->

## Step 2: Provision Installation Files


**1.**  Download [KubeSphere Advanced Edition](https://kubesphere.io/download), suggest you to download installer via command like `curl -O url` or `wget url` with download link. When you get the installer, execute following command to unzip it. 

```bash
$ tar -zxf kubesphere-all-advanced-1.0.0.tar.gz
```

**2.** Go into “`kubesphere-all-advanced-1.0.0`” folder

```bash
$ cd kubesphere-all-advanced-1.0.0
```

**3.** In order to manage deployment process and target machines configuration, please refer to the following scripts to configure all hosts in `hosts.ini`. It's recommneded to install using `root` user, here showing an example configuration in `CentOS 7.5` using `root` user. Note that each host information occupies one line and cannot be wrapped manually.

> Note:
> - If installer is ran from non-root user account who has sudo privilege already, then you are supposed to reference the example section that is commented out in `conf/hosts.ini`.
> - If the `root` user cannot be ssh connected to other machines in taskbox, you need to refer to the `non-root` user example section in the `conf/hosts.ini` as well, but it's recommended to switch to the `root` user when executing `install.sh`. If you are still confused about this, see the [FAQ - Question 2](../../faq).

**hosts.ini**

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
<!-- 
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
> - `ansible_ssh_pass`: 待连接主机 root 用户的密码。 -->

**Note：** <br/>

> - Each node's parameters like Internal IP and its password needs to be modified into `[all]` field. In this example, since "master" served as `taskbox` which has been ssh connected from your local, just needs to replace "ip" with your current "ip".
> - Other nodes like "node1" and "node2", both `"ansible_host"` and "ip" needs to be replaced by their actual Internal IP, and `"ansible_ssh_pass"` should be replaced with the ssh password in `[all]` field.
> - "master" is served as the taskbox which is to execute installation task for whole cluster, as well as the role of master and etcd, so "master" needs to be filled into `[kube-master]` and `[etcd]` field.
> - At the same time, for "node1" and "node2", they serve the role of `Node` as well, so all of the hosts name need to be filled into `[kube-node]` field.
> 
> Parameters Specification:
> 
> - `ansible_connection`: Connection type to the host, set to local here means local connection.
> - `ansible_host`: The name of the host to be connected.
> - `ip`: The ip of the host to be connected.
> - `ansible_user`: The default ssh user name to use.
> - `ansible_become_pass`: Allows you to set the privilege escalation password.
> - `ansible_ssh_pass`: The password of the host to be connected using root.


<!-- **5.** 为方便测试部署和演示，本文档以部署 NFS Server 至当前集群为例。注意，在正式环境使用需准备 KubeSphere 支持的存储服务端。以下存储配置示例需在 `vars.yml` 中修改，将安装 NFS server in Kubernetes 至当前集群作为默认存储类型，参数释义详见 [存储配置说明](../storage-configuration/#NFS)。

> 说明：
> - 网络、存储等相关内容需在 `conf/vars.yml` 配置文件中指定或修改，根据配置文件按需修改相关配置项，未做修改将以默认参数执行。
> - 网络：默认插件 `Calico`。
> - 支持存储类型：[QingCloud 云平台块存储](https://docs.qingcloud.com/product/storage/volume/)、[QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)、[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[GlusterFS](https://www.gluster.org/)、[Ceph RBD](https://ceph.com/)、[Local Volume (仅支持 all-in-one)](https://kubernetes.io/docs/concepts/storage/volumes/#local)，存储配置相关的详细信息请参考 [存储配置说明](../storage-configuration)。
> - Multi-Node 安装时需要配置持久化存储，因为它不支持 Local Volume，因此把 Local Volume 的配置修改为 false，然后配置持久化存储如 QingCloud-CSI (QingCloud 块存储插件)、NeonSAN CSI (NeonSAN 存储插件)、NFS、GlusterFS、CephRBD 等。如下所示配置 NFS server in Kubernetes，将 `nfs_server_enable` 和 `nfs_server_is_default_class` 设置为 true。
> - 由于 Kubernetes 集群的 Cluster IP 子网网段默认是 `10.233.0.0/18`，Pod 的子网网段默认是 `10.233.64.0/18`，因此部署 KubeSphere 的节点 IP 地址范围不应与以上两个网段有重复，若遇到地址范围冲突可在配置文件 `conf/vars.yaml` 修改 `kube_service_addresses` 或 `kube_pods_subnet` 的参数。 -->

<!-- 

**存储配置示例：**

```yaml
# Local volume provisioner deployment(Only all-in-one)
local_volume_provisioner_enabled: false
local_volume_provisioner_storage_class: local
local_volume_is_default_class: false

# NFS-Server provisioner deployment
nfs_server_enable: true
nfs_server_is_default_class: true

``` -->

**5.** It is recommended to use the storage services which are recommended by KubeSphere and prepare the corresponding storage server. If you are not prepare the storage server yet, you can also configure NFS server in Kubernetes as the default storage only for testing installation. If so, you may need to modify the storage class parameters in  `vars.yml` refer to the example below. For details please reference the <a href="https://docs.kubesphere.io/advanced-v1.0/zh-CN/installation/storage-configuration/" target="_blank">Storage Configuration Instructions</a>.
 
**Note：**  <br/>

> - You may need to modify the relevant configurations like network or storage class in `conf/vars.yaml`, otherwise it will be executed with default parameters without any modifications.
> - Network：KubeSphere supports `calico` by default.
> - Supported Storage Classes as following list, please reference [Storage Configuration Instructions](../storage-configuration) for the details：
>     - [QingCloud Block Storage](https://www.qingcloud.com/products/volume/)
>     - [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)
>     - [GlusterFS](https://www.gluster.org/)
>     - [CephRBD](https://ceph.com/)
>     - [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)
>     - [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local)
> - Typically, you need to configure the persistent storage. Since multi-node mode does not support local storage, it's recommended to modify the local storage configuration to `false`, then configure persistent storage such as QingCloud-CSI, NeonSAN-CSI, GlusterFS or CephRBD. Following example describes how to configure NFS server in Kubernetes (`nfs_server_enable` and `nfs_server_is_default_class` needs to be set to true).
> - Since the default subnet for Cluster IPs is 10.233.0.0/18, default subnet for Pod IPs is 10.233.64.0/18 in Kubernetes cluster. The node IPs must not overlap with those 2 default IPs. If any conflicts happened with the IP address, go to `conf/vars.yaml` and modify `kube_service_addresses` or `kube_pods_subnet` to avoid this senario.


**Example** 

```yaml
# Local volume provisioner deployment(Only all-in-one)
local_volume_provisioner_enabled: false
local_volume_provisioner_storage_class: local
local_volume_is_default_class: false

# NFS-Server provisioner deployment
nfs_server_enable: true
nfs_server_is_default_class: true
```
<!-- 
## 第三步: 安装 KubeSphere

KubeSphere 多节点部署会自动化地进行环境和文件监测、平台依赖软件的安装、Kubernetes 和 etcd 集群的自动化部署，以及存储的自动化配置。Installer 默认安装的 Kubernetes 版本是 v1.12.3，安装成功后可通过 KubeSphere 控制台右上角点击关于查看安装的版本。KubeSphere 安装包将会自动安装一些依赖软件，如 Ansible (v2.4+)，Python-netaddr (v0.7.18+)，Jinja (v2.9+)。

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

**3.** 输入数字 `2` 选择第二种 Multi-node 模式开始部署，安装程序会提示您是否已经配置过存储，若未配置请输入 "no"，返回目录继续配置存储并参考 [存储配置说明](../storage-configuration)。 -->

## Step 3: Get Started With Deployment

The environment and file monitoring, dependencies, Kubernetes (v1.12.3) and etcd, as well as the automated storage deployment, all of these procedures will be automatically processing in this installation. The KubeSphere installer will automatically install the relevant dependent software like Ansible (v2.4+)，Python-netaddr (v0.7.18+) and Jinja (v2.9+) as well.

Following steps describes how to get started with all-in-one:

> Since Multi-node installation duration is related to network conditions and bandwidth, machine configuration and the number of nodes, it's hard to give a standard duration. 

**1.** Go into `scripts`:

```bash
$ cd scripts
```

**2.** It's recommended to install using `root` user, then execute `install.sh`:

```bash
$ ./install.sh
```

**3.** Enter `2` to select `multi-node` mode to start, the installer will prompt if you have configured the storage or not. If not, please enter "no", then return to configure the storage, for details please reference [Storage Configuration Instructions](../storage-configuration).

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2018-12-08
################################################
Please input an option: 2

```

<!-- **4.** 测试 KubeSphere 集群部署是否成功：

**(1)** 待安装脚本执行完后，当看到如下 `"Successful"` 界面，则说明 KubeSphere 安装成功。若需要在外网访问，可能需要绑定公网 EIP 并配置端口转发，若公网 EIP 有防火墙，请在防火墙添加规则放行对应的端口 (比如 32130)，保证外网流量可以通过该端口，外部才能够访问。

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

> 提示：如需要再次查看以上的界面信息，可在安装包目录下执行 `cat kubesphere/kubesphere_running` 命令查看。

**(2)** 安装成功后，浏览器访问对应的 url，即可进入 KubeSphere 登录界面，可使用默认的用户名和密码登录 KubeSphere 控制台体验，参阅 [快速入门](../../quick-start/quick-start-guide) 帮助您快速上手 KubeSphere。

![KubeSphere 控制台](/kubesphere-console.png) -->

**4.** To verify the multi-node installation：

**(1).** If you can see the following "Successful" result being returned after `install.sh` completed, that means KubuSphere installation is ready. You may need to bind the EIP and configure port forwarding. Make sure you have added the corresponding Nodeport to the firewall (like 32130) if the EIP has a firewall, then external network traffic can pass through this nodeport.

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


> Note: If you need to view the above interface , just execute `cat kubesphere/kubesphere_running` command in the installer directory.

**(2).** You will be able to use default account and password to log in to the KubeSphere console to experience when KubeSphere is deployed successfully. It's highly recommended to refer to the [KubeSphere Quick Start](../../quick-start/quick-start-guide/)， and learn how to get started with it！

![login](/login-page-en.png)