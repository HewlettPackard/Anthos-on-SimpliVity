# Configuring admin and user clusters

This section describes the configuration required for deploying admin and user clusters. This includes:


- Common variables across all clusters
- Default values that can be over-ridden on a cluster-by-cluster basis
- General cluster configuration
- Configuring static IPs for each cluster


Background reading material  is available at 
[https://cloud.google.com/anthos/gke/docs/on-prem/how-to/admin-user-cluster-basic](https://cloud.google.com/anthos/gke/docs/on-prem/how-to/admin-user-cluster-basic).


## Common variables

The following variables are common across all clusters:


|Variable|File|Description|
|:-------|:---|:----------|
|`gke_bundle_path`|all.yml|The GKE on-prem bundle file contains all of the components in a particular release of GKE on-prem. Set the value of bundlepath to the absolute path of the admin workstation's bundle file.<br>**Do not change.** `'var/lib/gke/bundles/gke-onprem-vsphere-<<anthos_version>>-full.tgz'`|
|`gke_data_disk_name`|all.yml| GKE on-prem creates a virtual machine disk (VMDK) to hold the Kubernetes object data for the admin cluster. The installer creates the VMDK for you, but you must provide a name for the VMDK (the `.vmdk` extension will be added). Any directory in the supplied path must be created before deployment. Not required when adding additional user clusters.<br>For example, `'test-deploy'`.|
|`gke_network_internal`|all.yml|vSphere network for VMs|



## Default configuration

These variables will be used for all clusters unless explicitly overridden in the `gke_cluster_config`:


|Variable|File|Description|
|:-------|:---|:----------|
|`gke_cluster_resource_pool`|all.yml|If you are using a non-default resource pool, provide the name of your vSphere resource pool. Provides a default value for the per-cluster field `resource_pool`. <br><br>For example, `'Anthos_1.4'`|
|`gke_cluster_gcp_region`|all.yml|Provides a default value for the per-cluster fields `logging_metric_gcp_region` and `audit_logging_gcp_region`. <br><br>For example, `'us-east1'`|
|`gke_cluster_antiAffinity_enable`|all.yml|Sets the `antiAffinityGroups.enabled` flag in the user cluster config. <br>Spreads nodes across at least three physical hosts (requires at least three hosts)<br>Defaults to `true`|
|`gke_loadBalancerKind`|all.yml|One of `F5BigIP`, `Seesaw` or `ManualLB`"<br>**Only F5BigIP is currently supported** |
|`enable_vpc`|all.yml|Provides a default value for the per-cluster field `enable_vpc`. Set to `'true'` if you have your cluster's network controlled by a VPC. This ensures that all telemetry flows through Google's restricted IP addresses. <br><br>One of `'true'` or `'false'`|
|`enable_cloudrun`|all.yml|Provides a default value for the per-cluster field `enable_cloudrun`. <br><br>One of `'true'` or `'false'`|


## Cluster configuration

General cluster config is supplied in the fields of the `gke_cluster_config` structure. 
The embedded structure `gke_cluster_config.gkenode_net` is used for configuring networking for each cluster.


## General cluster config `gke_cluster_config`

|Field|Description|Value|
|:-------|:---|:----------|
|`name`|Unique name for the cluster|For example, `usercluster-1`|
|`type`|Type of cluster to be configured|One of `admin` or `user`|
|`loadBalancerKind`|Type of load balancer|One of `F5BigIP`, `Seesaw` or `ManualLB`<br>**Only F5BigIP is currently supported** |
|`f5_partition`|The playbooks for configuring F5 create partitions for the admin and user clusters based on this value.||
|`state`|Whether the F5 partition should exist or not.|One of `present` or `absent`|
|`cluster_ctrl_vip`|Set to the IP address that you have chosen to configure on the load balancer for the Kubernetes API server of the corresponding cluster|For example, `'172.17.0.21'`|
|`cluster_ingress_vip`|Set to the IP address you have chosen to configure on the load balancer for the cluster's ingress service||
|`datastore`|The datastore to use for the cluster. Defaults to the global `vcenter.datastore`|
|`resource_pool`|If you want to use a cluster-specific resource pool, provide the name of your vSphere resource pool |Defaults to value of `gke_cluster_resource_pool`. |
|`cluster_network`|If specified it overwrites the network field in global vCenter configuration||
|`logging_metric_gcp_region`|A GCP region where you would like to store logs and metrics for this cluster.|Defaults to value of `gke_cluster_gcp_region`|
|`audit_logging_gcp_region`|A GCP region where you would like to store audit logs for this cluster.|Defaults to value of `gke_cluster_gcp_region`|
|`enable_vpc`|Set to true if you have your cluster's network controlled by a VPC. This ensures that all telemetry flows through Google's restricted IP addresses.|One of `true` or `false`|
|`enable_cloudrun`|Specify Cloud Run configuration|One of `true` or `false`|

### Configuring  IPs for each cluster

The structure `gke_cluster_config.gkenode_net` is used for configuring networking for each cluster. 


|Field|Description|Value|
|:-------|:---|:----------|
|`gke_cluster_config.gkenode_net.mode`|Config type being specified|One of `dhcp` or `static`|

If you choose `static`, you can configure the static IPs using the other fields in the `gke_cluster_config.gkenode_net`
structure.

You can specify the addresses of the DNS servers (`dns`), time servers (`tod`), and default gateway (`gateway`) and netmask (`netmask`) that the cluster nodes will use.

The `search_domain` field is a string of DNS search domains to use in the cluster. These domains are used as part of a domain search list.

The `ips` field is an array of IP addresses (`ip`) and hostnames (`hostname`). These are the IP addresses and hostnames that Anthos GKE on-prem will assign to the cluster nodes.

A sample structure is shown below:

```
      gkenode_net:
        mode: 'static'
        dns: '192.168.1.1'
        gateway: '192.168.1.1'
        netmask: '255.255.255.0'
        tod: 'hou-ntp1.hcilabs.hpecorp.net'
        search_domain: 'my.local.com'
        ips:
         - ip: 192.168.1.10
           hostname: admin-host1
         - ip: 192.168.1.11
           hostname: admin-host2
         - ip: 192.168.1.12
           hostname: admin-host3
```

## User cluster configuration - master and worker node


Configuration for the master and worker nodes in a user cluster are supplied in the fields of the `gke_cluster_config` structure. 

|Field|Description|Value|
|:-------|:---|:----------|
|`masternode_cpu`|The number of virtual CPUs for the master nodes in the user cluster.|For example, `'6'`|
|`masternode_memory`|The number of megabytes of memory for the master nodes in the user cluster.|For example, `'8192'`|
|`masternode_replicas`|The number of master nodes in the user cluster. User cluster master nodes must have either 1 or 3 replicas.|Default is `'1'`|
|`workernode_cpu`|The number of virtual CPUs for the worker nodes in the user cluster.|Default is `'4'`|
|`workernode_memory`|The number of megabytes of memory for the worker nodes in the user cluster.|Default is `'8192'`|
|`workernode_replicas`|The number of worker nodes in the user cluster. User cluster master nodes must have at least 3 replicas.|Default is `'3'`|


A sample configuration for the worker and master nodes in a user cluster is shown below:

```
      masternode_cpu: '6'
      masternode_memory: '16000'
      masternode_replicas: '1'
      workernode_cpu: '6'
      workernode_memory: '16000'
      workernode_replicas: '4'
```


## User cluster configuration - CSI and Service Mesh

Configuration of the CSI driver for user clusters is documented in the section [CSI configuration](csi-config).

Configuration of the Service Mesh for user clusters is documented in the section [Service Mesh configuration](service-mesh-config).
