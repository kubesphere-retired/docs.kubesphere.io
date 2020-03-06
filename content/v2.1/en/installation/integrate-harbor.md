---
title: "Configure Harbor"
keywords: 'kubernetes, kubesphere, harbor, docker, registry'
description: 'How to configure Harbor registry for KubeSphere to use'
---

In private cloud or air-gapped environment, we usually set up our own image registry. This tutorial walks you through how to configure an image registry for KubeSphere to use. For simplicity, we will configure a registry with HTTP protocol, i.e., insecure registry. It is only for testing or development. For production environment, we recommended you to use image registry with HTTPS protocol.

We take [Harbor](https://goharbor.io/) image registry as an example.

## Configure Insecure Registry

1. Log in KubeSphere node via SSH, modify the systemd configuration in `/etc/systemd/system/docker.service.d/docker-options.conf`. 

> Note: This example is only for Docker configuration in systemd. You can refer to [Docker Documentation - Test an insecure registry](https://docs.docker.com/registry/insecure/) for more information.

Please remember replace the address with your own insecure registry, e.g., Harbor address for the configuration below:

```yaml
[Service]
Environment="DOCKER_OPTS= --insecure-registry=http://192.168.0.21:80 --data-root=/var/lib/docker --log-opt max-size=10m --log-opt max-file=3  "
```

2. Reload the Docker configuration.

```bash
systemctl daemon-reload
```

3. Restart Docker for the changes to take effect.

```bash
systemctl restart docker
```

4. Make sure the Harbor address has been added into Docker info:

```bash
$ docker info
···
Insecure Registries:
 192.168.0.31:80
···
```

5. Repeat these steps on every KubeSphere host to enable the insecure registry.

## Test Registry Configuration

1. Make sure you can log in to Harbor successfully.

```bash
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

![Harbor Dashboard](https://pek3b.qingstor.com/kubesphere-docs/png/20200303204511.png)

4. The screenshot above shows the image is pushed to the registry, which means the Harbor registry has been added in the node's Docker configuration.