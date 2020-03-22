---
title: "Introduction to S2I"
keywords: 'kubesphere, kubernetes, source-to-image, ci/cd, s2i'
description: 'Principle and Workflow of Source-to-Image'
---

**Source to image (S2I)** is a command toolkit and workflow for building reproducible container images from source code. It places the source code into a Builder Image which is used to compile, then automatically encapsulate the source code and produce ready-to-run image by injecting source code into a container image.

You can refer to [Source-to-Image](../../quick-start/source-to-image) for the use case. You can also reference the source code from [S2IOperator](https://github.com/kubesphere/s2ioperator#source-to-image-operator) and [S2IRun](https://github.com/kubesphere/s2irun#s2irun) for more information.

## S2I Workflow

### Builder Image

For dynamic languages like Python or Ruby, the build-time and run-time environments are the same. There are many built-in tools and dependencies needed for application runtime which are included in the builder image. For example, the Build Image of Ruby, it includes the packages like Bundler、Rake、Apache、GCC, etc. The following diagram illustrates the build workflow:

![Builder Image](https://pek3b.qingstor.com/kubesphere-docs/png/s2i-builder.svg)

### How Source-to-Image works

1. Start a container from the builder image with the application source injected into a specified directory.
2. Execute the `assemble` script of the builder image, it transforms that source code into the appropriate runnable program, such as installing dependencies with Bundler and moving the source code into a working directory.
3. Set the image entrypoint to be a `run` script (provided by the builder image) that starts the container, and commit the new image, e.g. the final application image needed for the KubeSphere users.

![How Source-to-Image works](https://pek3b.qingstor.com/kubesphere-docs/png/s2i-flow.svg)

### Runtime Image

For compiled languages like Go, C, C++ or Java, the dependencies necessary for compilation may dramatically outweigh the size of the actual runtime artifacts. To keep runtime images slim, S2I enables a multiple-step build processes, where a binary artifact such as an executable or Java WAR file is created in the first **builder image**. Then S2I  will extract and inject into a second image, i.e. **runtime image**, thus the application will run inside of this runtime image. The following diagram illustrates the build principle:

![Runtime Image](https://pek3b.qingstor.com/kubesphere-docs/png/s2i-runtime-build.svg)
