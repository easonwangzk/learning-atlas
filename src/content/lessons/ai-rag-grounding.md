---
slug: rag-grounding
title: "RAG：检索增强生成与可追溯答案"
summary: "理解 Retrieval-Augmented Generation 的检索、排序、上下文、引用和失败策略。"
track: ai
difficulty: 入门
tags: ["RAG", "Citations", "AI"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/foundry/", "https://learn.microsoft.com/zh-cn/azure/search/", "https://developers.openai.com/api/docs"]
reviewedAt: "2026-10-10"
order: 1
cert: "扩展学习"
---

## 概念笔记

检索增强生成（Retrieval-Augmented Generation，RAG）把“从资料中找证据”和“用模型组织回答”分开。一个可靠流程通常包括文档清洗、切块、嵌入、索引、检索、重排、上下文拼接、生成和引用展示。它不能保证答案一定正确；如果检索不到、资料过期、权限错误或提示词要求过度推断，模型仍可能编造。学习重点是让回答可追溯、可拒答、可观测，并评估检索命中率、引用正确性和拒答行为，而不是追求看起来流畅的长文本。

## 取舍与安全实验

纸面/本地安全实验：选一页公开文档，手动切成三段，为每段写标题和 sourceUrl。提出一个只能由第二段回答的问题，再写生成规则：只能使用给定段落；没有证据就说无法确认；答案后列引用。然后故意提出越界问题，检查系统是否拒答。这个练习不需要调用任何模型，也能训练你设计 RAG 的证据边界。

## 完成检查

- 能解释 RAG 的每个主要步骤。
- 能说明引用不是装饰，而是可审计证据。
- 能设计无证据、权限不足和资料过期时的回答策略。
