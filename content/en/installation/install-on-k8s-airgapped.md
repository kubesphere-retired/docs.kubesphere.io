---
title: "Deploy KubeSphere on Air-Gapped Kubernetes Cluster"
keywords: "kubernetes, kubesphere, air-gapped, installation"
description: "How to install KubeSphere on an air-gapped Kubernetes cluster"
---

![KubeSphere+K8s](https://pek3b.qingstor.com/kubesphere-docs/png/20191123144507.png)

This document explains how to install KubeSphere on an air-gapped Kubernetes cluster.

> Note: first of all, please read the [prerequisites](../prerequisites).

## Image Registry

You need an image registry set up for the cluster to use. If not yet, please see [Configure Harbor](../integrate-harbor) for the instructions.

## Step 1: Download Images

We provide two ways to download KubeSphere images, the image list and the zipped image package.

<font color="red">Docker uses `/var/lib/docker` as the default directory where all Docker related files including the images are stored. Before loading the images into Docker, please check if the disk is big enough. Usually we recommend you to add additional storage to the disk mounted at `/var/lib/docker` since it requires at least 100G more storage. You can use the [fdisk](https://www.computerhope.com/unix/fdisk.htm) command to expand the disk.</font>

### Option 1: Image List

KubeSphere provides the list of images for you to download one by one to your target machine.

> Note:
>
> - These image files are about 30G, please make sure there are enough space in your machine.
> - You can use the script [download-image-list.sh](https://github.com/kubesphere/ks-installer/blob/master/scripts/download-image-list.sh) to pull them in batch.

<details><summary> Image lists (Click here to expand)</summary>

```yaml
ks_minimal_images:
  - kubesphere/ks-console:v2.1.1
  - kubesphere/kubectl:v1.0.0
  - kubesphere/ks-account:v2.1.1
  - kubesphere/ks-devops:flyway-v2.1.0
  - kubesphere/ks-apigateway:v2.1.1
  - kubesphere/ks-apiserver:v2.1.1
  - kubesphere/ks-controller-manager:v2.1.1
  - kubesphere/cloud-controller-manager:v1.4.0
  - kubesphere/ks-installer:v2.1.1
  - quay.azk8s.cn/kubernetes-ingress-controller/nginx-ingress-controller:0.24.1
  - mirrorgooglecontainers/defaultbackend-amd64:1.4
  - gcr.azk8s.cn/google_containers/metrics-server-amd64:v0.3.1
  - kubesphere/configmap-reload:v0.3.0
  - kubesphere/prometheus:v2.5.0
  - kubesphere/prometheus-config-reloader:v0.34.0
  - kubesphere/prometheus-operator:v0.34.0
  - kubesphere/kube-rbac-proxy:v0.4.1
  - kubesphere/kube-state-metrics:v1.7.2
  - kubesphere/node-exporter:ks-v0.16.0
  - kubesphere/addon-resizer:1.8.4
  - kubesphere/k8s-prometheus-adapter-amd64:v0.4.1
  - grafana/grafana:5.2.4
  - redis:5.0.5-alpine
  - haproxy:2.0.4
  - alpine:3.10.4
  - quay.azk8s.cn/coreos/etcd:v3.2.18
  - mysql:8.0.11
  - nginx:1.14-alpine
  - postgres:9.6.8
  - osixia/openldap:1.3.0
  - minio/minio:RELEASE.2019-08-07T01-59-21Z
  - minio/mc:RELEASE.2019-08-07T23-14-43Z

ks_notification_images:
  - kubesphere/notification:v2.1.0
  - kubesphere/notification:flyway_v2.1.0
  - kubesphere/alerting-dbinit:v2.1.0
  - kubesphere/alerting:v2.1.0
  - kubesphere/alert_adapter:v2.1.0

openpitrix_images:
  - openpitrix/release-app:v0.4.3
  - openpitrix/openpitrix:flyway-v0.4.8
  - openpitrix/openpitrix:v0.4.8
  - openpitrix/runtime-provider-kubernetes:v0.1.3

ks_devops_images:
  - kubesphere/jenkins-uc:v2.1.1
  - jenkins/jenkins:2.176.2
  - jenkins/jnlp-slave:3.27-1
  - kubesphere/builder-base:v2.1.0
  - kubesphere/builder-nodejs:v2.1.0
  - kubesphere/builder-maven:v2.1.0
  - kubesphere/builder-go:v2.1.0
  - sonarqube:7.4-community
  - kubesphere/s2ioperator:v2.1.1
  - kubesphere/s2irun:v2.1.1
  - kubesphere/s2i-binary:v2.1.0
  - kubesphere/tomcat85-java11-centos7:v2.1.0
  - kubesphere/tomcat85-java11-runtime:v2.1.0
  - kubesphere/tomcat85-java8-centos7:v2.1.0
  - kubesphere/tomcat85-java8-runtime:v2.1.0
  - kubesphere/java-11-centos7:v2.1.0
  - kubesphere/java-8-centos7:v2.1.0
  - kubesphere/java-8-runtime:v2.1.0
  - kubesphere/java-11-runtime:v2.1.0
  - kubesphere/nodejs-8-centos7:v2.1.0
  - kubesphere/nodejs-6-centos7:v2.1.0
  - kubesphere/nodejs-4-centos7:v2.1.0
  - kubesphere/python-36-centos7:v2.1.0
  - kubesphere/python-35-centos7:v2.1.0
  - kubesphere/python-34-centos7:v2.1.0
  - kubesphere/python-27-centos7:v2.1.0

ks_logging_images:
  - kubesphere/elasticsearch-curator:v5.7.6
  - kubesphere/elasticsearch-oss:6.7.0-1
  - kubesphere/fluent-bit:v1.3.2-reload
  - docker.elastic.co/kibana/kibana-oss:6.7.0
  - dduportal/bats:0.4.0
  - docker:19.03
  - kubesphere/fluentbit-operator:v0.1.0
  - kubesphere/fluent-bit:v1.3.5-reload
  - kubesphere/configmap-reload:v0.0.1
  - kubesphere/log-sidecar-injector:1.0

istio_images:
  - istio/kubectl:1.3.3
  - istio/proxy_init:1.3.3
  - istio/proxyv2:1.3.3
  - istio/citadel:1.3.3
  - istio/pilot:1.3.3
  - istio/mixer:1.3.3
  - istio/galley:1.3.3
  - istio/sidecar_injector:1.3.3
  - istio/node-agent-k8s:1.3.3
  - jaegertracing/jaeger-operator:1.13.1
  - jaegertracing/jaeger-agent:1.13
  - jaegertracing/jaeger-collector:1.13
  - jaegertracing/jaeger-query:1.13
  - kubesphere/examples-bookinfo-productpage-v1:1.13.0
  - kubesphere/examples-bookinfo-reviews-v1:1.13.0
  - kubesphere/examples-bookinfo-reviews-v2:1.13.0
  - kubesphere/examples-bookinfo-reviews-v3:1.13.0
  - kubesphere/examples-bookinfo-details-v1:1.13.0
  - kubesphere/examples-bookinfo-ratings-v1:1.13.0

example_images:
  - busybox:1.31.1
  - joosthofman/wget:1.0
  - kubesphere/netshoot:v1.0
  - nginxdemos/hello:plain-text
  - wordpress:4.8-apache
  - mirrorgooglecontainers/hpa-example:latest
  - java:openjdk-8-jre-alpine
  - fluent/fluentd:v1.4.2-2.0
  - perl:latest
```

</details>

### Option 2: Zipped Image Package

Execute the following command to download the 7.2G image package.

```bash
curl -L https://kubesphere.io/download/images/latest > kubesphere-all-images-v2.1.1.tar.gz \
&& tar -zxf kubesphere-all-images-v2.1.1.tar.gz && cd kubesphere-images-v2.1.1
```

List all images in this folder.

```bash
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

Load the image packages into docker. If you only want to set up the default minimal installation, just load the `ks_minimal_images`. An installation with all optional components and examples requires to load all images as follows.

```bash
docker load < ks_minimal_images.tar
docker load < openpitrix_images.tar
docker load < ks_logging_images.tar
docker load < ks_devops_images.tar
docker load < istio_images.tar
docker load < ks_notification_images.tar
docker load < example_images.tar
```

## Step 2: Push Images to Harbor

Clone the project `ks-installer` to your local, then enter the `scripts` folder.

```bash
git clone https://github.com/kubesphere/ks-installer.git
cd ks-installer/scripts
```

Since we have to push a batch of images to different projects of Harbor, we can use the following script to create the corresponding projects.

```bash
vi create_project_harbor.sh
```

Please replace the image registry information with yours in the script.

```bash
···
url="http://192.168.0.31"
user="admin"
passwd="Harbor12345"
```

Execute the script to create the corresponding projects in Harbor.

```bash
./create_project_harbor.sh
```

Execute the following script to push the images that we have loaded above to the Harbor registry in batch.

```bash
./push-image-list.sh 192.168.0.31:80
```

## Step 3: Installation

Back to root folder of this repository, and add a new field of Harbor address. Please edit the `kubesphere-minimal.yaml` or `kubesphere-complete-setup.yaml` according to your needs.

```yaml
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

You can refer to [enable pluggable components](../install-on-k8s-airgapped/#enable-pluggable-components) to install optional components at your will.

- If there are 8 Cores and 16 GB RAM available in your cluster, use the command below to install a complete KubeSphere, i.e. with all components enabled:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubesphere/ks-installer/master/kubesphere-complete-setup.yaml
```

## Step 4: Verify Installation

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

When you see the outputs above, congratulation! You can access KubeSphere console in your browser now.

## Step 5: Enable Pluggable Components (Optional)

If you start with a default minimal installation, execute the following command to open the configmap in order to enable pluggable components. Make sure your cluster has enough CPU and memory, and the corresponding images need to be loaded. Please see [Configuration Table](https://github.com/kubesphere/ks-installer/blob/master/README.md#configuration-table) for the requirements and [Enable Pluggable Components](../pluggable-components) for the instructions.

```bash
kubectl edit cm -n kubesphere-system ks-installer
```
