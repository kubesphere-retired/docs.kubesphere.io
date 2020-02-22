---
title: "Pipeline"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

Pipeline is a suite of plugins which supports implementing and integrating continuous delivery pipelines into Jenkins. A CD pipeline is an automated expression of your process for getting software from version control right through to your users and customers. Every change to your software (committed in source control) goes through a complex process on its way to being released.

The syntax for defining a Pipeline, either in the web UI or with a Jenkinsfile is the same, but it's kind of difficult for users who are not familiar with Jenkinsfile. To reduce the learning curve for Jenkinsfile syntax, KubeSphere provides a visual editor that allows users to simply enter a few configuration information on the web UI and it will automatically generate the pipeline and Jenkinsfile. You can also edit Jenkinsfile directly, and combine some of the plugins provided by the KubeSphere to customize complex pipelines for more complex scenarios.

## Pipeline Concepts

### Node

A node is a machine which is part of the Jenkins environment and is capable of executing a Pipeline.

### Stage

A stage block defines a conceptually distinct subset of tasks performed through the entire Pipeline (e.g. "Build", "Test" and "Deploy" stages), which is used by many plugins to visualize or present Jenkins Pipeline status/progress.

### Step

A single task. Fundamentally, a step tells Jenkins what to do at a particular point in time (or "step" in the process). For example, to execute the shell command make use the sh step: sh 'make'. When a plugin extends the Pipeline DSL, that typically means the plugin has implemented a new step.

## Create a Pipeline

It allows users to create a pipeline in two ways as following:

- Jenkinsfile-based: It requires users to add source code repository in pipeline, and it already has a Jenkinsfile in the repository. Thus the platform will scan the Jenkinsfile to automatically create a pipeline build process according to branch and PR strategies. This document gives an example to walk you through the basic use of this type, see [Create a Jenkinsfile-based Pipeline](../../quick-start/devops-online).
- Jenkinsfile-free (with graphical editing panel): It does not requires Jenkinsfile in your source code repository, since it supports creating a pipeline with graphical editing panel. This document walks you through the basic use of it, see [Jenkinsfile-free CI/CD pipeline with graphical editing panel](../../quick-start/jenkinsfile-out-of-scm).

Please refer to [Jenkins Pipeline Documentation](https://jenkins.io/doc/book/pipeline/#overview) for further information.

![Create a Pipeline](https://pek3b.qingstor.com/kubesphere-docs/png/20190321151112.png)
