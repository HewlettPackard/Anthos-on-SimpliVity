# Google Cloud's Anthos on HPE SimpliVity

# Ansible Deployment of Anthos Workstation and GKE on-prem Clusters

Google Anthos requires an administration workstation to be installed to perform on-prem cluster deployments.

This repository of ansible code will perform the following steps from a linux host of your choice **(Ubuntu 18.04 and Fedora 31 have been tested)**:

* Install Google Cloud SDK
* Download the gkeadm binary
* Deploy the Anthos admin workstation
* Provide post deployment configuration of admin workstation
* Deploy GKE on-prem admin cluster
* Deploy GKE on-prem user cluster(s)

## Getting Started

A Linux host is required for running these Ansible playbooks.  This environment has been tested with Ubuntu 18.04 LTS and Fedora 31. The host must be able to communicate to the target vcenter and subsequent gke admin host that is created.

The user account used to execute the ansible playbooks requires sudo with NOPASSWD to be enabled.  This can be done by adding the user to the ***wheel*** group and adding a line similar to this `%wheel ALL=NOPASSWD: ALL` to the sudoers configuration.

A Google Cloud account is required and service accounts created.

[Google site for getting started](https://cloud.google.com/anthos/gke/docs/on-prem/how-to/install-overview-basic)

[Information on required service accounts](https://cloud.google.com/anthos/gke/docs/on-prem/how-to/service-accounts)

The playbooks currently depend on having a whitelisted service account key file present on the deployment system.

[Google instructions for creating a whitelisted account JSON file](https://cloud.google.com/anthos/gke/docs/on-prem/how-to/service-accounts#whitelisted_service_account)

## New GCP Service Account Creation Playbook

A new playbook/role have been added that will create all the initial GCP service accounts (except for the whitelisted key), assign required roles and download json keys for each.  These accounts are listed below under Sensitive Information section.

Dependencies:

* GCP project must exist and whitelisted key client_email must be added to project with the following role(s)
  * hpe-svt-sa@active-module-235013.iam.gserviceaccount.com 'Service Account Key Admin'
* All vars in all.yml should be edited to reflect your desired state.
* [secrets_directory] must exist
* whitelisted_key.json file must reside in [secrets_directory]

Execution of the role is done by running `ansible-playbook playbooks/gcp_key_create.yml --ask-vault-pass`

* The `prereq` role will be executed as a dependency during the playbook execution.

---

## Installing Ansible

The use of a Python Virtual environment allows for flexibility in ansible host creation.  It also provides an easy method to freeze the version of required packages through the use of a requirements file.

The provided script `prerequisites/ansible-setup.sh` will build the python virtualenv needed to execute the playbooks.  

NOTE: You may need to modify the following proxy settings in the ansible-setup.sh script based on your environment:

```text
HTTPS_PROXY="HTTPS_PROXY=http://16.100.211.43:8888"
needs_proxy=true
```

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

## Sensitive Information Location(s)

The file `inventory/group_vars/all/all.yml` additionally contains variables that define the location of secrets files including:

* ssl certs
* ssh keys
* Anthos service account JSON files

```yaml
# Location of GCP keys created (.json files)
# vcenter(s) ssl certificates
# private docker registry certificates
# ssh keypair to be deployed to GKE Admin Workstation
# This directory is located under /home/<user> on the ansible controller
secrets_directory: 'anthos_secrets'
```

All secrets are now kept in the /home/[user]/[secrets_directory] on the ansible controller and GKE Admin Workstation

Required key files and filenames: (filenames are google default filenames for json keys)

* connect-register-key.json
* connect-agent-key.json
* audit-logging-key.json
* logging-monitoring-key.json
* whitelisted-key.json

Optional json key for user cluster

* usage-metering-key.json # Used for user cluster resource metering.

SSL certificate files for vcenter and private docker reg (names are defined in all.yml by gke_admin_workstation.cacert`)

* vcenter.pem -- `vcenter.cacert`
* gkeadm_alt_vcenter.pem -- `gke_admin_workstation.alt_vcenter.cacert`
* registry.crt -- `private_reg_cert`

SSH Keypair that will be deployed to GKE Admin Workstation and used by ansible to connect to Workstation. (name defined by `gke_admin_workstation.ssh_private_key`)

* vsphere_workstation
* vsphere_workstation.pub

The private key to connect to the admin workstation is currently a [user created vsphere_workstation](https://cloud.google.com/anthos/gke/docs/on-prem/archive/1.1/how-to/installation/admin-workstation) key and not the autogenerated key in the 1.3 GKE install.  Ensure the key has proper access:
`chmod 600 path_to_key/vsphere_workstation`

---

### vSphere Virtual Center

```yaml

# Virtual Center Configuration that will be used to deploy GKE Admin Workstation
# and all GKE on-prem clusters (admin and user)
# All varibles that contain a vault_ prefix should be entered in `inventory/group_vars/all/vault.yml'
#
vcenter:
  address: '10.1.223.196'
  username: "{{ vault_vcenter_username }}"
  password: "{{ vault_vcenter_password }}"
  datacenter: 'Datacenter'
  datastore: 'ds1'
  cluster: 'New_Cluster'
  network: 'VM Network 2'
  resourcepool: 'Anthos_1.3'
  cacert: 'vcenter.pem' # Must be in directory defined by 'secrets_directory'
```

### GKE Admin Workstation

`gkeadm` requires a yaml configuration file for deploying the admin workstation.  Ansible
will generate this file based on the inputs provided in `inventory/group_vars/all/all.yml` in this section.

```yaml
#####
# GKE Admin Workstation Configuration
#####
gke_admin_workstation:
  ssh_private_key: 'vsphere_workstation' # Must be in directory defined by 'secrets_directory'
  proxyUrl: 'http://16.100.208.216:8888'
  name: 'gke-adm-test-2'
  cpus: '4'
  memoryMB: '8192'
  diskGB: '50'
  ntpServer: 'hou-ntp1.hcilabs.hpecorp.net'
  ipAllocationMode: 'dhcp'
  # For Static IP assignment uncomment and enter info below. Remove ipAllocationMode: 'dhcp' above.
  #ipAllocationMode: 'static'
  #ip: '192.168.1.10'
  #gateway: '192.168.1.1'
  #netmask: '255.255.255.0'
  #dns:
  #  - nameserver_ip
  #  - nameserver_ip
  # If you desire to deploy your GKE Admin Workstation to a different vsphere infrastructure, enter values here
  # and set 'enable: true'. If 'enable: false' then values from global vcenter config will be used.
  alt_vcenter:
    enable: false
    address: '10.1.223.196'
    username: "{{ vault_gkeadm_vcenter_username }}"
    password: "{{ vault_gkeadm_vcenter_password }}"
    datacenter: 'Datacenter'
    datastore: 'csi-2'
    cluster: 'New_Cluster'
    network: 'VM Network 2'
    resourcepool: 'Anthos_1.3'
    cacert: 'gkeadm_alt_vcenter.pem' # Must be in directory defined by 'secrets_directory'

# Path to GKE Admin Workstation OVA file to install. If defined and valid gkeadm will use this file.
# If empty '' or invalid gkeadm will download the OVA into the directory defined by the variable 'output_directory:'
# gkeadm_ova_path: '/home/sgifford/Downloads/1.3.0-gke.16/gke-on-prem-admin-appliance-vsphere-1.3.0-gke.16.ova'
gkeadm_ova_path: ''

```

---

### Post Deploy Configuration

There are playbooks that allow for additional customization of the GKE Admin Workstation

Including:

* Configure apt proxy
* Configure docker proxy and private registry
* Configure git repos to be pulled automatically

These can be customized by editing the file `inventory/group_vars/all/all.yml` see sample below.

```yaml
---
# Docker bip (base IP) can be changed if the default conflict with your environment
docker_bip: '192.68.0.1/16'

# A private Docker registry is commonly used in Air-Gapped installations
private_docker_registry: true
private_reg_ip: '16.100.209.193'
private_reg_port: '5005'
private_reg_cert: 'registry.crt' # Must be in directory defined by 'secrets_directory'
private_reg_username: 'me'
private_reg_password: 'you'

# Proxy definitions -- gkeadm will have it's own. For now these are needed for post deploy configuration
proxy_address: '16.100.208.216'
proxy_port: '8888'
proxy_type: 'http'
no_proxy: '.hcilabs.hpecorp.net,.simplivt.local'

# Path to directory containing desired .ssh directory contents that will be copied to GKE Admin Workstaion. This defaults the user's .ssh directory.
# Used for git repo cloning.
ssh_config_path: '{{ local_user_home }}/.ssh'

# Deprecated -- ansible_deploy_git will be removed.  ansible_userdata_git will remain as option.
# Path to repos to pull after deployment. Do not change anthos_deploy_git, but update the anthos_userdata_git entry.
anthos_deploy_git:
  pull_enable: false
  repo_name: anthos_wrkstation_files
  repo_url: 'ssh://git@stash.simplivt.local:7999/soleng/anthos_wrkstation_files.git'
anthos_userdata_git:
  pull_enable: false
  repo_name: gke_admin_wrkst_private
# Change this url to match your private user data repo path
  repo_url: 'ssh://git@stash.simplivt.local:7999/~sgifford/gke_admin_wrkst_private.git'
```

---

### Anthos GKE on-prem cluster configuration

Similar to the GKE Admin Workstation configuration, the GKE on-prem cluster configuration is defined through variables in the `inventory/group_vars/all/all.yml` file under this heading. This section includes GKE on-prem cluster configuation variables and cluster creation control variables (e.g. running gkectl prepare, check-config etc)

```yaml
#####
# GKE on-prem cluster configuration
#####
```

---

### F5 Configuration

The F5 configuration is defined through variables in the `inventory/group_vars/all/all.yml` file under this heading.

```yaml
#####
# F5 Configuration Information
# All varibles that contain a vault_ prefix should be entered in `inventory/group_vars/all/vault.yml'
#####
```

---

### Protected Passwords/Keys for vSphere and F5 Configuration

The file `inventory/group_vars/all/vault.yml` contains the following variables used for the F5 playbook:

```yaml
vault_f5_root_password: "password"
vault_f5_admin_password: "password"
vault_f5_license_key: "license_key"
vault_vcenter_username: "username"
vault_vcenter_password: "password"

# if using alternate vcenter for GKE Admin Workstation then these must be set as well.
vault_gkeadm_vcenter_username: "username"
vault_gkeadm_vcenter_password: "password"
```

These need to entered before running the site.yml playbook.  To edit the file:

* source your python virtualenv
* run `ansible-vault edit inventory/group_vars/all/vault.yml --ask-vault-pass`
* type in the password when prompted (default password is `password`)
* edit/save file
* run `ansible-vault rekey inventory/group_vars/all/vault.yml --ask-vault-pass` and follow the prompts to change the password

When running ansible-playbook, you will need to specify `--ask-vault-pass` on command line.

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

## Monitor GKE Cluster Creation

Once the GKE Admin Workstation is created, monitoring of the cluster creation logs can be done by executing the script `cluster-watch.py` in the ***scripts*** directory.
To execute the program:

* Open new terminal session on Ansible control node
* source the same python virtual environment as you did for Ansible
* run `cluster-watch.py`

The script uses the linux `lnav` program to tail the log files created during the GKE cluster creation.

NOTE: If executing this on an existing GKE Admin Workstation (i.e. built before you read this new README) then you need to re-run playbook/deploy_admin_wrkst.yml to install dependencies.
