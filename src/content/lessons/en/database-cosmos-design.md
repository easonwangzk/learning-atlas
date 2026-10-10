---
title: "Cosmos DB: partitioning, consistency, and throughput"
summary: "Understand partition keys, request units, replication, and consistency choices for a globally distributed NoSQL database."
track: database
difficulty: 进阶
tags: ["Cosmos DB", "Partition", "Consistency", "AZ-305"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/cosmos-db/", "https://learn.microsoft.com/en-us/azure/well-architected/"]
reviewedAt: "2026-10-10"
locale: en
order: 2
cert: "AZ-305"
---

## Concept notes

The core of Cosmos DB learning is making the access pattern explicit up front. The partition key decides how data and throughput are distributed; if you choose poorly, hot partitions, cross-partition queries, and migration costs all grow. Request units (RUs) unify reads, writes, and queries into one capacity model, but they are not free magic; indexing strategy, document size, consistency level, and regional replication all affect cost and latency. Strong consistency is easier to reason about but has a larger scope and performance cost, while eventual consistency is more flexible but requires the application to handle short-term differences. It is a good fit for global distribution, low latency, and flexible document models.

## Tradeoffs and safety exercise

Paper/local safety exercise: design three candidate partition keys for a “user activity feed”: `userId`, `tenantId`, and `date`. For each one, write out the impact on peak writes, per-user reads, cross-tenant analysis, and deletion compliance. Then estimate which queries need composite indexes and which should move to an analytics pipeline instead of the online database. This paper exercise is more valuable than creating the database immediately, because many Cosmos DB issues only show up when the dataset grows.

## Completion checklist

- Can explain the relationship between partition keys and hot partition risk.
- Can explain how consistency choice affects application logic.
- Can include request units, indexes, and regional replication in cost discussions.
