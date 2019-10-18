---
title: "Port Requirements"
keywords: ''
description: ''
---


When deploying KubeSphere in VM, certain ports on your nodes must be open to allow communication with KubeSphere. 

Suggest you to disable and stop the firewall, instead, if your network configuration uses an firewall，you must ensure infrastructure components can communicate with each other through specific ports that act as communication endpoints for certain processes or services. The following diagram depicts the ports that should be opened before installation.

|Service |Protocol|Action|Start Port|End Port|Comment|
|---|---|---|---|---|---|
ssh|TCP|allow|22|
etcd|TCP|allow|2379|2380|
apiserver|TCP|allow|6443|
calico|TCP|allow|9099|9100|
bgp|TCP|allow|179||
nodeport|TCP|allow|30000|32767|
master|TCP|allow|10250|10258|
dns|TCP|allow|53|
dns|UDP|allow|53|
local-registry|TCP|allow|5000||Offline environment|
local-apt|TCP|allow|5080||Offline environment|
rpcbind|TCP|allow|111|| When using NFS as storage server
ipip|IPIP|allow| | |Calico needs to allow the ipip protocol