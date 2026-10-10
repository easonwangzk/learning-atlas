---
title: "Azure Files: shared files and identity boundaries"
summary: "Understand SMB/NFS shares, hybrid access, permissions models, and migration scenarios."
track: storage
difficulty: 入门
tags: ["Azure Files", "Identity", "Hybrid", "AZ-104"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/storage/files/", "https://learn.microsoft.com/en-us/entra/identity/"]
reviewedAt: "2026-10-10"
locale: en
order: 2
cert: "AZ-104"
---

## Concept notes

Azure Files provides managed file shares, and it is commonly used for legacy application migration, user shared folders, container mounts, or hybrid work. Its difference from Blob is the file protocol and directory semantics: SMB/NFS clients expect paths, locks, and share permissions. Design must handle networking, identity, and performance tier together: whether access is private through VPN or ExpressRoute, whether domain identity is required, whether quota and throughput match the workload, and how snapshots restore. Treating a file share like “infinite disk” hides permission inheritance, ransomware recovery, and latency problems.

## Tradeoffs and safety exercise

Safety exercise: choose a legacy file-server migration scenario and write five questions: which applications depend on SMB, which user groups have access, which directories contain sensitive data, how long the outage window is, and what the rollback path is. Then draw the access path: office client, private network, storage account, firewall, identity source, and audit logs. If the answers are not clear, do not migrate yet; file-system migration failures are usually not a copy-command problem, but a permissions and usage-pattern problem.

## Completion checklist

- Can explain the typical difference between Azure Files and Blob.
- Can include identity, networking, and snapshots in the design.
- Can identify the inventory questions before a file-server migration.
