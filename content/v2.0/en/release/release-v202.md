---
title: "Release Notes For 2.0.2"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

KubeSphere 2.0.2 was released on July 9, 2019, which has fixed known bugs and enhanced existing feature. The latest version of KubeSphere 2.0.2 is recommended. If you have installed versions of 1.0.x, 2.0.0 or 2.0.1, please download KubeSphere installer v2.0.2 to upgrade.


## What's New in 2.0.2

### Enhanced Features

- [API docs](/v2.0/zh-CN/api-reference/api-docs/) are available on the official website.
- Block brute-force attacks.
- Standardize the maximum length of resource names.
- Upgrade the gateway of Project (Ingress Controller) to the version of 0.24.1. Support Ingress's grayscale release.


## List of Fixed Bugs

- Fixed the issue that traffic topology displays resources outside of this project.
- Fixed the extra service component issue from traffic topology under specific circumstances.
- Fixed the execution issue when "Source to Image" reconstructs images under specific circumstances.
- Fixed the page display problem led by failed "Source to Image" job. 
- Fixed the  log checking problem when Pod status is abnormal. 
- Fixed the issue that disk monitor cannot detect some types of volume mounting, such as LVM volume.
- Fixed the problem of detecting  deployed applications.
- Fixed incorrect judgement of application component status.
- Fixed  host node's number calculation errors.
- Fixed input data loss caused by switching reference configuration buttons when adding environmental variables, 
- Fixed the rerun job issue that the Operator role cannot execute.
- Fixed the initialization issue on IPv4 environment uuid.
- Fixed the issue that the log detail page cannot be scrolled down to check past logs.
- Fixed wrong APIServer addresses in KubeConfig files.
- Fixed the issue that DevOps project's name that cannot be changed.
- Fixed the issue that container logs cannot specify query time.
- Fixed the saving problem on relevant repository's secrets under certain circumstances.
- Fixed the issue that application's service component creation page does not have image registry's secrets.

