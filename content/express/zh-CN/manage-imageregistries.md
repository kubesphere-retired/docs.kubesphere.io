---
title: "镜像仓库"
---


登录 KubeSphere管理控制台，访问访问左侧菜单栏，在**资源**菜单下，点击**镜像仓库**按钮，进入镜像仓库列表页面。作为集群管理员，可以查看当前集群下所有的镜像仓库。  
![](/image_registires_list.png) 

## 创建镜像仓库
1. 点击右上角**创建镜像仓库**按钮，弹出添加镜像仓库对话框，填写镜像仓库所需要的信息。  
1. 信息确认无误后，点击**确定**按钮，该过程中有个验证，验证用户所填写的镜像地址、用户名和密码是否正确，如果认证错误请检查镜像仓库所填写信息是否有误。
1. 验证成功即完成镜像仓库的添加。
![](/image_registries_create.png) 


## 查看镜像仓库
1. 点击列表镜像仓库**名称**，进入该镜像仓库详情页面。  
1. 可以查看当前镜像仓库的授权项目列表以及镜像仓库的详情信息。  
![](/image_registries_detail.png) 


## 修改镜像仓库
1.  进入镜像仓库详情页面，点击左上角**编辑**按钮，可以修改当前镜像仓库信息。  
![](/image_registries_alter.png)


## 删除镜像仓库
1. 在镜像仓库列表页**勾选**镜像仓库或者进入详情页面，点击左侧镜像仓库操作菜单，点击**删除**按钮删除镜像仓库。  
![](/image_registries_del.png)  
![](/image_registries_delet.png)


# 如何使用镜像仓库

以创建deployment为例展示如何使用镜像仓库来拉取镜像。比如demo镜像仓库中有mysql:5.6的docker镜像,镜像地址为dockerhub.qingcloud.com/mysql/mysql:5.6。

1.  在镜像仓库已经授权的项目中，创建deployment
1.  在容器组设置阶段，点击镜像输入框，会弹出授权该项目下的所有镜像仓库列表，选择demo镜像仓库，然后输入具体的镜像仓库地址(命名空间+镜像+TAG),本例中输入的是 /mysql/mysql:5.6。
1.  后续操作请查看**Deployments管理教程**，最终会看到刚才部署的mysql已经运行起来了。  
   
![](/reg_demo_create.png)  
![](/reg_demo_create_registries_list.png)  
![](/reg_demo_create_container.png)  
![](/reg_demo_create_done.png) 
