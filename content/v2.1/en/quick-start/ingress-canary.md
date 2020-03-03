---
title: "13. Canary Release based on Ingress-Nginx"
keywords: 'nginx, kubernetes, kubesphere, istio'
description: 'Canary Release on Kubernetes based on Ingress-Nginx'
---

As we demonstrated in [Managing Canary Release of Microservice App based on Istio](../bookinfo-canary), you can use KubeSphere to implement grayscale release in your project based on Istio. However, users indicate that their project is not using Istio, how to implement grayscale release?

In [Ingress-Nginx (v0.21.0)](https://github.com/kubernetes/ingress-nginx/releases/tag/nginx-0.21.0), it brings a new feature with "Canary", which could be used as a load balancer for gateway, the canary annotation enables the Ingress spec to act as an alternative service for requests to route to depending on the rules applied, and control the traffic splits. KubeSphere built-in gateway of each project supports the "Canary" feature of [Ingress-Nginx](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#canary).


We have elaborated on the scenarios of grayscale in the Istio bookinfo guide, thus we are going to demonstrate how to use KubeSphere route and gateway, namely, Ingress and Ingress-Controller respectively, to implement grayscale release.


> Note: The demo YAML files has been uploaded to [GitHub](https://github.com/kubesphere/tutorial).

## Introduction to Ingress-Nginx Annotation

Based on [Nginx Ingress Controller](https://github.com/kubernetes/ingress-nginx/#nginx-ingress-controller), KubeSphere implemented the gateway in each project, namely, Kubernetes namespace, serving as the traffic entry and a reverse proxy of each project.

> [Nginx Annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#canary) supports following rules after `nginx.ingress.kubernetes.io/canary: "true"` is set, please refer to [Nginx Annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#canary) for further explanation:
> - `nginx.ingress.kubernetes.io/canary-by-header`
> - `nginx.ingress.kubernetes.io/canary-by-header-value`
> - `nginx.ingress.kubernetes.io/canary-weight`
> - `nginx.ingress.kubernetes.io/canary-by-cookie`
>
> Note: Canary rules are evaluated in order of precedence. Precedence is as follows:
> `canary-by-header - > canary-by-cookie - > canary-weight`.

The above four annotation rules can be generally divided into the following two categories:

- The Canary rules based on the weight

![Weight-Based Canary](https://pek3b.qingstor.com/kubesphere-docs/png/20200229182539.png)

- The Canary rules based on the user request

![User-Based Canary](https://pek3b.qingstor.com/kubesphere-docs/png/20200229182554.png)

# Prerequites

Use `project-admin` account to log in KubeSphere, create a project `ingress-demo`

## Step 1: Create Project and Application

1.1. Use `project-admin` account to log in KubeSphere, create a project `ingress-demo`, please refer to [Getting Started with Multi-tenant Management](../admin-quick-start).

1.2. For quick demonstration, log in KubeSphere with `admin` account, open **Web kubectl** from **Toolbox**, then use the following command and YAML to create an application with `Production` version, exposing its service to outside. We create a `deployment` and `service` respectively:

```bash
$ kubectl apply -f production.yaml -n ingress-demo
deployment.extensions/production created
service/production created
```

![web kubectl](https://pek3b.qingstor.com/kubesphere-docs/png/20200229121159.png)

We use the YAML as follows:

**production.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: production
  labels:
    app: production
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

1.3. You can create a Ingress of `Production` version.

```bash
$ kubectl apply -f production.ingress -n ingress-demo
ingress.extensions/production created
```

We use the YAML as follows:

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

## Step 2: Access Application of Production

You can verify each resource by navigating to their list, we created in the steps above.

**Deployment**
![Deployment](https://pek3b.qingstor.com/kubesphere-docs/png/20200229122819.png)

**Service**
![Service](https://pek3b.qingstor.com/kubesphere-docs/png/20200229122918.png)

**Route (Ingress)**
![Ingress](https://pek3b.qingstor.com/kubesphere-docs/png/20200229122939.png)


2.2. Go to **Project Settings → Advanced Settings**, click **Set Gateway**, and click **Save** to open the gateway in this project, it defaults to **NodePort**.

![Set Gateway](https://pek3b.qingstor.com/kubesphere-docs/png/20200229123307.png)

2.3. Use the command to access the application of production, please note that it should be executed in SSH client.

> Note: `192.168.0.88` is the gateway address of each project, and `30205` is the NodePort, you need yo replace with the actual values.

```bash
$ curl --resolve kubesphere.io:30205:192.168.0.88 kubesphere.io:30205


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

## Step 3: create Application of Canary

Same as above, refer to the YAML files that we used in `Production` to create an application of `Canary` version, including `deployment` 和 `service`, you just need to replace the keyword `production` with `canary` in those YAML files.


## Step 4: Ingress-Nginx Annotation Rules

### Based on Weight

A typical scenario of the rule based on weight, that is, `blue-green deployment`, you can set the weight to `0` or `100` to implement it. At any time, only one of the environments is Production. For this example, green is currently Production and blue is Canary. Initially, the weight of Canary is set to `0`, no traffic will be requested to Canary. You can introduce a small portion of traffic to blue version, test and verify it, then you can shift all request from green to blue by set the weight of blue to `100`.

4.1. Use the following YAML to create a Ingress of Canary version based on weight.

> Note: The canary release feature will be started after `nginx.ingress.kubernetes.io/canary: "true"` is set, the following YAML use `canary-weight` annotation to split the traffic, will introduce `30%` of the whole traffic to the Ingress of Canary version.


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


4.2. Access the application domain name in SSH client.

> Note: About `30%` traffic will be introduced to Canary after we set annotation rule `canary-weight` to `30%`, the traffic ratio may fluctuate to a small extent.

```
$ for i in $(seq 1 10); do curl -s --resolve kubesphere.io:30205:192.168.0.88 kubesphere.io:30205 | grep "Hostname"; done
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200205162603.png)


### Based on Request Header

4.3. Follow the screenshot below, add a row of annotation with `nginx.ingress.kubernetes.io/canary-by-header: canary` (the value here can be customized) to the Ingress of Canary version. The header to use for notifying the Ingress to route the request to the service specified in the Canary Ingress.

> Note: Canary rules are evaluated in order of precedence. Precedence is as follows:
> `canary-by-header - > canary-by-cookie - > canary-weight`. Thus the the old annotation `canary-weight` will be ignored.

![annotation](https://pek3b.qingstor.com/kubesphere-docs/png/20190826174117.png)

4.4. Add different Header value in the request, and access the application domain name.

> Give two examples of what this means:
> - When the request header is set to always, it will be routed to the canary.
> - When the header is set to never, it will never be routed to the canary.
>
> Note: For any other value, the header will be ignored and the request compared against the other canary rules by precedence.


```
$ for i in $(seq 1 10); do curl -s -H "canary: never" --resolve kubesphere.io:30205:192.168.0.88 kubesphere.io:30205 | grep "Hostname"; done
```

![Request Header](https://pek3b.qingstor.com/kubesphere-docs/png/20200205231401.png)

We set the `canary: other-value` with value `30%` to take precedence over others.

```
$ for i in $(seq 1 10); do curl -s -H "canary: other-value" --resolve kubesphere.io:30205:192.168.0.88 kubesphere.io:30205 | grep "Hostname"; done
```

![Request Header](https://pek3b.qingstor.com/kubesphere-docs/png/20200205231455.png)


4.5. At this point, we can add a row of annotation (i.e. canary-by-header) `nginx.ingress.kubernetes.io/canary-by-header-value: user-value`, the header value to match for notifying the Ingress to route the request to the service specified in the Canary Ingress.

![annotation](https://pek3b.qingstor.com/kubesphere-docs/png/20190826184040.png)

4.6. Access the domain name as follows, when the request header is set to this value, it will be routed to the Canary version. For any other header value, the header will be ignored and the request compared against the other canary rules by precedence.

> Note: It allows users to customize the value of Request Header.

```
$ for i in $(seq 1 10); do curl -s -H "canary: user-value" --resolve kubesphere.io:30205:192.168.0.88 kubesphere.io:30205 | grep "Hostname"; done
```

![Request Header](https://pek3b.qingstor.com/kubesphere-docs/png/20200205231634.png)

### Based on Cookie

4.7. Similar to Request Header, the cookie to use for notifying the Ingress to route the request to the service specified in the Canary Ingress. When the cookie value is set to always, it will be routed to the Canary version, otherwise, it will never be routed to the Canary version. For any other value, the cookie will be ignored and the request compared against the other canary rules by precedence. For example, if we only allow the users from London to access the Canary version, we can set the annotation with `nginx.ingress.kubernetes.io/canary-by-cookie: "users_from_London"`. At this point, the system will check the user request, if the requests are from London, then set the value of cookie `users_from_London` to `always`. Ensure the users from London only access the Canary version.

## Conclusion

Grayscale release can ensure overall system stability. You can find problems and make adjustments at the initial gray scale to minimize the degree of impact. We have demonstrated four annotation rules of Ingress-Nginx, it is convenient for users who want to implement grayscale release without Istio.

## Reference

- [NGINX Ingress Controller - Annotations](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#canary)
- [canary deployment with ingress-nginx](https://www.elvinefendi.com/2018/11/25/canary-deployment-with-ingress-nginx.html)
- [Canary Deployments on Kubernetes without Service Mesh](https://medium.com/@domi.stoehr/canary-deployments-on-kubernetes-without-service-mesh-425b7e4cc862)
