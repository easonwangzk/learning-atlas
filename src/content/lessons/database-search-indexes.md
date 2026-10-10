---
slug: search-indexes
title: "Azure AI Search：索引、向量与引用"
summary: "把全文检索、向量检索和 RAG 引用作为数据库旁路能力来设计。"
track: database
difficulty: 入门
tags: ["Azure AI Search", "RAG", "Index"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/search/", "https://learn.microsoft.com/zh-cn/azure/azure-monitor/"]
reviewedAt: "2026-10-10"
order: 3
cert: "扩展学习"
---

## 概念笔记

搜索索引不是主数据库的替代品。它把文档、字段、过滤器、排序、全文分析器和向量嵌入组织成适合检索的结构，常被 RAG 应用用作“先找证据，再生成回答”的数据面。设计时要决定数据来源、刷新频率、字段可过滤性、向量维度、权限裁剪和引用格式。若索引包含敏感数据，生成层必须继承权限边界，否则检索会把不该看的片段送进模型上下文。

## 取舍与安全实验

安全实验：为一个内部 FAQ 设计索引字段：title、body、department、updatedAt、sourceUrl、allowedGroups、embedding。写三条查询：关键词、按部门过滤、向量相似。再写一条回答模板：每个结论必须带 sourceUrl 和片段编号；找不到证据时回答“不知道”。这个练习能防止把 RAG 做成没有出处的聊天机器人。

## 完成检查

- 能区分主数据库和检索索引职责。
- 能说明权限裁剪对 RAG 的重要性。
- 能设计带引用的搜索结果结构。
