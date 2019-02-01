---
title: "升级"
---

KubeSphere 目前最新的版本 1.0.1 已发布，该版本对 1.0.0 进行了改进和功能优化，并修复了已知的 Bug，关于 1.0.1 的更新详情可参考 [Release Note - v1.0.1](../../release/release-v101)。

若您的机器已安装的环境为 1.0.0 版本，我们强烈建议您升级至最新的版本 1.0.1，最新的 Installer 支持将 KubeSphere 从 1.0.0 环境一键升级至目前最新的 1.0.1，无需卸载和重新安装，同时支持升级 Kubernetes 和 etcd 至当前指定的版本，升级过程中所有节点将会逐个升级，可能会出现短暂的应用服务中断现象。

> 说明：
>
> 升级过程中以下组件的版本将会有更新：
> - KubeSphere: 1.0.0 将升级至 1.0.1
> - Kubernetes: v1.12.3 将升级至 v1.12.5，同时支持升级至 v1.13.2
> - etcd: 默认 v3.2.18，同时支持升级至 v3.2.24

## 如何升级

### 第一步：下载最新安装包

1.1. 下载 [KubeSphere Advanced Edition 1.0.1 安装包](https://kubesphere.io/download) 至已安装了 1.0.0 的环境，获取下载链接后可使用 `curl -O url` or `wget url` 命令下载至待安装机器，并执行以下命令。

```bash
$ tar -zxf kubesphere-all-advanced-1.0.1.tar.gz
```

1.2. 进入 “`kubesphere-all-advanced-1.0.1`” 目录

```bash
$ cd kubesphere-all-advanced-1.0.1
```

#### 查看版本参数 (可选)

待升级的组件版本号已在  /conf/vars.yml 文件中定义，默认情况下将升级至已指定的版本，若需要修改可编辑其参数。

```bash
## Change this to use another Kubernetes version
ks_version: 1.0.1
kube_version: v1.12.5
etcd_version: v3.2.18
```

### 第二步：修改配置文件 

升级将默认以 1.0.1 的 conf 目录下的配置文件进行升级，因此在升级前需要将 1.0.0 中 conf 下的配置文件中修改过的参数都同步到 1.0.1，修改配置文件分以下两种情况：

#### All-in-One

若 1.0.0 是以 **all-in-one** 模式安装的单节点集群，那么升级前在 1.0.1 中无需修改 `conf/hosts.ini` 文件，但需要确认 1.0.0 的 `conf/vars.yml` 参数配置是否修改，若在 1.0.0 中已作修改则需要在 1.0.1 中同步所有修改的参数。

例如，目前 1.0.1 中默认使用 [Local](https://kubernetes.io/docs/concepts/storage/volumes/#local) 作为存储类型，如果 1.0.0 配置和使用的是 QingCloud 块存储、NFS、Ceph RBD 或 GlusterFS 这一类存储，那么在 `vars.yml` 中需要修改成对应的存储配置参数，并将 Local 的存储配置部分设置为 false，参数释义详见 [存储配置参数](../storage-configuration)。

#### Multi-Node 

若 1.0.0 是以 **multi-node** 模式安装的多节点集群，那么升级前需将 1.0.0 的 `conf/hosts.ini` 和 `conf/vars.yaml` 中的配置都同步到 1.0.1 的对应文件中：
   - 将 1.0.0 的 `conf/hosts.ini` 中的主机参数配置覆盖至 1.0.1 的 `conf/hosts.ini`，参数释义详见 [Multi-Node 模式 - 准备安装配置文件](../multi-node)。
   - 将 1.0.0 的 `conf/vars.yml` 中所有修改过的参数配置同步至 1.0.1 的 `conf/vars.yml`。例如，1.0.0 配置使用的是 QingCloud 块存储、NFS、Ceph RBD 或 GlusterFS 这一类存储，那么在 `conf/vars.yml` 中也需要修改成对应的存储配置参数，并将 Local 的存储配置部分设置为 false，参数释义详见 [存储配置参数](../storage-configuration)。 

> 注意：`conf/vars.yml` 中的配置都是 `key:value` 的形式，QingCloud CSI 和 NFS in Kubernetes 在 1.0.1 的 `conf/vars.yml` 中 key 已作修改，若使用了这两类存储则应使用 1.0.1 中的 key。

### 第三步：开始升级

参考如下步骤进行升级：

3.1. 在 `kubesphere-all-advanced-1.0.1` 目录下进入 `/script` 目录，执行 `upgrade.sh` 脚本，建议使用 root 用户：

```bash
$ ./upgrade.sh
```

3.2. 在以下返回中输入 `yes` 开始升级：

```
ks_version: 1.0.0 to 1.0.1
k8s_version: v1.12.3 to v1.12.5

The relevant information is shown above, please confirm:  (yes/no) yes
```

3.3. 由于升级是对逐个节点进行升级，因此升级时间与集群节点规模与网络状况相关。升级完成后，可使用之前的 KubeSphere 访问地址和账户登陆 Console，点击右上角的「关于」查看版本是否更新成功。

![查看版本号](/advanced-1.0.1.png)