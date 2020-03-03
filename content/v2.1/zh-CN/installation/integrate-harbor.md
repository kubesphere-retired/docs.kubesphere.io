---
title: "Configure Harbor"
keywords: 'kubernetes, kubesphere, harbor, registry'
description: 'How to configure Harbor registry in Docker'
---

This tutorial walks you through how to configure a image registry in Docker configuration, enabling you to use private image registry with KubeSphere.

This procedure configures Docker to entirely disregard security for your registry. This is insecure and is not recommended. It exposes your registry to trivial man-in-the-middle (MITM) attacks. Only use this solution for isolated testing or in a tightly controlled, air-gapped environment.

We take Harbor image registry as an example. Assuming you have a [Harbor](https://goharbor.io/) image registry with its address `http://192.168.0.31:80`.


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
