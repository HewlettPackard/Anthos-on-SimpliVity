# Deploying admin and user clusters

The playbook `playbooks/create_cluster.yml` will create admin and/or user clusters as specified in your configuration file.

**Note:** If you have already have a working admin cluster and want to add a user cluster, then set `'create_admin_cluster: false'` before running playbook `playbooks/create_cluster.yml`.

## Prerequisites

- F5 deployed
- Admin workstation deployed
- Admin and/or user cluster configured as described in the section [Configuring admin and user clusters](../config-core/admin-user-clusters-config)

## Command

```
cd ~/Anthos-on-SimpliVity

ansible-playbook playbooks/create_cluster.yml  --ask-vault-pass
```

## Monitoring GKE Cluster Creation

You can monitor the cluster creation logs using the script `cluster-watch.py` in the `scripts` directory. To execute the program:

- Open a new terminal session on Ansible controller
- Source the same python virtual environment as you did for Ansible
- run `cluster-watch.py`

The script uses the Linux `lnav` program to tail the log files created during the GKE cluster creation.

## Tasks

- Copy Anthos Secrets to <<gkeadm_basedir>>/<<secrets_directory>>
- Run `gkectl prepare` to initialize vSphere Environment for Anthos GKE on-prem - depends on flag `gkectl_run_prepare`
- Run `gkectl check-config` to check Anthos GKE on-prem Admin Cluster Configuration - depends on flag `enable_config_check`
- Run `gkectl create cluster` to create Anthos GKE on-prem Admin Cluster
- Check Anthos GKE on-prem User Cluster Configuration
- Create Anthos GKE on-prem User Cluster


```
ls ~/anthos_secrets/

admin-ws-config-gke-adm-gmcg.yaml  logging-monitoring-key.json  vsphere_workstation.pub
audit-logging-key.json             usage-metering-key.json      whitelisted-key.json
connect-agent-key.json             vcenter.pem
connect-register-key.json          vsphere_workstation
```


```
ls cluster-configurations/

admin-ip.yaml  admin.yaml  gmcg-gke-usercluster-1-ip.yaml  gmcg-gke-usercluster-1.yaml
```

## Outputs

- <<gkeadm_basedir>>/cluster-configurations  
- <<gkeadm_basedir>>/kubeconfigs


# Post-deployment

[https://cloud.google.com/anthos/gke/docs/on-prem/reference/cheatsheet](https://cloud.google.com/anthos/gke/docs/on-prem/reference/cheatsheet)
