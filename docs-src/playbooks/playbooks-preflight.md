# Pre-deployment validation

You can validate configuration parameters via the `playbooks/preflight.yml` playbook. The playbook attempts to verify that the configuration parameters defined in the `inventory/group_vars/all/all.yml` and `inventory/group_vars/all/vault.yml` files contain appropriate values.

## Command

```
cd ~/Anthos-on-SimpliVity

ansible-playbook playbooks/preflight.yml  --ask-vault-pass
```

## Tasks performed

- Checks access to vCenter (and alternate vCenter if specified)
- Checks resources
    - vCenter datastore and resource pool
    - Per-cluster datastores and resource pools
    - CSI datastores
- Checks for presence of data disk