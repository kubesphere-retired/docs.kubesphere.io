---
title: "安装使用内置 GitLab"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere Installer 内置的 Gitlab (版本为 v11.8.1) 作为可选安装项，用户可以根据团队项目的需求来配置安装，方便用户对代码仓库的管理，KubeSphere 安装前或安装后都可以通过简单的配置单独开启 GitLab 的安装，具体可参考以下步骤安装和访问 GitLab。

<font color=red>注意，内置的 GitLab 不建议用在生产环境，仅建议用于开发测试环境方便快速搭建测试；关于如何搭建高可用的 GitLab 请参考 [GitLab 官方文档](https://docs.gitlab.com/)</font>。

> 注意：目前 GitLab 安装暂不支持块存储，安装前需预先配置 Local Volume、NAS 或 GlusterFS 作为集群的存储服务端。
> - 测试环境可以直接使用默认 Local Volume 进行安装。
> - 若您在 QingCloud 云平台部署请参考 [QingCloud vNAS](../../faq/faq-install/#安装前如何配置-qingcloud-vnas)。
> - 若您自行部署的 NFS 或 GlusterFS 服务端，在 `conf/common.yaml` 的配置请参考 [存储配置说明 - GlusterFS 或 NFS](../../installation/storage-configuration/#glusterfs)。

## 安装前开启 GitLab 组件安装

### 第一步：修改配置文件

1、安装 KubeSphere 前，在 Installer 中的 `conf/common.yaml` 文件中，参考如下配置修改。

```yml
# GitLab deployment
gitlab_enable: true
gitlab_hosts_domain: devops.kubesphere.local
```

2、修改后保存，然后执行安装脚本，即可通过 Helm Chart 的方式来安装 GitLab。

### 第二步：配置 GitLab 访问

<!-- 在集群中所有节点的 `/etc/hosts` 文件中，需要参考如下添加一条记录：

```bash
192.168.0.24 gitlab.devops.kubesphere.local
```

> 说明：192.168.0.24 是当前主机的内网 IP，请根据实际情况填写。若需要将 Gitlab 服务暴露给集群外部用户使用，则需要在外网配置 DNS 记录（DNS 服务器处或者用户的本地 hosts 文件内），把域名 `gitlab.devops.kubesphere.local` 对应到相应的外网 IP。 -->

2、KubeSphere 和 GitLab 都安装完成后，若需要在集群外部访问 GitLab，请在本地的 `/etc/hosts` 文件中参考如下示例添加一行记录，然后即可在浏览器访问 GitLab。

```bash
# {$IP} {$GitLab 域名}
139.198.10.10 gitlab.devops.kubesphere.local
```

> 注意：在外网访问 GitLab，需要绑定公网 IP 并配置端口转发，若公网 IP 有防火墙，请在防火墙添加规则放行 GitLab 的端口 `30080` (HTTP) 保证外网流量可以通过该端口，外部才能够访问。例如在 QingCloud 云平台进行上述操作，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。
>
> 提示：若需要在外网使用 GitLab， HTTPS 端口 30443 和 SSH 端口 (输入 `kubectl get svc -n kubesphere-devops-system | grep 22:` 查看) 也需要保证外网流量可以通过这些端口。

3、在浏览器中可以通过 `{$域名}:{$NodePort}` 即 `http://gitlab.devops.kubesphere.local:30080` 访问 GitLab 登录页面。默认的 GitLab 用户名和密码为 `admin / P@88w0rd `。


![gitlab](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-gitlab.png)

## 安装后开启 GitLab 组件安装

通过修改 ks-installer 的 configmap 可以选装组件，执行以下命令。

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

**参考如下修改 ConfigMap**

```yaml
    gitlab:
      enabled: True
      domain: devops.kubesphere.local
```

保存退出，参考 [验证可插拔功能组件的安装](../verify-components) ，通过查询 ks-installer 日志或 Pod 状态验证功能组件是否安装成功。


## 使用 GitLab 示例

本示例以 `devops-java-sample` 为例展示如何从 GitHub 导入项目至 GitLab。

​1、请先将 GitHub 仓库 [devops-java-sample](<https://github.com/kubesphere/devops-java-sample>) Fork 至您个人的 GitHub 仓库。

![](https://pek3b.qingstor.com/kubesphere-docs/png/fork-repo.png))


​2、使用 Kubesphere 默认的用户名和密码 `admin / P@88w0rd ` 登陆 GitLab 后，选择 `Create a project`。

![create](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-create.png)

​3、选择 「Import project from GitHub」。

![import](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-import.png)

​4、按照提示加入个人 Token，Personal access token 可在 GitHub [Setting](<https://github.com/settings/tokens/new>) 页面生成。然后可选择 GitHub repositories。

![token](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-token.png)

​5、选择 [devops-java-sample](https://github.com/kubesphere/devops-java-sample) 项目 Import 至 GitLab。

​6、等待 Status 显示为 Done，即导入成功。

![done](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-done.png)

7、回到 Project 主页面，即可看到项目导入成功。

![succ](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-succ.png)

> 提示：关于 GitLab 的使用详见 [GitLab 文档](<https://docs.gitlab.com/ee/README.html>)。
