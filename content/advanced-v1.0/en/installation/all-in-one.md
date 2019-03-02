---
title: "All-in-One"
---
<!-- 对于首次接触 KubeSphere 高级版的用户，想寻找一个最快安装和体验 KubeSphere 高级版核心功能的方式，all-in-one 模式支持一键安装 KubeSphere 至目标机器，请参考如下步骤开始安装。

## 前提条件

- 请下载 [KubeSphere 高级版](https://kubesphere.io/download) 至待安装机器中。
- 建议使用 KubeSphere 支持的存储服务，并准备相应的存储服务端。若还未准备存储服务端，为方便测试部署，也可使用 [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) 作为默认存储。 -->

For those who are new to KubeSphere Advanced Edition and looking for the fastest way to install and experience the new features, the all-in-one mode must be your best choice since it supports one-click installation. Just follow the steps below to get started.

### Prerequisites

- Please download [KubeSphere Advanced Edition](https://kubesphere.io/download/) to the target machine.
- It is recommended to use the storage services which are recommended by KubeSphere and prepare the corresponding storage servers. If you are not prepare the storage servers yet, you can also use [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) as the default storage only for testing installation.

<!-- ## 第一步: 准备主机

您可以参考以下节点规格准备一台符合要求的主机节点开始 `all-in-one` 模式的安装，若使用 ubuntu 16.04 建议使用其最新的版本 16.04.5。

| 操作系统 | 最小配置 | 推荐配置 |
| --- | --- | --- |
| CentOS 7.5 (64 bit) | CPU：4 核 <br/> 内存：8 G <br/> 磁盘：100 G | CPU：8 核 <br/> 内存：16 G <br/> 磁盘：大于等于 300 G |
| Ubuntu 16.04/18.04 LTS (64 bit) | CPU：4 核 <br/> 内存：8 G <br/> 磁盘：100 G | CPU：8 核 <br/> 内存：16 G <br/> 磁盘：大于等于 300 G |
|Red Hat Enterprise Linux Server 7.4 (64 bit) | CPU：4 核 <br/> 内存：8 G <br/> 磁盘：100 G | CPU：8 核 <br/> 内存：16 G <br/> 磁盘：大于等于 300 G | -->

#### Step 1: Provision Linux Host

The following section identifies the hardware specifications and system-level requirements of one host for installation. To get started with all-in-one mode, you may need to prepare only one host refer to the following specification. For `ubuntu 16.04` OS, it's recommended to select the latest `16.04.5`.

##### Hardware Recommendations

| System | Minimum Requirements |  Recommendations |
| --- | --- | --- |
| CentOS 7.5 (64 bit) | CPU：4 Core <br/> Memory：8 G <br/> Disk Space：100 G | CPU：8 Core <br/> Memory：16 G <br/> Disk Space：be equal or greater than 300 G |
| Ubuntu 16.04/18.04 LTS (64 bit) | CPU：4 Core <br/> Memory：8 G <br/> Disk Space：100 G | CPU：8 Core <br/> Memory：16 G <br/> Disk Space：be equal or greater than 300 G |
| Red Hat Enterprise Linux Server 7.4 (64 bit) | CPU：4 Core <br/> Memory：8 G <br/> Disk Space：100 G | CPU：8 Core <br/> Memory：16 G <br/> Disk Space：be equal or greater than 300 G |

<!-- ## 第二步: 准备安装包

**1.** [下载安装包](https://kubesphere.io/download)，获取下载链接后可使用 `curl -O url` or `wget url` 命令下载至待安装机器，并执行以下命令。

```bash
$ tar -zxf kubesphere-all-advanced-1.0.0.tar.gz
```

**2.** 进入 “`kubesphere-all-advanced-1.0.0`” 目录。

```bash
$ cd kubesphere-all-advanced-1.0.0
``` -->

####  Step 2: Provision Installation Files

**1.**  Download [KubeSphere Installer](https://kubesphere.io/download), suggest you to download the installer via command like `curl -O url` or `wget url` with download link. When you get the installer, execute following command to unzip it. 

```
  $ tar -zxf kubesphere-all-advanced-1.0.0.tar.gz
```

**2.** Go into “`kubesphere-all-advanced-1.0.0`” folder

```
  $ cd kubesphere-all-advanced-1.0.0
```

<!-- ## 第三步: 安装 KubeSphere

KubeSphere 安装过程中将会自动化地进行环境和文件监测、平台依赖软件的安装、Kubernetes 和 etcd 的自动化安装，以及存储的自动化配置。Installer 默认安装的 Kubernetes 版本是 v1.12.3，安装成功后可通过 KubeSphere 控制台右上角点击关于查看安装的版本。KubeSphere 安装包将会自动安装一些依赖软件，如 Ansible (v2.4+)，Python-netaddr (v0.7.18+)，Jinja (v2.9+)。

> 说明：
> - 通常情况您不需要修改任何配置，直接安装即可。
> - 若您需要自定义配置文件的安装参数，如网络、存储等相关内容需在 **`conf/vars.yml`** 配置文件中指定或修改。
> - 网络：默认插件 `calico`。
> - All-in-One 默认会用 Local Volume 即本地存储设备作为存储类型，但 Local Volume 不支持动态分配，需手动创建 Persistent Volume (PV)，Installer 会预先创建 10 个可用的 10G PV 供使用。若存储空间不足时则需要手动创建，参见 [Local Volume 使用方法](../../storage/local-volume)。
> - 支持存储类型：[QingCloud 云平台块存储](https://docs.qingcloud.com/product/storage/volume/)、[QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)、[GlusterFS](https://www.gluster.org/)、[CephRBD](https://ceph.com/)、[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local)，存储配置相关的详细信息请参考 [存储配置说明](../storage-configuration)。
> - 由于 Kubernetes 集群的 Cluster IP 子网网段默认是 `10.233.0.0/18`，Pod 的子网网段默认是 `10.233.64.0/18`，因此安装 KubeSphere 的节点 IP 地址范围不应与以上两个网段有重复，若遇到地址范围冲突可在配置文件 `conf/vars.yaml` 修改 `kube_service_addresses` 或 `kube_pods_subnet` 的参数。 -->

####  Step 3: Get Started With Installation

The environment and file monitoring, dependent software installation of KubeSphere, automated installation of Kubernetes and etcd, and automated storage configuration, Kubernetes v1.12.3 will be installed by default. All of these procedures will be automatically processing in this installation. The KubeSphere installer will automatically install the relevant dependent software like Ansible (v2.4+)，Python-netaddr (v0.7.18+) and Jinja (v2.9+) as well.

**Note:**

> - Generally, you can install it directly without any modification.
> - If you would like to customize the configuration parameters, such as network, storage classes, etc. You will be able to specify the parameters in  `vars.yml`. Otherwise it will be executed with default parameters without any modifications.
> - Network：KubeSphere supports `calico` by default.
> - All-in-One uses local storage as the storage class by default. Since local storage does not support dynamic provisioning, users may need to create a persistent volume (PV) in advance when creating volumes in the KubeSphere console if PVs is insufficient, installer also pre-creates 10 available 10G PVs for testing.
> - Supported Storage Classes：[QingCloud Block Storage](https://www.qingcloud.com/products/volume/)、[QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)、[GlusterFS](https://www.gluster.org/)、[CephRBD](https://ceph.com/)、[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local). For details regarding storage configuration, please refer to [Storage Configuration Instructions](https://docs.kubesphere.io/advanced-v1.0/zh-CN/installation/storage-configuration/) 
> - Since the default subnet for Cluster IPs is 10.233.0.0/18, default subnet for Pod IPs is 10.233.64.0/18 in Kubernetes cluster. The node IPs must not overlap with those 2 default IPs. If any conflicts happened with the IP address, go to `conf/vars.yaml` and modify `kube_service_addresses` or `kube_pods_subnet` to avoid this senario.


<!-- **注意事项**

需要注意的是，如果在云平台上选择使用 KubeSphere 默认的 Calico 网络插件进行安装，并且主机是直接运行在基础网络中，则需要为源 IP (IP/端口集合) 添加防火墙的 ipip 协议，例如在 QingCloud 云平台添加防火墙的 ipip 协议：

![ipip 协议](/ipip-protocol.png) -->

**Attention**

Notice that if you choose to use the default Calico network plugin for installation on the cloud platform, and the host is running directly on the Base network, you need to add an ipip protocol for the source IP (IP/port collection) in firewall rules, for example in QingCloud platform adds firewall ipip protocol:

![ipip 协议](/ipip-protocol-en.png)
<!-- 

参考以下步骤开始 all-in-one 安装：

> 说明：安装时间跟网络情况和带宽、机器配置、安装节点个数等因素有关，已测试过的 all-in-one 模式，在网络良好的情况下以规格列表最小配置安装用时大约为 25 分钟。

**1.** 进入 `scripts` 目录

```bash
$ cd scripts
```

**2.** 建议使用 `root` 用户安装，执行 `install.sh` 脚本：

```bash
$ ./install.sh
```

**3.** 输入数字 `1` 选择第一种即 all-in-one 模式开始安装：

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
Please input an option: 1

``` -->

Following steps describes how to get started with all-in-one:

> The installation duration is related to network conditions and bandwidth, machine configuration and the number of nodes. All-in-one mode installation was about 25 minutes after testing when the network was good condition with the minimum hardware requirements.

**1.** Go into `scripts`:

```
$ cd scripts
```

**2.** It's recommended to install using `root` user, then execute `install.sh`:

```
$ ./install.sh
```

**3.** Enter `1` to select `all-in-one` mode to start:

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
Please input an option: 1

```

<!-- **4.** 测试 KubeSphere 单节点安装是否成功：

**(1)** 待安装脚本执行完后，当看到如下 `"Successful"` 界面，则说明 KubeSphere 安装成功。若需要在外网访问，可能需要绑定公网 EIP 并配置端口转发，若公网 EIP 有防火墙，请在防火墙添加规则放行对应的端口 (比如 31236)，保证外网流量可以通过该端口，外部才能够访问。

```bash
successsful!
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.8:31236
Account: admin
Password: passw0rd

NOTE：Please modify the default password after login.
#####################################################
```
> 提示：如需要再次查看以上的界面信息，可在安装包目录下执行 `cat kubesphere/kubesphere_running` 命令查看。

**(2)** 安装成功后，浏览器访问对应的 url，即可进入 KubeSphere 登录界面，可使用默认的用户名和密码登录 KubeSphere 控制台体验，参阅 [快速入门](../../quick-start/quick-start-guide) 帮助您快速上手 KubeSphere。

![KubeSphere 控制台](/kubesphere-console.png) -->

**4.** Test KubeSphere all-in-one mode installation：

**(1).** If you can see the following "Successful" result being returned after `install.sh` completed, that means KubuSphere installation is ready. You may need to bind the EIP and configure port forwarding. Make sure you have added the corresponding nodeport to the firewall (like 31236) if the EIP has a firewall, then external network traffic can pass through this nodeport.

```bash
successsful!
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.8:31236
Account: admin
Password: passw0rd

NOTE：Please modify the default password after login.
#####################################################
```
 
> Note: If you need to view the above interface , just execute `cat kubesphere/kubesphere_running` command in the installer directory.

**(2).** You will be able to use default account and password to log in to the KubeSphere console to experience when KubeSphere is deployed successfully. It's highly recommended to refer to the [KubeSphere Quick Start](https://docs.kubesphere.io/advanced-v1.0/zh-CN/quick-start/quick-start-guide/)， and learn how to get started with it！

![login](/login-page-en.png)