# Anthos prerequisites

To install Anthos GKE on-prem, you must have an Anthos subscription. You will need to create a
whitelisted Google Cloud project with the required APIs enabled. You also need to create a number
of service accounts:

- Google Cloud project whitelisted service account.
- Connect service account to maintain a connection between GKE on-prem and Google Cloud.
- Register service account to register your GKE on-prem clusters with Google Cloud Console.
- Operations service account to export cluster logs from clusters to Stackdriver by way of your GCP project.

In your initial installation of Anthos GKE deployed on-premises, the following virtual machines
(VMs) are created:

- One VM for an admin workstation
- Four VMs for an admin cluster
- Three VMs for a user clusters

## Networking

In your vSphere environment, you must have a network that can support the creation of these eight
VMs. Your network must also be able to support a vCenter Server and an F5 BIG-IP load balancer.
Your network needs to support outbound traffic to the internet so that your admin workstation and
your cluster nodes can fetch GKE on-prem components and call certain Google services. If you want
external clients to call services in your GKE on-prem clusters, your network must support inbound
traffic from the internet.

## CPU, RAM and storage requirements

Your vSphere environment must have enough storage, CPU, and RAM resources to fulfill the needs of
your admin workstation, your admin cluster, and your user clusters. The resource needs of your user
clusters depend on the type of workloads you intend to run.

More information of the CPU, RAM and storage requirements are available at
[cloud.google.com/anthos/gke/docs/on-prem/how-to/cpu-ram-storage](cloud.google.com/anthos/gke/docs/on-prem/how-to/cpu-ram-storage).
