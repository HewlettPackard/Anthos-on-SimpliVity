# General prerequisites

This section introduces some general infrastructure considerations related to DHCP, DNS, proxies
and firewalls.

## DHCP, DNS

In Kubernetes, it is important that node IP addresses never change. If a node IP address changes or
becomes unavailable, it can break the cluster. To prevent this, consider using DHCP reservations or
static IP addresses to assign permanent addresses to nodes in your admin and user clusters. Using
DHCP reservations ensures that each node is assigned the same IP addresses after restart or lease
renewal.

## Network Time Protocol

All the VMs that are part of your GKE on-prem infrastructure must use the same Network Time
Protocol (NTP) server.


## Planning your IP addresses


The example configuration in the following sections describe the deployment of Anthos on **three** HPE SimpliVity nodes using `static` IP addresses. 

The following tables give an overview of the IP addresses used in the example configuration:

### Admin workstation

|Role|Variable|Network|Sample IP|
|:-------|:-------|:---|:----------|
|Admin workstation|`gke_admin_workstation.ipAllocationMode`|Internal|10.15.155.200|


### F5 BIG-IP

|Role|Variable|Network|Sample IP|
|:-------|:-------|:---|:----------|
|F5 server|`f5.provider.server`|Management|10.15.159.244|
|F5 internal selfip|`f5.internal_vlan_selfip`|Internal|10.15.155.222|
|F5 external selfip|`f5.external_vlan_selfip`|External|10.15.158.60|


### Admin cluster

|Role|Variable|Network|Sample IP|
|:-------|:-------|:---|:----------|
|Admin API VIP|`gke_cluster_config.cluster_ctrl_vip`|External|10.15.158.61|
|Admin ingress VIP|`gke_cluster_config.cluster_ingress_vip`|External|10.15.158.62|
|Admin cluster master|`gke_cluster_config.gkenode_net.ips[]`|Internal|10.15.155.111|
|Admin cluster master|`gke_cluster_config.gkenode_net.ips[]`|Internal|10.15.155.112|
|Admin cluster master|`gke_cluster_config.gkenode_net.ips[]`|Internal|10.15.155.113|
|User cluster 1 master|`gke_cluster_config.gkenode_net.ips[]`|Internal|10.15.155.114|
|User cluster 2 master|`gke_cluster_config.gkenode_net.ips[]`|Internal|10.15.155.115|

**Note:** For each user cluster, you must allow for a corresponding master node in the admin cluster.


### User cluster

|Role|Variable|Network|Sample IP|
|:-------|:-------|:---|:----------|
|User API VIP|`gke_cluster_config.cluster_ctrl_vip`|External|10.15.158.63|
|User ingress VIP|`gke_cluster_config.cluster_ingress_vip`|External|10.15.158.64|
|User cluster 1 worker|`gke_cluster_config.gkenode_net.ips[]`|Internal|10.15.155.121|
|User cluster 1 worker|`gke_cluster_config.gkenode_net.ips[]`|Internal|10.15.155.122|
|User cluster 1 worker|`gke_cluster_config.gkenode_net.ips[]`|Internal|10.15.155.123|


**Note:** During an upgrade, GKE on-prem creates one temporary node in the admin cluster and one temporary node in each associated user cluster. For your admin cluster and each of your user clusters, before you upgrade, you must verify that you have reserved enough IP addresses. For each cluster, you need to have reserved at least one more IP address than the number of cluster nodes. 
