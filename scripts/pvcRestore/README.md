# Restore SimpliVity Persistent Volumes

This python script will resotre a K8s Persistent Volume from a User supplied persistent volume, promote the PV to a VMware First Class Disk and create and apply Persistent volume yaml

---

## Requirements

* Linux os
* [govc installed](https://github.com/vmware/govmomi/tree/master/govc) in /usr/local/bin
* [kubectl installed](https://kubernetes.io/docs/tasks/tools/install-kubectl/) in /user/local/bin
* User provided location of kubeconfig file to create a PV

---

## Required user input

```python
usage: restore-svt-pv.py [-h] --i I --b B --d D --v V --u U --s S --k K

This script is used to restore a PV

optional arguments:
  -h, --help            show this help message and exit
  --i I, --ipOvc I      IP Address of an OVC: {REQUIRED}
  --b B, --backup B     Name of Backup to restore {REQUIRED}
  --d D, --pvName D     Name of PV to restore {REQUIRED}
  --v V, --ipvCenter V  IP or FQDN of vCenter: {REQUIRED}
  --u U, --username U   vCenter UserName: {REQUIRED}
  --s S, --stgClass S   StorageClass name: {REQUIRED}
  --k K, --kubec K      Path to kubeconfig file: {REQUIRED}
```
---

## Usage
SimpliVity backup name and PV to restore can be aquired through the SimpliVity UI or svt-backup-show --pv-only

```python
python3 restore-svt-pv.py --i 10.1.222.155 --b pvDemo-backupFlask --d pvc-fc11adbb-843b-43a3-ac9c-a87f93b2f331_fcd --v 10.1.223.236 --s csivols --k /home/ddiosomito/gke_admin_wrkst_private/pvcRestore/user-cluster-1-kubeconfig --u administrator@vsphere.local
```

## SimpliVity Backup Information
List SimpliVity Persistent Volumes
```
 svt-pv-show
.-------------------------------------------------------------------------------------------------------------------------------------------------------.
| Persistent Volumes                                                                                                                                    |
+-------------------+---------------+-----------+----------------------------------------------+-----------+------------+-----------+-------------------+
| Datacenter        | Cluster       | Datastore | Persistent Volume                            | Policy    | Storage HA | Zoning    | Created At        |
+-------------------+---------------+-----------+----------------------------------------------+-----------+------------+-----------+-------------------+
| SimpliVity-K8s    | K8s-Cluster   | CSI1-UC1  | pvc-441f3b88-4634-4055-a084-8766d019f327_fcd | PV-backup | Yes        | Compliant | 2020-May-28 19:07 |
|                   |               |           | pvc-575065bf-82e6-45b5-86d5-6a89bf0f1c30_fcd | PV-backup | Yes        | Compliant | 2020-May-28 19:06 |
|                   |               |           | pvc-fc11adbb-843b-43a3-ac9c-a87f93b2f331_fcd | PV-backup | Yes        | Compliant | 2020-May-28 19:07 |
'-------------------+---------------+-----------+----------------------------------------------+-----------+------------+-----------+-------------------'
```

Retrieve SimpliVity Persistent Backup details
```
svt-backup-show --pv-only
.----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------.
| All backups                                                                                                                                                                                                                                                          |
+-----------+---------------------------------------------------------------------------------+--------------------+--------+-------------+----------------------+------------+-------------------+----------------+-----------+--------+------+-------------+---------+
| Datastore | PV                                                                              | Backup             | Backup | Consistency | Backup               | Expiration | Datacenter        | Cluster Or     | Status    | Size   | Sent | Replication | Family  |
|           |                                                                                 | Name               | Type   | Type        | Time                 | Time       |                   | External Store |           |        |      | End Time    |         |
+-----------+---------------------------------------------------------------------------------+--------------------+--------+-------------+----------------------+------------+-------------------+----------------+-----------+--------+------+-------------+---------+
| CSI1-UC1  | pvc-fc11adbb-843b-43a3-ac9c-a87f93b2f331_fcd [DELETED 2020-05-28T19:28:40+0000] | pvDemo-backupFlask | Manual | None        | 2020-May-28 19:24:11 | N/A        | SimpliVity-K8s    |    K8sCluster  | Protected | 6.96MB |   0B | N/A         | vSphere |
'-----------+-----------------
```

Manually Backup a SimpliVity Persistent Volume
```
svt-pv-backup --pv pvc-fc11adbb-843b-43a3-ac9c-a87f93b2f331_fcd --datastore CSI1-UC1 -name pvDemo-backupFlask
..........................
```