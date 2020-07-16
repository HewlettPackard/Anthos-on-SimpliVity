# Proxy configuration

You may need to configure proxy settings when running the playbooks. If you configure a proxy,
it will be used on the Ansible controller, the admin workstation, and the admin and user clusters.

The variables for configuring the proxy for the Ansible controller are listed in the following table:

|Variable|File|Description|
|:-------|:---|:----------|
|`proxy_enabled`|inventory/group_vars/all/all.yml|One of `true` or `false`|
|`proxy_address`|inventory/group_vars/all/all.yml|For example, `'16.100.208.216'`|
|`proxy_port`|inventory/group_vars/all/all.yml|For example, `'8888'`|
|`proxy_type`|inventory/group_vars/all/all.yml|Defaults to `'http'`|
|`no_proxy`|inventory/group_vars/all/all.yml|For example, `'.hcilabs.hpecorp.net,.simplivt.local'`|


**Note:** This proxy configuration is used to generate a separate variable `gke_admin_workstation.proxyUrl` which is used in the [admin worksation configuration](admin-workstation-config).


## Sample proxy configuration

```
proxy_enabled: true
proxy_address: '16.100.208.216'
proxy_port: '8888'
proxy_type: 'http'
no_proxy: '.hcilabs.hpecorp.net,.simplivt.local'
```

## Disabling/enabling the configured proxy

If you have a proxy configured in your `all.yml` file, you can override the `proxy_enabled` setting when running the playbooks. See the section 
[Enabling/disabling specific features](../playbooks/enables-config).
