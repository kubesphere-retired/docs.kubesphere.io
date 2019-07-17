---
title: "All-in-One 模式"
keywords: ''
description: ''
---

对于首次接触 KubeSphere 高级版的用户，想寻找一个最快安装和体验 KubeSphere 高级版核心功能的方式，all-in-one 模式支持一键安装 KubeSphere 至一台目标机器。

> 提示：
> - 若需要安装 Harbor 和 GitLab 请在**安装前**参考 [安装内置 Harbor](../harbor-installation) 和 [安装内置 GitLab](../gitlab-installation)。
> - 若在云平台使用在线安装，可通过调高带宽的方式来加快安装速度。

## 前提条件

建议使用 KubeSphere 支持的存储服务，并准备相应的存储服务端。若还未准备存储服务端，为方便测试部署，也可使用 [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) 作为默认存储。

## 第一步: 准备主机

您可以参考以下节点规格准备一台符合要求的主机节点开始 `all-in-one` 模式的安装。

> 说明：
> - 若使用 ubuntu 16.04 建议使用其最新的版本 16.04.5；
> - 若使用 ubuntu 18.04，则需要使用 root 用户；
> - 若 Debian 系统未安装 sudo 命令，则需要在安装前使用 root 用户执行 `apt update && apt install sudo` 命令安装 sudo 命令后再进行安装。
> - 若需要选装 Harbor 和 GitLab，则主机的内存需要 16 G 以上。

| 操作系统 | 最小配置 | 
| --- | --- |
|CentOS 7.5 (64 bit) | CPU：8 核， 内存：16 G， 系统盘：100 G | 
|Ubuntu 16.04/18.04 LTS (64 bit) | CPU：8 核， 内存：16 G， 系统盘：100 G |
|Red Hat Enterprise Linux Server 7.4 (64 bit) | CPU：8 核， 内存：16 G， 系统盘：100 G | 
|Debian Stretch 9.5 (64 bit)| CPU：8 核， 内存：16 G， 系统盘：100 G | 



## 第二步: 准备安装包

<div class="md-tabs">
<input type="radio" name="tabs" id="stable" checked="checked">
<label for="stable">在线版 (2.0.2)</label>
<span class="md-tab">

下载 `KubeSphere Advanced Edition 2.0.2` 安装包至待安装机器，进入安装目录。

```bash
$ curl -L https://kubesphere.io/download/stable/advanced-2.0.2 > advanced-2.0.2.tar.gz && tar -zxf advanced-2.0.2.tar.gz && cd kubesphere-all-advanced-2.0.2/scripts
```

</span>
<input type="radio" name="tabs" id="offline">
<label for="offline">离线版 (2.0.0)</label>
<span class="md-tab">

下载 `离线安装包 (2.0.0)` 至待安装机器 (2.0.2 的离线安装包即将上线)。

```bash
$ curl -L https://kubesphere.io/download/offline/advanced-2.0.0 > advanced-2.0.0.tar.gz && tar -zxf advanced-2.0.0.tar.gz && cd kubesphere-all-advanced-2.0.0/scripts
```

</span>
</div>

## 第三步: 安装 KubeSphere

KubeSphere 安装过程中将会自动化地进行环境和文件监测、平台依赖软件的安装、Kubernetes 和 etcd 的自动化安装，以及存储的自动化配置。最新的 Installer 默认安装的 Kubernetes 版本是 v1.13.5，安装成功后可通过 KubeSphere 控制台右上角点击关于查看安装的版本。

> 说明：
> - 通常情况您不需要修改任何配置，直接安装即可。
> - 网络默认插件是 `calico`，若您需要自定义安装参数，如网络、存储、GitLab、Harbor、负载均衡器插件等相关内容需在 **`conf/vars.yml`** 配置文件中指定或修改，参考 [集群组件配置说明](../vars)。
> - All-in-One 默认会用 Local Volume 即本地存储设备作为存储类型，但 Local Volume 不支持动态分配，需手动创建 Persistent Volume (PV)，Installer 会预先创建 26 个可用的 10G PV 供使用。若存储空间不足时则需要手动创建，参见 [Local Volume 使用方法](../../storage/local-volume)。
> - 支持存储类型：[QingCloud 云平台块存储](https://docs.qingcloud.com/product/storage/volume/) (QingCloud 公有云单节点挂盘限制为 10 块)、[QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)、[GlusterFS](https://www.gluster.org/)、[Ceph RBD](https://ceph.com/)、[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local)，存储配置相关的详细信息请参考 [存储配置说明](../storage-configuration)。
> - 由于 Kubernetes 集群的 Cluster IP 子网网段默认是 `10.233.0.0/18`，Pod 的子网网段默认是 `10.233.64.0/18`，因此安装 KubeSphere 的节点 IP 地址范围不应与以上两个网段有重复，若遇到地址范围冲突可在配置文件 `conf/vars.yaml` 修改 `kube_service_addresses` 或 `kube_pods_subnet` 的参数。

**注意事项**

需要注意的是，如果在云平台上选择使用 KubeSphere 默认的 Calico 网络插件进行安装，并且主机是直接运行在基础网络中，则需要为源 IP (IP/端口集合) 添加防火墙的 IPIP 协议，例如在 QingCloud 云平台添加防火墙的 IPIP 协议：

![ipip 协议](/ipip-protocol.png)

参考以下步骤开始 all-in-one 安装：

> 说明：安装时间跟网络情况和带宽、机器配置、安装节点个数等因素有关，已测试过的 all-in-one 模式，在网络良好的情况下以规格列表最小配置安装用时大约为 25 分钟。

**1.** 建议使用 `root` 用户安装，执行 `install.sh` 脚本：

```bash
$ ./install.sh
```

**2.** 输入数字 `1` 选择第一种即 all-in-one 模式开始安装：

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2018-07-08
################################################
Please input an option: 1

```

**3.** 测试 KubeSphere 单节点安装是否成功：

**(1)** 待安装脚本执行完后，当看到如下 `"Successful"` 界面，则说明 KubeSphere 安装成功。

```bash
successsful!
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.8:30880
Account: admin
Password: P@88w0rd

NOTE：Please modify the default password after login.
#####################################################
```
> 提示：如需要再次查看以上的界面信息，可在安装包目录下执行 `cat kubesphere/kubesphere_running` 命令查看。

**(2)** 若需要在外网访问，在云平台需要在端口转发规则中将**内网端口** 30880 转发到**源端口** 30880，然后在防火墙开放这个**源端口**，确保外网流量可以通过该端口。

例如在 QingCloud 平台配置端口转发和防火墙规则，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。

**(3)** 安装成功后，浏览器访问对应的 URL，如 `http://{$公网IP}:30880`，即可进入 KubeSphere 登录界面，可使用默认的用户名和密码登录 KubeSphere 控制台体验，**登录后请立即修改默认密码**。参阅 [快速入门](../../quick-start/quick-start-guide) 帮助您快速上手 KubeSphere。 

![KubeSphere 控制台](/kubesphere-console.png)

<font color=red>注意：登陆 Console 后请在 "集群状态" 查看服务组件的监控状态，待所有组件启动完成后即可开始使用，通常所有服务组件都将在 15 分钟内启动完成。</font>

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190519012821.png)



