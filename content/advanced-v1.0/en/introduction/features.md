---
title: "Features"
---

KubeSphere provides an easy-to-use console with the awesome user experience that allows you to quickly get started with various functions just like other general products. KubeSphere integrated workload management, DevOps Delivery, multi-tenant management, multi-dimensional monitoring, service and network management, application scheduling, infrastructure management, image registry management, etc. It also supports multiple open source storage services and high-performance cloud storage.

The following modules elaborate on the KubeSphere services from a professional point of view.

## One-Stop Workloads O&M

KubeSphere provides a wizard-like UI for many kinds of workloads including Deployments, DaemonSets, StatusfulSets, Jobs, CronJobs management, as well as Horizontal Pod Autoscaler (HPA) and container health checking support.

## DevOps Delivery

- Provide a visual CI/CD pipeline that enables users to build their CI/CD workflow or based on the built-in Jenkinsfile repository. 
- Support for end-to-end pipeline, including source code repositories (GitHub / SVN / Git)
- Built-in Pod Template (such as Go, nodejs, maven), supports for deploying applications to Kubernetes.
- Provide complete log to record every process of CI/CD Pipeline.


## Multitenancy

- Role-based access control to ensure fine-grained security.
- Support for standard AD / LDAP protocol to achieve centralized authentication. 
- Nodes and images will be fully scanned so that vulnerabilities can be detected in advance. 

## Multi-dimensional Monitoring 

Through the built-in monitoring center, it provides users with multi-dimensional monitoring, including clusters, workspaces, projects, workloads/Pod, and containers.  

- It presents real-time monitoring metrics, including node status, CPU, memory and storage usage, disk throughput, Pod status, inode utilization, network bandwidth, support for both real-time and historical metrics searching.
- Ability to match with the enterprise's own monitoring system.
- The built-in monitoring service supports high availability, and alarm service will be available in v2.0.0. 
- Ability to view resource usage ranking.

## Service and Network Management 

- Provide wizard-style UI for Service and Ingress management, expose the applications externally much easier for users. 
- Support for connecting with QingCloud load balancer.

## Application Management 

- Ability to one-click deployment from App templates, support manage deployed applications.
- Using OpenPitrix as the backend repository services to provide users with full application lifecycle management features.


## Infrastructure Management  

- Providing StorageClass, node, cluster, and resource quota management. 
- Support for mainstream open source storage solutions, such as GlusterFS, Ceph RBD, as well as QingCloud Block Storage and NeonSan, etc.
- Support for image registry management, image security scanning, etc.

## Image Management 

Ability to manage built-in Harbor image registry, support to add Docker Hub or Private Harbor image registry.

## Configuration Management 

- Providing centralized management of custom configuration, support for configuration history query
- Enabling different application configuration (e.g., Environment Variable, Port Management, ConfigMap and Secret, health check, credentials, service configuration.)