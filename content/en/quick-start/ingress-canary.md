---
title: "Using Ingress-Nginx for Grayscale Release" 
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

In [Managing Canary Release of Microservice App based on Istio](), KubeSphere implemented grayscale publishing for the Bookinfo microservices sample application based on Istio. Some users have indicated that their project has not yet been on Istio. How do you implement grayscale publishing?

In [Ingress-Nginx (v0.21.0)](https://github.com/kubernetes/ingress-nginx/releases/tag/nginx-0.21.0), a new Canary feature has been introduced that can be used to configure multiple backend services for gateway portals, as well as to control traffic distribution between multiple backend services using specified annotations. . In [v2.0.2](../release/release-v202/), KubeSphere upgraded the Ingress Controller version to 0.24.1 to support [Ingress-Nginx](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#canary)-based grayscale publishing.

In the previous article, several application scenarios of grayscale publishing have been introduced in detail. This article will directly introduce and demonstrate the implementation of grayscale publishing based on KubeSphere using Ingress and Ingress Controller.

> Note: The sample yaml source files and code used in this article have been uploaded to [GitHub](https://github.com/kubesphere/tutorial) and can be cloned for local convenience.



## Introduction to Ingress-Nginx Annotation

Based on the [Nginx Ingress Controller](https://github.com/kubernetes/ingress-nginx/#nginx-ingress-controller), KubeSphere implements the project's gateway as a proxy for external traffic and a reverse proxy for each service in the project. Ingress-Nginx supports the configuration of Ingress Annotations to implement grayscale publishing and testing in different scenarios. It can meet the business scenarios of Canary Publishing, Blue-Green Deployment, and A/B Testing.

> [Nginx Annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#canary) supports the following four Canary rules:
> - `nginx.ingress.kubernetes.io/canary-by-header`：Flow segmentation based on Request Header for grayscale publishing and A/B testing. When the Request Header is set to `always` , the request will be sent to the Canary version all the time. When set to `never`, the request will not be sent to the Canary entry. For any other Header value, the Header will be ignored and the request is prioritized by comparison with other Canary rules.
> - `nginx.ingress.kubernetes.io/canary-by-header-value`：The value of the Request Header to match to tell Ingress to route the request to the service specified in Canary Ingress. When the Request Header is set to this value, it will be routed to the Canary entry. This rule allows the user to customize the value of the Request Header and must be used with the previous annotation (ie: canary-by-header).
> - `nginx.ingress.kubernetes.io/canary-weight`：Service-weighted traffic segmentation for blue-green deployments, weight range 0 - 100 Route requests to services specified in Canary Ingress. A weight of 0 means that the Canary Rules will not send any requests to the services of the Canary portal. A weight of 100 means that all requests will be sent to the Canary portal.
> - `nginx.ingress.kubernetes.io/canary-by-cookie`：Cookie-based traffic segmentation for grayscale publishing and A/B testing. A cookie that tells Ingress to route requests to the service specified in Canary Ingress. When the value of cookie is set to `always` , it will be routed to the Canary portal; when set to `never` , the request will not be sent to the Canary entry; for any other value, the cookie is ignored and the request is prioritized against other Canary rules.
> 
Note: The Canary Rules are sorted in order of priority:
> `canary-by-header - > canary-by-cookie - > canary-weight`


The above four annotation rules can be divided into the following two categories:

- Weight-based Canary rule

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826201233.png#align=left&display=inline&height=598&originHeight=598&originWidth=1826&search=&status=done&width=1826)

- Canary rules based on user requests

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826204915.png#align=left&display=inline&height=564&originHeight=564&originWidth=1820&search=&status=done&width=1820)


## Step 1: Create Project and the application of Production version

1.1. Create a business space (spacespace) and a project (namespace) in KubeSphere. You can refer to [Getting Started with Multi-tenant Management](../admin-quick-start.md). A sample project has been created as follows.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190827104830.png#align=left&display=inline&height=1778&originHeight=1778&originWidth=2848&search=&status=done&width=2848)

1.2. To create an application easily, create a workload and service in your project by `edit yaml` , or use the **toolbox** in the bottom right corner of KubeSphere to open `web kubectl` and create a Production version of the application with the following command and yaml file and expose it to the cluster access. Create a `deployment`  and `service` for the Production version as follows.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190827111540.png#align=left&display=inline&height=1026&originHeight=1026&originWidth=2800&search=&status=done&width=2800)

```bash
$ kubectl appy -f production.yaml -n ingress-demo
deployment.extensions/production created
service/production created
```

The yaml file used is as follows:

**production. yaml**

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: production
spec:
  replicas: 1
  selector:
    matchLabels:
      app: production
  template:
    metadata:
      labels:
        app: production
    spec:
      containers:
      - name: production
        image: mirrorgooglecontainers/echoserver:1.10
        ports:
        - containerPort: 8080
        env:
          - name: NODE_NAME
            valueFrom:
              fieldRef:
                fieldPath: spec.nodeName
          - name: POD_NAME
            valueFrom:
              fieldRef:
                fieldPath: metadata.name
          - name: POD_NAMESPACE
            valueFrom:
              fieldRef:
                fieldPath: metadata.namespace
          - name: POD_IP
            valueFrom:
              fieldRef:
                fieldPath: status.podIP

---

apiVersion: v1
kind: Service
metadata:
  name: production
  labels:
    app: production
spec:
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
    name: http
  selector:
    app: production
```

1.3. Create a Production version of Ingress.

```bash
$ kubectl appy -f production.ingress -n ingress-demo
ingress.extensions/production created
```

The yaml file used is as follows:

**production.ingress**

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: production
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
  - host: kubesphere.io
    http:
      paths:
      - backend:
          serviceName: production
          servicePort: 80
```


## Step 2: Access the application of Production version

2.1. At this point, you can see all the resources under the ingress-demo project under the enterprise space demo-workspace of the KubeSphere UI.

**Deployment**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826161618.png#align=left&display=inline&height=654&originHeight=654&originWidth=2752&search=&status=done&width=2752)

**Service**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190827143704.png#align=left&display=inline&height=704&originHeight=704&originWidth=2786&search=&status=done&width=2786)

**Ingress**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826161919.png#align=left&display=inline&height=652&originHeight=652&originWidth=2774&search=&status=done&width=2774)

2.2. Access the Production version of the application to ensure that the current project has opened the gateway, open the gateway under the **external network access**, the type is `NodePort`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826161846.png#align=left&display=inline&height=1080&originHeight=1080&originWidth=2764&search=&status=done&width=2764)

2.3. Access the Production version of the app below.
```bash
$ curl --resolve kubesphere.io:30205:192.168.0.88 kubesphere.io:30205 
# Note that adding the --resolve parameter eliminates the need to configure IP and domain name mappings in /etc/hosts locally, otherwise you need to configure the domain name mapping locally, where 192.168.0.88 is the gateway address within the project.

Hostname: production-6b4bb8d58d-7r889

Pod Information:
	node name:	ks-allinone
	pod name:	production-6b4bb8d58d-7r889
	pod namespace:	ingress-demo
	pod IP:	10.233.87.165

Server values:
	server_version=nginx: 1.12.2 - lua: 10010

Request Information:
	client_address=10.233.87.225
	method=GET
	real path=/
	query=
	request_version=1.1
	request_scheme=http
	request_uri=http://kubesphere.io:8080/

Request Headers:
	accept=*/*
	host=kubesphere.io:30205
	user-agent=curl/7.29.0
apiVersion: extensions/v1beta1
	x-forwarded-for=192.168.0.88
	x-forwarded-host=kubesphere.io:30205
	x-forwarded-port=80
	x-forwarded-proto=http
	x-original-uri=/
	x-real-ip=192.168.0.88
	x-request-id=9596df96e994ea05bece2ebbe689a2cc
	x-scheme=http

Request Body:
	-no body in request-
```


## Step 3: Create a Canary version

Refer to the `production.yaml` file of the above Production version, and then create a Canary version of the application, including a Canary version of `deployment` and `service` (for demonstration, just replace the keyword `production` in the `production.yaml` deployment and service production to `canary`. The actual scenario may involve business code changes).



## Step 4: Ingress-Nginx Annotation Rules


### Based on Weight

A typical application scenario for weight-based traffic segmentation is a `Blue-green deployment`, which can be achieved by setting the weight to 0 or 100. For example, you can set the Green version to the main part and the Blue version's entry to Canary. Initially, the weight is set to 0, so traffic is not proxied to the Blue version. Once the new version has been tested and verified successfully, you can set the weight of the Blue version to 100, which means that all traffic goes from Green to Blue.


4.1. Use the following `canary.ingress` yaml file to create an application routing (Ingress) based on the weighted Canary version.

> Note: To enable the grayscale publishing mechanism, first set `nginx.ingress.kubernetes.io/canary: "true"`  to enable Canary. The following Canary version of the Ingress example uses an annotation rule **based on weights for traffic segmentation**, which will be assigned 30% traffic request to sent to the Canary version.


```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: canary
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "30"
spec:
  rules:
  - host: kubesphere.io
    http:
      paths:
      - backend:
          serviceName: canary
          servicePort: 80
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826162507.png#align=left&display=inline&height=774&originHeight=774&originWidth=2770&search=&status=done&width=2770)

4.2. Access the domain name of the app.

> Note: After the application's Canary version is based on the weight (30%) for traffic segmentation, the probability of accessing the Canary version is close to 30%, and the traffic ratio may have a small range of fluctuations.


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826163309.png#align=left&display=inline&height=494&originHeight=494&originWidth=1350&search=&status=done&width=1350)


### Based on Request Header

4.3. The classic application scenes based on Request Header's traffic segmentation are `greyscale release or A/B test scenes`. Refer to the screenshot below. Add an annotation of `nginx.ingress.kubernetes.io/canary-by-header: canary` for Ingress in KubeSphere's Canary edition. (The annotation value here can be random.) Realize the current Ingress and segregate the traffic  based on the Ingress. 

> Note: The Canary Rules are prioritized by `canary-by-header - > canary-by-cookie - > canary-weight`, so in the following case, rules for the original canary-weight will be ignored.


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826174117.png#align=left&display=inline&height=870&originHeight=870&originWidth=2272&search=&status=done&width=2272)

4.4. Add a different Header value to the request and access the domain name of the app again.

> Note:

> For examples, as mentioned in the opening paragraph, when the Request Header is set to `never` or `always`, the request will `not` or `always` be sent or always sent to the Canary version;
> For any other Header value, the Header is ignored and the request is prioritized by comparison with other Canary rules (the second request has a 30% weight as the first priority).


![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826182043.png#align=left&display=inline&height=852&originHeight=852&originWidth=1772&search=&status=done&width=1772)

4.5. You can add an `nginx.ingress.kubernetes.io/canary-by-header-value: user-value`  to the previous annotation (that is, canary-by-header). Used to notify Ingress to route requests to the service specified in Canary Ingress.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826184040.png#align=left&display=inline&height=764&originHeight=764&originWidth=1922&search=&status=done&width=1922)

4.6. The application's domain name is accessed as follows. When the Request Header satisfies this value, all requests are routed to the Canary version (this rule allows the user to customize the value of the Request Header).

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190826185701.png#align=left&display=inline&height=476&originHeight=476&originWidth=1758&search=&status=done&width=1758)


### Based on Cookie

Similar to the Request Header-based annotation usage rules. For example, in the `A/B 测试` scenario, you need to let the users in Beijing have access to the Canary version. Then when the cookie's annotation is set to `nginx.ingress.kubernetes.io/canary-by-cookie: "users_from_Beijing"`. Now the background user can check the logged in user request, and set the value of the cookie  `users_from_Beijing` to `always` if the user access source is from Beijing. For always, this will ensure that users in Beijing only access the Canary version.

## Summary

The grayscale release can ensure the stability of the overall system. When the initial grayscale is used, the new version can be tested, found and adjusted to ensure its influence. This article demonstrates and demonstrates the use of Ingress and Ingress Controller for grayscale publishing based on Kubeel, and details the four Annotations of Ingress-Nginx. Users who have not used Istio can also easily implement grayscale publishing with Ingress-Nginx. Released with the canary.

## References

- [NGINX Ingress Controller - Annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#canary)
- [canary deployment with ingress-nginx](https://www.elvinefendi.com/2018/11/25/canary-deployment-with-ingress-nginx.html)
- [Canary Deployments on Kubernetes without Service Mesh](https://medium.com/@domi.stoehr/canary-deployments-on-kubernetes-without-service-mesh-425b7e4cc862)
