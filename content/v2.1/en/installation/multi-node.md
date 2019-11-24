---
title: "Multi-node Installation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

`Multi-Node` installation enables install KubeSphere on multiple instances. Typically, select any one host in the cluster to serve as a role of "taskbox" to execute the installation task for other hosts before multi-node installation, `SSH Communication` is required to be established between "taskbox" and other hosts.

<!-- <asciinema-player src="/multi-node.json" cols="99" rows="41"></asciinema-player>
 -->

 <font color=red>KubeSphere has decoupled some core feature components in v2.1.0, these components are designed to be pluggable and support enabling them before or after installation. By default, installer will trigger minimal installation if you don't enable pluggable components. See [Enable Pluggable Components Installation](../pluggable-components) for pluggable components installation guide.</font>


## Prerequisites

Disable and stop the firewall, or you are supposed to allow traffic through some specific ports in your host firewall, see [Port Requirements](../port-firewall).

## Step 1: Provision Linux Host

The following section identifies the hardware specifications and harware requirements of hosts for installation. To get started with multi-node installation, you need to prepare at least `3` hosts according to the following specification.

> - Time synchronization is required across all nodes, otherwise the installation may not succeed;
> - For `ubuntu 16.04` OS, it's recommended to select  `16.04.5`;
> - If you are using `ubuntu 18.04`, you need to use `root`;
> - If the Debian system does not have the sudo command installed, you need to execute `apt update && apt install sudo` command using root before installation.
> - If you select 3rd party software (GitLab and Harbor), the total memory of all nodes is required `at least 24 GiB`.
> - If you choose offline installation, ensure your disk is at least 100 G.

### Hardware Recommendations

| System | Minimum Requirements (Each node) |
| --- | --- |
| CentOS 7.5 (64 bit) | CPU：2 Core， Memory：4 G， Disk Space：40 G  |
| Ubuntu 16.04/18.04 LTS (64 bit) | CPU：2 Core， Memory：4 G， Disk Space：40 G  |
| Red Hat Enterprise Linux Server 7.4 (64 bit) | CPU：2 Core， Memory：4 G， Disk Space：40 G  |
| Debian Stretch 9.5 (64 bit)| CPU：2 Core， Memory：4 G， Disk Space：40 G  |



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


**1.** Download `KubeSphere 2.1.0` to the target machine, then enter into `conf`.

```bash
$ curl -L https://kubesphere.io/download/stable/v2.1.0 > installer.tar.gz \
&& tar -zxf installer.tar.gz && cd kubesphere-all-v2.1.0/conf
```


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


## Step 3: Install KubeSphere

> Note:
> - Generally, you can install KubeSphere without any modification, it will trigger minimal installation by default.
> - If you want to enable pluggable feature components installation, modify common.yaml and reference [Enable Pluggable Components Installation](../pluggable-components).
> - Installer uses [Local volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) based on [openEBS](https://openebs.io/) to provide storage service with dynamic provisioning, for production environments, please [configure supported persistent storage service](../storage-configuration).
> - Since the default subnet for Cluster IPs is 10.233.0.0/18, default subnet for Pod IPs is 10.233.64.0/18 in Kubernetes cluster. The node IPs must not overlap with those 2 default IPs. If any conflicts happened with the IP address, go to `conf/common.yaml` and modify `kube_service_addresses` or `kube_pods_subnet` to avoid this senario.

**1.** Enter into `scripts` folder, it's recommended to execute `install.sh` using `root` user:

```bash
$ cd scripts
$ ./install.sh
```

**2.** Enter 2 to select multi-node mode to trigger, the installer will prompt if your environment meets some prerequisites. If already meet please type yes to install. If not, please enter "no", then return to configure and verify them.

```bash
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2019-11-15
################################################
Please input an option: 2

```

**3.** Verify the multi-node installation：

**(1).** If you can see the following "Successful" result after `install.sh` completed, congratulation!

```bash
successsful!
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.1:30880
Account: admin
Password: P@88w0rd

NOTE：Please modify the default password after login.
#####################################################
```


> Note: If you need to view the above interface, execute `cat kubesphere/kubesphere_running`.

**(2).** Access KubeSphere console with `http://{$IP}:30880` in your browser, you can use default account and password `admin / P@88w0rd` to log in to console. Please change the default password after logging in.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191017172215.png)

<font color=red>Note: After log in to console, please verify the monitoring status of service components in the "Cluster Status". If the service is not ready, please wait patiently. You can start to use when all components are totally ready.</font>

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191125003158.png)


## FAQ

KubeSphere has run the deployment test on Aliyun, Tencent cloud, Huawei cloud, Qingcloud and AWS. For test results and relevant solutions, please refer to [Multiple Cloud Platform Installation Testing Result](https://github.com/kubesphere/ks-installer/issues/23). If you have other installation problems, please submit on [GitHub](https://github.com/kubesphere/kubesphere/issues).
