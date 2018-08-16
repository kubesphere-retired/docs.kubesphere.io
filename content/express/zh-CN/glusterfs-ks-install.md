---
title: "部署 Glusterfs 存储服务端"
---

[Glusterfs](https://www.gluster.org/) 是一个开源的分布式文件系统，具有强大的横向扩展能力，通过扩展能够支持数PB存储容量和处理数千客户端。Glusterfs 具有高扩展性和高性能，基于可堆叠的用户空间设计，可为各种不同的数据负载提供优异的性能。并且具备高可用性，从而确保数据总是可以访问。本指南将介绍如何在 Ubuntu 系统部署一个节点数为 2 的 Glusterfs (v3.12.12) 存储服务端集群和 Heketi，Heketi 用来管理 Glusterfs，并提供 RESTful API 接口供 Kubernetes 调用。本指南仅供测试 KubeSphere 存储服务端的搭建，正式环境搭建 Glusterfs 集群请参考 [Glusterfs 官方网站](https://docs.gluster.org/en/latest/Install-Guide/Install/#for-ubuntu)，搭建 Heketi 请参考 [官方文档](https://github.com/heketi/heketi/blob/master/docs/admin/readme.md)。

## 准备节点
主机规格

|Hostname           |IP        |OS            |CPU|RAM|Device|
|-------------------|----------|--------------|---|---|------|
|glusterfs-server1  |172.20.1.5|Ubuntu 16.04.4| 4 Core|4 GB|/dev/vda 100GiB, /dev/vdc 300GiB|
|glusterfs-server2  |172.20.1.6|Ubuntu 16.04.4| 4 Core|4 GB|/dev/vda 100GiB, /dev/vdc 300GiB|

> 注：
> - `glusterfs-server1` 作为集群的管理主机，用来执行安装任务。
> - 如需创建更大容量 Glusterfs 存储服务端，可挂载更大容量块存储磁盘至主机。
> - 两个节点的 Hostname 需要与主机规格的列表中一致，因为后续步骤的命令行中有匹配到 Hostname，若与以上列表不一致请注意在后续的命令中对应修改成实际的 Hostname。
> - Glusterfs 服务端将数据存储至 `/dev/vdc` 块设备中，`/dev/vdc` 必须是未经分区格式化的原始块设备。

```
  +-----------------------+               +-----------------------+
  |                       |               |                       |
  |   glusterfs-server1   |_______________|   glusterfs-server2   |
  |        heketi         |               |                       |
  |                       |               |                       |
  +-----------------------+               +-----------------------+
```



## 预备工作
### 配置 root 登录

1、参考如下步骤分别为 glusterfs-server1 和 glusterfs-server2 配置 root 用户登录：

- 1.1. ubuntu账户登录主机后切换root账户

```
ubuntu@glusterfs-server1:~$ sudo -i
[sudo] password for ubuntu: 
root@glusterfs-server1:~# 
```
- 同上，在 glusterfs-server2 执行以上命令。


- 1.2. 设置 root 用户户登录密钥

```
root@glusterfs-server1:~# passwd
Enter new UNIX password: 
Retype new UNIX password: 
passwd: password updated successfully
```
- 同上，在 glusterfs-server2 执行以上命令。

### 修改 hosts 文件

2、参考如下步骤修改 glusterfs-server1 和 glusterfs-server2 的 `hosts` 文件：

```
root@glusterfs-server1:~# vi /etc/hosts
...

# hostname loopback address
172.20.1.5  glusterfs-server1
172.20.1.6  glusterfs-server2
```
- 同上，在 glusterfs-server2 执行以上命令并修改 hosts。


### 配置 SSH 免密登录
3、以下为 glusterfs-server1 的 root 用户配置无密码登录至 glusterfs-server1 与 glusterfs-server2。

- 3.1. 创建密钥，提示 “Enter passphrase” 时，直接回车，口令即为空：

```
root@glusterfs-server1:~# ssh-keygen
...
```

- 3.2. 拷贝密钥到各个 Glusterfs 节点，按照提示输入密钥：

```
root@glusterfs-server1:~# ssh-copy-id root@glusterfs-server1
...
root@glusterfs-server1:~# ssh-copy-id root@glusterfs-server2
...
```

- 3.3. 验证免密登录，即 glusterfs-server1 无需输入密码可以登录 glusterfs-server1 和 glusterfs-server2：

```
root@glusterfs-server1:~# ssh root@glusterfs-server1
root@glusterfs-server1:~# ssh root@glusterfs-server2
```

##开始安装
### 安装 Glusterfs
4、以下用 `apt-get` 软件包管理工具在 glusterfs-server1 安装 Glusterfs：
```
root@glusterfs-server1:~# apt-get install software-properties-common
```
```
root@glusterfs-server1:~# add-apt-repository ppa:gluster/glusterfs-3.12
```
```
root@glusterfs-server1:~# apt-get update
```
```
root@glusterfs-server1:~# apt-get install glusterfs-server -y
```
- 同上，在 glusterfs-server2 执行以上命令安装 Glusterfs。待安装完成后分别在两个节点检查安装的 Glusterfs 版本：

```
$ glusterfs -V
glusterfs 3.12.12
...
```


### 加载内核模块
5、执行以下步骤为 glusterfs-server1 加载内核模块：
```
root@glusterfs-server1:~# echo dm_thin_pool | sudo tee -a /etc/modules
dm_thin_pool
root@glusterfs-server1:~# echo dm_snapshot | sudo tee -a /etc/modules
dm_snapshot
root@glusterfs-server1:~# echo dm_mirror | sudo tee -a /etc/modules
dm_mirror
```

```
root@glusterfs-server1:~# apt-get -y install thin-provisioning-tools
```
- 同上，在 glusterfs-server2 执行以上命令。

### 创建 Glusterfs 集群
6、参考如下步骤创建 Glusterfs 集群:

```
root@glusterfs-server1:~# gluster peer probe glusterfs-server2
peer probe: success. 
```

```
root@glusterfs-server2:~# gluster peer probe glusterfs-server1
peer probe: success. Host glusterfs-server1 port 24007 already in peer list
```

- 分别在 glusterfs-server1 和 glusterfs-server2 检查 glusterfs 集群节点间的连接状态，若 State 显示 `Peer in Cluster (Connected)` 则说明 glusterFS 集群已成功搭建：

```
$ gluster peer status
```



### 安装Hekeit（glusterfs-server1）

- 下载Hekeit

```
root@glusterfs-server1:~# wget https://github.com/heketi/heketi/releases/download/v7.0.0/heketi-v7.0.0.linux.amd64.tar.gz
```

- 安装Heketi

```
root@glusterfs-server1:~# tar -xf heketi-v7.0.0.linux.amd64.tar.gz
root@glusterfs-server1:~# cd heketi/
root@glusterfs-server1:~/heketi# cp heketi /usr/bin/
root@glusterfs-server1:~/heketi# cp heketi-cli /usr/bin
```

### 配置Heketi（glusterfs-server1）

- 将Heketi纳入 systemd 管理

```
root@glusterfs-server1:~# vi /lib/systemd/system/heketi.service
[Unit]
Description=Heketi Server
[Service]
Type=simple
WorkingDirectory=/var/lib/heketi
ExecStart=/usr/bin/heketi --config=/etc/heketi/heketi.json
Restart=on-failure
StandardOutput=syslog
StandardError=syslog
[Install]
WantedBy=multi-user.target
```

- 创建文件夹

```
root@glusterfs-server1:~# mkdir -p /var/lib/heketi
root@glusterfs-server1:~# mkdir -p /etc/heketi
```

- 创建Heketi配置文件

> jwt.admin.key可配置

```
root@glusterfs-server1:~# vim /etc/heketi/heketi.json
{
  "_port_comment": "Heketi Server Port Number",
  "port": "8080",

  "_use_auth": "Enable JWT authorization. Please enable for deployment",
  "use_auth": false,

  "_jwt": "Private keys for access",
  "jwt": {
    "_admin": "Admin has access to all APIs",
    "admin": {
      "key": "123456"
    },
    "_user": "User only has access to /volumes endpoint",
    "user": {
      "key": "123456"
    }
  },

  "_glusterfs_comment": "GlusterFS Configuration",
  "glusterfs": {
    "_executor_comment": [
      "Execute plugin. Possible choices: mock, ssh",
      "mock: This setting is used for testing and development.",
      "      It will not send commands to any node.",
      "ssh:  This setting will notify Heketi to ssh to the nodes.",
      "      It will need the values in sshexec to be configured.",
      "kubernetes: Communicate with GlusterFS containers over",
      "            Kubernetes exec api."
    ],
    "executor": "ssh",

    "_sshexec_comment": "SSH username and private key file information",
    "sshexec": {
      "keyfile": "/root/.ssh/id_rsa",
      "user": "root"
    },

    "_kubeexec_comment": "Kubernetes configuration",
    "kubeexec": {
      "host" :"https://kubernetes.host:8443",
      "cert" : "/path/to/crt.file",
      "insecure": false,
      "user": "kubernetes username",
      "password": "password for kubernetes user",
      "namespace": "OpenShift project or Kubernetes namespace",
      "fstab": "Optional: Specify fstab file on node.  Default is /etc/fstab"
    },

    "_db_comment": "Database file name",
    "db": "/var/lib/heketi/heketi.db",
    "brick_max_size_gb" : 1024,
	"brick_min_size_gb" : 1,
	"max_bricks_per_volume" : 33,


    "_loglevel_comment": [
      "Set log level. Choices are:",
      "  none, critical, error, warning, info, debug",
      "Default is warning"
    ],
    "loglevel" : "debug"
  }
}

```

### 启动Heketi（glusterfs-server1）

```
root@glusterfs-server1:~# systemctl start heketi
root@glusterfs-server1:~# systemctl status heketi
● heketi.service - Heketi Server
   Loaded: loaded (/lib/systemd/system/heketi.service; disabled; vendor preset: enabled)
   Active: active (running) since Tue 2018-08-14 13:50:18 CST; 9ms ago
 Main PID: 6854 (heketi)
    Tasks: 4
   Memory: 1.3M
      CPU: 3ms
   CGroup: /system.slice/heketi.service
           └─6854 /usr/bin/heketi --config=/etc/heketi/heketi.json

Aug 14 13:50:18 glusterfs-server1 systemd[1]: Started Heketi Server.
root@glusterfs-server1:~# systemctl enable heketi
Created symlink from /etc/systemd/system/multi-user.target.wants/heketi.service to /lib/systemd/system/heketi.service.
```

### 编辑拓扑文件（glusterfs-server1）
> 9,12,18,25,28,34行需要按实际情况修改

```
root@glusterfs-server1:~# vim /etc/heketi/topology.json 
  {
    "clusters": [
       {
         "nodes": [
           {
             "node": {
               "hostnames": {
                 "manage": [
                   "172.20.1.5"
                ],
                "storage": [
                  "172.20.1.5"
                ]
              },
              "zone": 1
            },
            "devices": [
              "/dev/vdc"
            ]
          },
          {
            "node": {
              "hostnames": {
                "manage": [
                  "172.20.1.6"
                ],
                "storage": [
                  "172.20.1.6"
                ]
              },
              "zone": 1
            },
            "devices": [
              "/dev/vdc"
            ]
          }
        ]
      }
    ]
  }

```

### 载入拓扑文件（glusterfs-server1）

```
root@glusterfs-server1:~# export HEKETI_CLI_SERVER=http://localhost:8080
root@glusterfs-server1:~# heketi-cli topology load --json=/etc/heketi/topology.json
```

> 验证
```
heketi-cli node list
```
