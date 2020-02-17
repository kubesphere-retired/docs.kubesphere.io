---
title: "Installing HA Master and Etcd Cluster"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'The guide for installing a high availability of KubeSphere cluster'
---

[Multi-node installation](../multi-node) can help you to quickly set up a single-master cluster on multiple machines for development and testing. However, we need to consider the high availability of the cluster for production. Since the key components on the master node, i.e. kube-apiserver, kube-scheduler, and kube-controller-manager are running on a single master node, Kubernetes and KubeSphere will be unavailable during the master being down.

Therefore we need to set up a high availability cluster by provisioning load balancers and multiple masters. You can use any cloud load balancer, or any hardware load balancer (e.g. F5). In addition, keepalved and Haproxy is also an alternative for creating such high-availability cluster.

This document walks you through an example how to create two [QingCloud Load Balancer](https://docs.qingcloud.com/product/network/loadbalancer), serving as internal load balancer and external load balancer respectively, and how to configure the high availability of masters and Etcd using the load balancers.

## Prerequisites

- Please make sure that you already read [Multi-Node installation](../multi-node). This document only demonstrates how to configure Load Balancers, see [Multi-Node](../multi-node) for rest installation steps.
- You need a [QingCloud](https://console.qingcloud.com/login) account. You can also use the load balancer of any cloud provider.

## Highly Available Architecture

This example prepares six machines of CentOS 7.5. We will create two load balancers, and deploy three masters and etcd nodes on three of the machines. You can configure these masters and etcd nodes in `conf/hosts.ini`.

![Master and etcd node high availability architecture](/master-ha-design.svg)

### Create Load Balancers

This section briefly shows an example of creating a load balancer on QingCloud platform. Please refer to [QingCloud Document](https://docs.qingcloud.com/product/network/loadbalancer) for more details.

#### Create an Internal Load Balancer

**Note:** You need to create a VxNet in advance, then you can create Load Balancer in this VxNet.

1. Log in [QingCloud Console](https://console.qingcloud.com/login) and select **Network & CDN → Load Balancers**, then click on the create button and fill in the basic information.

2. Choose the VxNet that we've created, make sure your machines are set in that subnet. Other settings can be default values as follows. Click **Submit** to complete the creation.

![Create Internal LB on QingCloud](https://pek3b.qingstor.com/kubesphere-docs/png/20200215224125.png)

3. Drill into the detail page of the Load Balancer that we created at last step, then create a Listener which is used to listen to port `6443` of the `TCP` protocol.

- Name: Define a name for this Listener
- Listener Protocol: Select TCP protocol
- Port: 6443
- Load mode: Poll

> Note: After creating the listener, please check the firewall rules of the Load Balancer. Make sure that the port `6443` has been added to the firewall rules and the external traffic can pass through `6443`. Otherwise, the installation may fail.

![Add Listener to LB](https://pek3b.qingstor.com/kubesphere-docs/png/20200215225205.png)

4. Click **Add Backend**, choose the VxNet `kube` that we created. Then click on the button **Advanced Search** and choose the three master nodes under the VxNet and set the port to `6443` which is the default secure port of api-server.

Click **Submit** when you've done.

![Choose Backends](https://pek3b.qingstor.com/kubesphere-docs/png/20200215225550.png)

5. Click on the button **Apply Changes** to activate the configurations. At this point, you can find the three masters have been added as the backend servers of the listener that is behind the internal load balancer.

> Please note: The status of all masters might shows `Not available` after you added them as backends. This is normal since the port `6443` of api-server are not active in masters yet. The status will change to `Active` and the port of api-server will be exposed after installation complete, which means the internal load balancer you configured works.

![Apply Changes](https://pek3b.qingstor.com/kubesphere-docs/png/20200215230107.png)

#### Create an External Load Balancer

You need to create an EIP in advance.

> Note: The external load balancer is listening to port `30880`, which is the nodeport of KubeSphere console.

1. Similarly, create an external load balancer, then assign the EIP that we've created to this load balancer.

2. Enter the load balancer detail page, create a listener which is used to listen to port `30880` of the `HTTP` protocol.

> Note: After creating the listener, please check the firewall rules of the Load Balancer. Make sure that the port `30880` has been added to the firewall rules and the external traffic can pass through `6443`. Otherwise, the installation may fail.

![Create external LB](https://pek3b.qingstor.com/kubesphere-docs/png/20200215232114.png)

3. Click **Add Backend**, then choose the `six` machines that we are going to install KubeSphere within the VxNet `Kube`, and set the port to `30880`.

Click **Submit** when you've done.

4. Click on the button **Apply Changes** to activate the configurations. At this point, you can find the six machines have been added as the backend servers of the listener that is behind the external load balancer.

![Apply Changes](https://pek3b.qingstor.com/kubesphere-docs/png/20200215232445.png)

### Modify the host.ini

- Fill all nodes information in the group **[all]**.
- Fill masters name (master1, master2 and master3) in the group **[kube-master]** and the group**[etcd]** respectively as follows, which means these three machines will be set to both master role and etcd role. Please note that the number of etcd needs to be set to odd number. Meanwhile, we don't recommend you to install etcd on worker nodes since the memory consumption of etcd is very high.
- Fill all worker node names in the group **[kube-node]**.
- Fill the group names of **[kube-master]** and **[kube-node]** in the group **[k8s-cluster:children]** which is the group of the groups [kube-master] and [kube-node].

We use **CentOS 7.5** with `root` user to install an HA cluster. Please see the following configuration as an example:

> - If you run installation using `non-root` user (e.g. on ubuntu), please refer to sample configuration which is commented out in `conf/hosts.ini`. You need to replace **[all]** blocks with non-root configuration.
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

At this point, you need to modify the related parameters in the `common.yaml` after preparing the Load Balancer. Assume the **VIP** address and listening port of the internal Load Balancer are `192.168.0.253` and `6443`, then you can refer to the following example.

> - Note that address and port should be indented by two spaces in `common.yaml`. And the address should be VIP.
> - The domain name of the Load Balancer is "lb.kubesphere.local" by default for internal access. If you need to change the domain name, please uncomment and modify it.

#### The configuration sample in common.yaml

```yaml
## External LB example config
## apiserver_loadbalancer_domain_name: "lb.kubesphere.local"
loadbalancer_apiserver:
  address: 192.168.0.253
  port: 6443
```

Finally, please refer to [Multi-Node](../multi-node) to configure the persistent storage service in `common.yaml` and start your HA cluster installation.
