---
slug: serverless-operations
title: "Serverless 运维：触发器、冷启动与成本护栏"
summary: "用 Azure Functions 思考事件驱动计算的触发器、绑定、重试、可观测性和预算。"
track: compute
difficulty: 入门
tags: ["Functions", "Observability", "Cost"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/azure-functions/", "https://learn.microsoft.com/zh-cn/azure/azure-monitor/"]
reviewedAt: "2026-10-10"
order: 3
cert: "扩展学习"
---

## 概念笔记

无服务器不是“没有服务器”，而是把容量规划、运行时补丁和部分伸缩交给平台。Functions 的思维单位是触发器与绑定：HTTP、队列、定时器或事件网格决定函数何时运行，输入输出绑定降低样板代码。它适合突发、短任务、胶水逻辑和自动化；不适合长时间连接、严格低延迟或需要完整 OS 控制的工作负载。可靠性设计要考虑幂等、重试、死信、超时和观测，不要只写成功路径。

## 取舍与安全实验

安全实验：设计一个“上传 Blob 后生成缩略图”的事件流。只写伪代码和配置清单：触发器、存储权限、失败重试、日志字段、成本上限、隐私提示。再问自己：如果同一事件重复投递会怎样？如果下游 API 失败，是否会无限重试？如果本地开发者拿到连接字符串，是否能访问生产数据？这些问题比函数代码更接近真实运维。

## 完成检查

- 能说明触发器、绑定和幂等的关系。
- 能列出冷启动、超时和重试风险。
- 能为函数设置日志、告警和预算护栏。
