---
title: "Private Link and DNS: private access is more than one endpoint"
summary: "Understand private endpoints, private DNS zones, resolution paths, and PaaS data-plane protection."
track: network
difficulty: 进阶
tags: ["Private Link", "DNS", "PaaS", "AZ-700"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/private-link/", "https://learn.microsoft.com/en-us/azure/dns/"]
reviewedAt: "2026-10-10"
locale: en
order: 2
cert: "AZ-700"
---

## Concept notes

Private Link lets clients reach supported Platform as a Service (PaaS) services through a private IP inside a virtual network, which reduces public data-plane exposure. But many failures come from DNS: the same service FQDN must resolve to the private endpoint address, or traffic may still use the public path or fail outright. When you design it, pay attention to the private endpoint, network policy, private DNS zone, zone links, on-premises forwarding, and firewall rules together. It is not “automatic security”; identity, RBAC, service firewalls, and logs still need to work together.

## Tradeoffs and safety exercise

Safety exercise: draw two resolution paths for an app that accesses a storage account: without Private Link, the name resolves to a public address; with Private Link, it resolves to a private address. Write the expected output of the validation commands, but do not run any real resources. Then list the risks: whether multiple VNets are linked to the DNS zone, whether the on-prem network can resolve the name, and whether deleting the endpoint leaves stale records behind. This exercise helps you avoid mistaking a connectivity problem for an application-code problem.

## Completion checklist

- Can explain how private endpoints and service firewalls work together.
- Can explain why DNS is the key to Private Link success.
- Can design a resolution path for cross-VNet or on-premises access.
