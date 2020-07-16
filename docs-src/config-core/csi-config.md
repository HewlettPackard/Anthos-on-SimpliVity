# CSI configuration

An overview of the HPE SimpliVity CSI driver is available in the section [HPE SimpliVity Container Storage Interface (CSI) driver for vSphere](../soln-overview/simplivity-csi-overview).

## User cluster storage configuration

Configuration for CSI storage is specified on a cluster-by-cluster basis, in the `all.yml` configuration file, 
using fields in the cluster definition structure  `gke_cluster_config`
structure. For each user cluster, you can specify a storage class and configure a datastore:


|Field|Description|Value|
|:-------|:---|:----------|
|`csi_storageclass_name`|The name of the storage class to use for the user cluster|For example, `'gmcg-svt-sc'`|
|`csi_datastore_name`|The datastore name to be created, if it does not already exist|For example, `'gmcg-gke-csi1'`|
|`csi_datastore_size`|The size in gigabytes for the datastore|For example, `'20'`|


An example for CSI configuration in a user cluster is shown below:

```
gke_cluster_config:
    - name: 'user-cluster-1'
      type: 'user'
      ...
      csi_storageclass_name: 'gmcg-svt-sc'
      csi_datastore_name: 'gmcg-gke-csi1'
      csi_datastore_size: '20'
```

## Default values

The default values for CSI configuration are specified in the file `playbooks/roles/gke_cluster_config/csi/defaults/main.yml`. The following are the values used, at the time of writing:


```
csi_driver: hpesvt
svt_csi_driver_image: hpesimplivity/vsphere-csi-driver:v1.0-rc2
svt_csi_syncer_image: hpesimplivity/vsphere-csi-syncer:v1.0-rc2
simplivity_username: "{{ vcenter.username }}"
simplivity_password: "{{ vcenter.password }}"
```