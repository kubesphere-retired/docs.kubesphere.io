---
title: "安装内置 GitLab" 
---

​KubeSphere Installer 集成了 Harbor 的 Helm Chart (版本为 harbor-18.11.1)，内置的 Gitlab (版本为 v11.3.4)作为可选安装项，用户可以根据团队项目的需求来配置安装，方便用户对代码仓库的管理，仅需安装前在配置文件 `conf/vars.yml`中简单配置即可，具体可参考以下步骤安装和访问 GitLab。

## 修改配置文件

1、安装 KubeSphere 前，在 Installer 中的 `conf/vars.yml`文件中，参考如下配置修改。

```conf/vars.yml
#GitLab deployment
gitlab_enable: true
gitlab_hosts_domain: devops.kubesphere.local
```

2、修改后保存，然后执行安装脚本，即可通过 Helm Chart 的方式来安装 GitLab。

## 配置 Docker 访问

### 修改 hosts 配置文件

在集群中所有节点的 `/etc/hosts`文件中，需要参考如下添加一条记录：

```bash
192.168.0.24 gitlab.devops.kubesphere.local
```

**说明：192.168.0.24 是当前主机的内网 IP，请根据实际情况填写。若需要将 Gitlab 服务暴露给集群外部用户使用，则需要在外网配置 DNS 记录（DNS 服务器处或者用户的本地 hosts 文件内），把域名** `gitlab.devops.kubesphere.local`**对应到相应的外网 IP，并将 Gitlab 端口30080、30090、30443进行端口转发和开放防火墙，确保外部流量可以通过该端口(端口映射关系为30080:80，30090:22，30443:443)。**

###浏览器访问配置

KubeSphere 和 GitLab 都安装完成后，若需要在集群外部访问 GitLab，请在本地的 `/etc/hosts`文件中参考如下示例添加一行记录，然后才可以在浏览器访问GitLab。

```bash
139.198.10.10 gitlab.devops.kubesphere.local
```

**注意：**`139.198.10.10`**是 KubeSphere 集群的公网 IP，请根据实际情况填写。在外网访问 GitLab，需要绑定公网 IP 并配置端口转发，若公网 IP 有防火墙，请在防火墙添加规则放行对应的端口30080(HTTP)、30443(HTTPS)、30090(SSH)，保证外网流量可以通过该端口，外部才能够访问。**

GitLab 服务对外暴露的节点端口 (NodePort) 为30080(HTTP)、30443(HTTPS)、30090(SSH)，在浏览器中可以通过 `{$域名}:{$NodePort}`如 `http://gitlab.devops.kubesphere.local:30080`访问 GitLab 登录页面。默认的GitLab用户名和密码为 `admin / passw0rd `。关于 GitLab 的使用详见 [GitLab文档](<https://docs.gitlab.com/ee/README.html>)。

![gitlab](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-gitlab.png)

## 使用 GitLab 示例

​关于 GitLab 的详细使用详见[GitLab文档](<https://docs.gitlab.com/ee/README.html>)。本示例以`devops-sample`为例展示如何从GitHub导入项目至GitLab。

​	1、请先将 GitHub 仓库[`devops-sample-s2i`](<https://github.com/kubesphere/devops-sample-s2i>)fork至您个人的 GitHub 仓库。。

![Fork](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-Fork.png)



​	2、使用 Kubesphere 默认的用户名和密码 `admin / passw0rd`登陆 GitLab 后，选择`Create a project`。

![create](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-create.png)

​	3、选择import project from GitHub。

![import](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-import.png)

​	4、按照提示加入个人 Token，Personal access token 可在GitHub[Setting](<https://github.com/settings/tokens/new>)页面生成。然后可选择 GitHub repositories。

![token](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-token.png)

​	选择[devops-sample-s2i](https://github.com/kubesphere/devops-sample-s2i)项目Import。

​	5、等待 Status 显示为 Done，即导入成功。

![done](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-done.png)

回到 Project 主页面，即可看到项目导入成功。

![succ](https://kubesphere-docs.pek3b.qingstor.com/png/gitlab-succ.png)