---
title: "Configure Harbor"
keywords: 'kubernetes, kubesphere, harbor, registry'
description: 'How to configure Harbor registry in Docker'
---

This tutorial walks you through how to configure Harbor in Docker configuration, enabling you to use Harbor with KubeSphere.

Assume you have a [Harbor](https://goharbor.io/) image registry with its address `http://192.168.0.31:80`.

1. Log in SSH client, create a new file `/etc/docker/daemon.json` in KubeSphere cluster.

```yaml
{
  "insecure-registries": [
    "192.168.0.31"
  ]
}
```

2. Reload the Docker configuration as follows.

```
systemctl reload docker
```

3. Make sure the Harbor address has been added into docker info:

```
$ docker info
···
Insecure Registries:
 192.168.0.31:80
···
```
