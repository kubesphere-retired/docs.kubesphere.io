---
title: "Preparing the Development Environment"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

## Go

KubeSphere development is based on [Kubernetes](https://github.com/kubernetes/kubernetes), both of them are written in [Go](http://golang.org/). If you don't have a Go development environment, please [set one up](http://golang.org/doc/code.html).

| Kubernetes     | requires Go |
|----------------|-------------|
| 1.13+          | >= 1.12     |

> Tips: 
> - Ensure your GOPATH and PATH have been configured in accordance with the Go
environment instructions. 
> - It's recommended to install [macOS GNU tools](https://www.topbug.net/blog/2013/04/14/install-and-use-gnu-command-line-tools-in-mac-os-x) for Mac OS.

## Docker

KubeSphere components are often deployed as containers in Kubernetes. If you need to rebuild the KubeSphere components in the Kubernetes cluster, you will need to [install Docker](https://docs.docker.com/install/).


## Dependency management

KubeSphere uses [Go Modules](https://github.com/golang/go/wiki/Modules) to manage dependencies in the `vendor/` tree.

### Dependencies

[kubesphere/kubesphere](https://github.com/kubesphere/kubesphere) repository contains the source code . If you're looking for its dependent components, they live in their own repositories since they can be individual and universal.

> - [Alert](https://github.com/kubesphere/alert): Alert is an enterprise-grade general-purpose high-performance alerting system.
> - [Notification](https://github.com/openpitrix/notification): Notification is an enterprise-grade general-purpose high-performance notification system, it provides email notification service for KubeSphere currently.
> - [OpenPitrix](https://github.com/openpitrix/openpitrix): Application management platform on multi-cloud environment, it provides application template and application management for KubeSphere currently.
> - [SonarQube](https://github.com/SonarSource/sonarqube): Integrated in KubeSphere DevOps, it provides the capability to not only show health of an application but also to highlight issues newly introduced. 