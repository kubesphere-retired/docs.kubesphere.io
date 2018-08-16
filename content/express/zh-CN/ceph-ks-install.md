---
title: "部署 Ceph RBD 存储服务端"
---
 
> 此安装方法仅供测试 Kubesphere 存储服务端的搭建，搭建 Ceph 集群请参考 Ceph[官方网站](http://docs.ceph.com/docs/master/)

## 准备节点
主机规格

|Hostname        |IP     |OS       | CPU |RAM|Device|
|:---------------:|:------:|:------:|-----|-----|:---:|
|ceph1           |172.20.1.7|Ubuntu16.04.4|4 Core|4 GB|/dev/vda 100Gi|
|ceph2          |172.20.1.8|Ubuntu16.04.4|4 Code|4 GB |/dev/vda 100Gi|

> 如需创建更大容量 Ceph 存储服务端，可将创建更大容量主机磁盘或挂载大容量磁盘至主机并挂载至 ceph1 的 `/osd1`，ceph2 的 `/osd2` 文件夹

### 存储服务端架构图

```


  +--------------+               +--------------+
  |              |               |              |
  |     node1    |_______________|     node2    |
  | MONITOR,OSD  |               |      OSD     |
  |              |               |              |
  +--------------+               +--------------+


```


## 安装步骤
- 将要安装ceph 10.2.10

### 配置 root 账户登录（ceph1，ceph2）
- ubuntu账户登录主机后切换root账户

```
ubuntu@ceph1:~$ sudo -i
[sudo] password for ubuntu: 
root@ceph1:~# 
```
```
ubuntu@ceph2:~$ sudo -i
[sudo] password for ubuntu: 
root@ceph2:~# 
```

- 设置 root 账户登录密钥

```
root@ceph1:~# passwd
Enter new UNIX password: 
Retype new UNIX password: 
passwd: password updated successfully
```
```
root@ceph2:~# passwd
Enter new UNIX password: 
Retype new UNIX password: 
passwd: password updated successfully
```

### 修改 hosts 文件（ceph1，ceph2）
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

```
root@ceph2:~# vim /etc/hosts
127.0.0.1	localhost

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters

# hostname loopback address
172.20.1.7	ceph1
172.20.1.8	ceph2

```


### 配置 ceph1 无密码登录至 ceph1与ceph2（ceph1）
- 创建密钥，提示 “Enter passphrase” 时，直接回车，口令即为空

```
root@ceph1:~# ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Created directory '/root/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:9SZy/cPQVyU4SHuXN10WHJzlGVCjlvpY+agSqPc5ovE root@ceph1
The key's randomart image is:
+---[RSA 2048]----+
|         ... o**X|
|          ..o oOB|
|          o .=oo=|
|         . +oo..o|
|        S o.=o. .|
|       . + o++o. |
|     ..   .. o+. |
|     .oo o. .  . |
|     .oEooo.     |
+----[SHA256]-----+
```

- 拷贝密钥到各个 Ceph 节点，按照提示输入密钥

```
root@ceph1:~# ssh-copy-id root@ceph1
...
root@ceph1:~# ssh-copy-id root@ceph2
...
```

- 验证，ceph1 无需输入密码可以登录 ceph1，ceph2

```
root@ceph1:~# ssh root@ceph1
root@ceph1:~# ssh root@ceph2
```

### 安装 ceph 和 ceph-deploy（ceph1，ceph2）
unable to get package

```
root@ceph1:~# apt-get install -y ceph ceph-deploy
```

```
root@ceph2:~# apt-get install -y ceph ceph-deploy
```

### 创建文件夹（ceph1，ceph2）
- 存放初始化配置

```
root@ceph1:~# mkdir -p  /root/cluster & cd /root/cluster & rm -f /root/cluster/*
```

- 存放 ceph 数据

```
root@ceph1:~# mkdir -p /osd1 & rm -rf /osd1/*
root@ceph1:~# chown ceph:ceph /osd1
```

```
root@ceph2:~# mkdir -p /osd2 & rm -rf /osd2/*
root@ceph2:~# chown ceph:ceph /osd2
```


- 创建 ceph 文件夹

```
root@ceph1:~# mkdir -p /var/run/ceph/
root@ceph1:~# chown ceph:ceph /var/run/ceph/
```

```
root@ceph2:~# mkdir -p /var/run/ceph/
root@ceph2:~# chown ceph:ceph /var/run/ceph/
```

### 初始化 ceph（ceph1）

```
root@ceph1:~# cd /root/cluster
root@ceph1:~/cluster# ceph-deploy new ceph1
```

- 查看各文件夹内容

```
root@ceph1:~/cluster# ls
ceph-deploy-ceph.log  ceph.conf  ceph.mon.keyring
root@ceph1:~/cluster# ls /etc/ceph/
rbdmap
root@ceph1:~/cluster# ls /var/run/ceph/
```

### 配置 ceph.conf（ceph1）
```
root@ceph1:~/cluster# vim ceph.conf 
[global]
fsid = 3e15ecfe-d4fb-4d7b-ab6d-70ce1807244c
mon_initial_members = ceph1
mon_host = 172.20.1.7
auth_cluster_required = cephx
auth_service_required = cephx
auth_client_required = cephx

osd pool default size = 2
osd crush chooseleaf type = 0
osd max object name len = 256
osd journal size = 128

```

### 配置 mon（ceph1）
```
root@ceph1:~/cluster# ceph-deploy mon create-initial
...
[ceph_deploy.gatherkeys][DEBUG ] Got ceph.bootstrap-rgw.keyring key from ceph1.
```

### 配置 osd（ceph1）
```
root@ceph1:~/cluster# ceph-deploy osd prepare ceph1:/osd1 ceph2:/osd2
...
[ceph_deploy.osd][DEBUG ] Host ceph1 is now ready for osd use.
...
[ceph_deploy.osd][DEBUG ] Host ceph2 is now ready for osd use.
```

```
root@ceph1:~/cluster# ceph-deploy osd activate ceph1:/osd1 ceph2:/osd2
```

### 拷贝配置（ceph1，ceph2）
```
root@ceph1:~/cluster# ceph-deploy admin ceph1 ceph2
```

```
root@ceph1:~/cluster# chmod +r /etc/ceph/ceph.client.admin.keyring
root@ceph2:~/cluster# chmod +r /etc/ceph/ceph.client.admin.keyring
```

## 验证
### 查看版本
```
root@ceph1:~/cluster# ceph -v
ceph version 10.2.10 (5dc1e4c05cb68dbf62ae6fce3f0700e4654fdbbe)
```

### 检查 ceph 状态
```
root@ceph1:~/cluster# ceph -s
    cluster 3e15ecfe-d4fb-4d7b-ab6d-70ce1807244c
     health HEALTH_OK
     monmap e1: 1 mons at {ceph1=172.20.1.7:6789/0}
            election epoch 3, quorum 0 ceph1
     osdmap e10: 2 osds: 2 up, 2 in
            flags sortbitwise,require_jewel_osds
      pgmap v67: 64 pgs, 1 pools, 0 bytes data, 0 objects
            3783 MB used, 182 GB / 196 GB avail
                  64 active+clean

```

```
root@ceph2:~# ceph -s
    cluster 3e15ecfe-d4fb-4d7b-ab6d-70ce1807244c
     health HEALTH_OK
     monmap e1: 1 mons at {ceph1=172.20.1.7:6789/0}
            election epoch 3, quorum 0 ceph1
     osdmap e10: 2 osds: 2 up, 2 in
            flags sortbitwise,require_jewel_osds
      pgmap v71: 64 pgs, 1 pools, 0 bytes data, 0 objects
            3783 MB used, 182 GB / 196 GB avail
                  64 active+clean

```

### 使用 ceph 服务
#### 创建 rbd image
```
root@ceph1:~/cluster# rbd create foo --size 4096 --pool rbd --image-format=1
rbd: image format 1 is deprecated
```

> 检查
```
root@ceph1:~/cluster# rbd ls
foo
```

#### 挂载 rbd image

```
root@ceph1:~/cluster# rbd map foo
/dev/rbd0
```

> 检查

```
root@ceph1:~/cluster# fdisk -l
...
Disk /dev/rbd0: 4 GiB, 4294967296 bytes, 8388608 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 4194304 bytes / 4194304 bytes

```

#### 分区格式化
```
root@ceph1:~/cluster# mkfs.ext4 /dev/rbd0
mke2fs 1.42.13 (17-May-2015)
Discarding device blocks: done                            
Creating filesystem with 1048576 4k blocks and 262144 inodes
Filesystem UUID: 0921ff0b-d4a3-46eb-a7b3-59fe53019c36
Superblock backups stored on blocks: 
	32768, 98304, 163840, 229376, 294912, 819200, 884736

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information: done 

```

#### 挂载至文件夹
```
root@ceph1:~/cluster# mkdir -p /mnt/rbd
root@ceph1:~/cluster# mount /dev/rbd0 /mnt/rbd
```

> 检查
```
root@ceph1:~/cluster# df -ah
...
/dev/rbd0       3.9G  8.0M  3.6G   1% /mnt/rbd
```

```
root@ceph1:~/cluster# ls /mnt/rbd/
lost+found
```


#### 从文件夹卸载
```
root@ceph1:~/cluster# umount /mnt/rbd
```

> 检查
```
root@ceph1:~/cluster# df -ah
...
```

#### 卸载 rbd image
```
root@ceph1:~/cluster# rbd unmap foo
```

> 检查

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

#### 删除 rbd image
```
root@ceph1:~/cluster# rbd remove foo
Removing image: 100% complete...done.
```