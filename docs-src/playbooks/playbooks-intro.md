# Running the playbooks


## Activate Python `virtualenv`

Before you run any playbooks, activate your Python `virtualenv` created earlier by `ansible-setup.sh`, for example:

```
source /root/virtualenvs/ansible-296/bin/activate
```

## Pre-deployment validation

Before starting the deployment, it can be useful to validate configuration parameters using the playbook
`playbooks/preflight.yml`. For more details, see the section [Pre-deployment validation](playbooks-preflight).


## Command

Change to the directory where you downloaded the playbooks, as outlined in [Preparing the Ansible controller](../preparing/ansible-controller).  The playbook `site.yml` deploys the entire solution in one go:

```
cd ~/Anthos-on-SimpliVity

ansible-playbook site.yml --ask-vault-pass
```

## Enabling/disabling specific features

If you have certain features configured in your `all.yml` file, you can override the settings when running the playbooks. See the section [Enabling/disabling specific features](../playbooks/enables-config)


## Incremental deployment

As an alternative to running the `site.yml` wrapper, it is possible to run the playbooks individually.
It is important to run the playbooks in the correct sequence, to ensure all dependencies are fulfilled.

|Playbook|Overview|
|:--------|:--------|
|**playbooks/preflight.yml**|[Pre-deployment validation (optional)](playbooks-preflight)|
|**playbooks/gcp_key_create.yml**|[Generate GCP keys (optional)](playbooks-gcp-key-create)|
|**playbooks/get_prereq.yml**|[Get prerequisites](playbooks-prereqs)|
|**playbooks/bigip_anthos.yml**|[Deploy F5](playbooks-f5)|
|**playbooks/deploy_admin_wrkst.yml**| [Deploy the admin workstation](playbooks-admin-workstation)|
|**playbooks/create_cluster.yml**|[Deploy admin and user clusters](playbooks-admin-user-clusters)|

Once you have successfully deployed the admin and user clusters, you can deploy additional functionality
including CSI driver and Anthos Service Mesh.


|Playbook|Overview|
|:--------|:--------|
|**playbooks/csi.yml**|[Deploy and configure CSI driver](playbooks/csi-vsphere)|
|**playbooks/service_mesh.yml**|[Deploy and configure Anthos Service Mesh](playbooks-service-mesh)|
