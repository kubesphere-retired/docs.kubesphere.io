---
title: "需开放的端口"
keywords: 'kubernetes, docker, helm, jenkins, istio, prometheus'
description: ''
---

注意，在开始安装前，如果您的服务器所在的网络开启了防火墙，请参考如下列表并根据实际情况开放相关的端口，若没有开启防火墙则无需在主机配置该项内容。

|服务|协议|操作|起始端口|结束端口|备注|
|---|---|---|---|---|---|
|ssh|TCP|allow|22|
|etcd|TCP|allow|2379|2380|
|apiserver|TCP|allow|6443|
|calico|TCP|allow|9099|9100|
|bgp|TCP|allow|179||
|nodeport|TCP|allow|30000|32767|
|master|TCP|allow|10250|10258|
|dns|TCP|allow|53|
|dns|UDP|allow|53|
|local-registry|TCP|allow|5000||离线环境安装|
|local-apt|TCP|allow|5080||离线环境安装|
|rpcbind|TCP|allow|111|| 使用 NFS 作为持久化存储
|ipip|IPIP|allow| | |Calico 需要允许 IPIP 协议 |