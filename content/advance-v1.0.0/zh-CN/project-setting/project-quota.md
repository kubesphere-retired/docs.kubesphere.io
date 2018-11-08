---
title: "默认资源"
---

默认资源是对当前项目中创建容器时设置的 CPU 和内存资源的默认值，是相对容器级别的。在创建工作负载添加容器组时，若在高级选项中 CPU 和内存的 requests 和 limits 不作设置，容器中将使用在 **默认资源** 下设置的值。

![默认资源](/default-resource-list.png)

比如，在创建部署时，容器组模板的高级选项中，若不填 CPU 和内存的 requests 和 limits 值，那么这两项的资源请求和限制值默认是上图中设置的值，并不为空。

![容器组模板](/cpu-and-memory-setting.png)

## 编辑默认资源

点击 **“···”** 选择 **编辑**，即可修改 CPU 和内存的默认 limits (限制使用的资源

) 和 requests (最低保证可以使用的资源) 值。

![编辑默认资源](/default-request-setting.png)

