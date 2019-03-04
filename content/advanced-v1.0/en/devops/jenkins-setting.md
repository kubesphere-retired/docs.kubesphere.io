---
Title: "Jenkins System Settings"
---

Jenkins is powerful and flexible thus it has become the de facto standard for CI/CD, with an active community to maintain plug-ins for almost any combination of tools and use cases. But flexibility comes at a price: because in addition to the Jenkins core, many plugins require some system-level configuration to get the job done.

KubeSphere's DevOps project is based on Jenkins for containerized CI / CD functionality. To provide users with a schedulable Jenkins environment, KubeSphere uses **Configuration-as-Code** for Jenkins system setup, which requires the user to log in to Jenkins Dashboard's system management after KubeSphere modifies the configuration file. load. In the current release, Jenkins' system setup options are not yet available in the console and will be supported in subsequent releases.

### Modify ConfigMap

If you are a system administrator for KubeSphere, if you need to modify the Jenkins system configuration, it is recommended that you use Configuration-as-Code (CasC) for system setup in KubeSphere. You need to modify `jenkins-casc- in KubeSphere configuration (ConfigMap) first. Config`, then log in to Jenkins Dashboard to perform **reload**. (Because system settings written directly through Jenkins Dashborad may be overwritten by CasC configuration after Jenkins rescheduling).

The built-in Jenkins CasC file is stored in `/system-workspace/kubesphere-devops-system/configmaps/jenkins-casc-config/` as **ConfigMap**, as shown below, if you need to modify it, click ** Edit ConfigMap**.

![configmap setting](/jenkins-setting-configmap.png)

The configuration template for jenkins-casc-config is a yaml type file as shown below. For example, you can modify the container image, label, etc. in the broker (Kubernetes Jenkins agent) in ConfigMap or add a container in the podTemplate.

![yaml template file](/jenkins-casc.png)

After KubeSphere modifies **jenkins-casc-config**, you need to reload your updated system configuration on the **configuration-as-code** page under Jenkins Dashboard System Management.

### Login Jenkins Reload

1. The Installer installation will deploy Jenkins Dashboard at the same time. Jenkins has docked KubeSphere's LDAP, so you can log in to Jenkins Dashboard with the username `admin` and the KuebSphere cluster administrator's password to access the public IP (EIP) + Nodeport (30180). And landing on the Jenkins Dashboard. After logging in, click `System Management` in the left navigation bar.

> Note: Accessing the Jenkins Dashboard may require port forwarding and firewalls to be released on the public network for access.

![System Management](/jenkins-setting-1.png)

2. Find `Configuration as Code` at the bottom of the console and click Enter.

![Configuration as Code](/jenkins-setting-2.png)

3. Click `Reload` in the Configuration as Code section to reload and update the system configuration modified in KubeSphere's ConfigMap to the Jenkins Dashboard.

![Configuration as Code](/jenkins-setting-3.png)


For details on how to set up the system via CasC, see [Official Documentation] (https://github.com/jenkinsci/configuration-as-code-plugin).

> Note: In the current version, not all plugins support CasC settings. CasC will only override plugin configurations that are set up using CasC.