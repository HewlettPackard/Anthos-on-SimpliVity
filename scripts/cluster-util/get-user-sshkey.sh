#!/bin/bash
###                                                                             
# Copyright (2020) Hewlett Packard Enterprise Development LP                    
#                                                                               
# Licensed under the Apache License, Version 2.0 (the "License");               
# You may not use this file except in compliance with the License.              
# You may obtain a copy of the License at                                       
#                                                                               
# http://www.apache.org/licenses/LICENSE-2.0                                    
#                                                                               
# Unless required by applicable law or agreed to in writing, software           
# distributed under the License is distributed on an "AS IS" BASIS,             
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.      
# See the License for the specific language governing permissions and           
# limitations under the License.                                                
###                                                                             

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