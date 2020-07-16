# VMware configuration



Sensitive values are stored and encrypted in the vault file `inventory/group_vars/all/vault.yml` and then referenced from the variables file.

|Variable|File|Description|
|:-------|:---|:----------|
|`vault_vcenter_username`|**inventory/group_vars/all/vault.yml**|A vCenter Server user account. It might include a domain, for example, `'Administrator`<br>`@vsphere.local'`. The user account should have the Administrator role or equivalent privileges.|
|`vault_vcenter_password`|**inventory/group_vars/all/vault.yml**|The password for the `vault_vcenter_username` user.|

All remaining variables related to VMware configuration are described in the table below.

|Variable|File|Description|
|:-------|:---|:----------|
|`vcenter.address`|inventory/group_vars/all/all.yml|IP or hostname of the vCenter appliance. For example, `vcentergen10.am2.cloudra.local`|
|`vcenter.username`|inventory/group_vars/all/all.yml|Uses the value of the `vault_vcenter_username` variable from the vault|
|`vcenter.password`|inventory/group_vars/all/all.yml|Uses the value of the `vault_vcenter_password` variable from the vault|
|`vcenter.datacenter`|inventory/group_vars/all/all.yml|Name of the datacenter where the environment will be provisioned. For example, `Datacenter`|
|`vcenter.datastore`|inventory/group_vars/all/all.yml|The datastore for storing VMs. For example, `ds1`|
|`vcenter.cluster`|inventory/group_vars/all/all.yml|Name of your SimpliVity Cluster as defined in vCenter.|
|`vcenter.network`|inventory/group_vars/all/all.yml|The name of the vSphere network where you want to create your admin workstation.|
|`vcenter.resourcepool`|inventory/group_vars/all/all.yml| If you are using a non-default resource pool, provide the name of your vSphere resource pool. For example, `Anthos_1.4` |
|`vcenter.cacert`|inventory/group_vars/all/all.yml|When a client, like GKE on-prem, sends a request to your vCenter server, the server must prove its identity to the client by presenting a certificate or a certificate bundle. To verify the certificate or bundle, GKE on-prem must have the root certificate in the chain of trust.<br><br>This field contains the name of the file, for example `vcenter.pem`  and the file must be present in directory defined by `secrets_path`.|

## Generating the `vcenter.pem` file

Enter the following command to download the certificate and save it to a file named vcenter.pem.

```
true | openssl s_client -connect [VCENTER_IP]:443 -showcerts 2>/dev/null | sed -ne '/-BEGIN/,/-END/p' > vcenter.pem
```

where [VCENTER_IP] is the IP address of your vCenter Server.


## Determine `vcenter.address`

Before you fill in the `vcenter.address` field, inspect the serving certificate of your vCenter server.
Open the `vcenter.pem` certificate file to see the Subject Common Name and the Subject Alternative Name:

```
openssl x509 -in vcenter.pem -text -noout
```

The output shows the Subject Common Name (CN). This might be an IP address, or it might be a hostname. For example:

```
Subject: ... CN = 203.0.113.100

Subject: ... CN = my-host.my-domain.example
```

The output might also include one or more DNS names under Subject Alternative Name:

```
X509v3 Subject Alternative Name:
    DNS:vcenter.my-domain.example
```

Choose the Subject Common Name or one of the DNS names under Subject Alternative Name to use as the value of `vcenter.address` in your configuration file. For example:

```
vcenter:
  address: "203.0.113.1"
  ...
```
or alternatively:

```
vcenter:
  address: "my-host.my-domain.example"
  ...
```


## Sample `vcenter` structure

```yaml
vcenter:
  address: '10.1.223.196'
  username: "{{ vault_vcenter_username }}"
  password: "{{ vault_vcenter_password }}"
  datacenter: 'Datacenter'
  datastore: 'ds1'
  cluster: "New_Cluster"
  network: 'VM Network 2'
  resourcepool: 'Anthos_1.4'
  cacert: 'vcenter.pem' # Must be in directory defined by 'secrets_directory'
```
