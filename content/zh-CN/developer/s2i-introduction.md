---
title: "S2I 原理及流程介绍"
keywords: 'kubesphere, kubernetes, source-to-image, ci/cd, s2i'
description: 'Source-to-Image 原理与流程'
---

**Source-to-image (S2I)** 是一个直接将源代码构建成镜像的自动化构建工具，它是通过将源代码放入一个负责编译源代码的 构建器镜像(Builder image) 中，自动将编译后的代码打包成 Docker 镜像。在 KubeSphere 中的使用示例可以参考[示例七-Source to Image](../../quick-start/source-to-image)。更加详细的信息可以参考代码仓库 [S2IOperator](https://github.com/kubesphere/s2ioperator#source-to-image-operator) 和 [S2IRun](https://github.com/kubesphere/s2irun#s2irun)。

## S2I 基本工作流程及原理

对于类似 Python、Ruby 之类的解释型语言，程序的构建环境和运行环境是往往相同的。因此构建器镜像 (Builder Image) 中包含了各种工具、依赖包等程序运行所需要的环境。比如一个 Ruby 的构建器镜像 (Builder Image) ，往往包含了 Bundler、Rake、Apache、GCC等其他运行时需要的包。内部执行原理如下图所示：

![](https://pek3b.qingstor.com/kubesphere-docs/png/s2i-builder.svg)

1. 根据构建器镜像 (Builder Image) 运行容器，程序源代码注入到容器中指定的目录。
2. 执行构建器镜像 (Builder Image) 中的 `assemble` 脚本，会将源代码构建成可直接运行的程序。比如拉取各种依赖，配置程序到工作目录下等工作
3. 设置运行构建器镜像 (Builder Image) 中提供的 `run` 脚本作为容器的启动命令，然后提交新的镜像，此镜像就是用户所需要的应用程序镜像。

流程图如下：

![](https://pek3b.qingstor.com/kubesphere-docs/png/s2i-flow.svg)

对于类似 Go、C、C++ 或者 Java 等编译型项目，编译时需要的各种依赖包会增加最终的应用程序镜像的体积，为了保证最终镜像的轻量化，我们使用分阶段构建的方式，在最终的应用程序镜像中省略不必要的文件。在构建器镜像 (Builder Image) 中完成构建后，导出构建完成的制品，可能是 Jar 包或者二进制文件等可直接运行的文件。然后将其注入到运行时镜像 (Runtime Image) 中，在运行时镜像 (Runtime Image) 运行程序。

构建原理如下图：

![](https://pek3b.qingstor.com/kubesphere-docs/png/s2i-runtime-build.svg)
