
# Uk8s kubesphere 部署篇

由于目前Uhub提供的镜像加速功能不够灵活，原本搭建一个简单http的registry，但是个人觉得添加docker配置项insecure-registries的方式不够优雅，长时间运行不够安全，还是花时间验证如何搭建https的registry 用于完成内网环境下kubespshre部署在Uk8s集群上，虽然这样最开始麻烦了些，但是好处以后申请 Uk8s 集群的时候就不用每个节点都需要绑定EIP了，如果是生产环境可以较少一定开支，也便于维护.

## 部署过程概述

* 需要一台Ucloud云主机，操作系统选CentOS8或者CentOS7
* 安装docker  用于运行registry
* 安装httpd-tools 用于生成http auth文件
* 创建自签名证书,并添加到系统信息
* 启动registry
* 申请需要数量的Uk8s集群
* 集群节点主机添加配置
* 完后kubesphere的部署

##  搭建registry

需要一台Ucloud云主机，绑定eip,最好使用云存储，方便扩容

### 安装必备的软件

在registry节点安装docker和httpd-tools两个必须的软件包

CentOS8 系统执行如下命令：
```
dnf config-manager --add-repo=http://mirrors.ustc.edu.cn/docker-ce/linux/centos/docker-ce.repo
dnf install docker-ce --nobest -y
dnf install httpd-tools -y
systemctl  restart docker && docker pull registry  &> /dev/null &
```

CentOS7 系统执行如下命令：
```
yum-config-manager --add-repo http://mirrors.ustc.edu.cn/docker-ce/linux/centos/docker-ce.repo
yum install docker-ce -y
yum install httpd-tools -y
systemctl  restart docker && docker pull registry  &> /dev/null &
```

### 创建需要的目录:

登陆registry节点执行如下命令:
```
mkdir -pv /data/certs/
mkdir -pv /data/auth/
mkdir -pv /data/docker/registry/
```

### 创建自签名证书

这里是使用自签名证书，创建证书过程如下,登陆registry节点执行如下命令:

```
cd /data/certs/
openssl genrsa 1024 > domain.key
chmod 400 domain.key
openssl req -new -x509 -nodes -sha1 -days 365 -key domain.key -out domain.crt

其中 Common Name (eg, your name or your server's hostname) []:myhub.com 要对应域名
```

### 创建认证

登陆registry节点执行如下命令:
```
htpasswd -Bbn user password > /data/auth/htpasswd
```

### 启动registry

登陆registry节点执行如下命令:
```
docker run -d      \
--name registry    \
-p 443:443         \
--restart=always   \
--privileged=true  \
-e "REGISTRY_HTTP_ADDR=0.0.0.0:443"                       \
-e "REGISTRY_AUTH=htpasswd"                               \
-e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm"          \
-e "REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd"           \
-e "REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt"      \
-e "REGISTRY_HTTP_TLS_KEY=/certs/domain.key"              \
-v /data/docker/registry:/var/lib/registry                \
-v /data/certs/:/certs                                    \
-v /data/auth:/auth                                       \
registry
```

启动registry后，registry节点还要完成如下配置

1. 添加myhub.com解析记录,执行命令: ` echo  "registry_host_ip myhub.com" >> /etc/hosts ` registry_host_ip 需要替换为实际的主机IP
2. 将domain.crt分发到节点,执行命令: ` cat /data/certs/domain.crt >> /etc/pki/tls/certs/ca-bundle.crt `
3. 重启docker服务生效执行命令: ` systemctl restart docker`
4. 仓库登陆认证，执行命令: ` docker login myhub.com -u user -p "password" ` 最后返回 `Login Succeeded` 说明私有registry配置正确

### 同步 kubesphere 3.0 镜像

搭建好内网的registery后，接下来将 kubesphere 3.0 镜像同步到registery中，同步操作如下：

登陆registry节点，将如下文件保存为images.list

```
library/haproxy:2.0.4
library/redis:5.0.5-alpine
osixia/openldap:1.3.0
jimmidyson/configmap-reload:v0.3.0
csiplugin/snapshot-controller:v2.0.1
mirrorgooglecontainers/defaultbackend-amd64:1.4
kubesphere/alertmanager:v0.21.0
kubesphere/kube-rbac-proxy:v0.4.1
kubesphere/kube-state-metrics:v1.9.6
kubesphere/kubectl:v1.0.0
kubesphere/kubefed:v0.3.0
kubesphere/node-exporter:ks-v0.18.1
kubesphere/notification-manager-operator:v0.1.0
kubesphere/notification-manager:v0.1.0
kubesphere/prometheus-config-reloader:v0.38.3
kubesphere/prometheus-operator:v0.38.3
kubesphere/prometheus:v2.19.3
kubespheredev/ks-apiserver:latest
kubespheredev/ks-console:latest
kubespheredev/ks-controller-manager:latest
kubespheredev/ks-installer:latest
kubespheredev/tower:latest
```

然后使用下面的脚本上传镜像

```
#!/bin/bash

for img in  `cat images.list`
do
  docker pull $img
done

pri_repo=myhub.com

if [[ "$pri_repo" != "" ]];then

  for img in  `cat images.list`
  do
         docker tag $img ${pri_repo}/$img
         docker push ${pri_repo}/$img
  done

fi
```

## 申请Uk8s集群并完成初始化配置

在申请完毕Uk8s集群后，每个集群可以完成以下初始化配置

### 设置默认storage
1. 登陆UK8S集群 其中一台master(可以从registry节点主机做跳板登陆) 执行命令：`kubectl  edit sc ssd-csi-udisk` 添加 ` storageclass.kubernetes.io/is-default-class: "true" `

### 初始化集群节点配置

登陆UK8S集群 所有节点，完成如下配置：

1. 添加myhub.com解析记录,执行命令: ` echo  "10.10.184.169 myhub.com" >> /etc/hosts `
2. 将domain.crt分发到节点,并执行命令: ` cat domain.crt >> /etc/pki/tls/certs/ca-bundle.crt `
3. 重启docker服务生效执行命令: ` systemctl restart docker`
4. 仓库登陆认证，执行命令: ` docker login myhub.com -u user -p "password" ` 执行成功后认证信息会记录在 ~/.docker/config.json
5. cp /root/.docker/config.json /var/lib/kubelet/
6. systemctl daemon-reload && systemctl restart kubelet"

## 部署管理集群(kubesphere-host)

1. 创建UK8S 集群，给一台 master 节点，绑定eip,设置外网防火墙，允许30880端口访问
2. 确认完成 `初始化集群节点配置`
3. 修改 kubesphere-installer.yaml `image: myhub.com/kubespheredev/ks-installer:latest`
4. 修改 cluster-configuration.yaml
```
添加 local_registry: myhub.com
将 clusterRole: none 修改为 clusterRole: host
```
5. 部署kubesphere，执行命令: `kubectl  apply -f  kubesphere-installer.yaml ;  kubectl  apply -f  kubesphere-installer.yaml `
6. 部署完毕host集群后，执行命令: `kubectl -n kubesphere-system get cm kubesphere-config -o yaml | grep -v "apiVersion" | grep jwtSecret` 记下返回的结果` jwtSecret: "xxxxxxxxxxxxxxxxxxx"` 后面配置member集群需要修改的参数

## 部署业务集群(kubesphere-member)

1. 创建UK8S 集群
2. 确认完成 `初始化集群节点配置`
3. 修改 kubesphere-installer.yaml `image: myhub.com/kubespheredev/ks-installer:latest`
4. 修改 cluster-configuration.yaml
```
添加 local_registry: myhub.com
修改 jwtSecret：写入部署完毕host集群后最后一步返回的结果
将 clusterRole: none 修改为 clusterRole: member
```
5. 部署kubesphere，执行命令: `kubectl  apply -f  kubesphere-installer.yaml ;  kubectl  apply -f  kubesphere-installer.yaml `

## 将member集群加入主控集群

1. 使用浏览器访问 http://主控集群_eip:30880 默认用户名 admin 密码 P@88w0rd
2. 平台管理 -> 集群管理 -> 添加集群 (完成自定义设置)-> 下一步 -> 默认-> 添加从member集群 master节点文件 /root/.kube/config 的内容
3. 添加其他member集群，重复以上操作

## 参考文档

* Installer 代码开源地址请参考 [ks-installer GitHub](https://github.com/kubesphere/ks-installer/tree/master)
* 多集群管理 [https://github.com/kubesphere/community/tree/master/sig-multicluster/how-to-setup-multicluster-on-kubesphere#MemberCluster]
