#!/bin/bash

# Creating Python3 virtualenv for ansible

unset venv_dir
venv_base_dir=$(readlink -f ~/virtualenvs)

HTTPS_PROXY="HTTPS_PROXY=http://16.100.211.43:8888"
needs_proxy=true

SCRIPT_PATH=$(readlink -f $0)
DIR=$(dirname "$SCRIPT_PATH")

Help()
{
  # Display Help
  printf "%sThis script is used to create a python3 virtualenv with ansible operating environment\n"
  printf "%sSyntax: $(basename $0) [-b|d|h]\n"
  printf "%soptions:\n"
  printf "%s-b     Base directory to create python virtualenvs. (Default is ~/virtualenvs)\n"
  printf "%s-d     Name to use for virtualenv directory. (Required)\n"
  printf "%s-h     Print this Help.\n"
}

while getopts ":hb:d:" option; do
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
     \? ) # incorrect option
         echo "Error: Invalid option"
         exit
         ;;
   esac
done

# Test parameters
if [ -z "$venv_dir" ]; then
    printf "%s\nMust specify target virtualenv directory\n"
    Help
    exit
fi

# Test for python3 and install venv package
if python3 -c 'import sys; print(sys.version_info[:])' 2>&1 >/dev/null; then
    printf "%s\nInstalling python3-venv\n"
    sudo apt-get install python3-venv
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

# Deploy the virtualenv
if python3 -m venv $venv_base_dir/$venv_dir; then
    source $venv_base_dir/$venv_dir/bin/activate
else
    printf "%s\nFailed to create python virtualenv $venv_dir\n"
    exit
fi

if [ "$needs_proxy" = true ]; then
    export $HTTPS_PROXY
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
