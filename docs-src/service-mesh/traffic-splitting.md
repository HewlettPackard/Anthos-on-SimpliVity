
## Managing traffic

### Destination rules

Before you can use Istio to control the Bookinfo version routing, you need to define the available versions, called subsets, in destination rules. 

The service mesh playbook does not currently enable mutual TLS, so download the appropriate manifest for destination rules.

```
curl https://raw.githubusercontent.com/istio/istio/release-1.6/samples/bookinfo/networking/destination-rule-all.yaml > destination-rule-all.yaml
```

Deploy the destination rules:

```
kubectl -n bookinfo apply -f destination-rule-all.yaml

destinationrule.networking.istio.io/productpage created
destinationrule.networking.istio.io/reviews created
destinationrule.networking.istio.io/ratings created
destinationrule.networking.istio.io/details created
```



### Route all traffic to one service

Route all traffic to the `v1` version of the services by applying the file `virtual-service-all-v1.yaml`.

Download the appropriate manifest:

```
curl https://raw.githubusercontent.com/istio/istio/release-1.6/samples/bookinfo/networking/virtual-service-all-v1.yaml >  virtual-service-all-v1.yaml
```

If you examine the file, you will see that all reviews are routed to `v1` of the reviews serivce, i.e. the version that 
produces no stars:

```
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - route:
    - destination:
        host: ratings
        subset: v1
```


Deploy the virtual services:

```
kubectl -n bookinfo apply -f virtual-service-all-v1.yaml

virtualservice.networking.istio.io/productpage created
virtualservice.networking.istio.io/reviews created
virtualservice.networking.istio.io/ratings created
virtualservice.networking.istio.io/details created
```

Now, when you refresh the product page in your browser, you will now only ever see the reviews without any
(black or red) star ratings. In the Kiali versioned app graph, the percentage of requests for `v1` of the reviews
service will grow to 100% while the percentage for the other two versions will drop to zero over time.


![ "Kiali requests percentage for v1"][kiali-all-v1-png]

**Figure.** Kiali requests percentage for `v1`

### Splitting traffic between versions

You can split the traffic 50/50 between `v1` and `v3` of the reviews service by applying the file `virtual-service-reviews-50-v3.yaml`.

Download the appropriate manifest:

```
curl https://raw.githubusercontent.com/istio/istio/release-1.6/samples/bookinfo/networking/virtual-service-reviews-50-v3.yaml > virtual-service-reviews-50-v3.yaml
```

In the manifest, you will see that the `v1` and `v3` destinations for the reviews service both have a `weight: 50`
meaning the traffic will be split equally between these two versions.

```
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 50
    - destination:
        host: reviews
        subset: v3
      weight: 50
```


Deploy the updated virtual service:

```
kubectl -n bookinfo apply -f virtual-service-reviews-50-v3.yaml

virtualservice.networking.istio.io/reviews configured
```

Wait a few seconds for the new rules to propagate. Now, refresh the homepage in your browser and you should see red
colored star ratings approximately 50% of the time (`v3`), with the other 50% having no stars (`v1`). In the Kiali
versioned app graph, the percentage of request going to the `v1` service will drop fromm 100% to 50%, while the `v3`
service will grow from 0% to 50%.

!["Kiali 50-50 split"][kiali-50-50-png]

**Figure.** Kiali 50-50 split

[kiali-all-v1-png]:<../images/kiali-all-v1.png>
[kiali-50-50-png]:<../images/kiali-50-50.png>