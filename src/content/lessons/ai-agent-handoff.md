---
slug: agent-handoff
title: "Agent 与人工接管：工具、记忆和边界"
summary: "用客服案例理解函数工具、用户偏好、会话状态和人工接管不是真实派单。"
track: ai
difficulty: 入门
tags: ["Agent", "Handoff", "Identity"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/entra/identity/", "https://learn.microsoft.com/zh-cn/azure/container-apps/"]
reviewedAt: "2026-10-10"
order: 2
cert: "扩展学习"
---

## 概念笔记

Agent 应用把模型、工具、状态和策略编排在一起。工具可能查询订单、创建工单或检索知识库；状态可能保存会话和用户偏好；策略决定何时拒答、升级或要求确认。学习时要明确：演示里的 handoff 往往只是创建票据或标记状态，不等于真实客服人员接入。用户偏好也必须按身份隔离，不能让一个人的沟通方式影响另一个人。越像自动化系统，越需要审计和回滚。

## 取舍与安全实验

安全实验：设计一个“查询订单状态”的函数工具契约。输入只允许 orderId，调用前检查当前用户是否拥有订单，输出只返回必要字段和引用。再设计人工接管条件：身份不匹配、用户要求投诉、模型置信不足、政策风险。最后写日志字段：requestId、userId、toolName、decision、handoffTicketId。不要记录完整敏感内容。

## 完成检查

- 能区分模型回答、工具调用和业务系统动作。
- 能说明用户偏好需要按用户隔离。
- 能把 handoff 描述为状态或工单，而非虚构真人在线。
