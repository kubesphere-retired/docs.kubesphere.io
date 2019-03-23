---
title: "All-in-One"
---

For those who are new to KubeSphere Advanced Edition and looking for the fastest way to install and experience the new features, the all-in-one mode must be your best choice since it supports one-click installation. Just follow the steps below to get started.

### Prerequisites

- Please download [KubeSphere Advanced Edition 1.0.1](https://kubesphere.io/download/?type=advanced) to the target machine.
- It is recommended to use the storage services which are recommended by KubeSphere and prepare the corresponding storage servers. If you are not prepare the storage servers yet, you can also use [Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) as the default storage only for testing installation.

#### Step 1: Provision Linux Host

The following section identifies the hardware specifications and system-level requirements of one host for installation. To get started with all-in-one mode, you may need to prepare only one host refer to the following specification. For `ubuntu 16.04` OS, it's recommended to select the latest `16.04.5`.

##### Hardware Recommendations

| System | Minimum Requirements |  Recommendations |
| --- | --- | --- |
| CentOS 7.5 (64 bit) | CPU：4 Core <br/> Memory：8 G <br/> Disk Space：100 G | CPU：8 Core <br/> Memory：16 G <br/> Disk Space：Not less than 100 G |
| Ubuntu 16.04/18.04 LTS (64 bit) | CPU：4 Core <br/> Memory：8 G <br/> Disk Space：100 G | CPU：8 Core <br/> Memory：16 G <br/> Disk Space：Not less than 100 G  |
| Red Hat Enterprise Linux Server 7.4 (64 bit) | CPU：4 Core <br/> Memory：8 G <br/> Disk Space：100 G | CPU：8 Core <br/> Memory：16 G <br/> Disk Space：Not less than 100 G  |
| Debian Stretch 9.5 (64 bit) | CPU：4 Core <br/> Memory：8 G <br/> Disk Space：100 G | CPU：8 Core <br/> Memory：16 G <br/> Disk Space：Not less than 100 G  |

####  Step 2: Provision Installation Files

**1.**  Download [KubeSphere Installer](https://kubesphere.io/download/?type=advanced), suggest you to download the installer via command like `curl -O url` or `wget url` with download link. When you get the installer, execute following command to unzip it. 

```
  $ tar -zxf kubesphere-all-advanced-1.0.1.tar.gz
```

**2.** Go into “`kubesphere-all-advanced-1.0.1`” folder

```
  $ cd kubesphere-all-advanced-1.0.1
```

####  Step 3: Get Started With Installation

The environment and file monitoring, dependent software installation of KubeSphere, automated installation of Kubernetes and etcd, and automated storage configuration, Kubernetes v1.12.3 will be installed by default. All of these procedures will be automatically processing in this installation. The KubeSphere installer will automatically install the relevant dependent software like Ansible (v2.4+)，Python-netaddr (v0.7.18+) and Jinja (v2.9+) as well.

**Note:**

> - Generally, you can install it directly without any modification.
> - If you would like to customize the configuration parameters, such as network, storage classes, etc. You will be able to specify the parameters in  `vars.yml`. Otherwise it will be executed with default parameters without any modifications.
> - Network：KubeSphere supports `calico` by default.
> - All-in-One uses local storage as the storage class by default. Since local storage does not support dynamic provisioning, users may need to create a persistent volume (PV) in advance when creating volumes in the KubeSphere console if PVs is insufficient, installer also pre-creates 10 available 10G PVs for testing.
> - Supported Storage Classes：[QingCloud Block Storage](https://www.qingcloud.com/products/volume/)、[QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/)、[GlusterFS](https://www.gluster.org/)、[CephRBD](https://ceph.com/)、[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs)、[Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local). For details regarding storage configuration, please refer to [Storage Configuration Instructions](https://docs.kubesphere.io/advanced-v1.0/zh-CN/installation/storage-configuration/) 
> - Since the default subnet for Cluster IPs is 10.233.0.0/18, default subnet for Pod IPs is 10.233.64.0/18 in Kubernetes cluster. The node IPs must not overlap with those 2 default IPs. If any conflicts happened with the IP address, go to `conf/vars.yaml` and modify `kube_service_addresses` or `kube_pods_subnet` to avoid this senario.


**Attention**

Notice that if you choose to use the default Calico network plugin for installation on the cloud platform, and the host is running directly on the Base network, you need to add an ipip protocol for the source IP (IP/port collection) in firewall rules, for example in QingCloud platform adds firewall ipip protocol:

![ipip 协议](/ipip-protocol-en.png)


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