---
title: "All-in-One 模式"
---
对于首次接触 KubeSphere 高级版的用户，想寻找一个最快安装和体验 KubeSphere 高级版核心功能的方式，all-in-one 模式支持一键安装 KubeSphere 至一台目标机器，请参考如下步骤开始安装。

## 前提条件

<!-- - 下载最新的 [KubeSphere Advanced Edition 2.0.0 - dev](https://kubesphere.io/download/?type=advanced) 至待安装机器中。 -->
建议使用 KubeSphere 支持的存储服务，并准备相应的存储服务端。若还未准备存储服务端，为方便测试部署，也可使用 [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) 作为默认存储。

## 第一步: 准备主机

您可以参考以下节点规格准备一台符合要求的主机节点开始 `all-in-one` 模式的安装，若使用 ubuntu 16.04 建议使用其最新的版本 16.04.5。

> 说明：若 Debian 系统未安装 sudo 命令，则需要在安装前使用 root 用户执行 `apt update && apt install sudo` 命令安装 sudo 命令后再进行安装。

| 操作系统 | 最小配置 | 推荐配置 |
| --- | --- | --- | 
| CentOS 7.5 (64 bit) | CPU：8 核 <br/> 内存：16 G <br/> 系统盘：100 G | CPU：大于 8 核 <br/> 内存：大于 16 G <br/> 系统盘：不小于 100 G |
| Ubuntu 16.04/18.04 LTS (64 bit) | CPU：8 核 <br/> 内存：16 G <br/> 系统盘：100 G | CPU：大于 8 核 <br/> 内存：大于 16 G <br/> 系统盘：不小于 100 G |
|Red Hat Enterprise Linux Server 7.4 (64 bit) | CPU：8 核 <br/> 内存：16 G <br/> 系统盘：100 G | CPU：大于 8 核 <br/> 内存：大于 16 G <br/> 系统盘：不小于 100 G |
|Debian Stretch 9.5 (64 bit)| CPU：8 核 <br/> 内存：16 G <br/> 系统盘：100 G | CPU：大于 8 核 <br/> 内存：大于 16 G <br/> 系统盘：不小于 100 G |



## 第二步: 准备安装包

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

## 第三步: 安装 KubeSphere

KubeSphere 安装过程中将会自动化地进行环境和文件监测、平台依赖软件的安装、Kubernetes 和 etcd 的自动化安装，以及存储的自动化配置。最新的Installer 默认安装的 Kubernetes 版本是 v1.13.5，安装成功后可通过 KubeSphere 控制台右上角点击关于查看安装的版本。

> 说明：
> - 通常情况您不需要修改任何配置，直接安装即可。
> - 若您需要自定义配置文件的安装参数，如网络、存储等相关内容需在 **`conf/vars.yml`** 配置文件中指定或修改。
> - 网络：默认插件 `calico`。
> - All-in-One 默认会用 Local Volume 即本地存储设备作为存储类型，但 Local Volume 不支持动态分配，需手动创建 Persistent Volume (PV)，Installer 会预先创建 10 个可用的 10G PV 供使用。若存储空间不足时则需要手动创建，参见 [Local Volume 使用方法](../../storage/local-volume)。
> - 支持存储类型：[QingCloud 云平台块存储](https://docs.qingcloud.com/product/storage/volume/)、[QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)、[GlusterFS](https://www.gluster.org/)、[CephRBD](https://ceph.com/)、[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local)，存储配置相关的详细信息请参考 [存储配置说明](../storage-configuration)。
> - 由于 Kubernetes 集群的 Cluster IP 子网网段默认是 `10.233.0.0/18`，Pod 的子网网段默认是 `10.233.64.0/18`，因此安装 KubeSphere 的节点 IP 地址范围不应与以上两个网段有重复，若遇到地址范围冲突可在配置文件 `conf/vars.yaml` 修改 `kube_service_addresses` 或 `kube_pods_subnet` 的参数。

**注意事项**

需要注意的是，如果在云平台上选择使用 KubeSphere 默认的 Calico 网络插件进行安装，并且主机是直接运行在基础网络中，则需要为源 IP (IP/端口集合) 添加防火墙的 ipip 协议，例如在 QingCloud 云平台添加防火墙的 ipip 协议：

![ipip 协议](/ipip-protocol.png)

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
https://kubesphere.io/               2018-04-19
################################################
Please input an option: 1

```

**4.** 测试 KubeSphere 单节点安装是否成功：

**(1)** 待安装脚本执行完后，当看到如下 `"Successful"` 界面，则说明 KubeSphere 安装成功。

```bash
successsful!
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.8:30880
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

