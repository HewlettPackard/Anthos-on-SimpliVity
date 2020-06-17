#!/bin/bash
kubeconfig=/home/ubuntu/gke_admin_wrkst_private/kubeconfigs/kubeconfig

kubectl --kubeconfig $kubeconfig get secrets -n kube-system sshkeys \
-o jsonpath='{.data.vsphere_tmp}' | base64 -d > \
~/.ssh/admin-cluster.key && chmod 600 ~/.ssh/admin-cluster.key