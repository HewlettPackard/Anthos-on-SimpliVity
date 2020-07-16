# HPE SimpliVity prerequisites

The minimal solution configuration requires a two-node HPE SimpliVity deployment, together with an
additional Windows host, which is not hosted inside the HPE SimpliVity cluster, to accommodate the
HPE SimpliVity Arbiter (Witness). This is the most economical deployment of Anthos GKE on HPE
SimpliVity, but comes with the highlighted RTO impact during a single node failure. If your
applications require higher resiliency, you should deploy using three or more HPE SimpliVity nodes
as outlined in the introduction.

A split-brain scenario occurs when two independent systems configured in a cluster lose network
connectivity and assume they have exclusive access to resources. The HPE SimpliVity Arbiter ensures
that a two-node or larger cluster survives a hyperconverged node failure without service disruption
or loss of access to data. Once you expand your deployment beyond the minimal two HPE SimpliVity
nodes, you no longer require the separate arbiter host.

## Versions

In general, GKE on-prem requires VMware vSphere 6.5 or 6.7 Update 3. This solution is based on HPE
SimpliVity software version 4.0.0, with VMware ESXi 6.7 Update 3 and vCenter VCSA 6.7 Update 3.
Running 6.7 Update 3 enables support for Kubernetes Container Storage Interface (CSI).

## Licensing

A vSphere Enterprise Plus or vSphere Standard license is required. The Enterprise Plus license is
recommended, because it allows you to enable the VMware Distributed Resource Scheduler (DRS). With
DRS enabled, VMware automatically distributes your GKE on-prem cluster nodes across physical hosts
in your data center. A VMware vCenter Server® Standard™ license is also required.

HPE SimpliVity licensing is based on the capacity model (XS, S, M, L, XL).
