# Docker configuration

Docker base IP (bip) can be changed if the default conflicts with your environment


|Variable|File|Description|
|:-------|:---|:----------|
|`docker_bip`|inventory/group_vars/all/all.yml|Defaults to `192.68.0.1/16`


## Configuring a private Docker registry

A private Docker registry can be optionally used to host GKE images when performing an air-gapped installation.


```
private_docker_registry: true
private_reg_ip: '16.100.209.193'
private_reg_port: '5005'
private_reg_cert: 'registry.crt' # Must be in directory defined by 'secrets_directory'
private_reg_username: 'me'
private_reg_password: 'you'
```