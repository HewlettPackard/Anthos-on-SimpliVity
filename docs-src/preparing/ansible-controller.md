# Ansible controller

A script is provided to build the Python `virtualenv` required to execute the playbooks.

## Download playbooks

```
cd ~

git clone https://github.com/HewlettPackard/Anthos-on-SimpliVity.git
```

Change to the directory that was created using the `git clone` command:

```
$ cd ~/Anthos-on-SimpliVity
```

## Create Python Virtual environment

The use of a Python Virtual environment allows for flexibility in ansible host creation. It also
provides an easy method to freeze the version of required packages through the use of a
requirements file.

The provided script `prerequisites/ansible-setup.sh` will build the python virtualenv needed to execute the playbooks.

**NOTE:** If your environment requires the use of a proxy, you will need to modify the proxy settings in the `ansible-setup.sh` script based on your environment:

```
HTTPS_PROXY="HTTPS_PROXY=http://16.100.211.43:8888"
needs_proxy=true
```



## Run the script to create virtualenv

You must specify the name of the directory for the virtualenv using the `-d` flag. You can also
use the `-b` option to set the base directory (default is `~/virtualenvs`). 

```
cd ~/Anthos-on-SimpliVity

./prerequisite/ansible-setup.sh -d ansible-296
```

Running the script with the `-h` option produces the help output:

```
 ./prerequisite/ansible-setup.sh -h

This script is used to create a python3 virtualenv with ansible operating environment
Syntax: ansible-setup.sh [-b|d|h]
options:
-b     Base directory to create python virtualenvs. (Optional - Default is ~/virtualenvs)
-d     Name to use for virtualenv directory. (Required)
-h     Print this Help.

```

## Activate Python `virtualenv`

Before you run the playbooks, activate your Python `virtualenv` created by `ansible-setup.sh`, for example:

```
source /root/virtualenvs/ansible-296/bin/activate
```

## Software installed

The file `prerequisites/ansible-venv-requirements.txt` lists the versions of the software 
installed in the virtualenv.

```
ansible==2.9.6
certifi==2019.11.28
cffi==1.14.0
chardet==3.0.4
cryptography==2.8
docopt==0.6.2
idna==2.9
jmespath==0.9.4
Jinja2==2.11.1
MarkupSafe==1.1.1
netaddr==0.7.19 
prompt-toolkit==3.0.5
pycparser==2.20
pyflakes==2.1.1
Pygments==2.6.1
pyvim==3.0.2
pyvmomi==6.7.3
PyYAML==5.3.1
requests==2.23.0
six==1.14.0
selinux==0.2.1
urllib3==1.25.8
wcwidth==0.1.9
```