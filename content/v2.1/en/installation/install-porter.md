---
title: "Load Balancer plugin in Bare Metal - Porter"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

Porter is a load balancer which is designed for a bare metal Kubernetes cluster. It's implemented by physical switch, and uses BGP and ECMP to achieve optimal performance and high availability. As we know, In the cloud-enabled Kubernetes cluster, the cloud provider usually provides the LB plugin to assign EIP and expose the service externally. However, the service is hard to expose externally in a bare metal cluster because of lacking a cloud Load Balancer. In short, Porter allows you to create Kubernetes services of type “LoadBalancer” in bare metal clusters, which makes you have consistency experiences on the cloud.

This plugin has two components which provide following core features:

- LB Controller & Agent: The controller is responsible for synchronizing BGP routes to the physical switch; The agent is deployed to each node as DaemonSet to maintain the drainage rules;
- The EIP service, including the EIP pools management and EIP controller, is responsible for dynamically updating the EIP information of the service.

## How to Install Porter

See [Porter Documentaion](https://github.com/kubesphere/porter#porter) for details.
