---
title: "Backup and continuity: work backward from recovery targets"
summary: "Design for recoverability with recovery point objective (RPO), recovery time objective (RTO), backup vaults, soft delete, and drills."
track: storage
difficulty: 入门
tags: ["Backup", "RPO", "RTO", "AZ-305"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/backup/", "https://learn.microsoft.com/en-us/azure/site-recovery/"]
reviewedAt: "2026-10-10"
locale: en
order: 3
cert: "AZ-305"
---

## Concept notes

Backup is not a checkbox; it is a recovery promise. Recovery point objective (RPO) answers “how much data can we lose at most,” and recovery time objective (RTO) answers “how long can service be down.” Azure Backup, soft delete, snapshots, geo-redundancy, and Site Recovery solve different problems: some protect data copies, some orchestrate disaster failover, and some only buffer accidental deletion. Design by working backward from the business process: which data must be restored, where it must be restored, who is allowed to trigger it, how often drills run, and whether the backup itself is tamper-resistant.

## Tradeoffs and safety exercise

Safety exercise: write a recovery-manual table of contents for a three-tier web app; you do not need to create any resources. Include a contact list, dependent services, backup scope, restore order, validation queries, DNS cutover, rollback, and postmortem review. Then label the minimum permissions needed for each step so only one administrator does not become the sole person who knows how to recover. Finally, write down the cost question: shorter RPO/RTO targets usually require more replication, automation, and drill budget.

## Completion checklist

- Can distinguish backup, replication, and disaster recovery.
- Can express recovery targets using RPO and RTO.
- Can explain why recovery drills matter more than a “backup succeeded” message.
