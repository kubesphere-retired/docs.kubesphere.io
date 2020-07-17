---
title: "Notification Manager"
keywords: "kubernetes, KubeSphere, notification manager, email, wechat, slack"
description: "Multi-tenant notification manager on KubeSphere"
---

Notification Manager manages notifications in KubeSphere. It receives alerts or notifications from different senders and then send notifications to multi-tenant receivers based on alerts/notifications' tenant label like "namespace". 

Supported senders includes:
- Prometheus Alertmanager
- Custom sender (Coming soon)

Supported receivers includes:
- Email
- [Wechat Work](https://work.weixin.qq.com/)
- Slack 
- Webhook (Coming soon)

## QuickStart

### Config Prometheus Alertmanager to send alerts to Notification Manager

Notification Manager uses port `19093` and API path `/api/v2/alerts` to receive alerts sending from Prometheus Alertmanager of Kubsphere.
To receive Alertmanager alerts, eidt the Secret `alertmanager-main` in the namespace `kubesphere-monitoring-system`, add webhook config like below to the `receivers` section of alertmanager.yaml:

Send Prometheus alerts to Notification Manager:
```shell
    "receivers":
    - "name": "prometheus"
      "webhook_configs":
      - "url": "http://notification-manager-svc.kubesphere-monitoring-system.svc:19093/api/v2/alerts"
    "route":
      "routes":
      - "match_re":
          "prometheus": ".*"
        "receiver": "prometheus"
```

Send event alerts to Notification Manager:
```shell
    "receivers":
    - "name": "event"
      "webhook_configs":
      - "url": "http://notification-manager-svc.kubesphere-monitoring-system.svc:19093/api/v2/alerts"
        "send_resolved": false
    "route":
      "routes":
      - "match":
          "alerttype": "event"
        "receiver": "event"
        "group_interval": "30s"
```

Send auditing alerts to Notification Manager:
```shell
    "receivers":
    - "name": "auditing"
      "webhook_configs":
      - "url": "http://notification-manager-svc.kubesphere-monitoring-system.svc:19093/api/v2/alerts"
        "send_resolved": false
    "route":
      "routes":
      - "match":
          "alerttype": "auditing"
        "receiver": "auditing"
        "group_interval": "30s"
```

### Config receivers

Notification Manager now supports three type receivers, email, Wechat Work, slack. Only administrator can config receivers.

#### Email

If a tenant named **test-user** who wants to receive notifications from email, just create a email receiver like this.

```
cat <<EOF | kubectl apply -f -
apiVersion: v1
data:
  password: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: test-user-email-secret
  namespace: kubesphere-monitoring-system
type: Opaque

---
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
    name: test-user-email-secret
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
EOF
```

The emailConfigSelector is a selector to selecte EmailConfig for email receiver, if the emailConfigSelector is nil, receiver will use the default email config. You can create a default email config like this.

```
cat <<EOF | kubectl apply -f -
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

---
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
  authUsername: default
  from: default@xyz.com
  requireTLS: true
  smartHost:
    host: imap.xyz.com
    port: "25"
EOF
```

Email receiver labeled with `type: tenant` only receive notification happend in the namespace which user be in. If you want to receive notification without namespace, you need to create a global email receiver labeled with `type: global` like this.

```
cat <<EOF | kubectl apply -f -
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
apiVersion: v1
data:
  wechat: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: test-user-wechat-secret
  namespace: kubesphere-monitoring-system
type: Opaque

---
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
    name: test-user-wehat-secret
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
EOF
```

>WechatApiCorpId is the id of your Wechat Work. WechatApiAgentId is the id of app which sending message to user in your Wechat Work, wechatApiSecret is the secret of this app, you can get these two parameters in App Managerment of your Wechat Work. Note that any user, party or tag who wants to rerceive notifications must be in the allowed users list of this app.

The wechatConfigSelector is a selector to selecte WechatConfig for wechat receiver, if the wechatConfigSelector is nil, wechat receiver will use the default wechat config. You can create a default wechat config like this.

```
cat <<EOF | kubectl apply -f -
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

---
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
EOF
```

Wechat receiver labeled with `type: tenant` only receive notification happend in the namespace which user be in. If you want to receive notification without namespace, you need to create a global wechat receiver labeled with `type: global` like this.

```
cat <<EOF | kubectl apply -f -
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
apiVersion: v1
data:
  token: dGVzdA==
kind: Secret
metadata:
  labels:
    app: notification-manager
  name: test-user-slack-secret
  namespace: kubesphere-monitoring-system
type: Opaque

---
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
    name: test-user-slack-secret

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
EOF
```

>Slack token is the OAuth Access Token or Bot User OAuth Access Token when you create a slack app. This app must have the scope chat:write. The user who created the app or bot user must be in the channel which you want to send notification to.

The slackConfigSelector is a selector to selecte SlackConfig for slack receiver, if the slackConfigSelector is nil, slack receiver will use the default slack config. You can create a default slack config like this.

```
cat <<EOF | kubectl apply -f -
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

---
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
    type: global
spec:
  channel: global
EOF
```

>Global slack receiver use the default slack config.
