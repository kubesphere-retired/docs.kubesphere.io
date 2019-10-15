---
title: "升级"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere 目前最新的版本 2.0.2 已发布，该版本修复了已知的 Bug，关于 2.0.2 版本的更新详情可参考 [Release Note - v2.0.2](../../release/release-v202)。

若您已安装的环境为 1.0.x、2.0.0 或 2.0.1 版本，我们强烈建议您下载 2.0.2 版本的 Installer 并升级至最新的版本 2.0.2，最新的 Installer 支持将 KubeSphere 从 1.0.x 或 2.0.x 一键升级至 2.0.2，无需卸载和重新安装；同时支持升级 Kubernetes 和 etcd 至指定版本，升级过程中所有节点将会逐个升级，可能会出现短暂的应用服务中断现象，请您安排合理的升级时间。


## 如何升级

### 第一步：下载最新安装包

下载最新的 `KubeSphere v2.1.0` 安装包至任务执行机，进入安装目录。

```bash
$ curl -L https://kubesphere.io/download/stable/advanced-2.0.2 > advanced-2.0.2.tar.gz && tar -zxf advanced-2.0.2.tar.gz && cd kubesphere-all-advanced-2.0.2/scripts
```

### 第二步：修改配置文件 

升级将默认读取 2.0.2 的 conf 目录下的配置文件，因此在升级前需要将原有安装包中 conf 目录下的配置文件中的参数都同步到 2.0.2 版本安装包的对应文件中，修改配置文件分以下两种情况 (以下说明都以 2.0.1 作为示范)。

<font color=red>注意，在升级前请确保主机规格满足 2.0.2 的主机最低规格配置。</font> 请根据您的安装模式参考 [All-in-One 模式 - 准备主机](../all-in-one/#第一步-准备主机) 或 [Multi-Node 模式](../multi-node/#第一步-准备主机) 主机规格表。

#### All-in-One

若 2.0.1 是以 **all-in-one** 模式安装的单节点集群，那么升级前在 2.0.2 中无需修改 `conf/hosts.ini` 文件，仅需要确认 2.0.1 的 `conf/vars.yml` 参数配置是否修改，若有修改则需要在 2.0.2 的对应文件中同步所有修改的参数。

例如，目前 2.0.2 中默认使用 [Local](https://kubernetes.io/docs/concepts/storage/volumes/#local) 作为存储类型，如果您的 2.0.1 配置使用了其它存储类型，如 QingCloud 块存储、NFS、Ceph RBD 或 GlusterFS 等，那么在 2.0.2 安装包的 `conf/vars.yml` 中也需要进行相应的设置（即与 2.0.1 的配置保持一致），参数释义详见 [存储配置参数](../storage-configuration)。

#### Multi-Node 

若 2.0.1 是以 **multi-node** 模式安装的多节点集群，那么升级前需将当前 Installer 中的 `conf/hosts.ini` 和 `conf/vars.yaml` 中的配置都同步到 2.0.2 的对应文件中：
   - 将 2.0.1 的 `conf/hosts.ini` 中的主机参数配置覆盖至 2.0.2 安装包的 `conf/hosts.ini`，参数释义详见 [Multi-Node 模式 - 准备安装配置文件](../multi-node)。
   - 选取 2.0.1 的 `conf/vars.yml` 中所有修改过的参数配置项的值同步至 2.0.2 `conf/vars.yml` 中的对应项。例如，2.0.1 配置使用的是 QingCloud 块存储、NFS、Ceph RBD 或 GlusterFS 这一类存储，那么在 2.0.2 安装包的 `conf/vars.yml` 中也要进行相应的设置（即与 2.0.1 的配置保持一致），参数释义详见 [存储配置参数](../storage-configuration)。
   - 注意，2.0.2 可选配置项如负载均衡器插件、邮件服务器、SonarQube 配置，在 Installer 的 `conf/vars.yml` 中可按需进行安装。


### 第三步：开始升级

完成上述配置后，参考如下步骤进行升级：

3.1. 在 `kubesphere-all-advanced-2.0.2` 目录下进入 `/script` 目录，执行 `upgrade.sh` 脚本，建议使用 **root** 用户：

```bash
$ ./upgrade.sh
```

3.2. 在以下返回中输入 `yes` 开始升级：

```
ks_version: 2.0.1 to 2.0.2
k8s_version: v1.12.5 to v1.13.5

The relevant information is shown above, Please confirm:  (yes/no)
```

3.3. 由于升级是对逐个节点进行升级，因此升级时间与集群节点规模与网络状况相关。升级完成后，可使用之前的 KubeSphere 访问地址和账户登陆 Console，点击右上角的「关于」查看版本是否更新成功。

