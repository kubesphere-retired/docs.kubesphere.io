---
title: "安装常见问题" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
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

如下，在 `/conf/common.yaml` 中先将 Local Volume Provisioner 设置为 false，然后在 NFS-Client provisioner 进行如下设置：


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
4.1、遇到ansible指令不能用，Command "python setup.py egg_info" failed with error code 1 in/tmp/pip.build.344f90/ansible

答：
方法1：pip install setuptools==33.1.1
方法2：下载新版setuptools，
`wget https://files.pythonhosted.org/packages/e5/53/92a8ac9d252ec170d9197dcf988f07e02305a06078d7e83a41ba4e3ed65b/setuptools-33.1.1-py2.py3-none-any.whl`
`pip install setuptools-33.1.1-py2.py3-none-any.whl`

4.2、dial tcp 20.233.0.1: 443: connect: no route to host"], "stdout": "", "stdout_lines": []}  

答：检查下是不是机器防火墙还开着 建议关掉 systemctl stop firewalld

4.3、FAELED - RETRYING: KubeSphere Waiting for ks-console (30 retries left)一直卡在这里。

答：
检查cpu和内存，目前单机版部署至少8核16G
当`free -m` 时buff/cache占用内存资源多，执行`echo 3 > /proc/sys/vm/drop_caches` 指令释放下内存

4.4、kubectl get pod -n kubesphere-system出现大量的Pending状态时  

答：可以kubectl describe看下这几个没起来的pod，应该是内存不足

4.5、kubesphere v2.0.2 离线安装失败，提示Failed to create 'IPPool' resource: resource already exists: IPPool(default-pool)" 

答：
机器目前需要干净的机器，如果已安装了k8s，则可以参考如下链接安装kubesphere：https://github.com/kubesphere/ks-installer

4.6、centos7.4 2.0.2离线安装后，reboot系统重启服务不恢复

答：
kube-system下的 coredns 没有起来，kubectl describe看下coredns的错误日志;
coredns 无法连接 apiserver，可以执行 `ipvsadm -Ln` 看下 6443 端口是否对应主节点地址

4.7、kubesphere能否独立使用  

答：https://github.com/kubesphere/ks-installer

4.8、centos7.6  file:///kubeinstaller/yum_repo/iso/repodata/repomd.xml: [Errno 14] curl#37 - "Couldn't open file /kubeinstaller/yum_repo/iso/repodata/repomd.xml"
Trying other mirror.

答：
centos7.6系统还不支持离线下载部署。可以用centos7.4或7.5或在线部署。
如果环境可以联网，建议使用在线安装，支持centos7.6
链接：https://pan.baidu.com/s/1HBlBaD69mx6z050sSgj0Kg
提取码：eqe6
把该iso放到离线环境的kubesphere-all-offline-advanced-2.0.2/Repos/下，`umount /kubeinstaller/yum_repo/iso`重新跑

4.9、离线安装失败转为在线安装  

答：刚才执行离线安装修改的yum源，先还原一下 ，/etc/yum.repo.d 有备份

4.10、Could not find a version that satisfies the requirement ansible==2.7.6 (from -r /home/sunhaizhou/all-in-one/kubesphere-all-offline-advanced-2.0.2/scripts/os/requirements.txt (line 1)) (from versions: )
Error: Install the pip packages failed!

答：
方法1：`pip install ansible==2.7.6`
方法2：可以手动umount一下/kubeinstaller/pip_repo/pip27/iso 或者重启机器 应该可以解决该问题

4.11、fatal: [ks-allinone]: FAILED! => {"ansible_facts": {"pkg_mgr": "yum"}, "changed": false, "msg": "The Python 2 bindings for rpm are needed for this module. If you require Python 3 support use the dnf Ansible module instead.. The Python 2 yum module is needed for this module. If you require Python 3 support use the dnf Ansible module instead."}  

答：将机器的python3改成python2
4.12、KubeSphere 2.0.1 安装失败 ：no matches for kind \"S2iBuilderTemplate\

答：
`kubectl get pvc --all-namespaces` 看下pvc是否处于pending状态
如果pvc pending，地址和路径也都配置正确的话，可以试下本地机器上是否可以挂载；如果是自建的nfs，可以看下nfs的配置参数。
先执行uninstall, 然后再install。

4.13、fatal: [hippo04kf]: FAILED! => {"changed": true, "msg": "non-zero return code", "rc": 5, "stderr": "Warning: Permanently added '99.13.XX.XX' (ECDSA) to the list of known hosts.\r\nPermission denied, please try again(publickey,gssapi-keyex,gssapi-with-mic).\r\n", "stderr_lines": ["Warning: Permanently added '99.13.XX.XX' (ECDSA) to the list of known hosts."

答：
只贴了all的格式，ansible_ssh_pass改成ansible_become_pass，最后执行脚本时，需要转成root用户执行。
```
[all]
master ansible_connection=local ip=192.168.0.5 ansible_user=tester ansible_become_pass=@@@@@@
node1 ansible_host=192.168.0.6 ip=192.168.0.6 ansible_user=tester ansible_become_pass=@@@@@@
```
4.14 、ks-devops/jenkins unable to parse quantity's suffix,error found in #10 byte of

答：
有特殊字符无法解析 如果编辑过jenkins的相关配置的话可以检查下是不是写入了特殊字符

4.15、kubesphere-all-offline-advanced-2.0.0 离线安装提示 Failed connect to 192.168.10.137:5080; Connection refused

答：
`docker ps -a|grep nginx`     nginx是否正常启动，且5080端口已监听。
`df -hT|grep -v docker|grep -v kubelet`    看pip和iso是否都已挂载。
以上都有问题的话，机器先停止运行，然后执行uninstall脚本，再运行install脚本。

4.16、failed ansibelundefinedvariable dict object has no attribute address

答：
第一行这样配试下，ip换成自己的，如果有网的话建议联网安装
```
ks-allinone ansible_connection=local ip=192.168.0.2
[local-registry]
ks-allinone
[kube-master]
ks-allinone
[etcd]
ks-allinone
[kube-node]
ks-allinone
[k8s-cluster:children]
kube-node
kube-master
```
4.17、FAILED! => {"reason": "'delegate_to' is not a valid attribute for a TaskInclude

答：
不要手动安装ansible，如果安装过程中出现了ERROR: Command "python setup.py egg_info" failed with error code 1 in /tmp/pip-install-voTIRk/ansible/
./multi-node.sh: line 41: ansible-playbook: command not found
`pip install --upgrade setuptools==30.1.0先执行这个再安装`

4.18、centos7.6 FAILED - RETRYING: KubeSphere| Installing JQ (YUM) (5 retries left),没有jq这个package，我下了jq的二进制包放在/usr/bin目录下，jq可以使用。

答：
可以在kubesphere/roles/prepare/nodes/tasks/main.yaml中注释掉安装jq的相关tasks

4.19、FAILED - RETRYING: ks-alerting | Waiting for alerting-db-init (2 retries left).fatal: [ks-allinone]: FAILED! => {"attempts": 3, "changed": true, "cmd": "/usr/local/bin/kubectl -n kubesphere-alerting-system get pod | grep alerting-db-init | awk '{print $3}'", "delta":  "stdout": "Init:0/1"

答：
检查配置是否满足要求8核cpu、16G。检查存储相关配置。检查本地/etc/resolve.conf下的域名是否都可以ping通。

4.20、2.0.2 版本安装后配置docker 私有库问题，配置了一个 docker 私有库，修改完 /etc/docker/daemon.json 文件，然后重新启动 docker报错。

答：
kubesphere 在安装时指定了 DOCKER_OPTS= --insecure-registry ，所以不能再加载 /etc/docker/daemon.json 的 insecure-registries 设置，
如果要添加的，/etc/systemd/system/docker.service.d文件中添加，重启。

4.21、用的自己搭建的nfs服务器，发现创建的pvc全是pending导致了相关的pod启动不起来。

答：
可以参考 *(rw,insecure,sync,no_subtree_check,no_root_squash)这个配置下nfs，然后先试下主机上是否可以挂载nfs

4.22、ubuntu系统，非root用户安装时，在kubernetes-apps/network_plugin/calico: start calico resources get http://localhost:8080/api?timeout=32s: dial tcp 127.0.0.1: 8080: connect: connection refused  

答：采用root用户安装脚本。
4.23、FAILED - RETRYING: container_download | Download containers if pull is required or told to always pull (all nodes) (4 retries left)  

答：由于到dockerhub网络不是特别好造成的。
### QingCloud 云平台块存储卷问题

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

安装前需在 `conf/common.yaml` 中添加如下两行：

```yaml
external_es_url=SHOULD_BE_REPLACED
external_es_port=SHOULD_BE_REPLACED
``` -->