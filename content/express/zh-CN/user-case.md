---
title: "部署一个 WordPress 博客网站"
---


WordPress 是使用 PHP 语言开发的博客平台，用户可以在支持 PHP 和 MySQL 数据库的服务器上架设属于自己的网站, 也可以把 WordPress 当作一个内容管理系统（CMS）来使用。在本指南中，将引导用户通过 KubeSphere 控制台部署一个后端为 MySQL 数据库的 WordPress 博客网站。


## 登录 KubeSphere

1、在开始实践之前，请以普通用户（Regular）的身份登录 KubeSphere，操作员的身份需要通过管理员创建，关于如何创建普通用户（Regular）身份以及成员管理请参考  [用户管理说明](/express/zh-CN/manage-users/)，关于用户角色管理的详细介绍，请参考 [角色管理说明](/express/zh-CN/manage-roles/)。


## 创建项目

2、登录 KubeSphere 后，通过首页直接点击 “创建项目” ，为项目命名：
![](/uc_homepage.png)

> 说明：名称和描述信息可由用户自定义。

![](/uc_createproj.png)

> 说明: 关于项目管理的详细介绍，请参考  [项目管理说明](/express/zh-CN/manage-projects/) 。

## 创建存储卷

3、在菜单栏的资源中选择存储卷，点击创建存储卷，分别为 WordPress 和 MySQL 数据库创建存储卷，可命名为 wordpress-volume 和 mysql-volume
![](/uc_createpv.png)

4、创建 WordPress 存储卷 `wordpress-volume` 需填写基本信息、配置存储设置和标签设置，请参考以下步骤：

- 第一步，填写存储卷基本信息，完成后点下一步：

![](/uc_createpv1.png)

- 第二步，填写存储设置，完成后点下一步（关于创建存储类型的详细介绍, 请参考 [存储类型管理说明](/express/zh-CN/manage-storageclasses/) 通过管理员为其创建 ）：

![](/uc_createpv2.png)

- 第三步，填写标签设置并保存，完成存储卷创建。在存储卷列表页，即可看到 WordPress 所需的存储卷 wordpress-volume 创建成功。

![](/uc_createpv3.png)



5、同上，创建 MySQL 所需存储卷 `mysql-volume`，参考上述步骤完成基本信息、存储设置和标签设置。至此，WordPress 和 MySQL 所需的存储卷都创建成功 （刚完成创建时存储卷状态为 Pending 是正常的，等待数秒当创建工作负载调度 Pod 后状态将自动更新为 Bound）

![](/uc_createpv7.png)

## 创建部署

6、在菜单栏的应用负载中选择部署，点击创建部署，分别为 WordPress 和 MySQL 数据库创建部署资源，可命名为 wordpress 和 wordpress-mysql：

![](/uc_createdeploy.png)

> 说明：关于如何管理部署资源，请参考 [部署管理说明](/express/zh-CN/manage-deployments/)


7、请参考以下步骤创建部署 wordpress-mysql：

- 第一步，填写创建部署的基本信息，完成后点下一步：

![](/uc_createdeploy9.png)

- 第二步，填写容器组设置，名称可由用户自定义，镜像填写 `mysql:5.6` （应指定镜像版本号），高级选项中可以对 CPU 和内存的资源使用进行限定, 此处暂不作限定。其中 **requests** 是集群保证分配给容器的资源， **limits** 是容器可以使用的资源的上限。超过这个限定值，容器会被 kill。用户可以通过**命令**和**参数** 选项自定义容器的启动命令和启动参数:

![](/uc_createdeploy10.png)

> 注: 如果 docker 镜像不是来自默认的 dockerhub，例如 docker 镜像来自 Harbor 镜像仓库, 请参考 [镜像仓库管理说明](/express/zh-CN/manage-imageregistries/)

- 在容器组设置中配置 MySQL 的访问端口和 MySQL 的环境变量 `MYSQL_ROOT_PASSWORD` 和 root 用户的密码 , **端口**用于指定容器需要暴露的端口，端口协议可以选择 TCP 和 UDP, 用户还可以指定端口与主机端口进行绑定。**环境变量**可以指定容器内部使用的环境变量。完成后点下一步：

![](/uc_createdeploy11.png)

- 第三步，存储设置中，点击添加存储卷并选择第一项存储卷，然后选择之前创建好的 mysql-volume 存储卷：

![](/uc_createdeploy12.png)

- 为存储卷配置挂载点，即该存储卷在容器中的挂载路径，填写后点击挂载，完成后选择下一步：

![](/uc_createdeploy13.png)

- 第四步，设置标签并保存，标签能够识别、组织或查找 Kubernetes 中的资源对象，完成后保存选择下一步：

![](/uc_createdeploy14.png)

- 第五步，节点选择器可根据需要配置，一个为空的选择器会默认选择集合中的每一个对象。此处不作配置，选择创建，则 wordpress-mysql 部署创建成功:

![](/uc_createdeploy7.png)


> 注: MySQL 数据库还可通过创建有状态副本集的方式来创建。

8、请参考以下步骤创建部署 wordpress :

- 第一步，填写创建部署的基本信息，完成后点下一步：

![](/uc_createdeploy1.png)

- 第二步，填写容器组设置，名称可自定义，镜像填写 `wordpress:4.8-apache` :

![](/uc_createdeploy2.png)

- 在容器组设置中配置 WordPress 的访问端口和关联 MySQL 的环境变量 (`WORDPRESS_DB_HOST` 和 `WORDPRESS_DB_PASSWORD`) 并保存，完成后点下一步：

> 注意:  环境变量中, ``WORDPRESS_DB_HOST`` 的值对应的是 MySQL 服务的名称, 在后续步骤创建 MySQL 服务时, 服务名应该与此处的环境变量值相同, 否则无法连接 MySQL 数据库。

![](/uc_createdeploy3.png)

- 第三步，存储设置中，点击添加存储卷并选择第一项存储卷，然后选择之前创建好的 wordpress-volume 存储卷：

![](/uc_createdeploy4.png)

- 为存储卷配置挂载点，即该存储卷在容器中的挂载路径，填写后点击挂载，完成后选择下一步：

![](/uc_createdeploy5.png)

- 第四步，设置标签并保存，完成后选择下一步：

![](/uc_createdeploy6.png)

- 第五步，节点选择器根据需要配置，选择创建，则 WordPress 部署创建成功。 至此，WordPress 和 MySQL 部署都创建成功（刚完成创建时部署状态为 “更新中” 是正常的，系统为其拉取镜像和调度资源需要时间，等待数秒后状态将自动更新为运行中）：

![](/uc_createdeploy15.png)

9、通过服务或应用路由的方式，可以将部署的资源暴露出去供外网访问，以下将分别介绍如何以服务和应用理由等两种方式介绍如何暴露 WordPress 到外网供访问：
![](/uc_createsvc.png)


## 创建服务

10、请参考以下步骤为 MySQL 数据库创建服务：

- 填写基本信息，选择下一步：

![](/uc_createsvc1.png)

- 参考以下参数完成参数设置。其中服务类型包括 Virtual IP、Headless (selector) 和 Headless (externalname) 三种, 此处我们选择 Virtual IP, 选择器一栏选择已创建的部署: wordpress-mysql, MySQL 端口填写 3306,  选择下一步：
> 说明: 若要实现基于客户端 IP 的会话亲和性，可以在会话亲和性下拉框选择 "ClientIP" 或在代码模式将 service.spec.sessionAffinity 的值设置为 "ClientIP" （默认值为 "None"）。

![](/uc_createsvc2.png)

- 添加标签并保存，选择下一步：

![](/uc_createsvc3.png)

- 设置外网访问中，共有 None、 NodePort、 LoadBalancer 三种访问方式，可根据情景来设置访问方式。由于 MySQL 数据库不需要暴露服务，因此选择 None，即可完成创建：

![](/uc_createsvc4.png)

> 说明： 关于如何管理服务的详细介绍，请参考 [服务管理说明](/express/zh-CN/manage-services)

11、请参考以下步骤为 WordPress 创建服务：

- 第一步，填写基本信息，选择下一步：

![](/uc_createsvc5.png)

- 第二步，参考以下参数, 其中类型选择 Virtual IP, 选择器选择之前创建好的 wordpress, 访问端口选择 TCP 协议的 80 端口, 完成参数设置，选择下一步：

![](/uc_createsvc6.png)

- 第三步，添加标签并保存，选择下一步：

![](/uc_createsvc7.png)

- 第四步，设置外网访问时，共有 None、 NodePort、 LoadBalancer 三种访问方式，可根据情景来设置访问方式。本实践以 LoadBalancer 的方式暴露服务，并将公网 IP 地址的 `ID` 填入 Annotation 中，即可通过公网 IP 访问该服务, 完成后点击创建：

![](/uc_createsvc8.png)

- 至此，WordPress 与 MySQL 服务都已经创建成功，并且能够通过公网 IP 访问 WordPress 网站（ 服务刚创建时外部 IP 显示 Pending 状态是正常的，因为创建负载均衡器需要时间，等待数秒后即可看到公网 IP 显示）：

![](/uc_createsvc9.png)

- 第五步，通过公网 IP 可访问 WordPress：

![](/uc_createsvc10.png)

## 创建应用路由

12、通过创建应用路由的方式也可以将 WordPress 暴露到公网可供访问，请参考以下步骤配置应用路由：

> 说明： 关于如何管理应用路由，详细请参考 [应用路由管理说明](/express/zh-CN/manage-routers/)

- 第一步，配置外网访问入口，即应用路由的网关入口：

![](/uc_createingress.png)


- 网关入口提供 NodePort 和 LoadBalancer 两种访问方式，可根据情景需要来设置访问方式，本实践以 LoadBalancer 为例配置网关入口，将公网 IP 地址的 `ID` 填入 Annotation，配置完成后点击应用：

![](/uc_createingress1.png)

- 第二步，创建应用路由，填入基本信息：

![](/uc_createingress2.png)

- 第三步，配置路由规则，这里以 `kubesphere.wp.com` 为例，并且 path 选择之前的创建成功的服务 wordpress-service，选择下一步：

![](/uc_createingress3.png)


- 第四步，添加注解，Annotation 可以将 Kubernetes 资源对象关联到任意的非标实性元数据， 完成后选择下一步：

![](/uc_createingress4.png)

- 第五步，添加标签，完成创建：

![](/uc_createingress5.png)

- 至此，WordPress 就以应用路由的方式通过网关入口暴露到外网以供访问，用户可以通过示例中配置的 `kubesphere.wp.com` 访问 WordPress 博客网站：

> 注: 创建应用路由之后应该把公网 IP 和 `kubesphere.wp.com` 填入本地的 hosts 配置文件中，即可通过浏览器访问。

![](/uc_createingress6.png)



## 副本数调节

13、在实际生产系统中，我们经常会遇到某个服务需要扩容的场景，也可能会遇到由于资源紧张或者工作负载降低而需要减少服务实例数的场景。在 kubectl 中我们可以利用命令 `kubectl scale rc` 来完成这些任务。但是，在 KubeSphere 中只需要通过资源详情页中左下角处的容器组数量加减按钮，来调整容器组数量，进而完成对 Pod 的动态扩容与缩放。

![](/uc_scalepods.png)


## 删除资源

14、在实践完成后，建议删除不需要的部署和服务资源，在资源列表中勾选需要删除的资源，例如下图中点击删除部署按钮可删除选中的部署资源， 详细可参考 [用户指南](#用户指南) 中的应用负载管理、服务与网络和资源管理部分，进一步释放资源。
![](/uc_rmresource.png)

## Debug

在创建资源后如果遇到报错或资源一直处于 Pending 状态，可通过资源详情页中的事件页面和容器日志查看报错消息，进而排查问题的原因。例如下图中，由于 wordpress 部署资源中的容器组状态显示 CrashLoopBackOff ，因此可以通过事件详情页中查看具体的错误消息，进一步针对性地解决问题。
![](/uc_debug.png)

若服务创建后无法访问或外部 IP 一直处于 Pending 状态, 可通过服务详情页中查看应用负载和容器组的运行状态, 如果运行都正常再查看事件页面检查是否有报错消息。例如下图中, 由于公网 IP 与 KubeSphere 主机集群不在一个 region 导致无法解析到该公网 IP, 因此服务无法暴露出去。
![](/uc_debug1.png)
