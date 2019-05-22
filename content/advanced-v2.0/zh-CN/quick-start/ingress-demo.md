---
title: "应用路由与服务示例"
---

KubeSphere 在项目中为用户项目内置了一个全局的负载均衡器，即应用路由控制器 (Ingress Controller)，为了代理不同后端服务 (Service) 而设置的负载均衡服务，用户访问 URL 时，应用路由控制器可以把请求转发给不同的后端服务。因此，应用路由的功能其实可以理解为 Service 的 “Service”。

[Kubernetes Ingress](https://github.com/nginxinc/kubernetes-ingress/tree/master/examples/complete-example) 官方提供了这样一个例子：对于 `https://cafe.example.com`，如果访问 `https://cafe.example.com/coffee` 则返回 “咖啡点餐系统”，如果访问 `https://cafe.example.com/tea`，则返回 “茶水点餐系统”。这两个系统分别由后端的 coffee 和 tea 这两个部署 (Deployment) 来提供服务。

以下将在 KubeSphere 创建相关资源来说明这个应用路由的示例。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190424132454.png)


## 前提条件

- 已创建了企业空间、项目和普通用户 `project-regular` 账号，并开启了外网访问，请参考 [多租户管理快速入门](../admin-quick-start)；
- 使用项目管理员 `project-admin` 邀请项目普通用户 `project-regular` 加入项目并授予 `operator` 角色，参考 [多租户管理快速入门 - 邀请成员](../admin-quick-start/#邀请成员) 。


## 预估时间

约 20 分钟。

## 操作示例

### 创建部署 

#### 创建 tea

1. 以用户 project-regular 登录，进入 demo-namespace 项目后，选择 「工作负载」→「部署」，点击 「创建部署」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190424094607.png)

2. 参考如下提示填写基本信息，完成后点击 「下一步」。


- 名称：必填，填写 `tea`，一个简洁明了的名称可便于用户浏览和搜索；
- 别名：可选，支持中文帮助更好的区分资源，例如填写 `茶水点餐系统`；
- 描述信息：简单介绍该工作负载，方便用户进一步了解。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190424095100.png)

3. 副本数增加至 2，点击 「添加容器」，在容器组模板的表单中，参考如下提示填写镜像和服务设置，其它信息默认即可：

- 镜像：nginxdemos/hello:plain-text ；
- 容器名称：tea
- 服务设置：名称输入 port，协议默认 TCP，端口号输入 80 (容器端口)；


完成后点击 「保存」，选择 「下一步」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190424095701.png)

4. 无需设置存储卷，点击 「下一步」。标签设置保留默认即可，点击 「创建」，即可看到 tea 已创建成功。

#### 创建 coffee

1. 同上，点击「创建」，参考以上步骤创建一个名为 coffee 的咖啡点餐系统的部署 (deployment)。

2. 副本数增加至 2，点击 「添加容器」，在容器组模板的表单中，参考如下提示填写 coffee 的镜像和服务设置，其它信息默认即可：

- 镜像：nginxdemos/hello:plain-text ；
- 容器名称：coffee
- 服务设置：名称输入 port，协议默认 TCP，端口号输入 80 (容器端口)；


3. 完成后点击 「保存」，选择 「下一步」。无需设置存储卷，点击 「下一步」，然后点击 「创建」，即可看到 coffee 已创建成功，至此一共创建了如下两个部署。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190424100912.png)

### 创建服务

为 tea 和 coffee 分别创建两个服务，选择 「网络与服务」→ 「服务」，点击 「创建服务」。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190424101135.png)

#### 创建 tea-svc

1. 名称填写 `tea-svc`，点击 「下一步」。

2. 选择第一项 `通过集群内 IP 来访问服务 Virtual IP`，参考如下提示填写服务设置：

- 点击 「指定工作负载」，选择 tea，点击保存；
- 端口：名称为 port，默认 TCP 协议，端口和目标端口都填写 80 (前者表示暴露在 Cluster IP 上的端口，仅提供给集群内部访问服务的入口，目标端口是当前的服务后端 Pod 上的端口)。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190507203902.png)


3. 点击 「下一步」，标签设置保留默认，点击 「创建」，tea-svc 即可创建成功。

#### 创建 coffee-svc

同上，点击「创建」，参考以上步骤创建一个名为 coffee-svc 的服务，工作负载指定为 coffee，其它信息与 tea-svc 服务相同，完成后点击 「创建」。至此已成功创建了两个服务。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190424103423.png)

### 创建 TLS 证书密钥

由于在应用路由中绑定的域名为 https 协议，因此需要预先在密钥中创建 TLS 证书。

1. 点击 「配置中心」→ 「密钥」，点击 「创建」。

2. 密钥名称填写 `cafe-secret`，点击 「下一步」。

3. 类型选择 `TLS`，凭证和私钥填写如下，完成后点击 「创建」。

```bash
#凭证

-----BEGIN CERTIFICATE-----
MIIDLjCCAhYCCQDAOF9tLsaXWjANBgkqhkiG9w0BAQsFADBaMQswCQYDVQQGEwJV
UzELMAkGA1UECAwCQ0ExITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0
ZDEbMBkGA1UEAwwSY2FmZS5leGFtcGxlLmNvbSAgMB4XDTE4MDkxMjE2MTUzNVoX
DTIzMDkxMTE2MTUzNVowWDELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNBMSEwHwYD
VQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQxGTAXBgNVBAMMEGNhZmUuZXhh
bXBsZS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCp6Kn7sy81
p0juJ/cyk+vCAmlsfjtFM2muZNK0KtecqG2fjWQb55xQ1YFA2XOSwHAYvSdwI2jZ
ruW8qXXCL2rb4CZCFxwpVECrcxdjm3teViRXVsYImmJHPPSyQgpiobs9x7DlLc6I
BA0ZjUOyl0PqG9SJexMV73WIIa5rDVSF2r4kSkbAj4Dcj7LXeFlVXH2I5XwXCptC
n67JCg42f+k8wgzcRVp8XZkZWZVjwq9RUKDXmFB2YyN1XEWdZ0ewRuKYUJlsm692
skOrKQj0vkoPn41EE/+TaVEpqLTRoUY3rzg7DkdzfdBizFO2dsPNFx2CW0jXkNLv
Ko25CZrOhXAHAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAKHFCcyOjZvoHswUBMdL
RdHIb383pWFynZq/LuUovsVA58B0Cg7BEfy5vWVVrq5RIkv4lZ81N29x21d1JH6r
jSnQx+DXCO/TJEV5lSCUpIGzEUYaUPgRyjsM/NUdCJ8uHVhZJ+S6FA+CnOD9rn2i
ZBePCI5rHwEXwnnl8ywij3vvQ5zHIuyBglWr/Qyui9fjPpwWUvUm4nv5SMG9zCV7
PpuwvuatqjO1208BjfE/cZHIg8Hw9mvW9x9C+IQMIMDE7b/g6OcK7LGTLwlFxvA8
7WjEequnayIphMhKRXVf1N349eN98Ez38fOTHTPbdJjFA/PcC+Gyme+iGt5OQdFh
yRE=
-----END CERTIFICATE-----

#私钥

-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAqeip+7MvNadI7if3MpPrwgJpbH47RTNprmTStCrXnKhtn41k
G+ecUNWBQNlzksBwGL0ncCNo2a7lvKl1wi9q2+AmQhccKVRAq3MXY5t7XlYkV1bG
CJpiRzz0skIKYqG7Pcew5S3OiAQNGY1DspdD6hvUiXsTFe91iCGuaw1Uhdq+JEpG
wI+A3I+y13hZVVx9iOV8FwqbQp+uyQoONn/pPMIM3EVafF2ZGVmVY8KvUVCg15hQ
dmMjdVxFnWdHsEbimFCZbJuvdrJDqykI9L5KD5+NRBP/k2lRKai00aFGN684Ow5H
c33QYsxTtnbDzRcdgltI15DS7yqNuQmazoVwBwIDAQABAoIBAQCPSdSYnQtSPyql
FfVFpTOsoOYRhf8sI+ibFxIOuRauWehhJxdm5RORpAzmCLyL5VhjtJme223gLrw2
N99EjUKb/VOmZuDsBc6oCF6QNR58dz8cnORTewcotsJR1pn1hhlnR5HqJJBJask1
ZEnUQfcXZrL94lo9JH3E+Uqjo1FFs8xxE8woPBqjZsV7pRUZgC3LhxnwLSExyFo4
cxb9SOG5OmAJozStFoQ2GJOes8rJ5qfdvytgg9xbLaQL/x0kpQ62BoFMBDdqOePW
KfP5zZ6/07/vpj48yA1Q32PzobubsBLd3Kcn32jfm1E7prtWl+JeOFiOznBQFJbN
4qPVRz5hAoGBANtWyxhNCSLu4P+XgKyckljJ6F5668fNj5CzgFRqJ09zn0TlsNro
FTLZcxDqnR3HPYM42JERh2J/qDFZynRQo3cg3oeivUdBVGY8+FI1W0qdub/L9+yu
edOZTQ5XmGGp6r6jexymcJim/OsB3ZnYOpOrlD7SPmBvzNLk4MF6gxbXAoGBAMZO
0p6HbBmcP0tjFXfcKE77ImLm0sAG4uHoUx0ePj/2qrnTnOBBNE4MvgDuTJzy+caU
k8RqmdHCbHzTe6fzYq/9it8sZ77KVN1qkbIcuc+RTxA9nNh1TjsRne74Z0j1FCLk
hHcqH0ri7PYSKHTE8FvFCxZYdbuB84CmZihvxbpRAoGAIbjqaMYPTYuklCda5S79
YSFJ1JzZe1Kja//tDw1zFcgVCKa31jAwciz0f/lSRq3HS1GGGmezhPVTiqLfeZqc
R0iKbhgbOcVVkJJ3K0yAyKwPTumxKHZ6zImZS0c0am+RY9YGq5T7YrzpzcfvpiOU
ffe3RyFT7cfCmfoOhDCtzukCgYB30oLC1RLFOrqn43vCS51zc5zoY44uBzspwwYN
TwvP/ExWMf3VJrDjBCH+T/6sysePbJEImlzM+IwytFpANfiIXEt/48Xf60Nx8gWM
uHyxZZx/NKtDw0V8vX1POnq2A5eiKa+8jRARYKJLYNdfDuwolxvG6bZhkPi/4EtT
3Y18sQKBgHtKbk+7lNJVeswXE5cUG6EDUsDe/2Ua7fXp7FcjqBEoap1LSw+6TXp0
ZgrmKE8ARzM47+EJHUviiq/nupE15g0kJW3syhpU9zZLO7ltB0KIkO9ZRcmUjo8Q
cpLlHMAqbLJ8WYGJCkhiWxyal6hYTyWY4cVkC0xtTl/hUE9IeNKo
-----END RSA PRIVATE KEY-----
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190522114545.png)

### 创建应用路由 cafe-ingress

1. 选择 「网络与服务」→ 「应用路由」，点击 「创建应用路由」。

2. 输入名称 `cafe-ingress`，点击 「下一步」，点击 「添加路由规则」。

3. 选择 「指定域名」，按照如下提示填写路由规则，应用路由的路由规则即它的核心所在。


- 域名：cafe.example.com
- 协议：选择 https
- 密钥：选择 cafe-secret
- 路径：
   - 输入 `/coffee`，服务选择 coffee-svc，选择 80 端口作为服务端口，点击 「添加 Path」
   - 输入 `/tea`，服务选择 tea-svc，选择 80 端口作为服务端口

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190424153059.png)

4. 完成路由规则设置后点击「保存」，无需设置注解，选择 「下一步」，点击 「创建」，cafe-ingress 创建成功。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190424110313.png)

### 访问应用路由

在云平台需要把应用路由在外网访问的 **https** 端口 (比如本示例是 31198)，在端口转发规则中将**内网端口** 31198 转发到**源端口** 31198，然后在防火墙开放这个**源端口**，确保外网流量可以通过该端口，即可通过 curl 命令进行访问测试。例如在 QingCloud 平台配置端口转发和防火墙规则，可参考 [云平台配置端口转发和防火墙](../../appendix/qingcloud-manipulation)。

至此，即可通过外网分别访问 “咖啡点餐系统” 和 “茶水点餐系统”，即访问应用路由下不同的服务。

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190507222447.png)


> 提示：如果在内网环境可登录集群中的任意节点或通过 web kubectl，通过以下 curl 命令进行访问测试，需要将公网 IP 替换为网关地址。

比如，我们访问 `https://cafe.example.com:{$HTTPS_PORT}/coffee` 时，应该是 coffee 的部署负责响应请求，访问这个 URL 得到的返回信息是：Server name: coffee-6cbd8b965c-9659v，即 coffee 这个 Deployment 的名字。

```bash
# curl --resolve {$HOSTNAME}:{$HTTPS_PORT}:{$IP} https://{$hostname}:{$HTTPS_PORT}/{$PATH} --insecure
$ curl --resolve cafe.example.com:31198:139.198.100.100 https://cafe.example.com:31198/coffee --insecure
Server address: 10.233.122.100:80
Server name: coffee-6cbd8b965c-9659v
Date: 23/Apr/2019:03:17:43 +0000
URI: /coffee
Request ID: 1dcb8794548dd6013439b85bbaef0dd6
```

而访问 `https://cafe.example.com:{$HTTPS_PORT}/tea` 的时候，则应该是 tea 的部署负责响应我的请求（Server name: tea-588dbb89d5-bgxqn），说明应用路由已经成功将不同的请求转发给了对应的后端服务。

```bash
# curl --resolve {$HOSTNAME}:{$HTTPS_PORT}:{$IP} https://{$hostname}:{$HTTPS_PORT}/{$PATH} --insecure
curl --resolve cafe.example.com:31198:139.198.100.100 https://cafe.example.com:31198/tea --insecure
Server address: 10.233.122.97:80
Server name: tea-588dbb89d5-bgxqn
Date: 23/Apr/2019:03:16:23 +0000
URI: /tea
Request ID: 98db6b03aabd0b6ab29c26ba37ab2ba2
```































