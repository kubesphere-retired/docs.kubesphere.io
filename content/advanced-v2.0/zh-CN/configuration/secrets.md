---
title: "密钥"
---

密钥 (Secret) 解决了密码、token、密钥等敏感数据的配置问题，配置密钥后不需要把这些敏感数据暴露到镜像或者工作负载 (Pod) 的 Spec 中。密钥可以在创建工作负载时以存储卷或者环境变量的方式使用。

登录 KubeSphere 控制台，在所属的企业空间中选择已有 **项目** 或新建项目，访问左侧菜单栏，点击 **配置中心 ➡ 密钥**，进入密钥列表页。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190514094405.png)

## 创建 Secret

创建密钥支持两种方式，**页面创建** 和 **编辑模式** 创建，以下主要介绍页面创建的方式。若选择以编辑模式，可点击右上角编辑模式进入代码界面，支持 yaml 和 json 格式，可以方便习惯命令行操作的用户直接在页面上编辑 yaml 文件创建密钥。

![编辑模式](/secret-cmd.png)

### 第一步：填写基本信息

在服务列表页，点击 **创建** 按钮，填写基本信息:

- 名称：为密钥起一个简洁明了的名称，便于快速了解、浏览和搜索。
- 描述信息：详细介绍密钥的特性，当用户想进一步了解该密钥时，描述内容将变得尤为重要。

![基本信息](/secret-basic.png)

### 第二步：Secret 设置

密钥支持以下五种类型：

- 默认 (Opaque)：base64 编码格式的 Secret，用来存储密码、密钥等，这种类型应用得比较多。
例如：

```yaml
data:
  password: hello123
  username: guest
```

- TLS (kubernetes.io/tls)：常用于保存 TLS 证书和私钥等信息，可用来加密 Ingress，TLS secret 中必须包含名为 tls.crt 和 tls.key 的密钥，以 Credential 和 Private Key 保存。
例如：

```yaml
apiVersion: v1
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
kind: Secret
metadata:
  name: testsecret
  namespace: default
type: kubernetes.io/tls
```

- 镜像仓库密钥 (kubernetes.io/dockerconfigjson)：用来存储镜像仓库的认证信息，比如下面这类信息，详见 [镜像仓库](../image-registry)：
   - 仓库地址: dockerhub.qingcloud.com
   - 用户名: guest
   - 密码: 'guest'
   - 邮箱: 123@test.com


- 账号密码密钥：用来存储系统的账号密码，例如 DockerHub 或 GitHub。


- 自定义：支持用户自己创建一种密钥类型 (type)，格式与默认 (Opaque) 类型相似，都是键值对的形式。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190429154941.png)

## 使用密钥

在当前的项目中创建好密钥之后，创建工作负载时可以通过两种方式使用该密钥：

- 以 Volume 方式，在添加存储卷时点击 **引入配置中心** 选择创建的密钥。
- 以环境变量方式，在添加容器镜像的高级设置中，点击 **引入配置中心** 选择创建的密钥。

关于如何使用密钥，建议参考 [示例一 - 部署 MySQL](../../quick-start/mysql-deployment)。

## 创建常用的几类密钥

### 创建 DockerHub 密钥

1、以项目普通用户 `project-regular` 进入之前创建的项目 `demo-namespace`，在左侧的配置中心菜单下，点击 `密钥`，进入密钥管理界面。

![create-ca](https://kubesphere-docs.pek3b.qingstor.com/png/create-ca.png)

2、点击创建，创建一个用于 DockerHub 登录的密钥；

- 名称：必填，此名称作为改密钥的名称使用，此处命名为 **dockerhub-id**
- 别名：为了方便理解可自定义设置
- 描述信息：简单描述该密钥的用途等相关信息，可自定义

然后点击下一步

![name-ca](https://kubesphere-docs.pek3b.qingstor.com/png/name-ca.png)

- 类型：选择 **镜像仓库密钥**
- 仓库地址：填写 DockerHub 的仓库地址，如docker.io
- 用户名：填写您个人的 DockerHub 的用户名
- 密码：填写您个人的 DockerHub 的密码

3、完成后点击 「创建」。

### 创建 GitHub 密钥

同上，创建一个用于 GitHub 的密钥，凭证 ID 命名为 **github-id**，类型选择 `账号密码密钥`，输入您个人的 GitHub 用户名和密码，完成后点击 **确定**。


