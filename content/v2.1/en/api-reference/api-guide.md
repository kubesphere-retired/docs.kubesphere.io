---
title: "How to Invoke KubeSphere API"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---


`ks-apigateway` is KubeSphere's API gateway. After the deployment of KubeSphere, you can refer to the API developer guide as following. 


## Step 1: Exposing ks-apigatway service
 

ks-apigatway's service port can be set as NodePort. In this way, ks-apigatway service can be exposed. You can choose to use UI or commands to realize the exposure:

<div class="md-tabs">
<input type="radio" name="tabs" id="ui" checked="checked">
<label for="ui">Using KubeSphere UI</label>
<span class="md-tab">

### Using KubeSphere UI

1. Log in KubeSphere console and enter into `system-workspace`-> project `kubesphere-system`. In the service list, click and enter into the service's page of `ks-apigateway`. 

2. Click「More Operation」 -> 「Edit External Network Access」. Set the access mode as `NodePor` and click confirm.

3. You can find the generated NodePort as NodePort in the service page. 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190704143243.png)


</span>
<input type="radio" name="tabs" id="cmd">
<label for="cmd">Using Command</label>
<span class="md-tab">

### Using Command

1. Log in to KubeSphere using the admin account, open Web Kubectl in the 「Toolbox」 in the lower right corner, and execute the following command

```bash
$ kubectl -n kubesphere-system patch svc ks-apigateway -p '{"spec":{"type":"NodePort"}}'
service/ks-apigateway patched
```

2. Use the following command to view the generated port number. The port number returned  is 31078.

```bash
$ kubectl -n kubesphere-system get svc ks-apigateway -o jsonpath='{.spec.ports[0].nodePort}'
31078
```

</span>
</div>

## Step 2: Get Token

All the KubeSphere's APIs should pass the JWT Bearer token authentication. Before invoking API, you need to get `access_token` from `/kapis/iam.kubesphere.io/v1alpha2/login` port. Then add the `Authorization: Bearer <access_token>` into the following requests.

Open Web Kubectl at the lower right corner of KubeSphere. Execute the following commands where `192.168.0.20` is the sample's node IP and 31078 is the ks-apigatway service exposed in the previous step.

```bash
$ curl -X POST "http://192.168.0.20:31078/kapis/iam.kubesphere.io/v1alpha2/login" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"password\": \"P@88w0rd\", \"username\": \"admin\"}"
{
 "access_token": "eyJhbGxxxxxxS44"
}
```

## Step 3: Invoke KubeSphere API

After getting the Access Token, the KubeSphere API can be invoked in a user-defined request function. For further details, please refer to [API Guide](../api-docs).

## How to Access to Swagger UI

KubeSphere's API can be previewed in  [Swagger UI](https://swagger.io/). Access the URL `http://IP:NodePort/swagger-ui` to visit Swagger UI such as  `http://192.168.0.20:31078/swagger-ui/`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190704190556.png)
