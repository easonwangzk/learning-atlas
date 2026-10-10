---
slug: container-apps
title: "Container Apps：修订、伸缩与最小平台面"
summary: "理解托管容器应用的镜像、修订、入口、KEDA 伸缩与日志边界。"
track: compute
difficulty: 入门
tags: ["Container Apps", "KEDA", "AZ-305"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/container-apps/", "https://learn.microsoft.com/zh-cn/azure/well-architected/"]
reviewedAt: "2026-10-10"
order: 2
cert: "AZ-305"
---

## 概念笔记

Container Apps 位于“我想用容器交付，但不想管理 Kubernetes 控制面”的位置。核心对象不是单台服务器，而是环境、应用、修订、入口、密钥、身份和伸缩规则。修订让发布、回滚和流量拆分更清楚；KEDA 让 HTTP、队列或事件触发伸缩；托管身份让容器访问存储和数据库时避免硬编码密钥。架构设计时要问：镜像从哪里来，谁能部署，日志去哪，冷启动能否接受，内部服务是否需要私有入口。

## 取舍与安全实验

安全实验：为一个 README 级 API 画三条线：开发者推镜像、平台拉取并运行、应用访问数据库。为每条线标注最小权限和审计来源。然后比较 Container Apps、App Service 与 Functions：容器自由度、平台抽象、伸缩颗粒度、运维复杂度各不同。不要把演示容器误写成生产 SLA；生产还需要镜像扫描、环境分离、告警、预算和发布审批。

## 完成检查

- 能解释修订和流量切分的用途。
- 能说出托管身份替代静态密钥的价值。
- 能判断何时容器平台比 VM 更合适。
