## Teardown


### Kiali teardown

To remove Kiali from a Kubernetes environment, remove all components with the `app=kiali` label:

```
kubectl delete all,secrets,sa,configmaps,deployments,ingresses,clusterroles,clusterrolebindings,customresourcedefinitions --selector=app=kiali -n istio-system
```


### Bookinfo application teardown

TODO