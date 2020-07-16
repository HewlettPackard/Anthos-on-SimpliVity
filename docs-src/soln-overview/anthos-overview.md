# Google Cloud’s Anthos

Anthos is an open, hybrid and multi-cloud application platform that enables you to modernize your
existing applications, build new ones, and run them anywhere in a secure manner. Built on open source
technologies pioneered by Google (including Kubernetes, Istio, and Knative), Anthos enables consistency
between on-premise and cloud environments and helps accelerate application development.

The main Anthos components are shown in Figure 1. Components running in the public cloud are shown on the left-hand side of the figure, while on-premise components are on the right.

!["Anthos components"][anthos-components-png]

**Figure 1.** Anthos components

Anthos consists of a number of components including:

- **Anthos GKE on-prem:** You can run your Kubernetes clusters reliably and efficiently on-premise using Anthos GKE on-prem. It makes container management easy, with quick, managed, and simple installs as well as upgrades validated by Google. GKE Connect runs on top of your fundamental connection (formed with Cloud Interconnect or Cloud VPN) and enables you to register your GKE on-prem clusters securely with Google Cloud. This allows access to your cluster and to workload management features that interact with your cluster. When you register a user cluster with Google Cloud Console, a Kubernetes Deployment called the Connect Agent is created in the cluster. The Connect Agent establishes a long-lived, encrypted connection between the cluster and Cloud Console. The Google Cloud Console gives you a single-pane-of-glass view for managing your clusters across on-premise and cloud environments. All of your resources are shown in a single dashboard, and it is easy to get visibility into your workloads across multiple Kubernetes clusters. More information on Anthos GKE is available at [https://cloud.google.com/anthos/gke](https://cloud.google.com/anthos/gke).

- **Anthos Config Management:** You can automate policy and security at scale for your Kubernetes deployments with Anthos Config Management. It powers rapid and secure application development, enabling you to create a common configuration for administrative policies that apply to your Kubernetes clusters both on-premise and in the cloud. You can evaluate changes and roll them out to all Kubernetes clusters so that your desired state is always reflected. Further information on Anthos Config Management is available at [https://cloud.google.com/anthos/config-management](https://cloud.google.com/anthos/config-management).

- **Anthos Service Mesh:** Google Cloud’s fully managed service mesh lets you manage complex microservices architectures so that you can get all the benefits of microservices without the overheads. It allows you to configure, control, secure and monitor your services in one place, taking a significant burden off your operations and development teams. More information on Anthos Service Mesh is available at [https://cloud.google.com/anthos/service-mesh](https://cloud.google.com/anthos/service-mesh).


## Additional Anthos functionality

Anthos provides additional functionality in a number of areas to help you deploy and manage your Kubernetes clusters.

### Monitoring

Built-in observability for Google Cloud is provided through Stackdriver. It offers a fully managed logging solution, metrics collection, monitoring, dashboarding, and alerting. Stackdriver monitors GKE on-prem clusters in a similar way to cloud-based GKE clusters.

Prometheus and Grafana can be enabled on each admin cluster and user cluster, if you prefer using these technologies. Running this open-source monitoring stack locally facilitates the retention of application metrics within the cluster and also enables the troubleshooting of issues if network connectivity to Google Cloud is lost.

Commercial third-party monitoring and logging solutions are also supported including products from Datadog, Elastic and Splunk.

### Rapid application deployment

You can quickly deploy functional software packages that run on Google Cloud Platform using GCP Marketplace. The Marketplace enables you to deploy applications such as Cassandra or Jenkins with a one-click installer.

### Serverless

You can run stateless containers in a fully managed, auto-scaling compute platform using Cloud Run for Anthos, which is based on the open-source Knative project.


## Anthos GKE on-prem architecture

Figure 2 is an architecture diagram for Anthos GKE on-prem, deployed with a single user cluster:

!["GKE admin cluster with single user cluster"][gke-admin-user-clusters-png]

**Figure 2.** GKE admin cluster with single user cluster

The primary components in a GKE on-prem deployment include:

- Admin workstation
- Admin cluster
- One or more user clusters

**Note:** The control plane master nodes for the user clusters live inside the admin cluster, rather than
in the user clusters themselves.




[anthos-components-png]:<../images/anthos-components.png>
[gke-admin-user-clusters-png]:<../images/gke-admin-user-clusters.png>
