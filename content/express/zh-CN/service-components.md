---
title: "服务组件"
---
# 服务组件

服务组件提供 KubeSphere、Kubernetes 和 OpenPitrix 集群内各项服务组件的健康状态监控的状况，可以查看当前集群的健康状态和运行时间，能够帮助用户监测集群的状况和及时定位问题。


## 如何使用服务组件
登录 KubeSphere管理控制台，访问访问左侧菜单栏，在平台管理菜单下，点击服务组件，进入服务组件列表页面。作为集群管理员，可以查看当前集群下所有的服务组件:

![](/service-components.png)

## 服务组件的作用
服务组件可以查看当前集群健康状态，当集群出现异常时，管理员可以查看是否存在某个服务组件出现异常。  
比如使用应用模板部署应用时，应用没有部署成功，那么就可以查看是不是Openpitrix的组件出现异常，管理员就可以快速定位问题，然后根据出现异常的组件进行修复。  
当某个服务组件出现异常时，KubeSphere、Openpitrix和kubernetes的Tab显示为异常组件的数目。  

如下图所示，当 KubeSphere 的 “ks-website” 显示状态为“异常中”，在KubeSphere的Tab则会显示异常的组件数目：

![](/service-components-fault.png)