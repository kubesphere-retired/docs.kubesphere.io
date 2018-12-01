---
title: "设置健康检查器"
---

## 简介

在实际的生产环境中，如果要使开发者提供的应用程序没有任何 Bug，并且一直保持运行正常，这几乎是不可能的任务。那么，一套管理系统对运行的应用程序进行周期性的健康检查和修复就是不可或缺的了，而在底层的 Kubernetes 中，系统和应用程序的健康检查任务是由 kubelet 来完成的。在某些特殊的场景下，例如一个典型的程序发生 “死锁” 的例子，虽然 Docker 会认为其容器进程一直在运行，但从应用程序角度而言该状态下的容器将不会正常响应用户的业务请求。因此，在业务级的监控检查方面，Kubernetes 已经定义了两种类型的健康检查探针。

在 KubeSphere 中，用户可以为容器设置健康检查探针 (Probe) 来检查容器的健康状态。因为 kubelet 会根据用户定义的这个健康检查探针的返回值，来决定容器的状态，而不是直接以容器是否运行 (来自 Docker 返回的信息) 作为判断依据。这种健康检查的机制，在实际的生产环境中是保证应用程序正常运的重要手段。至于什么状态才算正常，则由用户自己定义。

KubeSphere 支持添加以下两种健康检查探针：

- **存活探针 (liveness Probe)**

存储探针用于检测容器是否存活，类似于我们在 Linux 中执行 ps 命令来检查系统中的进程是否存在。kubelet 根据用户定义的 periodSeconds (默认为 10 秒) 周期性地对容器的健康状态进行检查，如果检查失败，集群会根据容器组的重启机制 (RestartPolicy，默认为 Always) 对容器执行重启操作，若检查成功则不执行任何操作。

- **就绪探针 (Readiness Probe)**

另一种健康检查方案叫就绪探针，虽然它的用方法与存活探针相似，但作用却大不相同，就绪探针用于检测结果的成功与否，检测容器是否准备好开始处理用户请求。如果检查结果是 fail 的，kubelet 不会杀死容器进程而是将其所属的容器组 (Pod) 从 endpoint 列表删除，然后访问该容器组的请求会被路由到其他容器组。只有当 Pod 中的容器都处于就绪状态时 kubelet 才会认定其处于就绪状态，它决定 Pod 是否能被通过服务 (Service) 的方式访问到。

存活探针和就绪探针可以并行用于同一容器，使用这两类探针能够确保流量将不会到达未准备好的容器，且容器能在失败时重新启动。

![](/health-check-details.png)


## 健康检查方式

在容器中支持以下三种健康检查方式，Pod 可以暴露一个健康检查 URL (比如 /health)，或者直接让健康检查探针去检测应用的监听端口，这两种方式在 Web 服务类的应用非常广泛，除此之外还可以在容器中定期执行命令来检查。

### HTTP GET (HTTP 请求检查)

HTTP 请求检查主要针对提供 HTTP/HTTPS 服务的容器，集群将周期性对这类容器发起 HTTP/HTTPS GET 请求，查看 HTTP/HTTPS response 返回码，如果其属于 `200~399` 范围，则说明检查结果成功，否则检查失败。若使用 HTTP 请求检查，需指定容器监听的端口和 HTTP/HTTPS 的请求路径 (path)。

> - 端口：访问容器的端口号，介于 `1 ~ 65535` 之间
> - 路径：访问的 HTTP server 的 路径 (path)


![HTTP 请求](/probe-http.png)

### TCP Socket (TCP 端口检查)

TCP 端口检查主要针对 TCP 通信服务的容器，系统将周期性地与该容器建立 TCP 连接，如果连接成功直接说明健康检查成功，否则检查失败。如果选择该方式，需指定容器监听的端口。

比如，在 [快速入门](../../quick-start/mysql-deployment) 中创建了一个 MySQL 容器，服务端口为 3306，如果对该容器配置了 TCP 端口探测，指定探测端口 3306，系统将周期性地对该容器的 3306 端口发起 TCP 连接，若连接成功则说明检查成功，否则失败。

![TCP 检查](/probe-TCP-check.png)

### Container Command (容器命令检查)

容器命令检查是一种强大的检查方式，需要指定一个在 **容器内** 的可执行命令，系统将周期性地在容器内执行该命令，如果命令返回结果为 0 则说明检查成功，否则检查失败。

对于上面提到的 TCP 端口检查和 HTTP 请求检查，都可以通过执行命令检查的方式来替代。比如 TCP 端口探测，可以写一个程序对容器的端口进行连接访问，如果连接成功，脚本返回 0，否则连接失败。对于 HTTP 请求检查，同样写一个脚本对容器进行 wget 操作，比如 wget `http://127.0.0.1:80/path`

![命令检查](/probe-command-check.png)


> 说明：以下配置属于上述三种方式的公共参数
>
> - 初始延迟 (initialDelaySeconds)：容器启动后第一次执行探测是需要等待多少秒
> - 超时时间 (timeoutSeconds)：探测超时时间，单位为秒
> 以下几个配置支持通过在页面编辑 yaml 模板文件进行配置：
>
> - 检查频率 (periodSeconds)：执行探测的频率，默认是 10 秒。
> - successThreshold：检查失败后，最少连续检查成功多少次才被认定为成功，默认为 1，而对于存活探针其必须是 1
> - failureThreshold：检查成功后，最少连续检查失败多少次才被认定为失败，默认为 3


## 设置健康检查器

健康检查器支持在 **工作负载** 的部署、有状态副本集和守护进程集中设置检查探针，以创建一个 `busybox` 容器的部署 (deployment) 为例，演示如何设置一个存活探针 (就绪探针配置类似)，请确保已创建了该部署资源，若还未创建请参考 [创建部署](../../workload/deployments)。

### 第一步：设置容器参数

另外，创建部署时在 busybox 容器内需设置以下三个参数，它在容器启动后在 `/tmp` 目录下创建了一个 healthy 文件，以此作为容器已正常运行的标志，而 30 s 后该文件将被删除。在创建部署的 **容器组模板** 中，或在 **部署详情页 → 更多操作** 选择 **编辑配置模板** 都可以设置容器组的参数。

![编辑参数](/edit-arguments.png)
![参数设置详情](/pod-arguments.png)

```bash
/bin/sh
-c
touch /tmp/healthy; sleep 30; rm -rf /tmp/healthy; sleep 600
```
### 第二步：设置存活探针

同时，配置一个存活探针并定义容器内执行的命令 `cat /tmp/healthy`，如果该文件存在，命令执行后的返回值就是 0，认为该容器是健康的，检查将在容器启动 5 秒后执行，默认每 10 秒执行一次，超时时间设置为 5 秒。

现在，开始具体实践一下这个过程：

在项目下，进入 **工作负载 → 部署** 选择 busybox 容器的部署，进入部署详情页。点击 **更多操作 → 编辑配置模板**。

![busybox 详情页](/busybox-page.png)

选择 **监控检查器**，以设置容器命令 **Container Command** 为检查方式，参考如下设置填写：

![设置容器命令](/container-command-setting.png)

### 第三步：验证健康检查

创建完成后，将生成一个新的版本 `#2`，可以在 **版本控制中查看**。通过页面的 Kubectl 工具可以查看这个 Pod 的状态是 Running，而 30 秒之后 Pod 在 Events 中报告了一个异常：

```bash
$ kubectl describe pod busybox-86c54ccdfc-jgz9x -n project-st75wr
Type     Reason                 Age               From                 Message
----     ------                 ----              ----                 -------
Warning  Unhealthy   27s (x6 over 2m)  kubelet, i-wo83nj02  Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
```
是因为 30 秒后 `/tmp/healthy` 目录被命令删了，存活探针检测到目录不存在了，所以报告容器是不健康的，

不妨进一步查看该 Pod 的状态，发现其状态没有 Failed，反而还是 Running，原因是什么呢？

```bash
$ kubectl get pod busybox-86c54ccdfc-jgz9x -n project-st75wr
NAME                       READY     STATUS   RESTARTS   AGE
busybox-86c54ccdfc-jgz9x   0/1       Running   1         3h
```

可以发现 RESTARTS 从 0 变成了 1，这就很好解释了，因为存活探针检查容器状态异常后，容器已被系统重启了，这就是 Pod 的重启机制 (RestartPolicy)，默认值就是 Always，说明任何时候容器发生异常就一定会被自动重启。

重启机制除了 Always 还有 OnFailure 和 Never 两种情况：

- Always：任何情况下，只要容器出现异常系统将自动重启容器
- OnFailure：只在容器异常时，才会自动重启
- Never：无论某种情况都不重启容器

至此，您已经初步地熟悉了如何对容器设置健康检查器，若希望了解更高级的配置方法，可参考 [Kubernetes 官方文档](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)。


