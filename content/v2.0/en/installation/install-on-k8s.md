---
title: "Install on Kubernetes (Online)" 
keywords: ''
description: ''
---

## Prerequisites

This guide is for online installation, make sure your Kubernetes cluster meets the prerequisites below, see [Prerequisites](../prerequisites) for more details.

> - Kubernetes Version: from `1.13.0` to `1.15.x`
> - Helm Version: `>= 2.10.0`
> - Available Memory: `>= 10 G`
> - Already have Storage Class (Recommended)

## Installing KubeSphere

1. You need to create 2 namespaces in Kubernetes cluster, namely, `kubesphere-system` and `kubesphere-monitoring-system`.

```
$ cat <<EOF | kubectl create -f -
---
apiVersion: v1
kind: Namespace
metadata:
    name: kubesphere-system
---
apiVersion: v1
kind: Namespace
metadata:
    name: kubesphere-monitoring-system
EOF
```

2. Create a Secret of CA certificate of your current Kubernetes cluster.

> Attention: Follow the certificate paths of `ca.crt` and `ca.key` to create this secret.


```bash
kubectl -n kubesphere-system create secret generic kubesphere-ca  \
--from-file=ca.crt=/etc/kubernetes/pki/ca.crt  \
--from-file=ca.key=/etc/kubernetes/pki/ca.key
```

3. Create an ETCD‘s Secret of certificate.

> Attention: Create the secret according to the your actual path for the k8s cluster;


- If the ETCD has been configured with certificates, refer to the following step:

```bash
$ kubectl -n kubesphere-monitoring-system create secret generic kube-etcd-client-certs  \
--from-file=etcd-client-ca.crt=/etc/kubernetes/pki/etcd/ca.crt  \
--from-file=etcd-client.crt=/etc/kubernetes/pki/etcd/healthcheck-client.crt  \
--from-file=etcd-client.key=/etc/kubernetes/pki/etcd/healthcheck-client.key
```

- If the ETCD has been not configured with certificates, create an empty Secret (The following command is suitable for Kubernetes cluster created by Kubeadm):

```bash
$ kubectl -n kubesphere-monitoring-system create secret generic kube-etcd-client-certs
```

4. Clone the repository to Kubesphere-installer to local.

```bash
$ git clone https://github.com/kubesphere/ks-installer.git
```

5. Enter into ks-installer. Then install KubeSphere on existing Kubernetes cluster.


```bash
$ cd deploy

$ vim kubesphere-installer.yaml   
# According to the parameter table at the bottom, replace the value of "kubesphere-config" in "kubesphere-installer.yaml" file with your current Kubernetes cluster parameters (If the ETCD has no certificate, set etcd_tls_enable: False).

$ kubectl apply -f kubesphere-installer.yaml
```

6. Inspect the logs of installer, waiting for the successful logs appear.

```bash
kubectl logs -n kubesphere-system $(kubectl get pod -n kubesphere-system -l job-name=kubesphere-installer -o jsonpath='{.items[0].metadata.name}') -f
```

7. Finally, check console's service port. Use `IP:30880` to visit KubeSphere login page. The default cluster administration account is `admin/P@88w0rd`.

```bash
$ kubectl get svc -n kubesphere-system | grep 30880
# Inspect the NodePort of ks-console, it's 30880 by default.
```

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191018202538.png)



## Parameter Table

<table border=0 cellpadding=0 cellspacing=0 width=1164 style='border-collapse:
 collapse;table-layout:fixed;width:1023pt;font-variant-ligatures: normal;
 font-variant-caps: normal;orphans: 2;text-align:start;widows: 2;-webkit-text-stroke-width: 0px;
 text-decoration-style: initial;text-decoration-color: initial'>
 <col width=112 style='mso-width-source:userset;mso-width-alt:3982;width:84pt'>
 <col width=156 style='mso-width-source:userset;mso-width-alt:5546;width:117pt'>
 <col width=757 style='mso-width-source:userset;mso-width-alt:26908;width:568pt'>
 <col width=339 style='mso-width-source:userset;mso-width-alt:12060;width:254pt'>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 class=xl67 width=268 style='height:13.8pt;width:140pt'>Parameter</td>
  <td class=xl65 width=757 style='width:568pt'><span style='font-variant-ligatures: normal;
  font-variant-caps: normal;orphans: 2;widows: 2;-webkit-text-stroke-width: 0px;
  text-decoration-style: initial;text-decoration-color: initial'>Description</span></td>
  <td class=xl65 width=139 style='width:154pt'><span style='font-variant-ligatures: normal;
  font-variant-caps: normal;orphans: 2;widows: 2;-webkit-text-stroke-width: 0px;
  text-decoration-style: initial;text-decoration-color: initial'>Default</span></td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>kube_apiserver_host</td>
  <td>The address of kube-apiserver of your current Kubernetes cluster（i.e. IP:NodePort）</td>
  <td class=xl69></td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>etcd_tls_enable</td>
  <td>Whether to enable etcd TLS certificate authentication（True / False）</td>
  <td class=xl69>True</td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 class=xl66 style='height:13.8pt'>etcd_endpoint_ips</td>
  <td>Etcd addresses, such as ETCD clusters, you need to separate IPs by commas（e.g.192.168.0.7,192.168.0.8,192.168.0.9）</td>
  <td class=xl69></td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>etcd_port</td>
  <td>ETCD Port (2379 by default, you can configure this parameter if you are using another port)</td>
  <td class=xl69>2379</td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>disableMultiLogin<span
  style='mso-spacerun:yes'>&nbsp;</span></td>
  <td>Whether to turn off multipoint login for accounts<span style='mso-spacerun:yes'>&nbsp;&nbsp; </span>（True / False）</td>
  <td class=xl69>True</td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>elk_prefix</td>
  <td>Logging index<span style='mso-spacerun:yes'>&nbsp;</span></td>
  <td class=xl69>logstash<span style='mso-spacerun:yes'>&nbsp;</span></td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>keep_log_days</td>
  <td>Log retention time (days)</td>
  <td class=xl69>7</td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>metrics_server_enable</td>
  <td>whether to install metrics_server<span style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;
  </span>（True / False）</td>
  <td class=xl69>True</td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>sonarqube_enable</td>
  <td>whether to install Sonarqube<span
  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>（True / False）</td>
  <td class=xl69>True</td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>istio_enable</td>
  <td>whether to install Istio<span
  style='mso-spacerun:yes'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  </span>（True / False）</td>
  <td class=xl69>True</td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td rowspan=2 height=36 class=xl68 style='height:27.6pt'>persistence</td>
  <td class=xl66>enable</td>
  <td>Whether the persistent storage server is enabled<span style='mso-spacerun:yes'>&nbsp;&nbsp; </span>（True / False）（It is recommended tp enable persistent storage in a formal environment）</td>
  <td class=xl69></td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td height=18 class=xl66 style='height:13.8pt'>storageClass</td>
  <td>Enabling persistent storage requires that the storageClass has been created already in the cluster (The default value is empty, which means it'll use default StorageClass)</td>
  <td class=xl69>“”</td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>containersLogMountedPath（Optional）</td>
  <td>Mount path of container logs</td>
  <td class=xl69>"/var/lib/docker/containers"</td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>external_es_url（Optional）</td>
  <td>External Elasticsearch address, it supports integrate your external ES or install internal ES directly. If you have ES, you can directly integrate it into KubeSphere</td>
  <td class=xl69></td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>external_es_port（Optional）</td>
  <td>External ES port, supports integrate external ES</td>
  <td class=xl69></td>
 </tr>
 <tr height=18 style='height:13.8pt'>
  <td colspan=2 height=18 style='height:13.8pt'>local_registry (Offline installation only)</td>
  <td>Integrate with the local repository when deploy on offline environment（To use this parameter, import the installation image into the local repository using "scripts/downloader-docker-images.sh"）</td>
  <td class=xl69></td>
 </tr>
 <![if supportMisalignedColumns]>
 <tr height=0 style='display:none'>
  <td width=112 style='width:84pt'></td>
  <td width=156 style='width:117pt'></td>
  <td width=757 style='width:568pt'></td>
  <td width=339 style='width:254pt'></td>
 </tr>
 <![endif]>
</table>



**Future Plan**

- Support multiple public cloud network plugins and storage plugins
- Decouple component. Use pluggable design to lighten the installation and improve resource efficiency.
