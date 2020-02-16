---
title: "Installing HA Master and Etcd Cluster"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

[Multi-node installation](../multi-node) can help you to quickly set up a cluster on multiple machines for development and testing. However, we need to consider the high availability of the cluster for production. Since the key components on the master node, i.e. kube-apiserver, kube-scheduler, and kube-controller-manager are single-node running, it might be a big risk once the master is down. Kubernetes might be failed and KubeSphere may also be unavailable in that case.

Load Balancer can distribute external traffic to multiple backend nodes, it can also automatically detect and isolate failed nodes, this mechanism will greatly improve reliability and availability of the service. You can use the load balancer of any cloud provider, or any load balancer hardware (e.g. F5). In addition, keepalved and Haproxy are also an alternative for creating high-availability installation.

This document walks you through how to create a highly available cluster by configuring two [QingCloud Load Balancer](https://docs.qingcloud.com/product/network/loadbalancer), serving as internal and external load balancer respectively, guide you to set up a production-ready cluster to implement high availability of masters and etcd.


## Prerequisites

- Please make sure that you already read [Multi-Node installation](../multi-node). This page only demonstrates how to configure Load Balancers, see [Multi-Node](../multi-node) for rest installation steps.
- You need a [QingCloud Cloud](https://console.qingcloud.com/login) account (You can use the load balancer of any cloud provider).

## Highly Available Architecture

This example prepares six machines of CentOS 7.5, we will create two load balancers, and deploy three masters and etcd nodes among them. You can configure these three masters and etcd nodes in `conf/hosts.ini`.

![Master and etcd node high availability architecture](/master-ha-design.svg)

### Create Load Balancer

This page shows an example of creating a load balancer on QingCloud platform, and briefly explain the creation steps. Please refer to [QingCloud Document](https://docs.qingcloud.com/product/network/loadbalancer) for details.

#### Create an Internal Load Balancer

**Note:** You need to create a VxNet in advance, then you can create Load Balancers in this VxNet.

1. Log in [QingCloud Cloud Platform](https://console.qingcloud.com/login) and select **Network & CDN → Load Balancers**, then click on the create button and fill in the basic information.

2. Choose the VxNet that we've created, make sure your machines are set in that subnet, other settings can be default values as follows. Click **Submit** to complete the creation.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200215224125.png)

3. Enter the Load Balancer that we created at last step, then create a Listener which is used to listen to port `6443` of the `TCP` protocol.

- Name: Define a concise and clear name for this Listener
- Listener Protocol: Select TCP protocol
- Port: 6443
- Load mode: Poll

> Note: After creating the listener, please check the firewall rules of the Load Balancer, make sure that the port `6443` has been added to the firewall rules and the external traffic can pass through `6443`. Otherwise, the installation may fail.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200215225205.png)

4. Click **Add Backend**, choose the VxNet `kube` that we created six machines in. Then click on the button **Advanced Search** and check there machines of the list as three masters, set the port to `6443`, it is the default secure port of api-server.

Click **Submit** when you've done.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200215225550.png)

5. Click on the button **Apply Changes** to save the configurations. At this point, you can find the three masters have been added as the backend servers of the listener, which is under the internal load balancer.

> Please note: The status of all masters might shows `Not available` after you added them as backends. This is normal since the port `6443` of api-server are not active in masters. The status will change to `Active` after successful installation, the port of api-server can be exposed at that time, also it proves the internal load balancer works.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200215230107.png)

#### Create an External Load Balancer

You need to create an EIP in advance.

> Note: The external load balancer is listening to port `30880`, which is the nodeport of KubeSphere console.

1. Similarly, create a load balancer, then assign the EIP that we've created to this load balancer, it will serve as the external load balancer.

2. Enter the load balancer, create a listener which is used to listen to port `30880` of the `HTTP` protocol.

> Note: After creating the listener, please check the firewall rules of the Load Balancer, make sure that the port `30880` has been added to the firewall rules and the external traffic can pass through `6443`. Otherwise, the installation may fail.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200215232114.png)

3. Click **Add Backend**, then choose the `six` machines that we are going to install KubeSphere of the VxNet `Kube`, set the port to `30880`.

Click **Submit** when you've done.

4. Click on the button **Apply Changes** to save the configurations. At this point, you can find the six machines have been added as the backend servers of the listener, which is under the external load balancer.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200215232445.png)


### Modify the host.ini

- **[all]**: Fill in the **[all]** field with all node names.
- **[kube-master]** and **[etcd]**: Fill in the **[kube-master]** and **[etcd]** fields with masters name (master1, master2 and master3) as follows, which means these three machines will be set to both master and etcd roles. Please note that the number of etcd needs to be set as odd number. Meanwhile, we don't recommend you to install etcd on worker nodes since the memory consumption of etcd is very high.
- **[kube-node]**: Fill in the **[kube-node]** field with all worker node names.
- **[k8s-cluster:children]**: leave the default values.


We use **CentOS 7.5** with `root` user to install a HA cluster, see the following configuration as an example:

> - If you run installation using `non-root` user (e.g. ubuntu), please refer to sample configuration which is commented out in `conf/hosts.ini`. You need to replace **[all]** blocks with non-root configuration.
> - If the _taskbox_ can't establish `ssh` connection with the rest nodes, please also refer to the note of `non-root` user as above.

**host.ini example**

```ini
[all]
master1  ansible_connection=local  ip=192.168.0.1
master2  ansible_host=192.168.0.2  ip=192.168.0.2  ansible_ssh_pass=PASSWORD
master3  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_ssh_pass=PASSWORD
node1  ansible_host=192.168.0.4  ip=192.168.0.4  ansible_ssh_pass=PASSWORD
node2  ansible_host=192.168.0.5  ip=192.168.0.5  ansible_ssh_pass=PASSWORD
node3  ansible_host=192.168.0.6  ip=192.168.0.6  ansible_ssh_pass=PASSWORD

[kube-master]
master1
master2
master3

[kube-node]
node1
node2
node3

[etcd]
master1
master2
master3

[k8s-cluster:children]
kube-node
kube-master
```

### Configure the Load Balancer Parameters

At this point, you need to modify the related parameters in the `common.yaml` after preparing the Load Balancer. Assume the **VIP** address and listening port of the internal Load Balancer are `192.168.0.253` and `6443`, then you can refer to following example (`loadbalancer_apiserver` blocks as optional configuration which should be uncommented when you configure a load balancer).

> - Note that address and port should be indented by two spaces in `common.yaml`. And the address should be VIP.
> - The domain name of the Load Balancer is "lb.kubesphere.local" by default for internal access. If you need to change the domain name, please uncomment and modify it.

**vars.yml configuration sample**

```yaml
## External LB example config
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
loadbalancer_apiserver:
  address: 192.168.0.253
  port: 6443
```

Finally, please refer to [Multi-Node](../multi-node) to configure the persistent storage in `common.yml` and complete the rest steps.
