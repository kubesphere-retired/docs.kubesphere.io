---
title: "Release Notes For 1.0.1"
keywords: ''
description: ''
---

KubeSphere Advanced Edition 1.0.1 was released on **January 28th, 2019**. 

It is recommended to download and install the latest version 1.0.1. If you have already installed 1.0.0, please download the 1.0.1, it also supports one-click upgrade from 1.0.0 to 1.0.1.

## Download Advanced Edition 1.0.1

Go to KubeSphere's website to download the [Advanced Edition 1.0.1](https://kubesphere.io/download/?type=advanced).

### Installation Guide

The release of Advanced Edition 1.0.1 supports following two installation modes, please refer to the [installation instructions](../../installation/intro) before start installation.

- `All-in-One` is single-node installation that supports one-click installation, it's only recommended for testing and experiencing the features of Advanced Edition, see [All-in-One](../../installation/all-in-one). By contrast, the Multi-node mode is recommended in a formal environment.
- `Multi-node` is used for a Multi-Node cluster installation, supports for installing a highly available master and etcd cluster and it's able to use in a formal environment, see [Multi-Node](../../installation/multi-node).

### Upgrade Guide

The release of Advanced Edition 1.0.1 has improved and optimized 1.0.0, and fixed known bugs, it supports one-click upgrade from 1.0.0 to 1.0.1, please refer to the [Upgrade Guide](../../installation/upgrade).

## About Advanced Edition 1.0.1

### Notable Changes and Optimization in 1.0.1

- When updating a StatefulSet, its associated services can be edited simultaneously.
- When updating a resource, the contents of the subpage will have a save prompt.
- Nomalized the unit of CPU and memory quota when creating and editing projects.
- Allow users to add quotas for projects that don't have a CPU and memory quota.
- Added Verification of the credentials information integrity under the DevOps project.
- Support interface language setting in nomal user level.
- Allow the modification of a "NodePort" type service to "None".
- Allow change passwords on the User Settings page.
- Multiple user experience optimizations, including container editing UI and enabling input parameters, update strategies, container logs, etc.

### Bug Fixed in 1.0.1

- Fixed the issue where the role of workspaces-manager can't view the list of workspaces after sign in.
- Fixed the passing parameters issue of GIt repository credentials.
- Fixed the notification issue that there was no user login failure.
- Fixed the problem with data remanence in deleted app.
- Fixed parameter display issues in some Helm app profiles.
- Fixed Horizontal Pod AutoScaler (HPA) display issues for users with different authorities.
- Fixed an issue where modifying the route Hosts parameter does not take effect in some scenarios.
- Corrected multiple Chinese and English copywriting.


### Kubernetes on KubeSphere

- Kubernetes v1.12.3 can be upgraded to [Kubernetes 1.12.5](https://github.com/kubernetes/kubernetes/releases/tag/v1.12.5) and supports upgrade to v1.13.2 as well.
- Etcd supports upgrade to v3.2.24.

### Security

- Support verification code to prevent login attacks.
- Increased the confirmation prompt before the resource is deleted.