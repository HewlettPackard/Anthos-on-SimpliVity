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

# Creating Python3 virtualenv for ansible

unset venv_dir
venv_base_dir=$(readlink -f ~/virtualenvs)

SCRIPT_PATH=$(readlink -f $0)
DIR=$(dirname "$SCRIPT_PATH")

Help()
{
  # Display Help
  printf "%sThis script is used to create a python3 virtualenv with ansible operating environment\n"
  printf "%sSyntax: $(basename $0) [-b|d|p|h]\n"
  printf "%soptions:\n"
  printf "%s-b     Base directory to create python virtualenvs. (Default is ~/virtualenvs)\n"
  printf "%s-d     Name to use for virtualenv directory. (Required)\n"
  printf "%s-p     Proxy url to use to get . (Optional) ex. http://16.100.211.43.8888\n"
  printf "%s-h     Print this Help.\n"
}

while getopts ":hb:d:p:" option; do
   case $option in
      h ) # display Help
         Help
         exit
         ;;
      b ) # set virtualenv base directory
         venv_base_dir=${OPTARG}
         ;;
      d ) # set virtualenv directory
         venv_dir=${OPTARG}
         ;;
      p ) # set proxy url 
         HTTPS_PROXY=${OPTARG}
         ;;
     \? ) # incorrect option
         echo "Error: Invalid option"
         exit
         ;;
   esac
done

# Test parameters
if [ -z "$venv_dir" ]; then
    printf "%s\nERROR: \e[1;31m Must specify a name to use for the target virtualenvs directory \e[0m\n\n"
    Help
    exit
fi

# Test for python3 and install venv package
if python3 -c 'import sys; print(sys.version_info[:])' 2>&1 >/dev/null; then
    if ! python3 -c 'import venv' 2>&1 >/dev/null; then
        printf "%s\nInstalling python3-venv\n"
        if cat /proc/version | grep -i ubuntu; then
            sudo apt -y install python3-venv
        else
            printf "%s\nNot ubuntu\n"
            printf "%s\n\e[1;31m python3 venv should be included on RedHat distros\e[0m\n"
        fi
    else
        printf "%s\n\e[1;32m python venv module already installed\e[0m\n"
    fi
else
    printf "%s\nFailed to find python3\n"
    exit
fi

# Test Directories
if [ ! -d "$venv_base_dir" ]; then
    mkdir -p $venv_base_dir
fi
if [ -d "$venv_base_dir/$venv_dir" ]; then
    printf "%sDirectory $venv_base_dir/$venv_dir already exists\n"
    exit
fi

# Export proxy url if defined
if [ ! -z "$HTTPS_PROXY" ] ; then
    export HTTPS_PROXY
    printf "%s\nProxy url set to $HTTPS_PROXY\n"
fi

# Deploy the virtualenv
if python3 -m venv $venv_base_dir/$venv_dir; then
    source $venv_base_dir/$venv_dir/bin/activate
else
    printf "%s\nFailed to create python virtualenv $venv_dir\n"
    exit
fi


printf "%s\nInstalling required packages via pip into virtualenv $venv_base_dir/$venv_dir\n"

if pip install wheel 2>&1 >/dev/null; then
    if pip install -r ${DIR}/ansible-venv-requirements.txt 2>&1 >/dev/null; then
        printf "%s\nSuccessfully installed ansible environment into $venv_base_dir/$venv_dir\n"
    else
        printf "%s\nError installing ansible packages via pip\n"
    fi
else
    printf "%s\nError installing pip package wheel\n"
fi

printf "%s\n\nTo invoke new virtual environment execute:\n 'source $venv_base_dir/$venv_dir/bin/activate'\n"
