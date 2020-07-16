# Deploying service mesh


## Prerequsites

- Admin and user clusters deployed successfully
- Configuration completed as described in the section [Service mesh configuration](../config-core/service-mesh-config)


## Command

```
cd ~/Anthos-on-SimpliVity

ansible-playbook playbooks/service_mesh.yml  --ask-vault-pass
```

## Tasks performed

- Downloads and unpacks Istio from <<istio_tar_file_url>>
- For each user cluster that has `anthos_service_mesh_enable: true`
  - Create Namespace `istio-system`
  - Copy required root cert into `istio-system` namespace
  - Use `istioctl` to deploy Service Mesh package
  - Wait for completion of service mesh deployment
  - Update the External IP for the LoadBalancer `anthos_service_mesh_externalIP`
  - Annotate namespaces to enable istio sidecar injection `anthos_service_mesh_sidecar_enable`


## Resources deployed


```
kubectl -n istio-system get deployment

NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
istio-citadel            1/1     1            1           23h
istio-galley             1/1     1            1           23h
istio-ingressgateway     1/1     1            1           23h
istio-pilot              1/1     1            1           23h
istio-sidecar-injector   1/1     1            1           23h
promsd                   1/1     1            1           23h
 

kubectl -n istio-system get pods

NAME                                      READY   STATUS    RESTARTS   AGE
istio-citadel-64f6d7c7c7-vqqhb            1/1     Running   0          23h
istio-galley-6b4878d445-784dn             2/2     Running   0          23h
istio-ingressgateway-6f497c5df9-24ngz     2/2     Running   0          23h
istio-pilot-7f4fdcb89c-7km97              2/2     Running   0          23h
istio-sidecar-injector-65cbd565b9-9mh9x   1/1     Running   0          23h
promsd-78dfdf7c7d-4dctv                   2/2     Running   1          23h


kubectl -n istio-system get svc

NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)                                                                                                                      AGE
istio-citadel            ClusterIP      10.109.193.37    <none>         8060/TCP,15014/TCP                                                                                                           23h
istio-galley             ClusterIP      10.110.158.217   <none>         443/TCP,15014/TCP,9901/TCP,15019/TCP                                                                                         23h
istio-ingressgateway     LoadBalancer   10.110.50.233    10.15.158.55   15020:30970/TCP,80:32417/TCP,443:30921/TCP,15029:32551/TCP,15030:30335/TCP,15031:30934/TCP,15032:31978/TCP,15443:31414/TCP   23h
istio-pilot              ClusterIP      10.111.151.231   <none>         15010/TCP,15011/TCP,8080/TCP,15014/TCP                                                                                       23h
istio-sidecar-injector   ClusterIP      10.108.98.178    <none>         443/TCP                                                                                                                      23h
promsd                   ClusterIP      10.104.44.116    <none>         9090/TCP                                                                                                                     23h

```


## Teardown

To remove service mesh, delete the appropiate namespace:


```
kubectl delete namespace istio-system
```


