# Service mesh configuration

Google Cloud’s fully managed service mesh lets you manage complex microservices architectures so that you can
get all the benefits of microservices without the overheads. It allows you to configure, control, secure and
monitor your services in one place, taking a significant burden off your operations and development teams.
More information on Anthos Service Mesh is available at
[https://cloud.google.com/anthos/service-mesh](https://cloud.google.com/anthos/service-mesh).


## User cluster configuration

General cluster config is supplied in the fields of the `gke_cluster_config` structure in the `all.yml` file.

|Field|Description|Value|
|:-------|:---|:----------|
|`anthos_service_mesh_enable`|Set to `true` if you wish to enable service mesh on the cluster.|Default is `false`|
|`anthos_service_mesh_externalIP`|The external IP for the service mesh load balancer|For example, `'172.17.0.29'`|
|`anthos_service_mesh_sidecar_enable`|A list of namespaces where Istio sidecar injection will be enabled.|For example, `['hipster']`|

An example for service mesh configuration in a user cluster is shown below:

```
gke_cluster_config:
    - name: 'user-cluster-1'
      type: 'user'
      ...
      anthos_service_mesh_enable: true
      anthos_service_mesh_externalIP: '172.17.0.29'  
      anthos_service_mesh_sidecar_enable: ['hipster'] 
```

## Service mesh version

The version of service mesh deployed is determined by the values of the variables in the file
`playbooks/roles/gke_cluster_config/service_mesh/vars/main.yml`:

```
service_mesh_namespace: istio-system
service_mesh_version: 'istio-1.6.4-asm.9'
service_mesh_platform: 'linux-amd64'

istio_tar_file_url: https://storage.googleapis.com/gke-release/asm/{{ service_mesh_version }}-{{ service_mesh_platform }}.tar.gz
istio_tar_file_sig: https://storage.googleapis.com/gke-release/asm/{{ service_mesh_version }}-{{ service_mesh_platform }}.tar.gz.1.sig
```