---
title: "Blob lifecycle: tiers, access, and retention"
summary: "Use hot/cool tiers, lifecycle rules, Shared Access Signatures (SAS), RBAC, and immutable policies to govern object data."
track: storage
difficulty: 入门
tags: ["Blob", "Lifecycle", "Governance", "AZ-104"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/storage/blobs/", "https://learn.microsoft.com/en-us/azure/governance/policy/"]
reviewedAt: "2026-10-10"
locale: en
order: 1
cert: "AZ-104"
---

## Concept notes

Blob Storage is a good fit for unstructured objects: images, logs, backups, data-lake files, and static assets. The learning focus is not just “uploading files,” but account redundancy, container permissions, access tiers, lifecycle rules, encryption, soft delete, versioning, immutable retention, and network boundaries. Hot-tier access is more expensive but faster to read; cool-tier storage is cheaper but has higher restore and read costs. Public read access requires extra caution; most business workloads should prefer Entra ID, role-based access control (RBAC), managed identity, or short-lived Shared Access Signatures (SAS) instead of long-lived shared keys.

## Tradeoffs and safety exercise

Paper/local safety exercise: write a lifecycle rule for “learning screenshots”: move to cool tier after 30 days, archive after 180 days, and delete after 365 days. Then write the exceptions: legal hold, project deliverables, and personal privacy data. Finally, design one access audit: who created the SAS, when it expires, whether public network access is allowed, and where the logs are queried. This exercise helps you look at cost, compliance, and recovery time together instead of chasing only the lowest storage price.

## Completion checklist

- Can distinguish access tiers from redundancy strategy.
- Can explain the risk differences between SAS, RBAC, and shared keys.
- Can design lifecycle and delete protection for object data.
