#!/usr/bin/env python3

import yaml
import os
import sys
from pathlib import Path

# Get the current users HOME directory
user_home = os.environ['HOME']
# gkeadm output directory is hardcoded
gkeadm_output_path = user_home + '/' + 'output' + '/'

# Need to construct path to variable file with GKE Admin Wrkst hostname
script_path = os.path.realpath(__file__)
mypath = Path(script_path)
# Grab the first parts of the path to get the repo path -- Assuming we're in /home/<user>/<repo> for now 
repo_dir = '/'.join(mypath.parts[0:4])

# Build the final path to the all.yml file
var_file = repo_dir + '/inventory/group_vars/all/all.yml'

# Read all.yml yaml var file. This will have the gkeadm name we need to get the output file with host info
with open(var_file, 'r') as file:
     all_data = yaml.load(file, Loader=yaml.FullLoader)
     print("GKE Admin Workstation name is:", all_data["gke_admin_workstation"]["name"])
     fn = all_data["gke_admin_workstation"]["name"]

# Found the filename (hostname), now create the full path name to read in contents
gkeadm_file = os.path.abspath(gkeadm_output_path + fn)

# Read in the contents of gkeadm output file and find the 'ssh' line for connecting to GKE Admin Wrkst
contents_lines = []
with open(gkeadm_file, 'r') as input:
     for line in input:
          contents_lines.append(line.rstrip('\n'))
for item in contents_lines:
     if 'ssh -i' in item:
          ssh_cmd = item

# Take the ssh line from the gkeadm output and combine with ' -t lnav /home/ubuntu/logs' for monitoring
ssh_cmd_plus = ssh_cmd + ' -t lnav /home/ubuntu/logs'
# Quick and dirty ssh connection
os.system(ssh_cmd_plus)