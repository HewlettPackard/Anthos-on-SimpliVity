(window.webpackJsonp=window.webpackJsonp||[]).push([[51],{474:function(e,s,t){"use strict";t.r(s);var r=t(35),i=Object(r.a)({},(function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"f5-prerequisites"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#f5-prerequisites"}},[e._v("#")]),e._v(" F5 prerequisites")]),e._v(" "),t("h2",{attrs:{id:"versions"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#versions"}},[e._v("#")]),e._v(" Versions")]),e._v(" "),t("p",[e._v("Each version of GKE on-prem relies on a different version of container ingress services (CIS).\nEnsure that the F5 BIG-IP load balancer version supports the F5 BIG-IP CIS version that comes with\nGKE on-prem by consulting with the F5 BIG-IP Controller/Platform compatibility matrix.")]),e._v(" "),t("p",[e._v("The version of F5 BIG-IP used in this solution is BIG-IP 13.1.3 Build 0.0.6 Final.")]),e._v(" "),t("h2",{attrs:{id:"licensing"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#licensing"}},[e._v("#")]),e._v(" Licensing")]),e._v(" "),t("p",[e._v("APM, Base, VE GBB (500 CCU, 2500 Access Sessions).")]),e._v(" "),t("h2",{attrs:{id:"minimum-system-requirements"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#minimum-system-requirements"}},[e._v("#")]),e._v(" Minimum system requirements")]),e._v(" "),t("p",[e._v("Make sure your F5 BIG-IP environment meets the following minimum system requirements:")]),e._v(" "),t("ul",[t("li",[e._v("8 vCPUs that aren’t shared between other VMs on that system")]),e._v(" "),t("li",[e._v("16 GB memory that isn’t shared between other VMs on that system")])]),e._v(" "),t("h2",{attrs:{id:"setting-aside-virtual-ip-addresses"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#setting-aside-virtual-ip-addresses"}},[e._v("#")]),e._v(" Setting aside virtual IP addresses")]),e._v(" "),t("p",[e._v("You need to set aside several virtual IP (VIP) addresses that you intend to use for load balancing.\nLater, you specify these addresses in your cluster configuration file, and GKE on-prem\nautomatically configures the F5 BIG-IP load balancer to use the addresses.")]),e._v(" "),t("p",[e._v("For your admin cluster, you need to set aside a VIP address for each of the following:")]),e._v(" "),t("ul",[t("li",[e._v("Kubernetes API server")]),e._v(" "),t("li",[e._v("Ingress service")]),e._v(" "),t("li",[e._v("Add-on service")])]),e._v(" "),t("p",[e._v("For each user cluster, you need to set aside a VIP address for each of the following:")]),e._v(" "),t("ul",[t("li",[e._v("Kubernetes API server")]),e._v(" "),t("li",[e._v("Ingress service")])])])}),[],!1,null,null,null);s.default=i.exports}}]);