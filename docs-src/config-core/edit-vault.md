# Protecting sensitive information

The Ansible `vault` file is used to protect any sensitive variables that should not appear in clear text in your
`inventory/group_vars/all/all.yml` file. The vault file should be encrypted, requiring a password to be entered
before it can be read or updated.

A sample vault file is provided named `inventory/group_vars/all/vault.yml.sample`. You can use this sample as a model for your own vault file. 

## Configuring the vault

The following table contains the fields that should be configured in the valut:

|Variable|File|Description|
|:-------|:---|:----------|
|`vault_f5_root_password`|vault.yml|The `root` password for F5|
|`vault_f5_admin_password`|vault.yml|The `admin` password for F5|
|`vault_f5_license_key`|vault.yml|The F5 license key|
|`vault_vcenter_username`|vault.yml|The user name for the primary vCenter|
|`vault_vcenter_password`|vault.yml|The password for the primary vCenter|
|`vault_gkeadm_vcenter_username`|vault.yml|The user name for the alternative vCenter<br>(Optional)|
|`vault_gkeadm_vcenter_password`|vault.yml|The password for the alternative vCenter<br>(Optional)|

## Sample vault file

```
vault_f5_root_password: default
vault_f5_admin_password: admin
vault_f5_license_key: ABCDE-ABCDE-ABCDE-ABCDE-ABCDEFG

vault_vcenter_username: Administrator@vsphere.local
vault_vcenter_password: password

vault_gkeadm_vcenter_username: Administrator@vsphere.local
vault_gkeadm_vcenter_password: password
```


## Encrypting the vault

To encrypt the vault you need to run the following command:

```
ansible-vault encrypt inventory/group_vars/all/vault.yml

New Vault password:
Confirm New Vault password:
Encryption successful
```

You will be prompted for a password that will decrypt the vault when required. You can update the values in your vault by running:

```
ansible-vault edit inventory/group_vars/all/vault.yml
```

In order for Ansible to be able to read the vault, you need to specify a file where the password is stored, for instance, in a file called `.vault_pass`. Once the file is created, take the following precautions to avoid illegitimate access to this file:

1. Change the permissions so only root can read it using `chmod 600 .vault_pass`
2. Add the file to your `.gitignore` file if you are using a Git repository to manage your playbooks.


## Using the vault

When you use an encrypted vault, you must specify the password file every time when you run a playbook, for example:

```
ansible-playbook -i hosts site.yml --vault-password-file .vault_pass
```

Alternatively, you can be prompted for the password:

```
ansible-playbook -i hosts site.yml --ask-vault-pass
```
