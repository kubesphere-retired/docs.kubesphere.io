---
title: "Install KubeSphere in Air Gapped Kubernetes Cluster"
keywords: 'kubernetes, kubesphere, air gapped, installation'
description: 'How to install KubeSphere in an Air Gapped Kubernetes Cluster'
---

![KubeSphere+K8s](https://pek3b.qingstor.com/kubesphere-docs/png/20191123144507.png)

If you are going to install KubeSphere in an air gapped Kubernetes cluster, please refer to the following steps.

## Prerequisites

> - `Kubernetes version`： `1.15.x, 1.16.x, 1.17.x`
> - `Helm version` >= `2.10.0`，see [Install and Configure Helm in Kubernetes](https://devopscube.com/install-configure-helm-kubernetes/);
> - You need to have a image registry (e.g. Harbor)
> - An existing Storage Class in your Kubernetes clusters, use `kubectl get sc` to verify it.
> - The CSR signing feature is activated in kube-apiserver, see [RKE installation issue](https://github.com/kubesphere/kubesphere/issues/1925#issuecomment-591698309).

## Download Image Package

Execute following image package, go to the image packages folder.

```
curl -L https://kubesphere.io/download/offline/latest > kubesphere-all-offline-v2.1.1.tar.gz \
&& tar -zxf kubesphere-all-offline-v2.1.1.tar.gz && cd kubesphere-all-offline-v2.1.1/Repos/images-v2.1.1
```

List all images in this folder.

```
$ tree
.
├── csi_qingcloud_images.tar
├── example_images.tar
├── istio_images.tar
├── k8s_images.tar
├── ks_devops_images.tar
├── ks_logger_images.tar
├── ks_minimal_images.tar
├── ks_notification_images.tar
├── local_volume_images.tar
└── openpitrix_images.tar
```



## Configure Image Registry

Make sure you have configured a image registry, e.g. Harbor into Docker configuration, see [Integrate Harbor Registry](../integrate-harbor).

### Installation

Install KubeSphere using kubectl.

- If there are 1 Core and 2 GB RAM available in your cluster, use the command below to trigger a default minimal installation only:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```

- If there are 8 Cores and 16 GB RAM available in your cluster, use the command below to install a complete KubeSphere, i.e. with all components enabled:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-complete-setup.yaml
```

Verify the real-time logs. When you see the following outputs, congratulation! You can access KubeSphere console in your browser now.

```bash
$ kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l app=ks-install -o jsonpath='{.items[0].metadata.name}') -f

#####################################################
###              Welcome to KubeSphere!           ###
#####################################################
Console: http://10.128.0.34:30880
Account: admin
Password: P@88w0rd

NOTE：Please modify the default password after login.
#####################################################
```

## Enable Pluggable Components

If you start with a default minimal installation, execute the following command to open the configmap in order to enable more pluggable components at your will. Make sure your cluster has enough CPU and memory, see [Enable Pluggable Components](../pluggable-components).

```bash
kubectl edit cm -n kubesphere-system ks-installer
```
