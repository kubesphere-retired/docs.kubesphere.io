---
title: "集群组件配置释义"
---

用户在获取 installer 并解压至目标安装机器后，如果需要查看或修改存储、网络、组件版本、可选安装项 (如 GitLab、Harbor)、外部负载均衡器、Jenkins、邮件服务器等配置参数时，可参考以下说明进行修改，本文档对 installer 中的安装配置文件 `conf/vars.yml` 进行说明，简单介绍每一个字段的意义。

### 负载均衡器插件与 QingCloud CSI 配置

配置文件 `conf/vars.yml` 中的前 9 项 qingcloud 开头的配置项是与 QingCloud 云平台负载均衡器插件和 QingCloud CSI 块存储插件相关的公共配置参数，第 10、11 项是启用安装 QingCloud 负载均衡器插件和私有网络配置，释义分别在 [安装负载均衡器插件](../qingcloud-lb) 与 [存储配置说明 - QingCloud 云平台块存储](../storage-configuration/#qingcloud-云平台块存储)。

### 存储相关配置

Installer 默认使用 local 类型的存储方便 all-in-one 模式进行安装，若使用 Multi-node 进行安装，则需要配置持久化存储作为存储服务端再执行安装，在 `conf/vars.yml` 支持配置 QingCloud CSI、Ceph RBD、NFS Client、NeonSAN CSI、GlusterFS 等，存储配置相关参数释义请参考 [存储配置说明](../storage-configuration)。

### 集群组件相关配置

**参数说明：**

| 参数 | 含义 | 
|---|---|
| ks_version | KubeSphere 版本号 | 
| kube_version | Kubernetes 版本号 | 
| etcd_version | etcd 版本号 | 
| openpitrix_version | OpenPitrix 版本号 | 
| ks_image_pull_policy| 默认 IfNotPresent，表示优先使用本地镜像，还支持 Always (尝试重新下载镜像) 和 Never (仅使用本地镜像) |
| kube\_network\_plugin | 默认的网络插件（支持 Calico、Flannel） | 
| kube\_service\_addresses | Service 网络 IP 地址段（未被使用的地址段） | 
| kube\_pods\_subnet | Pod 网络 IP 地址段（未被使用的地址段） | 
| kube\_proxy\_mode | kube-proxy 模式默认 ipvs (支持 ipvs, iptables) | 
| kubelet\_max\_pods | 单台机器默认 Pod 数量 | 
| dns_mode | DNS 模式，建议 coredns | 
| console_port | KubeSphere 控制台访问端口（默认 30880） | 
|disableMultiLogin | 禁止同一用户多点登录，默认 true 即禁用 |
| loadbalancer_apiserver.address | 外部负载均衡器地址 | 
| loadbalancer_apiserver.port | 外部负载均衡器端口 |
| apiserver\_loadbalancer\_domain_name | 负载均衡器域名，默认 lb.kubesphere.local | 
|periodic_cleaning_time| weekly，Docker 自动清理镜像的周期 |
|docker_registry_mirrors| 默认 Docker 镜像仓库的 mirror 仓库，可以加快镜像下载 (国外地区下载可将此参数注释) |
|etcd_backup_period | 默认备份的周期为 30 分钟|
|keep_backup_number | 默认保留最近 5 次备份的数据 |
|etcd_backup_dir | 默认备份的目录为 "/var/backups/kube_etcd" |
| prometheus\_memory\_size | Prometheus 内存请求大小 | 
| prometheus\_volume\_size | Prometheus 存储空间大小 | 
| keep\_log\_days | 集群内置的 Elasticsearch 中日志保留时间，默认是 7 天 |
| kibana_enable | 是否部署 Kibana （默认 false） | 
| elasticsearch\_volume\_size | Elasticsearch 存储空间 | 
|EMAIL_SMTP_HOST | SMTP 邮件服务器地址 |
|EMAIL_SMTP_PORT | SMTP 邮件服务器端口  |
|EMAIL_FROM_ADDR | 发件人邮箱地址 |
|EMAIL_FROM_NAME | 通知邮件名称 |
|EMAIL_FROM_PASS | 密码|
|EMAIL_USE_SSL | 是否开启 SSL 配置 |
| jenkins\_memory\_lim | Jenkins 内存限制 | 
| jenkins\_memory\_req | Jenkins 内存请求 | 
| Java_Opts | jvm 启动参数 | 
| JenkinsLocationUrl | jenkins 域名 | 
| harbor_enable | 是否安装 Harbor | 
| harbor_domain | Harbor 域名 | 
| gitlab_enable | 是否部署 GitLab | 
| gitlab\_hosts\_domain | GitLab 域名 | 
| sonarqube_enable | 是否集成并开启 SonarQube，默认安装内置的 SonarQube | 
| sonar\_server\_url | 对接已有的外部 SonarQube 地址（如需集成安装则取消注释） | 
| sonar\_server\_token | 对接已有 SonarQube token（如需集成安装则取消注释） | 
| nvidia\_accelerator\_enabled | 是否开启 Nvidia GPU 加速 | 
| nvidia\_gpu\_nodes | hosts.ini 中要开启 GPU 加速的节点名称（列表），参考以下配置示例 | 

**GPU 节点配置示例**

注意，在安装前可对 GPU 节点在 `vars.yml` 文件中进行设置，例如在 `hosts.ini` 文件配置的两台工作节点 `node1` 是 CPU 节点， `node2` 是 GPU 节点，那么在 `vars.yml` 仅需要在该处填写 node2，注意 "-" 前面需缩进两格。

```yaml
 nvidia_accelerator_enabled: true
 nvidia_gpu_nodes:
   - node2
```
