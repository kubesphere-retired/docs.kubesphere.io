---
title: "青云 QingCloud 块存储"
---

KubeSphere 支持使用青云块存储作为平台的存储服务，如果希望体验动态分配 (Dynamic Provisioning) 方式创建存储卷，我们推荐使用 [青云云平台块存储](https://docs.qingcloud.com/product/storage/volume/)，平台已集成 [QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) 块存储插件，仅需简单配置即可使用青云各种性能的块存储服务。

### QingCloud-CSI

[QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) 块存储插件实现了 CSI 接口，并且支持 KubeSphere 能够使用 QingCloud 云平台的存储资源。块存储插件部署后，用户可创建访问模式（Access Mode）为单节点读写（ReadWriteOnce）的基于 QingCloud 的超高性能型 （超高性能型硬盘只能用在超高性能型主机）、性能型（性能型硬盘只能用在性能型主机）或容量型硬盘的存储卷并挂载至工作负载。在安装 KubeSphere 时配置 QingCloud-CSI 插件的参数说明如下所示：

|**QingCloud-CSI** | **Description**|
| --- | ---|
|qy\_csi\_enabled|是否使用 QingCloud-CSI 作为持久化存储，是：true； 否：false |
|qy\_csi\_is\_default\_class|是否设定为默认 storage\_class， 是：true；否：false <br/> 注：系统中存在多种 storage\_class 时，只能设定一种为 default\_class
| qy\_access\_key\_id ， <br> qy\_secret\_access\_key|通过[青云控制台](https://console.qingcloud.com/login) 的右上角账户图标选择 **API 密钥** 创建密钥获得|
|qy\_zone| zone 应与 Kubernetes 集群所在区相同，CSI 插件将会操作此区的存储卷资源。例如：zone 可以设置为 sh1a（上海一区-A）、sh1b（上海1区-B）、 pek2（北京2区）、pek3 （北京3区）、pek3a（北京3区-A）、gd1（广东1区）、gd2a（广东2区-A）、ap1（亚太1区）、ap2a（亚太2区-A）、 |