---
title: "Install on Kubernetes (Offline)" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

This guide is for offline installation, make sure your Kubernetes cluster meets the prerequisites below, see [Prerequisites](../prerequisites) for more details.

> - Kubernetes Version: from `1.13.0` to `1.15.x`
> - Helm Version: `>= 2.10.0`
> - Available Memory: `>= 10 G`
> - Already have Storage Class (Recommended)

1. Download the offine installation package and then uncompress it.

```bash
$ wget https://kubesphere-installer.pek3b.qingstor.com/ks-only/kubesphere-images-advanced-2.0.2.tar.gz
```
 
```bash
$ tar -zxvf kubesphere-images-advanced-2.0.2.tar.gz
```

2. Loading the package using docker command (It may take longer to import since the image package is larger).

```
$ docker load < kubesphere-images-advanced-2.0.2.tar
```

3. Clone the remote repository and then execute the script to import the required images for the installation into the local repository.

```
$ git clone https://github.com/kubesphere/ks-installer.git
$ cd scripts
$ ./download-docker-images.sh LOCAL_REGISTRY_ADDRESS
```

> Note：Replace the “LOCAL_REGISTRY_ADDRESS” with your local registry address, e.g. `./download-docker-images.sh  192.168.1.2:5000`
   
4. Replace the image name with your local address in `deploy/kubesphere-installer.yaml`.

> Note：`192.168.1.2:5000/kubespheredev/ks-installer:advanced-2.0.2` is an example image address, replace it with your own image address.

```yaml
$ sed -i 's|kubespheredev/ks-installer:advanced-2.0.2|192.168.1.2:5000/kubespheredev/ks-installer:advanced-2.0.2|g' deploy/kubesphere-installer.yaml
```

5. Follow with [Installing KubeSphere](../install-on-k8s#installing-kubesphere) guide to continue this installation.