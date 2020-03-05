---
title: "Preparing the Development Environment"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

When you are familiar with [Source-to-Image (S2I)](../../quick-start/source-to-image), you can customize the builder image template (i.e. S2I/B2I template) based on your project to extend the S2I. There are some commmon-used built-in image buider templates including [Python](https://github.com/kubesphere/s2i-python-container/), [Java](https://github.com/kubesphere/s2i-java-container/), etc. KubeSphere 2.1.1 allows you to custom B2I template.

Before introducing builder image, we will introduce the required section.

It includes following two parts in custom S2I template:

- Part 1: S2I custom builder image
- Part 2: the definition of S2Itemplate

The builder image is compatible with OpenShif, it can used in KubeSphere directly.

> Part 1:
> - assemble (required): The assemble script builds the application artifacts from a source and places them into appropriate directories inside the image.
> - run (required): The run script executes your application.
> - save-artifacts (optional): The save-artifacts script gathers all dependencies that can speed up the build processes that follow.
> - usage (optional): It allows you to inform the user how to properly use your image.
> - test: It allows you to create a simple process to check if the image is working correctly.
>
> Part 2:
> S2Itemplate: Descripe the basic environment of building the application.


For further information regarding S2I builder image, please see [S2IRun](https://github.com/kubesphere/s2irun/blob/master/docs/builder_image.md#s2i-builder-image-requirements).

In the following steps, we will demonstrate how to create a builder image including [Nginx](https://www.nginx.com/) service.

> S2I also supports an another image template, called _runtime image_ or _non-builder_ image, please refer to [https://github.com/kubesphere/s2irun/blob/master/docs/runtime_image.md](https://github.com/kubesphere/s2irun/blob/master/docs/runtime_image.md) for further information.

## Step 1: S2I CLI Builder Directory

[S2I CLI](https://github.com/openshift/source-to-image/releases) is very convenient to bootstrap a new base directory of the image builder repository.

Download the CLI and uppack it:

```bash
$ wget https://github.com/openshift/source-to-image/releases/download/v1.1.14/source-to-image-v1.1.14-874754de-linux-386.tar.gz

$ tar -xvf source-to-image-v1.1.14-874754de-linux-386.tar.gz
```

```bash
$ ls
s2i source-to-image-v1.1.14-874754de-linux-386.tar.gz  sti

$ cp s2i /usr/local/bin
```

In this guide we use `nginx-centos7` as the name of the builder image, creating the initial base directory. The directory tree lists as follows.

```bash
$ s2i create nginx-centos7 s2i-builder-docs
```

The `s2i create` is responsible for bootstrapping a new S2I enabled image repository. This command will generate a skeleton `.s2i` directory and populate it with sample S2I scripts you can start hacking on.

```
s2i-builder-docs/
   Dockerfile - Defines the base builder image
   Makefile - Script for the builder image of testing and build
   test/
      run - Script that runs the application
      test-app/ - Test application source code
   s2i/bin
      assemble - Script that builds the application
      run - Script that runs the application
      usage - Script that prints the usage of the builder
```


## Step 2: Modify the Dockerfile

A Dockerfile that installs all of the necessary tools and libraries that are needed to build and run our application. This file will also handle copying the s2i scripts into the created image. Modify the `Dockerfile` to define the builder image as follows:

### Dockerfile

```Dockerfile
# nginx-centos7
FROM kubespheredev/s2i-base-centos7:1

# Here you can specify the maintainer for the image that you're building
LABEL maintainer="Runze Xia <runzexia@yunify.com>"

# Define the current version of the application
ENV NGINX_VERSION=1.6.3

# Set the labels that are used for KubeSphere to describe the builder image.
LABEL io.k8s.description="Nginx Webserver" \
      io.k8s.display-name="Nginx 1.6.3" \
      io.kubesphere.expose-services="8080:http" \
      io.kubesphere.tags="builder,nginx,html"

# Install the nginx web server package and clean the yum cache
RUN yum install -y epel-release && \
    yum install -y --setopt=tsflags=nodocs nginx && \
    yum clean all

# Change the default port for nginx
RUN sed -i 's/80/8080/' /etc/nginx/nginx.conf
RUN sed -i 's/user nginx;//' /etc/nginx/nginx.conf

# Copy the S2I scripts to /usr/libexec/s2i since we set the label that way
COPY ./s2i/bin/ /usr/libexec/s2i

RUN chown -R 1001:1001 /usr/share/nginx
RUN chown -R 1001:1001 /var/log/nginx
RUN chown -R 1001:1001 /var/lib/nginx
RUN touch /run/nginx.pid
RUN chown -R 1001:1001 /run/nginx.pid
RUN chown -R 1001:1001 /etc/nginx

USER 1001

# Set the default port for applications built using this image
EXPOSE 8080

# Modify the usage script in your application dir to inform the user how to run this image.
CMD ["/usr/libexec/s2i/usage"]
```

**S2I script use the parameter from the label which defined in the Dockerfile. If you use the base image that is not provided by KubeSphere S2I, please refer to [S2I Script](https://github.com/kubesphere/s2irun/blob/master/docs/builder_image.md#s2i-scripts).**

## Step 3: S2I Builder Script

Create an assemble script that will build our application, the script can also specify a way to restore any saved artifacts from the previous image. It just copy the configuration file and static contents to the target container.

### assemble

```bash
#!/bin/bash -e

if [[ "$1" == "-h" ]]; then
	exec /usr/libexec/s2i/usage
fi

echo "---> Building and installing application from source..."
if [ -f /tmp/src/nginx.conf ]; then
  mv /tmp/src/nginx.conf /etc/nginx/nginx.conf
fi

if [ "$(ls -A /tmp/src)" ]; then
  mv /tmp/src/* /usr/share/nginx/html/
fi
```

`s2i build` placed the source code in `/tmp/src`. We just copy the application source code to `kubespheredev/s2i-base-centos7:1`, this is the working directory of `kubespheredev/s2i-base-centos7:1`.


### run

Create a run script that will start the application.


```bash
#!/bin/bash -e

exec /usr/sbin/nginx -g "daemon off;"
```

We use `exec` command to replace execute the `run` script with executing the process of `nginx` web server. It allows all signal can be received by `nginx` that sent from `docker`.

A save-artifacts script which allows a new build to reuse content from a previous version of the application image. we can delete the `save-artifacts` script since we don't use it in this demo.

**usage**

Create a usage script that will print out instructions on how to use the image.

```bash
#!/bin/bash -e
cat <<EOF
This is the nginx-centos7 S2I image:
To use it, install S2I: https://github.com/kubesphere/s2i-operator
Sample invocation:
s2i build test/test-app kubespheredev/nginx-centos7 nginx-centos7-app
You can then run the resulting image via:
docker run -d -p 8080:8080 nginx-centos7-app
and see the test via http://localhost:8080
EOF
```

## Step 4: Build and Run

### Makefile

Modify the image name in makefile:

```makefile
IMAGE_NAME = kubespheredev/nginx-centos7-s2ibuilder-sample

# Create a builder image named above based on the Dockerfile that was created previously.
.PHONY: build
build:
	docker build -t $(IMAGE_NAME) .

# The builder image can be tested using the following commands:
.PHONY: test
test:
	docker build -t $(IMAGE_NAME)-candidate .
	IMAGE_NAME=$(IMAGE_NAME)-candidate test/run

```

Execute `make build` to create the builder image for nginx:

```bash
$ make build
docker build -t kubespheredev/nginx-centos7-s2ibuilder-sample .
Sending build context to Docker daemon  164.9kB
Step 1/17 : FROM kubespheredev/s2i-base-centos7:1
 ---> 48f8574c05df
Step 2/17 : LABEL maintainer="Runze Xia <runzexia@yunify.com>"
 ---> Using cache
 ---> d60ebf231518
Step 3/17 : ENV NGINX_VERSION=1.6.3
 ---> Using cache
 ---> 5bd34674d1eb
Step 4/17 : LABEL io.k8s.description="Nginx Webserver"       io.k8s.display-name="Nginx 1.6.3"       io.kubesphere.expose-services="8080:http"       io.kubesphere.tags="builder,nginx,html"
 ---> Using cache
 ---> c837ad649086
Step 5/17 : RUN yum install -y epel-release &&     yum install -y --setopt=tsflags=nodocs nginx &&     yum clean all
 ---> Running in d2c8fe644415

…………
…………
…………

Step 17/17 : CMD ["/usr/libexec/s2i/usage"]
 ---> Running in c24819f6be27
Removing intermediate container c24819f6be27
 ---> c147c86f2cb8
Successfully built c147c86f2cb8
Successfully tagged kubespheredev/nginx-centos7-s2ibuilder-sample:latest
```

As shown above, the builder image has been successfully generated. Now we can run the following command to create the application image:

```bash
$ s2i build ./test/test-app kubespheredev/nginx-centos7-s2ibuilder-sample:latest sample-app
---> Building and installing application from source...
Build completed successfully
```

Using the logic defined in the assemble script, S2I creates an application image using the builder image as a base and including the source code from the `test/test-app` directory.


## Step 5: Running Application Image

Running the application image is as simple as invoking the docker run command:

```bash
$ docker run -p 8080:8080  sample-app
```

The Nginx application should now be accessible at `http://localhost:8080`.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20190830115544.png)


## Step 6: Push Image

Push the image `nginx-centos7-s2ibuilder-sample` to your repository.

## Step 7: Create S2I Template

S2I template defines the base environment for building an application, including _builder image_ and _runtime image_, as well as the environmental parameters and destination.

We need to create a `yaml` file as S2I builder template as follows.

**s2ibuildertemplate.yaml**

```yaml
apiVersion: devops.kubesphere.io/v1alpha1
kind: S2iBuilderTemplate
metadata:
  labels:
    controller-tools.k8s.io: "1.0"
    builder-type.kubesphere.io/s2i: "s2i"
  name: nginx-demo
spec:
  containerInfo:
    - builderImage: kubespheredev/nginx-centos7-s2ibuilder-sample
  codeFramework: nginx
  defaultBaseImage: kubespheredev/nginx-centos7-s2ibuilder-sample
  version: 0.0.1
  description: "This is a S2I builder template for Nginx builds whose result can be run directly without any further application server.."
```

## Step 9: Use S2I Template in KubeSphere

We can use `kubectl` to submit the S2I template that we created to KubeSphere.

```bash
$ kubectl apply -f s2ibuildertemplate.yaml
s2ibuildertemplate.devops.kubesphere.io/nginx created
```

When you are done, you can enter the project and create a S2I build, at this point, you can fine a S2I template of Nginx in KubeSphere.

More generally, it is possible to configure any kind of S2I template using S2I CLI, then use the template for quickly build a base environment for building application in batch. There are some more advanced examples of this can be found at `https://github.com/sclorg/mongodb-container` and `https://github.com/sclorg/mariadb-container/`.
