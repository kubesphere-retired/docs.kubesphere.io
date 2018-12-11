---
title: "多租户管理概述"
---

用户权限管理，换句话说，就是谁能在什么情况下能够对哪些资源进行哪一些操作，是平台或应用程序的开发者需要仔细斟酌的问题。因为，不论是什么产品，权限管理体系都是不可或缺的。KubeSphere 作为一个 PaaS 平台提供容器管理服务，那么对于用户权限管理的管理，就更为重要了。KubeSphere 是多租户模式的，我们在项目和 DevOps 工程之上提供了 **企业空间** 的概念，能够更好地隔离不同组织下不同项目工程的用户的资源，并且资源利用率得到提高。如果要想在平台中游刃有余地使用 KubeSphere 的各种资源服务，并尽可能地减少在安全上的纰漏，首先有必要了解一下 KubeSphere 的用户权限管理体系的设计和使用引导。

## IAM 模块设计

现有的权限管理模型有 ACL，RBAC，ABAC 这几类，针对不同的使用场景，IAM 这一块的设计也有很大的不同。但是我们可以尽可能的去抽象一个足够轻量的IAM模块，方便再各类产品中快速的接入，减少重复的工作。以往，IAM 往往和业务代码耦合非常大，但 Kubernetes 在这一方面做的非常好，值得借鉴。Kubernetes 采用 RBAC 权限管理模型来做 API 的权限控制，简单点说抽象出来 角色、用户（组）、权限规则 这三种资源，一个角色由一组权限规则定义，一个用户（组）可以关联多个角色，每一条权限规则显式声明了对某一个或一组 API 的访问规则。基于 RBAC 的权限控制，再结合 http verbs 和 API 的语意去声明权限规则。整个鉴权认证 + 用户管理体系，对业务代码没有侵入性，只需要 API 的设计需要符合 RESTful 语意规范。

### API Gateway

Gateway 的本质是一个带 API 认证鉴权功能的反向代理服务器，我们在 KubeSphere 中借助 Caddy 去实现。

**API 设计**
![API 设计](/api-design.png)

#### 认证模块
对请求的发起者进行认证，认证通过之后，通过Header向下传递用户的认证信息。业务服务可以更好的识别请求的发起者。

用户的认证方式和IAM server中凭证签发模块相关，例如在ks-account中我们通过签发jwt格式的Token用于用户认证，那么在Caddy 的认证模块中我们就可以通过配置和ks-account相同的秘钥，进行快速认证。其中部分接口无需认证，未认证请求返回401。

#### 鉴权模块

认证通过后，需要请求进行鉴权，不通过则返回 403。

在 KubeSphere 中，根据 API 可以抽象出一系列的权限规则例如：`GET /apis/account.kubesphere.io/users`。

通过 RESTful 语意，我们可以将请求的意图拆解为：

```
Verb: list, APIGroup: account.kubesphere.io, Resource: users
```

那么对应的在权限规则表中一定得存在着一条规则允许用户访问该 API。我们通过聚合用户的权限规则列表，对用户的权限进行准入评估。

在 ks-account 中，我们借用了 Kubernetes 的存储和用户相关的权限规则，通过 informer 将权限规则同步到内存中，方便快速的进行权限校验，相较于 Mysql 存储规则数据，借助 etcd 我们可以很方便的横向拓展，而不让数据读写成为一个瓶颈。

代理模块
借助 Caddy 的 Proxy Plugin，我们可以很方便的对 API 进行统一的规范、代理。

例如 `http://jenkins.kube-devops.svc`。

并不满足 Gateway 语意路径，但是可以通过路由修正，让我们的Gateway对外的 API 保持一致

```
      proxy /apis/jenkins.kubesphere.io http://jenkins.kube-devops.svc {
        without /apis/jenkins.kubesphere.io
        header_upstream Host {host}
      }
```      
我们将 `/apis/jenkins.kubesphere.io` 下的请求统一路由到 `jenkins.kube-devops.svc` 下，极大的统一了权限规则的抽象方式。

#### IAM server

在整个体系中，IAM server 相对独立，也是不可或缺的部分。其中最基础的模块包括用户、用户组的管理、配合 Gateway 完成鉴权的权限管理模块、配合Gateway完成认证的凭证签发模块。

除此之外，结合实际业务去拓展诸如登录日志、用户头像、权限表管理等功能性 API，以满足各业务 API 的需求。

#### 用户管理

通过 IDL 抽象出，用户、用户组的管理相关的 function 并封装成 grpc 服务，以便各业务系统进行依赖，也便于第三方用户系统的接入。

#### 权限管理

做到灵活可替换，不论是借助 Kubernetes 还是自己实现权限规则的存储和校验，随着接入模块的增多，权限管理模块要保有一定的灵活性。在 KubeSphere 中我们选择了多重组合的方式对权限进行校验，首先是一些和用户直接关联的 API 可以开放鉴权，再次是针对集群、企业空间、项目多层级的权限校验。

借助 Kubernetes 的 RBAC 存储用户权限规则数据，用户并不直接和资源进行关联，资源只和角色进行关联，所以在企业空间、项目创建之后需要做角色的初始化，ks-apiserver、ks-account存在代码耦合。

#### 凭证签发

比较简单，配合 Gateway 中的认证模块，进行 token 签发和认证。

## 用户角色说明

在熟悉并了解了 IAM 模块的设计架构之后，对于平台中各个层级的管理员和普通用户而言，理解每个层级的具体成员和角色的含义，如何更好地管理平台中成员和角色，就是实际使用中的关键环节了，请继续参阅 [角色权限概览](../role-overview)。