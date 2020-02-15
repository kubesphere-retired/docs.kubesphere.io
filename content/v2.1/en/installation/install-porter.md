---
title: "Porter - Load Balancer Plugin in Bare Metal"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

Porter is an open source load balancer plugin which is designed for bare metal Kubernetes clusters. It's implemented by physical switch, uses BGP and ECMP to achieve optimal performance and high availability. As we know, the cloud provider provides the LoadBlancer plugin to assign EIP and expose the service externally in cloud environment. However, the service is hard to expose externally in a bare metal cluster because of lacking a cloud Load Balancer plugin. In short, Porter allows you to create Kubernetes services of type “LoadBalancer” in bare metal clusters, which makes you have consistent experience with the cloud.

Porter has two components which provide following two core features:

- LB Controller & Agent: The controller is responsible for synchronizing BGP routes to the physical switch; The agent is deployed to each node as DaemonSet to maintain the drainage rules;

- The EIP service, including the EIP pools management and EIP controller, is responsible for dynamically updating the EIP information of the service.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200214100015.png)


## How to Install Porter

Reference [Porter Documentaion](https://github.com/kubesphere/porter#porter) for details.
