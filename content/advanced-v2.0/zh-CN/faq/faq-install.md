---
title: "安装常见问题" 
---

### KubeSphere 安装支持的存储类型

1、KubeSphere 安装支持的存储类型有哪些？如何配置？

答：目前，Installer 支持以下类型的存储作为存储服务端，为 KubeSphere 提供持久化存储 (更多的存储类型持续更新中)：

- QingCloud 云平台块存储
- QingStor NeonSAN (企业级分布式存储)
- Ceph RBD
- GlusterFS
- NFS
- Local Volume (仅限 all-in-one 部署测试使用)


在安装前需要在 Installer 中配置已准备的存储服务端，配置方法详见 [存储安装配置说明](../../installation/storage-configuration)。


### Multi-Node 安装配置相关问题

2、[Multi-Node 模式](../../installation/multi-node) 安装时，如果某些服务器的 **Ubuntu** 系统默认管理员用户为 `ubuntu`，若切换为 `root` 用户进行安装，应该如何配置和操作？

可通过命令 `sudo su` 切换为 root 用户后，在该节点查看是否能 ssh 连接到其他机器，如果 ssh 无法连接，则需要参考 `conf/hosts.ini` 的注释中 `non-root` 用户示例部分，如下面第二步 `hosts.ini` 配置示例所示，而最终执行安装脚本 `install.sh` 时建议以 `root` 用户执行安装。

第一步，查看是否能 ssh 连接到其他机器，若无法连接，则参考第二步配置示例。相反，如果 root 用户能够 ssh 成功连接到其它机器，则可以参考 Installer 中默认的 root 用户配置方式。

```
root@192.168.0.3 # ssh 192.168.0.2
Warning: Permanently added 'node1,192.168.0.2' (ECDSA) to the list of known hosts.
root@192.168.0.2's password: 
Permission denied, please try again.
```
第二步，如下示例使用 3 台机器，参考以下示例修改主机配置文件 `hosts.ini`。

**hosts.ini 配置示例**
```ini
[all]
master ansible_connection=local  ip=192.168.0.1  ansible_user=ubuntu  ansible_become_pass=Qcloud@123
node1  ansible_host=192.168.0.2  ip=192.168.0.2  ansible_user=ubuntu  ansible_become_pass=Qcloud@123
node2  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_user=ubuntu  ansible_become_pass=Qcloud@123

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

### 安装前如何配置 QingCloud vNas

3、KubeSphere 支持对接 [QingCloud vNas](https://www.qingcloud.com/products/nas/) 作为集群的存储服务端，以下说明如何在 [QingCloud 控制台](https://console.qingcloud.com/login) 创建文件存储 vNas：

3.1. 选择 **文件存储 vNAS**，点击 **创建**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307223103.png)

3.2. 自定义名称，并选择与待安装机器相同的私有网络。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307223413.png)

3.3. 点击创建的 vNAS 进入详情页，在共享存储目标下点击 **创建**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307223611.png)

3.4. 目标类型保持 NFS，参考如下截图填写信息，完成后点击 **提交**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307223903.png)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307224027.png)

3.5. 选择 **账户**，点击 **创建**。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307224602.png)

3.6. 自定义名称，IP 地址填写集群机器所在的网段，如 `192.168.0.0/24`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307233711.png)
![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307235304.png)

3.7. 查看 vNAS 的详情页，可以看到内网 IP 与 共享目录，这两处信息则需要在 Installer 中进行指定。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190307235523.png)

如下，在 `/conf/vars.yml` 中先将 Local Volume Provisioner 设置为 false，然后在 NFS-Client provisioner 进行如下设置：


```bash
# NFS-Client provisioner deployment
nfs_client_enable: true
nfs_client_is_default_class: true
# Hostname of the NFS server(ip or hostname)
nfs_server: 192.168.0.22
# Basepath of the mount point to be used
nfs_path: /mnt/shared_dir
```

完成以上设置后，可参考安装指南继续进行配置和安装。

### 安装失败相关问题

4、安装过程中，如果遇到安装失败并且发现错误日志中有这类信息：`The following packages have pending transactions`，这种情况应该如何处理？

![安装问题](/faq-installation-1.png)

答：这是因为有些 transactions 操作没有完成，可以连接到安装失败的节点上，依次执行下列命令，并重新执行 `install.sh` 脚本：

```shell
$ yum install yum-utils -y
$ yum-complete-transaction
$ yum-complete-transaction --cleanup-only
```

### QingCloud 云平台快存储卷问题

5、为什么存储卷创建失败？

答：用户可以查看存储卷的事件，查看 kube-system 项目的 csi-qingcloud-controller-0 容器组的 csi-qingcloud 容器日志，寻找错误关键字。详细问题原因列表：

|问题字样|说明|解决办法|
|----|-----|-----|
|pki access frequency exceed permission denied|此问题通常由其他存储或者集群问题引起，需要继续检查集群状态，有无长时间正在删除的 pvc。|PKI 密钥访问次数过多，调大 PKI 密钥访问频率配额。|
|resource quota exceed permission denied |云平台配额限制|提工单调大相关资源配额，如硬盘容量和个数|
|IO timeout|容器组与云平台 API Server 通信问题，通常私有云出现|使用 [QingCloud CLI](https://docs.qingcloud.com/product/cli/) 检查 config.yaml 配置文件正确性。可能是没有安装云平台 API Server或 Kubernetes 集群内部通信问题|
|Cannot resolve host |私有云环境用户往往仅配置了 hosts 解析云平台 API Server 域名，在容器组内无此记录，造成无法通过 CSI 插件调用云平台 API Server。|需要用户配置 DNS 服务器。|

6、为什么存储卷挂载到容器组失败？

答：用户可以查看容器组事件，查看 kube-system 项目的 csi-qingcloud-controller-0 容器组的 csi-qingcloud 容器日志，寻找错误关键字。详细问题原因列表：

|问题字样|说明|解决办法|
|----|-----|-----|
|pki access frequency exceed permission denied|此问题通常由其他存储或者集群问题引起，需要继续检查集群状态，有无长时间正在删除的存储卷。|PKI 密钥访问次数过多，调大 PKI 密钥访问频率配额。|
|cannot find device path |云平台挂盘没主机设备路径。可在 QingCloud Console 查看硬盘的确无设备路径|将存储卷挂载的容器组所属的工作负载副本数设置为 0。容器组删除成功后，再将工作负载副本数设置为 1 即可|
|PermissionDenied, ... volume can only be attached to ...|存储卷类型无法挂载至容器组调度的节点的类型|改变存储卷类型或设置容器组调度规则|
|PermissionDenied, you can only attach [10] volumes to one instance at most|云平台单个主机挂盘个数超过限制|尝试让容器组重新调度，如：将存储卷挂载的容器组所属的工作负载副本数设置为 0。容器组删除成功后，再将工作负载副本数设置为 1 |
|IO timeout|容器组与云平台 API Server 通信问题，通常私有云出现|使用 [QingCloud CLI](https://docs.qingcloud.com/product/cli/) 检查 config.yaml 配置文件正确性。可能是没有安装云平台 API Server 或 Kubernetes 集群内部通信问题|
|Cannot resolve host |私有云环境用户往往仅配置了 hosts 解析云平台 API Server 域名，在容器组内无此记录，造成无法通过 CSI 插件调用云平台 API Server。|需要用户配置 DNS 服务器。|

<!-- 7、如果想在安装前就将集群内置的 Elasticsearch 替换为外部 Elasticsearch，该如何配置？

安装前需在 `conf/vars.yml` 中添加如下两行：

```yaml
external_es_url=SHOULD_BE_REPLACED
external_es_port=SHOULD_BE_REPLACED
``` -->