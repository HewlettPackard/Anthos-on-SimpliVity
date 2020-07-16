# HPE SimpliVity

HPE SimpliVity combines IT infrastructure, advanced data services, and AI-driven operations into a single, integrated hyperconverged solution at a fraction of traditional offerings' costs. By infusing artificial intelligence (AI) into hyperconverged infrastructure (HCI) environments, HPE SimpliVity has dramatically simplified and changed how customers can manage and support their infrastructure with:

- Simplified management, troubleshooting and deployment.
- Easy to update software, hypervisor, and firmware.
- Rapid deployment and scaling to meet demand.
- Built-in resiliency, backup and disaster recovery for data protection.
- Always-on deduplication and compression for reduced capacity utilization by up to 10X.
- Reduced complexity and overhead for ROBO and edge deployments, with central management in a single interface.
- Intelligent monitoring with HPE InfoSight for HPE SimpliVity, providing predictive analytics, proactive wellness alerts and resource utilization insights.

Figure 3 shows the physical topology for a minimal HPE SimpliVity deployment used to host Anthos.

!["Physical topology"][physical-topology-png]

**Figure 3.** Physical topology

**Note:** With the minimal, two-node HPE SimpliVity deployment, you must provide an additional Windows
host, which is not hosted inside the HPE SimpliVity cluster, to accommodate the SimpliVity Arbiter
(Witness). However, once you expand your deployment beyond the minimal two HPE SimpliVity nodes, you no
longer require the extra SimpliVity Arbiter (Witness) host with the 4.0.0 release of HPE SimpliVity.

## Resiliency protection against disk and node failures

In the minimal, two-node HPE SimpliVity deployment, High Availability (HA) protection from a node failure is provided via VMware HA, in conjuction with Storage HA. Any virtual machines (in this instance, Anthos GKE nodes) on the impacted node will be automatically recovered on the surviving node. However, applciations running on the affected node could be offline for up to ten minutes in the minimal two-node HPE SimpliVity deployment while the recovery process takes place.

For customers with higher resiliency requirements, we recommend deploying HPE SimpliVity clusters with three (or more) nodes with the GKE admin and user cluster components spread across the three nodes. It is also advisable to deploy highly available load balancers, on VMs that are prevented from running on the same ESXi host through the use of anti-affinity rules.

[physical-topology-png]:<../images/physical-topology.png>