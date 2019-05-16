---
title: "升级"
---

KubeSphere 目前最新的版本 2.0.0 已发布，该版本相对于 1.0.1 提供了微服务治理、监控、告警、日志、s2i 以及代码质量检测等功能，对已有功能进行了改进和功能优化，并修复了已知的 Bug，关于 2.0.0 版本的更新详情可参考 [Release Note - v2.0.0](../../release/release-v200)。

若您已安装的环境为 1.0.1 版本，我们强烈建议您升级至最新的版本 2.0.0，最新的 Installer 支持将 KubeSphere 从 1.0.1 一键升级至 2.0.0，无需卸载和重新安装；同时支持升级 Kubernetes 和 etcd 至指定版本，升级过程中所有节点将会逐个升级，可能会出现短暂的应用服务中断现象，请您安排合理的升级时间。

> 说明：
>
> 升级过程中以下组件的版本将会有更新：
> - KubeSphere: 1.0.1 将升级至 2.0.0；
> - Kubernetes: v1.12.5 将升级至 v1.13.5；


## 如何升级

### 第一步：下载最新安装包

1.1. 下载 [KubeSphere Advanced Edition 2.0.0 安装包](https://kubesphere.io/download) 至已安装了 1.0.1 的环境，获取下载链接后可使用 `curl -O url` or `wget url` 命令下载至待安装机器，并执行以下命令。

```bash
$ tar -zxf kubesphere-all-advanced-2.0.0.tar.gz
```

1.2. 进入 “`kubesphere-all-advanced-2.0.0`” 目录

```bash
$ cd kubesphere-all-advanced-2.0.0
```

#### 查看版本参数 (可选)

待升级的组件版本号已在  /conf/vars.yml 文件中定义，默认情况下将升级至已指定的版本，若需要修改可编辑其参数。

```bash
## Change this to use another Kubernetes version
ks_version: 2.0.0
kube_version: v1.13.5
etcd_version: v3.2.18
```

### 第二步：修改配置文件 

升级将默认读取 2.0.0 的 conf 目录下的配置文件，因此在升级前需要将 1.0.1 中 conf 下的配置文件中的参数都同步到 2.0.0 版本安装包的对应文件中，修改配置文件分以下两种情况：

#### All-in-One

若 1.0.1 是以 **all-in-one** 模式安装的单节点集群，那么升级前在 2.0.0 中无需修改 `conf/hosts.ini` 文件，仅需要确认 1.0.1 的 `conf/vars.yml` 参数配置是否修改，若有修改则需要在 2.0.0 的对应文件中同步所有修改的参数。

例如，目前 2.0.0 中默认使用 [Local](https://kubernetes.io/docs/concepts/storage/volumes/#local) 作为存储类型，如果您的 1.0.1 配置使用了其它存储类型，如 QingCloud 块存储、NFS、Ceph RBD 或 GlusterFS 等，那么在 2.0.0 安装包的 `conf/vars.yml` 中也需要进行相应的设置（即与 1.0.1 的配置保持一致），并将 Local 的存储配置设置为 false，参数释义详见 [存储配置参数](../storage-configuration)。

#### Multi-Node 

若 1.0.1 是以 **multi-node** 模式安装的多节点集群，那么升级前需将当前的 `conf/hosts.ini` 和 `conf/vars.yaml` 中的配置都同步到 2.0.0 的对应文件中：
   - 将 1.0.1 的 `conf/hosts.ini` 中的主机参数配置覆盖至 2.0.0 安装包的 `conf/hosts.ini`，参数释义详见 [Multi-Node 模式 - 准备安装配置文件](../multi-node)。
   - 将 1.0.1 的 `conf/vars.yml` 中所有修改过的参数配置同步至 2.0.0 的 `conf/vars.yml`。例如，1.0.1 配置使用的是 QingCloud 块存储、NFS、Ceph RBD 或 GlusterFS 这一类存储，那么在 2.0.0 安装包的 `conf/vars.yml` 中也要进行相应的设置（即与 1.0.1 的配置保持一致），并将 Local 的存储配置设置为 false，参数释义详见 [存储配置参数](../storage-configuration)。 

> 注意：`conf/vars.yml` 中的配置项都是 `key:value` 的形式，QingCloud CSI 和 NFS in Kubernetes 两项配置的 key 在 2.0.0 已更新，若配置了这两类存储则应使用 2.0.0 中的 key。

### 第三步：开始升级

参考如下步骤进行升级：

3.1. 在 `kubesphere-all-advanced-2.0.0` 目录下进入 `/script` 目录，执行 `upgrade.sh` 脚本，建议使用 **root** 用户：

```bash
$ ./upgrade.sh
```

3.2. 在以下返回中输入 `yes` 开始升级：

```
ks_version: 1.0.1 to 2.0.0
k8s_version: v1.12.3 to v1.13.5

The relevant information is shown above, please confirm:  (yes/no) yes
```

3.3. 由于升级是对逐个节点进行升级，因此升级时间与集群节点规模与网络状况相关。升级完成后，可使用之前的 KubeSphere 访问地址和账户登陆 Console，点击右上角的「关于」查看版本是否更新成功。

<!-- ![查看版本号](/advanced-2.0.0.png) -->