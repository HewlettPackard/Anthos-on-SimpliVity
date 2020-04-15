# Google Cloud's Anthos on HPE SimpliVity

# Ansible Deployment of Anthos Workstation and GKE on-prem Clusters

Google Anthos requires an administration workstation to be installed to perform on-prem cluster deploymnents.

This repository of ansible code will perform the following steps from a linux host of your choice **(as long as it's Ubuntu for now)**:

* Install Google Cloud SDK (See Note below. Still need to manually download the gke admin ova so you need a host that can do that. You can manually copy the ova to the "new" linux host running these playbooks.)
* Download the gkeadm binary
* Deploy the Anthos admin workstation
* Provide post deployment configuration of admin workstation
* Deploy GKE on-prem admin cluster
* Deploy GKE on-prem user cluster(s)

## Getting Started

A Linux host is required for running these Ansible playbooks.  This environment has been tested with Ubuntu 18.04 LTS. The host must be able to communicate to the target vcenter and subsequent gke admin host that is created.

Note: If running on Simplivity DVM you need to manually download the ova file and enter the path to the file in the host variable file `inventory/group_vars/all/all.yml`

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
~/anthos_admin_deploy$ ./prerequisite/ansible-setup.sh -h

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

### gkeadm Variables

`gkeadm` requires a yaml file defining the parameters for the admin workstation. To initialize the file:

* Run `gkeadm create config` to accept the default filename (admin-ws-config.yaml) and path (current dir).
* Run `gkeadm create config --config 'path/filename.yaml'` to specifiy custom path and filename.

This file will contain potentially sensitive information (login credentials) and should be located in a secure directory.

The location of the file will need to be entered in `inventory/group_vars/all/all.yml` under the `gkeadm_config:` variable.

The resulting yaml file will look similar to this but all fields will be empty.  You can also use an existing file and edit as needed.

These can be customized by editing the file `docs/sample-admin-ws-config.yml` and moving it to a secure directory. see sample below.

```yaml
gcp:
  # Path of the whitelisted service account's JSON key file
  whitelistedServiceAccountKeyPath: "/home/sgifford/gke_admin_wrkst_private/gkeonprem-keys/whitelisted-key.json"
# Specify which vCenter resources to use
vCenter:
  # The credentials and address GKE On-Prem should use to connect to vCenter
  credentials:
    address: "VCENTER_IP"
    username: "Administrator@vsphere.local"
    password: "PASSWORD"
  datacenter: "Datacenter"
  datastore: "ds1"
  cluster: "New Cluster"
  network: "VM Network 2"
  resourcePool: "New Cluster/Resources/"
  # Provide the path to vCenter CA certificate pub key for SSL verification
  caCertPath: "/home/sgifford/gke_admin_wrkst_private/vmware/vcenter.pem"
# The URL of the proxy for the jump host
proxyUrl: "http://16.100.208.216:8888"
adminWorkstation:
  name: gke-adm-ws13.0-200326-102803
  cpus: 4
  memoryMB: 8192
  # The disk size of the admin workstation in GB. It is recommended to use a disk
  # with at least 50 GB to host images decompressed from the bundle.
  diskGB: 50
  network:
    # The IP allocation mode: 'dhcp' or 'static'
    ipAllocationMode: "dhcp"
    # # The host config in static IP mode. Do not include if using DHCP
    # hostConfig:
    #   # The IPv4 static IP address for the admin workstation
    #   ip: ""
    #   # The IP address of the default gateway of the subnet in which the admin workstation
    #   # is to be created
    #   gateway: ""
    #   # The subnet mask of the network where you want to create your admin workstation
    #   netmask: ""
    #   # The list of DNS nameservers to be used by the admin workstation
    #   dns:
    #   - ""
  # The URL of the proxy for the admin workstation
  proxyUrl: "http://16.100.208.216:8888"
  ntpServer: hou-ntp1.hcilabs.hpecorp.net
  ```

### Post Deploy Customization Vars

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
# FIXME: Note ssl cert for this registry is currently held in ansible role directory
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
  repo_name: anthos_workstation_files
  repo_url: 'ssh://git@stash.simplivt.local:7999/soleng/anthos_wrkstation_files.git'
anthos_userdata_git:
  repo_name: gke_admin_wrkst_private
# Change this url to match your private user data repo path
  repo_url: 'ssh://git@stash.simplivt.local:7999/~sgifford/gke_admin_wrkst_private.git'
```

---

## Anthos GKE on-prem config files

Sample yaml config files needed to deploy gke on-prem clusters are located in `docs` directory. The actual files needed will contain sensitive information and should be kept separately. (In a secure git repo or ...) The paths to the files should be entered into the `inventory/group_vars/all/all.yml` file under the `gke_cluster_config:` variable.

---

## Protected Passwords/Keys for F5 Configuration

The file `inventory/group_vars/all/vault.yml` contains the following variables used for the F5 playbook:

```yaml
vault_f5_root_password: "password"
vault_f5_admin_password: "password"
vault_f5_license_key: "license_key"
```

These need to entered before running the bigip_anthos.yml playbook.  To edit the file:

* source your python virtualenv
* run `ansible-vault edit inventory/group_vars/all/vault.yml`
* type in the password when prompted (will provide password separately)
* edit/save file

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
    - name: 'admin-config.yaml'
      local_path: '/home/sgifford/gke_admin_wrkst_private/gkeonprem-config/admin-config.yaml'
    - name: 'user1-config.yaml'
      local_path: '/home/sgifford/gke_admin_wrkst_private/gkeonprem-config/user1-config.yaml'
    - name: 'user2-config.yaml'
      local_path: '/home/sgifford/gke_admin_wrkst_private/gkeonprem-config/user2-config.yaml'
```

---

## Ansible Execution

* Ensure all variable files have been edited to reflect your environment
* cd anthos_admin_deploy/ansible directory
* Activate your python virtualenv created earlier `source 'path_to_env/bin/activate'`
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
