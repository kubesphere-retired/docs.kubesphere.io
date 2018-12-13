---
title: "密钥"
---

密钥 (Secret) 解决了密码、token、密钥等敏感数据的配置问题，配置密钥后不需要把这些敏感数据暴露到镜像或者工作负载 (Pod) 的 Spec 中。密钥可以在创建工作负载时以存储卷或者环境变量的方式使用。

登录 KubeSphere 控制台，在所属的企业空间中选择已有 **项目** 或新建项目，访问左侧菜单栏，点击 **配置中心 ➡ 密钥**，进入密钥列表页。

![](/create-secret-demo.png)

## 创建 Secret

创建密钥支持两种方式，**页面创建** 和 **编辑模式** 创建，以下主要介绍页面创建的方式。若选择以编辑模式，可点击右上角编辑模式进入代码界面，支持 yaml 和 json 格式，可以方便习惯命令行操作的用户直接在页面上编辑 yaml 文件创建密钥。

![编辑模式](/secret-cmd.png)

### 第一步：填写基本信息

在服务列表页，点击 **创建** 按钮，填写基本信息:

- 名称：为密钥起一个简洁明了的名称，便于快速了解、浏览和搜索。
- 描述信息：详细介绍密钥的特性，当用户想进一步了解该密钥时，描述内容将变得尤为重要。

![基本信息](/secret-basic.png)

### 第二步：Secret 设置

密钥有三种类型：

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


- 自定义：支持用户自己创建一种密钥类型 (type)，格式与默认 (Opaque) 类型相似，都是键值对的形式。

![secret 设置](/secret-setting.png)

## 使用密钥

在当前的项目中创建好密钥之后，创建工作负载时可以通过两种方式使用该密钥：

- 以 Volume 方式，在添加存储卷时点击 **引入配置中心** 选择创建的密钥。
- 以环境变量方式，在添加容器镜像的高级设置中，点击 **引入配置中心** 选择创建的密钥。

关于如何使用密钥，建议参考 [示例一 - 部署 MySQL](../../quick-start/mysql-deployment)。
