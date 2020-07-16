# Create GCP keys (optional)

This utility playbook can be used to automatically generate the required key files.

## Prerequisites

- Configure proxy, if required
- `ssh` keys in `anthos_secrets` directory
- Whitelisted key in `anthos_secrets` directory

## Command

```
cd ~/Anthos-on-SimpliVity

ansible-playbook playbooks/gcp_key_create.yml  --ask-vault-pass
```

## Tasks performed

- Generates multiple `json` files, with names as defined in `playbooks\roles\gke_cluster_config\create_gke_cluster\defaults\main.yml`

## Post deployment

The following files are generated in the `<<anthos_secrets>>` folder on the Ansible controller:

- `connect-register-key.json`
- `connect-agent-key.json`
- `audit-logging-key.json`
- `logging-monitoring-key.json`
- `usage-metering-key.json` (Optional)
