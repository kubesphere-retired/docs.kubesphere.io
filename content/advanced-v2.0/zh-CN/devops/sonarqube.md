---
title: "访问 SonarQube 并创建 Token"
---

### 访问 SonarQube 

1、首先使用集群管理员账号 admin 登录 KubeSphere，点击右侧 `企业空间`，进入 `system-workspace`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/devops-workspace.png)

2、然后选择 `项目管理`，点击进入 `kubesphere-devops-system`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-ns.png)

3、然后点击 `网络与服务` 下的 `服务` ，选择进入 `ks-sonarqube-sonarqube` 服务。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-getsvc.png)

4、在服务的详情页即可看到 SonarQube 暴露的节点端口。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-port.png)

5、然后通过 `节点 IP: 节点端口` 的方式进入到 SonarQube 界面。若是在青云 QingCloud 公有云上配置，则需要配置防火墙和端口转发，具体方式可参考 [访问服务示例](../../quick-start/harbor-gitlab-devops-offline/#%E8%AE%BF%E9%97%AE%E7%A4%BA%E4%BE%8B%E6%9C%8D%E5%8A%A1>)。

### 创建 SonarQube Token

1、使用默认账号 `admin/admin` 登入 sonar，然后点击右上角加号下的 `Create new project`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-create.png)

2、然后输入 `name`，然后点击 `Generate`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-name.png)

3、即可获取 token，然后点击 `Continue`。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-con.png)

4、然后选择 Language `Java` ，选择 build technology 为 `Maven`，**复制 token**。点击 `Finish this tutorial` 即可。

![](https://pek3b.qingstor.com/kubesphere-docs/png/sonar-finish.png)

