---
title: "Add or Cordon Nodes"
keywords: "kubesphere, kubernetes, docker"
description: "How to add or cordon a node"
---

## Add a New Node

When you use KubeSphere for a certain time, most likely you need to scale out your cluster with workloads increasing. In this scenario, KubeSphere provides script to add new nodes to the cluster. Fundamentally the operation is based on Kubelet's registration mechanism, i.e., the new nodes will automatically join the existing Kubernetes cluster.

> Please note if the environment is installed with the all-in-one mode, it is not allowed to add new nodes to the single-node cluster.

### Step 1: Modify the Host Configuration

KubeSphere supports hybrid environment, that is, the newly added host OS can be CentOS or Ubuntu. When a new machine is ready, add a line of parameters about the new machine information in the groups `all` and `kube-node` of the file `conf/hosts.ini`. If you are going to add multiple hosts, add corresponding lines of parameters to the file. It is not allowed to modify the host name of the original nodes (e.g. master, node1, and node2) when adding a new node.

The following section shows adding a new node (i.e. node3) using `root` user as an example.

```yaml
[all]
master ansible_connection=local  ip=192.168.0.1
node1  ansible_host=192.168.0.2  ip=192.168.0.2  ansible_ssh_pass=PASSWORD
node2  ansible_host=192.168.0.3  ip=192.168.0.3  ansible_ssh_pass=PASSWORD
node3  ansible_host=192.168.0.4  ip=192.168.0.4  ansible_ssh_pass=PASSWORD  
···
[kube-node]
master
node1
node2
node3
···
```

### Step 2: Execute the script

Execute the `add-nodes.sh` script in the **scripts** directory.

```bash
./add-nodes.sh
```

Finally, you will be able to see the new node information on the KubeSphere console after a successful return. Select **Infrastructure → Nodes** from the left menu, or using `kubectl get node` command can also see the changes.

## Cordon a Node

Similarly, if you need to cordon or suspend nodes in the cluster for some reasons, such as hardware upgrades, hardware maintenance, etc., you can choose **Infrastructure → Nodes** from the menu, then click the **Cordon** button. Please see [Node Management](../../infrastructure/node) for further information.

![Cordon Node](https://pek3b.qingstor.com/kubesphere-docs/png/20190327111005.png)