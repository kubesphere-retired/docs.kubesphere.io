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

属于下列命令进入`jenkins_home`目录您可以看到有 GC Log 相关文件：

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
