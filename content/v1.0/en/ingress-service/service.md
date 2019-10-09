---
title: "Service"
keywords: ''
description: ''
---

A Service is an abstraction which defines a logical set of Pods and a policy by which to access them - sometimes called a micro-service. As an example, consider an image-processing backend which is running with 3 replicas. Those replicas are fungible - frontends do not care which backend they use. While the actual Pods that compose the backend set may change, the frontend clients should not need to be aware of that or keep track of the list of backends themselves. 

## Create a Service

Sign in with project-regular, enter into one project (e.g. demo-namespace), then select **Network & Services → Services**.

![Create a Service](https://pek3b.qingstor.com/kubesphere-docs/png/20190312112433.png)

### Step 1: Fill in the Basic Information

1.1. Click **Create Service** button, then fill in the basic information in the pop-up window. There are two ways to create a Service, i.e. **fill in the creation table** and **edit mode**. The following mainly introduces each step within creation table. If you prefer edit mode, you can click on the **edit mode** button, it supports the yaml and json formats. Edit mode makes it easy for users who are used to command operations.

![Edit mode](https://pek3b.qingstor.com/kubesphere-docs/png/20190315170605.png)

1.2. On the basic information page, enter the name of the Service, you can also fill in the description as required.


- Name: A concise and clear name for this Service, which is convenient for users to browse and search.
- Alias: Helps you better distinguish resources and supports Chinese.
- Description: A brief introduction to Service.

Click **Next** when you're done.  

![Basic information](https://pek3b.qingstor.com/kubesphere-docs/png/20190315174556.png)

### Step 2: Service Settings

2.1. Select the type of service you need to create, each service type is suitable for different scenarios:


- Virtual IP: Exposes the service on a cluster-internal IP. Choosing this value makes the service only reachable from within the cluster. 
- Headless (Selector): For headless services that define selectors, the endpoints controller creates Endpoints records in the API, and modifies the DNS configuration to return A records (addresses) that point directly to the Pods backing the Service.
- Headless (ExternalName): Services of type ExternalName map a service to a DNS name, not to a typical selector. It maps the service to the contents of the externalName field (e.g. foo.bar.example.com), by returning a CNAME record with its value. 

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190315180352.png)

2.2. If you choose Virtual IP or Headless (Selector), then you will need to fill in the following table:


- Selector: Choose the backend workload via label selector (key-values) or specify directly, 
- Ports: using TCP by default, the first port is service port, and the target port is the workload port.
- Session Affinity
   - None: The default value, If you create “headless” services by specifying "None" for the cluster IP, it allows developers to reduce coupling to the Kubernetes system by allowing them freedom to do discovery their own way. 
   - ClientIP: Access requests from the same IP address will always be forwarded to the same backend Pod.   


2.3. If you choose Headless (externalname), which means it will map a service to a DNS name, not to a typical selector.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190318152157.png)

### Step 3: Label Settings

The labels are one or more key-value pairs that are associated with a resource, such as a Pod. We usually identify, organize, or find resource objects through labels, e.g. label selector.

![Label Settings](https://pek3b.qingstor.com/kubesphere-docs/png/20190318175619.png)

### Step 4: Internet Access

If you choose Virtual IP as the service type, then you need to choose one of the access 

 - None: Exposes the service on a cluster-internal IP. Choosing this value makes the service only reachable from within the cluster.
 - NodePort: Exposes the service on each Node’s IP at a static port (the NodePort). A ClusterIP service, to which the NodePort service will route, is automatically created. You’ll be able to contact the NodePort service, from outside the cluster, by requesting `<NodeIP>:<NodePort>`.
 - LoadBalancer: Exposes the service externally using a cloud provider’s load balancer. NodePort and ClusterIP services, to which the external load balancer will route, are automatically created.

> Note: It requires to install the cloud provider plugin if using the Load Balancer that is connected to the cloud provider. The [QingCloud Controller Manager Plugin](https://github.com/yunify/qingcloud-cloud-controller-manager) is still in the development stage and will be coming soon. You will be able to use Load Balancer to expose the service to external network after it gets ready.

![Internet Access](https://pek3b.qingstor.com/kubesphere-docs/png/20190319091805.png)

Once created successfully, you can view the details of the service in the list.


