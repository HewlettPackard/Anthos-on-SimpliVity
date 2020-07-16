# Deploying an application

This page shows how to deploy an application in your user cluster.


## Connect to your admin workstation

```
ssh -i /root/anthos_secrets/vsphere_workstation ubuntu@10.15.155.200
```


## Configure KUBECONFIG

Configure KUBECONFIG, using the appropriate user cluster name, for example:

```
export KUBECONFIG=~/kubeconfigs/gmcg-gke-usercluster-1-kubeconfig
```


## Create a deployment

Create a manifest file named `my-deployment.yaml` with the following content:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  selector:
    matchLabels:
      app: metrics
      department: sales
  replicas: 3
  template:
    metadata:
      labels:
        app: metrics
        department: sales
    spec:
      containers:
      - name: hello
        image: "gcr.io/google-samples/hello-app:2.0"
```

Create the deployment using the manifest:

```
kubectl  apply -f my-deployment.yaml

deployment.apps/my-deployment created
```

Get basic information about your deployment:

```
kubectl  get deployment my-deployment

NAME            READY   UP-TO-DATE   AVAILABLE   AGE
my-deployment   3/3     3            3           11s
```

List the pods in your deployment:

```
kubectl get pods

NAME                             READY   STATUS    RESTARTS   AGE
my-deployment-78ff9649f5-mjjqc   1/1     Running   0          25s
my-deployment-78ff9649f5-rxnvr   1/1     Running   0          25s
my-deployment-78ff9649f5-xdx7p   1/1     Running   0          25s
```

## Create a service

One way to expose your deployment to clients outside your cluster is to create a Kubernetes service of type `LoadBalancer`.

Create a manifest named `my-service.yaml` with content similar to the example below. The `loadBalancerIP` in the example
is an IP address on the network configured in F5 with `external_vlan_name` set to `external`. 
The IP address you choose must not already be in use and must be routable from the location of any client that sends requests to the Service.

```
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: metrics
    department: sales
  type: LoadBalancer
  loadBalancerIP: 10.15.158.88
  ports:
  - port: 80
    targetPort: 8080
```

When you create the Service, GKE on-prem automatically configures the `loadBalancerIP` address on your F5 BIG-IP load balancer.

```
kubectl  apply -f my-service.yaml

service/my-service created
```

View your service:

```
kubectl  get svc my-service

NAME         TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)        AGE
kubernetes   ClusterIP      10.96.0.1     <none>         443/TCP        175m
my-service   LoadBalancer   10.101.9.20   10.15.158.88   80:32392/TCP   11s
```


For more detailed output, generate `yaml` output:

```
kubectl  get svc my-service -o yaml

apiVersion: v1
kind: Service
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"name":"my-service","namespace":"default"},"spec":{"loadBalancerIP":"10.15.158.88","ports":[{"port":80,"targetPort":8080}],"selector":{"app":"metrics","department":"sales"},"type":"LoadBalancer"}}
  creationTimestamp: "2020-06-15T20:26:29Z"
  name: my-service
  namespace: default
  resourceVersion: "40311"
  selfLink: /api/v1/namespaces/default/services/my-service
  uid: e1b2655e-d352-44fe-be0e-cd65382e0a55
spec:
  clusterIP: 10.101.9.20
  externalTrafficPolicy: Cluster
  loadBalancerIP: 10.15.158.88
  ports:
  - nodePort: 32392
    port: 80
    protocol: TCP
    targetPort: 8080
  selector:
    app: metrics
    department: sales
  sessionAffinity: None
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 10.15.158.88
```


## Access the service

In this scenario, a client sends a request to the `loadBalancerIP` address `10.15.158.88` on TCP port `80`.
The request gets routed to your F5 BIG-IP load balancer. The load balancer chooses one of your user cluster nodes,
and forwards the request to the node address on TCP port `32392`. The iptables rules on the node forward
the request to a member pod on TCP port `8080`.

```
curl 10.15.158.88

Hello, world!
Version: 2.0.0
```

## Teardown

Remove the deployed application using the following commands:

```
kubectl delete svc my-service
kubectl delete deployment my-deployment
```