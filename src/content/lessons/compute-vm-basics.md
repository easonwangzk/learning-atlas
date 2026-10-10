---
slug: vm-basics
title: "VM 基础：责任边界、身份与观测"
summary: "从虚拟机选择、托管磁盘、可用性、RBAC 与 Azure Monitor 认识 IaaS 的运维责任。"
track: compute
difficulty: 入门
tags: ["VM", "RBAC", "Monitor", "AZ-104"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/virtual-machines/", "https://learn.microsoft.com/zh-cn/azure/azure-monitor/"]
reviewedAt: "2026-10-10"
order: 1
cert: "AZ-104"
---

## 概念笔记

虚拟机是最直观的云计算单元：你获得操作系统控制权，也继承补丁、基线、备份、日志代理、端口暴露和成本开关的责任。学习时不要只看“能不能开机”，而要同时记录镜像来源、大小、可用性区域、托管磁盘类型、网络安全组、托管身份和 RBAC 分配。AZ-104 会关注日常管理，AZ-305 会把它放进迁移、可靠性和成本权衡中。VM 适合需要 OS 级控制、传统软件或特殊驱动的场景；若只是托管 Web/API，平台服务可能更省运维。

## 取舍与安全实验

安全实验：在免费或学习订阅中只做纸面设计，不创建真实资源。画出一台 VM 的入站路径：用户、DNS、负载均衡、NSG、子网、托管身份、日志工作区。列出每一层“谁能改、如何审计、失败后如何恢复”。再写下停止 VM 与删除磁盘的成本差异，提醒自己计算服务和持久存储分开计费。若未来动手，先设置预算和自动关机。

## 完成检查

- 能说明 IaaS 与 PaaS 的责任差异。
- 能把身份、网络、日志、备份放进 VM 设计。
- 能解释 VM 不是所有工作负载的默认答案。
