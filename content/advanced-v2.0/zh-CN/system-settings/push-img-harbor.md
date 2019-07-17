---
title: "上传镜像至 Harbor" 
keywords: ''
description: ''
---

## 前提条件

请确保正确安装了 [内置 Harbor](../../installation/harbor-installation/)，并准备好了基础镜像 `java:openjdk-8-jre-alpine`。

## 如何上传基础镜像到 Harbor

1、执行以下命令，导入预先准备好的基础镜像 `java:openjdk-8-jre-alpine`。

```bash
$ docker load < XXX.tar
```

![load](https://kubesphere-docs.pek3b.qingstor.com/png/load.png)

2、对镜像打 tag，在终端执行命令 `docker tag fdc893b19a14 harbor.devops.kubesphere.local:30280/library/java:openjdk-8-jre-alpine`，注意：其中 `fdc893b19a14` 为 image ID，请根据实际情况进行修改，镜像名称格式为<仓库地址>/<项目名称>/<镜像名称>:<标签>。

3、本地加入 insecure

若改主机为 KubeSphere 集群的节点，则无需配置，请跳过此步骤。若为集群外部主机，请修改 Docker 配置文件 `daemon.json`，在Linux上的默认路径为 `/etc/docker/daemon.json`，Windows 上的默认路径为`%programdata%\docker\config\daemon.json`，在该文件中加入配置

``` json
  "insecure-registries" : [
		"harbor.devops.kubesphere.local:30280"
  ]
```

具体文件参数详情可参考 [Docker Daemon 配置文件](<https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-configuration-file>)。

然后重启 Docker。

4、登陆 Harbor，执行命令 `docker login -u admin -p Harbor12345 http://harbor.devops.kubesphere.local:30280`。

```dockerfile
$ docker login -u admin -p Harbor12345 http://harbor.devops.kubesphere.local:30280

WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

5、推送镜像，执行命令 `docker push harbor.devops.kubesphere.local:30280/library/java:openjdk-8-jre-alpine`

```bash
$ docker push harbor.devops.kubesphere.local:30280/library/java:openjdk-8-jre-alpine
The push refers to repository [harbor.devops.kubesphere.local:30280/library/java-openjdk-8]
20dd87a4c2ab: Pushed
78075328e0da: Pushed
9f8566ee5135: Pushed
v1: digest: sha256:955dbe76c31f802d537d0c5e4160b3a010091e7e8323f46ecbb2a0f2174a5ef5 size: 947
```

6、登陆 Harbor 查看到推送的镜像，即完成镜像推送。

![image](https://kubesphere-docs.pek3b.qingstor.com/png/image.png)