#!/bin/bash
# Enter desired username for GCP login as first parameter
# Copy/paste the resultant token into your GCP console login

. ~/gcloud-proxy-vars

unset username
unset userkubeconfig
set_admin='False'

Help()
{
  # Display Help
  echo "This script is used to create a user in an Anthos user cluster and assign "
  echo "view, node-reader and cluster-admin (Optional) roles"
  echo
  echo "Syntax: $(basename $0) [-n|a|h]"
  echo "options:"
  echo "-u     Username to create in cluster. (Required)"
  echo "-k     Path to user cluster kubeconfig file. Will use env KUBECONFIG if set (Optional)"
  echo "-A     Set user as cluster admin. (Optional)"
  echo "-h     Print this Help."
  echo
}

while getopts ":hu:k:A" option; do
   case $option in
      h ) # display Help
         Help
         exit
         ;;
      u ) # set username to create
         username=${OPTARG}
         ;;
      k ) # set user cluster kubeconfig
         userkubeconfig=${OPTARG}
         ;;
      A ) # set user cluster kubeconfig
         set_admin='True'
         ;;
     \? ) # incorrect option
         echo "Error: Invalid option"
         exit
         ;;
   esac
done

if [ -z "$username" ]
then
    echo -n "Must supply username to create\n"
    Help
    exit
fi

if [ -z "$userkubeconfig" ]
then
    echo "Using environment KUBECONFIG"
    userkubeconfig=$KUBECONFIG
    if [ -z "$userkubeconfig" ]
    then
        echo "No kubeconfig set. Either specify on command line or set environment KUBECONFIG"
        exit
    fi
else
    echo -n "Using specified kubeconfig ${userkubeconfig}\n"
fi

# Creating user account 
kubectl --kubeconfig ${userkubeconfig} create serviceaccount $username
kubectl --kubeconfig ${userkubeconfig} create clusterrolebinding $username-view --clusterrole view --serviceaccount default:$username
kubectl --kubeconfig ${userkubeconfig} create clusterrolebinding $username-node-reader --clusterrole node-reader --serviceaccount default:$username

if [ "$set_admin" = True ]
then
    kubectl --kubeconfig ${userkubeconfig} create clusterrolebinding $username-admin --clusterrole cluster-admin --serviceaccount default:$username
fi

echo -e "Printing authentication token for user ${username}\n"
SECRET_NAME=$(kubectl --kubeconfig ${userkubeconfig} get serviceaccount $username -o jsonpath='{$.secrets[0].name}')
kubectl --kubeconfig ${userkubeconfig} get secret ${SECRET_NAME} -o jsonpath='{$.data.token}' | base64 -d