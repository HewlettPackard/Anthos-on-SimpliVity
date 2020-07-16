# Configuring the admin workstation


## Admin workstation OVA

On the first deployment of the admin workstation, the playbooks will download the workstation OVA and store it in the <<output_directory>> (see the section [Output files](output-files)).

If you want to use a local copy of the OVA, set the variable `gkeadm_ova_path` to point to the downloaded file.
If defined and the value is valid, `gkeadm` will use this file. If empty or invalid, `gkeadm` will download the OVA into
the directory defined by the variable `output_directory`.

|Variable|File|Description|
|:-------|:---|:----------|
|`gkeadm_ova_path`|inventory/group_vars/all/all.yml|Location on the Ansible controller for OVA|


## General config

The following fields in the `gke_admin_workstation` structure provide general configuration for the admin workstation:

|Variable|File|Description|
|:-------|:---|:----------|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.name`|inventory/group_vars/all/all.yml|The name to use for your admin workstation.<br>For example, `'gke-adm-test'`|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.cpus`|inventory/group_vars/all/all.yml|The number of virtual CPUs for your admin workstation. <br>For example, `'4'`|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.memoryMB`|inventory/group_vars/all/all.yml|The number of megabytes of memory for your admin workstation. <br>For example, `'8192'`|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.diskGB`|inventory/group_vars/all/all.yml|The number of gigabytes of virtual disk space for your admin workstation. Must be at least 50. <br>For example, `'100'`|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.datadiskMB`|inventory/group_vars/all/all.yml|The number of megabytes for the data disk for your admin workstation. Must be at least 512. <br>For example, `'1024'`|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.ntpServer`|inventory/group_vars/all/all.yml|The hostname or IP address of the Network Time Protocol server that your admin workstation should use. <br>For example, `'http://16.100.211.43:8888'`|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.ssh_private_key`|inventory/group_vars/all/all.yml|The name of the SSH keypair to be deployed to GKE Admin Workstation. <br>For example, `'vsphere_workstation'`. <br><br>For more information, see the section [Input files](input-files).|

## Networking config

The following fields in the `gke_admin_workstation` structure provide networking configuration for the admin workstation:

|Variable|File|Description|
|:-------|:---|:----------|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.ipAllocationMode`|inventory/group_vars/all/all.yml|One of `'dhcp'` or `'static'`. If you choose `'static'`, you must set the following following variables.|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.ip`|inventory/group_vars/all/all.yml|An IP address of your choice for your admin workstation. <br>For example, `'192.168.1.10'`.|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.gateway`|inventory/group_vars/all/all.yml|The IP address of the default gateway for the network that contains your admin workstation. <br>For example, `'192.168.1.1'`.|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.netmask`|inventory/group_vars/all/all.yml|The netmask for the network that contains your admin workstation. <br>For example, `'255.255.255.0'`.|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.dns`|inventory/group_vars/all/all.yml| An array of IP addresses for DNS servers that your admin workstation can use. <br>For example,<br><br>&#160;&#160;- "172.16.255.1"<br>&#160;&#160;- "172.16.255.2" |


## Alternative vCenter

If you want to deploy your GKE Admin Workstation to a different vSphere infrastructure than that used for the admin and user clusters, then you must configure a second set of variables using the 
`gke_admin_workstation.alt_vcenter` structure:

|Variable|File|Description|
|:-------|:---|:----------|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.alt_vcenter.enable`|inventory/group_vars/all/all.yml|Choose if you want to deploy the admin workstation to different infrastructure. <br>Defaults to `false`|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.alt_vcenter.address`|inventory/group_vars/all/all.yml|IP or hostname of the vCenter appliance. <br>For example, `vcentergen10.am2.cloudra.local`|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.alt_vcenter.username`|inventory/group_vars/all/all.yml|Uses the value of the `vault_vcenter_username` variable from the vault|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.alt_vcenter.password`|inventory/group_vars/all/all.yml|Uses the value of the `vault_vcenter_password` variable from the vault|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.alt_vcenter.datacenter`|inventory/group_vars/all/all.yml|Name of the datacenter where the environment will be provisioned. <br>For example, `Datacenter`|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.alt_vcenter.datastore`|inventory/group_vars/all/all.yml|The datastore for storing VMs. <br>For example, `ds1`|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.alt_vcenter.cluster`|inventory/group_vars/all/all.yml|Name of your SimpliVity Cluster as defined in vCenter.|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.alt_vcenter.network`|inventory/group_vars/all/all.yml|The name of the vSphere network where you want to create your admin workstation.|
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.alt_vcenter.resourcepool`|inventory/group_vars/all/all.yml| If you are using a non-default resource pool, provide the name of your vSphere resource pool. <br>For example, `Anthos_1.4` |
|`gke_admin_workstation` <br>&#160;&#160;&#160;`.alt_vcenter.cacert`|inventory/group_vars/all/all.yml|When a client, like GKE on-prem, sends a request to your vCenter server, the server must prove its identity to the client by presenting a certificate or a certificate bundle. To verify the certificate or bundle, GKE on-prem must have the root certificate in the chain of trust.<br><br>This field contains the name of the file, for example `gke_admin_workstation.alt_vcenter.pem`  and the file must be present in directory defined by `secrets_directory`.|

