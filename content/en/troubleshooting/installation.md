---
title: "Troubleshooting Guide for Installation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'The guide for installing all-in-one KubeSphere for developing or testing'
---

This guide contains information to help you troubleshoot issues when installing KubeSphere. We summarized the common issues regarding installation on Linux machines or Kubernetes cluster, welcome to contribute your diagnostic conclusions or experience if it is not included in this guide.

## Inspect the Installation Logs

- When you installing KubeSphere or enabling the KubeSphere pluggable components, how to inspect the logs?

**Answer**

You may need to verify if the installation is successful or not. Please inspect the dynamic real-time logs output from the Pod **ks-installer**. The installation logs is very helpful to debug and locate issues.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f
```

## How to Restart ks-installer

- When I see the installation process get stucked for long time, how to restart the installation?

**Answer**

You can delete the Pod **ks-installer** or restart the Deployment it to reinstall.

```bash
kubectl rollout restart deploy -n kubesphere-system ks-installer-xxx-xxx
```

## Create client certificate failed

- Everything seems OK except the "ks-account" Pod that is in "CrashLoopBackOff" mode. The pod fails with `create client certificate failed: <nil>`. I can display the console login page but can't login, it fails with"unable to access backend services".

```
$ kubectl get pods -n kubesphere-system
NAME                                   READY   STATUS             RESTARTS   AGE
ks-account-789cd8bbd5-nlvg9            0/1     CrashLoopBackOff   20         79m
ks-apigateway-5664c4b76f-8vsf4         1/1     Running            0          79m
ks-apiserver-75f468d48b-9dfwb          1/1     Running            0          79m
ks-console-78bddc5bfb-zlzq9            1/1     Running            0          79m
ks-controller-manager-d4788677-6pxhd   1/1     Running            0          79m
ks-installer-75b8d89dff-rl76c          1/1     Running            0          81m
openldap-0                             1/1     Running            0          80m
redis-6fd6c6d6f9-6nfmd                 1/1     Running            0          80m

$ kubectl logs -n kubesphere-system ks-account-789cd8bbd5-nlvg9
W0226 00:40:43.093650       1 client_config.go:549] Neither --kubeconfig nor --master was specified.  Using the inClusterConfig.  This might not work.
E0226 00:40:44.709957       1 kubeconfig.go:62] create client certificate failed: <nil>
E0226 00:40:44.710030       1 im.go:1030] create user kubeconfig failed sonarqube create client certificate failed: <nil>
E0226 00:40:44.710057       1 im.go:197] user init failed sonarqube create client certificate failed: <nil>
E0226 00:40:44.710073       1 im.go:87] create default users user sonarqube init failed: create client certificate failed: <nil>
Error: user sonarqube init failed: create client certificate failed: <nil>
```

**Answer**

KubeSphere uses CSR to issue kubeconfig to each user, that needs extra configuration on kube-apiserver, refer to [Managing tls in a cluster](https://kubernetes.io/docs/tasks/tls/managing-tls-in-a-cluster/#a-note-to-cluster-administrators). A standard Kubernetes cluster is enabled by default, but it is not enabled on a RKE. So you need to add this manually:

You can add in the RKE cluster config file the following, see [how to activate the CSR signing feature in RKE](https://github.com/rancher/rke/issues/546) for further information.

```
services:
  kube-controller:
    extra_args:
      cluster-signing-cert-file: /etc/kubernetes/ssl/kube-ca.pem
      cluster-signing-key-file: /etc/kubernetes/ssl/kube-ca-key.pem
```

## ks-openldap does not exist

- How to solve this issue like `\"ks-openldap\" does not exist` as follows when I installing KubeSphere on the existing Kubernetes cluster?

```bash
···
Error: validation failed: [services \"openldap\" not found, statefulsets.apps \"openldap\" not found]", "stderr_lines": ["Error: validation failed: [services \"openldap\" not found, statefulsets.apps \"openldap\" not found]"], "stdout": "Release \"ks-openldap\" does not exist. Installing it now.
```

**Answer**

You can try to change the helm version to `2.16.1`, or try to delete openldap using `helm del --purge ks-openldap`, and  restart the Pod `ks-installer` using `kubectl rollout restart deploy -n kubesphere-system ks-installer`.
