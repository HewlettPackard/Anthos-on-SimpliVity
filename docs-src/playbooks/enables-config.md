# Enabling/disabling specific features

You can customize the `site.yml` deployment using variables to control what features are enabled:

|Variable|File|Description|
|:-------|:---|:----------|
|`gke_admin_workstation`<br>`.alt_vcenter.enable`|inventory/group_vars/all/all.yml|Set to `true` if you want to deploy your GKE Admin Workstation to a different vSphere infrastructure than that used for the admin and user clusters. Defaults to `false`|
|`create_admin_cluster`|inventory/group_vars/all/all.yml|Defaults to `true`|
|`create_user_cluster`|inventory/group_vars/all/all.yml|Defaults to `true`|
|`enable_config_check`|inventory/group_vars/all/all.yml|Flag for the `gkectl check-config` execution. It is recommended that you run these checks at least the first time. Defaults to `true`|
|`gkectl_run_prepare`|inventory/group_vars/all/all.yml|Defaults to `true`|
|`proxy_enabled`|inventory/group_vars/all/all.yml|Proxy configuration used for the Ansible controller, the admin workstation, and the admin and user clusters. Defaults to `false`|
|`private_docker_registry`|inventory/group_vars/all/all.yml|Private Docker registry for hosting GKE images. Defaults to `false`|


A sample deployment specification is shown below:

```
cat enables.yml

---
proxy_enabled: false
private_docker_registry: false
enable_config_check: false
gkectl_run_prepare: false
create_admin_cluster: false
create_user_cluster: true
```


## Command

To use the deployment specification, use a command similar to the following: 

```
cd ~/Anthos-on-SimpliVity

ansible-playbook site.yml --ask-vault-pass -e “@./enables.yml”
```


## gkectl flags

A number of variables are available to help customize the various `gkectl` commands:


|Variable|File|Description|
|:-------|:---|:----------|
|`gkectl_check_flags`|inventory/group_vars/all/all.yml|Flags for the `gkectl check-config` command<br>Defaults to `'--fast'`|
|`gkectl_prepare_flags`|inventory/group_vars/all/all.yml|Flags for the `gkectl prepare` command<br>Defaults to `'--skip-validation-all'`|
|`gkectl_create_flags`|inventory/group_vars/all/all.yml|Flags for the `gkectl create cluster` command<br>Defaults to `'--skip-validation-all'`|

More details on the options available for these flags are documented in the GKE on-prem reference documentation:

- [gkectl check-config](https://cloud.google.com/anthos/gke/docs/on-prem/reference/gkectl/check-config)
- [gkectl prepare](https://cloud.google.com/anthos/gke/docs/on-prem/reference/gkectl/prepare)
- [gkectl create](https://cloud.google.com/anthos/gke/docs/on-prem/reference/gkectl/create)
