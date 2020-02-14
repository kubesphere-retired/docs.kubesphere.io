---
title: "Install Porter LoadBlancer Plugin"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Access Built-in SonarQube and Jenkins'
---


## What is Porter

[Porter](https://github.com/kubesphere/porter) is an open source load balancer plugin which is designed for a bare metal Kubernetes cluster. It's implemented by physical switch, uses BGP and ECMP to achieve optimal performance and high availability. As we know, In the cloud-based Kubernetes cluster, the cloud provider usually provides the LB plugin to assign EIP and expose the service externally. However, the service is hard to expose externally in a bare metal cluster because of lacking a cloud Load Balancer. In short, Porter allows you to create Kubernetes services of type “LoadBalancer” in bare metal clusters, which makes you have consistency experience with the cloud.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200214100015.png)

## Install Porter

Reference [Install Porter](https://github.com/kubesphere/porter#installation) for further information.
