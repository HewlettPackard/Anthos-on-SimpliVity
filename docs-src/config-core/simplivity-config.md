# HPE SimpliVity configuration


To facilitate the automatic provisioning of datastores, you need to
identify the IP address of each OmniStack appliance in your HPE SimpliVity cluster. In the `inventory/group_vars/all/all.yml`
configuration file, add an array of addresses using the `simplivity_appliances` variable as shown in the following example:

```
simplivity_appliances:
- 10.1.222.46
- 10.1.222.47
- 10.1.222.57
```

***Note:** You are only required to have one entry
in this list, but HPE recommends that you add multiple entries for the purposes of high availability.


```
simplivity_validate_certs: false
```
