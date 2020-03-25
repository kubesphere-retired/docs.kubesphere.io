---
title: "Release Notes For 2.1.0"
keywords: "kubernetes, docker, kubesphere, jenkins, istio, prometheus"
description: "KubeSphere Release Notes For 2.1.0"
---

KubeSphere 2.1.0 was released on Nov 11th, 2019, which fixes known bugs, adds some new features and brings some enhancements. If you have installed versions of 2.0.x, please upgrade it and enjoy the better user experience of v2.1.0.

## What's New in 2.1.0

## Installer Enhancements

- Decouple some components, enabling DevOps, Service Mesh, App Store, Logging, Alerting and Notification to be optional and pluggable.
- Add Grafana (v5.2.4) as the optional component
- Upgrade Kubernetes to 1.15.5. It is also compatible with 1.14.x and 1.13.x.
- Upgrade  [OpenPitrix](https://openpitrix.io/)  to v0.4.5
- Upgrade the log forwarder Fluent Bit to v1.3.2
- Upgrade Jenkins to v2.176.2
- Upgrade Istio to 1.3.3
- Optimize the high availability for core components

## App Store

### Features

Support upload / test / review / deploy / publish/ classify / upgrade / deploy and delete apps, and provides nine built-in applications

### Upgrade & Enhancement

- The application repository configuration is migrated from global to each workspace
- Support add application repository to share applications in a workspace

## Storage

### Features

- Support Local Volume with Dynamic provisioning
- Provide the real-time monitoring feature for QingCloud block storage

### Upgrade & Enhancement

QingCloud CSI is adapted to CSI 1.1.0, supports upgrade, topology, create or delete a snapshot, it also supports create PVC based on a snapshot

### BUG Fixes

Fix the StorageClass list display problem

## Observability

### Features

- Support for collecting the file logs on the disk,  it is used for the Pod which preserve the logs as the file on the disk
- Support integrating with external ElasticSearch 7.x
- Support log search for Chinese words
- Support initContainer log display
- Support for exporting logs
- Support for canceling the notification from alerting
