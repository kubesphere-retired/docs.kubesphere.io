---
title: "Notification Manager"
keywords: "kubernetes, kubesphere, notification manager, email, wechat, slack"
description: "Multi-tenant notification manager on KubeSphere"
---

Notification Manager manages notifications in kubesphere. It receives alerts or notifications from different senders and then send notifications to multi-tenant receivers based on alerts/notifications' tenant label like "namespace". 

Supported senders includes:
- Prometheus Alertmanager
- Custom sender (Coming soon)

Supported receivers includes:
- Email
- [Wechat Work](https://work.weixin.qq.com/)
- Slack 
- Webhook (Coming soon)

## QuickStart

### Enable Notification Manager before Installation

> Note: This guide is only used for installing KubeSphere on Linux machines. If you are going to install KubeSphere and Notification Manager on your own Kubernetes cluster, please see [ks-installer](https://github.com/kubesphere/ks-installer).

Before starting the installation, you need to change the value of `monitoring.notification-manager.enabled` to `true` in `conf/common.yaml` as follows, then you can go back to [All-in-One](../all-in-one) or [Multi-Node](../multi-node) guide to continue your installation.

```yaml
# Following components are all optional for KubeSphere,
# Which could be turned on to install it before installation or later by updating its value to true
    monitoring:
      notification:
        enabled: true
```

### Enable Notification Manager after Installation

If you already have a minimal KubeSphere setup, you still can enable notification manager by editing the ConfigMap of ks-installer using the following command.

```bash
kubectl edit cm -n kubesphere-system ks-installer
```

Then set Notification Manager from `False` to `True`.

```yaml
    monitoring:
      notification:
        enabled: true
```

Save it and exit. Notification Manager will be installed automatically for you. You can inspect the logs of ks-installer Pod to [verify the installation status](../verify-components), and wait for the successful result logs output.

### Config Prometheus Alertmanager to send alerts to Notification Manager

Notification Manager uses port `19093` and API path `/api/v2/alerts` to receive alerts sending from Prometheus Alertmanager of Kubsphere.
To receive Alertmanager alerts, eidt the Secret `alertmanager-main` in the namespace `kubesphere-monitoring-system`, add webhook config like below to the `receivers` section of alertmanager.yaml:

```shell
    "receivers":
     - "name": "notification-manager"
       "webhook_configs":
       - "url": "http://notificatio-nmanager-svc.kubesphere-monitoring-system.svc:19093/api/v2/alerts"
```

### Config receivers

Notification Manager now supports three type receivers, email, Wechat Work, slack. Only administrator can config receivers.

#### Email

If a tenant named **test-user** who wants to receive notifications from email, just create a email receiver like this.

```
cat <<EOF | kubectl apply -f -
apiVersion: notification.kubesphere.io/v1alpha1
kind: EmailConfig
metadata:
  labels:
    app: notification-manager
    type: tenant
    user: test-user
  name: test-user-config
  namespace: kubesphere-monitoring-system
spec:
  authPassword:
    key: password
    name: test-user-secret
    namespace: kubesphere-monitoring-system
  authUsername: abc1
  from: abc1@xyz.com
  requireTLS: true
  smartHost:
    host: imap.xyz.com
    port: "25"

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: EmailReceiver
metadata:
  labels:
    app: notification-manager
    type: tenant
    user: test-user
  name: test-user-receiver
  namespace: kubesphere-monitoring-system
spec:
  emailConfigSelector:
    matchLabels:
      type: tenant
      user: test-user
  to:
  - abc2@xyz.com
  - abc3@xyz.com

---
apiVersion: v1
data:
  password: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: test-user-secret
  namespace: kubesphere-monitoring-system
type: Opaque
EOF
```

The emailConfigSelector is a selector to selecte EmailConfig for email receiver, if the emailConfigSelector is nil, receiver will use the default email config. You can create a default email config like this.

```
cat <<EOF | kubectl apply -f -
apiVersion: notification.kubesphere.io/v1alpha1
kind: EmailConfig
metadata:
  labels:
    app: notification-manager
    type: default
  name: default-email-config
  namespace: kubesphere-monitoring-system
spec:
  authPassword:
    key: password
    name: default-email-secret
    namespace: kubesphere-monitoring-system
  authUsername: default
  from: default@xyz.com
  requireTLS: true
  smartHost:
    host: imap.xyz.com
    port: "25"

---
apiVersion: v1
data:
  password: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: default-email-secret
  namespace: kubesphere-monitoring-system
type: Opaque
```

Email receiver labeled with `type: tenant` only receive notification happend in the namespace which user be in. If you want to receive notification without namespace, you need to create a global email receiver labeled with `type: global` like this.

```
apiVersion: notification.kubesphere.io/v1alpha1
kind: EmailReceiver
metadata:
  labels:
    app: notification-manager
    type: global
  name: global-email-receiver
  namespace: kubesphere-monitoring-system
spec:
  to:
  - global@xyz.com
EOF
```

>Global email receiver use the default email config.

#### Wechat Work

Notification Manager supports sending notification to Wechat Work. 
If a tenant named **test-user** who wants to receive notifications from Wechat Work, just create a wechat receiver like this.

```
cat <<EOF | kubectl apply -f -
apiVersion: notification.kubesphere.io/v1alpha1
kind: WechatConfig
metadata:
  name: test-user-config
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: tenant
    user: test-user
spec:
  wechatApiUrl: https://qyapi.weixin.qq.com/cgi-bin/
  wechatApiSecret:
    key: wechat
    name: test-user-secret
  wechatApiCorpId: wwfd76b24f06513578
  wechatApiAgentId: "1000002"

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: WechatReceiver
metadata:
  name: test-user-wechat
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: tenant
    user: test-user
spec:
  wechatConfigSelector:
    matchLabels:
      type: tenant
      user: test-user
  # optional
  # One of toUser, toParty, toParty should be specified.
  toUser: user1 | user2
  toParty: party1 | party2
  toTag: tag1 | tag2

---
apiVersion: v1
data:
  wechat: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: test-user-secret
  namespace: kubesphere-monitoring-system
type: Opaque
EOF
```

>WechatApiCorpId is the id of your Wechat Work. WechatApiAgentId is the id of app which sending message to user in your Wechat Work, wechatApiSecret is the secret of this app, you can get these two parameters in App Managerment of your Wechat Work. Note that any user, party or tag who wants to rerceive notifications must be in the allowed users list of this app.

The wechatConfigSelector is a selector to selecte WechatConfig for wechat receiver, if the wechatConfigSelector is nil, wechat receiver will use the default wechat config. You can create a default wechat config like this.

```
cat <<EOF | kubectl apply -f -
apiVersion: notification.kubesphere.io/v1alpha1
kind: WechatConfig
metadata:
  name: default-wechat-config
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: default
spec:
  wechatApiUrl: https://qyapi.weixin.qq.com/cgi-bin/
  wechatApiSecret:
    key: wechat
    name: default-wechat-secret
  wechatApiCorpId: wwfd76b24f06513578
  wechatApiAgentId: "1000002"

---
apiVersion: v1
data:
  wechat: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: default-wechat-secret
  namespace: kubesphere-monitoring-system
type: Opaque
EOF
```

Wechat receiver labeled with `type: tenant` only receive notification happend in the namespace which user be in. If you want to receive notification without namespace, you need to create a global wechat receiver labeled with `type: global` like this.

```
apiVersion: notification.kubesphere.io/v1alpha1
kind: WechatReceiver
metadata:
  name: global-wechat-wechat
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: global
spec:
  # optional
  # One of toUser, toParty, toParty should be specified.
  toUser: global
  toParty: global
  toTag: global
EOF
```

>Global wechat receiver use the default wechat config.

#### Slack

Notification Manager supports sending notification to slack channels. If a tenant named **test-user** who wants to receive notifications from slack, just create a slack receiver like this.

```
cat <<EOF | kubectl apply -f -
apiVersion: notification.kubesphere.io/v1alpha1
kind: SlackConfig
metadata:
  name: test-user-config
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: tenant
    user: test-user
spec:
  slackTokenSecret: 
    key: token
    name: test-user-secret

---
apiVersion: notification.kubesphere.io/v1alpha1
kind: SlackReceiver
metadata:
  name: test-user-slack
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: tenant
    user: test-user
spec:
  slackConfigSelector:
    matchLabels:
      type: tenant
      user: test-user
  channel: alert

---
apiVersion: v1
data:
  token: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: test-user-secret
  namespace: kubesphere-monitoring-system
type: Opaque
EOF
```

>Slack token is the OAuth Access Token or Bot User OAuth Access Token when you create a slack app. This app must have the scope chat:write. The user who created the app or bot user must be in the channel which you want to send notification to.

The slackConfigSelector is a selector to selecte SlackConfig for slack receiver, if the slackConfigSelector is nil, slack receiver will use the default slack config. You can create a default slack config like this.

```
cat <<EOF | kubectl apply -f -
apiVersion: notification.kubesphere.io/v1alpha1
kind: SlackConfig
metadata:
  name: default-slack-config
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: default
spec:
  slackTokenSecret: 
    key: token
    name: default-slack-secret

---
apiVersion: v1
data:
  token: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: default-slack-secret
  namespace: kubesphere-monitoring-system
type: Opaque
EOF
```

Slack receiver labeled with `type: tenant` only receive notification happend in the namespace which user be in. If you want to receive notification without namespace, you can create a global slack receiver labeled with `type: global` like this.

```
cat <<EOF | kubectl apply -f -
apiVersion: notification.kubesphere.io/v1alpha1
kind: SlackReceiver
metadata:
  name: global-slack-slack
  namespace: kubesphere-monitoring-system
  labels:
    app: notification-manager
    type: tenant
    user: test-user
spec:
  channel: global
EOF
```

>Global slack receiver use the default slack config.
