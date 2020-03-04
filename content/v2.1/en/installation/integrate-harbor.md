---
title: "Configure Harbor"
keywords: 'kubernetes, kubesphere, harbor, registry'
description: 'How to configure Harbor registry in Docker'
---

This tutorial walks you through how to configure a image registry in Docker configuration. We will configure a registry with HTTP protocol, i.e. insecure registry, enables you to use the image registry in KubeSphere. This procedure configures Docker to entirely disregard security for your registry. Only use this solution for isolated testing or in a tightly controlled, air-gapped environment. For production environment, we recommended you to use image registry with HTTPS protocol.

We take Harbor image registry as an example. Assuming you have a [Harbor](https://goharbor.io/) image registry with its address `http://192.168.0.31:80`.

## Configure Insecure Registry

1. Log in SSH client, modify the systemd configuration in `/etc/systemd/system/docker.service.d/docker-options.conf` in the cluster. <font color="red">Please notice that this example method below is only used for docker configuration in systemd, you can refer to [Docker Documentation - Test an insecure registry](https://docs.docker.com/registry/insecure/) for further information.</font>

Substitute the address of your insecure registry, e.g. Harbor address for the one in the example:

```yaml
[Service]
Environment="DOCKER_OPTS= --insecure-registry=http://192.168.0.21:80 --registry-mirror=https://dockerhub.azk8s.cn --data-root=/var/lib/docker --log-opt max-size=10m --log-opt max-file=3  "
```

2. Reload the Docker configuration as follows.

```
systemctl daemon-reload
```

3. Restart Docker for the changes to take effect.

```
systemctl restart docker
```

4. Make sure the Harbor address has been added into docker info:

```
$ docker info
···
Insecure Registries:
 192.168.0.31:80
···
```

5. Repeat these steps on every Kubernetes host to enable the insecure registry.

## Test Registry Configuration

1. Make sure you can log in to Harbor successfully.

```
$ docker login -u admin -p Harbor12345 http://192.168.0.31:80
WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

2. We can test the Harbor registry by pushing an image. Assuming we have image `nginx:1.14-alpine` in local. Tag this image as follows:

```bash
docker tag nginx:1.14-alpine 192.168.0.31:80/library/nginx:1.14-alpine
```

3. Push the image to the Harbor registry.

```bash
docker push 192.168.0.31:80/library/nginx:1.14-alpine
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200303204511.png)

4. It means the Harbor registry has been added in Docker configuration, you are able to use Harbor in KubeSphere. Please back to [Install KubeSphere in Air Gapped Kubernetes Cluster](../install-on-k8s-airgapped/#download-image-package) to continue the installation.
