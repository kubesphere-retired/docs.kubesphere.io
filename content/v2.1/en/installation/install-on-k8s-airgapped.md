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

## Configure Image Registry

You need to configure a image registry (e.g. Harbor) into Docker configuration, see [Configure Harbor](../integrate-harbor) for further information.

## Download Image Package

Execute the following command to download the image packages:

```
curl -L https://kubesphere.io/download/images/latest > kubesphere-all-images-v2.1.1.tar.gz \
&& tar -zxf kubesphere-all-images-v2.1.1.tar.gz && cd kubesphere-all-images-v2.1.1
```

> Note: It will take several tens of minutes since the package includes all components and samples images.

List all images in this folder.

```
$ tree
.
tree
.
├── example_images.tar
├── istio_images.tar
├── ks_devops_images.tar
├── ks_logging_images.tar
├── ks_minimal_images.tar
├── ks_notification_images.tar
└── openpitrix_images.tar
```

Load the image packages into docker.


```
docker load < ks_minimal_images.tar
docker load < openpitrix_images.tar
docker load < ks_logger_images.tar
docker load < ks_devops_images.tar
docker load < istio_images.tar
docker load < ks_notification_images.tar
docker load < example_images.tar
```

## Push Images to Harbor

Clone the project `ks-installer` to your local, then enter the `scripts` folder.

```
git clone https://github.com/kubesphere/ks-installer.git

cd ks-installer/scripts
```

Since we have to push a batch of images to Harbor within the different projects, we can use the following script to create the corresponding projects.

```
vi create_project_harbor.sh
```

Please replace the image registry address with yours in the following script.

```
···
url="http://192.168.0.31"
user="admin"
passwd="Harbor12345"
```

Execute the following script to create the corresponding projects in Harbor.

```
./create_project_harbor.sh
```

Execute the following script to push the images that we have loaded above to the Harbor registry in batch, you need to attach the Harbor address and execute the script as follows.

```
./download-docker-images.sh 192.168.0.31:80
```

### Installation

Back to root folder of this repository, and add a new field of Harbor address. Please edit the `kubesphere-minimal.yaml` or `kubesphere-complete-setup.yaml` according to your needs.

```
···
    alerting:
      enabled: true

    local_registry: 192.168.0.31:80   # Add a new field of Harbor address to this line.

kind: ConfigMap
···
```

Install KubeSphere using kubectl.

- If there are 1 Core and 2 GB RAM available in your cluster, use the command below to start a default minimal installation only:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-minimal.yaml
```

You can refer to [enable other pluggable components](../install-on-k8s-airgapped/#enable-pluggable-components) to install other components at your will.

- If there are 8 Cores and 16 GB RAM available in your cluster, use the command below to install a complete KubeSphere, i.e. with all components enabled:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-complete-setup.yaml
```

Verify the real-time logs use the command as follows.

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

When you see the following outputs above, congratulation! You can access KubeSphere console in your browser now.

## Enable Pluggable Components

If you start with a default minimal installation, execute the following command to open the configmap in order to enable more pluggable components at your will. Make sure your cluster has enough CPU and memory, see [Enable Pluggable Components](../pluggable-components).

```bash
kubectl edit cm -n kubesphere-system ks-installer
```
