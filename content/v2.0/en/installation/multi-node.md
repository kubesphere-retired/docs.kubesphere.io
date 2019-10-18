---
title: "Multi-node Installation"
keywords: ''
description: ''
---

`Multi-Node` installation enables install KubeSphere on multiple instances. Typically, select any one host in the cluster to serve as a role of "taskbox" to execute the installation task for other hosts before multi-node installation, `SSH Communication` is required to be established between "taskbox" and other hosts.

## Preview Installation Demo

<asciinema-player src="/multi-node.json" cols="99" rows="41"></asciinema-player>



## Prerequisites

- Suggest you to disable and stop the firewall, or you have to explicitly allow traffic through some specific ports in your host firewall, see [Port Requirements](../port-firewall)
- It's recommended to use the storage services which are recommended by KubeSphere and prepare the corresponding storage server. 

## Step 1: Provision Linux Host

The following section identifies the hardware specifications and harware requirements of hosts for installation. To get started with multi-node installation, you need to prepare at least `3` hosts according to the following specification. 

> - Time synchronization is required across all nodes, otherwise the installation may not succeed;
> - For `ubuntu 16.04` OS, it's recommended to select  `16.04.5`;
> - If you are using `ubuntu 18.04`, you need to use `root`;
> - If the Debian system does not have the sudo command installed, you need to execute `apt update && apt install sudo` command using root before installation.
> - If you select 3rd party software (GitLab and Harbor), the total memory of all nodes is required `at least 24 GiB`.
> - If you choose offline installation, ensure your disk is at least 100 G.

### Hardware Recommendations

| System | Minimum Requirements (Total) |
| --- | --- |
| CentOS 7.5 (64 bit) | CPU：8 Core +, Memory：16 G +, Disk Space：40 G + |
| Ubuntu 16.04/18.04 LTS (64 bit) | CPU：8 Core +, Memory：16 G +, Disk Space：40 G + |
| Red Hat Enterprise Linux Server 7.4 (64 bit) | CPU：8 Core +, Memory：16 G +, Disk Space：40 G + |
| Debian Stretch 9.5 (64 bit) | CPU：8 Core +, Memory：16 G +, Disk Space：40 G + |


> - KubeSphere can be installed on any cloud platform.
> - The installation speed can be accelerated by adjusting the bandwidth.

The following section describes an example to introduce multi-node installation. This example showing 3 hosts installation that "master" serves as the taskbox to execute the installation. The KubeSphere cluster architecture consists of management nodes (Master) and working nodes (Node), the following cluster consists of one Master and two Nodes. Assume that the host information as following table showing:

> Note: KubeSphere supports the high-availability configuration of the Master and etcd nodes, see [Creating Highly Available Master and Etcd Cluster](../master-etcd-ha) for installing highly available cluster.

| Host IP | Host Name | Role |
| --- | --- | --- |
|192.168.0.1|master|master, etcd|
|192.168.0.2|node1|node|
|192.168.0.3|node2|node|


### Cluster Architecture

**Single master, Single etcd, Double nodes**

![Architecture](/cluster-architecture.svg)

## Step 2: Provision Installation Files


<div class="md-tabs">
<input type="radio" name="tabs" id="stable" checked="checked">
<label for="stable">Online Installation (2.0.2)</label>
<span class="md-tab">

**1.** Download `KubeSphere 2.0.2` to the target machine, then enter into `conf`.

```bash
$ curl -L https://kubesphere.io/download/stable/advanced-2.0.2 > advanced-2.0.2.tar.gz && tar -zxf advanced-2.0.2.tar.gz && cd kubesphere-all-advanced-2.0.2/conf
```

</span>
<input type="radio" name="tabs" id="offline">
<label for="offline">Offline Installation (2.0.2)</label>
<span class="md-tab">

**1.** Download `KubeSphere 2.0.2 for Offline Installation` to the target machine, then enter into `conf`.

```bash
$ curl -L https://kubesphere.io/download/offline/advanced-2.0.2 > advanced-2.0.2.tar.gz && tar -zxf advanced-2.0.2.tar.gz && cd kubesphere-all-offline-advanced-2.0.2/conf
```

</span>
</div>

**2.** Please refer to the following scripts to configure all hosts in `hosts.ini`. It's recommneded to install using root user, here showing an example configuration in `CentOS 7.5` using root user. Note that each host information occupies one line and cannot be wrapped manually.

> Note:
> - If installer is ran from non-root user account who has sudo privilege already, then you need to reference the example section that is commented out in `conf/hosts.ini`.
> - If the `root` user can't establish SSH connection with other machines in taskbox, you need to refer to the `non-root` user example at the top of the `conf/hosts.ini`, but it's recommended to switch `root` user when executing `install.sh`.
> - Master, node1 and node2 are the host names of each node and all host names should be in lowercase.

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

**Note：** <br/>

> - Each node's parameters like IP and its password needs to be modified with actual values in `[all]` section. In this example, since "master" served as `taskbox` which has been ssh connected from your local, no need to add password field.
> - Other nodes like "node1" and "node2", both `ansible_host` and `ip` need to be replaced by actual Internal IP, and `"ansible_ssh_pass"` should be replaced with the SSH password.
> - "master" is served as the taskbox to execute installation task for whole cluster, as well as the role of master and etcd, so "master" needs to be filled into `[kube-master]` and `[etcd]` section.
> - At the same time, for "node1" and "node2", both serve the role of `Node` as well, so their hosts name need to be filled in `[kube-node]` section.
> 
> Parameters Specification:
> 
> - `ansible_connection`: Connection type to the host, set to local here means local connection.
> - `ansible_host`: The name of the host to be connected.
> - `ip`: The ip of the host to be connected.
> - `ansible_user`: The default ssh user name to use.
> - `ansible_become_pass`: Allows you to set the privilege escalation password.
> - `ansible_ssh_pass`: The password of the host to be connected using root.


**3.** It's recommended to use the storage services recommended by KubeSphere and prepare the corresponding storage server. Accordingly, you need to modify the storage class parameters in `conf/vars.yml`. In this installation demo, we just use NFS as storage class which provides the persistent storage service. See [Storage Configuration Instructions](../storage-configuration) for more details regarding the supported storage class.

**vars.yml** 

```yaml
# LOCAL VOLUME
local_volume_enabled: false
local_volume_is_default_class: false
local_volume_storage_class: local

# NFS CONFIGURATION
# KubeSphere can use existing nfs service as backend storage.
# change to true to use nfs.
nfs_client_enabled: true
nfs_client_is_default_class: true

# Hostname of the NFS server(ip or hostname)
nfs_server: 192.168.0.5

# Basepath of the mount point
nfs_path: /mnt/shared_dir
```

> Note: Since the default subnet for Cluster IPs is 10.233.0.0/18, default subnet for Pod IPs is 10.233.64.0/18 in Kubernetes cluster. The node IPs must not overlap with those 2 default IPs. If any conflicts happened with the IP address, go to `conf/vars.yaml` and modify `kube_service_addresses` or `kube_pods_subnet` to avoid this senario.

## Step 3: Get Started With Installation

All of these procedures will be automatically processing in this installation, such as the environment and file monitoring, installation of Kubernetes and etcd, and storage and network configuration, Kubernetes `v1.13.5` will be installed by default.

> Since Multi-node installation duration is related to network conditions and bandwidth, machine configuration and the number of nodes, it's hard to give a standard duration. 

**1.** Enter into `scripts` folder, it's recommended to execute `install.sh` using `root` user::

```bash
$ cd scripts
$ ./install.sh
```

**2.** Enter 2 to select multi-node mode to trigger, the installer will prompt if you have configured the storage or not. If already set please type yes to install. If not, please enter "no", then return to configure the storage, see [Storage Configuration Instruction](../storage-configuration).

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2019-10-15
################################################
Please input an option: 2

```

**4.** Verify the multi-node installation：

**(1).** If you can see the following "Successful" result after `install.sh` completed, that means KubuSphere installation is ready. 

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


> Note: If you need to view the above interface, execute `cat kubesphere/kubesphere_running`.

**(2).** After installation, visit according URL such as `http://{$IP}:30880`, you can access to KubeSphere login page. You can use default account and password to log in to the KubeSphere console. Please change the default password after logging in. Please refer to the [KubeSphere Quick Start](../../quick-start/admin-quick-start) to master KubeSphere.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017172215.png)

> Attention: After logging into the console, please verify the service components' monitoring status in the "Cluster Status". Once all the components‘ startups have completed, the console can be used. Generally, all the service components complete their startup in 15 minutes.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017170937.png)


## FAQ

KubeSphere has run the deployment test on Aliyun, Tencent cloud, Huawei cloud, Qingcloud and AWS. For test results and relevant solutions, please refer to [Multiple Cloud Platform Installation Testing Result](https://github.com/kubesphere/ks-installer/issues/23). Besides, we have arranged related solutions to common installation issues in the [Common Installation Issues](https://kubesphere.io/docs/advanced-v2.0/zh-CN/faq/faq-install/). If you have other installation problems, please submit on [GitHub](https://github.com/kubesphere/kubesphere/issues). 