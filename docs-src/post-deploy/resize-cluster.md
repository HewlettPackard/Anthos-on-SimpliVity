# Resizing a user cluster

This page shows you how to add a new node to an existing user cluster that uses static IPs. For more information, see  the Google documentation at
[https://cloud.google.com/anthos/gke/docs/on-prem/how-to/resizing-a-user-cluster](https://cloud.google.com/anthos/gke/docs/on-prem/how-to/resizing-a-user-cluster).



## Configure `kubectl` for the admin cluster

Configure `kubectl` to access the admin cluster. For example:

```
export KUBECONFIG=~/kubeconfigs/kubeconfig
```

## Determine the namespace for the user cluster

```
kubectl get namespaces

NAME                     STATUS   AGE
default                  Active   4d18h
gke-system               Active   4d18h
gmcg-gke-usercluster-1   Active   4d18h
kube-node-lease          Active   4d18h
kube-public              Active   4d18h
kube-system              Active   4d18h
```


## View the reserved addresses

```
kubectl get clusters -n gmcg-gke-usercluster-1  gmcg-gke-usercluster-1 -o yaml

apiVersion: cluster.k8s.io/v1alpha1
kind: Cluster
metadata:
...
  name: gmcg-gke-usercluster-1
  namespace: gmcg-gke-usercluster-1
...
spec:
  clusterNetwork:
    pods:
      cidrBlocks:
      - 192.168.0.0/16
    serviceDomain: cluster.local
    services:
      cidrBlocks:
      - 10.96.0.0/12
  providerSpec:
    value:
      apiVersion: vsphereproviderconfig.k8s.io/v1alpha1
      controlPlaneReplicas: 1
      controlPlaneVersion: 1.15.7-gke.32
      kind: VsphereClusterProviderConfig
      loadBalancerIP: 10.15.158.63
      loadBalancerNodePort: 0
      metadata:
        creationTimestamp: null
      networkSpec:
        dns:
        - 10.10.173.1
        ntp: 10.12.2.1
        reservedAddresses:
        - gateway: 10.15.155.1
          hostname: gmcg-gke-user1-node1
          ip: 10.15.155.121
          netmask: 24
        - gateway: 10.15.155.1
          hostname: gmcg-gke-user1-node2
          ip: 10.15.155.122
          netmask: 24
        - gateway: 10.15.155.1
          hostname: gmcg-gke-user1-node3
          ip: 10.15.155.123
          netmask: 24
        - gateway: 10.15.155.1
          hostname: gmcg-gke-user1-node4
          ip: 10.15.155.124
          netmask: 24
        searchdomains:
        - am2.cloudra.local, gmcggke.org
...
```

In the command's output, look for the ``reservedAddresses`` field. In this example, there are four reserved addresses for the four existing nodes in the cluster.

There should be more IP addresses in the field than there are nodes running in the user cluster.
If you need to add more addresses to the `reservedAddresses` field, perform the following steps.

## Edit the cluster resource

 Edit the custer resource to add as many additional static IP blocks as required. An IP block is composed of
 `gateway`, `hostname`, `ip`, and `netmask` fields.

```
kubectl edit clusters -n gmcg-gke-usercluster-1  gmcg-gke-usercluster-1
```

In this example, two new addresses are added to the `reservedAddresses`:

```
        - gateway: 10.15.155.1
          hostname: gmcg-gke-user1-node5
          ip: 10.15.155.125
          netmask: 24
        - gateway: 10.15.155.1
          hostname: gmcg-gke-user1-node6
          ip: 10.15.155.126
          netmask: 24
```


## Adding a node to the user cluster

Configure `kubectl` to access the appropriate user cluster. For example:

```
export KUBECONFIG=~/kubeconfigs/gmcg-gke-usercluster-1-kubeconfig
```

List the existing nodes in the cluster:

```
kubectl get nodes

NAME                   STATUS   ROLES    AGE     VERSION
gmcg-gke-user1-node1   Ready    <none>   4d21h   v1.16.8-gke.6
gmcg-gke-user1-node2   Ready    <none>   4d21h   v1.16.8-gke.6
gmcg-gke-user1-node3   Ready    <none>   4d21h   v1.16.8-gke.6
gmcg-gke-user1-node4   Ready    <none>   4d21h   v1.16.8-gke.6
```

Determine the machine deployment for the user cluster:

```
kubectl get machinedeployments

NAME                     AGE
gmcg-gke-usercluster-1   4d21h
```

Get the details for the machine deployment:

```
kubectl get machinedeployments gmcg-gke-usercluster-1 -o yaml  

apiVersion: v1
items:
- apiVersion: cluster.k8s.io/v1alpha1
  kind: MachineDeployment
  metadata:
...
    name: gmcg-gke-usercluster-1
    namespace: default
...
  spec:
    minReadySeconds: 0
    progressDeadlineSeconds: 600
    replicas: 4
    revisionHistoryLimit: 1
...
```

To resize the user cluster, you need to patch the cluster's MachineDeployment configuration. You change the value of the 
configuration's replicas field, which indicates how many nodes the cluster should run. In this example, the existing 
value `replicas: 4` is changed to `replicas: 5` to add one extra node.


```
kubectl patch machinedeployment gmcg-gke-usercluster-1 -p "{\"spec\": {\"replicas\": 5 }}" --type=merge
```

## Verify cluster resizing

After a while, the extra node will show up using the `kubectl get nodes` command:

```
kubectl get nodes

NAME                   STATUS   ROLES    AGE     VERSION
gmcg-gke-user1-node1   Ready    <none>   4d21h   v1.16.8-gke.6
gmcg-gke-user1-node2   Ready    <none>   4d21h   v1.16.8-gke.6
gmcg-gke-user1-node3   Ready    <none>   4d21h   v1.16.8-gke.6
gmcg-gke-user1-node4   Ready    <none>   4d21h   v1.16.8-gke.6
gmcg-gke-user1-node5   Ready    <none>   95s     v1.16.8-gke.6
```

Use the machine deployment resouce to verify the change:

```
kubectl get machinedeployments -o yaml | grep Replicas

    availableReplicas: 5
    readyReplicas: 5
    updatedReplicas: 5
```
