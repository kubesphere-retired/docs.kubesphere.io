---
title: "Multi-node Installation"
keywords: 'Multi-node, Installation, KubeSphere'
description: 'Multi-node Installation Overview'
---

In a production environment, a single-node cluster may not satisfy most of the needs as the cluster has limited resources with insufficient compute capabilities. Thus, single-node clusters are not recommended for large-scale data processing. Besides, a cluster of this kind is not available with high availability as it only has one node. On the other hand, a multi-node architecture is the most common and preferred choice in terms of application deployment and distribution.

This section gives you an overview of multi-node installation, including the concept, scenarios, and KubeSphere installers (KubeKey and ks-installer). For information about the specific step of multi-node installation, see [this guide](https://github.com/kubesphere/kubekey) and refer to Installing on Public Cloud and Installing on On-premises Environment for HA.

## Concept

A multi-node cluster is composed of at least one master node and one worker node. You can add additional nodes based on your needs (e.g. for high availability) both before and after the installation.

- **Master**. A master node generally hosts the control plane that controls and manages the whole system.
- **Worker**. Worker nodes run the actual applications deployed on them.

## Scenarios

A multi-node architecture is extremely useful in a variety of scenarios. A couple of examples are given as follows for your reference.

### High Availability (HA)

For single-node clusters, users will not be able to access data stored in the cluster once the node goes down. For highly available clusters with multiple nodes, the architecture features a failover system that will allow other nodes to take over in case of a node failure. This is extremely important to replicated apps as the scheduler can assign each replica to a different node if you have enough available ones. If a node fails, your app still functions. In other words, your services can run consistently.

For more information, see HA Cluster Configuration.

### Rolling Update

Enterprises strive to deploy new versions of their apps so that they can consistently deliver fresh experiences to their users. To this end, developers may adopt rolling updates which allow them to update instances incrementally with zero downtime. In this process, new Pods will be scheduled on nodes with available resources. With a multi-node architecture, new releases can be distributed while not affecting any services for users.

As KubeSphere features great scalability, you can customize the architecture based on your business both before and after the installation.

## Configuration File

Here is an example of the configuration file (named config-sample.yaml by default) of a multi-node cluster with one master node.

```yaml
spec:
  hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, user: ubuntu, password: Testing123}
  - {name: node1, address: 192.168.0.3, internalAddress: 192.168.0.3, user: ubuntu, password: Testing123}
  - {name: node2, address: 192.168.0.4, internalAddress: 192.168.0.4, user: ubuntu, password: Testing123}
  roleGroups:
    etcd:
    - master
    master:
    - master
    worker:
    - node1
    - node2
  controlPlaneEndpoint:
    domain: lb.kubesphere.local
    address: ""
    port: "6443"
```

### Hosts

- List all your machines under `hosts` and add their detailed information as above. In this case, port 22 is the default port of SSH. Otherwise, you need to add the port number after the IP address. For example:

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, port: 8022, user: ubuntu, password: Testing123}
```

- For default root user:

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, password: Testing123}
```

- For passwordless login with SSH keys:

```yaml
hosts:
  - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, privateKeyPath: "~/.ssh/id_rsa"}
```

### roleGroups

- `etcd`: etcd node names
- `master`: Master node names
- `worker`: Worker node names

### controlPlaneEndpoint

`controlPlaneEndpoint` sets a stable IP address or DNS name for the control plane. Please note that the address and port should be indented by two spaces in `config-sample.yaml`, and the `address` should be VIP. See KubeSphere on QingCloud Instance for more information.

For an example of a complete config-sample.yaml file, see [this file](https://github.com/kubesphere/kubekey/blob/master/docs/config-example.md).

## Why Multi-node Installation of KubeSphere

If you are not familiar with Linux and network management, you may find it difficult to set up a highly-functional multi-node Kubernetes cluster. Starting from the version 3.0.0, KubeSphere uses a brand-new installer called KubeKey to replace the old ansible-based installer. Developed in Go language, KubeKey allows users to quickly deploy a multi-node architecture.

For users who do not have an existing Kubernetes cluster, they only need to create a configuration file with few commands and add node information (e.g. IP address and node roles) in it after KubeKey is downloaded. With one command, the installation will start and no additional operation is needed. If users have an existing multi-node Kubernetes cluster, they only need to execute a couple of commands once the environment requirement is met.

For more information about the specific step of multi-node installation, see Installing on Public Cloud and Installing on On-premises Environment.