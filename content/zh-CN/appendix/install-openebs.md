---
title: "安装 OpenEBS 创建 LocalPV 存储类型"
keywords: 'kubernetes, docker, helm, openebs, localpv'
description: '在 Kubernetes 安装 OpenEBS 创建 LocalPV 存储类型'
---

由于 [在已有 Kubernetes 集群之上安装 KubeSphere](../../installation/install-on-k8s) 需要依赖集群已有的存储类型（StorageClass），若集群还没有准备存储类型（StorageClass），可参考本文档，在 K8s 集群中安装 OpenEBS 并创建 LocalPV 的存储类型，从而可以在集群快速安装测试 KubeSphere。

<font color="red">注意：基于 OpenEBS 创建 LocalPV 的存储类型仅适用于开发测试环境，不建议在生产环境使用。生产环境建议准备 KubeSphere 推荐的持久化存储（如 GlusterFS、Ceph、NFS 或 Neonsan 等分布式存储），然后再创建对应的 StorageClass。</font>

## 前提条件

- 已有 Kubernetes 集群，并安装了 kubectl 或 Helm
- Pod 可以被调度到集群的 master 节点（可临时取消 master 节点的 Taint）


关于第二个前提条件，是由于安装 OpenEBS 时它有一个初始化的 Pod 需要在 master 节点启动并创建 PV 给 KubeSphere 的有状态应用挂载。因此，若您的 master 节点存在 Taint，建议在安装 OpenEBS 之前手动取消 Taint，待 OpenEBS 安装完成后再对 master 打上 Taint，以下步骤供参考：

1. 例如本示例有一个 master 节点，节点名称即 `master`，可通过以下命令查看节点名称：

```
$ kubectl get node -o wide
NAME     STATUS   ROLES    AGE     VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION          CONTAINER-RUNTIME
master   Ready    master   6d18h   v1.15.5   192.168.0.6    <none>        CentOS Linux 7 (Core)   3.10.0-693.el7.x86_64   docker://18.9.7
node1    Ready    worker   6d18h   v1.15.5   192.168.0.7    <none>        CentOS Linux 7 (Core)   3.10.0-693.el7.x86_64   docker://18.9.7
node2    Ready    worker   6d18h   v1.15.5   192.168.0.10   <none>        CentOS Linux 7 (Core)   3.10.0-693.el7.x86_64   docker://18.9.7
```

2. 确认 master 节点是否有 Taint，如下看到 master 节点有 Taint。

```
$ kubectl describe node master | grep Taint
Taints:             node-role.kubernetes.io/master:NoSchedule
```

3. 去掉 master 节点的 Taint：

```
$ kubectl taint nodes master node-role.kubernetes.io/master:NoSchedule-
```

此时可参考安装 OpenEBS 的步骤继续操作。

## 安装 OpenEBS

1. 创建 OpenEBS 的 namespace，OpenEBS 相关资源将创建在这个 namespace 下：

```
$ kubectl create ns openebs
```

2. 安装 OpenEBS，以下列出两种方法，可参考其中任意一种进行创建：

A. 若集群已安装了 Helm，可通过 Helm 命令来安装 OpenEBS：

```
helm init

helm install --namespace openebs --name openebs stable/openebs --version 1.5.0
```

B. **除此之外** 还可以通过 kubectl 命令安装：

```
$ kubectl apply -f https://openebs.github.io/charts/openebs-operator-1.5.0.yaml
```

3. 安装 OpenEBS 后将自动创建 4 个 StorageClass，查看创建的 StorageClass：

```
$ kubectl get sc
NAME                        PROVISIONER                                                AGE
openebs-device              openebs.io/local                                           10h
openebs-hostpath            openebs.io/local                                           10h
openebs-jiva-default        openebs.io/provisioner-iscsi                               10h
openebs-snapshot-promoter   volumesnapshot.external-storage.k8s.io/snapshot-promoter   10h
```

4. 如下将 `openebs-hostpath` 设置为 **默认的 StorageClass**：

```
$ kubectl patch storageclass openebs-hostpath -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
storageclass.storage.k8s.io/openebs-hostpath patched
```

5. 至此，OpenEBS 的 LocalPV 已作为默认的存储类型创建成功。由于在文档开头手动去掉了 master 节点的 Taint，我们可以在安装完 OpenEBS 后将 master 节点 Taint 加上，避免业务相关的工作负载调度到 master 节点抢占 master 资源：


```
$ kubectl taint nodes master node-role.kubernetes.io/master=:NoSchedule
```

## 创建工作负载测试 StorageClass

1. 如下创建一个 demo-openebs-hostpath.yaml，其中定义的 Deployment 与 PVC 用作测试，检验 openebs-hostpath 的 StorageClass 是否创建成功：

```
---
apiVersion: apps/v1beta1
kind: Deployment
metadata:
  name: percona
  labels:
    name: percona
spec:
  replicas: 1
  selector:
    matchLabels:
      name: percona
  template:
    metadata:
      labels:
        name: percona
    spec:
      securityContext:
        fsGroup: 999
      tolerations:
      - key: "ak"
        value: "av"
        operator: "Equal"
        effect: "NoSchedule"
      containers:
        - resources:
            limits:
              cpu: 0.5
          name: percona
          image: percona
          args:
            - "--ignore-db-dir"
            - "lost+found"
          env:
            - name: MYSQL_ROOT_PASSWORD
              value: k8sDem0
          ports:
            - containerPort: 3306
              name: percona
          volumeMounts:
            - mountPath: /var/lib/mysql
              name: demo-vol1
      volumes:
        - name: demo-vol1
          persistentVolumeClaim:
            claimName: demo-vol1-claim
---
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: demo-vol1-claim
spec:
  storageClassName: openebs-hostpath
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5G
---
apiVersion: v1
kind: Service
metadata:
  name: percona-mysql
  labels:
    name: percona-mysql
spec:
  ports:
    - port: 3306
      targetPort: 3306
  selector:
      name: percona
```

2. 使用 kubectl 命令创建相关资源：

```
$ kubectl apply -f demo-openebs-hostpath.yaml -n openebs
```

3. 如果 PVC 的状态为 `Bound` 并且 Pod 状态为 `running`，则说明已经成功挂载，证明了默认的 StorageClass（openebs-hostpath）是正常工作的。接下来可以回到 [在已有 Kubernetes 集群之上安装 KubeSphere](../../installation/install-on-k8s) 继续安装 KubeSphere。

```
$ kubectl get pvc -n openebs
NAME              STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS       AGE
demo-vol1-claim   Bound    pvc-a50fbb85-760b-488e-aad4-8aef1ff6b57a   5G         RWO            openebs-hostpath   68m
```
