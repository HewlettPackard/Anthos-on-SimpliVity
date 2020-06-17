#!/bin/bash
unset user_cluster_name
unset adminkubeconfig


Help()
{
  # Display Help
  echo "This script is used to retrieve the private ssh key needed to login to user cluster"
  echo
  echo "Syntax: $(basename $0) [-u|a|h]"
  echo "options:"
  echo "-u     Name of user cluster. (Required)"
  echo "-a     Path to admin cluster kubeconfig file. (Optional)"
  echo "-h     Print this Help."
  echo
}

while getopts ":hu:a:" option; do
   case $option in
      h ) # display Help
         Help
         exit
         ;;
      u ) # set user cluster name
         user_cluster_name=${OPTARG}
         ;;
      a ) # set admin cluster name
         adminkubeconfig=${OPTARG}
         ;;
     \? ) # incorrect option
         echo "Error: Invalid option"
         exit
         ;;
   esac
done

# Pull vars from initial setup. project, proxy info & whitelisted key
. ~/gcloud-proxy-vars

if [ -z "$adminkubeconfig" ]
then
    # Assuming path the admin kubeconfig
    adminkubeconfig=~/gke_admin_wrkst_private/kubeconfigs/kubeconfig
    echo "Using admin kubeconfig $adminkubeconfig"
else
    echo "Using admin kubeconfig $adminkubeconfig"
fi

# Check to make sure variables are set before executing gcloud command
if [ -z "$user_cluster_name" ]
then
   echo "Missing argument"
   echo "User cluster name - $user_cluster_name"
   Help
   exit
fi

echo "Retrieving SSH private key for user cluster $user_cluster_name"

kubectl --kubeconfig $adminkubeconfig get secrets -n $user_cluster_name ssh-keys \
-o jsonpath='{.data.ssh\.key}' | base64 -d > \
~/.ssh/$user_cluster_name.key && chmod 600 ~/.ssh/$user_cluster_name.key