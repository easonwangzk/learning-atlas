---
slug: backup-continuity
title: "备份与连续性：从恢复目标倒推"
summary: "用 RPO/RTO、备份保管库、软删除和演练来设计可恢复系统。"
track: storage
difficulty: 入门
tags: ["Backup", "RPO", "RTO", "AZ-305"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/backup/", "https://learn.microsoft.com/zh-cn/azure/site-recovery/"]
reviewedAt: "2026-10-10"
order: 3
cert: "AZ-305"
---

## 概念笔记

备份不是勾选项，而是恢复承诺。RPO 回答“最多丢多少数据”，RTO 回答“多久恢复服务”。Azure Backup、软删除、快照、异地冗余和 Site Recovery 解决的问题不同：有的保护数据副本，有的编排灾难切换，有的只是误删缓冲。设计时要从业务流程倒推：哪些数据必须恢复，恢复到哪里，谁有权限触发，演练频率如何，备份本身是否防篡改。

## 取舍与安全实验

安全实验：为一个三层 Web 应用写恢复手册目录，不需要创建资源。目录包括：联系列表、依赖服务、备份范围、恢复顺序、验证查询、DNS 切换、回滚、事后复盘。再标注每一步需要的最小权限，避免“只有管理员知道怎么恢复”。最后写下成本问题：越短的 RPO/RTO 往往需要更多复制、自动化和演练预算。

## 完成检查

- 能区分备份、复制与灾难恢复。
- 能用 RPO/RTO 表达恢复目标。
- 能说明恢复演练比备份成功提示更重要。
