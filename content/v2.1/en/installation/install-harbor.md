---
title: "Enable Harbor Installation"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'How to Enable Built-in Harbor Registry'
---

[Harbor](https://goharbor.io/) is an an open source trusted cloud native registry project that stores, signs, and scans content. Harbor extends the open source Docker Distribution by adding the functionalities usually required by users such as security, identity and management.

KubeSphere Installer integrates Harbor's Helm Chart, built-in Harbor as an optional installation item, you can enable its installation according to test in air gap environment, follow with the steps below to install Harbor registry.

<font color="red">Attention: We only recommend you to use built-in Harbor in test and development environment, please reference [Harbor Documentaion](https://github.com/goharbor/harbor/blob/master/docs/installation_guide.md) for production.</font>

## Enable Harbor Before Installation

1. Before installing KubeSphere, you can set `Harbor_enable: true` in `conf/common.yml` to enable Harbor installation.

```
# harbor deployment
Harbor_enable: true
Harbor_domain: harbor.devops.kubesphere.local
```

2. Save it, then you can back to follow all-in-one or multi-node guide to execute the installation, finally you can install Harbor together with KubeSphere.

## Enable Harbor After Installation

If you already have set up KubeSphere without enabling Harbor, you still can edit the ConfigMap of ks-installer using the following command:

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

Then set logging from `False` to `True`:

```yaml
    harbor:
        enabled: True
        domain: harbor.devops.kubesphere.local  ## Whether to install Harbor
```

Save it and exit. The Harbor registry will be installed automatically. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.

## Configure Domain Name

Note that you need to configure `insecure registry` for docker daemon, refer to [Add Harbor Registry with http protocol](../../configuration/image-registry/#http).

## How to use Harbor

To add Harbor as a image registry in KubeSphere, please refer to the following steps to configure Docker access and then add the user authentication information of Harbor in KubeSphere.

### Login with Docker

1. Before you log in Harbor, ensure if the domain name has been configured into docker, execute `docker info` to verify it.

```
$ docker info

···
Insecure Registries:
  harbor.devops.kubesphere.local:30280
···
```

2. If you can see above domain, that proves Harbor installation was successful.

```
$ docker login -u admin -p Harbor12345 http://harbor.devops.kubesphere.local:30280

WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

### Push Image to Harbor Registry

For the tutorials of how to build and package images and how to write Dockerfile, see [Docker Documentaion](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/).

Since we already have image `nginx:1.14-alpine` locally after KubeSphere installation, then we'll demonstrate how to push this image to Harbor registry.


1. Tag the local nginx image as `1.14-alpine`.

```
docker tag nginx:1.14-alpine harbor.devops.kubesphere.local:30280/library/nginx:1.14-alpine
```

2. Push it to Harbor registry:

```
docker push harbor.devops.kubesphere.local:30280/library/nginx:1.14-alpine
```

Then you'll be able to verify it by accessing the Harbor console in browser.

### Access Harbor Console

The internal Harbor registry is only supported in http protocol. You can access Harbor console using `http://harbor.devops.kubesphere.local:30280` after adding a record  into `etc/hosts`.


```
139.198.16.160 harbor.devops.kubesphere.local
```

**How to login**


- Account: admin
- Password: Harbor12345


> Note: You can also login Harbor with the LDAP user accounts in KubeSphere.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200104152927.png)

Now, you can enter into project **libraby** to verify the image that we pushed in previous step.

### Add Harbor in KubeSphere

Sign in KubeSphere, enter into one project (e.g. demo-namespace), then select **Configuration Center → Secrets**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200104155620.png)

Click **Create Secret** button, then fill in the basic information and secret settings in the pop-up window.

#### Step 1: Basic information

On the basic information page, enter the name of the registry, you can also fill in the description as your needs.


- Name: A concise and clear name for this registry, which is convenient for users to browse and search, e.g. `harbor-registry`.
- Alias: input "test-registry", it helps you better distinguish resources and supports Chinese.
- Description: A brief introduction to this registry.

Click **Next** when you're done.

#### Step 2: Fill in the Harbor Authentication

2.1. Select `Image Repositry Secret`, refer to the following prompt to fill in the login authentication of the Harbor registry.



- Registry Address: Enter `harbor.devops.kubesphere.local:30280`
- Username: admin
- Password: Harbor12345
- Email: Fill in your personal email address


Click **Create** when you're done.

![Fill in the Harbor Authentication](https://pek3b.qingstor.com/kubesphere-docs/png/harbor-secret.png)

2.2. If the Harbor configuration and the authentication information are both correct, then it can be created successfully. Once the Harbor registry has been added, you can upload and pull the image.

![Created successfully](https://pek3b.qingstor.com/kubesphere-docs/png/20190322205528.png)


### Use Image From Harbor Registry

In this section, you'll be able to use images from Harbor registry when creating workload in KubeSphere

For example, we've pushed a image   `harbor.devops.kubesphere.local:30280/library/nginx:1.14-alpine` to Harbor in previous step, thus we can create a deployment using this image as following.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200104161758.png)
