---
title: "部署 Glusterfs 存储服务端"
---

> 此安装方法仅供测试 Kubesphere 存储服务端的搭建，搭建 Glusterfs 集群请参考 Glusterfs [官方网站](https://docs.gluster.org/en/latest/Install-Guide/Install/#for-ubuntu)，搭建 Heketi 请参考 [官方文档](https://github.com/heketi/heketi/blob/master/docs/admin/readme.md)

## 准备节点
主机规格

|Hostname        |IP     |OS       |CPU|RAM|Device|
|:---------------:|:------:|:------:|:---:|:--:|:--:|
|glusterfs-server1  |172.20.1.5|Ubuntu16.04.4| 4 Core|4 GB|/dev/vda 100GiB, /dev/vdc 300GiB|
|glusterfs-server2  |172.20.1.6|Ubuntu16.04.4| 4 Core|4 GB|/dev/vda 100GiB, /dev/vdc 300GiB|


```
  +-----------------------+               +-----------------------+
  |                       |               |                       |
  |   glusterfs-server1   |_______________|   glusterfs-server2   |
  |        heketi         |               |                       |
  |                       |               |                       |
  +-----------------------+               +-----------------------+
```

> 如需创建更大容量Glusterfs存储服务端，可挂载更大容量块存储磁盘至主机

## 安装步骤
- 将要安装Gluster 3.12.12
- Glusterfs服务端将数据存储至/dev/vdc块设备中，/dev/vdc必须是未经分区格式化的原始块设备

### 配置 root 账户登录（glusterfs-server1，glusterfs-server2）

- ubuntu账户登录主机后切换root账户
```
ubuntu@glusterfs-server1:~$ sudo -i
[sudo] password for ubuntu: 
root@glusterfs-server1:~# 
```

```
ubuntu@glusterfs-server2:~$ sudo -i
[sudo] password for ubuntu: 
root@glusterfs-server2:~# 
```

- 设置 root 账户登录密钥
```
root@glusterfs-server1:~# passwd
Enter new UNIX password: 
Retype new UNIX password: 
passwd: password updated successfully
```
```
root@glusterfs-server2:~# passwd
Enter new UNIX password: 
Retype new UNIX password: 
passwd: password updated successfully
```

### 修改 hosts 文件（glusterfs-server1，glusterfs-server2）

```
root@glusterfs-server1:~# vi /etc/hosts
...

# hostname loopback address
172.20.1.5  glusterfs-server1
172.20.1.6  glusterfs-server2
```

```
root@glusterfs-server2:~# vi /etc/hosts
...
# hostname loopback address
172.20.1.5  glusterfs-server1
172.20.1.6  glusterfs-server2
```


### 配置 glusterfs-server1 无密码登录至 glusterfs-server1 与 glusterfs-server2 （glusterfs-server1）
- 创建密钥，提示 “Enter passphrase” 时，直接回车，口令即为空
```
root@glusterfs-server1:~# ssh-keygen
...
```

- 拷贝密钥到各个 Glusterfs 节点，按照提示输入密钥
```
root@glusterfs-server1:~# ssh-copy-id root@glusterfs-server1
...
root@glusterfs-server1:~# ssh-copy-id root@glusterfs-server2
...
```

- 验证，glusterfs-server1 无需输入密码可以登录 glusterfs-server1，glusterfs-server2
```
root@glusterfs-server1:~# ssh root@glusterfs-server1
root@glusterfs-server1:~# ssh root@glusterfs-server2
```

### 安装 Glusterfs（glusterfs-server1，glusterfs-server2）
```
root@glusterfs-server1:~# apt-get install software-properties-common
root@glusterfs-server2:~# apt-get install software-properties-common
```

```
root@glusterfs-server1:~# add-apt-repository ppa:gluster/glusterfs-3.12
root@glusterfs-server2:~# add-apt-repository ppa:gluster/glusterfs-3.12
```

```
root@glusterfs-server1:~# apt-get update
root@glusterfs-server2:~# apt-get update
```

```
root@glusterfs-server1:~# apt-get install glusterfs-server -y
root@glusterfs-server2:~# apt-get install glusterfs-server -y
```

> 检查
```
root@glusterfs-server2:~# glusterfs -V
glusterfs 3.12.12
...
```

```
root@glusterfs-server2:~# glusterfs -V
glusterfs 3.12.12
...
```

### 加载内核模块（glusterfs-server1，glusterfs-server2）
```
root@glusterfs-server1:~# echo dm_thin_pool | sudo tee -a /etc/modules
dm_thin_pool
root@glusterfs-server1:~# echo dm_snapshot | sudo tee -a /etc/modules
dm_snapshot
root@glusterfs-server1:~# echo dm_mirror | sudo tee -a /etc/modules
dm_mirror
```

```
root@glusterfs-server2:~# echo dm_thin_pool | sudo tee -a /etc/modules
dm_thin_pool
root@glusterfs-server2:~# echo dm_snapshot | sudo tee -a /etc/modules
dm_snapshot
root@glusterfs-server2:~# echo dm_mirror | sudo tee -a /etc/modules
dm_mirror
```

```
root@glusterfs-server1:~# apt-get -y install thin-provisioning-tools
root@glusterfs-server2:~# apt-get -y install thin-provisioning-tools
```

### 创建Glusterfs集群（glusterfs-server1，glusterfs-server2）
```
root@glusterfs-server1:~# gluster peer probe glusterfs-server2
peer probe: success. 
```

```
root@glusterfs-server2:~# gluster peer probe glusterfs-server1
peer probe: success. Host glusterfs-server1 port 24007 already in peer list
```

> 检查
```
root@glusterfs-server1:~# gluster peer status
Number of Peers: 1

Hostname: glusterfs-server2
Uuid: aeccd9c9-0311-4133-9f0a-80d4a04c8b49
State: Peer in Cluster (Connected)
```

```
root@glusterfs-server2:~# gluster peer status
Number of Peers: 1

Hostname: glusterfs-server1
Uuid: 746e4e7f-6f5b-4303-aeeb-f6bef84e7e29
State: Peer in Cluster (Connected)
```

```
root@glusterfs-server1:~# systemctl status glusterd
root@glusterfs-server2:~# systemctl status glusterd
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

- 将Heketi纳入systemd管理
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
