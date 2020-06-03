---
title: "Image Registry"
keywords: 'kubernetes, docker, registry, harbor'
description: 'Create a Secret to connect with Image Registry secret'
---

A Docker image is a read-only template that can be used to deploy container services, each with a specific unique identifier (i.e. Image name:Tag). For example, an image can contain a full Ubuntu operating system environment with only Apache or other applications that users need. The image registry is used to store and distribute Docker images.

## Create a Secret

Sign in with project-regular, enter into one project (e.g. demo-namespace), then select **Configuration Center → Secrets**.

Click **Create Secret** button, then fill in the basic information in the pop-up window.

![Edit Mode](https://pek3b.qingstor.com/kubesphere-docs/png/20190319163230.png)

### Add the QingCloud Docker Hub

1. On the basic information page, enter the name of the QingCloud Docker Hub, you can also fill in the description as your needs.



- Name: A concise and clear name for this registry, which is convenient for users to browse and search, e.g. `dockerhub-qingcloud`.
- Alias: Helps you better distinguish resources and supports Chinese.
- Description: A brief introduction to registry.

Click **Next** when you're done.  

![QingCloud Docker Hub](https://pek3b.qingstor.com/kubesphere-docs/png/20190320105702.png)

2. In the Secret Settings table, select `Image Repository Secret` as the type, then fill in the account authentication information of the image registry.



- Registry Address: Use QingCloud image registry address `dockerhub.qingcloud.com` as an example.
- Username/Password: Enter guest / guest
- Email: Fill in your personal email address

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190320105904.png)
![](https://pek3b.qingstor.com/kubesphere-docs/png/20190320113104.png)

3. Click **Create**, then redirect to the secrets list to view the creation results.

![ecrets list](https://pek3b.qingstor.com/kubesphere-docs/png/20190320113828.png)

### Add the Docker Hub

If you need to add Dokcer Hub as the image registry, first make sure you have already registered your account in Docker Hub. Then reference the same steps as above, fill in `docker.io` as the image registry address, and enter your personal DockerHub username and password.

![Add the Docker Hub](https://pek3b.qingstor.com/kubesphere-docs/png/20190320114604.png)

### Add the Harbor

**Intro**

[Harbor](https://goharbor.io/) is an an open source trusted cloud native registry project that stores, signs, and scans content. Harbor extends the open source Docker Distribution by adding the functionalities usually required by users such as security, identity and management.

<!-- #### Add the Internal Harbor

KubeSphere Installer has integrated Harbor's Helm Chart, which is an optional installation item, so it requires to enable the installation in advance, users can configure the installation according to the needs of the teams. Before start installation, you just need to configure in `conf/vars.yml`, see [Integrating Harbor registry](../../installation/harbor-installation). -->

#### Connect the External Harbor

According to the address type of the Harbor, you need to divide into http and https:

##### http

1. You need to modify the Docker configuration in all nodes of the cluster. For example, if there is an external harbor registry and its IP is `http://192.168.0.99`, then you need to add a field as `--insecure-registry=192.168.0.99` into `/etc/systemd/system/docker.service.d/docker-options.conf`.

**Example**

```bash
[Service]
Environment="DOCKER_OPTS=--registry-mirror=https://registry.docker-cn.com --insecure-registry=10.233.0.0/18 --data-root=/var/lib/docker --log-opt max-size=50m --log-opt max-file=5 \
--insecure-registry=192.168.0.99"
```
Here, the `Environment` string represents the [dockerd options](https://docs.docker.com/engine/reference/commandline/dockerd/).

`--insecure-registry`: In order to communicate with an insecure registry, the Docker daemon requires `--insecure-registry` fields. Refer to the [docker docs](https://docs.docker.com/engine/reference/commandline/dockerd/#insecure-registries) for its syntax.


2. Next, you need to reload the configuration file and restart Docker:

```
$ sudo systemctl daemon-reload
```

```
$ sudo systemctl restart docker
```

3. Log in KubeSphere, enter a project, navigate to **Configuration → Secret**, create a secret by choosing `Image Repositry Secret`, fill in the `Registry Address` with your Harbor IP.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200523091901.png)

4. If you want to use the domain name instead of IP with Harbor, you may need to configure the CoreDNS and nodelcaldns within the K8s cluster, then follow with the above to create a secret.

##### https

As for https type of Harbor registry, you can refer to [Harbor Documentation](https://goharbor.io/docs/1.10/install-config/configure-https/), make sure you use `docker login` to connect with your Harbor. 

Then you follow all the steps from the above `http` section to finish the configuration.



## Using a Image Registry

Take the creation of a deployment as an example to demonstrate how to use the image registry and pull images from the registry. For example, there is a image `mysql:5.6` in QingCloud image registry. When creating a Deployment, enter `dockerhub.qingcloud.com/mysql:5.6` in the Pod template, the format is `image registry address:tag`, this image could be pulled from the pointed registry after the workload has been created.
