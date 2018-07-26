---
title: KubeSphere Installation Guide
---


# KubeSphere Installation Guide



## Intro to KubeSphere


This guide is for [KubeSphere](https://kubesphere.io) Express Edition installation scenario.
KubeSphere  is an **enterprise-level distributed container management platform**, built on [Kubernetes](https://kubernetes.io), which is a powerful production-grade container orchestration system.   
KubeSphere provides users with easy-to-use interface and wizard design, as well as the full-stack container deployment and management platform in prodcution environment.

## KubeSphere Installation


KubeSphere supports both `all-in-one` and `multi-node` mode to meet your installation demands. KubeSphere adopts [Ansible](www.ansible.com)  to realize centralized management configuration on the  target machine(s), as well as deployment procedures automation.
With pre-configured templates, you are able to pre-configure the deployment procedures by customizing related configuration files before deployment, which means it is able to adapt to different IT environments and help you to deploy KubeSphere in a quick way.

- There are two roles of management node and compute node due to different  deployment services in the KubeSphere cluster.
- The node serves the role of both management and compute when installing all-in-one mode for single-node deployment.
- You are able to set the cluster role in the configuration file when deploying a multi-node cluster.
- Since the operating system needs to be updated in the deployment process and the image is pulled from the image registry, it must be able to access the  network.

###  All-in-One Mode


`All-in-One` mode means single node deployment, can be deployed to a single host for a test or development environment only, it is just recommended to get familiar with installation process or learn about KubeSphere features by following with all-in-one mode installation, which means it can help you to get KubeSphere platform up and running to try out for the first time.  All-in-one mode is not considered a production environment. For formal environment, it is recommended to select `multi-node` instead.


#### Step 1: Provision Linux Host

##### Prerequisites

The following section identifies the hardware specifications and system-level requirements of one host within KubeSphere platform environment. To get started with all-in-one mode, you may need to prepare only one host refer to the following specification.

##### Hardware Recommendations

| System | Minimum Requirements |  Recommendations |
| --- | --- | --- |
| ubuntu 16.04 LTS 64bit | CPU：8 Core <br/> Memory：12G <br/> Disk Space：40G | CPU：16 Core <br/> Memory：32G <br/> Disk Space：100G |




####  Step 2: Provision Installation Files

**1.**  Download [KubeSphere Installer](https://drive.yunify.com/s/nI0A2NfFQNywsbU)


**2.**  When you get the installation package, please execute following command to unzip the package.

```
  $ tar -zxvf kubesphere-all-express-1.0.0-alpha.tar.gz
```

**3.** Go into “`kubesphere-all-express-1.0.0-alpha`” folder

```
  $ cd kubesphere-all-express-1.0.0-alpha
```

 


####  Step 3: Get Started With Deployment



The environment and file monitoring, dependent software installation of KubeSphere, automated installation of Kubernetes and etcd, and automated storage configuration, all of these procedures will be automatically processing in this deployment. The KubeSphere installation package will automatically install the relevant dependent software like Ansible (v2.4+)，Python-netaddr (v0.7.18+) and Jinja (v2.9+).



> - Generally, you can install it directly without any modification.

> - If you would like to customize the configuration parameters, such as network, storage classes, etc. You will be able to specify the parameters in  `vars.yml`. Otherwise it will be executed with default parameters without any modifications**

> - Network：KubeSphere supports `calico` by default**

> - Supported Storage Classes：`GlusterFS、CephRBD、local\_volume(Default)`. For details on storage configuration, please refer to [Storage Configuration Instructions](#storage-configuration-instructions)

> - All-in-One uses local storage as the storage class by default. Since local storage does not support dynamic provisioning, users may need to create a persistent volume (PV) in advance when creating volumes in the KubeSphere console, installer pre-creates 8 available 10G PVs for testing.




The current system is Ubuntu 16.04. It is recommended to use ubuntu as default user to complete following steps.

**1.** Go into `scripts`

```
$ cd scripts
```

**2.** Execute `install.sh`：

```
$ ./install.sh
```

**3.** Enter`1` to select `all-in-one` mode to start：

```
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2018-07-27
################################################
Please input an option: 1

```


**Attention：** <br/>



**4.** Test KubeSphere all-in-one mode Deployment：

**(1).**If you can see the following "Successful" result being returned after `install.sh` completed, that means KubuSphere installation is ready.

```
PLAY RECAP ***************************************
KubeSphere     : ok=69 changed=68 unreachable=0 
failed=0
Succesful!
##################################################
KubeSphere is running！
Matser IP: 121.10.121.111
ks-console-nodeport: 32117
ks-apiserver-nodeport: 32002
##################################################
```

**(2).**Then you will be able to access KubeSphere login page with the IP address of the host and correct port. The port number will be automatically generated in the result page as above screenshot showing "ks-console-nodeport. Then you will be able to access the KubeSphere web via EIP and port forwarding. **Example**： [http://139.198.121.143:8080](http://139.198.121.143:8080)
<br/>
![](images/pic02.png)

####  Summary
When KubeSphere is deployed successfully ，you will be able to follow with [*"<u>KubeSphere User Guide</u>"*](https://kubesphere.qingcloud.com)，then log in to KubeSphere and learn how to get started with it！




###  Multi-node Mode

`Multi-node` mode means multiple nodes deployment, for example, single or multiple `master(s)`, multiple `nodes`, single or multiple  `etcd` node(s). it is recommended to prepare at least `2` nodes and deploy to production environment. Typically, select any one host in the cluster being served as a role of "`taskbox`" to execute installation task for other hosts before multi-node deployment,  "`SSH Communication`" is required to be established between "taskbox" and other hosts.




#### Step 1: Provision Linux Host

##### Prerequisites

The following section identifies the hardware specifications and system-level requirements of hosts within KubeSphere platform environment. To get started with multi-node mode, you may need to prepare at least `2` hosts refer to the following specification.

##### Hardware Recommendations


| Operating System | Minimum Requirements |  Recommendations |
| --- | --- | --- |
| ubuntu 16.04 LTS 64bit | CPU：8 Core <br/> Memory：12 G <br/> Disk Space：40 G | CPU：16 Core <br/> Memory：32 G <br/> Disk Space：100 G |



The following section describes an example to introduce multi-node mode deployment. This example prepares 3 hosts, with the host name "master" serve as the taskbox, and the host name of each node can be customized by the user. Assume that the host information as following table showing:

| Host IP | Host Name | Role |
| --- | --- | --- |
|192.168.0.10|master|master, etcd, node|
|192.168.0.20|node1|node|
|192.168.0.30|node2|node|



##### Cluster Architecture

Single master, Single etcd, Multiple nodes
![](images/pic04_en.png)



**Note:**  <br/>

> etcd is a distributed key value store that provides a reliable way to store data across a cluster of machines. The number of etcd node is required at least one. For high availability, it is recommended to deploy multiple etcd nodes, which can makes the Kubernetes cluster more reliable. The number of etcd nodes is recommended to be set to `odd number`. KubeSphere Express Edition just temporarily supports single etcd, we are going to support multiple etcd in the next Advanced Edition soon.




####  Step 2: Provision Installation Files


**1.**  Download [KubeSphere Installer](https://drive.yunify.com/s/nI0A2NfFQNywsbU)



**2.**  When you get the installation package, please execute following command to unzip the package.

```
 $ tar -zxvf kubesphere-all-express-1.0.0-alpha.tar.gz
```

**3.** Go into “`kubesphere-all-express-1.0.0-alpha`” folder.

```
  $ cd kubesphere-all-express-1.0.0-alpha
```




**4.** In order to manage deployment process and target machines configuration, please refer to the following scripts to configure all hosts in `hosts.ini`,

**Attention：**

> Each host occupies one line of information and cannot be wrapped.

**Example**

```
[all]
maser  ansible_connection=local local_release_dir={{ansible_env.HOME}}/releases ansible_user=ubuntu ansible_become=yes ansible_become_user=root ansible_become_pass=password
node1  ansible_host=192.168.0.20 ip=192.168.0.20 ansible_user=ubuntu ansible_become=yes ansible_become_user=root ansible_become_pass=password
node2  ansible_host=192.168.0.30 ip=192.168.0.30 ansible_user=ubuntu ansible_become=yes ansible_become_user=root ansible_become_pass=password

[kube-master]
master

[kube-node]
master
node1
node2

[etcd]
master

[k8s-cluster:children]
kube-node
kube-master
```



**Note：** <br/>

> - Each node's parameters like Internal IP and its password needs to be modified into [all] field. In this example, since "master" served as `taskbox`, it just needs to replace "ansible_become_pass" with the current `ubuntu` password in the first line.
> - Other nodes like "node1" and "node2", for "ansible_host" and "ansible_become_pass" need to be replaced by their actual Internal IP and host password respectively in [all] field.
> - "master" is served as the taskbox which is to execute installation task for whole cluster, as well as the role of master and etcd, so "master" needs to be filled into [kube-master] and [etcd] field.
> - At the same time, for "master","node1" and "node2", they serve the role of node as well, so all of the hosts name need to be filled into [kube-node] field.
> 
> Parameters Specification:
> 
> - ansible_host: The name of the host to connect to.
> - ip: The ip of the host to connect to.
> - ansible_user: The default ssh user name to use.
> - ansible_become: Allows to force privilege escalation.
> - ansible_become_user: Allows to set the user you become through privilege escalation.
> - ansible_become_pass: Allows you to set the privilege escalation password.





**5.** It is required to prepare a server for storage service before multi-node deployment. Then you will need to specify the storage class parameters in  `vars.yml` . Then reference the details on storage configuration, please go to [Storage Configuration Instructions](#storage-configuration-instructions).


**Note：**  <br/>

> - You may to modify the relevant configurations like network or storage class, otherwise it will be executed with default parameters without any modifications.

> - Network：KubeSphere supports `calico` by default.

> - Supported Storage Classes：`GlusterFS、CephRBD` , for the details on storage configuration, please refer to [Storage Configuration Instructions](#storage-configuration-instructions).

> - Typically, you need to configure persistent storage. Since multi-node mode does not support local storage, it's recommended to modify the local storage default configuration to `false`, then you would configure persistent storage such as GlusterFS or CephRBD. Following screenshot describes an example of how to configure CephCBD.

 
```
# Local volume provisioner deployment(Only all-in-one)
local_volume_provisioner_enabled: false
local_volume_provisioner_storage_class: local
local_volume_is_default_class: false


# Ceph_rbd  deployment
ceph_rbd_enabled: true
ceph_rbd_is_default_class: true
ceph_rbd_storage_class: rbd
# e.g. ceph_rbd_monitors:
#   - 172.24.0.1:6789
#   - 172.24.0.2:6789
#   - 172.24.0.3:6789
ceph_rbd_monitors:
  - 192.168.100.8:6789
ceph_rbd_admin_id: admin
# e.g. ceph_rbd_admin_secret: AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==
ceph_rbd_admin_secret: AQCU00Zb5YYZAxAA9Med5rbKZT+pA91vMYM0Jg==
ceph_rbd_pool: rbd
ceph_rbd_user_id: admin
# e.g. ceph_rbd_user_secret: AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==
ceph_rbd_user_secret: AQCU00Zb5YYZAxAA9Med5rbKZT+pA91vMYM0Jg==
ceph_rbd_fsType: ext4
ceph_rbd_imageFormat: 1
```





####  Step 3: Get Started With Deployment

The environment and file monitoring, dependent software installation of KubeSphere, automated installation of Kubernetes and etcd, and automated storage configuration, all of these procedures will be automatically processing in this deployment. The KubeSphere installation package will automatically install the relevant dependent software like Ansible (v2.4+)，Python-netaddr (v0.7.18+) and Jinja (v2.9+).



> The current system is Ubuntu 16.04. It is recommended to use ubuntu as default user to complete following steps.


**1.** Go into `scripts`:

```
$ cd scripts
```

**2.** Execute `install.sh`：

```
$ ./install.sh
```

**3.** Enter `2` to select `multi-node` mode to start：

```
################################################
         KubeSphere Installer Menu
################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
################################################
https://kubesphere.io/               2018-07-27
################################################
Please input an option: 2

```


**Attention：** <br/>

> - The installer will prompt you if you have configured the storage or not. If not, please enter "no", then return to the directory and continue to configure the storage, for details please refer to [Storage Configuration Instructions](#storage-configuration-instructions).

> -  Password-less SSH communication is necessary to be established with other nodes in the cluster. The user will be prompted to configure the password-less communication when executing the `install.sh`. Please enter "no" if not configured, then the installer will automatically configure password-less SSH communication as shown below:


```
######################################################################
         KubeSphere Installer Menu
######################################################################
*   1) All-in-one
*   2) Multi-node
*   3) Quit
######################################################################
https://kubesphere.io/                                      2018-07-27
######################################################################
Please input an option: 2
2
Have you configured storage parameters in conf/vars.yml yet?  (yes/no) 
yes
Password-less SSH communication is necessary，have you configured yet? 
If not, it will be created automatically. (yes/no) 
no 
Generating public/private rsa key pair.
Created directory '/home/ubuntu/.ssh'.
Your identification has been saved in /home/ubuntu/.ssh/id_rsa.
Your public key has been saved in /home/ubuntu/.ssh/id_rsa.pub.
```

**4.** Test KubeSphere multi-node Deployment：

**(1).**If you can see the following "Successful" result being returned after `install.sh` completed, that means KubuSphere installation is ready.


```
PLAY RECAP ***************************************
KubeSphere     : ok=69 changed=68 unreachable=0 
failed=0
Succesful!
##################################################
KubeSphere is running！
Matser IP: 121.10.121.111
ks-console-nodeport: 32117
ks-apiserver-nodeport: 32002
##################################################
```


**(2).**Then you will be able to access KubeSphere login page with the host IP and correct port. The port number will be automatically generated in the result page as above screenshot showing "ks-console-nodeport". 
Then you will be able to access the KubeSphere web via EIP and port forwarding.
**Example**： [http://139.198.121.143:8080](http://139.198.121.143:8080)

![](images/pic02.png)


#### Summary
When KubeSphere is deployed successfully ，you will be able to follow with [*"KubeSphere User Guide"*](www.qingcloud.com)，then log in to KubeSphere and learn how to get started with it！





## Appendix


### Storage Configuration Instructions


KubeSphere supports `GlusterFS` or `Ceph RBD` in multi-node mode deployment, you will need to prepare the corresponding storage server first.

You just need to specify the storage class like Ceph RBD , GlusterFS or local volume at `# Ceph_rbd  deployment` , `# GlusterFS  provisioner deployment` or `# Local volume provisioner deployment(Only all-in-one)` part in `vars.yml` according to the storage server configuration. Please reference following table and refer to the example hints in `vars.yml` to modify the parameters for storage class configuration

**Note:**<br/>

> 1. KubeSphere installation will automatically install the storage client like Ceph RBD Client or GlusterFS Client in Kubernetes cluster, which depends on the storage server configuration, no need to install the client manually. KubeSphere supports Glusterfs Client v3.12.10，can be returned with command `glusterfs -V` ，RBD Client is v12.2.5 and can be returned with command `rbd -v` as well.

> 2. KubeSphere tested `Ceph` Server is v0.94.10, for `Ceph` servers cluster deployment, please refer to [ Install Ceph ](http://docs.ceph.com/docs/master/) or  [ Containerized Ceph cluster ](https://github.com/ceph/ceph-docker)

> 3. KubeSphere tested `Gluster` Server is v3.7.6, for `Gluster` servers cluster deployment, please refer to [Install Gluster](https://www.gluster.org/install/) or [Gluster Docs](http://gluster.readthedocs.io/en/latest/Install-Guide/Install/), and it requires [Heketi](https://github.com/heketi/heketi/tree/master/docs/admin) for management, Heketi v3.0.0 it's recommended.


> 4. Kubernetes is not allowed exits both 2 kinds of storage class at the same time,  please make sure there is not a default storage class in Kubernetes cluster before you are going to specify the storage class. 

Following tables describe different storage classes parameters specification, For `Storage Class` details please refer to [storage classes](https://kubernetes.io/docs/concepts/storage/storage-classes/) as well.

| **Local volume** | **Description** |
| --- | --- |
| local\_volume\_provisioner\_enabled | Whether to use "local\_volume" as persistent volume plugin, Yes:&quot;true&quot; No:&quot;false&quot; |
| local\_volume\_provisioner\_storage\_class | storage\_class name,   Default value：local-storage |
| local\_volume\_is\_default\_class | Whether to set it as default storage\_class, Yes:&quot;true&quot; No:&quot;false&quot;<br/> Attention：It is  allowed to set only one kind of storage class as default\_class |
<br/>

**Attention:** <br/>
After you configure Local Volume (only all-in-one supports this type of storage) and successfully install KubeSphere, it is recommended to reference  [KubeSphere User Guide](https://kubesphere.qingcloud.com), A detailed specification of how to use Local Volume is provided in the [KubeSphere User Guide](https://kubesphere.qingcloud.com).

>

| **Ceph\_RBD** | **Description** |
| --- | --- |
| ceph\_rbd\_enabled | Whether to use ceph\_RBD as persistent storage volume,   Yes:&quot;true&quot; No:&quot;false&quot; |
| ceph\_rbd\_storage\_class | storage\_class name |
| ceph\_rbd\_is\_default\_class | Whether to set it as default storage\_class, Yes:&quot;true&quot; No:&quot;false&quot; <br/> Attention：It is  allowed to set only one kind of storage class as default\_class |
| ceph\_rbd\_monitors | Ceph monitors, comma delimited. This parameter is required, which depends on Ceph RBD server parameters. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_admin\_id | Ceph client ID that is capable of creating images in the pool. Default is “admin”. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_admin\_secret | Admin_id's secret，Secret Name for "adminId". This parameter is required. The provided secret must have type “kubernetes.io/rbd”. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_pool | Ceph RBD pool. Default is “rbd”. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_user\_id | Ceph client ID that is used to map the RBD image. Default is the same as adminId，Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_user\_secret | secret for User_id, it is required to create this secret in namespace which used rbd image，Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_fsType | fsType that is supported by kubernetes. Default: "ext4". Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_imageFormat | Ceph RBD image format, “1” or “2”. Default is “1”. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
|ceph\_rbd\_imageFeatures| This parameter is optional and should only be used if you set imageFormat to “2”. Currently supported features are layering only. Default is “”, and no features are turned on. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd)|

**Attention:**<br/>
> The on-demand ceph secret which being created in storage class, like "ceph_rbd_admin_secret" and "ceph_rbd_user_secret", it can be returned with following command in Ceph storage server.

```
$ ceph auth get-key client.admin
```
<br/>

| **GlusterFS（It requires glusterfs cluster which is managed by heketi）**|**Description** |
| --- | --- |
| glusterfs\_provisioner\_enabled | Whether to use glusterfs as persistent storage volume,    Yes:&quot;true&quot; No:&quot;false&quot; |
| glusterfs\_provisioner\_storage\_class | storage\_class name |
| glusterfs\_is\_default\_class | Whether to set it as default storage\_class, Yes:&quot;true&quot; No:&quot;false&quot; <br/> Attention：It is  allowed to set only one kind of storage class as default\_class| --- | --- |
| glusterfs\_provisioner\_restauthenabled | Gluster REST service authentication boolean that enables authentication to the REST server. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_resturl | Gluster REST service/Heketi service url which provision gluster volumes on demand. The general format should be IPaddress:Port and this is a mandatory parameter for GlusterFS dynamic provisioner. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_clusterid | Optional, for example,630372ccdc720a92c681fb928f27b53f is the ID of the cluster which will be used by Heketi when provisioning the volume. It can also be a list of clusterids. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_restuser | Gluster REST service/Heketi user who has access to create volumes in the Gluster Trusted Pool. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_secretName | Optional, identification of Secret instance that contains user password to use when talking to Gluster REST service,Installation package will automatically create this secret in Kube-system，Refer to[Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_gidMin | The minimum value of GID range for the storage class. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_gidMax |The maximum value of GID range for the storage class. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_volumetype | The volume type and its parameters can be configured with this optional value,For example: ‘Replica volume’: volumetype: replicate:3. Refer to [Kubernetes Docs](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| jwt\_admin\_key | "jwt.admin.key" column from "/etc/heketi/heketi.json" in Heketi server |

**Attention：**<br/>
 > In Glusterfs, `"glusterfs_provisioner_clusterid"` could be returned from glusterfs server. Execute following command:
 
 ```
 $ export HEKETI_CLI_SERVER=http://localhost:8080
 
 $ heketi-cli cluster list
 
 ```
 




