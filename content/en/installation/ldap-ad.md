---
title: "Configure LDAP/AD"
keywords: 'kubesphere, kubernetes, authentication, LDAP, AD'
description: 'How to integrate LDAP/AD with KubeSphere'
---

If your enterprise uses LDAP/AD for user authentication, you can integrate it with KubeSphere built-in OpenLDAP to authenticate users when logging in the KubeSphere console.

In this tutorial, we will demonstrate how to configure AD accounts. It also works for LDAP.

> Note: We will use a script to configure this process. KubeSphere has the plan to provide UI for configuring LDAP/AD in v3.0.

## Inspect Active Directory

Connect to windows server 2016, enter Active Director Administrator, obtain managerDN (**It could be a read-only account**)

![Windows AD](https://pek3b.qingstor.com/kubesphere-docs/png/20191129225035.png)

## Create and Edit Script

Connect to SSH of KubeSphere server, create a script and name it `inject-ks-account.sh`, then replace the values of key **host、managerDN、managerPWD、userSearchBase** to the actual AD values.

```bash
#!/bin/bash
set -e

host="139.198.111.111:30222"    # Replace its value with your AD server IP and port
managerDN="cn=Administrator,cn=Users,dc=kubesphere,dc=com"  # Replace its value with your AD Administrator account. It could be read-only.
managerPWD="123456789"          # Replace with the Administrator's password
userSearchBase="cn=Users,dc=kubesphere,dc=com"   # Depend on your AD configuration
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

## Run and Verify

After you created the script, you can run `inject-ks-account.sh` to configure AD accounts.

Please note that this script will restart Pod `ks-account`. Your account might be not available for a few minutes. You can log in KubeSphere to check the accounts that read from AD server when the Pod `ks-account` is **running**.

![Account List](https://pek3b.qingstor.com/kubesphere-docs/png/20191113182235.png)

At this point, you need to use cluster admin account to assign roles to the AD users. After the roles have been assigned, these AD accounts are ready to use in KubeSphere.
