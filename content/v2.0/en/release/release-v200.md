---
title: "Release Notes For 2.0.0"
keywords: ''
description: ''
---

KubeSphere 2.0.0 was released on **May 18th, 2019**. 

## What's New in 2.0.0

### Component Upgrades

- Support to update Kubernetes to  [Kubernetes 1.13.5](https://github.com/kubernetes/kubernetes/releases/tag/v1.13.5).
- Integrated [QingCloud Cloud Controller](https://github.com/yunify/qingcloud-cloud-controller-manager). After installing  load balancer, QingCloud load balancer can be created through KubeSphere console and the backend workload is bind automatically.  
- Integrated [QingStor CSI v0.3.0](https://github.com/yunify/qingstor-csi/tree/v0.3.0) storage plugin and supported physical NeonSAN storage system.  SAN storage service with high availability and high performance is available. 
- Integrated [QingCloud CSI v0.2.1](https://github.com/yunify/qingcloud-csi/tree/v0.2.1) storage plugin and supported many types of volume to create QingCloud.
- Installation component  Harbor can be updated to 1.7.5.
- Installation component GitLab has been updated to  11.8.1.
- Prometheus has been updated to  2.5.0


### Microservice Governance

- Integrated Istio 1.1.1 and enabled the graphical creation which includes the application of multiple microservice components.
- Enabled the access to the project's external websites and the application traffic governance.
- Built in microservice as [Bookinfo Application](https://istio.io/docs/examples/bookinfo/).
- Supported traffic governance.
- Supported traffic images.
- Provided load balancing of microservice based on Istio.
- Supported Canary release.
- Enabled blue-green deployment.
- Enabled the Circuit Breaking.
- Enabled tracing.


### DevOps (CI/CD Pipeline)

- CI/CD pipeline provides email notification and supports the  email notification during construction. 
- Enhanced CI/CD graphical editing pipelines. And enhanced more pipelines for common plugins and execution conditions.
- Provide source code vulnerability scanning based on SonarQube 7.4.
- Support [Source to Image](https://github.com/kubesphere/s2ioperator) feature. No code needed for Dockerfile's  direct  application load construction and publication.


### Monitoring

- Provided Kubernetes component independent monitoring page including etcd, kube-apiserver and kube-scheduler.
- Optimized several monitoring  algorithm.
- Optimized monitoring resources. Reduced Prometheus storage and the disk usage for 80%.


### Logging

- Provide united log console based on tenant authorities.
- Enable accurate and fuzzy retrieval.
- Support real-time and history logs. 
- Support combined log retrievals including namespace, workload, Pod, container, key words and time limit.  
- Support details page of single and direct logs. Pods and containers can be switched.
- Self-developed [FluentBit Operator](https://github.com/kubesphere/fluentbit-operator) supports logging gathering settings: Elasticsearch, Kafka and Fluentd can be added, activated or turned off as log collectors. Before sending to log collectors, you can put in filtering conditions for needed logs.


### Alerting and Notifications

- Email notifications are available for cluster nodes and workload resources. 
- Notification rules: combined multiple monitoring resources are are available, different warning levels, detection cycle, push times and threshold can be configured.
- Time and notifiers can be set.
- Enabled notification repeating rules for different levels. 


### Security Enhancements

- Fixed RunC Container Escape Vulnerability [Runc container breakout](https://log.qingcloud.com/archives/5127)
- Fixed Alpine's Docker's image Vulnerability [Alpine container shadow breakout](https://www.alpinelinux.org/posts/Docker-image-vulnerability-CVE-2019-5021.html)
- Supported single and multi-login configuration items.
- Verification code is required after multiple invalid logins.
- Enhanced passwords' policy and blocked weak passwords.
- Others security enhancements.

### Interface Optimization

- Optimized multiple user experience of Console, such as the switch between DevOps project and other projects.
- Optimized many Chinese-English webpages.

### Others

- Supported etcd backup and recovery.
- Supported regular cleanup of the docker's image.

## Fixed Bugs

- Fixed delayed update of the resource and deleted pages.
- Fixed the left dirty data after deleting the HPA workload.
- Fixed incorrect Job status display.
- Corrected resource quota, Pod usage and storage metrics algorithm.
- Adjust CPU usage percentages. 
- Fixed other Bugs as well.

