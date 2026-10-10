---
slug: azure-sql-operations
title: "Azure SQL：托管关系数据库的日常设计"
summary: "从部署模型、身份、备份、性能层和审计认识 Azure SQL。"
track: database
difficulty: 入门
tags: ["Azure SQL", "Backup", "Security", "AZ-305"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/azure-sql/", "https://learn.microsoft.com/zh-cn/azure/backup/"]
reviewedAt: "2026-10-10"
order: 1
cert: "AZ-305"
---

## 概念笔记

Azure SQL 提供托管关系数据库能力，但“托管”不代表无需设计。你仍要选择数据库、弹性池或托管实例，规划登录与 Entra 身份，配置网络访问、透明数据加密、审计、备份保留、性能层和索引维护。关系数据库适合事务一致性、结构化查询和成熟 SQL 生态；如果数据模型频繁变化或需要全球低延迟文档访问，Cosmos DB 可能更合适。架构题常考的是为什么选择，而非只背服务名称。

## 取舍与安全实验

纸面/本地安全实验：为订单系统写一张“数据保护表”：哪些表含个人信息，谁能读写，审计保留多久，备份恢复到哪个时间点，测试环境是否脱敏。再设计一个慢查询排障流程：指标、查询存储、索引建议、应用连接池和成本层级逐项检查。不要把升配当作唯一优化；错误索引和聊天式查询同样会烧钱。

## 完成检查

- 能说明 Azure SQL 适合的工作负载。
- 能把身份、网络、审计和备份作为默认设计项。
- 能用证据而非猜测处理性能问题。
