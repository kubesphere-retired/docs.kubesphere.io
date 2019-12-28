---
title: "Exposing your App: Creating a Service and Ingress"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere has built a global load balancer into each project (namespace), Ingress Controller, which is responsible for fulfilling the Ingress. Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster. Traffic routing is controlled by rules defined on the Ingress resource.

[Kubernetes-ingress](https://github.com/nginxinc/kubernetes-ingress/tree/master/examples/complete-example) provides such an example: As for website `https://cafe.example.com`, if users access the URL `https://cafe.example.com/coffee` then it will return "Coffee Ordering System". Similarly, when access the URL `https://cafe.example.com/tea` then it will return "Tea Ordering System".

To elaborate this process, we will create a Deployment, Service and Ingress to expose an application in this tutorial.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716144703.png#alt=)

## Prerequisites

You've completed all steps in [Getting Started with Multi-tenant Management](../admin-quick-start.md).

## Estimated Time

About 20 minutes.

## Hands-on Lab

### Create Deployments

To get started, we'll create a tea deployment and a coffee deployment respectively.

#### Step 1: Create a Tea

1.1. Sign in with `project-regular`, then enter into `demo-project`. Choose **Workloads → Deployments** and click **Create Deployment**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716151135.png#alt=)

1.2. Name it as `tea`, click **Next**.

1.3. Set the replicas to `2`, and click **Add Container**. Then fill in the Pod Template according to the following hints.

- Image: `nginxdemos/hello:plain-text`
- Container Name: tea
- Service Settings: Name it as `port`, fill in `80` with the `TCP` protocol.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716153100.png#alt=)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716153503.png#alt=)

1.4. Click **Next → Create** to complete `tea` deployment creation.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716154022.png#alt=)

#### Step 2: Create a Coffee

2.1. Similarly, click **Create** button to create a "Coffee Ordering System" deployment.

2.2. Name it as `coffee` and click **Next**, then set the replicas to `2`, and click **Add Container**. Then fill in the Pod Template according to the following hints.

- Image: `nginxdemos/hello:plain-text`
- Container Name: coffee
- Service Settings: Name it as `port`, fill in `80` with the `TCP` protocol.

2.3. Click **Next → Create** to complete `coffee` deployment creation.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716155835.png#alt=)

### Create Services

In this section, we'll create a tea service and a coffee service for their deployments respectively. Choose **Network & Services → Services**, then click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716160348.png#alt=)

#### Step 3: Create a tea-svc

3.1. Name it as `tea-svc`, click **Next**.

3.2. Choose the first item `Virtual IP: Access the service through the internal IP of the cluster`, then fill in the Service Settings page according to the following hints.

- Click `Specify Workload` and select `tea`, click **Next**.
- Ports:

  - Name it as `port`
  - Service Port: 80
  - Container Port: 80

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716160742.png#alt=)

3.3. Then click **Next → Create** to complete the creation.

#### Step 4: Create a coffee-svc

4.1. Similarly, click **Create** button to create a Service, name it as `coffee-svc`.

4.2. Then Specify the workload to `coffee`, the other options are the same with `tea-svc`. Finally, click **Create** after other blanks are filled. At this point, two services have been successfully created.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716162410.png#alt=)

#### Step 5: Create a TLS Certificate

Since the domain name bound in the route is the HTTPS protocol, we need to create the TLS certificate as a Secret.

5.1. Choose **Configuration Center → Secrets**, then click **Create**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716162728.png#alt=)

5.2. Name it as `cafe-secret`, click **Next**. Select the `TLS` as the Type, then copy and paste Credential and Private Key as following, click **Create** when you've done.

```bash
#Credential

-----BEGIN CERTIFICATE-----
MIIDLjCCAhYCCQDAOF9tLsaXWjANBgkqhkiG9w0BAQsFADBaMQswCQYDVQQGEwJV
UzELMAkGA1UECAwCQ0ExITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0
ZDEbMBkGA1UEAwwSY2FmZS5leGFtcGxlLmNvbSAgMB4XDTE4MDkxMjE2MTUzNVoX
DTIzMDkxMTE2MTUzNVowWDELMAkGA1UEBhMCVVMxCzAJBgNVBAgMAkNBMSEwHwYD
VQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQxGTAXBgNVBAMMEGNhZmUuZXhh
bXBsZS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCp6Kn7sy81
p0juJ/cyk+vCAmlsfjtFM2muZNK0KtecqG2fjWQb55xQ1YFA2XOSwHAYvSdwI2jZ
ruW8qXXCL2rb4CZCFxwpVECrcxdjm3teViRXVsYImmJHPPSyQgpiobs9x7DlLc6I
BA0ZjUOyl0PqG9SJexMV73WIIa5rDVSF2r4kSkbAj4Dcj7LXeFlVXH2I5XwXCptC
n67JCg42f+k8wgzcRVp8XZkZWZVjwq9RUKDXmFB2YyN1XEWdZ0ewRuKYUJlsm692
skOrKQj0vkoPn41EE/+TaVEpqLTRoUY3rzg7DkdzfdBizFO2dsPNFx2CW0jXkNLv
Ko25CZrOhXAHAgMBAAEwDQYJKoZIhvcNAQELBQADggEBAKHFCcyOjZvoHswUBMdL
RdHIb383pWFynZq/LuUovsVA58B0Cg7BEfy5vWVVrq5RIkv4lZ81N29x21d1JH6r
jSnQx+DXCO/TJEV5lSCUpIGzEUYaUPgRyjsM/NUdCJ8uHVhZJ+S6FA+CnOD9rn2i
ZBePCI5rHwEXwnnl8ywij3vvQ5zHIuyBglWr/Qyui9fjPpwWUvUm4nv5SMG9zCV7
PpuwvuatqjO1208BjfE/cZHIg8Hw9mvW9x9C+IQMIMDE7b/g6OcK7LGTLwlFxvA8
7WjEequnayIphMhKRXVf1N349eN98Ez38fOTHTPbdJjFA/PcC+Gyme+iGt5OQdFh
yRE=
-----END CERTIFICATE-----

#Private Key

-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAqeip+7MvNadI7if3MpPrwgJpbH47RTNprmTStCrXnKhtn41k
G+ecUNWBQNlzksBwGL0ncCNo2a7lvKl1wi9q2+AmQhccKVRAq3MXY5t7XlYkV1bG
CJpiRzz0skIKYqG7Pcew5S3OiAQNGY1DspdD6hvUiXsTFe91iCGuaw1Uhdq+JEpG
wI+A3I+y13hZVVx9iOV8FwqbQp+uyQoONn/pPMIM3EVafF2ZGVmVY8KvUVCg15hQ
dmMjdVxFnWdHsEbimFCZbJuvdrJDqykI9L5KD5+NRBP/k2lRKai00aFGN684Ow5H
c33QYsxTtnbDzRcdgltI15DS7yqNuQmazoVwBwIDAQABAoIBAQCPSdSYnQtSPyql
FfVFpTOsoOYRhf8sI+ibFxIOuRauWehhJxdm5RORpAzmCLyL5VhjtJme223gLrw2
N99EjUKb/VOmZuDsBc6oCF6QNR58dz8cnORTewcotsJR1pn1hhlnR5HqJJBJask1
ZEnUQfcXZrL94lo9JH3E+Uqjo1FFs8xxE8woPBqjZsV7pRUZgC3LhxnwLSExyFo4
cxb9SOG5OmAJozStFoQ2GJOes8rJ5qfdvytgg9xbLaQL/x0kpQ62BoFMBDdqOePW
KfP5zZ6/07/vpj48yA1Q32PzobubsBLd3Kcn32jfm1E7prtWl+JeOFiOznBQFJbN
4qPVRz5hAoGBANtWyxhNCSLu4P+XgKyckljJ6F5668fNj5CzgFRqJ09zn0TlsNro
FTLZcxDqnR3HPYM42JERh2J/qDFZynRQo3cg3oeivUdBVGY8+FI1W0qdub/L9+yu
edOZTQ5XmGGp6r6jexymcJim/OsB3ZnYOpOrlD7SPmBvzNLk4MF6gxbXAoGBAMZO
0p6HbBmcP0tjFXfcKE77ImLm0sAG4uHoUx0ePj/2qrnTnOBBNE4MvgDuTJzy+caU
k8RqmdHCbHzTe6fzYq/9it8sZ77KVN1qkbIcuc+RTxA9nNh1TjsRne74Z0j1FCLk
hHcqH0ri7PYSKHTE8FvFCxZYdbuB84CmZihvxbpRAoGAIbjqaMYPTYuklCda5S79
YSFJ1JzZe1Kja//tDw1zFcgVCKa31jAwciz0f/lSRq3HS1GGGmezhPVTiqLfeZqc
R0iKbhgbOcVVkJJ3K0yAyKwPTumxKHZ6zImZS0c0am+RY9YGq5T7YrzpzcfvpiOU
ffe3RyFT7cfCmfoOhDCtzukCgYB30oLC1RLFOrqn43vCS51zc5zoY44uBzspwwYN
TwvP/ExWMf3VJrDjBCH+T/6sysePbJEImlzM+IwytFpANfiIXEt/48Xf60Nx8gWM
uHyxZZx/NKtDw0V8vX1POnq2A5eiKa+8jRARYKJLYNdfDuwolxvG6bZhkPi/4EtT
3Y18sQKBgHtKbk+7lNJVeswXE5cUG6EDUsDe/2Ua7fXp7FcjqBEoap1LSw+6TXp0
ZgrmKE8ARzM47+EJHUviiq/nupE15g0kJW3syhpU9zZLO7ltB0KIkO9ZRcmUjo8Q
cpLlHMAqbLJ8WYGJCkhiWxyal6hYTyWY4cVkC0xtTl/hUE9IeNKo
-----END RSA PRIVATE KEY-----
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716163243.png#alt=)

#### Step 6: Create a cafe-ingress

6.1. Choose **Network & Services → Routes**, and click **Create Route** button.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716163434.png#alt=)

6.2. Name it as `cafe-ingress`, then click **Next**.

6.3. Choose **Specify Domain** and fill in the table as following:

- HostName: `cafe.example.com`
- Protocol: Choose `https`
- Secret Name: Choose `cafe-secret`
- Paths:

  - Input `/coffee`, then choose `coffee-svc` as the service and select `80` as the port
  - Click **Add Path**, input `/tea`, then choose `tea-svc` as the service and select `80` as the port

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716170243.png#alt=)

6.4. Click **Next** after you've done, then skip to the final step to click **Create**, we can see the `cafe-ingress` has been created successfully.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190716170813.png#alt=)

#### Step 7: Access the Application via Route

So far, we have exposed two different application via route and its rules. We can access the **tea** and **coffee** application through different path.

For example, when we visit `https://cafe.example.com:{$HTTPS_PORT}/coffee`, any one of the coffee Pod should respond to the request. As following demo, the Server name and Server address is corresponding to the Pod `coffee-5db79467d6-ghm95`.

```bash
$ curl --resolve cafe.example.com:30972:192.168.0.88 https://cafe.example.com:30972/coffee --insecure
Server address: 10.233.87.215:80
Server name: coffee-5db79467d6-ghm95
Date: 16/Jul/2019:09:24:33 +0000
URI: /coffee
Request ID: d396d300af9df6d31e0c1edd50d5da54

$ kubectl get pod -n demo-project -o wide
NAME                      READY   STATUS    RESTARTS   AGE    IP       NODE          NOMINATED NODE   READINESS GATES
coffee-5db79467d6-ghm95   1/1     Running   0          93m    10.233.87.215   ks-allinone   <none>           <none>
```

Similarly, when we visit `https://cafe.example.com:{$HTTPS_PORT}/tea`, any one of the tea Pod should respond to the request. As following demo, the Server name and Server address is corresponding to the Pod `tea-5bf6c889c4-vlv69`.

```bash
$ curl --resolve cafe.example.com:30972:192.168.0.88 https://cafe.example.com:30972/tea --insecure
Server address: 10.233.87.174:80
Server name: tea-5bf6c889c4-vlv69
Date: 16/Jul/2019:09:31:01 +0000
URI: /tea
Request ID: 3f047c0461640da52c6d152039d016e1

$ kubectl get pod -n demo-project -o wide
NAME                      READY   STATUS    RESTARTS   AGE    IP     NODE          NOMINATED NODE   READINESS GATES
tea-5bf6c889c4-vlv69      1/1     Running   0          106m   10.233.87.174   ks-allinone   <none>           <none>
```

#### Conclusion

According to above instruction, it indicates that the route has successfully forwarded different requests to the corresponding back-end service, and the service redirects that traffic to one of the Service’s backend Pods.
