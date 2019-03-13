---
title: "Volumes"
---

Volumes, generally represents persistent volume claim (PVC) in KubeSphere, has the capability of a single disk for workloads and is a resource object that persists workloads data.

In the all-in-one deployment mode, you can use the local volume to persist data without preparing an independent storage server, but this type of volume is just for testing since it doesn't support dynamic allocation. If you would like to experience the dynamic provisioning recommended by KubeSphere, it has integrated [QingCloud-CSI](https://github.com/yunify/qingcloud-csi/blob/master/README_zh.md) or [QingStor NeonSAN](https://docs.qingcloud.com/product/storage/volume/super_high_performance_shared_volume/) plugin, support [QingCloud Block Storage](https://www.qingcloud.com/products/volume/) or [QingStor NeonSAN](https://www.qingcloud.com/products/qingstor-neonsan/) as the platform storage service, eliminating manually prepare and maintain storage servers.

In addition, Installer has integrated [NFS](https://kubernetes.io/docs/concepts/storage/volumes/#nfs), [GlusterFS](https://www.gluster.org/), [CephRBD](https://ceph.com/) clients, which needs to be configured in `conf/vars.yml`, but you need to prepare and install the corresponding storage server. 

The volume life cycle includes following 4 stages, we are going to demonstrate the operation of a volume's complete life cycle.

- [Create a volume]()
- [Mount a volume]()
- [Unmount a volume]()
- [Delete a volume]()

