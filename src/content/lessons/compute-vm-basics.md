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

虚拟机（Virtual Machine，VM）是最直观的基础设施即服务（Infrastructure as a Service，IaaS）单元：你获得操作系统控制权，也继承补丁、基线、备份、日志代理、端口暴露和成本开关的责任。学习时不要只看“能不能开机”，而要同时记录镜像来源、大小、可用性区域、托管磁盘类型、网络安全组（Network Security Group，NSG）、托管身份和基于角色的访问控制（Role-Based Access Control，RBAC）分配。AZ-104 会关注日常管理，AZ-305 会把它放进迁移、可靠性和成本权衡中。VM 适合需要 OS 级控制、传统软件或特殊驱动的场景；若只是托管 Web/API，平台即服务（Platform as a Service，PaaS）可能更省运维。

## 取舍与安全实验

纸面/本地安全实验：在免费或学习订阅中只做纸面设计，不创建真实资源。画出一台 VM 的入站路径：用户、域名系统（Domain Name System，DNS）、负载均衡、NSG、子网、托管身份、日志工作区。列出每一层“谁能改、如何审计、失败后如何恢复”。再写下关机、停止并释放（deallocate）与删除磁盘的成本差异：释放通常停止计算计费，但磁盘、公网 IP、备份和其他关联资源仍可能计费。若未来动手，先设置预算、告警和自动关机；它们是护栏，不是硬性消费上限。

## 完成检查

- 能说明 IaaS 与 PaaS 的责任差异。
- 能把身份、网络、日志、备份放进 VM 设计。
- 能解释 VM 不是所有工作负载的默认答案。
