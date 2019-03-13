---
title: "Web Kubectl"
---

### 如何使用 Web Kubectl

kubectl 是用于操作 Kubernetes 集群的命令行接口。

KubeSphere 在界面提供了 web kubectl 方便用户使用，默认情况下，目前仅集群管理员 (cluster-admin) 拥有 web kubectl 的使用权限，可以直接使用 kubectl 命令行操作和管理集群资源。

集群管理员登录后，点击右下角的 web kubectl 按钮，即可打开 web kubectl 窗口

![kubectl 位置](/web-kubectl-location.png)

在 web kubectl 可输入 kubectl 命令查询或管理 Kubernetes 集群资源。另外，web kubectl 窗口支持查看当前集群的 Kubeconfig 文件。

例如，执行以下命令查询集群中所有 PVC 的挂载情况：

```bash
kubectl get pvc --all-namespaces
```

![查询 PVC](/view-kubectl.png)


从 kubectl 终端窗口可使用以下语法运行 kubectl 命令：

```
kubectl [command] [TYPE] [NAME] [flags]
```

> 说明：
> 其中 command，TYPE，NAME，和 flags 分别是：
> - command: 指定要在一个或多个资源进行操作，例如 create，get，describe，delete。
> - TYPE：指定资源类型。资源类型区分大小写，您可以指定单数，复数或缩写形式。
> - NAME：指定资源的名称。名称区分大小写。如果省略名称，则会显示所有资源的详细信息，比如 `kubectl get pods`。
> - flags：指定可选标志。例如，您可以使用 -s 或 --serverflags 来指定 Kubernetes API 服务器的地址和端口。重要提示：从命令行指定的标志将覆盖默认值和任何相应的环境变量。
>
> 如果需要查询常用命令帮助，可在窗口运行 `kubectl help`，或参阅 [Kubernetes 官方文档](https://kubernetes.io/docs/reference/kubectl/overview/)。