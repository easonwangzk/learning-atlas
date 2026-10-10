---
title: "VNet segmentation: subnets, routes, and minimal exposure"
summary: "Use address space, subnets, NSGs, route tables, and monitoring to understand Azure networking fundamentals."
track: network
difficulty: 入门
tags: ["VNet", "NSG", "Route", "AZ-700"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/virtual-network/", "https://learn.microsoft.com/en-us/azure/network-watcher/vnet-flow-logs-overview"]
reviewedAt: "2026-10-10"
locale: en
order: 1
cert: "AZ-700"
---

## Concept notes

A virtual network (VNet) is the basic isolation boundary in Azure networking. The address space determines whether you can peer, expand, or connect on-premises later; subnets hold service groupings; Network Security Groups (NSGs) are stateful traffic filters, not routing, authentication, or transport-layer security controls; route tables change the next hop; and diagnostic logs help explain why traffic did not flow. AZ-700 emphasizes connectivity, security, and troubleshooting, while AZ-305 places the network into the overall architecture. Segmentation is not better just because it is more granular; over-segmentation adds routing, Domain Name System (DNS), permission, and troubleshooting cost. A good network diagram should mark trust boundaries and observation points.

## Tradeoffs and safety exercise

Paper/local safety exercise: draw a VNet for a web, API, and data tier. Allow only user-to-web, web-to-API, and API-to-database traffic; manage access through Bastion or a controlled jump host instead of public Remote Desktop Protocol (RDP) or Secure Shell (SSH). For each allowed rule, write the business reason; for each denied rule, write the risk. Ask whether DNS resolves correctly, and whether VNet flow logs and Network Watcher IP flow verification explain traffic paths and rule decisions. Prefer VNet flow logs for new designs: new NSG flow logs are no longer supported, and the feature retires on 2027-09-30.

## Completion checklist

- Can explain why address space planning matters.
- Can distinguish the roles of NSGs, route tables, and firewalls.
- Can label trust boundaries and log sources in a network diagram.
