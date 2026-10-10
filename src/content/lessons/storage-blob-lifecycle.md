---
slug: blob-lifecycle
title: "Blob 生命周期：层级、访问与保留"
summary: "从对象存储的热/冷层、生命周期规则、SAS、RBAC 和不可变策略理解数据治理。"
track: storage
difficulty: 入门
tags: ["Blob", "Lifecycle", "Governance", "AZ-104"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/storage/blobs/", "https://learn.microsoft.com/zh-cn/azure/governance/policy/"]
reviewedAt: "2026-10-10"
order: 1
cert: "AZ-104"
---

## 概念笔记

Blob Storage 适合非结构化对象：图片、日志、备份、数据湖文件和静态资产。学习重点不是“上传文件”，而是账户冗余、容器权限、访问层、生命周期规则、加密、软删除、版本、不可变保留和网络边界。热层访问贵但读取快，冷层存储便宜但恢复和读取成本更高。公开读取要格外谨慎；多数业务应优先使用 Entra ID、基于角色的访问控制（Role-Based Access Control，RBAC）、托管身份或短期共享访问签名（Shared Access Signature，SAS），而不是长期共享密钥。

## 取舍与安全实验

纸面/本地安全实验：为“学习截图归档”写一条生命周期规则：30 天后转冷、180 天后归档、365 天后删除。再写出例外：法律保留、项目交付物、个人隐私数据。最后设计一次访问审计：谁创建 SAS，SAS 何时过期，是否允许公网，日志在哪里查询。这个练习帮助你把成本、合规与恢复时间一起看，而不是只追求最低存储单价。

## 完成检查

- 能区分访问层与冗余策略。
- 能解释 SAS、RBAC、共享密钥的风险差异。
- 能为对象数据设计生命周期和删除保护。
