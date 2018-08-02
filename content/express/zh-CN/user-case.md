---
title: "最佳实践"
---

# 部署一个 WordPress 博客网站

WordPress 是使用 PHP 语言开发的博客平台，用户可以在支持 PHP 和 MySQL 数据库的服务器上架设属于自己的网站, 也可以把 WordPress 当作一个内容管理系统（CMS）来使用。在本指南中，将引导用户通过 KubeSphere 控制台部署一个后端为 MySQL 数据库的 WordPress 博客网站。

1、在开始实践之前，请以操作员的身份登录 KubeSphere，操作员的身份需要通过管理员创建，关于如何创建操作员身份以及成员和角色管理请参考  [用户管理](manage-users.md) 。
![](images/uc_login.png)

2、登录 KubeSphere 后，通过首页直接点击 “创建项目” ，为项目命名：
![](images/uc_homepage.png)

> 说明：名称和描述信息可由用户自定义。

![](images/uc_createproj.png)

3、分别为 WordPress 和 MySQL 数据库创建项目所需的存储卷，可命名为 wordpress-pv 和 mysql-pv （关于如何创建存储类型请参考 [存储类型管理](manage-storageclasses.md) 通过管理员为其创建 ）：
![](images/uc_createpv.png)

4、创建 WordPress 所需存储卷的基本信息、存储设置和标签设置，请参考以下步骤：

- 第一步，填写存储卷基本信息，完成后点下一步：

![](images/uc_createpv1.png)

- 第二步，填写存储设置，完成后点下一步：

![](images/uc_createpv2.png)

- 第三步，填写标签设置并保存，完成存储卷创建：

![](images/uc_createpv3.png)

- 第四步，WordPress 所需的存储卷创建成功（刚完成创建时存储卷状态为 Pending 是正常的，等待数秒后状态将自动更新为 Bound）：

![](images/uc_createpv4.png)

5、同上，创建 MySQL 所需存储卷的基本信息、存储设置和标签设置，请参考以下步骤：

- 第一步，填写存储卷基本信息，完成后点下一步：

![](images/uc_createpv5.png)

- 第二步，填写存储设置，完成后点下一步：

![](images/uc_createpv2.png)

- 第三步，填写标签设置并保存，完成存储卷创建：

![](images/uc_createpv6.png)

- 至此，WordPress 和 MySQL 所需的存储卷都创建成功：

![](images/uc_createpv7.png)

6、分别为 WordPress 和 MySQL 数据库创部署资源，可命名为 wordpress 和 wordpress-mysql：

![](images/uc_createdeploy.png)

7、请参考以下步骤创建部署 wordpress :

- 第一步，填写创建部署的基本信息，完成后点下一步：

![](images/uc_createdeploy1.png)

- 第二步，填写容器组设置，名称可自定义，镜像填写 wordpress 将默认为最新版本的镜像：

![](images/uc_createdeploy2.png)

- 在容器组设置中配置 WordPress 的访问端口和关联 MySQL 的环境变量并保存，完成后点下一步：

![](images/uc_createdeploy3.png)

- 第三步，存储设置中，点击添加存储卷并选择第一项存储卷，然后选择之前创建好的 wordpress-pv 存储卷：

![](images/uc_createdeploy4.png)

- 为存储卷配置挂载点，即该存储卷在容器中的挂载路径，填写后点击挂载，完成后选择下一步：

![](images/uc_createdeploy5.png)

- 第四步，设置标签并保存，完成后选择下一步：

![](images/uc_createdeploy6.png)

- 第五步，节点选择器根据需要配置，本实践中暂不作配置，选择创建：

![](images/uc_createdeploy7.png)

- WordPress 部署创建成功（刚完成创建时部署状态为 “更新中” 是正常的，系统为其拉取镜像和调度资源需要时间，等待数秒后状态将自动更新为运行中）：

![](images/uc_createdeploy8.png)

8、请参考以下步骤创建部署 mysql：

- 第一步，填写创建部署的基本信息，完成后点下一步：

![](images/uc_createdeploy9.png)

- 第二步，填写容器组设置，名称可自定义，镜像填写 mysql:5.6， 若不指定版本号将默认为最新版本的镜像：

![](images/uc_createdeploy10.png)

> 注: 如果 docker 镜像不是来自默认的 dockerhub，请参考 [管理镜像仓库](#manage-imageregistries.md)

- 在容器组设置中配置 MySQL 的访问端口和 MySQL 的环境变量(root 用户的密码)并保存，完成后点下一步：

![](images/uc_createdeploy11.png)

- 第三步，存储设置中，点击添加存储卷并选择第一项存储卷，然后选择之前创建好的 mysql-pv 存储卷：

![](images/uc_createdeploy12.png)

- 为存储卷配置挂载点，即该存储卷在容器中的挂载路径，填写后点击挂载，完成后选择下一步：

![](images/uc_createdeploy13.png)

- 第四步，设置标签并保存，完成后选择下一步：

![](images/uc_createdeploy14.png)

- 第五步，节点选择器根据需要配置，本实践中暂不作配置，选择创建：

![](images/uc_createdeploy7.png)

- 至此，WordPress 和 MySQL 部署都创建成功（刚完成创建时部署状态为 “更新中” 是正常的，系统为其拉取镜像和调度资源需要时间，等待数秒后状态将自动更新为运行中）：

![](images/uc_createdeploy15.png)

> 注: MySQL 数据库还可通过创建有状态副本集的方式完成部署

9、通过服务或应用路由的方式，可以将部署的资源暴露出去供外网访问，以下将分别介绍如何以服务和应用理由等两种方式介绍如何暴露 WordPress 到外网供访问：
![](images/uc_createsvc.png)

10、请参考以下步骤为 MySQL 数据库创建服务：

- 填写基本信息，选择下一步：

![](images/uc_createsvc1.png)

- 参考以下参数完成参数设置，选择下一步：

![](images/uc_createsvc2.png)

- 添加标签并保存，选择下一步：

![](images/uc_createsvc3.png)

- 设置外网访问中，共有 None、 NodePort、 LoadBalancer 三种访问方式，可根据情景来设置访问方式。由于 MySQL 数据库不需要暴露服务，因此选择 None，即可完成创建：

![](images/uc_createsvc4.png)

11、请参考以下步骤为 WordPress 创建服务：

- 第一步，填写基本信息，选择下一步：

![](images/uc_createsvc5.png)

- 第二步，参考以下参数完成参数设置，选择下一步：

![](images/uc_createsvc6.png)

- 第三步，添加标签并保存，选择下一步：

![](images/uc_createsvc7.png)

- 第四步，设置外网访问中，共有 None、 NodePort、 LoadBalancer 三种访问方式，可根据情景来设置访问方式。本实践以 LoadBalancer 的方式暴露服务，并将公网 IP 地址的 ID 填入 Annotation 中，即可通过公网 IP 访问该服务, 完成后点击创建：

![](images/uc_createsvc8.png)

- 至此，WordPress 与 MySQL 服务都已经成功创建，并且能够通过公网 IP 访问 WordPress 网站（ WordPress 刚创建时外部 IP 显示 Pending 状态是正常的，因为创建负载均衡器需要时间，等待数秒后即可看到公网 IP ）：

![](images/uc_createsvc9.png)

- 第五步，通过公网 IP 可访问 WordPress：

![](images/uc_createsvc10.png)

12、通过创建应用路由的方式也可以将 WordPress 暴露到公网可供访问，请参考以下步骤配置应用路由：

- 第一步，配置外网访问入口，即应用路由的网关入口：

![](images/uc_createingress.png)

- 网关入口提供 NodePort 和 LoadBalancer 两种访问方式，可根据情景需要来设置访问方式，本实践以 LoadBalancer 为例配置网关入口，将公网 IP 地址的 ID 填入 Annotation，配置完成后点击应用：

![](images/uc_createingress1.png)

- 第二步，创建应用路由，填入基本信息：

![](images/uc_createingress2.png)

- 第三步，配置路由规则，这里以 `kubesphere.wp.com` 为例，并且 path 选择之前的部署资源 wordpress，选择下一步：

![](images/uc_createingress3.png)


- 第四步，添加注解，选择下一步：

![](images/uc_createingress4.png)

- 第五步，添加标签，完成创建：

![](images/uc_createingress5.png)

- 至此，WordPress 就以应用路由的方式通过网关入口暴露到外网以供访问，用户可以通过示例中配置的 `kubesphere.wp.com` 访问 WordPress 博客网站：

![](images/uc_createingress6.png)



> 注: 创建应用路由之后应该把公网 IP 和 `kubesphere.wp.com` 填入本地的 hosts 配置文件中，即可通过浏览器访问。