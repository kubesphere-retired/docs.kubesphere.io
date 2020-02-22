---
title: "Set CI Node for Dependency Cache"
keywords: 'kubernetes, docker, kubesphere, jenkins, cicd, pipeline'
description: 'Set CI Node for dependency cache of KubeSphere pipeline '
---

## How to Set CI Node for Dependency Cache

Generally, applications often need to pull a lot of dependencies during the build process, it might cause some issues like the pulling time is very long, or unstable network cause to the abnormal build. For more stable build and run, as well as making better use of the cache to speed up the build, we recommend you to set one or a set of CI nodes, so that the CI/CD Pipelines and S2I/B2I builds are more likely to run on the CI nodes.

1. Log in KubeSphere with `admin` account, navigate to **Platform → Infrastructure**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222130938.png)

2. Choose any of nodes as the CI running nodes, here we choose `node2` and enter its detailed page. Click **Mode → Edit Labels**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222131202.png)

3. Click **Add Labels**, add a new label `node-role.kubernetes.io/worker=ci`, click **Save**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222131640.png)


## Set CI Nodes as Dedicated

Pipelines and S2I/B2I workflows will be scheduled to this node first based on the [Node affinity](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#node-affinity). If you want to set a set of CI nodes as the dedicated nodes, which means these nodes are not allowed other workloads to be scheduled to them, you can follow with the steps below to set [Taint](https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/).

1. Click **Mode → Taint Management**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222132456.png)

2. Click **Add Taint**, enter a key `node.kubernetes.io/ci`, there is no need to set its value. You can choose `NoSchedule` or `PreferNoSchedule` at your will.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200222132535.png)

3. Click **Save**. At this point, you've complete the CI node settings, you can continue to refer to the DevOps quick guides.
