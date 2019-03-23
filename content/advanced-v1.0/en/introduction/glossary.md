---
title: "Glossary"
---

This document describes some frequently used glossaries in KubeSphere, will involve the following basic concepts:

 
| Object | Concepts|
|------------|--------------|
| Project | It can be regarded as Kubernetes Namespace which is intended for use in environments with many users spread across multiple teams, or projects, provides virtual isolation for the resources in KubeSphere, see [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/).|
| Pods | Pods, are the smallest deployable units of computing that can be created and managed in KubeSphere, see [Pods](https://kubernetes.io/docs/concepts/workloads/pods/pod/).
| Deployments | Deployments, are used to describe a desired state in a Deployment object, and the Deployment controller changes the actual state to the desired state at a controlled rate, see [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/). |
| StatefulSets | StatefulSets, StatefulSet is the workload object used to manage stateful applications, such as MySQL, see [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/). |
| DaemonSet | DaemonSet, A DaemonSet ensures that all (or some) Nodes run a copy of a Pod，such as fluentd or logstash, see [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/).  |
| Jobs | Jobs, A job creates one or more pods and ensures that a specified number of them successfully terminate, see [Jobs](https://kubernetes.io/docs/concepts/workloads/controllers/jobs-run-to-completion/). |
|CronJob |CronJob, it creates Jobs on a time-based schedule, a CronJob object is like one line of a crontab (cron table) file. It runs a job periodically on a given schedule, see [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/).  | 
| Services | Services, A Kubernetes Service is an abstraction which defines a logical set of Pods and a policy by which to access them - sometimes called a micro-service. See [Services](https://kubernetes.io/docs/concepts/services-networking/service/). |
| Routes | Ingress, An API object that manages external access to the services in a cluster, typically HTTP, Ingress can provide load balancing, SSL termination and name-based virtual hosting, see [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/).  |
|Image Registry |Image registry, is used to store and distribute Docker Images, it could be public or private, see [Image](https://kubernetes.io/docs/concepts/containers/images/). |
| Volume | Persistent Volume Claim (PVC), is a request for storage by a user, allow a user to consume abstract storage resources, see [PVC](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). | 
|Storage Classes| A Storage Class provides a way for administrators to describe the “classes” of storage they offer, see [StorageClasses](https://kubernetes.io/docs/concepts/storage/storage-classes/). |
| Pipeline | Jenkins Pipeline is a suite of plugins which supports implementing and integrating continuous delivery pipelines into Jenkins, see [Pipeline](https://jenkins.io/doc/book/pipeline/). |
WorkSpace | Multitenancy based, is the basic unit that is used to manage projects, DevOps and different level users.|
Nodes | A node is a worker machine that may be a VM or physical machine, depending on the cluster. Each node contains the services necessary to run pods and is managed by the master components. see [Nodes](https://kubernetes.io/docs/concepts/architecture/nodes/). |