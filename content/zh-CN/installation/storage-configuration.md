---
title: "持久化存储配置说明"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

目前，Installer 支持以下类型的存储作为存储服务端，为 KubeSphere 提供持久化存储 (更多的存储类型持续更新中)：

- NFS
- Ceph RBD
- GlusterFS
- QingCloud 云平台块存储
- QingStor NeonSAN
- 阿里云块存储
- 腾讯云块存储
- Local Volume (默认，仅部署测试使用)


Installer 对接的开源存储服务端和客户端，以及 CSI 插件，已测试过的版本信息如下：

| **名称** | **版本** | **参考** |
| ----------- | --- |---|
| Ceph RBD Server | v0.94.10 |若用于测试部署可参考 [部署 Ceph 存储服务端](../../appendix/ceph-ks-install/)，如果是正式环境搭建请参考 [Ceph 官方文档](http://docs.ceph.com/docs/master/)|
| Ceph RBD Client | v12.2.5 | 在安装 KubeSphere 前仅需在 `common.yaml` 配置相应参数即可对接其存储服务端，参考 [Ceph RBD](../storage-configuration/#ceph-rbd)|
| GlusterFS Server | v3.7.6 |若用于测试部署可参考 [部署 GlusterFS 存储服务端](../../appendix/glusterfs-ks-install)， 如果是正式环境搭建请参考 [Gluster 官方文档](https://www.gluster.org/install/) 或 [Gluster Docs](http://gluster.readthedocs.io/en/latest/Install-Guide/Install/) ，并且需要安装 [Heketi 管理端 (v3.0.0)](https://github.com/heketi/heketi/tree/master/docs/admin)|
|GlusterFS Client |v3.12.10|在安装 KubeSphere 前仅需在 `common.yaml` 配置相应参数即可对接其存储服务端，配置详见 [GlusterFS](../storage-configuration/#glusterfs)|
|NFS Client | v3.1.0 | 在安装 KubeSphere 前仅需在 `common.yaml` 配置相应参数即可对接其存储服务端，详见 [NFS Client](../storage-configuration/#nfs)  |
| QingCloud-CSI |v0.2.0.1|在安装 KubeSphere 前仅需在 `common.yaml` 配置相应参数，详见 [QingCloud CSI](../storage-configuration/#qingcloud-云平台块存储)|
| NeonSAN-CSI|v0.3.0|在安装 KubeSphere 前仅需在 `common.yaml` 配置相应参数，详见 [Neonsan-CSI](../storage-configuration/#qingstor-neonsan) |
| 阿里云 CSI |v1.14.5|在安装 KubeSphere 前仅需在 `plugin-aliyun.yaml` 配置相应参数，详见 [Aliyun CSI](../storage-configuration/#aliyun-csi)|
| 腾讯云 CSI|v1.0.0|在安装 KubeSphere 前仅需在 `plugin-tencentcloud.yaml` 配置相应参数，详见 [TencentCloud-CSI](../storage-configuration/#tencentcloud-csi) |

> 说明：
> 集群中不可同时存在两个默认存储类型，若要指定默认存储类型前请先确保当前集群中无默认存储类型。

## 配置文件释义

准备了满足要求的存储服务端后，只需要参考以下表中的参数说明，在 `conf/common.yaml` 中，根据您存储服务端所支持的存储类型，在配置文件的相应部分参考示例或注释修改对应参数，即可完成集群存储类型的配置。以下对 `common.yaml` 存储相关的参数配置做简要说明 (参数详解请参考 [storage classes](https://kubernetes.io/docs/concepts/storage/storage-classes/) )。

<font color=red>注意：集群仅允许存在 **一个默认的** 存储类型（StorageClass）。Local Volume 作为默认的存储类型，安装前在配置持久化存储相关参数时，需将 Local Volume 的两个参数设置为 false，再选择和配置其它存储类型。</font>

### Local Volume（仅限开发测试环境）

<br>

<details><summary> Local Volume 配置文件（点击展开）</summary>

```yaml
local_volume_enabled: true
local_volume_is_default_class: true
local_volume_storage_class: local
    ···
```

</details>

-------


[Local Volume](https://kubernetes.io/docs/concepts/storage/volumes/#local) 表示挂载的本地存储设备，如磁盘、分区或目录，仅建议用于测试部署与开发环境，在 `conf/common.yaml` 配置的释义如下。

| **Local Volume** | **Description** |
| --- | --- |
| local\_volume\_provisioner\_enabled | 是否使用 local volume 作为持久化存储，  是：true；否：false |
| local\_volume\_provisioner\_storage\_class | 存储类型的名称，   默认：local |
| local\_volume\_is\_default\_class | 是否设定为默认存储类型， 是：true；否：false  |

### NFS

<br>

<details><summary> NFS 配置文件（点击展开）</summary>

```yaml
nfs_client_enabled: false
nfs_client_is_default_class: false

# Hostname of the NFS server(ip or hostname)
nfs_server: SHOULD_BE_REPLACED

# Basepath of the mount point
nfs_path: SHOULD_BE_REPLACED
nfs_vers3_enabled: false
nfs_archiveOnDelete: false
    ···
```

</details>

-------

[NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs) 即网络文件系统，它允许网络中的计算机之间通过 TCP/IP 网络共享资源。需要预先准备 NFS 服务端，支持标准 NFS 协议的文件存储作为 NFS 服务端，例如：

- [阿里云 NAS](https://cn.aliyun.com/product/nas)
- [QingCloud vNAS](https://www.qingcloud.com/products/nas/)
- [华为云 SFS（NFS 协议的弹性文件服务）](https://support.huaweicloud.com/productdesc-sfs/zh-cn_topic_0034428718.html)
- [NetApp](https://www.netapp.com/cn/index.aspx)
- 以及其它的标准 NFS 协议的文件存储

在 `conf/common.yaml` 配置的释义如下。

关于在安装前如何配置 QingCloud vNas，本文档在 [常见问题 - 安装前如何配置 QingCloud vNas](../../faq/faq-install/#安装前如何配置-qingcloud-vnas) 给出了一个详细的示例供参考，其它云平台的 NFS 存储可参考上述相关文档。

| **NFS** | **Description** |
| --- | --- |
| nfs\_client\_enable | 是否使用 NFS 作为持久化存储，是：true；否：false |
| nfs\_client\_is\_default\_class | 是否设定为默认存储类型，是：true；否：false <br/> 注：系统中存在多种存储类型时，只能设定一种为默认存储类型 |
| nfs\_server | 允许其访问的 NFS 服务端地址，可以是 IP 或 Hostname |
| nfs\_path | NFS 共享目录，即服务器上共享出去的文件目录，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/volumes/#nfs) |
|nfs\_vers3\_enabled | 指定要使用的 NFS 协议版本，默认 false 表示 v4，设置 true 则为 v3 |
|nfs_archiveOnDelete | 指定 archiveOnDelete 为 false 时，则会自动删除 oldPath 下的所有数据，即 Pod 对应的数据持久化存储数据 |


### Ceph RBD

<br>

<details><summary> Ceph RBD 配置文件（点击展开）</summary>

```yaml
ceph_rbd_enabled: false
ceph_rbd_is_default_class: false
ceph_rbd_storage_class: rbd

# Ceph rbd monitor endpoints, for example
#
# ceph_rbd_monitors:
#   - 172.24.0.1:6789
#   - 172.24.0.2:6789
#   - 172.24.0.3:6789
ceph_rbd_monitors:
  - SHOULD_BE_REPLACED

# ceph admin account name
ceph_rbd_admin_id: admin

# ceph admin secret, for example,
# ceph_rbd_admin_secret: AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==
ceph_rbd_admin_secret: TYPE_ADMIN_ACCOUNT_HERE
ceph_rbd_pool: rbd
ceph_rbd_user_id: admin
# e.g. ceph_rbd_user_secret: AQAnwihbXo+uDxAAD0HmWziVgTaAdai90IzZ6Q==
ceph_rbd_user_secret: TYPE_ADMIN_SECRET_HERE
ceph_rbd_fsType: ext4
ceph_rbd_imageFormat: 1
# Additional ceph configurations
# ceph_rbd_imageFeatures: layering
    ···
```

</details>

-------

[Ceph RBD](https://ceph.com/) 是一个分布式存储系统，在 `conf/common.yaml` 配置的释义如下。

| **Ceph\_RBD** | **Description** |
| --- | --- |
| ceph\_rbd\_enabled | 是否使用 Ceph RBD 作为持久化存储，是：true；否：false |
| ceph\_rbd\_storage\_class | 存储类型名称 |
| ceph\_rbd\_is\_default\_class | 是否设定为默认存储类型， 是：true；否：false <br/> 注：系统中存在多种存储类型时，只能设定一种为默认存储类型 |
| ceph\_rbd\_monitors | 根据 Ceph RBD 服务端配置填写，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#ceph-rbd) |
| ceph\_rbd\_admin\_id | 能够在存储池中创建的客户端 ID ，默认: admin |
| ceph\_rbd\_admin\_secret | Admin_id 的 secret，安装程序将会自动在 kube-system 项目内创建此 secret |
| ceph\_rbd\_pool | 可使用的 Ceph RBD 存储池 |
| ceph\_rbd\_user\_id | 用于映射 RBD  的 ceph 客户端 ID 默认: admin|
| ceph\_rbd\_user\_secret | User_id 的 secret，需注意在所使用 rbd image 的项目内都需创建此 Secret |
| ceph\_rbd\_fsType | 存储卷的文件系统，kubernetes 支持 fsType，默认：ext4 |
| ceph\_rbd\_imageFormat | Ceph RBD  格式，默认："1" |
|ceph\_rbd\_imageFeatures| 当 `ceph_rbd_imageFormat` 字段不为 1 时需填写此字段|

> 注： 存储类型中创建 secret 所需 ceph secret 如 `ceph_rbd_admin_secret` 和 `ceph_rbd_user_secret` 可在 ceph 服务端通过以下命令获得：

```bash
$ ceph auth get-key client.admin
```

### GlusterFS

<br>

<details><summary> GlusterFS 配置文件（点击展开）</summary>

```yaml
glusterfs_provisioner_enabled: false
glusterfs_provisioner_is_default_class: false
glusterfs_provisioner_storage_class: glusterfs
glusterfs_provisioner_restauthenabled: true
# e.g. glusterfs_provisioner_resturl: http://192.168.0.4:8080
glusterfs_provisioner_resturl: SHOULD_BE_REPLACED
# e.g. glusterfs_provisioner_clusterid: 6a6792ed25405eaa6302da99f2f5e24b
glusterfs_provisioner_clusterid: SHOULD_BE_REPLACED
glusterfs_provisioner_restuser: admin
glusterfs_provisioner_secretName: heketi-secret
glusterfs_provisioner_gidMin: 40000
glusterfs_provisioner_gidMax: 50000
glusterfs_provisioner_volumetype: replicate:2
# e.g. jwt_admin_key: 123456
jwt_admin_key: SHOULD_BE_REPLACED
    ···
```

</details>

-------

[GlusterFS](https://www.gluster.org/) 是一个开源的分布式文件系统，配置时需提供 heketi 所管理的 glusterfs 集群，在 `conf/common.yaml` 配置的释义如下。

| **GlusterFS**| **Description** |
| --- | --- |
| glusterfs\_provisioner\_enabled | 是否使用 GlusterFS 作为持久化存储，是：true；否：false |
| glusterfs\_provisioner\_storage\_class | 存储类型的名称 |
| glusterfs\_is\_default\_class | 是否设定为默认存储类型，是：true；否：false <br/> 注：系统中存在多种存储类型时，只能设定一种为默认存储类型| --- | --- |glusterfs\_provisioner\_resturl | Heketi 服务 url，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) | glusterfs\_provisioner\_clusterid | Heketi 服务端输入 heketi-cli cluster list 命令获得，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_restauthenabled | Gluster 启用对 REST 服务器的认证 |
| glusterfs\_provisioner\_resturl | Heketi 服务端 url |
| glusterfs\_provisioner\_clusterid | Gluster 集群 id，登录 heketi 服务端输入 heketi-cli cluster list 得到 Gluster 集群 id|
| glusterfs\_provisioner\_restuser | 能够在 Gluster pool 中创建 volume 的 Heketi 用户 |
| glusterfs\_provisioner\_secretName | Secret 名称，安装程序将会在 kube-system 项目内自动创建此 Secret|
| glusterfs\_provisioner\_gidMin | glusterfs\_provisioner\_storage\_class 中 GID 的最小值，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_gidMax | glusterfs\_provisioner\_storage\_class 中 GID 的最大值，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| glusterfs\_provisioner\_volumetype | Volume 类型，参数配置请参考 [Kubernetes 官方文档](https://kubernetes.io/docs/concepts/storage/storage-classes/#glusterfs) |
| jwt\_admin\_key | heketi 服务器中 `/etc/heketi/heketi.json` 的 jwt.admin.key 字段 |

> 注： Glusterfs 存储类型中所需的 `glusterfs_provisioner_clusterid` 可在 glusterfs 服务端通过以下命令获得：

```bash
$ export HEKETI_CLI_SERVER=http://localhost:8080
$ heketi-cli cluster list
```

### QingCloud 云平台块存储


KubeSphere 支持使用 QingCloud 云平台块存储作为平台的存储服务，如果希望体验动态分配 (Dynamic Provisioning) 方式创建存储卷，推荐使用 [QingCloud 云平台块存储](https://www.qingcloud.com/products/volume/)，平台已集成 [QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) 块存储插件支持对接块存储，仅需简单配置即可使用 QingCloud 云平台各种性能的块存储服务，**并且支持扩容、拓扑、创建/删除快照以及基于快照创建 PVC**。

[QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) 块存储插件实现了 CSI 接口，并且支持 KubeSphere 使用 QingCloud 云平台的存储资源。块存储插件部署后，用户在 QingCloud 云平台可创建访问模式 (Access Mode) 为 **单节点读写（ReadWriteOnce）** 的存储卷并挂载至工作负载，包括以下几种类型：

- 容量型
- 基础型
- SSD 企业型
- 超高性能型
- 企业级分布式块存储 NeonSAN


> 注意：在 KubeSphere 集群内使用到性能型、超高性能型、企业型或基础型硬盘时，集群的主机类型也应与硬盘的类型保持一致。


在安装 KubeSphere 时配置 QingCloud-CSI 插件的参数说明如下三个表所示，安装配置 QingCloud-CSI 插件和 QingCloud 负载均衡器插件都需要下载 API 密钥来对接 QingCloud API。

|**QingCloud-API** | **Description**|
| --- | ---|
| qingcloud\_access\_key\_id ， <br> qingcloud\_secret\_access\_key|通过[QingCloud 云平台控制台](https://console.qingcloud.com/login) 的右上角账户图标选择 **API 密钥** 创建密钥获得|
|qingcloud\_zone| zone 应与 Kubernetes 集群所在区相同，CSI 插件将会操作此区的存储卷资源。例如：zone 可以设置为 sh1a（上海一区-A）、sh1b（上海1区-B）、 pek2（北京2区）、pek3a（北京3区-A）、gd1（广东1区）、gd2a（广东2区-A）、ap1（亚太1区）、ap2a（亚太2区-A）|
|qingcloud_host| QingCloud 云平台 api 地址，例如 `api.qingcloud.com` (若对接私有云则以下值都需要根据实际情况填写)|
|qingcloud_port| API 请求的端口，默认 https 端口 (443)|
|qingcloud_protocol | 网络协议，默认 https 协议 |
|qingcloud_uri | URI 路径，默认值 iaas |
|qingcloud\_connection\_retries | API 连接重试时间 (默认 3 秒) |
| qingcloud\_connection\_timeout | API 连接超时时间 (默认 30 秒） |

在 `plugin-qingcloud.yaml` 中完成上表中的 API 相关配置后，再修改 QingCloud-CSI 配置安装 QingCloud 块存储插件。

|**QingCloud-CSI** | **Description**|
| --- | ---|
| qingcloud\_csi\_enabled|是否使用 QingCloud-CSI 作为持久化存储，是：true； 否：false |
| qingcloud\_csi\_is\_default\_class|是否设定为默认的存储类型， 是：true；否：false <br/> 注：系统中存在多种存储类型时，只能设定一种为默认的存储类型|
| qingcloud\_type | QingCloud 云平台硬盘的类型 <br> * 性能型是 0 <br> * 容量型是 2 <br>* 超高性能型是 3 <br> * 企业级分布式块存储 NeonSAN 是 5 <br> * 基础型是 100 <br> * SSD 企业型是 200 <br> 详情见 [QingCloud 官方文档](https://docs.qingcloud.com/product/api/action/volume/create_volumes.html)|
| qingcloud\_minSize, qingcloud\_maxSize | 即单块硬盘的最小容量和最大容量，限制存储卷类型的存储卷容量范围，单位为 GiB|
| qingcloud\_stepSize | 设置用户所创建存储卷容量的增量，单位为 GiB|
| qingcloud\_fsType | 存储卷的文件系统，支持 ext3, ext4, xfs. 默认为 ext4|
| disk\_replica | 硬盘的副本策略，支持单副本和多副本，1 表示单副本，2 表示多副本|


#### 硬盘类型与主机适配性

|          | 性能型硬盘    | 容量型硬盘  | 超高性能型硬盘 | NeonSAN 硬盘 |基础型硬盘| SSD 企业型硬盘|
|-----------|------------------|------------------|-----------------|---------|----------|-------|
|性能型主机| ✓        | ✓                | -               | ✓      | -     | -     |
|超高性能型主机| -       | ✓                | ✓               |✓  |-  |-  |
|基础型主机| -       | ✓                | -               |✓  |✓  |-  |
|企业型主机| -       | ✓                | -               |✓  |-  |✓  |


#### 各区应设置的 minSize, maxSize 和 stepSize 参数

下表中的值对应的格式为：qingcloud\_minSize - qingcloud\_maxSize，qingcloud\_stepSize。

|          | 性能型硬盘    | 容量型硬盘  | 超高性能型硬盘 | NeonSAN 硬盘 |基础型硬盘| SSD 企业型硬盘|
|----|----|-----|-----|----|----|-----|
| 北京2区  |10 - 1000, 10  | 100 - 5000, 50  | 10 - 1000,10 | -  |  - | - |
| 北京3区-A  | 10 - 2000, 10  | 100 - 5000, 50  | 10 - 2000,10  |  - |  - | -  |
| 广东1区 | 10 - 1000, 10  | 100 - 5000, 50  | 10 - 1000,10  |  - | -  | -  |
| 上海1区-A  | -  | 100 - 5000, 50  | -  | 100 - 50000, 100  | 10 - 2000, 10  | 10 - 2000, 10  |
| 亚太1区  |10 - 1000, 10   | 100 - 5000, 50  | -  |  - |  - |  - |
| 亚太2区-A  | -  | 100 - 5000, 50  |  - | -  | 10 - 2000, 10  | 10 - 2000, 10  |

#### QingCloud 各类型块存储的最低配额

注意，使用 QingCloud 云平台块存储作为存储服务，安装前需要确保用户账号在当前 Zone 资源配额满足最低要求。在没有配置安装 GitLab 和 Harbor 的前提下，Multi-node 安装最少需要 `14` 块硬盘，请参考以下的最低配额表核对您账号的存储配额，若硬盘数量和容量配额不够请提工单申请配额。

> 注意，GitLab 和 Harbor 作为可选安装项，若安装前需要配置则需要考虑硬盘数量和容量的配额是否满足要求：Harbor 安装需要额外挂载 `5` 块硬盘，GitLab 安装需要额外挂载 `4` 块硬盘，若 KubeSphere 部署在云平台则需要考虑硬盘数量是否满足配额要求。


| 最低配额 \ 硬盘类型   | 性能型硬盘  | 容量型硬盘  | 超高性能型硬盘 | NeonSAN 硬盘|基础型硬盘|SSD 企业型硬盘|
|-----------|------------------|------------------|-----------------|---------|----------|-------|
|块数 (块) / 容量 (GB)| 14 / 230    | 14 / 1400   | 14 / 230   | 14 / 1400   | 14 / 230   | 14 / 230 |


### QingStor NeonSAN

NeonSAN-CSI 插件支持对接青云自研的企业级分布式存储 [QingStor NeonSAN](https://www.qingcloud.com/products/qingstor-neonsan/) 作为存储服务，若您准备好 NeonSAN 物理服务端后，即可在 `conf/plugin-qingcloud.yaml` 配置 NeonSAN-CSI 插件对接其存储服务端。详见 [NeonSAN-CSI 参数释义](https://github.com/wnxn/qingstor-csi/blob/master/docs/reference_zh.md#storageclass-%E5%8F%82%E6%95%B0)。

| **NeonSAN** | **Description** |
| --- | --- |
| neonsan\_csi\_enabled | 是否使用 NeonSAN 作为持久化存储，是：true；否：false |
| neonsan\_csi\_is\_default\_class | 是否设定为默认存储类型，是：true；否：false <br/> 注：系统中存在多种存储类型时，只能设定一种为默认存储类型 |
| neonsan\_csi\_protocol | NeonSAN 服务端传输协议，如 TCP 或 RDMA|
| neonsan\_server\_address |NeonSAN 服务端地址 |
| neonsan\_cluster\_name| NeonSAN 服务端集群名称|
| neonsan\_server\_pool|Kubernetes 插件从哪个 pool 内创建存储卷，默认值为 kube|
| neonsan\_server\_replicas|NeonSAN image 的副本个数，默认为 1|
| neonsan\_server\_stepSize|用户所创建存储卷容量的增量，单位为 GiB，默认为 1|
| neonsan\_server\_fsType|存储卷的文件系统格式，默认为 ext4|

### 阿里云平台块存储


KubeSphere 支持使用阿里云平台块存储作为平台的存储服务，KubeSphere Installer 已集成 [Alibaba Cloud-CSI](https://github.com/kubernetes-sigs/alibaba-cloud-csi-driver/blob/master/README-zh_CN.md) 块存储插件支持对接阿里云块存储，若您准备在阿里云上搭建具备存储持久化的集群，建议配置此插件使用阿里云块存储进行安装。


|**Alibaba Cloud-CSI** | **Description**|
| --- | ---|
| alicloud\_disk\_csi\_enabled | 是否使用 Alibaba Cloud-CSI 作为持久化存储，是：true； 否：false |
| alicloud\_disk\_csi\_is\_default\_class | |是否设定为默认的存储类型， 是：true；否：false |
| ali\_access\_key\_id ， <br> ali\_access\_key\_secret | 通过[阿里云平台控制台](https://account.aliyun.com/login) 的右上角账户图标选择 **AccessKey管理** 创建密钥获得|
| ali\_disk\_zoneId | zone id 应与 Kubernetes 集群所在区相同，CSI 插件将会操作此区的存储卷资源。|
| ali\_disk\_regionId | region id 同上与Kubernetes 集群所在区相同 |
| ali\_disk\_fsType | 存储卷的文件系统格式，默认为ext4|
|ali\_disk\_type| 云盘类型 |


> 安装前请注意：<br>
> 1. `openldap_volume_size` 和 `redis_volume_size` 的默认值为 2Gi， 若使用阿里云平台块存储作为默认存储类型，安装前需要在 `conf/common.yaml` 更改至最低 10 Gi，否则 PVC 会创建失败。
> 2. KubeSphere 2.1.1 在 `conf/common.yaml` 新增的 `elasticsearch_master_volume_size` 字段来指定 ES master 节点的挂盘大小，默认值为 `4` Gi，同理需要在 `conf/common.yaml` 更改至最低 `10` Gi，否则 PVC 会创建失败。
> 3. 如果还开启了其他插件比如 DevOps，配置方法类似，把相应的 Volume 大小（这里对应就是 `jenkins_volume_size`）在 `conf/common.yaml` 设置为最低 10 Gi。


安装完成后，通过执行以下命令来检查存储卷的挂载状态，若 `STATUS` 均为 `Bound`，则说明安装正常。

```bash
kubectl get pvc -A
```


### 腾讯云平台块存储

KubeSphere 支持使用腾讯云平台块存储作为平台的存储服务，平台已集成[Tencent Cloud-CSI](https://github.com/TencentCloud/kubernetes-csi-tencentcloud/blob/master/README.md)块存储插件支持对接块存储。

|**Tencent Cloud-CSI** | **Description**|
| --- | ---|
| tencentcloud\_cbs\_csi\_enabled | 是否使用 Tencent Cloud-CSI 作为持久化存储，是：true； 否：false |
| tencentcloud\_cbs\_csi\_is\_default\_class | 是否设定为默认的存储类型， 是：true；否：false |
| tecentcloud\_cbs\_api\_secret\_id ， <br> tecentcloud\_cbs\_api\_secret\_key | 通过[腾讯云平台控制台](https://console.cloud.tencent.com/cam/capi) 的个人账户页面选择 **访问密钥** 创建密钥获得，需要base64编码|
| ali\_disk\_zoneId | zone id 应与 Kubernetes 集群所在区相同，CSI 插件将会操作此区的存储卷资源。|
|tencentcloud\_disk\_type| 云盘类型 |

其中，`tecentcloud_cbs_api_secret_id` ,` tecentcloud_cbs_api_secret_key`为平台密钥的 base64 编码:

```shell
# get tecentcloud_cbs_api_secret_id
echo -n <SecretId> | base64

# get tecentcloud_cbs_api_secret_key
echo -n <SecretKey> | base64
```

> 说明：<br>
> 1. `openldap_volume_size` 和 `redis_volume_size` 的默认值为2Gi， 若使用腾讯云平台块存储作为默认存储类型，安装前需要在 `conf/common.yaml` 更改至最低 10 Gi，否则 PVC 会创建失败。
> 2. KubeSphere 2.1.1 在 `conf/common.yaml` 新增的 `elasticsearch_master_volume_size` 字段来指定 ES master 节点的挂盘大小，默认值为 4Gi，同理需要在 `conf/common.yaml` 更改至最低 `10` Gi，否则 PVC 会创建失败。
> 3. 如果还开启了其他插件比如 DevOps，配置方法类似，把相应的 volume 大小（这里对应就是`jenkins_volume_size`）在 `conf/common.yaml` 设置为最低 10 Gi。

安装完成后，通过执行`kubectl get pvc -A`来检查CSI插件运行状态，若 `STATUS` 均为 `Bound`，则说明安装正常。

```bash
kubectl get pvc -A
```
