# Deploying the admin workstation

The playbook `playbooks/deploy_admin_wrkst.yml` will deploy the admin workstation.

## Prerequisites

- F5 deployed
- Admin workstation configuration as described in the section [Configuring the admin workstation](../config-core/admin-workstation-config)


## Command

```
cd ~/Anthos-on-SimpliVity

ansible-playbook playbooks/deploy_admin_wrkst.yml  --ask-vault-pass
```

## Tasks performed

If admin workstation does not already exist:

- Create input file for gkeadm for creating GKE Admin workstation
    `<<secrets_path>>/admin-ws-config-<<gke_admin_workstation.name>>.yaml`
- If `gkeadm_ova_path` is specified, use that OVA otherwise download OVA
- Deploy admin workstation using `gkeadm` and the generated config file and `ansible_ssh_private_key_file`
