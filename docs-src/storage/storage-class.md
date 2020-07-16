# Storage class

GKE on-prem can integrate with block or file storage by using any of the following mechanisms:

- VMWare vSphere Storage
- Kubernetes in-tree volume plugins
- Container Storage Interface (CSI)

When you create a cluster, GKE on-prem creates a Kubernetes StorageClass named `standard`. This is the default StorageClass for the cluster. 

```
export KUBECONFIG=~/kubeconfigs/gmcg-gke-usercluster-1-kubeconfig
kubectl get storageclass

NAME                 PROVISIONER                    AGE
standard (default)   kubernetes.io/vsphere-volume   10d
```

If you have configured CSI storage and have run the CSI playbook `playbooks/csi.yml`, either as part of `site.yml` or standalone, you will have a second storage class available:

```
kubectl get storageclass

NAME                 PROVISIONER                    AGE
gmcg-vmware-sc       csi.vsphere.vmware.com         18s
standard (default)   kubernetes.io/vsphere-volume   10d
```

When you create a PersistentVolumeClaim that does not specify a StorageClass, the volume controller will fulfil the claim according to the default StorageClass. If you look at the details of the `standard` storage class, you will see the `storageclass.kubernetes.io/is-default-class: "true"` annotation. This annotation identifies the StorageClass named `standard` as the default StorageClass.

```
kubectl get storageclass standard -o yaml

apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    bundle.gke.io/create-only: "true"
    storageclass.kubernetes.io/is-default-class: "true"
  creationTimestamp: "2020-06-15T17:31:19Z"
  labels:
    bundle.gke.io/component-name: storage-class
    bundle.gke.io/component-version: 1.4.0-gke.13
  name: standard
  resourceVersion: "332"
  selfLink: /apis/storage.k8s.io/v1/storageclasses/standard
  uid: 7a118854-2405-461a-bded-a449373a1360
parameters:
  datastore: Anthos_HPE
  diskformat: thin
  fstype: ext4
provisioner: kubernetes.io/vsphere-volume
reclaimPolicy: Delete
volumeBindingMode: Immediate
```


To change the default storage class, you can patch the `standard` storage class: 

```
kubectl patch storageclass standard -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
```

Patch the storage class created using the CSI driver:

```
kubectl patch storageclass gmcg-vmware-sc -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

Now, when you get the summary information for all storage classes, you will see that the default has been changed:

```
kubectl get storageclass

NAME                       PROVISIONER                    AGE
gmcg-vmware-sc (default)   csi.vsphere.vmware.com         5m51s
standard                   kubernetes.io/vsphere-volume   10d
```