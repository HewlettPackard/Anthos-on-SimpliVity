# F5 prerequisites

## Versions

Each version of GKE on-prem relies on a different version of container ingress services (CIS).
Ensure that the F5 BIG-IP load balancer version supports the F5 BIG-IP CIS version that comes with
GKE on-prem by consulting with the F5 BIG-IP Controller/Platform compatibility matrix.

The version of F5 BIG-IP used in this solution is BIG-IP 13.1.3 Build 0.0.6 Final.

## Licensing

APM, Base, VE GBB (500 CCU, 2500 Access Sessions).

## Minimum system requirements

Make sure your F5 BIG-IP environment meets the following minimum system requirements:

- 8 vCPUs that aren’t shared between other VMs on that system
- 16 GB memory that isn’t shared between other VMs on that system

## Setting aside virtual IP addresses

You need to set aside several virtual IP (VIP) addresses that you intend to use for load balancing.
Later, you specify these addresses in your cluster configuration file, and GKE on-prem
automatically configures the F5 BIG-IP load balancer to use the addresses.

For your admin cluster, you need to set aside a VIP address for each of the following:

- Kubernetes API server
- Ingress service
- Add-on service

For each user cluster, you need to set aside a VIP address for each of the following:

- Kubernetes API server
- Ingress service
