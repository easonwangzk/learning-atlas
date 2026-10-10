---
title: "VM basics: responsibility boundaries, identity, and observability"
summary: "Use virtual machines (VMs), managed disks, availability, RBAC, and Azure Monitor to understand IaaS operating responsibilities."
track: compute
difficulty: 入门
tags: ["VM", "RBAC", "Monitor", "AZ-104"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/virtual-machines/", "https://learn.microsoft.com/en-us/azure/azure-monitor/"]
reviewedAt: "2026-10-10"
locale: en
order: 1
cert: "AZ-104"
---

## Concept notes

Virtual machines (VMs) are the most direct cloud building block: you get operating-system control, and you also inherit the responsibility for patching, baselines, backups, logging agents, exposed ports, and the cost switch. When learning, do not stop at “can it boot”; also record the image source, size, availability zone, managed disk type, network security group, managed identity, and role-based access control (RBAC) assignment. AZ-104 focuses on day-to-day management, while AZ-305 places the VM into migration, reliability, and cost tradeoffs. VMs are a good fit for workloads that need OS-level control, legacy software, or special drivers; if you only need a hosted web or API app, a platform service may be easier to operate.

## Tradeoffs and safety exercise

Safety exercise: in a free or learning subscription, do only paper design, not real resource creation. Draw the inbound path for a VM: user, DNS, load balancer, Network Security Group (NSG), subnet, managed identity, and log workspace. List who can change each layer, how it is audited, and how you recover after failure. Then write down the cost difference between stopping a VM and deleting its disks so you remember that compute and persistent storage are billed separately. In practice, shutting down a VM without deallocating it can still leave compute charges in place, while deallocation stops compute billing but disks and other attached resources continue to bill. If you ever do this for real, set a budget and auto-shutdown first.

## Completion checklist

- Can explain the responsibility difference between IaaS and PaaS.
- Can include identity, networking, logging, and backups in a VM design.
- Can explain why a VM is not the default answer for every workload.
