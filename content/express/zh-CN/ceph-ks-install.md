---
title: "部署 Ceph RBD 存储服务端"
---

## 简介

[Ceph](https://ceph.com/) 是一个分布式存储系统，本指南将介绍如何在 Ubuntu 系统部署一个节点数为 2 的 Ceph (v10.2.10) 存储服务端集群。本指南仅供测试 KubeSphere 存储服务端的搭建，正式环境搭建 Ceph 集群请参考 [Ceph 官方文档](http://docs.ceph.com/docs/master/)。

### Ceph 基本组件

Ceph 主要有三个基本进程:
- OSD
用于集群中所有数据与对象的存储，处理集群数据的复制、恢复、回填、再均衡，并向其他osd守护进程发送心跳，然后向 Monitor 提供一些监控信息。

- Monitor
监控整个集群的状态，维护集群的 cluster MAP 二进制表，保证集群数据的一致性。

- MDS (可选)
为 Ceph 文件系统提供元数据计算、缓存与同步。MDS 进程并不是必须的进程，只有需要使用 CephFS 时，才需要配置 MDS 节点。



## 准备节点

主机规格

|Hostname |IP     |OS       | CPU |RAM|Device|
|-------|:------:|:------:|-----|-----|:---:|
|ceph1  |172.20.1.7|Ubuntu 16.04.4|4 Core|4 GB|/dev/vda 100 GiB|
|ceph2  |172.20.1.8|Ubuntu 16.04.4|4 Core|4 GB |/dev/vda 100 GiB|

集群架构

```

  +--------------+               +--------------+
  |              |               |              |
  |    ceph1     |_______________|     ceph2    |
  | MONITOR,OSD  |               |      OSD     |
  |              |               |              |
  +--------------+               +--------------+


```

> 注：
> - `ceph1` 作为集群的管理主机，用来执行安装任务。
> - 如需创建更大容量的 Ceph 存储服务端，可创建更大容量主机磁盘或挂载大容量磁盘至主机并挂载至 ceph1 的 `/osd1` 和 ceph2 的 `/osd2` 文件夹。
> - 两个节点的 Hostname 需要与主机规格的列表中一致，因为后续步骤的命令行中有匹配到 Hostname，若与以上列表不一致请注意在后续的命令中对应修改成实际的 Hostname。

## 预备工作

### 配置 root 登录

1、参考如下步骤分别为 ceph1 和 ceph2 配置 root 用户登录：

- 1.1. ubuntu 账户登录主机后切换 root 用户：

```
ubuntu@ceph1:~$ sudo -i
[sudo] password for ubuntu: 
root@ceph1:~# 
```

- 1.2. 设置 root 用户登录密钥：

```
root@ceph1:~# passwd
```

- 同上，在 ceph2 修改 root 密码。

### 修改 hosts 文件

2、参考如下步骤修改 ceph1 和 ceph2 的 `hosts` 文件：

```
root@ceph1:~# vim /etc/hosts
127.0.0.1	localhost

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters

# hostname loopback address
172.20.1.7	ceph1
172.20.1.8	ceph2

```
- 同上，在 ceph2 执行以上命令并修改 hosts。


### 配置 SSH 免密登录

3、以下为 ceph1 的 root 用户配置无密码登录至 ceph1 与 ceph2。

- 3.1. 创建密钥，提示 “Enter passphrase” 时，直接回车，口令即为空：

```
root@ceph1:~# ssh-keygen
```

- 3.2. 拷贝密钥到两个个 Ceph 节点，按照提示输入密钥：

```
root@ceph1:~# ssh-copy-id root@ceph1
...
root@ceph1:~# ssh-copy-id root@ceph2
...
```

- 3.3. 验证免密登录，即 ceph1 的 root 用户无需输入密码可以登录 ceph1 和 ceph2：

```
root@ceph1:~# ssh root@ceph1
root@ceph1:~# ssh root@ceph2
```
## 开始安装

### 安装 Ceph 和 ceph-deploy

4、Ceph 官方推出了一个用 python 写的工具 cpeh-deploy，可以很大程度地简化 Ceph 集群的配置过程，参考如下步骤为 ceph1 和 ceph2 安装 Ceph 和 ceph-deploy：
```
root@ceph1:~# apt-get update
root@ceph1:~# apt-get install -y ceph ceph-deploy
```
- 同上，在 ceph2 执行以上命令。

### 创建文件夹

5、参考如下步骤为 ceph1 和 ceph2 创建文件夹。

- 5.1. 在 ceph1 创建文件夹存放初始化配置：

```
root@ceph1:~# mkdir -p /root/cluster 
root@ceph1:~# rm -f /root/cluster/*
```

- 5.2. 分别在 ceph1 和 ceph2 存放 ceph 数据：

```
root@ceph1:~# mkdir -p /osd1 & rm -rf /osd1/*
root@ceph1:~# chown ceph:ceph /osd1
```

```
root@ceph2:~# mkdir -p /osd2 & rm -rf /osd2/*
root@ceph2:~# chown ceph:ceph /osd2
```

- 5.3. 在 ceph1 创建 ceph 文件夹：

```
root@ceph1:~# mkdir -p /var/run/ceph/
root@ceph1:~# chown ceph:ceph /var/run/ceph/
```

- 同上，在 ceph2 执行以上命令创建 ceph 文件夹。

### 初始化 ceph

6、执行以下命令在 ceph1 节点初始化 ceph：

```
root@ceph1:~# cd /root/cluster
root@ceph1:~/cluster# ceph-deploy new ceph1
```

- 查看各文件夹内容：

```
root@ceph1:~/cluster# ls
ceph-deploy-ceph.log  ceph.conf  ceph.mon.keyring
root@ceph1:~/cluster# ls /etc/ceph/
rbdmap
root@ceph1:~/cluster# ls /var/run/ceph/
```

### 修改 Ceph 配置文件

7、在 ceph1 配置 `ceph.conf`，添加以下参数：

```
root@ceph1:~/cluster# vim ceph.conf 
[global]
···
···
osd pool default size = 2
osd crush chooseleaf type = 0
osd max object name len = 256
osd journal size = 128

```

### 激活 Mon 节点

8、Mon 节点监控着整个 Ceph 集群的状态信息，监听于 TCP 的 `6789` 端口。每一个 Ceph 集群中至少要有一个 Mon 节点，如下在 ceph1 激活 Monitor：

```
root@ceph1:~/cluster# ceph-deploy mon create-initial
...
[ceph_deploy.gatherkeys][DEBUG ] Got ceph.bootstrap-rgw.keyring key from ceph1.
```

### 创建 OSD 节点

9、OSD 是强一致性的分布式存储，用于集群中所有数据与对象的存储，如下在 ceph1 为集群中两个节点创建 OSD：

```
root@ceph1:~/cluster# ceph-deploy osd prepare ceph1:/osd1 ceph2:/osd2
...
[ceph_deploy.osd][DEBUG ] Host ceph1 is now ready for osd use.
...
[ceph_deploy.osd][DEBUG ] Host ceph2 is now ready for osd use.
```

- 启动 OSD 节点：

```
root@ceph1:~/cluster# ceph-deploy osd activate ceph1:/osd1 ceph2:/osd2
```

### 拷贝配置

10、拷贝配置到 ceph1 和 ceph2：

```
root@ceph1:~/cluster# ceph-deploy admin ceph1 ceph2
```   

```
root@ceph1:~/cluster# chmod +r /etc/ceph/ceph.client.admin.keyring
root@ceph2:~/cluster# chmod +r /etc/ceph/ceph.client.admin.keyring
```

## 验证安装结果

11、至此，一个简单的 Ceph 存储服务集群搭建就完成了，接下来查看安装的 Ceph 版本和状态信息。

- 11.1. 查看 Ceph 版本：

```
root@ceph1:~/cluster# ceph -v
ceph version 10.2.10 (5dc1e4c05cb68dbf62ae6fce3f0700e4654fdbbe)
```

- 11.2. 在两个节点检查 ceph 状态，可以使用 `ceph –s` 查看，如果是 health 显示 `HEALTH_OK` 状态说明配置成功。


## 使用 ceph 服务

12、首先，需要创建 rbd image，image 是 Ceph 块设备中的磁盘映像文件，可使用 `rbd create ...` 命令创建指定大小的映像。

- 12.1. 此处在 ceph1 以创建 foo 为例：

```
root@ceph1:~/cluster# rbd create foo --size 4096 --pool rbd --image-format=1
rbd: image format 1 is deprecated
```

- 12.2. 检查 rbd image：

```
root@ceph1:~/cluster# rbd ls
foo
```

- 12.3. 在 ceph1 把 foo image 映射到内核：

```
root@ceph1:~/cluster# rbd map foo
/dev/rbd0
```

- 12.4. 检查挂载状态：

```
root@ceph1:~/cluster# fdisk -l
...
Disk /dev/rbd0: 4 GiB, 4294967296 bytes, 8388608 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 4194304 bytes / 4194304 bytes

```

### 分区格式化

13、将 foo image 格式化为 ext4 格式的文件系统：
```
root@ceph1:~/cluster# mkfs.ext4 /dev/rbd0

```

- 13.1. 创建文件夹，然后挂载至目标文件夹：

```
root@ceph1:~/cluster# mkdir -p /mnt/rbd
root@ceph1:~/cluster# mount /dev/rbd0 /mnt/rbd
```

- 13.2 在 ceph1 检查挂载结果:

```
root@ceph1:~/cluster# df -ah
...
/dev/rbd0       3.9G  8.0M  3.6G   1% /mnt/rbd
```

```
root@ceph1:~/cluster# ls /mnt/rbd/
lost+found
```


## 释放资源

14、注意，在使用完毕之后，可参考如下步骤卸载和删除不需要的资源。

- 14.1. 参考如下将文件系统从文件中卸载：

```
root@ceph1:~/cluster# umount /mnt/rbd
```

- 14.2. 检查卸载结果：

```
root@ceph1:~/cluster# df -ah
...
```

- 14.3. 卸载 rbd image：

```
root@ceph1:~/cluster# rbd unmap foo
```

- 14.4. 检查卸载结果：

```
root@ceph1:~/cluster# fdisk -l
Disk /dev/vda: 100 GiB, 107374182400 bytes, 209715200 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x5735896b

Device     Boot Start       End   Sectors  Size Id Type
/dev/vda1  *     2048 209713247 209711200  100G 83 Linux


Disk /dev/vdb: 2 GiB, 2147483648 bytes, 4194304 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes

```

- 14.5. 删除 rbd image：

```
root@ceph1:~/cluster# rbd remove foo
Removing image: 100% complete...done.
```