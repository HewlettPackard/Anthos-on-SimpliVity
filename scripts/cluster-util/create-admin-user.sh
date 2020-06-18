#!/bin/bash
# Enter desired username for GCP login as first parameter
# Enter cluster name (usually usercluster) as second parameter.
# Copy/paste the resultant token into your GCP console login
username=$1
cluster=$2
kubectl --kubeconfig kubeconfig create serviceaccount $username
kubectl --kubeconfig kubeconfig create clusterrolebinding $username-view --clusterrole view --serviceaccount default:$username
kubectl --kubeconfig kubeconfig create clusterrolebinding $username-node-reader --clusterrole node-reader --serviceaccount default:$username
kubectl --kubeconfig kubeconfig create clusterrolebinding $username-admin --clusterrole cluster-admin --serviceaccount default:$username
SECRET_NAME=$(kubectl --kubeconfig kubeconfig get serviceaccount $username -o jsonpath='{$.secrets[0].name}')
kubectl --kubeconfig kubeconfig  get secret ${SECRET_NAME} -o jsonpath='{$.data.token}' | base64 -d