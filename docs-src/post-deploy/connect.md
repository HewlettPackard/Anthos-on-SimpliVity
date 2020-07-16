# Accessing your clusters

This page shows how to access the admin and user clusters.

## Connect to your admin workstation

```
ssh -i /root/anthos_secrets/vsphere_workstation ubuntu@10.15.155.200
```


The kubeconfig files that enable access to your clusters are available in the `kubeconfigs` directory:

```
ls ~/kubeconfigs

gmcg-gke-usercluster-1-kubeconfig  
internal-cluster-kubeconfig-debug  
kubeconfig
```


## Admin cluster

The file named `kubeconfig` enables access to the admin cluster.


```
kubectl --kubeconfig ~/kubeconfigs/kubeconfig get nodes

NAME              STATUS   ROLES    AGE     VERSION
gmcg-gke-admin1   Ready    master   26h     v1.16.8-gke.6
gmcg-gke-admin2   Ready    <none>   26h     v1.16.8-gke.6
gmcg-gke-admin3   Ready    <none>   26h     v1.16.8-gke.6
gmcg-gke-admin4   Ready    <none>   7h40m   v1.16.8-gke.6
```


## User cluster

The names of the kubeconfig files for your user clusters are prefixed with the appropriate cluster name.
In the following example, the cluster name is `gmcg-gke-usercluster-1`:


```
kubectl --kubeconfig ~/kubeconfigs/gmcg-gke-usercluster-1-kubeconfig get nodes

NAME                   STATUS   ROLES    AGE     VERSION
gmcg-gke-user1-node1   Ready    <none>   7h38m   v1.16.8-gke.6
gmcg-gke-user1-node2   Ready    <none>   7h38m   v1.16.8-gke.6
gmcg-gke-user1-node3   Ready    <none>   7h39m   v1.16.8-gke.6
gmcg-gke-user1-node4   Ready    <none>   7h38m   v1.16.8-gke.6
```


## KUBECONFIG

Instead of using the `--kubeconfig` option, you can set an environment variable to point at the kubeconfig file you wish to use:

```
export KUBECONFIG=~/kubeconfigs/gmcg-gke-usercluster-1-kubeconfig
```

Now you can re-run the `kubectl get nodes` command without the `--kubeconfig` option to see the nodes in the user cluster:

```
kubectl get nodes

NAME                   STATUS   ROLES    AGE    VERSION
gmcg-gke-user1-node1   Ready    <none>   7h38m   v1.16.8-gke.6
gmcg-gke-user1-node2   Ready    <none>   7h38m   v1.16.8-gke.6
gmcg-gke-user1-node3   Ready    <none>   7h39m   v1.16.8-gke.6
gmcg-gke-user1-node4   Ready    <none>   7h38m   v1.16.8-gke.6
```

## Working with multiple clusters

You can add multiple kubeconfig files to the KUBECONFIG variable:

```
export KUBECONFIG=/home/ubuntu/kubeconfigs/kubeconfig:/home/ubuntu/kubeconfigs/gmcg-gke-usercluster-1-kubeconfig
```

Use the `kubectl config view` command to see the contexts available:

```
kubectl config view

apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: DATA+OMITTED
    server: https://10.15.158.63:443
  name: cluster
- cluster:
    certificate-authority-data: DATA+OMITTED
    server: https://10.15.158.61:443
  name: kubernetes
contexts:
- context:
    cluster: cluster
    user: user
  name: cluster
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: cluster
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: REDACTED
    client-key-data: REDACTED
- name: user
  user:
    client-certificate-data: REDACTED
    client-key-data: REDACTED
```


To switch to the user cluster:

```
kubectl config use-context cluster

Switched to context "cluster".
```

Now list the nodes for the user cluster:

```
kubectl get nodes

NAME                   STATUS   ROLES    AGE    VERSION
gmcg-gke-user1-node1   Ready    <none>   7h38m   v1.16.8-gke.6
gmcg-gke-user1-node2   Ready    <none>   7h38m   v1.16.8-gke.6
gmcg-gke-user1-node3   Ready    <none>   7h39m   v1.16.8-gke.6
gmcg-gke-user1-node4   Ready    <none>   7h38m   v1.16.8-gke.6
```

To switch to the admin cluster:

```
kubectl config use-context kubernetes-admin@kubernetes

Switched to context "kubernetes-admin@kubernetes".
```

## kubectx

When working with multiple clusters, it can be useful to use the `kubectx` tool to manage access. Download the
`kubectx` software:

```
git clone https://github.com/ahmetb/kubectx
```

Add the location of the `kubectx` program to your PATH variable so that you can easily use the command from any location.

When you use the `kubectx` on its own, it will list the available contexts:

```
kubectx

cluster
kubernetes-admin@kubernetes
```

To switch to the user cluster (named `cluster`), add the name to the command:

```
kubectx cluster

Switched to context "cluster".
```

The `kubectx - ` command enables you to easily switch between contexts.

```
$ kubectx kubernetes-admin@kubernetes
Switched to context "kubernetes-admin@kubernetes".
$kubectx -
Switched to context "cluster".
$ kubectx -
Switched to context "kubernetes-admin@kubernetes".
```
