---
title: "Source to Image: Publish your app without Dockerfile"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## What is Source to Image

As [Features and Benefits](../../introduction/features) elaborates, Source-to-Image (S2I) is a toolkit and workflow for building reproducible container images from source code. S2I produces ready-to-run images by injecting source code into a container image and letting the container prepare that source code for execution. KubeSphere integrates S2i to enable automatically build images and publish to Kubernetes without writing Dockerfile.


## Objective

This tutorial will use S2I to import source code repository of Java sample project into KubeSphere, build a docker image and push to the target registry, finally publish to Kubernetes and expose externally.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200207162613.png)


## Prerequisites

- You need to enable [KubeSphere DevOps system](../../installation/install-devops).
- You need to create [GitHub](https://github.com/) and [DockerHub](http://www.dockerhub.com/) accounts. GitLab and Harbor are also supported, but we will use GitHub and DockerHub in this tutorial.
- You need to create workspace, projects and `project-regular` accounts (with role of "operator"), see [Quick Start Guide of Multi-tenant Management](/../../quick-start/admin-quick-start/).


## Estimated Time

20-30 minutes

## Hands-on Lab

### Create Secrets

Create the Secrets for DockerHub and GitHub, please reference [Creating Common-used Secrets](../../configuration/secrets#Create common-used Secrets).

### Fork Project

At first, Log in GitHub and fork the GitHub repository [devops-java-sample](https://github.com/kubesphere/devops-java-sample) to your personal GitHub account.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210174640.png)

### Create Service

#### Step 1: Fill in basic information

1.1 Navigate to **Application Workloads → Services**, click **Create Service**.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210180908.png)

1.2 Choose `Java` under **Build a new service from source code repository**, then name it `s2i-demo`;


### Step 2: Build Settings

2.1. Click **Next**, then open GitHub page and copy the URL of the forked repository.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210215006.png)

2.2. Then paste it in Code URL, enter **<dockerhub_username>/<image_name>** into image name, e.g. **pengfeizhou/s2i-sample**. As for **secret** and **Target image repository**, you can choose `dockerhub-id` and `github-id` respectively. Remain other blanks as default values in this tutorial.

> Note: KubeSphere has built in common s2i templates for Java, Node.js and Python. If you need to customize other languages or use the S2I template, you can customize it.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210220057.png)

2.3. Click **Next**, for **Service Settings**, the name can be customized, **Container Port** and **Service Port** are both `8080`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190718095825.png#alt=)

2.4. Scroll down to **Health Checker**, click its checkbox and choose `Add Container ready check`, fill in the blanks as follows:

- Port: enter `8080`; It maps to the service port that we need to check
- Initial Delay(s): enter `30`; Number of seconds after the container has started before liveness or readiness probes are initiated
- Timeout(s): `10`; Number of seconds after which the probe times out. Defaults to 1 second

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210223047.png)

Then click **√** to save it when you've done.

### Step 3: Create s2i Deployment

No need to mount volumes, click **Next** to skip it. Click **Internet Access** checkbox then choose **NodePort** to expose S2I service through `<NodeIP>:<NodePort>`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210223251.png)

At this point, you can click **Create** to publish S2I service to Kubernetes.


### Step 4: Verify Build Progress

Choose **Image Builder**, then click on the new generated S2I build.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210224618.png)

You'll be able to inspect the logs by expanding the job record. Normally you can see it outputs "Build completed successfully" in the end.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210225006.png)

Currently S2I build has created corresponding Job, Deployment and Service accordingly, we can verify each resource object as follows.

**Job**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210230158.png)

**Deployment**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210230217.png)

**Service**

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210230239.png)

### Step 5: Access S2I Service

Go into S2I service detailed page, access this service through `Endpoints` / `<ClusterIP>:<Service Port>` / `<NodeIP>:<NodePort>`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210230444.png)

```bash
$ curl 10.233.90.126:8080
Really appreaciate your star, that is the power of our life.
```


> Tip: If you need to access to this service externally, make sure the traffic can pass through the NodePort, you may configure firewall and port forward according to actual scenario.


### Verify Image Registry

Since we set DockerHub as the target registry, you can log in to your personal DockerHub to check if the sample image has been pushed by S2I job.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20200210231552.png)

Congratulation! You've been familiar with S2I tool, hope it can help you to streamline daily workflow and improve effiency.
