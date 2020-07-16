# Deploying CSI driver


The playbook `playbooks/csi.yml` deploys the vSphere CSI driver across user clusters and creates storage classes
that can subsequently be used by applications running on the clusters.


## Prerequisites

- Admin and user clusters deployed successfully
- CSI Configuration completed as described in the section [CSI configuration](../config-core/csi-vsphere-config)

## Command

```
cd ~/Anthos-on-SimpliVity

ansible-playbook playbooks/csi.yml  --ask-vault-pass
```

## Tasks performed

For each user cluster:

- Create CSI Secret for user cluster based on [csi-secret.conf.j2](https://github.com/HewlettPackard/Anthos-on-SimpliVity/blob/master/playbooks/roles/gke_cluster_config/csi/templates/csi-secret.conf.j2)
- Create Controller RBAC based on [vsphere-csi-controller-rbac.yaml](https://github.com/HewlettPackard/Anthos-on-SimpliVity/blob/master/playbooks/roles/gke_cluster_config/csi/files/vsphere-csi-controller-rbac.yaml)
- Create Controller Deployment and Driver based on [vsphere-csi-controller-deployment.yaml.j2](https://github.com/HewlettPackard/Anthos-on-SimpliVity/blob/master/playbooks/roles/gke_cluster_config/csi/templates/vsphere-csi-controller-deployment.yaml.j2) using the following images:
  - quay.io/k8scsi/csi-attacher
  - quay.io/k8scsi/livenessprobe
  - quay.io/k8scsi/csi-provisioner
  - quay.io/k8scsi/csi-node-driver-registrar
  - gcr.io/cloud-provider-vsphere/csi/release/driver:v2.0.0
  - gcr.io/cloud-provider-vsphere/csi/release/syncer:v2.0.0  
- Create CSI DaemonSet based on [vsphere-csi-node-ds.yaml.j2](https://github.com/HewlettPackard/Anthos-on-SimpliVity/blob/freshpick/playbooks/roles/gke_cluster_config/csi/templates/vsphere-csi-node-ds.yaml.j2)
- Create CSI Storage Class if it doesn't already exist, based on template [csi-sc.yml.j2](https://github.com/HewlettPackard/Anthos-on-SimpliVity/blob/master/playbooks/roles/gke_cluster_config/csi/templates/csi-sc.yml.j2)



## Uninstall

```
kubectl delete -n kube-system deployment vsphere-csi-controller
kubectl delete -n kube-system ds vsphere-csi-node
```

