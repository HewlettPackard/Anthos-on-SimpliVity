# Deploying CSI driver

The HPE SimpliVity Container Storage Interface (CSI) driver for vSphere enables you to provision 
HPE SimpliVity storage for Kubernetes applications while providing HPE SimpliVity data protection.
The playbook `playbooks/csi.yml` deploys the CSI driver across user clusters and creates storage classes
that can subsequently be used by applications running on the clusters.


## Prerequisites

- Admin and user clusters deployed successfully
- HPE SimpliVity configuration completed as described in the section [HPE SimpliVity configuration](../config-core/simplivity-config)
- CSI Configuration completed as described in the section [CSI configuration](../config-core/csi-config)

## Command

```
cd ~/Anthos-on-SimpliVity

ansible-playbook playbooks/csi.yml  --ask-vault-pass
```

## Tasks performed

For each user cluster:

- Create CSI Secret for user cluster based on [csi-secret.conf.j2](https://github.com/HewlettPackard/Anthos-on-SimpliVity/blob/master/playbooks/roles/gke_cluster_config/csi/templates/csi-secret.conf.j2)
- Create Controller RBAC based on [svt-csi-controller-rbac.yaml](https://github.com/HewlettPackard/Anthos-on-SimpliVity/blob/master/playbooks/roles/gke_cluster_config/csi/files/svt-csi-controller-rbac.yaml)
- Create Controller Deployment and Driver based on [svt-csi-controller-deployment.yaml.j2](https://github.com/HewlettPackard/Anthos-on-SimpliVity/blob/master/playbooks/roles/gke_cluster_config/csi/templates/svt-csi-controller-deployment.yaml.j2) using the following images:
  - quay.io/k8scsi/csi-attacher
  - hpesimplivity/vsphere-csi-driver
  - hpesimplivity/vsphere-csi-syncer
  - quay.io/k8scsi/livenessprobe
  - quay.io/k8scsi/csi-provisioner
- Create CSI DaemonSet based on [svt-csi-node-ds.yaml.j2](https://github.com/HewlettPackard/Anthos-on-SimpliVity/blob/freshpick/playbooks/roles/gke_cluster_config/csi/templates/svt-csi-node-ds.yaml.j2)
- Create CSI Storage Class if it doesn't already exist, based on template [csi-sc.yml.j2](https://github.com/HewlettPackard/Anthos-on-SimpliVity/blob/master/playbooks/roles/gke_cluster_config/csi/templates/csi-sc.yml.j2)



## Uninstall

```
kubectl delete -n kube-system deployment svt-csi-controller
kubectl delete -n kube-system ds svt-csi-node
```

