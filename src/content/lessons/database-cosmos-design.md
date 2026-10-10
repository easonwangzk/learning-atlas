---
slug: cosmos-design
title: "Cosmos DB：分区、一致性与吞吐"
summary: "理解 NoSQL 全球分布式数据库的分区键、RU、复制和一致性选择。"
track: database
difficulty: 进阶
tags: ["Cosmos DB", "Partition", "Consistency", "AZ-305"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/cosmos-db/", "https://learn.microsoft.com/zh-cn/azure/well-architected/"]
reviewedAt: "2026-10-10"
order: 2
cert: "AZ-305"
---

## 概念笔记

Cosmos DB 的学习核心是把访问模式提前说清楚。分区键决定数据和吞吐如何分布，选错后热点、跨分区查询和迁移成本都会放大。请求单位（Request Unit，RU）把读写查询统一到容量单位，但它不是免费魔法；索引策略、文档大小、一致性级别、区域复制都会影响成本和延迟。强一致性更直观但适用范围和性能代价更高，最终一致性更灵活但应用需要能处理短暂差异。它适合全球分布、低延迟和灵活文档模型；不能把分区数据库、主数据存储和搜索索引混为一谈。

## 取舍与安全实验

纸面/本地安全实验：为“用户活动流”设计三个候选分区键：userId、tenantId、date。对每个写出高峰写入、按用户读取、跨租户分析和删除合规的影响。再估算哪些查询需要复合索引，哪些应进入分析管道而非在线数据库。这个纸面练习比直接建库更有价值，因为 Cosmos 的很多问题在数据量变大后才暴露。

## 完成检查

- 能解释分区键与热点风险。
- 能说明一致性选择影响应用逻辑。
- 能把 RU、索引和区域复制纳入成本讨论。
