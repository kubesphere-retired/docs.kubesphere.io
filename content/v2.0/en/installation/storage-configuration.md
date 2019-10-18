---
title: "Storage Configuration Instruction"
keywords: ''
description: ''
---

Currently, Installer supports the following types of storage as storage servers, providing persistent storage service for KubeSphere (more storage classes are continuously updated).

- Ceph RBD
- GlusterFS
- NFS
- QingCloud Block Storage
- QingStor NeonSAN
- Local Volume (All-in-One installation test only)

At the same time, Installer integrates the [QingCloud-CSI (Block Storage Plugin)](https://github.com/yunify/qingcloud-csi/blob/master/README.md) and the [QingStor NeonSAN CSI Plugin](https://github.com/wnxn/qingstor-csi/blob/master/docs/install_in_k8s_v1.12.md). It can be connected to the QingCloud block storage or QingStor NeonSAN as a storage, just need simple configuration before installation. 

Make sure you have [QingCloud](https://console.qingcloud.com/login) account. In addition, The Installer also integrates storage clients such as NFS, GlusterFS and Ceph RBD. Users need to prepare the relevant storage server in advance, and then configure the corresponding parameters in `vars.yml` to connect to the corresponding storage server.


The versions of open source storage servers and clients that have been tested using Installer, as well as the CSI plugins, are listed as following:

| **Name** | **Version** | **Reference** |
| ----------- | --- |---|
Ceph RBD Server | v0.94.10 | For testing installation, please refer to [Deploy Ceph Storage Server](/express/zh-CN/ceph-ks-install/). If it is in a formal environment, please refer to [Ceph Documentation](http://docs.ceph.com/docs/master/)|
Ceph RBD Client | v12.2.5 | Before installing KubeSphere, you just need to configure the corresponding parameters in `vars.yml` to connect to its storage server, see [Ceph RBD](../storage-configuration/#ceph-rbd) |
GlusterFS Server | v3.7.6 | For testing installation, please refer to [Deploying GlusterFS Storage Server](/express/zh-CN/glusterfs-ks-install/). If it is a formal environment, please refer to [Gluster Documentation](https://www.gluster.org/install/) or [Gluster Documentaion](http://gluster.readthedocs.io/en/latest/Install-Guide/Install/) and need to install [Heketi Manager (V3.0.0)](https://github.com/heketi/heketi/tree/master/docs/admin) as well|
|GlusterFS Client |v3.12.10|Before installing KubeSphere, you just need to configure the corresponding parameters in `vars.yml` to connect to the storage server, see [GlusterFS](../storage-configuration/#glusterfs)|
|NFS Server in Kubernetes| v1.0.9 | For configuration details, see [NFS Server Configuration](../storage-configuration/#nfs) |
|NFS Client | v3.1.0 | Before installing KubeSphere, you just need to configure the corresponding parameters in `vars.yml` to connect to its storage server, see [NFS Client](../storage-configuration/#nfs) |
QingCloud-CSI|v0.2.0.1|Please configure the corresponding parameters in `vars.yml` before installing KubeSphere. For details, see [QingCloud CSI](../storage-configuration/#qingcloud-csi)|
NeonSAN-CSI|v0.3.0| Before installing KubeSphere, you just need to configure the corresponding parameters in `vars.yml`, see [Neonsan-CSI](../storage-configuration/#neonsan-csi) |

> Note: It's not allowed to set two default storage class in the cluster. To specify a default storage class, make sure there is no default storage class already exited in the current cluster.

## Storage Configuration Definition

After preparing the storage server, then you need to reference the parameter description in the following table. Then modify the corresponding storage class part in the configuration file (`conf/vars.yml` ) according to your storage server. 

The following is a brief description of the parameter configuration related to `vars.yml` storage, also see [Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/)) for the details.

> Note: By default, Local Volume is configured as the default storage class of the cluster in `vars.yml`. If you are going to configure other storage class as the default class, firstly you have to modify the related configuration of Local to **false**, and then modify the configuration of the corresponding storage according to your storage server before start installation. 


### Ceph RBD


The open source [Ceph RBD](https://ceph.com/) distributed storage system, can be configured in `conf/vars.yml`, assume you have prepared Ceph storage servers in advance, thus you can reference the following definition. See [Kubernetes Documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) for more details.

| **Ceph\_RBD** | **Description** |
| --- | --- |
| ceph\_rbd\_enabled | Determines whether to use Ceph RBD as the persistent storage, can be set to true or false. Defaults to false |
| ceph\_rbd\_storage\_class | Storage class name |
| ceph\_rbd\_is\_default\_class | Determines whether to set Ceph RBD as default storage class, can be set to true or false. Defaults to false. <br/> Note: When there are multiple storage classes in the system, only one can be set as the default. |
| ceph\_rbd\_monitors | Ceph monitors, comma delimited. This parameter is required, which depends on Ceph RBD server parameters |
| ceph\_rbd\_admin\_id | Ceph client ID that is capable of creating images in the pool. Default is “admin” |
| ceph\_rbd\_admin\_secret | Admin_id's secret，Secret name for "adminId". This parameter is required. The provided secret must have type “kubernetes.io/rbd” |
| ceph\_rbd\_pool | Ceph RBD pool. Default is “rbd” |
| ceph\_rbd\_user\_id | Ceph client ID that is used to map the RBD image. Default is the same as adminId |
| ceph\_rbd\_user\_secret | Secret for User_id, it is required to create this secret in namespace which used rbd image |
| ceph\_rbd\_fsType | fsType that is supported by kubernetes. Default: "ext4"|
| ceph\_rbd\_imageFormat | Ceph RBD image format, “1” or “2”. Default is “1” |
|ceph\_rbd\_imageFeatures| This parameter is optional and should only be used if you set imageFormat to “2”. Currently supported features are layering only. Default is “”, and no features are turned on|

**Attention:**<br/>
> The on-demand ceph secret which is created in storage class, like "ceph_rbd_admin_secret" and "ceph_rbd_user_secret", it can be returned with following command in Ceph storage server.

```
$ ceph auth get-key client.admin
```

### GlusterFS 

[GlusterFS](https://docs.gluster.org/en/latest/) is a scalable network filesystem suitable for data-intensive tasks such as cloud storage and media streaming. Assume you have prepared GlusterFS storage servers in advance, thus you can reference the following definition，see [Kubernetes Documentation](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) for more details.

| **GlusterFS（It requires glusterfs cluster which is managed by heketi）**|**Description** |
| --- | --- |
| glusterfs\_provisioner\_enabled | Determines whether to use GlusterFS as the persistent storage, can be set to true or false. Defaults to false |
| glusterfs\_provisioner\_storage\_class | Storage class name |
| glusterfs\_is\_default\_class | Determines whether to set GlusterFS as default storage class, can be set to true or false. Defaults to false. <br/> Note: When there are multiple storage classes in the system, only one can be set as the default |
| glusterfs\_provisioner\_restauthenabled | Gluster REST service authentication boolean that enables authentication to the REST server |
| glusterfs\_provisioner\_resturl | Gluster REST service/Heketi service url which provision gluster volumes on demand. The general format should be IPaddress:Port and this is a mandatory parameter for GlusterFS dynamic provisioner|
| glusterfs\_provisioner\_clusterid | Optional, for example, 630372ccdc720a92c681fb928f27b53f is the ID of the cluster which will be used by Heketi when provisioning the volume. It can also be a list of clusterids |
| glusterfs\_provisioner\_restuser | Gluster REST service/Heketi user who has access to create volumes in the Gluster Trusted Pool |
| glusterfs\_provisioner\_secretName | Optional, identification of Secret instance that contains user password to use when talking to Gluster REST service,Installation package will automatically create this secret in Kube-system |
| glusterfs\_provisioner\_gidMin | The minimum value of GID range for the storage class |
| glusterfs\_provisioner\_gidMax |The maximum value of GID range for the storage class |
| glusterfs\_provisioner\_volumetype | The volume type and its parameters can be configured with this optional value,For example: ‘Replica volume’: volumetype: replicate:3 |
| jwt\_admin\_key | "jwt.admin.key" column from "/etc/heketi/heketi.json" in Heketi server |

**Attention：**<br/>
 > In Glusterfs, `"glusterfs_provisioner_clusterid"` could be returned from glusterfs server. Execute the following command:
 
 ```bash
 $ export HEKETI_CLI_SERVER=http://localhost:8080
 
 $ heketi-cli cluster list
 ```

### NFS

An NFS volume allows an existing NFS (Network File System) share to be mounted into your Pod. NFS can be configured in `conf/vars.yml`, assume you have prepared Ceph storage servers in advance. By the way, you can use [QingCloud vNAS](https://www.qingcloud.com/products/nas/) as NFS server.

| **NFS** | **Description** |
| --- | --- |
| nfs\_client\_enable | Determines whether to use NFS as the persistent storage, can be set to true or false. Defaults to false |
| nfs\_client\_is\_default\_class | Determines whether to set NFS as default storage class, can be set to true or false. Defaults to false. <br/> Note: When there are multiple storage classes in the system, only one can be set as the default  |
| nfs\_server | The NFS server address, either IP or Hostname |
| nfs\_path | NFS shared directory, which is the file directory shared on the server, see [Kubernetes Documentation](https://kubernetes.io/docs/concepts/storage/volumes/#nfs) |


### QingCloud Block Storage

KubeSphere supports QingCloud Block Storage as the platform storage service. If you would like to experience dynamic provisioning to create volumes, it's recommended to use [QingCloud Block Storage](https://docs.qingcloud.com/product/Storage/volume/), KubeSphere integrated [QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md), which supports you to use the different performance of block storage in QingCloud platform.

After plugin installation completes, user can create volumes based on several types of disk, such as super high performance disk, high performance disk and high capacity disk, with ReadWriteOnce access mode and mount volumes on workloads.

The parameters for configuring the QingCloud-CSI plugin are described below.

|**QingCloud-CSI** | **Description**|
| --- | ---|
| qingcloud\_csi\_enabled|Determines whether to use QingCloud-CSI as the persistent storage volume, can be set to true or false. Defaults to false |
| qingcloud\_csi\_is\_default\_class| Determines whether to set QingCloud-CSI as default storage class, can be set to true or false. Defaults to false. <br/> Note: When there are multiple storage classes in the system, only one can be set as the default. |
qingcloud\_access\_key\_id , <br> qingcloud\_secret\_access\_key| Get from [QingCloud Cloud Platform Console](https://console.qingcloud.com/login) |
|qingcloud\_zone| zone should be the same as the zone where the Kubernetes cluster is installed, and the CSI plugin will operate on the storage volumes for this zone. For example: zone can be set to these values, such as sh1a (Shanghai 1-A), sh1b (Shanghai 1-B), pek2 (Beijing 2), pek3a (Beijing 3-A), pek3b (Beijing 3-B), pek3c (Beijing 3-C), gd1 (Guangdong 1), gd2a (Guangdong 2-A), ap1 (Asia Pacific 1), ap2a (Asia Pacific 2-A) |
| type | The type of volume in QingCloud IaaS platform. In QingCloud public cloud platform, 0 represents high performance volume. 3 respresents super high performance volume. 1 or 2 represents high capacity volume depending on cluster‘s zone, see [QingCloud Documentation](https://docs.qingcloud.com/product/api/action/volume/create_volumes.html)|
| maxSize, minSize | Limit the range of volume size in GiB|
| stepSize | Set the increment of volumes size in GiB|
| fsType | The file system of the storage volume, which supports ext3, ext4, xfs. The default is ext4|

### QingStor NeonSAN

The NeonSAN-CSI plugin supports the enterprise-level distributed storage [QingStor NeonSAN](https://www.qingcloud.com/products/qingstor-neonsan/) as the platform storage service. If you have prepared the NeonSAN server, you will be able to configure the NeonSAN-CSI plugin to connect to its storage server in `conf/vars.yml`, see [NeonSAN-CSI Reference](https://github.com/wnxn/qingstor-csi/blob/master/docs/reference_zh.md#storageclass-%E5%8F%82%E6%95%B0)。

| **NeonSAN** | **Description** |
| --- | --- |
| neonsan\_csi\_enabled | Determines whether to use NeonSAN as the persistent storage, can be set to true or false. Defaults to false |
| neonsan\_csi\_is\_default\_class | Determines whether to set NeonSAN-CSI as default storage class, can be set to true or false. Defaults to false. <br/> Note: When there are multiple storage classes in the system, only one can be set as the default.|
Neonsan\_csi\_protocol | tranportation protocol, user must set the option, such as TCP or RDMA|
| neonsan\_server\_address | NeonSAN server address |
| neonsan\_cluster\_name| NeonSAN server cluster name|
| neonsan\_server\_pool|A comma separated list of pools. Tell plugin to manager these pools. User must set the option, the default value is kube|
| neonsan\_server\_replicas|NeonSAN image replica count. Default: 1|
| neonsan\_server\_stepSize|set the increment of volumes size in GiB. Default: 1|
| neonsan\_server\_fsType|The file system to use for the volume. Default: ext4|

### Local Volume (All-in-One installation test only)

A [Local](https://kubernetes.io/docs/concepts/storage/volumes/#local) volume represents a mounted local storage device such as a disk, partition or directory. Local volumes can only be used as a statically created PersistentVolume. Dynamic provisioning is not supported yet. So it's only recommended to use Local volume for All-in-One installation test only, it can help you to quickly & easily install KubeSphere on a single node. The definition of the `conf/vars.yml` is as following table. 

| **Local volume** | **Description** |
| --- | --- |
| local\_volume\_provisioner\_enabled | Determines whether to use Local as the persistent storage, can be set to true or false. Defaults to true |
| local\_volume\_provisioner\_storage\_class | Storage class name, default value：local |
| local\_volume\_is\_default\_class | Determines whether to set Local as the default storage class, can be set to true or false. Defaults to true. <br/> Note: When there are multiple storage classes in the system, only one can be set as the default |

