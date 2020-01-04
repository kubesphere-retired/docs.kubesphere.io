---
title: "Verify Components Installation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'Install metrics-server to enable HPA'
---

## Inspect the Installation Logs

After enabled the installation of KubeSphere pluggable components, you will be able to inspect the installation logs of ks-installer pod, verify that if the installation was successful.


1. Inspect the dynamic real-time logs outputed from pod "ks-installer".

```bash
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

2. When the logs output as following result, means the installation was successful.


```
#####################################################
###              Welcome to KubeSphere!           ###
#####################################################

Console: http://192.168.0.53:30880
Account: admin
Password: P@88w0rd

NOTES：
  1. After logging into the console, please check the
     monitoring status of service components in
     the "Cluster Status". If the service is not
     ready, please wait patiently. You can start
     to use when all components are ready.
  2. Please modify the default password after login.

#####################################################
```

3. Then you'll be able to log in to KubeSphere, enter into `Platform` → `Service Components` and check if the components status. Generally, each component should be healthy.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200103174444.png)


## Verify the Result of Pluggable Components

In addition to viewing the component status on the console, you can also use the web kubectl to confirm whether the pluggable component was successfully installed.

> Important: Generally, when all pods of a namespace display **Running**, and all jobs show **Completed**, that demonstrates the component was successfully installed.

### Verify KubeSphere Minimal Installation

By default, KubeSphere Installer will be started with minimal installation, you can check the status of Pods and Jobs in following 3 namespaces, all workloads of KubeSphere minimal are running under these 3 namespaces as well.

```bash
$ kubectl get pod -n kubesphere-system
$ kubectl get pod -n kubesphere-monitoring-system
$ kubectl get pod -n kube-system
```

### Verify KubeSphere Application Store Installation

If you've enabled [KubeSphere Application Store](../install-openpitrix), you can verify the status of Pod and Job using following command.

```bash
$ kubectl get pod -n openpitrix-system
```

### Verify KubeSphere DevOps System Installation

If you've enabled [KubeSphere DevOps System](../install-devops), you can verify the status of Pod and Job using following command.

```bash
$ kubectl get pod -n kubesphere-devops-system
```

### Verify KubeSphere Logging System Installation

If you've enabled [KubeSphere Logging System](../install-logging), you can verify the status of Pod and Job using following command.

```bash
$ kubectl get pod -n kubesphere-logging-system
```

### Verify KubeSphere Service Mesh Installation

If you've enabled [KubeSphere Service Mesh (Istio-based)](../install-servicemesh), you can verify the status of Pod and Job using following command.

```bash
$ kubectl get pod -n istio-system
```

### Verify Metrics-server Installation

If you've enabled [Metrics-server](../install-metrics-server), you can verify the status of Pod  using following command.


```bash
$ kubectl get pod -n kube-system | grep metrics-server
```

### How to Restart ks-installer

when you see installation process get stucked, you may need to restart the installation, you can delete the Pod **ks-installer** or scale it to reinstall.

```
$ kubectl delete pod ks-installer-xxxxxx-xxxxx -n kubesphere-system
```
