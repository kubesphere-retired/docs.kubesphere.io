---
title: "DevOps 运维常见问题" 
---

## 性能及缓存命中问题

在 Jenkins 的内存空间不足的情况下可能会下列问题：

1. 流水线页面浏览较慢，部分列表页响应超过10秒
2. 流水线运行列表页、分支列表页等页面排序顺序不对
…………

### 问题排查

当您发生这类问题时可以进入到 Jenkins 的 Pod 当中排查 GC 日志(ks-jenkins后面的xxx视环境输入)：

```bash
$ kubectl exec -n kubesphere-devops-system ks-jenkins-xxxxxx-xxxx -it bash
```

属于下列命令进入`jenkins_home`目录您可以看到有 GC Log 相关文件，在下面的文件中 `gc-2019-05-11_13-05-37.log.0.current` 为 当前的 GC LOG 文件：

```bash
$ cd /var/jenkins_home
```

```bash
$ ls
caches						   io.kubesphere.jenkins.devops.auth.KubesphereTokenAuthGlobalConfiguration.xml  queue.xml
casc_configs					   jenkins.CLI.xml								 queue.xml.bak
config.xml					   jenkins.install.InstallUtil.lastExecVersion					 scriptApproval.xml
copy_reference_file.log				   jenkins.model.JenkinsLocationConfiguration.xml				 secret.key
credentials.xml					   jenkins.telemetry.Correlator.xml						 secret.key.not-so-secret
gc-2019-05-11_13-05-37.log.0.current		   jobs										 secrets
hudson.model.UpdateCenter.xml			   logs										 updates
hudson.plugins.git.GitTool.xml			   lost+found									 userContent
hudson.plugins.sonar.SonarGlobalConfiguration.xml  nodeMonitors.xml								 users
hudson.plugins.sonar.SonarRunnerInstallation.xml   nodes									 war
hudson.tasks.Mailer.xml				   org.jenkinsci.plugins.workflow.flow.FlowExecutionList.xml			 workflow-libs
identity.key.enc				   plugins									 workspace
init.groovy.d					   plugins.txt
```

此时我们可以使用`kubectl cp`命令取出相关的 Jenkins 的 GC 日志并查看。

### 对 Jenkins 的内存进行扩容(需要重启 Jenkins 服务)

当您确定 Jenkins 的内存已经不足时，可以通过调整 Jenkins 的 JVM 参数等配置进行扩容。

使用 `kubectl edit` 编辑 `Jenkins` 部署

输入下面的命令编辑 Jenkins 配置

```bash
$ kubectl edit -n kubesphere-devops-system deployments.apps ks-jenkins
```

修改文件中的环境变量 `JAVA_TOOL_OPTIONS` 中的 Xms（最小堆大小） 与 Xmx（最大堆大小）, 默认情况下多节点部署的最小堆大小为3g、最大堆大小为6g。

```bash
    spec:
      containers:
      - args:
        - --argumentsRealm.passwd.$(ADMIN_USER)=$(ADMIN_PASSWORD)
        - --argumentsRealm.roles.$(ADMIN_USER)=admin
        env:
        - name: JAVA_TOOL_OPTIONS
          value: -Xms3g -Xmx6g -XX:MaxPermSize=512m -XX:MaxRAM=8g -verbose:gc -Xloggc:/var/jenkins_home/gc-%t.log
            -XX:NumberOfGCLogFiles=2 -XX:+UseGCLogFileRotation -XX:GCLogFileSize=100m
            -XX:+PrintGC  -XX:+PrintGCDateStamps -XX:+PrintGCDetails -XX:+PrintHeapAtGC
            -XX:+PrintGCCause -XX:+PrintTenuringDistribution -XX:+PrintReferenceGC
            -XX:+PrintAdaptiveSizePolicy -XX:+UseG1GC -XX:+UseStringDeduplication
            -XX:+ParallelRefProcEnabled -XX:+DisableExplicitGC -XX:+UnlockDiagnosticVMOptions
            -XX:+UnlockExperimentalVMOptions
```

修改文件中的 `limit` 避免发生 kubernetes 中的 OOM，requests 与 limits 中的内存大小分别比 Xms 大小和 Xmx 大小略大。

```bash
        resources:
          limits:
            cpu: "1"
            memory: 8Gi
          requests:
            cpu: 500m
            memory: 4Gi
```

> 注意 修改部署配置将使 Jenkins 重启

修改完成后保存即可完成 Jenkins 的内存扩容。


### 减少不必要的构建数据

为了尽量减少 Jenkins 的内存消耗，可以使用以下方法来清理不需要的构建、分支等。

#### 为不关联代码仓库的流水线清理数据

在不关联代码仓库的流水线的编辑页面当中，我们可以为流水线配置丢弃旧的构建。

在默认情况下我们推荐设置为保留7天，并最多保留十个具体如下图所示。

![丢弃no-scm构建](/no-scm-discard-setting.jpg)


#### 为关联代码仓库的流水线清理数据

类似于不关联代码仓库的流水线，我们可以为关联代码仓库的流水线配置丢弃旧的分支。

丢弃旧的分支是指丢弃流水线下的某个分支，及这个分支下的所有构建。

我们不推荐在远程代码仓库仍存在分支的情况下丢弃旧的分支，因此我们这里将如下图所示进行设置，这表示当代码仓库中的分支被删除时， Jenkins 当中对应的分支也会删除。

![丢弃in-scm分支](/in-scm-discard-setting.png)

#### 避免构建不需要DevOps功能的分支

用户的代码仓库中往往都有各种不同的分支，其中一些分支可能是临时的开发分支，这些分支并不需要运行 DevOps 流水线。

我们可以通过 DevOps流水线的设置来过滤一些不需要的分支，如下图所示。

![正则过滤分支](/devops-regex-filter.png)


## 升级 Jenkins Agent 的包版本

在默认的安装中，我们为用户内置了一部分 agent ，具体可以查看[内置 agent 信息](../jenkins-agent/#podtemplate-base)的相关文档。

用户在自己的使用场景当中，可能会使用不同的语言版本活不同的工具版本。这篇文档主要介绍如何替换内置的 agent。

Kubesphere Jenkins 的每一个 agent 都是一个Pod，如果要替换内置的agent，就需要替换 agent 的相应镜像。

### 构建最新 nodejs 版本的 agent 镜像

我们 agent 的源代码都在 Github KubeSphere 组织下，其中 nodejs agent 的镜像的源代码仓库地址为 https://github.com/kubesphere/builder-nodejs。

可以看到我们现在镜像的 Dockerfile 为：

```dockerfile
FROM kubespheredev/builder-base:latest

RUN curl -f --silent --location https://rpm.nodesource.com/setup_9.x | bash - && \
  yum install -y nodejs gcc-c++ make bzip2 GConf2 gtk2 chromedriver chromium xorg-x11-server-Xvfb

RUN npm i -g watch-cli vsce typescript

# Yarn
ENV YARN_VERSION 1.3.2
RUN curl -f -L -o /tmp/yarn.tgz https://github.com/yarnpkg/yarn/releases/download/v${YARN_VERSION}/yarn-v${YARN_VERSION}.tar.gz && \
	tar xf /tmp/yarn.tgz && \
	mv yarn-v${YARN_VERSION} /opt/yarn && \
	ln -s /opt/yarn/bin/yarn /usr/local/bin/yarn
```

我们将修改 Dockerfile，将 nodejs 版本调整为10.x，并将 yarn 的版本调整到 1.16.0，则我们的 Dockerfile 如下所示：

```dockerfile
FROM kubesphere/builder-base:latest

RUN curl -f --silent --location https://rpm.nodesource.com/setup_10.x | bash - && \      # 安装 10.x 版本 nodejs
  yum install -y nodejs gcc-c++ make bzip2 GConf2 gtk2 chromedriver chromium xorg-x11-server-Xvfb

RUN npm i -g watch-cli vsce typescript

# Yarn
ENV YARN_VERSION 1.16.0  # 安装 1.16.0 版本 的 yarn
RUN curl -f -L -o /tmp/yarn.tgz https://github.com/yarnpkg/yarn/releases/download/v${YARN_VERSION}/yarn-v${YARN_VERSION}.tar.gz && \
	tar xf /tmp/yarn.tgz && \
	mv yarn-v${YARN_VERSION} /opt/yarn && \
	ln -s /opt/yarn/bin/yarn /usr/local/bin/yarn

```

当我们完成了 Dockerfile 的编写就可以构建 Docker 镜像并验证镜像是否满足要求：

使用下面的命令构建 Docker 镜像, 其中 -t 后参数为镜像名称，可以根据自己的需要进行调整。

```bash
$ docker build -t runzexia/builder-nodejs:advanced-2.1.0-dev .
Step 1/5 : FROM kubesphere/builder-base:latest
 ---> 19d0e8ccd4bb
Step 2/5 : RUN curl -f --silent --location https://rpm.nodesource.com/setup_10.x | bash - &&   yum install -y nodejs gcc-c++ make bzip2 GConf2 gtk2 chromedriver chromium xorg-x11-server-Xvfb

………………

Step 5/5 : RUN curl -f -L -o /tmp/yarn.tgz https://github.com/yarnpkg/yarn/releases/download/v${YARN_VERSION}/yarn-v${YARN_VERSION}.tar.gz &&         tar xf /tmp/yarn.tgz &&         mv yarn-v${YARN_VERSION} /opt/yarn &&         ln -s /opt/yarn/bin/yarn /usr/local/bin/yarn
 ---> Running in 5ce7b5e09e7e
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   609    0   609    0     0    566      0 --:--:--  0:00:01 --:--:--   566
100 1145k  100 1145k    0     0  88823      0  0:00:13  0:00:13 --:--:--  101k
Removing intermediate container 5ce7b5e09e7e
 ---> a4ba9a74fd03
Successfully built a4ba9a74fd03
Successfully tagged runzexia/builder-nodejs:advanced-2.1.0-dev
```

可以看到我们成功完成了镜像的构建，现在让我们在本地运行容器来查看内置环境的版本是否满足需求：

```bash
$ docker run -it runzexia/builder-nodejs:advanced-2.1.0-dev bash

$ node -v
v10.16.0
$ npm -v
6.9.0
$ yarn -v
1.16.0
```

可以看到 nodejs 版本已经更新为较新的版本了，现在我们将镜像推送到镜像仓库当中。
```bash
$ docker push runzexia/builder-nodejs:advanced-2.1.0-dev
```

### 修改 Jenkins 配置，并重新加载 Jenkins 系统设置

当我们完成了镜像的推送，就可以通过修改配置来修改 Jenkins 的系统设置。

使用集群管理员账号登陆 KubeSphere 页面，进入 企业空间 -》 system-workspace（企业空间） -》 kubesphere-devops-system（项目) -》 配置中心  -》 配置 -》 jenkins-casc-config -》 更多操作 -》 编辑 ConfigMap 。

我们现在可以修改 Agent 的镜像版本了，修改 `{{.jenkins.clouds.templates.nodejs.containers.nodejs.image}}` 为 `runzexia/builder-nodejs:advanced-2.1.0-dev`。

```yaml
jenkins:
  mode: EXCLUSIVE
  numExecutors: 5
  scmCheckoutRetryCount: 2

  clouds:
    - kubernetes:
        name: "kubernetes"
        serverUrl: "https://kubernetes.default"
        skipTlsVerify: true
        namespace: "kubesphere-devops-system"
        credentialsId: "k8s-service-account"
        jenkinsUrl: "http://ks-jenkins.kubesphere-devops-system:80"
        jenkinsTunnel: "ks-jenkins-agent.kubesphere-devops-system:50000"
        containerCapStr: "100"
        connectTimeout: "60"
        readTimeout: "60"
        maxRequestsPerHostStr: "32"
        templates:
          - name: "nodejs"
            namespace: "kubesphere-devops-system"
            label: "nodejs"
            nodeUsageMode: "EXCLUSIVE"
            idleMinutes: 0 # Do not reuse pod.
            containers:
            - name: "nodejs"
              image: "runzexia/builder-nodejs:advanced-2.1.0-dev"  // 修改此处镜像版本
              command: "cat"
              ttyEnabled: true
              envVars:
              - containerEnvVar:
                  key: "DOCKER_HOST"
                  value: "tcp://localhost:2375"
            - name: "jnlp"
              image: "jenkins/jnlp-slave:3.27-1"
              args: "${computer.jnlpmac} ${computer.name}"
              resourceRequestCpu: "100m"
              resourceRequestMemory: "32Mi"
            - name: "docker-server"
              image: "docker:18.06.1-ce-dind"
              ttyEnabled: true
              privileged: true
              args: "--insecure-registry harbor.devops.kubesphere:30280"
              envVars:
              - containerEnvVar:
                  key: "DOCKER_HOST"
                  value: "tcp://localhost:2375"
            workspaceVolume:
              emptyDirWorkspaceVolume:
                memory: false

```

修改完毕后，我们就可以参考文档 [Jenkins 系统设置](../jenkins-setting/#登陆-jenkins-重新加载)来重新加载我们的配置了。当重新加载配置完成后，我们的 Agent 版本也就更新成功了。

可以在 Jenkins 系统管理的系统设置中已经更新为我们设置的镜像版本。

![镜像版本](/update-nodejs-agent.jpg)
