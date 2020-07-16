# Service mesh sample application - Bookinfo

## Bookinfo application overview

The example deploys a sample application composed of four separate microservices used to demonstrate various Istio features. The application displays information about a book, similar to a single catalog entry of an online book store. Displayed on the page is a description of the book, book details (ISBN, number of pages, and so on), and a few book reviews.

The Bookinfo application is broken into four separate microservices:

- **productpage:** The productpage microservice calls the details and reviews microservices to populate the page.
- **details:** The details microservice contains book information.
- **reviews:** The reviews microservice contains book reviews. It also calls the ratings microservice.
- **ratings:** The ratings microservice contains book ranking information that accompanies a book review.


There are 3 versions of the reviews microservice:

- Version `v1` doesn’t call the ratings service.
- Version `v2` calls the ratings service, and displays each rating as 1 to 5 black stars.
- Version `v3` calls the ratings service, and displays each rating as 1 to 5 red stars.

The end-to-end architecture of the application is shown below.

![ "Bookinfo application"][bookinfo-overview-png]

**Figure.** Bookinfo application

## Deploy the Bookinfo application

### Connect to your admin workstation

Connect to your admin workstation, using the appropriate IP address:

```
ssh -i /root/anthos_secrets/vsphere_workstation ubuntu@10.15.155.200
```


### Configure KUBECONFIG

Configure KUBECONFIG, using the appropriate  cluster name:

```
export KUBECONFIG=~/kubeconfigs/gmcg-gke-usercluster-1-kubeconfig
```

### Create namespace

Create a namespace for the application:

```
kubectl create namespace bookinfo

namespace/bookinfo created
```

### Enable Istio injection for namespace

If you have already deployed Service Mesh to the user cluster,  
you can simply use `kubectl` to enable Istio injection for the namespace:

```
kubectl label namespace bookinfo istio-injection=enabled
```

Otherwise, you need to [configure](../core-config/service-mesh-config) and [run](../playbooks/playbook-service-mesh) the Service Mesh playbook.  To summarize, you need to set `anthos_service_mesh_enable: true` and add the `'bookinfo'` namespace to the list of enabled namespaces in the `all.yml` configuration file:

```
gke_cluster_config:
    - name: 'user-cluster-1'
      type: 'user'
      ...
      anthos_service_mesh_enable: true
      anthos_service_mesh_externalIP: '10.15.158.55'
      anthos_service_mesh_sidecar_enable: ['bookinfo']
```

Run the `service_mesh.yml` playbook:

```
ansible-playbook playbooks/service_mesh.yml  
```

### Check that Istio injection has been enabled

Check that the namespace has been annotated correctly with `istio-injection: enabled`.

```
kubectl get namespace bookinfo -o yaml

apiVersion: v1
kind: Namespace
metadata:
  creationTimestamp: "2020-06-17T15:53:30Z"
  labels:
    istio-injection: enabled
  name: bookinfo
  resourceVersion: "661536"
  selfLink: /api/v1/namespaces/bookinfo
  uid: 403dadce-c754-410f-a2ee-39374bedcfe8
spec:
  finalizers:
  - kubernetes
status:
  phase: Active
```

### Deploying the Bookinfo application

Download the manifest for deploying the application:

```
curl https://raw.githubusercontent.com/istio/istio/release-1.6/samples/bookinfo/platform/kube/bookinfo.yaml > bookinfo.yaml
```



Deploy the application in the namepsace:

```
kubectl -n bookinfo apply -f bookinfo.yaml

service/details created
serviceaccount/bookinfo-details created
deployment.apps/details-v1 created
service/ratings created
serviceaccount/bookinfo-ratings created
deployment.apps/ratings-v1 created
service/reviews created
serviceaccount/bookinfo-reviews created
deployment.apps/reviews-v1 created
deployment.apps/reviews-v2 created
deployment.apps/reviews-v3 created
service/productpage created
serviceaccount/bookinfo-productpage created
deployment.apps/productpage-v1 created
```

View the resources deployed:

```
kubectl -n bookinfo get deployment

NAME             READY   UP-TO-DATE   AVAILABLE   AGE
details-v1       1/1     1            1           5m58s
productpage-v1   1/1     1            1           5m58s
ratings-v1       1/1     1            1           5m58s
reviews-v1       1/1     1            1           5m58s
reviews-v2       1/1     1            1           5m58s
reviews-v3       1/1     1            1           5m58s


kubectl -n bookinfo get pods

NAME                              READY   STATUS    RESTARTS   AGE
details-v1-7f6df6f54-cxkdx        2/2     Running   0          6m29s
productpage-v1-69886c8bcb-4g5q9   2/2     Running   0          6m29s
ratings-v1-6665bbd4db-srbmt       2/2     Running   0          6m29s
reviews-v1-7fd87d96bd-74z49       2/2     Running   0          6m29s
reviews-v2-55d9bfb6d8-2gmj5       2/2     Running   0          6m29s
reviews-v3-5776c54c64-rn86f       2/2     Running   0          6m29s


kubectl -n bookinfo get svc

NAME          TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
details       ClusterIP   10.104.35.78     <none>        9080/TCP   6m54s
productpage   ClusterIP   10.96.108.148    <none>        9080/TCP   6m54s
ratings       ClusterIP   10.103.184.167   <none>        9080/TCP   6m54s
reviews       ClusterIP   10.96.117.99     <none>        9080/TCP   6m54s

```

Notice that there is a **sidecar** container `istio-proxy` in each pod:

```
kubectl -n bookinfo describe pod productpage

Name:           productpage-v1-69886c8bcb-4g5q9
Namespace:      bookinfo
Priority:       0
Node:           gmcg-gke-user1-node2/10.15.155.122
Start Time:     Wed, 17 Jun 2020 16:00:36 +0000
Labels:         app=productpage
                pod-template-hash=69886c8bcb
                security.istio.io/tlsMode=istio
                version=v1
Annotations:    cni.projectcalico.org/podIP: 192.168.0.23/32
                sidecar.istio.io/status:
                  {"version":"06276c8f39527e9d938cdb12b45ed9dda7fc3bedca74d940552168bfc3d957cc","initContainers":["istio-init"],"containers":["istio-proxy"]...
...
Containers:
  productpage:
    Container ID:   docker://927727491ccd40378e22e5a27f2388e3890689f6f88b997b4092d9d613e4c45c
    Image:          docker.io/istio/examples-bookinfo-productpage-v1:1.15.1
    Image ID:       docker-pullable://istio/examples-bookinfo-productpage-v1@sha256:d54717a1bd3c8e4a12fa887aadbb764e594099a255b3b892da1483a528b6856c
    Port:           9080/TCP
    ...
  istio-proxy:
    Container ID:  docker://f6d2863e728d3919171d80975af5255167a8a33377645588a1b7647578e69ca8
    Image:         gcr.io/gke-release/asm/proxyv2:1.4.9-asm.1
    Image ID:      docker-pullable://gcr.io/gke-release/asm/proxyv2@sha256:4661ed09fb7f0450aecd2c7cb6aa42ea697955f88b32920437796d6de5b9669e
    Port:          15090/TCP
```


### Test the application

Use `curl` to ensure that the application is running. 

```
kubectl -n bookinfo exec -it "$(kubectl -n bookinfo get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}')" -c ratings -- curl productpage:9080/productpage | grep -o "<title>.*</title>"
```

The application title should be returned.

```
<title>Simple Bookstore App</title>
```

### Deploy the gateway

Download the appropriate manifest file:

```
curl https://raw.githubusercontent.com/istio/istio/release-1.6/samples/bookinfo/networking/bookinfo-gateway.yaml > bookinfo-gateway.yaml
```

Deploy the gateway in the namespace:

```
kubectl -n bookinfo apply -f bookinfo-gateway.yaml

gateway.networking.istio.io/bookinfo-gateway created
virtualservice.networking.istio.io/bookinfo created
```

Determine the ingress IP:

```
kubectl get svc istio-ingressgateway -n istio-system

NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)                                                                                                                      AGE
istio-ingressgateway   LoadBalancer   10.110.50.233   10.15.158.55   15020:30970/TCP,80:32417/TCP,443:30921/TCP,15029:32551/TCP,15030:30335/TCP,15031:30934/TCP,15032:31978/TCP,15443:31414/TCP   4h57m
```

**Note:** The ingress IP will match the value in the variable `gke_cluster_config.anthos_service_mesh_externalIP` in the `all.yml`
configuration file.



### Confirm the application is accessible from outside the cluster

Using the ingress IP, you can use `curl` to access the application homepage, for example:

```
 curl -s "http://10.15.158.55/productpage" | grep -o "<title>.*</title>"
```

The application title should be returned.

```
<title>Simple Bookstore App</title>
```

Alternatively, browse to the URL, for example, `http://10.15.158.55/productpage`:

![ "Bookinfo homepage"][servicemesh-productpage1-png]

**Figure.** Bookinfo homepage


### Access the application using an interal address

In the output for the service `istio-ingressgateway` above, notice that port `80` is mapped to port `32417`. 
This means that you can access the application using the internal IP address for any node in your user cluster, along with port `32417`. 

 You can easily discover 
the IP addresses of your nodes using the `-o wide` flag on the `kubectl get nodes` command. In the sample user cluster, the four IP addresses are statically configured as `10.15.155.121-124`.



```
kubectl get nodes -o wide

NAME                   STATUS   ROLES    AGE    VERSION          INTERNAL-IP     EXTERNAL-IP     OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
gmcg-gke-user1-node1   Ready    <none>   2d2h   v1.16.8-gke.6   10.15.155.121   10.15.155.121   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
gmcg-gke-user1-node2   Ready    <none>   2d2h   v1.16.8-gke.6   10.15.155.122   10.15.155.122   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
gmcg-gke-user1-node3   Ready    <none>   2d2h   v1.16.8-gke.6   10.15.155.123   10.15.155.123   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
gmcg-gke-user1-node4   Ready    <none>   2d2h   v1.16.8-gke.6   10.15.155.124   10.15.155.124   Ubuntu 18.04.4 LTS   5.3.0-53-generic   docker://19.3.2
```
 
Using the IP address of one of the nodes, together with port (in this instance `32417`), you can use `curl` or the browser to access the application homepage:

```
curl http://10.15.155.124:32417/productpage
```

![ "Bookinfo homepage using internal address"][servicemesh-productpage-internal-png]

**Figure.** Bookinfo homepage using internal address

### Multiple version of the reviews service

All 3 versions of the reviews service, `v1`, `v2`, and `v3`, are deployed at the same time.
As a result, when  you refresh the homepage, you should see different ratings output
(black stars, red stars or no stars).

![ "Bookinfo homepage - black stars"][servicemesh-productpage2-png]

**Figure.** Bookinfo homepage - black stars

![ "Bookinfo homepage - red stars"][servicemesh-productpage3-png]

**Figure.** Bookinfo homepage - red stars


In a realistic deployment, new versions of a microservice are deployed over time instead of deploying all versions simultaneously.

[bookinfo-overview-png]:<../images/bookinfo-overview.png>
[servicemesh-productpage1-png]:<../images/servicemesh-productpage1.png>
[servicemesh-productpage-internal-png]:<../images/servicemesh-productpage-internal.png>
[servicemesh-productpage2-png]:<../images/servicemesh-productpage2.png>
[servicemesh-productpage3-png]:<../images/servicemesh-productpage3.png>