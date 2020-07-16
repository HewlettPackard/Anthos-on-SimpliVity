# Introduction to configuration

Configuration details are primarily stored in the file `inventory/group_vars/all/all.yml`, while sensitive
information such as passwords are stored in a vault file `inventory/group_vars/all/vault.yml` which
should be encrypted.

You can use the provided sample configuration files as a starting point for configuring your environment. The sample files are available at `inventory/group_vars/all/all.yml.sample` and `inventory/group_vars/all/vault.yml.sample`.

## Proxy
If your environment requires the use of a proxy for network access, you must configure this before running any playbooks. See the section [Proxy configuration](proxy-config) for more information.

The configured proxy will be used for the Ansible controller, the admin workstation, and by the admin
and user clusters.

## Input files
Before installing Anthos GKE on-prem, you must create a Google Cloud project and obtain a key for a 
whitelisted service account. You also need to create other Google Cloud service accounts and keys before
running the playbooks.

In addition to the service account keys, you must assemble a number of other files, including the SSH keypair to be deployed to GKE admin workstation and the vCenter SSL certificate(s).

The configuration for the names and locations of all these input files is detailed in the section [Input files](input-files).

## VMware 

You need to supply details of your VMware environment, as outlined in the section [VMware configuration](vmware-config).

The playbooks support the configuration of an alternative vCenter so that you can run your admin
workstation separate to your admin and user clusters. For more details on configuring a second vCenter, see the approriate section in the [Configuring the admin workstation](admin-workstation-config) page.

## F5 BIG-IP

General configuration variables for the F5 BIG-IP load balancer are detailed in the section
[F5 configuration](f5-config).

The [F5 playbook](playbooks/playbooks-f5)  also creates partitions for the admin and user clusters. See the
documentation for the `f5_partition` and `state` cluster config variables in the section
[Configuring admin and user clusters](admin-user-clusters-config).


## Admin workstation

Details of the variables used for the admin workstation, incuding sizing, networking and the possible use of an
alternative vCenter, is documented in the section [Configuring the admin workstation](admin-workstation-config).

## Admin and user clusters

Configuring the admin and user clusters includes setting:

- Common variables across all clusters
- Default values that can be over-ridden on a cluster-by-cluster basis
- General cluster configuration
- Static IPs for each cluster

For more information, see the section [Configuring admin and user clusters](admin-user-clusters-config).


## Output files

Multiple files are genereated by the playbooks at different stages of the deployment.
Details about the configuration for the names and locations of these output files is covered in
the section [Output files](output-files).
