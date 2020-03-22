---
title: "Image Registry"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
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

#### Add the Internal Harbor

KubeSphere Installer has integrated Harbor's Helm Chart, which is an optional installation item, so it requires to enable the installation in advance, users can configure the installation according to the needs of the teams. Before start installation, you just need to configure in `conf/vars.yml`, see [Integrating Harbor registry](../../installation/harbor-installation).

#### Connect the External Harbor

According to the address type of the Harbor, you need to divide into http and https:

##### http

1. You need to modify the Docker configuration in all nodes of the cluster. For example, if there is an external harbor registry and its IP is `http://192.168.0.99`, then you need to add a field as `--insecure-registry=192.168.0.99` into `/etc/systemd/system/docker.service.d/docker-options.conf`.

**Sample**

```bash
[Service]
Environment="DOCKER_OPTS=--registry-mirror=https://registry.docker-cn.com --insecure-registry=10.233.0.0/18 --graph=/var/lib/docker --log-opt max-size=50m --log-opt max-file=5 \
--insecure-registry=192.168.0.99"
```

2. Next, you need to reload the configuration file and restart Docker:

```
$ sudo systemctl daemon-reload
```

```
$ sudo systemctl restart docker
```

3. Configure `/etc/hosts` for IP and domain name:

```
192.168.0.99 harbor.devops.kubesphere.local
```

4. Log in KubeSphere, enter a project, navigate to **Configuration → Secret**, create a secret with `Image Repositry Secret`, fill in the information as following

![Add Harbor Registry Secret](https://pek3b.qingstor.com/kubesphere-docs/png/20200219141059.png)



##### https

1. For an image registry of the https protocol, firstly you need to get the image registry certificate, notes as `ca.crt`. Take the URL ` https://harbor.openpitrix.io` as an example, you need to execute following command to all the nodes in the cluster:

```bash
$ sudo cp ca.crt /etc/docker/certs.d/harbor.openpitrix.io/ca.crt
```

- If it still reports permission errors, you need to execute following command according to different operating systems:

**UBUNTU**

```bash
$ sudo cp ca.crt /usr/local/share/ca-certificates/harbor.openpitrix.io.ca.crt
```

```bash
$ sudo update-ca-certificates
```
**RED HAT ENTERPRISE LINUX**

```bash
$ sudo cp ca.crt /etc/pki/ca-trust/source/anchors/harbor.openpitrix.io.ca.crt
```
```bash
$ sudo update-ca-trust
```

2. Next, you need to reload the configuration file and restart Docker when you're done, see [Docker Documentation](https://docs.docker.com/registry/insecure/#troubleshoot-insecure-registry):

```bash
$ sudo systemctl systemctl daemon-reload
```

```bash
$ sudo systemctl restart docker
```

3. Then fill in the authentication information needed for the image registry in KubeSphere console, and refer to the above steps of adding Docker Hub to create a Harbor image registry.

## Using a Image Registry

Take the creation of a deployment as an example to demonstrate how to use the image registry and pull images from the registry. For example, there is a image `mysql:5.6` in QingCloud image registry. When creating a Deployment, enter `dockerhub.qingcloud.com/mysql:5.6` in the Pod template, the format is `image registry address:tag`, this image could be pulled from the pointed registry after the workload has been created.

![Using a Image Registry](https://pek3b.qingstor.com/kubesphere-docs/png/20190320150305.png)
