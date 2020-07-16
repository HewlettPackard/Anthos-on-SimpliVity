# Deploying Kiali

Kiali helps you to visualize different aspects of your Istio mesh. For more information, see the Istio 1.6 documentation for using Kiali at
[https://istio.io/latest/docs/tasks/observability/kiali/](https://istio.io/latest/docs/tasks/observability/kiali/).


## Create Kiali secret

Create a secret in your Istio namespace with the credentials that you use to authenticate to Kiali.

First, define the credentials you want to use as the Kiali username and passphrase.

Enter a Kiali username when prompted:

```
KIALI_USERNAME=$(read -p 'Kiali Username: ' uval && echo -n $uval | base64)
```

Enter a Kiali passphrase when prompted:

```
KIALI_PASSPHRASE=$(read -sp 'Kiali Passphrase: ' pval && echo -n $pval | base64)
```


Create the Kiali secret:

```
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: kiali
  namespace: istio-system
  labels:
    app: kiali
type: Opaque
data:
  username: $KIALI_USERNAME
  passphrase: $KIALI_PASSPHRASE
EOF
```

## Enable Kiali in Istio

The `istioctl` binary is available in the Istio installation director, for example:

```
/home/ubuntu/istio-1.6.4-asm.9/bin
```

Use the `istioctl` command to configure Kiali:

```
istioctl manifest apply --set values.kiali.enabled=true
```

To verify that the service is running in your cluster, run the following command:

```
kubectl -n istio-system get svc kiali

NAME    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)     AGE
kiali   ClusterIP   10.96.110.173   <none>        20001/TCP   61s
```


To access the Kiali interface, you can use port forwarding, or patch the service to create a LoadBalancer:

```
kubectl -n istio-system patch svc kiali    --type merge --patch '{"spec":{"loadBalancerIP": "10.15.158.99","type":"LoadBalancer"}}'
```

Check that the service has changed:

```
kubectl -n istio-system get svc kiali  

NAME    TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)           AGE
kiali   LoadBalancer   10.96.110.173   10.15.158.99   20001:30248/TCP   17m
```

You can now access the cluster externally at `http://10.15.158.99:20001/`  or internally at  `http://10.15.155.124:30248/`.

Log in with the username/password combination you specified when creating the Kiali secret.

![ "Kiali dashboard"][kiali-dashboard-png]

**Figure.** Kiali dashboard


## Create load

Use the `watch` command with `curl` to access the homepage every second.

```
watch -n 1 curl -o /dev/null -s -w %{http_code} 10.15.158.55/productpage
```

## View the `Versioned app graph`  for the Bookinfo application

Choose `Graph` in the navigator section on the left hand side of the UI. Then, ensure that `bookinfo` is  selected
as the namespace and  choose `Versioned app graph` as the graph type.

![ "Kiali Versioned app graph"][kiali-versioned-app-graph-png]

**Figure.** Kiali Versioned app graph


## View distribution of requests

You can modify the graph to show the distribution of requests across the three versions of the reviews service.

- Make sure you select `Requests percentage` in the "Edge Labels" drop down menu to see the percentage of traffic routed to each workload.
- Make sure you select the `Service Nodes` check box in the "Display" drop down menu to view the service nodes in the graph.


![ "Kiali requests percentage"][kiali-all-3-png]

**Figure.** Kiali requests percentage

The graph shows the requests are distributed equally across the three versions of the reviews service.


[kiali-dashboard-png]:<../images/kiali-dashboard.png>
[kiali-versioned-app-graph-png]:<../images/kiali-versioned-app-graph.png>
[kiali-all-3-png]:<../images/kiali-all-3.png>

