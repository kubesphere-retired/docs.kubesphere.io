---
title: "Secrets"
keywords: "kubesphere, kubernetes, docker, secret"
description: "Introduction to Kubernetes Secrets"
---

A Secret is an object that contains a small amount of sensitive data such as a password, a token, or a key. Such information might otherwise be put in a Pod specification or in an image; putting it in a Secret object allows for more control over how it is used, and reduces the risk of accidental exposure.

## Create a Secret

Sign in with `project-regular` account, enter into one project such as `demo-project` created in [Getting Start with Multi-Tenant Management](../../quick-start/admin-quick-start), then select **Configuration Center → Secrets**.

![Create a Secret](https://pek3b.qingstor.com/kubesphere-docs/png/20190319162656.png)

### Step 1: Fill in Basic Information

1.1. Click **Create Secret** button, then fill in basic information in the pop-up window. There are two ways to create a Secret, i.e., **UI Mode** and **Edit Mode**. The following mainly introduces each step of UI mode. If you prefer edit mode, you can click on the **Edit Mode** button, which supports yaml format and json format. Edit mode makes it easy for users who are used to editing yaml-like file directly.

![Edit Mode](https://pek3b.qingstor.com/kubesphere-docs/png/20190319163230.png)

1.2. On the basic information page, enter the name of the Secret. You can also fill in the description as necessary.

- Name: a concise and clear name for this Secret, which is convenient for users to browse and search.
- Alias: helps you better distinguish resources and supports languages other than English.
- Description: a brief introduction to this Secret.

Click **Next** when you're done.  

![Basic Information](https://pek3b.qingstor.com/kubesphere-docs/png/20190319163014.png)

### Step 2: Secret Settings

In the Secret settings, there are four types of secret as below are supported:

- Default (Opaque): Secret in base 64 encoding format, used to store passwords, sensitive data, etc. See the following example:

```yaml
Data:
  Password: hello123
  Username: guest
```

- TLS (kubernetes.io/tls): Commonly used to save information such as TLS certificates and private keys. It can be used to encrypt Ingress. The TLS secret must contain keys named tls.crt and tls.key, saved with Credential and Private Key. See the following example:

```yaml
apiVersion: v1
Data:
  Tls.crt: base64 encoded cert
  Tls.key: base64 encoded key
Kind: Secret
Metadata:
  Name: testsecret
  Namespace: default
Type: kubernetes.io/tls
```

- Image Repository Secret (kubernetes.io/dockerconfigjson): It is used to store the authentication information of an image registry, such as the following information, see [Image Registry](../image-registry):

  - Repository address: `dockerhub.qingcloud.com`
  - Username: `guest`
  - Password: `guest`
  - Email: `123@test.com`

- Custom: Allows users to create a type (type) that is similar to the default (Opaque) type. Both of them are key-value pairs.

![Secret Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190319165447.png)

## Using a Secret

Secrets can be mounted as data volumes or exposed as environment variables to be used by a container in a Pod.

- In Volume, click on **Reference Config Center**, then select the created Secret.
- In the Environment Variables, click **Reference Config Center** then select the created key.

![Using a Secret](https://pek3b.qingstor.com/kubesphere-docs/png/20190319175940.png)

![Using a Secret](https://pek3b.qingstor.com/kubesphere-docs/png/20190319180017.png)

For more information on how to use the Secret, see [Quick-Start - Deploy a MySQL Application](../../quick-start/mysql-deployment).

## Create Common Used Secrets

### Create Secret of DockerHub

Enter into **Configuration Center→ Secrets**, click **Create**.

![Secret List](https://pek3b.qingstor.com/kubesphere-docs/png/20200207165442.png)

Enter its name, e.g. `dockerhub-id`, then choose **Next**.

![Secret Basic Info](https://pek3b.qingstor.com/kubesphere-docs/png/20200207165617.png)

Select **Image Repository Secret** from the dropdown list, enter `docker.io` into **Registry Address**, then input your DockerHub user name and password. Click **Create** when you are done.

![Secret Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20200207171625.png)

### Create GitHub

Creating a GitHub secret is similiar as above. Enter its name, e.g. `github-id`, and choose **Account Password Secret**. Then input your GitHub user name and password, and click **Create**.

![GitHub Secret](https://pek3b.qingstor.com/kubesphere-docs/png/20200207174736.png)
