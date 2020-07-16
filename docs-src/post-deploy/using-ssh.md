# Using SSH to connect to cluster nodes

This page describes how to SSH into an Anthos GKE on-prem cluster node.

## Connect to your admin workstation

```
ssh -i /root/anthos_secrets/vsphere_workstation ubuntu@10.15.155.200
```


## Connecting to a node in a user cluster

This section shows you how to use SSH to connect to a node in one of your user clusters.

### Configure `kubectl` for the user cluster

Configure `kubectl` to access the appropriate user cluster. For example:

```
export KUBECONFIG=~/kubeconfigs/gmcg-gke-usercluster-1-kubeconfig
```


### Determine the IP addresses for the user cluster nodes

Use the `-o wide` option to see the IP addresses for your user cluster. 

```
$ kubectl get nodes -o wide

NAME                   STATUS   ROLES    AGE     VERSION         INTERNAL-IP     EXTERNAL-IP     OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
gmcg-gke-user1-node1   Ready    <none>   7h44m   v1.16.8-gke.6   10.15.155.121   10.15.155.121   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
gmcg-gke-user1-node2   Ready    <none>   7h44m   v1.16.8-gke.6   10.15.155.122   10.15.155.122   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
gmcg-gke-user1-node3   Ready    <none>   7h45m   v1.16.8-gke.6   10.15.155.123   10.15.155.123   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
gmcg-gke-user1-node4   Ready    <none>   7h44m   v1.16.8-gke.6   10.15.155.124   10.15.155.124   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
```



### Configure `kubectl` for the admin cluster

Configure `kubectl` to access the admin cluster. For example:

```
export KUBECONFIG=~/kubeconfigs/kubeconfig
```

### Determine the namespace for the user cluster

Use the `kubectl get namespaces` command to determine the namespace for the user cluster. It should match the cluster name.

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

### Retrieve the SSH key

Using the user cluster namespace, retrieve the SSH key and save to file with the correct permissions:

```
kubectl get secrets -n gmcg-gke-usercluster-1 ssh-keys \
-o jsonpath='{.data.ssh\.key}' | base64 -d > \
~/.ssh/gmcg-gke-usercluster-1.key && chmod 600 ~/.ssh/gmcg-gke-usercluster-1.key
```


### Use SSH to connect to a user cluster node

Choose one of the IP addresses for the user cluster that was returned from the `kubectl get nodes -o wide` command:

```
ssh -i ~/.ssh/gmcg-gke-usercluster-1.key ubuntu@10.15.155.121
```

## Connecting to a node in the admin cluster

This section shows you how to use SSH to connect to a node in your admin cluster.

### Configure `kubectl` for the admin cluster

Configure `kubectl` to access the admin cluster. For example:

```
export KUBECONFIG=~/kubeconfigs/kubeconfig
```

### Determine the IP addresses for the admin cluster nodes

Use the `-o wide` option to see the IP addresses for the admin cluster. 

```
kubectl get nodes -o wide

NAME              STATUS   ROLES    AGE     VERSION          INTERNAL-IP     EXTERNAL-IP     OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
gmcg-gke-admin1   Ready    master   4d18h   v1.16.8-gke.6   10.15.155.111   10.15.155.111   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
gmcg-gke-admin2   Ready    <none>   4d18h   v1.16.8-gke.6   10.15.155.112   10.15.155.112   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
gmcg-gke-admin3   Ready    <none>   4d18h   v1.16.8-gke.6   10.15.155.113   10.15.155.113   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
gmcg-gke-admin4   Ready    <none>   4d18h   v1.16.8-gke.6   10.15.155.114   10.15.155.114   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
```

### Retrieve the SSH key

Using the `kube-system` namespace, retrieve the SSH key for the admin cluster and save to file with the correct permissions:

```
kubectl  get secrets -n kube-system sshkeys \
-o jsonpath='{.data.vsphere_tmp}' | base64 -d > \
~/.ssh/admin-cluster.key && chmod 600 ~/.ssh/admin-cluster.key
```

### Use SSH to connect to an admin cluster node

Choose one of the IP addresses for the admin cluster that was returned from the `kubectl get nodes -o wide` command:

```
ssh -i ~/.ssh/admin-cluster.key ubuntu@10.15.155.111
```


## Resources

Using SSH to connect to a cluster node<br>
[https://cloud.google.com/anthos/gke/docs/on-prem/how-to/ssh-cluster-node](https://cloud.google.com/anthos/gke/docs/on-prem/how-to/ssh-cluster-node)