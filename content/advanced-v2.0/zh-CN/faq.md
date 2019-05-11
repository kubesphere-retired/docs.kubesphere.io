---
title: "常见问题" 
---

### 如何快速了解 KubeSphere

1、作为新手，如何快速了解 KubeSphere 的使用？

答：我们提供了多个快速入门的示例包括工作负载和 DevOps 工程，建议从 [快速入门](../../zh-CN/quick-start/quick-start-guide) 入手，参考 **快速入门** 并实践和操作每一个示例。

### Multi-Node 安装配置相关问题

2、[Multi-Node 模式](../installation/multi-node) 安装时，如果某些服务器的 **Ubuntu** 系统默认管理员用户为 `ubuntu`，若切换为 `root` 用户进行安装，应该如何配置和操作？

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


### 流水线运行报错相关问题

5、创建 Jenkins 流水线后，运行时报错怎么处理？

![流水线报错](/faq-pipeline-error.png)

答：最快定位问题的方法即查看日志，点击 **查看日志**，具体查看出错的阶段 (stage) 输出的日志。比如，在 **push image** 这个阶段报错了，如下图中查看日志提示可能是 DockerHub 的用户名或密码错误。

![查看日志](/faq-pipeline-log.png)

6、运行流水线失败时，查看日志发现是 Docker 镜像 push 到 DockerHub 超时问题 (Timeout)，比如以下情况，要怎么处理？

![docker超时问题](/pipeline-docker-timeout.png)

答：可能由于网络问题造成，建议尝试再次运行该流水线。

7、流水线运行时遇到如下报错应如何处理？

```
+ git push http://****:****@github.com/****/devops-java-sample.git --tags
fatal: unable to access 'http://****:****@github.com/****/devops-java-sample.git/': Could not resolve host: yunify.com; Unknown error
script returned exit code 128  
```

答：可能是 GitHub 账号或密码带有 "@" 这类特殊字符，需要用户在创建凭证时对密码进行 urlencode 编码，可通过一些第三方网站进行转换 (比如 `http://tool.chinaz.com/tools/urlencode.aspx`)，然后再将转换后的输出粘贴到对应的凭证信息中。

### 如何查看 kubeconfig 文件

8、如何查看当前集群的 Kubeconfig 文件？

答：用户可以点击 “小锤子” 工具箱的图标，选择「kubeconfig」即可查看，仅管理员用户有权限查看。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190506151204.png)

### CPU 用量异常问题

9、为何安装后 CPU 用量数值异常大？

![CPU 用量数值异常大](https://pek3b.qingstor.com/kubesphere-docs/png/20190425174519.png)

答：Kubesphere 计算 CPU 用量的方法是求 user 、 nice 、 system 、 iowait 、 irq 、 softirq 以及 steal 七种 CPU 模式下的用量合，数据通过 node_exporter 采集。由于 Linux 内核 4.x 存在 steal 数值异常大的 bug，导致了如上图的异常值。建议尝试重启节点主机，或升级内核版本。

更多信息请参考 [node_exporter issue #742](https://github.com/prometheus/node_exporter/issues/742)

### QingCloud 云平台快存储卷问题

10、为何存储卷创建失败？

答：用户可以查看存储卷的事件，查看 kube-system 项目的 csi-qingcloud-controller-0 容器组的 csi-qingcloud 容器日志，寻找错误关键字。详细问题原因列表：

|问题字样|说明|解决办法|
|----|-----|-----|
|pki access frequency exceed permission denied|此问题通常由其他存储或者集群问题引起，需要继续检查集群状态，有无长时间正在删除的 pvc。|PKI 密钥访问次数过多，调大 PKI 密钥访问频率配额。|
|resource quota exceed permission denied |云平台配额限制|提工单调大相关资源配额，如硬盘容量和个数|
|IO timeout|容器组与云平台 API Server 通信问题，通常私有云出现|使用 [QingCloud CLI](https://docs.qingcloud.com/product/cli/) 检查 config.yaml 配置文件正确性。可能是没有安装云平台 API Server或 Kubernetes 集群内部通信问题|
|Cannot resolve host |私有云环境用户往往仅配置了 hosts 解析云平台 API Server 域名，在容器组内无此记录，造成无法通过 CSI 插件调用云平台 API Server。|需要用户配置 DNS 服务器。|

11、为何存储卷挂载到容器组失败？

答：用户可以查看容器组事件，查看 kube-system 项目的 csi-qingcloud-controller-0 容器组的 csi-qingcloud 容器日志，寻找错误关键字。详细问题原因列表：

|问题字样|说明|解决办法|
|----|-----|-----|
|pki access frequency exceed permission denied|此问题通常由其他存储或者集群问题引起，需要继续检查集群状态，有无长时间正在删除的存储卷。|PKI 密钥访问次数过多，调大 PKI 密钥访问频率配额。|
|cannot find device path |云平台挂盘没主机设备路径。可在 QingCloud Console 查看硬盘的确无设备路径|将存储卷挂载的容器组所属的 工作负载副本数设置为 0。容器组删除成功后，再将工作负载副本数设置为 1 即可|
|PermissionDenied, ... volume can only be attached to ...|存储卷类型无法挂载至容器组调度的节点的类型|改变存储卷类型或设置容器组调度规则|
|IO timeout|容器组与云平台 API Server 通信问题，通常私有云出现|使用 [QingCloud CLI](https://docs.qingcloud.com/product/cli/) 检查 config.yaml 配置文件正确性。可能是没有安装云平台 API Server 或 Kubernetes 集群内部通信问题|
|Cannot resolve host |私有云环境用户往往仅配置了 hosts 解析云平台 API Server 域名，在容器组内无此记录，造成无法通过 CSI 插件调用云平台 API Server。|需要用户配置 DNS 服务器。|

> 说明：
> 若您在使用中遇到任何产品相关的问题，欢迎在 [GitHub Issue](https://github.com/kubesphere/docs.kubesphere.io/issues) 提问。
 