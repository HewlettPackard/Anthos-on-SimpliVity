# F5 configuration

The playbooks do not attempt to deploy F5 BIG-IP, as each installtion will be unique to the customer's environment.

If you are deploying Anthos in a proof-of-concept or demo environment, the following steps can be used to
perform a minimal F5 BIG-IP install.

## Deploying F5 Big-IP Virtual Edition 

- Download the Open Virtual Appliance (OVA) file for  F5 Big-IP Virtual Edition from the F5 website
- Obtain a commercial or temporary licence
- Deploy the OVF Template with 8 CPU, 16 GB 
- Configure the networking: 
    - Internal VLAN corresponding to network configured with  `f5.internal_vlan_name: internal`, `internal_vlan_selfip_name: gke-internal` below
    - External VLAN corresponding to  network configured with `f5.external_vlan_name: external`, `f5.external_vlan_selfip_name: gke-external` below
    - HA VLAN (same  as Internal VLAN above)
    - Management VLAN
- Once the virtual appliance is deployed and powered up, log in to the VM (using the combination `root` / `default` ). 
- If you want to manually set the IP address on the Management VLAN, run the `config` utility and set the IP Address, Netmask and Default Route. Alternatively, if you are using DHCP, determine the assigned IP address in the vSphere client.
- The web UI should be available from your browser using the IP address (log in using the combination `admin` / `admin`).

## General F5 configuration 

General configuration variables for F5 are shown in the following table:

|Variable|File|Description|
|:-------|:---|:----------|
|`f5.provider.user`|inventory/group_vars/all/all.yml|The username to connect to the BIG-IP with. This user must have administrative privileges on the device. For example, `admin`|
|`f5.provider.password`|inventory/group_vars/all/all.yml|The password for the user account used to connect to the BIG-IP. You should store this value in the vault and reference it here.|
|`f5.provider.server`|inventory/group_vars/all/all.yml|The BIG-IP host. For example, `10.1.222.170`|
|`f5.provider.validate_certs`|inventory/group_vars/all/all.yml|`yes` or `no`. If `no`, SSL certificates are not validated. Use this only on personally controlled sites using self-signed certificates.|
|`f5.provider.server_port`|inventory/group_vars/all/all.yml|The BIG-IP server port. Default is `443`|
|`f5.hostname`|inventory/group_vars/all/all.yml|Hostname of the BIG-IP host. For example,|
|`f5.admin_username`|inventory/group_vars/all/all.yml|Name of the user to create or modify.For example, `admin`|
|`f5.admin_password`|inventory/group_vars/all/all.yml|The password to set for the `f5.admin_username` user. <br>**Do not change**. Sets the value to the vault variable `vault_f5_admin_password`.|
|`f5.license.key`|inventory/group_vars/all/all.yml|The registration key to use to license the BIG-IP. <br>**Do not change**. Sets the value of the vault variable `vault_f5_license_key`.|
|`f5.license.state`|inventory/group_vars/all/all.yml|The state of the license on the system. <br>**Do not change** Set the value to `present`.|
|`f5.save`|inventory/group_vars/all/all.yml|**Do not change**. Must be set to `true`.|

## F5 networking config

The variables related to network configuration for F5 are shown in the follwoing table:

|Variable|File|Description|
|:-------|:---|:----------|
|`f5.internal_vlan_name`|inventory/group_vars/all/all.yml|The name of the internal VLAN to manage. For example, `internal`.|
|`f5.internal_vlan_tag`|inventory/group_vars/all/all.yml|Tag number for the internal VLAN. The tag number can be any integer between 1 and 4094. The system automatically assigns a tag number if you do not specify a value. For example, `1700`.|
|`f5.internal_vlan_selfip`|inventory/group_vars/all/all.yml|The IP address for the new self IP. For example, `172.17.0.16`.|
|`f5.internal_vlan_selfip_netmask`|inventory/group_vars/all/all.yml|The netmask for the self IP. Required. For example, `255.255.224.0`.|
|`f5.internal_vlan_selfip_name`|inventory/group_vars/all/all.yml|The name of the self IP to create. If this parameter is not specified, then it will default to the value supplied in the `f5.internal_vlan_selfip` parameter. For example, `gke-internal`.|
||||
|`f5.external_vlan_name`|inventory/group_vars/all/all.yml|The name of the external VLAN to manage. For example, `external`.|
|`f5.external_vlan_tag`|inventory/group_vars/all/all.yml|Tag number for the external VLAN. The tag number can be any integer between 1 and 4094. The system automatically assigns a tag number if you do not specify a value. For example, `1732`.|
|`f5.external_vlan_selfip`|inventory/group_vars/all/all.yml|The IP address for the new self IP. For example, `172.17.32.16`.|
|`f5.external_vlan_selfip_netmask`|inventory/group_vars/all/all.yml|The netmask for the self IP. Required. For example, `255.255.224.0`.|
|`f5.external_vlan_selfip_name`|inventory/group_vars/all/all.yml|The name of the self IP to create. If this parameter is not specified, then it will default to the value supplied in the `f5.external_vlan_selfip` parameter. For example, `gke-external`.|

## F5 partitions

Partitions are created to control other users’ access to BIG-IP objects. More specifically, when a specific set of objects resides in a partition, you can give certain users the authority to view and manage the objects in that partition only, rather than to all objects on the BIG-IP system. This gives a finer granularity of administrative control.

The playbooks for configuring F5 create partitions  for the admin and user clusters. See the documentation
for the `f5_partition` and `state` cluster config variables in the section [Configuring admin and user clusters](admin-user-clusters-config).


## Sample F5 configuration


A summary of the IP addresses used in the documentation samples is shown in the following table:

|Role|Variable|Network|Sample IP|
|:-------|:-------|:---|:----------|
|F5 server|`f5.provider.server`|Management|10.15.159.244|
|F5 internal selfip|`f5.internal_vlan_selfip`|Internal|10.15.155.222|
|F5 external selfip|`f5.internal_vlan_selfip`|External|10.15.158.60|


A sample configuration for F5 is shown below:

```
f5:
  provider:
    user: admin
    password: "{{ vault_f5_admin_password }}"
    server: 10.15.159.244
    validate_certs: no
    server_port: 443

  hostname: gmcg-bigip-gen10.gmcgorg.local
  admin_username: admin
  admin_password: "{{ vault_f5_admin_password }}"

  # Set to true to ensure config is saved to f5. DO NOT CHANGE
  save: true

  internal_vlan_name: internal
  internal_vlan_tag: 2967
  internal_vlan_selfip: 10.15.155.222
  internal_vlan_selfip_netmask: 255.255.255.0

  external_vlan_name: external
  external_vlan_tag: 2970
  external_vlan_selfip: 10.15.158.60
  external_vlan_selfip_netmask: 255.255.255.0
  external_vlan_selfip_name: gke-external

  license:
    - { key: "{{ vault_f5_license_key }}", state: present }
```

## More information

More information on the `provider` structure can be found in the documentation for the Ansible module for 
[Big-IP device information](https://docs.ansible.com/ansible/latest/modules/bigip_device_info_module.html).

See also:<br>
[Manage VLANs on a BIG-IP system](https://docs.ansible.com/ansible/latest/modules/bigip_vlan_module.html)
<br>
[Manage Self-IPs on a BIG-IP system](https://docs.ansible.com/ansible/latest/modules/bigip_selfip_module.html)
