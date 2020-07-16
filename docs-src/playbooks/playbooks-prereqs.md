# Get prerequisites


## Before you run

- Configure proxy, if required
- `ssh` keys in `anthos_secrets` directory
- Whitelisted key in `anthos_secrets` directory

## Command

```
cd ~/Anthos-on-SimpliVity

ansible-playbook playbooks/get_prereq.yml  --ask-vault-pass
```

## 

- Install required packages for Cloud SDK
- Configure gcloud project and proxy
- Activate GCP whitelisted key
- Configure gcloud required apis
- Download gkeadm binary if it doesn't exist - /usr/local/bin/gkeadm


