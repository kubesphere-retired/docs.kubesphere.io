---
title: "Use Alertmanager to manage alerts in KubeSphere"
keywords: 'kubernetes, prometheus, alertmanager, alerting'
description: ''
---

The Alertmanager handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating, grouping, and routing them to the correct receiver integration such as email, PagerDuty, or OpsGenie. It also takes care of silencing and inhibition of alerts. For more details, please refer to  [Alertmanager guide](https://prometheus.io/docs/alerting/latest/alertmanager/).

KubeSphere has been using Prometheus as its monitoring service's backend from the first release. Starting from v3.0, KubeSphere adds Alertmanager to its monitoring stack to manage alerts sending from Prometheus as well as other components such as [kube-events](https://github.com/kubesphere/kube-events) and kube-auditing.

## Use Alertmanager to manage alerts sent from Prometheus

Alerting with Prometheus is separated into two parts. Alerting rules in Prometheus servers send alerts to an Alertmanager. The Alertmanager then manages those alerts, including silencing, inhibition, aggregation and sending out notifications via methods such as email, on-call notification systems, and chat platforms.

Starting from v3.0, KubeSphere adds popular alert rules in the open source community to its Prometheus offering as the default builtin alert rules. And by default Prometheus in KubeSphere v3.0 evaluates these builtin alert rules continuously and then sends alerts to Alertmanager.

## Use Alertmanager to manage alerts sent from KubeSphere events 

Alertmanager can be used to manage alerts sent from sources other than Prometheus. In KubeSphere v3.0 and above, user can use it to manage alerts triggered by K8s events. For more details, please refer to [KubeSphere Events](../events/kube-events.md)

## Use Alertmanager to manage alerts sent from KubeSphere auditing 

In KubeSphere v3.0 and above, user can also use Alertmanager to manage alerts triggered by K8s/KubeSphere audit events. For more details, please refer to [KubeSphere Auditing](../audit/kube-auditing.md)

## Receiving notifications for Alertmanager alerts

Usually to receive notifications for Alertmanager alerts, user has to edit Alertmanager's configuration file manually to configure receiver settings like Email/Slack etc.

This is not convenient for K8s users and it breaks the multi-tenant principle/architecture of KubeSphere. More specifically, alerts triggered by workloads in different namespaces belonging to different users might be sent to the same user.

To use Alertmanager to manage alerts in KubeSphere while complying with the multi-tenancy principle and providing K8s user friendly notification experience, KubeSphere developed [Notification Manager](https://github.com/kubesphere/notification-manager), a K8s native notification management tool with multi-tenancy support, and made it 100% open source. User can select to install this tool in KubeSphere v3.0 and above.

For more details about using Notification Manager to receive Alertmanager Notifications, please refer to [Notification Manager](./notification-manager.md)