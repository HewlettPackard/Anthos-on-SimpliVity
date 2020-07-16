# Deploying WordPress with CSI storage

WordPress uses a database to store posts and comments, while it stores other assets including images, CSS and 
Javascript files in a separate filestore. In this example, two persistent volume claims (PVCs) are deployed using
the HPE SimpliVity CSI Driver, one for the MySQL datadase and the other for the WordPress filestore. 

## Deploy WordPress with MySQL

To deploy WordPress with MySQL on a user cluster, you will need to:

- Connect to the admin workstation
- Configure access to the user cluster
- Use manifest files to deploy the required resources

### Connect to your admin workstation

Connect to your admin workstation, using the appropriate IP address:

```
ssh -i /root/anthos_secrets/vsphere_workstation ubuntu@10.15.155.200
```


### Configure KUBECONFIG

Configure KUBECONFIG, using the appropriate user cluster name, for example:

```
export KUBECONFIG=~/kubeconfigs/gmcg-gke-usercluster-1-kubeconfig
```

### Create namespace


Create a file named `wordpress-mysql-namespace.yml` with the following content:

```
apiVersion: v1
kind: Namespace
metadata:
  name:  'wordpress-mysql'
```

Create the namespace:

```
kubectl apply -f wordpress-mysql-namespace.yml

namespace/wordpress-mysql created
```

### Create secret for MySQL

Create a file named `mysql-password.yml` with the following content:

```
apiVersion: v1
data:
  password: cGFzc3dvcmQ=
kind: Secret
metadata:
  name: mysql-pass
  namespace: wordpress-mysql
```

Create the secret:

```
kubectl -n wordpress-mysql  apply -f secret-password.yml

secret/mysql-pass created
```

### Create PVC for MySQL

Create a file named `mysql-pvc.yml` with the following content, updating the storage class with your CSI storage class for the user cluster:

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pv-claim
  labels:
    app: wordpress
  annotations:
    volume.beta.kubernetes.io/storage-class: 'gmcg-vmware-sc'
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

Create the PVC for MySQL:

```
kubectl -n wordpress-mysql apply -f mysql-pvc.yml

persistentvolumeclaim/mysql-pv-claim created
```

Inspect the volume claim - it will initially be in the `pending` state:

```
kubectl -n wordpress-mysql get pvc

NAME             STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS      AGE
mysql-pv-claim   Pending                                      gmcg-vmware-sc    10s
```

Wait until the PVC has been created:

```
kubectl -n wordpress-mysql get pvc

NAME             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS      AGE
mysql-pv-claim   Bound    pvc-ecc09402-75f3-477a-af75-15f87cd2c6a8   1Gi        RWO            gmcg-vmware-sc    53s
```

Examine the corresponding PV:

```
kubectl -n wordpress-mysql get pv

NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                        STORAGECLASS   REASON   AGE

pvc-ecc09402-75f3-477a-af75-15f87cd2c6a8   1Gi        RWO            Delete           Bound    wordpress-mysql/mysql-pv-claim               gmcg-vmware-sc             16s
```


### Create service for MySQL

Create a file named `mysql-service.yml` with the following content:

```
apiVersion: v1
kind: Service
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
spec:
  ports:
    - port: 3306
  selector:
    app: wordpress
    tier: mysql
  clusterIP: None
```

Deploy the service:

```
kubectl -n wordpress-mysql  apply -f mysql-service.yml

service/wordpress-mysql created
```

Inspect the service:

```
kubectl -n wordpress-mysql  get svc wordpress-mysql

NAME              TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
wordpress-mysql   ClusterIP   None         <none>        3306/TCP   17s
```

### Deploy MySQL

Create a file named `mysql-deployment.yml` with the following content:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
spec:
  selector:
    matchLabels:
      app: wordpress
      tier: mysql
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress
        tier: mysql
    spec:
      containers:
      - image: mysql:5.6
        name: mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-pass
              key: password
        ports:
        - containerPort: 3306
          name: mysql
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: mysql-pv-claim
```

Deploy MySQL:

```
kubectl -n wordpress-mysql apply -f mysql-deployment.yml

deployment.apps/wordpress-mysql created
```

Inspect the deployment - it may take a while for it to complete:

```
kubectl -n wordpress-mysql  get deployment wordpress-mysql

NAME              READY   UP-TO-DATE   AVAILABLE   AGE
wordpress-mysql   0/1     1            0           9s
```

Wait until the deployment is ready:

```
kubectl -n wordpress-mysql  get pods

NAME                              READY   STATUS    RESTARTS   AGE
wordpress-mysql-67565bd57-lvbg2   1/1     Running   0          64s
```

You can get more information on the deployment using the `describe deployment` option:

```
kubectl -n wordpress-mysql describe deployment wordpress-mysql

Name:               wordpress-mysql
Namespace:          wordpress-mysql
CreationTimestamp:  Tue, 16 Jun 2020 13:27:39 +0000
Labels:             app=wordpress
Annotations:        deployment.kubernetes.io/revision: 1
                    kubectl.kubernetes.io/last-applied-configuration:
                      {"apiVersion":"apps/v1","kind":"Deployment","metadata":{"annotations":{},"labels":{"app":"wordpress"},"name":"wordpress-mysql","namespace"...
Selector:           app=wordpress,tier=mysql
Replicas:           1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:       Recreate
MinReadySeconds:    0
Pod Template:
  Labels:  app=wordpress
           tier=mysql
  Containers:
   mysql:
    Image:      mysql:5.6
    Port:       3306/TCP
    Host Port:  0/TCP
    Environment:
      MYSQL_ROOT_PASSWORD:  <set to the key 'password' in secret 'mysql-pass'>  Optional: false
    Mounts:
      /var/lib/mysql from mysql-persistent-storage (rw)
  Volumes:
   mysql-persistent-storage:
    Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
    ClaimName:  mysql-pv-claim
    ReadOnly:   false
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  <none>
NewReplicaSet:   wordpress-mysql-67565bd57 (1/1 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  53s   deployment-controller  Scaled up replica set wordpress-mysql-67565bd57 to 1
```

### Create PVC for WordPress

Create the file `wordpress-pvc.yml` with the following content:

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wp-pv-claim
  labels:
    app: wordpress
  annotations:
    volume.beta.kubernetes.io/storage-class: 'gmcg-vmware-sc'
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
```

Create the PVC for WordPress:

```
kubectl -n wordpress-mysql apply -f wordpress-pvc.yml

persistentvolumeclaim/wp-pv-claim created
```

Inspect the volume claim - it will initially be in the `pending` state:

```
kubectl -n wordpress-mysql get pvc wp-pv-claim
 
NAME             STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS      AGE
wp-pv-claim      Pending                                                                        gmcg-vmware-sc    5s
```

Wait until the PVC has been created:

```
kubectl -n wordpress-mysql  get pvc wp-pv-claim

NAME             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS      AGE
wp-pv-claim      Bound    pvc-1363ba16-8215-442a-b094-35fdd46f535b   5Gi        RWO            gmcg-vmware-sc    9m23s
```


### Create service for MySQL



Create a manifest named `wordpress-service.yml` with content similar to the example below. The `loadBalancerIP` in the example
is an IP address on the network configured in F5 with `external_vlan_name` set to `external`. 
The IP address you choose must not already be in use and must be routable from the location of any client that sends requests to the Service.

```
apiVersion: v1
kind: Service
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  ports:
    - port: 80
  selector:
    app: wordpress
    tier: frontend
  type: LoadBalancer
  loadBalancerIP: 10.15.158.77
```

Create the MySQL service:

```
kubectl -n wordpress-mysql apply -f wordpress-service.yml

service/wordpress created
```

Inspect the service:

```
kubectl -n wordpress-mysql  get svc wordpress

NAME        TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)        AGE
wordpress   LoadBalancer   10.96.162.244   10.15.158.77   80:32064/TCP   5s
```

In this scenario, a client will send a request to the `loadBalancerIP` address 10.15.158.77 on TCP port 80.
The request gets routed to your F5 BIG-IP load balancer. The load balancer chooses one of your user cluster nodes,
and forwards the request to the node address on TCP port 32064. The iptables rules on the node forward
the request to a member pod on TCP port 80. (By default, the `targetPort` is set to the same value as the `port` field).


### Deploy WordPress

Create a file named `wordpress-deployment.yml` with the following content:


```
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  selector:
    matchLabels:
      app: wordpress
      tier: frontend
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress
        tier: frontend
    spec:
      containers:
      - image: wordpress:4.8-apache
        name: wordpress
        env:
        - name: WORDPRESS_DB_HOST
          value: wordpress-mysql
        - name: WORDPRESS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-pass
              key: password
        ports:
        - containerPort: 80
          name: wordpress
        volumeMounts:
        - name: wordpress-persistent-storage
          mountPath: /var/www/html
      volumes:
      - name: wordpress-persistent-storage
        persistentVolumeClaim:
          claimName: wp-pv-claim
```


Deploy WordPress:

```
kubectl -n wordpress-mysql apply -f wordpress-deployment.yml

deployment.apps/wordpress created
```

Inspect the deployment:

```
kubectl -n wordpress-mysql  get deployment wordpress

NAME              READY   UP-TO-DATE   AVAILABLE   AGE
wordpress         0/1     1            0           8s
```

Wait until WordPress is ready:

```
kubectl -n wordpress-mysql  get deployment wordpress

NAME        READY   UP-TO-DATE   AVAILABLE   AGE
wordpress   1/1     1            1           34s
```

You can use the `describe deployment` option to obtain more information about the deployment:

```
kubectl -n wordpress-mysql  describe deployment wordpress
Name:               wordpress
Namespace:          wordpress-mysql
CreationTimestamp:  Tue, 16 Jun 2020 13:59:18 +0000
Labels:             app=wordpress
Annotations:        deployment.kubernetes.io/revision: 1
                    kubectl.kubernetes.io/last-applied-configuration:
                      {"apiVersion":"apps/v1","kind":"Deployment","metadata":{"annotations":{},"labels":{"app":"wordpress"},"name":"wordpress","namespace":"word...
Selector:           app=wordpress,tier=frontend
Replicas:           1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:       Recreate
MinReadySeconds:    0
Pod Template:
  Labels:  app=wordpress
           tier=frontend
  Containers:
   wordpress:
    Image:      wordpress:4.8-apache
    Port:       80/TCP
    Host Port:  0/TCP
    Environment:
      WORDPRESS_DB_HOST:      wordpress-mysql
      WORDPRESS_DB_PASSWORD:  <set to the key 'password' in secret 'mysql-pass'>  Optional: false
    Mounts:
      /var/www/html from wordpress-persistent-storage (rw)
  Volumes:
   wordpress-persistent-storage:
    Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
    ClaimName:  wp-pv-claim
    ReadOnly:   false
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  <none>
NewReplicaSet:   wordpress-549c4f6867 (1/1 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  30s   deployment-controller  Scaled up replica set wordpress-549c4f6867 to 1
```


## Accessing the WordPress service

You can browse to the LoadBalancerIP, in this case 10.15.158.77 and choose your language:

!["WordPress install"][wordpress-lang-png]

**Figure ?.** WordPress language


Fill in the details and install:

!["WordPress install"][wordpress-install-png]

**Figure ?.** WordPress install


When you log in to WordPress, you will see the admin dashboard:

!["WordPress admin dashboard"][wordpress-welcome-png]

**Figure ?.** WordPress admin dashboard

Create a new blog post by clicking "Write your first blog post":

!["WordPress new post"][wordpress-new-post-png]

**Figure ?.** WordPress new post


 Add a title and some text content, and then insert an image into your blog post by clicking on "Add Media":

!["WordPress finished new post"][wordpress-new-post-done-png]

**Figure ?.** WordPress finished new post


Click the `Publish` button to make the blog post public and then view the post:

!["WordPress published post"][wordpress-publish-png]

**Figure ?.** WordPress published post


## Exploring WordPress content

Identify the WordPress pod, in this case, `wordpress-549c4f6867-7qx66`:

```
kubectl get pods -n wordpress-mysql

NAME                              READY   STATUS    RESTARTS   AGE
wordpress-549c4f6867-7qx66        1/1     Running   0          19h
wordpress-mysql-67565bd57-lvbg2   1/1     Running   0          19h
```

Install `jq`:

```
sudo apt-get install jq
```

Use a json query to identify the volume mounts:

```
kubectl get pods -n wordpress-mysql wordpress-549c4f6867-7qx66 -o json | jq '.spec.containers[].volumeMounts'

[
  {
    "mountPath": "/var/www/html",
    "name": "wordpress-persistent-storage"
  },
  {
    "mountPath": "/var/run/secrets/kubernetes.io/serviceaccount",
    "name": "default-token-2wqzq",
    "readOnly": true
  }
]
```

Use a json query to match the volume mount with the corresponding PVC name:


```
kubectl get pods -n wordpress-mysql wordpress-549c4f6867-7qx66 -o json | jq '.spec.volumes'

[
  {
    "name": "wordpress-persistent-storage",
    "persistentVolumeClaim": {
      "claimName": "wp-pv-claim"
    }
  },
  {
    "name": "default-token-2wqzq",
    "secret": {
      "defaultMode": 420,
      "secretName": "default-token-2wqzq"
    }
  }
]
```

You will see that the PVC `wp-pv-claim` is mounted at `/var/www/html`. You can execute a command on the pod to list
the files:

```
kubectl exec --stdin --tty -n wordpress-mysql wordpress-549c4f6867-7qx66 -- /bin/ls -l /var/www/html

-rw-r--r--  1 www-data www-data   418 Sep 25  2013 index.php
-rw-r--r--  1 www-data www-data 19935 Jun 16 15:50 license.txt
...
drwxr-xr-x  6 www-data www-data  4096 Jun 16 16:01 wp-content
...
```

If you navigate through the `wp-content` folder, you will find the files corresponding to the image you added to 
the blog post:

```
kubectl exec --stdin --tty -n wordpress-mysql wordpress-549c4f6867-7qx66 -- /bin/ls -l /var/www/html/wp-content/uploads/2020/06

total 124
-rw-r--r-- 1 www-data www-data  3290 Jun 16 16:01 380-with-OmniStack-100x100.jpg
-rw-r--r-- 1 www-data www-data  6183 Jun 16 16:01 380-with-OmniStack-150x150.jpg
-rw-r--r-- 1 www-data www-data  8928 Jun 16 16:01 380-with-OmniStack-300x150.jpg
-rw-r--r-- 1 www-data www-data 36764 Jun 16 16:01 380-with-OmniStack-768x384.jpg
-rw-r--r-- 1 www-data www-data 65386 Jun 16 16:01 380-with-OmniStack.jpg
```

Notice how there are multiple versions of the image, to cater for devices with different resolutions or for thumbnails.

You can also copy the WordPress content to your local machine using the `kubectl cp` command:

```
kubectl cp -n wordpress-mysql wordpress-549c4f6867-7qx66:/var/www/html  wordpress-backup-20200617
```

Once again, you can navigate down to the files corresponding to the image:

```
ls -l wordpress-backup-20200617/wp-content/uploads/2020/06

total 124
-rw-rw-r-- 1 ubuntu ubuntu  3290 Jun 17 09:44 380-with-OmniStack-100x100.jpg
-rw-rw-r-- 1 ubuntu ubuntu  6183 Jun 17 09:44 380-with-OmniStack-150x150.jpg
-rw-rw-r-- 1 ubuntu ubuntu  8928 Jun 17 09:44 380-with-OmniStack-300x150.jpg
-rw-rw-r-- 1 ubuntu ubuntu 36764 Jun 17 09:44 380-with-OmniStack-768x384.jpg
-rw-rw-r-- 1 ubuntu ubuntu 65386 Jun 17 09:44 380-with-OmniStack.jpg
```











[wordpress-lang-png]:<../images/wordpress-lang.png>
[wordpress-install-png]:<../images/wordpress-install.png>
[wordpress-welcome-png]:<../images/wordpress-welcome.png>
[wordpress-new-post-png]:<../images/wordpress-new-post.png>
[wordpress-new-post-done-png]:<../images/wordpress-new-post-done.png>
[wordpress-publish-png]:<../images/wordpress-publish.png>
