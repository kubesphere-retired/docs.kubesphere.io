---
title: "接入 LDAP / AD 域账号（Beta）"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: 'LDAP, AD account'
---

如果您的企业使用 LDAP 作为用户认证系统，您可以在 KubeSphere 中通过脚本配置内置的 OpenLDAP 接入您的 LDAP 用户系统，从而允许用户使用他们的 LDAP 账号来登录 KubeSphere 控制台。

以下将说明 KubeSphere 如何接入 AD 域账号，同样适用于对接外部 LDAP。

> 说明：本方法将通过后台脚本接入，3.0 版本将支持在 UI 通过更简单的配置方式来接入 LDAP / AD 域账号。


## 查看 AD 域

在 windows server 2016 上，进入 Active Director 管理中心，获取 managerDN (**可以是只读账号**)

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191129225035.png)

## 创建并编辑脚本

登陆 KubeSphere 后台节点，创建一个 **inject-ks-account.sh** 的脚本，然后修改脚本中 **host、managerDN、managerPWD、userSearchBase** 这四个配置为您 AD 域实际的参数：

```bash
#!/bin/bash
set -e

host="139.198.111.111:30222"    # 将 host 的值改为实际的服务器 IP 与 端口
managerDN="cn=Administrator,cn=Users,dc=kubesphere,dc=com"  # 值修改为实际的 AD 域的管理账号, 可以为只读账号
managerPWD="123456789"    #  管理账号密码
userSearchBase="cn=Users,dc=kubesphere,dc=com"   # 根据实际配置进行修改
sidecar="kubespheredev/ad-sidecar:v0.0.1"

generate_config() {
cat << EOF
apiVersion: v1
data:
  sync.yaml: |
    sync:
      interval: "300s"
    src:
      host: "${host}"
      managerDN: "${managerDN}"
      managerPWD: "${managerPWD}"
      userSearchBase: "${userSearchBase}"
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
EOF
}

# apply sync config
generate_config | kubectl apply -f -


# inject sidecar
kubectl -n kubesphere-system get deploy ks-account -o json | jq '.spec.template.spec.volumes += [{"configMap":{"name":"ad-sync-config"},"name":"ad-sync-config"}]' | jq '.spec.template.spec.containers += [{"command":["ad-sidecar","--logtostderr=true","--v=2"],"image":"'${sidecar}'","imagePullPolicy":"IfNotPresent","name":"ad-sidecar","ports":[{"containerPort":19090,"protocol":"TCP"}],"volumeMounts":[{"mountPath":"/etc/kubesphere/sync.yaml","name":"ad-sync-config","subPath":"sync.yaml"}]}]' | kubectl apply -f -

# use proxy port
kubectl -n kubesphere-system get svc ks-account -o json | jq '.spec.ports[0].targetPort=19090' | kubectl apply -f -
```

## 执行脚本并验证账号接入

创建完成后，后台执行 `inject-ks-account.sh`

该脚本会重启 ks-account 的 Pod，会有短暂几分钟账号无法登陆。待 ks-account 的 pod 就绪后, 登录 KubeSphere 可以看到 AD 中的账户数据：

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191113182235.png)

接入的账号默认无任何权限，需要在平台的用户管理页面给接入的用户授予角色。当接入的账号授予集群角色后，即可用 AD 域中的账户登录 KubeSphere。
