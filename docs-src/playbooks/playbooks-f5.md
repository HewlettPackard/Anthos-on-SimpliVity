# Deploying F5

## Prerequisites

- Configuration is complete as outlined in the section [F5 configuration](../config-core/f5-config)
- The playbook `playbooks/get_prereq.yml` has completed successfully

## Command

```
cd ~/Anthos-on-SimpliVity

ansible-playbook playbooks/bigip_anthos.yml  --ask-vault-pass
```

## Tasks performed

- Set hostname of BIG-IP
- Set new admin password
- License BIG-IP using a key
- Add internal VLAN as untagged to interface 1.1
- Add external VLAN as untagged to interface 1.2
- Create Self IP for internal VLAN
- Create Self IP for external VLAN
- Create partition for each cluster
- Provision LTM at nominal level
- Provision MGMT memory to large
- Adjust restjavad memory setting











## Post deployment

