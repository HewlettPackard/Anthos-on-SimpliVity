#!/usr/bin/env python

##Pre requisites GOVC

import requests
import json
import argparse
import random
import time
import re
import os
import getpass
import subprocess
import sys



# Disable SSL warnings
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

def parse_args():
    parser = argparse.ArgumentParser(description='This script is used to restore a PV')
    parser.add_argument("--i","--ipOvc", required=True, type=str, help="IP Address of an OVC: {REQUIRED}")
    parser.add_argument("--b","--backup", required=True, type=str, help="Name of Backup to restore {REQUIRED}")
    parser.add_argument("--d","--pvName", required=True, type=str, help="Name of PV to restore {REQUIRED}")
    parser.add_argument("--v","--ipvCenter", required=True, type=str, help="IP or FQDN of vCenter: {REQUIRED}")
    parser.add_argument("--u","--username", required=True, type=str, help="vCenter UserName: {REQUIRED}")
    parser.add_argument("--s","--stgClass", required=True, type=str, help="StorageClass name: {REQUIRED}")
    parser.add_argument("--k","--kubec", required=False, default=os.environ.get('KUBECONFIG'), type=str, help="Path to kubeconfig file: {use $KUBECONFIG if not set}")
    

    args = parser.parse_args()

    if args.k is None:
        print('\x1b[1;31m'+'Must pass in kubeconfig file (--k) or set KUBECONFIG environment variable'+'\x1b[0m')
        sys.exit(1)

    print("Using OVC: "+args.i)
    print("Restoring PV: "+args.d)
    print("From backup: "+args.b)
    print("With vCenter: "+args.v)
    print("To StorageClass: "+args.s)
    print("K8s kubeconfig file: "+args.k)   
    return (args)


def tool_exists(tool):
    rc = subprocess.call(['which', tool], stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if rc == 0:
        print('\x1b[1;32m'+tool+" installed\n"+'\x1b[0m')
    else:
        print('\x1b[1;41m'+tool+" not found!! Please install "+tool+'\x1b[0m')
        sys.exit(1) 


def token_get(args, hms_password):
    # Authenticate user and generate access token.
    response = requests.post('https://'+args.i+'/api/'+'oauth/token', auth=('simplivity', ''), verify=False, data={
      'grant_type':'password',
      'username':args.u,
      'password':hms_password})
    print(response.json())
    
    access_token = response.json()['access_token']
   
    # Add the access_token to the header.
    headers = {'Authorization':  'Bearer ' + access_token, 'Accept' : 'application/vnd.simplivity.v1+json'}
    return (headers)
    

def get_backup(args, headers):
    # Issue a GET request: GET /backups.
    response = requests.get('https://'+args.i+'/api/backups?name='+args.b+'&'+'virtual_machine_name='+args.d, verify=False, headers=headers)
    json_get_backup = response.json()

    #Check count response,  if 0 then something is not correct with user input or backup is not found 
    if  json_get_backup['count'] == 0:
         print('\x1b[1;41m'+"No Backup Found: Please Check Backup and PV Name"+'\x1b[0m')
         sys.exit(1)

    #Inform on data obtained for restoration
    print("\nBackup ID obtained:", json_get_backup['backups'][0]['id'])
    print("Datastore ID obtained:", json_get_backup['backups'][0]['datastore_id'])
    print("Datastore Name obtained:", json_get_backup['backups'][0]['datastore_name'])
    return(json_get_backup)


def restore_pv(args, headers, json_get_backup):
    ### Issue a POST request to restore Backup: POST /backups.
    #Randomize restored PVC number
    rndNum=str(random.randint(0, 99999))
    pvRestoreName ='restore-'+rndNum+'-'+args.d
    body = {'virtual_machine_name': pvRestoreName,'datastore_id': json_get_backup['backups'][0]['datastore_id']}
    # Add the correct MIME type for the body.
    headers['Content-Type'] = 'application/vnd.simplivity.v1.1+json'
    # Issue the POST operation and expect a task object in return.
    response = requests.post('https://'+args.i+'/api/backups/'+json_get_backup['backups'][0]['id']+'/restore?restore_original=false', json = body, verify=False, headers=headers)
    json_restore_pv = response.json()
    print("\nPV restore status: ")
    print(json_restore_pv)
    return (json_restore_pv, pvRestoreName, rndNum)


def restore_task(args, headers, json_restore_pv, pvRestoreName, json_get_backup):
    # Monitor the status of the rename operation by using a loop to query
    # the task while this task is IN_PROGRESS.
    # The state field in the JSON response body indicates the status.
    taskid = json_restore_pv['task']['id']
    state = json_restore_pv['task']['state']
    print("Task ID: "+taskid)
    print(state)
    while (state == "IN_PROGRESS"):
        # Wait one second.
        time.sleep(1)
        response = requests.get('https://'+args.i+'/api/tasks/'+taskid, verify=False, headers=headers)
        json_restore_pv = response.json()
        state = json_restore_pv['task']['state']
        print(state)
    print('\x1b[1;32m'+"Restored to PV: "+pvRestoreName+" On Datastore: "+json_get_backup['backups'][0]['datastore_name']+'\x1b[0m')
    return()


def make_fcd(args, hms_password, pvRestoreName, json_get_backup):
    ##Make an FCD with govc
    print('\x1b[1;32m'+"\nPromoting "+pvRestoreName+" to a First Class Disk"+'\x1b[0m')
    # this resuses the restore name as the file path, strips the _fcd adds .vmdk and then names the FCD the pv restore name
    vmdk = args.d.replace("_fcd",".vmdk")
    print("govc disk.register -k=true  -u=https://"+args.u+":"+hms_password+"@"+args.v+" -ds="+json_get_backup['backups'][0]['datastore_name']+" "+pvRestoreName+"/"+vmdk+" "+pvRestoreName+"\n")
    print('\x1b[1;32m'+"VolumeHandle GUID used in PV restore YAML"+'\x1b[0m') 
    volume_handle_id = os.popen("govc disk.register -k=true  -u=https://"+args.u+":"+hms_password+"@"+args.v+" -ds="+json_get_backup['backups'][0]['datastore_name']+" "+pvRestoreName+"/"+vmdk+" "+pvRestoreName).read()
    print(volume_handle_id)
    return(volume_handle_id)


def list_fcd(args, hms_password, json_get_backup):
    #Lists the FCDs with govc
    print('\x1b[1;32m'+"Displaying first class disks"+'\x1b[0m')
    print("govc disk.ls -k=true -u=https://"+args.u+":"+hms_password+"@"+args.v+" -ds="+json_get_backup['backups'][0]['datastore_name']+" -R\n")
    os.system("govc disk.ls -k=true -u=https://"+args.u+":"+hms_password+"@"+args.v+" -ds="+json_get_backup['backups'][0]['datastore_name']+" -R")
    return()


def create_pv_yaml(args, volume_handle_id, rndNum):
    pvNameYaml = args.d.replace("_fcd","")
    print('\x1b[1;32m'+"\nCreating restored-"+pvNameYaml+" to local directory"+'\x1b[0m')
    """Creates yaml file for a Persistent Volumes (PV)"""
    with open('pvRestore-'+rndNum+'.yaml', 'w+') as f:
        f.write(f"apiVersion: v1\n")
        f.write(f"kind: PersistentVolume\n")
        f.write(f"metadata:\n")
        f.write(f"  name: restored-{rndNum}-{pvNameYaml}\n")
        f.write(f"spec:\n")
        f.write(f"  capacity:\n")
        f.write(f"    storage: 10Gi\n")  ##NEEDS USER INPUT????
        f.write(f"  accessModes:\n")
        f.write(f"    - ReadWriteOnce\n")
        f.write(f"  persistentVolumeReclaimPolicy: Retain\n")
        f.write(f"  storageClassName: {args.s}\n")  
        f.write(f"  csi:\n")
        f.write(f"    driver: csi.simplivity.hpe.com\n")
        f.write(f"    fsType: ext4\n")
        f.write(f"    volumeAttributes:\n")
        f.write(f'      fstype: ""\n')
        f.write(f"      storage.kubernetes.io/csiProvisionerIdentity: {rndNum}-8081-csi.simplivity.hpe.com\n")
        f.write(f'      type: "vSphere CNS Block Volume"\n')
        f.write(f"    volumeHandle: {volume_handle_id}")

def main():
    '''Main'''
    #Check GOVC
    #wget -e use_proxy=yes -e http_proxy=http://proxy.houston.hpecorp.net:8080 https://github.com/vmware/govmomi/releases/download/v0.22.1/govc_linux_amd64.gz
    tool_exists("govc")

    #Check kubectl
    # curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.18.2/bin/linux/amd64/kubectl --proxy http://proxy.houston.hpecorp.net:8080
    tool_exists("kubectl")

    #Gets Arguments
    args = parse_args()
    hms_password = getpass.getpass('\x1b[93m'+"Enter vCenter Password: "+'\x1b[0m')

    #Creates SVT Rest API token 
    headers = token_get(args, hms_password)

    #Gets user provided backup required VARs
    json_get_backup = get_backup(args, headers)
    
    #assigning each var from the tuple restore_pv
    json_restore_pv, pvRestoreName, rndNum = restore_pv(args, headers, json_get_backup)
    
    #Verify task completes
    restore_task(args, headers, json_restore_pv, pvRestoreName, json_get_backup)
    
    
    #Promotes the restored PV to a First Class Disk and returns volume handle
    volume_handle_id = make_fcd(args, hms_password, pvRestoreName, json_get_backup)
    
    #displays the First Class DIsks known to Vmware
    list_fcd(args, hms_password, json_get_backup)
    
    #Passes the Volume Handle and creates a PV yaml
    create_pv_yaml(args, volume_handle_id, rndNum)

    #Applies the yaml to the K8s cluster with user provided kubeconfig and cleans up
    print("kubectl --kubeconfig="+args.k+" apply -f pvRestore-"+rndNum+".yaml")
    os.system("kubectl --kubeconfig="+args.k+" apply -f pvRestore-"+rndNum+".yaml")
    os.remove("pvRestore-"+rndNum+".yaml")
    
if __name__ == '__main__':
 
    main()