(window.webpackJsonp=window.webpackJsonp||[]).push([[46],{461:function(e,a,t){"use strict";t.r(a);var n=t(45),s=Object(n.a)({},(function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"deploying-an-application"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#deploying-an-application"}},[e._v("#")]),e._v(" Deploying an application")]),e._v(" "),t("p",[e._v("This page shows how to deploy an application in your user cluster.")]),e._v(" "),t("h2",{attrs:{id:"connect-to-your-admin-workstation"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#connect-to-your-admin-workstation"}},[e._v("#")]),e._v(" Connect to your admin workstation")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("ssh -i /root/anthos_secrets/vsphere_workstation ubuntu@10.15.155.200\n")])])]),t("h2",{attrs:{id:"configure-kubeconfig"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#configure-kubeconfig"}},[e._v("#")]),e._v(" Configure KUBECONFIG")]),e._v(" "),t("p",[e._v("Configure KUBECONFIG, using the appropriate user cluster name, for example:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("export KUBECONFIG=~/kubeconfigs/gmcg-gke-usercluster-1-kubeconfig\n")])])]),t("h2",{attrs:{id:"create-a-deployment"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#create-a-deployment"}},[e._v("#")]),e._v(" Create a deployment")]),e._v(" "),t("p",[e._v("Create a manifest file named "),t("code",[e._v("my-deployment.yaml")]),e._v(" with the following content:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: my-deployment\nspec:\n  selector:\n    matchLabels:\n      app: metrics\n      department: sales\n  replicas: 3\n  template:\n    metadata:\n      labels:\n        app: metrics\n        department: sales\n    spec:\n      containers:\n      - name: hello\n        image: "gcr.io/google-samples/hello-app:2.0"\n')])])]),t("p",[e._v("Create the deployment using the manifest:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("kubectl  apply -f my-deployment.yaml\n\ndeployment.apps/my-deployment created\n")])])]),t("p",[e._v("Get basic information about your deployment:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("kubectl  get deployment my-deployment\n\nNAME            READY   UP-TO-DATE   AVAILABLE   AGE\nmy-deployment   3/3     3            3           11s\n")])])]),t("p",[e._v("List the pods in your deployment:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("kubectl get pods\n\nNAME                             READY   STATUS    RESTARTS   AGE\nmy-deployment-78ff9649f5-mjjqc   1/1     Running   0          25s\nmy-deployment-78ff9649f5-rxnvr   1/1     Running   0          25s\nmy-deployment-78ff9649f5-xdx7p   1/1     Running   0          25s\n")])])]),t("h2",{attrs:{id:"create-a-service"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#create-a-service"}},[e._v("#")]),e._v(" Create a service")]),e._v(" "),t("p",[e._v("One way to expose your deployment to clients outside your cluster is to create a Kubernetes service of type "),t("code",[e._v("LoadBalancer")]),e._v(".")]),e._v(" "),t("p",[e._v("Create a manifest named "),t("code",[e._v("my-service.yaml")]),e._v(" with content similar to the example below. The "),t("code",[e._v("loadBalancerIP")]),e._v(" in the example\nis an IP address on the network configured in F5 with "),t("code",[e._v("external_vlan_name")]),e._v(" set to "),t("code",[e._v("external")]),e._v(".\nThe IP address you choose must not already be in use and must be routable from the location of any client that sends requests to the Service.")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("apiVersion: v1\nkind: Service\nmetadata:\n  name: my-service\nspec:\n  selector:\n    app: metrics\n    department: sales\n  type: LoadBalancer\n  loadBalancerIP: 10.15.158.88\n  ports:\n  - port: 80\n    targetPort: 8080\n")])])]),t("p",[e._v("When you create the Service, GKE on-prem automatically configures the "),t("code",[e._v("loadBalancerIP")]),e._v(" address on your F5 BIG-IP load balancer.")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("kubectl  apply -f my-service.yaml\n\nservice/my-service created\n")])])]),t("p",[e._v("View your service:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("kubectl  get svc my-service\n\nNAME         TYPE           CLUSTER-IP    EXTERNAL-IP    PORT(S)        AGE\nkubernetes   ClusterIP      10.96.0.1     <none>         443/TCP        175m\nmy-service   LoadBalancer   10.101.9.20   10.15.158.88   80:32392/TCP   11s\n")])])]),t("p",[e._v("For more detailed output, generate "),t("code",[e._v("yaml")]),e._v(" output:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('kubectl  get svc my-service -o yaml\n\napiVersion: v1\nkind: Service\nmetadata:\n  annotations:\n    kubectl.kubernetes.io/last-applied-configuration: |\n      {"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"name":"my-service","namespace":"default"},"spec":{"loadBalancerIP":"10.15.158.88","ports":[{"port":80,"targetPort":8080}],"selector":{"app":"metrics","department":"sales"},"type":"LoadBalancer"}}\n  creationTimestamp: "2020-06-15T20:26:29Z"\n  name: my-service\n  namespace: default\n  resourceVersion: "40311"\n  selfLink: /api/v1/namespaces/default/services/my-service\n  uid: e1b2655e-d352-44fe-be0e-cd65382e0a55\nspec:\n  clusterIP: 10.101.9.20\n  externalTrafficPolicy: Cluster\n  loadBalancerIP: 10.15.158.88\n  ports:\n  - nodePort: 32392\n    port: 80\n    protocol: TCP\n    targetPort: 8080\n  selector:\n    app: metrics\n    department: sales\n  sessionAffinity: None\n  type: LoadBalancer\nstatus:\n  loadBalancer:\n    ingress:\n    - ip: 10.15.158.88\n')])])]),t("h2",{attrs:{id:"access-the-service"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#access-the-service"}},[e._v("#")]),e._v(" Access the service")]),e._v(" "),t("p",[e._v("In this scenario, a client sends a request to the "),t("code",[e._v("loadBalancerIP")]),e._v(" address "),t("code",[e._v("10.15.158.88")]),e._v(" on TCP port "),t("code",[e._v("80")]),e._v(".\nThe request gets routed to your F5 BIG-IP load balancer. The load balancer chooses one of your user cluster nodes,\nand forwards the request to the node address on TCP port "),t("code",[e._v("32392")]),e._v(". The iptables rules on the node forward\nthe request to a member pod on TCP port "),t("code",[e._v("8080")]),e._v(".")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("curl 10.15.158.88\n\nHello, world!\nVersion: 2.0.0\n")])])]),t("h2",{attrs:{id:"teardown"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#teardown"}},[e._v("#")]),e._v(" Teardown")]),e._v(" "),t("p",[e._v("Remove the deployed application using the following commands:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("kubectl delete svc my-service\nkubectl delete deployment my-deployment\n")])])])])}),[],!1,null,null,null);a.default=s.exports}}]);