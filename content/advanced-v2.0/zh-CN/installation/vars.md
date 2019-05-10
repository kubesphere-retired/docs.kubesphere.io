---
title: "集群组件配置释义"
---

用户在获取 installer 并解压至目标安装机器后，如果需要查看或修改存储、网络、组件版本、可选安装项 (如 GitLab、Harbor)、外部负载均衡器、Jenkins、邮件服务器等配置参数时，可参考以下说明进行修改，本文档对 installer 中的安装配置文件 `conf/vars.yml` 进行说明，简单介绍每一个字段的意义。

### 存储相关配置

Installer 默认使用 local 类型的存储方便 all-in-one 模式进行安装，若使用 Multi-node 进行安装，则需要在 installer 中禁用 local 并修改存储配置，存储配置相关参数释义请参考 [存储配置说明](../storage-configuration)。

### 集群组件相关配置

**参数说明：**

| 参数 | 含义 | 
|---|---|
| ks_version | KubeSphere 版本号 | 
| kube_version | Kubernetes 版本号 | 
| etcd_version | etcd 版本号 | 
| openpitrix_version | OpenPitrix 版本号 | 
| kube\_network\_plugin | 默认的网络插件（支持 Calico、Flannel） | 
| kube\_service\_addresses | Service 网络 IP 地址段（未被使用的地址段） | 
| kube\_pods\_subnet | Pod 网络 IP 地址段（未被使用的地址段） | 
| kube\_proxy\_mode | kube-proxy 模式默认 ipvs (支持 ipvs, iptables) | 
| kubelet\_max\_pods | 单台机器默认 Pod 数量 | 
| dns_mode | DNS 模式，建议 coredns | 
| console_port | KubeSphere 控制台访问端口（默认 30880） | 
| loadbalancer_apiserver.address | 外部负载均衡器地址 | 
| loadbalancer_apiserver.port | 外部负载均衡器端口 |
| apiserver\_loadbalancer\_domain_name | 负载均衡器域名，默认 lb.kubesphere.local | 
|qingcloud\_lb\_enable | 是否安装 QingCloud LB 插件 (需在 QingCloud 云平台安装) |
| prometheus\_memory\_size | Prometheus 内存请求大小 | 
| prometheus\_volume\_size | Prometheus 存储空间大小 | 
| keep\_log\_days | 集群内置的 Elasticsearch 中日志保留时间，默认是 7 天 |
| kibana_enable | 是否部署 Kibana （默认 false） | 
| elasticsearch\_volume\_size | Elasticsearch 存储空间 | 
| EMAIL\_SMTP\_HOST | SMTP 邮件服务器地址 | 
| EMAIL\_FROM\_ADDR | 通知邮箱地址 | 
| EMAIL\_FROM\_NAME | 通知邮件名称 | 
| EMAIL\_USE\_SSL | 是否启用 ssl | 
| EMAIL\_SMTP\_PORT | SMTP 邮件服务器端口 | 
| EMAIL\_FROM\_PASS | SMTP 邮件服务器密码 | 
| jenkins\_memory\_lim | jenkins 内存限制 | 
| jenkins\_memory\_req | jenkins内存请求 | 
| Java_Opts | jvm 启动参数 | 
| JenkinsLocationUrl | jenkins 域名 | 
| harbor_enable | 是否安装 Harbor | 
| harbor_domain | Harbor 域名 | 
| gitlab_enable | 是否部署 GitLab | 
| gitlab\_hosts\_domain | GitLab 域名 | 
| nvidia\_accelerator\_enabled | 是否开启 Nvidia GPU 加速 | 
| nvidia\_gpu\_nodes | hosts.ini 中要开启 GPU 加速的节点名称（列表） | 
| sonarqube_enable | 是否集成并开启 SonarQube  | 
| sonar\_server\_url | 已有 SonarQube 地址（如需集成安装，注释） | 
| sonar\_server\_token | 已有 SonarQube token（如需集成安装，注释） | 

