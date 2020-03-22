---
title: "Verify Components Installation"
keywords: 'kubeSphere, kubernetes, pluggable components'
description: 'How to verify the components status after installing KubeSphere'
---

## Inspect the Installation Logs

When you enable the KubeSphere pluggable components for an installation, you may want to inspect the logs and verify if the installation is successful or not. If failed you need to know how to resolve it. You can follow the instuctions below for reference.

1. Inspect the dynamic real-time logs output from the Pod **ks-installer**.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

2. When the logs show the following result, it means the installation is successful.

```yaml
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

3. Then you will be able to log in to KubeSphere console, enter into `Platform` → `Service Components` and check the components status. Generally, each component should be healthy.

![Component Services](https://pek3b.qingstor.com/kubesphere-docs/png/20200103174444.png)

## Verify the Result of Pluggable Components

In addition to viewing the component status on the console, you can also use the web kubectl to confirm whether the pluggable component is successfully installed or not.

General speaking, when all pods of a namespace display **Running**, and all jobs show **Completed**, it means the component is successfully installed.

### Verify KubeSphere Minimal Installation

By default, KubeSphere Installer will be started with minimal installation. You can check the status of Pods and Jobs in the following three namespaces where all system workloads of KubeSphere are running.

```bash
kubectl get pod -n kubesphere-system
kubectl get pod -n kubesphere-monitoring-system
kubectl get pod -n kube-system
```

### Verify KubeSphere Application Store Installation

If you have enabled [KubeSphere Application Store](../install-openpitrix), you can verify the status of Pods and Jobs using the following command.

```bash
kubectl get pods -n openpitrix-system
```

### Verify KubeSphere DevOps System Installation

If you have enabled [KubeSphere DevOps System](../install-devops), you can verify the status of Pods and Jobs using the following command.

```bash
kubectl get pods -n kubesphere-devops-system
```

### Verify KubeSphere Logging System Installation

If you have enabled [KubeSphere Logging System](../install-logging), you can verify the status of Pods and Jobs using the following command.

```bash
kubectl get pods -n kubesphere-logging-system
```

### Verify KubeSphere Service Mesh Installation

If you have enabled [KubeSphere Service Mesh (Istio-based)](../install-servicemesh), you can verify the status of Pods and Jobs using following command.

```bash
kubectl get pods -n istio-system
```

### Verify Metrics-server Installation

If you have enabled [Metrics-server](../install-metrics-server), you can verify the status of Pods  using the following command.

```bash
kubectl get pods -n kube-system | grep metrics-server
```

## How to Restart ks-installer

when you see installation process get stucked, you may need to restart the installation. You can delete the Pod **ks-installer** or scale it to reinstall.

```bash
kubectl delete pod ks-installer-xxxxxx-xxxxx -n kubesphere-system
```
