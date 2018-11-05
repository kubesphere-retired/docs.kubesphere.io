---
title: "快速入门 - HPA 水平自动伸缩" 
---

[HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) 是高级版独有的功能，应用的资源使用率通常都有高峰和低谷的时候，如何动态地根据资源使用率来削峰填谷，提高集群的平台和集群资源利用率，让 Pod 副本数自动调整呢？这就有赖于 Horizontal Pod Autoscaling 了，顾名思义，能够使 Pod 水平自动伸缩，也是最能体现 KubeSphere 之于传统运维价值的地方，用户无需进行手动扩容。HPA 仅适用于创建部署 (Deployment) 时在容器组模板中定义，支持根据内存和用户自定义的 metric 来弹性伸缩。

本示例以文档和视频的方式演示平台中如何设置 Pod 水平自动伸缩的功能。

<video controls="controls" style="width: 100% !important; height: auto !important;">
  <source type="video/mp4" src="https://kubesphere-docs.pek3b.qingstor.com/video/hpa.mp4">
</video>

