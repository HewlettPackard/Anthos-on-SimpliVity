# Google Cloud's Anthos on HPE SimpliVity

# Ansible Deployment of Anthos Workstation and GKE on-prem Clusters

Google Anthos requires an administration workstation to be installed to perform on-prem cluster deployments.

This repository of ansible code will perform the following steps from a linux host of your choice **(as long as it's Ubuntu for now)**:

* Install Google Cloud SDK (See Note below. Still need to manually download the gke admin ova so you need a host that can do that. You can manually copy the ova to the "new" linux host running these playbooks.)
* Download the gkeadm binary
* Deploy the Anthos admin workstation
* Provide post deployment configuration of admin workstation
* Deploy GKE on-prem admin cluster
* Deploy GKE on-prem user cluster(s)

## Getting Started

A Linux host is required for running these Ansible playbooks.  This environment has been tested with Ubuntu 18.04 LTS. The host must be able to communicate to the target vcenter and subsequent gke admin host that is created.

Note: You currently need to manually download the ova file and enter the path to the file in the host variable file `Anthos-on-SimpliVity/inventory/host_vars/gke-admin-ws.yml` This variable file allows for additional admin workstation configuration.

* Google Cloud SDK must be installed on the linux host.
  * Google web page - https://cloud.google.com/sdk/docs

* Activate whitelisted key to enable downloads
* gcloud auth activate-service-account --project [PROJECT_ID] --key-file=[WHITELISTED_KEY_FILE]

* Downloading the ova
  * gsutil cp -r gs://gke-on-prem-release/admin-appliance/1.3.0-gke.16  ~/Downloads

---

## Installing Ansible

The use of a Python Virtual environment allows for flexibility in ansible host creation.  It also provides an easy method to freeze the version of required packages through the use of a requirements file.

The provided script `prerequisites/ansible-setup.sh` will build the python virtualenv needed to execute the playbooks.  

```text
~/Anthos-on-SimpliVity$ ./prerequisite/ansible-setup.sh -h

This script is used to create a python3 virtualenv with ansible operating environment
Syntax: ansible-setup.sh [-b|d|h]
options:
-b     Base directory to create python virtualenvs. (Optional - Default is ~/virtualenvs)
-d     Name to use for virtualenv directory. (Required)
-h     Print this Help.

ex.   ansible-setup.sh -b /home/sgifford/virtualenvs -d ansible29
```

---

## Variables Needed

### GKE Admin Workstation

`gkeadm` requires a yaml file for deploying the admin workstation.  The ansible code
will generate this file based on the inputs provided in `inventory/group_vars/all/all.yml`

### Post Deploy Configuration

There are playbooks that allow for additional customization of the gke admin workstation.

Including:

* Configure apt proxy
* Configure docker proxy and private registry
* Configure git repos to be pulled automatically

These can be customized by editing the file `inventory/group_vars/all/all.yml` see sample below.

```yaml
---
# Path to gke admin workstation ova file to install. Needed for now.
gkeadm_ova_path: '/home/sgifford/Downloads/1.3.0-gke.16/gke-on-prem-admin-appliance-vsphere-1.3.0-gke.16.ova'

# Docker bip (base IP) can be changed if the default conflict with your environment
docker_bip: '192.68.0.1/16'

# A private Docker registry is commonly used in Air-Gapped installations
private_docker_registry: true
private_reg_ip: '16.100.209.193'
private_reg_port: '5005'

# Proxy definitions -- gkeadm will have it's own. For now these are needed for post deploy configuration
proxy_address: '16.100.208.216'
proxy_port: '8888'
proxy_type: 'http'
no_proxy: '.hcilabs.hpecorp.net,.simplivt.local'

# GCP project to set.  gkeadm does not currently set this.
gcloud_project: 'deep-thought-259715'

# Path the yaml file created by running 'gkeadm create config'
gkeadm_config: '/home/sgifford/gke_admin_wrkst_private/admin-ws-config.yaml'

# Path to directory containing desired .ssh directory contents. Used for git repo cloning.
ssh_config_path: '~/gke_admin_wrkst_private/dot-cfg-files/.ssh'

# Path to ssh private/pub key to install on admin workstation
# This key will also be used by ansible to connect to admin workstation
ansible_ssh_private_key_file: '/home/sgifford/gke_admin_wrkst_private/dot-cfg-files/.ssh/vsphere_workstation'

# Path to repos to pull after deployment. Do not change anthos_deploy_git, but update the anthos_userdata_git entry.
anthos_deploy_git:
  repo_name: anthos_wrkstation_files
  repo_url: 'ssh://git@stash.simplivt.local:7999/soleng/anthos_wrkstation_files.git'
anthos_userdata_git:
  repo_name: gke_admin_wrkst_private
# Change this url to match your private user data repo path
  repo_url: 'ssh://git@stash.simplivt.local:7999/~sgifford/gke_admin_wrkst_private.git'
```

---

The private key to connect to the admin workstation is currently a [user created vsphere_workstation](https://cloud.google.com/anthos/gke/docs/on-prem/archive/1.1/how-to/installation/admin-workstation) key and not the autogenerated key in the 1.3 GKE install.  Ensure the key has proper access:
`chmod 400 path_to_key/vsphere_workstation`

---

### Anthos GKE on-prem cluster configuration

Similar to the GKE Admin Workstation configuration, the GKE on-prem cluster configuration is defined through variables in the `inventory/group_vars/all/all.yml` file.

---

### F5 Configuration

The F5 configuration is defined through variables in the `inventory/group_vars/all/all.yml` file.

---

### Protected Passwords/Keys for vSphere and F5 Configuration

The file `inventory/group_vars/all/vault.yml` contains the following variables used for the F5 playbook:

```yaml
vault_f5_root_password: "password"
vault_f5_admin_password: "password"
vault_f5_license_key: "license_key"
vault_vcenter_username: "username"
vault_vcenter_password: "password"
```

These need to entered before running the site.yml playbook.  To edit the file:

* source your python virtualenv
* run `ansible-vault edit inventory/group_vars/all/vault.yml --ask-vault-pass`
* type in the password when prompted (default password is `password`)
* edit/save file
* run `ansible-vault rekey inventory/group_vars/all/vault.yml --ask-vault-pass` and follow the prompts to change the password

When running ansible-playbook, you will need to specify `--ask-vault-pass` on command line.

---

## Playbook execution control

The file `inventory/group_vars/all/all.yml` additionally contains variables that control certain aspects of the ansible execution including file locations and GKE on-prem cluster creation info.

```yaml
output_directory: '/home/{{ ansible_user }}/output'
log_directory: '/home/{{ ansible_user }}/logs'

cluster_configurations_path: '/home/ubuntu/cluster-configurations'
cluster_kubeconfig_path: '/home/ubuntu/kubeconfigs'
admin_cluster_kubeconfig: 'kubeconfig'
gkectl_check_flags: '--skip-validation-vips --fast'
gkectl_create_flags: '--skip-validation-all'
gkectl_run_prepare: true
gkectl_prepare_flags: '--skip-validation-all'

create_admin_cluster: true
create_user_cluster: true
enable_config_check: false
gke_cluster_config:
    - name: 'admin'
      type: 'admin'
      f5_partition: 'Spanned_VIP'
      state: present
      cluster_ctrl_vip: '172.17.0.21'
      cluster_ingress_vip: '172.17.0.22'
    - name: 'sg-test4-13'
      type: 'user'
      f5_partition: 'Spanned_VIP_user'
      cluster_ctrl_vip: '172.17.0.69'
      cluster_ingress_vip: '172.17.0.72'
      state: present
    - name: 'sg-test5-13'
      type: 'user'
      f5_partition: 'user2_VIP'
      cluster_ctrl_vip: '172.17.0.32'
      cluster_ingress_vip: '172.17.0.33'
      state: present
```

---

## Ansible Execution

* Ensure all variable files have been edited to reflect your environment
* cd Anthos-on-SimpliVity directory
* Activate your python virtualenv created earlier by ansible-setup.sh  `source 'path_to_env/bin/activate'`
* Execute `ansible-playbook site.yml --ask-vault-pass`

The last debug message from ansible will provide admin workstation login information similar to the following:

```json
ok: [gke-admin-ws -> localhost] => {
    "msg": [
        "Anthos Workstation Deployment Summary",
        [
            "Admin workstation version: 1.3.0",
            "Created using gkeadm version: 1.3.0",
            "VM name: gke-adm-ws13.0-200326-102803",
            "IP: 172.17.67.90",
            "SSH key used: /home/sgifford/.ssh/gke-admin-workstation",
            "To access your admin workstation:",
            "ssh -i /home/sgifford/.ssh/gke-admin-workstation ubuntu@172.17.67.90"
        ]
    ]
}
```
