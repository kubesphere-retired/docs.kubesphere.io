---
title: "Kubesphere ldap对接Windows AD域控"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---


对于 KubeSphere 的企业用户，将KubeSphere与企业AD域对接，可以按需要相互进行认证及管理，实现资源的共享



> 提示：
> - 将Kubesphere与AD账号对接后内置gitlab等可直接使用AD账号体系



## 前提条件

配置已有Windows AD域
KubeSphere集群与Windows AD域服务器间可以通讯且对接域账号正常状态

## 第一步: 创建AD账号

创建KubeSphere集群专用账号




## 第二步: 准备配置文件



>获取配置文件
```bash
wget https://gist.githubusercontent.com/wansir/9b02cb364cc1def21d78967373cd4b7f/raw/a27f5bafbfe93554c510285dfe64650e50d259d7/ad-sync-config.yaml && vi ad-sync-config.yaml
```

>编辑配置文件
```
apiVersion: v1
data:
  sync.yaml: |
    sync:
      interval: “300s"
    src:
     #{ad_host}:{ad_port}
      host: "192.168.60.224:389”
      #{ad_username}@{domain name}
      managerDN: "kubesphere@benlai.com”
      #{ad_password}
      managerPWD: "P@88w0rd”
      #ou={GROUP_NAME},dc={domain},dc={domain}
      userSearchBase: “ou=huadong,dc=benlai,dc=com"
      usernameAttribute: "sAMAccountName"
      descriptionAttribute: "description"
      mailAttribute: "mail"
    dst:
      host: "openldap.kubesphere-system.svc:389"
      managerDN: "cn=admin,dc=kubesphere,dc=io"
      managerPWD: "admin"
      userSearchBase: "ou=Users,dc=kubesphere,dc=io"
kind: ConfigMap
metadata:
  name: ad-sync-config
  namespace: kubesphere-system
```

> 将src内容修改；
> 根据需求调整`userSearchBase`内容，如果仅同步某分组账号添加`ou=GROUP_NAME`，不用ou即为同步ad内全部账号;





## 第三步: 对接 ldap



**1.** 给ks-account添加sidecar
```bash
wget -O - https://gist.githubusercontent.com/wansir/37b05aede8501d8a208ccb8faba48cc0/raw/520770f51a86cdfc53affd0ea96ce058a83af101/update.sh | bash
```
**2.** 确认所有pod启动完成
```bash
kubectl get pods -n kubesphere-system -owide 
```

**3.** AD中的账户会同步到ks中，同步到ks 中的账户默认不赋角色，自行配置。


**注意事项**

**1.** 对接过程中会重启ks-apiserver造成ks短暂无法访问；

**2.** ks-account非running状态检查`ad-sync-config.yaml`中配置，然后重新执行第三步并删除ks-account pod让其重建

**3.** 
错误：`LDAP Result Code 4 "Size Limit Exceeded”:`
解决：如果AD内账号数大于MaxPageSize所设置的数量则会出错,需要[AD修改MaxPageSize](https://docs.microsoft.com/en-us/previous-versions/office/exchange-server-analyzer/aa998536(v=exchg.80)?redirectedfrom=MSDN)







## FAQ

KubeSphere 已在阿里云、腾讯云、华为云、青云、AWS 上进行过部署测试，测试结果与相关的解决方法，请参考 [AE 2.0.2 云平台安装测试结果](https://github.com/kubesphere/ks-installer/issues/23)。另外，常见的安装问题我们也已整理相关的解决方法在 [安装常见问题](../../faq/faq-install)。

若遇到其它的安装问题需要协助支持，请在 [GitHub](https://github.com/kubesphere/kubesphere/issues) 提交 Issue，我们会第一时间跟踪解决。



