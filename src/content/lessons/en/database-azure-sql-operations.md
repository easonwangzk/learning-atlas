---
title: "Azure SQL: day-to-day design for a managed relational database"
summary: "Learn Azure SQL through deployment models, identity, backups, service tiers, and auditing."
track: database
difficulty: 入门
tags: ["Azure SQL", "Backup", "Security", "AZ-305"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/azure-sql/", "https://learn.microsoft.com/en-us/azure/backup/"]
reviewedAt: "2026-10-10"
locale: en
order: 1
cert: "AZ-305"
---

## Concept notes

Azure SQL provides managed relational database capabilities, but “managed” does not mean no design work. You still need to choose between a single database, an elastic pool, or a managed instance; plan logins and Entra identity; configure network access, transparent data encryption, auditing, backup retention, service tiers, and index maintenance. A relational database is a strong fit for transactional consistency, structured queries, and a mature SQL ecosystem; if your data model changes often or you need globally low-latency document access, Cosmos DB may be a better fit. Architecture questions usually test why you chose the service, not just whether you can name it.

## Tradeoffs and safety exercise

Safety exercise: write a “data protection table” for an order system. List which tables contain personal information, who can read and write them, how long audit records are kept, what point in time backups can restore to, and whether test environments are masked. Then design a slow-query troubleshooting flow: check metrics, Query Store, index recommendations, application connection pooling, and service tier in order. Do not treat scaling up as the only optimization; bad indexes and chatty queries can waste money just as quickly.

## Completion checklist

- Can explain which workloads Azure SQL fits well.
- Can treat identity, networking, auditing, and backups as default design items.
- Can use evidence instead of guessing when diagnosing performance issues.
