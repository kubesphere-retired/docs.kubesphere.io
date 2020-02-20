---
title: "安装使用内置 Harbor"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: '如何安装使用内置 Harbor 至 Kubernetes'
---

KubeSphere Installer 集成了 Harbor 版本为 1.7.5，内置的 Harbor 作为可选安装项，用户可以根据团队项目的需求来配置安装，方便用户对项目的镜像管理，仅需 `安装前` 在配置文件 `conf/common.yaml` 中简单配置即可。以下步骤演示在 KubeSphere 安装前和安装后如何开启 Harbor 的安装，并访问 Harbor 控制台。

> Harbor 安装需要额外挂载 `5` 块硬盘，若 KubeSphere 部署在云平台则需要考虑硬盘数量是否满足配额要求，若硬盘数量或容量配额不够则需要提工单申请提高配额。

<font color=red>注意，内置的 Harbor 不建议用在生产环境，仅建议用于开发测试环境，关于如何搭建高可用的 Harbor 请参考 [Harbor 官方文档](https://github.com/goharbor/harbor/blob/master/docs/installation_guide.md)</font>。

## 安装前如何开启 Harbor 的安装

**修改安装配置文件**

1、安装 KubeSphere 前，在 Installer 中的 `conf/common.yaml` 文件中，参考如下配置修改。

```yaml
# harbor deployment
harbor_enable: true
harbor_domain: harbor.devops.kubesphere.local
```
2、修改后保存，然后继续参考安装指南执行安装脚本，即可通过 Helm Chart 的方式来安装 Harbor。


## 安装后如何开启 Harbor 的安装

通过修改 ks-installer 的 configmap 可以选装组件，执行以下命令。

```bash
$ kubectl edit cm -n kubesphere-system ks-installer
```

**参考如下修改 ConfigMap**

```yaml
    harbor:
        enabled: False
        domain: harbor.devops.kubesphere.local  ## 是否开启安装 Harbor
```

Harbor 安装将在后台开启，参考 [验证可插拔功能组件的安装](../verify-components) ，通过查询 ks-installer 日志或 Pod 状态验证功能组件是否安装成功。

## 访问 Harbor

注意，访问前需要给 docker 配置 insecure registry，参考 [添加 Harbor 镜像仓库 (http)](../../configuration/image-registry/#http) 进行配置。

### Docker 登录 Harbor  

在登录前，确认是否 harbor 的域名已成功配置到 docker，执行 `docker info` 验证：

```bash
$ docker info

···
Insecure Registries:
  harbor.devops.kubesphere.local:30280
···
```

若看到上述域名信息，说明安装配置成功，可以在后台登录 harbor。

```dockerfile
$ docker login -u admin -p Harbor12345 http://harbor.devops.kubesphere.local:30280

WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

### 使用 Harbor 镜像仓库

关于如何制作镜像、打包上传镜像以及 Dockerfile 的使用详情，请参考 [Docker 官方文档](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)。

KubeSphere 安装成功后，本地已经有了 nginx:1.14-alpine 镜像，因此演示如何在本地给示例镜像 nginx 打 tag 后推送到 Harbor 镜像仓库的 library 项目中：

1、给本地 nginx 镜像打上 1.14-alpine 的 tag。

```bash
docker tag nginx:1.14-alpine harbor.devops.kubesphere.local:30280/library/nginx:1.14-alpine
```

2、推送至 Harbor 镜像仓库的 library 项目中。

```bash
docker push harbor.devops.kubesphere.local:30280/library/nginx:1.14-alpine
```

镜像推送成功即可通过浏览器登录 Harbor，验证推送的结果。

### 浏览器访问 Harbor

KubeSphere 安装成功后，即可在浏览器访问 Harbor 镜像仓库。Harbor 服务对外暴露的节点端口 (NodePort) 为 30280，内置的 Harbor 镜像仓库目前仅支持 http 协议，在浏览器中可以通过 `{$IP}:{$NodePort}` 如 `http://139.198.16.160:30280` 访问 Harbor 登录页面。

> 注意：若需要在外网访问，可能需要绑定公网 EIP 并配置端口转发和防火墙规则，端口转发需要将**内网端口** 30280 转发到**源端口** 30280，然后在防火墙开放这个**源端口**，保证外网流量可以通过该端口，然后才可以通过 `http://{$公网 IP}:{$NodePort}` 访问。例如在 QingCloud 云平台进行上述操作，则可以参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。
> 提示：在浏览器中还可通过域名访问 Harbor，在本地 `/etc/hosts` 添加一行记录 `139.198.16.160 harbor.devops.kubesphere.local`，即可通过 `http://harbor.devops.kubesphere.local:30280` 访问。

1、输入默认的管理员用户名和密码 `admin / Harbor12345` 登录 Harbor。

> 提示：其它用户登录的账号密码与 KubeSphere 的 LDAP 用户账户体系一致。

![Harbor 登录](/harbor-console.png)

2、登录成功后，点击进入 library 项目。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190510164826.png)

3、可以看到 library 项目下已有了 nginx 镜像。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190510230246.png)

## KubeSphere 中使用 Harbor

### KubeSphere 添加 Harbor

> 提示：以下需要在企业空间下的项目中添加镜像仓库，若还未创建企业空间和项目，请参考 [多租户管理快速入门](../../quick-start/admin-quick-start)。

登录控制台，在已创建的企业空间的项目下，左侧菜单栏选择 **配置中心 → 密钥**，点击 **创建**。

#### 第一步：填写基本信息

填写密钥的基本信息，完成后点击 **下一步**。

- 名称：起一个简洁明了的名称，填写 `harbor`
- 别名：支持中文，帮助您更好的区分资源，比如 `内置 Harbor 镜像仓库`
- 描述信息：简单介绍该密钥的功能

![基本信息](/harbor-secret-basic.png)

#### 第二步：填写 Harbor 仓库信息

2.1. 参考如下提示填写 Harbor 仓库的登录信息。

- 仓库地址：填写内置的 Harbor 镜像仓库域名和节点端口 `harbor.devops.kubesphere.local:30280`
- 用户名：admin
- 密码：Harbor12345
- 邮箱：填写个人邮箱

![](https://pek3b.qingstor.com/kubesphere-docs/png/WeChat6512aa8ad5d967a0cf0cdbc6f9b1eb37.png)

2.2. 如果 Harbor 安装配置都正确，并且验证信息都填写无误，即可添加成功。Harbor 镜像仓库添加完成后，可以上传镜像和拉取镜像。

![](/harbor-secret-list.png)


### 使用 Harbor 中的镜像

若需要在 KubeSphere 中使用 Harbor 镜像仓库中的镜像，需要先将相关的镜像构建后上传至 Harbor。

以创建 Deployment (部署) 为例展示如何使用镜像仓库来拉取仓库中的镜像。比如上述步骤已经将镜像 `nginx:1.14-alpine` 推送到了 library 项目，因此以下将演示如何创建工作负载并使用 Harbor 中的示例镜像 `nginx:1.14-alpine`。

1、上述步骤中已将镜像仓库添加到了项目中，因此进入当前项目，选择「工作负载」→「部署」，点击「创建」。


2、 在弹窗中填写基本信息然后点击「下一步」，在容器组模板中需要先选择镜像仓库，镜像为 `harbor.devops.kubesphere.local:30280/library/nginx:1.14-alpine`，对应的格式为 `镜像仓库地址/项目名称/镜像名称:tag`，填写后点击「保存」，然后一直点击下一步直至创建，待创建成功后即可使用该镜像。

> 提示：关于如何创建工作负载的详细步骤说明，请参考快速入门系列文档。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190510231807.png)

> 提示：关于 Harbor 的使用详见 [Harbor 官方文档](https://goharbor.io/docs/)。
