---
title: "Porter - Load Balancer for Bare Metal"
keywords: "kubesphere, kubernetes, docker, load balancer, porter"
description: "How to install Porter load balancer in bare metal Kubernetes"
---

[Porter](https://github.com/kubesphere/porter) is an open source load balancer plugin designed for bare metal Kubernetes clusters. It is implemented for physical switch, using BGP and ECMP to achieve best performance and high availability. As we know, most cloud providers provide load balancer plugins to assign EIP and expose the service externally in cloud environment. However, the service is hard to expose externally in a bare metal cluster because of lacking a cloud load balancer plugin. In short, Porter allows you to create Kubernetes services of type “LoadBalancer” in bare metal clusters without changing your code, which makes the same experience as the cloud environment.

Porter has two components providing the following two core features:

- LB Controller & Agent: The controller is responsible for synchronizing BGP routes to the physical switch; The agent is deployed to each node as DaemonSet to maintain the drainage rules.

- The EIP service, including the EIP pools management and EIP controller, is responsible for dynamically updating the EIP information of the service.

![Porter Architecture](https://pek3b.qingstor.com/kubesphere-docs/png/20200214100015.png)

## How to Install Porter

Reference [Porter Documentation](https://github.com/kubesphere/porter#porter) for details.
