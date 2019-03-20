---
title: "Secret"
---

A Secret is an object that contains a small amount of sensitive data such as a password, a token, or a key. Such information might otherwise be put in a Pod specification or in an image; putting it in a Secret object allows for more control over how it is used, and reduces the risk of accidental exposure.

## Create a Secret

Sign in with project-regular, enter into one project (e.g. demo-namespace), then select **Configuration Center → Secrets**.

![Create a Secret](https://pek3b.qingstor.com/kubesphere-docs/png/20190319162656.png)

### Step 1: Fill in the Basic Information

1.1. Click **Create Secret** button, then fill in the basic information in the pop-up window. There are two ways to create a Secret, i.e. **fill in the creation table** and **edit mode**. The following mainly introduces each step within creation table. If you prefer edit mode, you can click on the **edit mode** button, it supports the yaml and json formats. Edit mode makes it easy for users who are used to command operations.

![Edit Mode](https://pek3b.qingstor.com/kubesphere-docs/png/20190319163230.png)

1.2. On the basic information page, enter the name of the Secret, you can also fill in the description as required.

- Name: A concise and clear name for this Secret, which is convenient for users to browse and search.
- Alias: Helps you better distinguish resources and supports Chinese.
- Description: A brief introduction to Secret.

Click **Next** when you're done.  

![basic information](https://pek3b.qingstor.com/kubesphere-docs/png/20190319163014.png)

### Step 2: Secret Settings

In the Secret settings, the following 4 types are supported:

- Default (Opaque): Secret in base 64 encoding format, used to store passwords, sensitive data, etc. See this following example:

```yaml
Data:
  Password: hello123
  Username: guest
```

- TLS (kubernetes.io/tls): Commonly used to save information such as TLS certificates and private keys. It can be used to encrypt Ingress. The TLS secret must contain keys named tls.crt and tls.key, saved with Credential and Private Key. See this following example:

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

- Image Repository Secret (kubernetes.io/dockerconfigjson): It's used to store the authentication information of the image registry, such as the following information, see [Image Registry](../image-registry):
   - Repository address: dockerhub.qingcloud.com
   - Username: guest
   - Password: 'guest'
   - Email: 123@test.com

- Custom: Allows users to create a type (type) that is similar to the default (Opaque) type, both of them are key-value pairs.

![Secret Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190319165447.png)

## Using a Secret

Secrets can be mounted as data volumes or be exposed as environment variables to be used by a container in a pod. 

- In Volume, click on **Reference Config Center**, then select the created Secret.
- In the Environment Variables, click **Reference Config Center** then select the created key.

![Using a Secret](https://pek3b.qingstor.com/kubesphere-docs/png/20190319175940.png)

![Using a Secret](https://pek3b.qingstor.com/kubesphere-docs/png/20190319180017.png)

For more information on how to use the Secret, see [Quick-Start - Deploy a MySQL Application](../../quick-start/mysql-deployment).


