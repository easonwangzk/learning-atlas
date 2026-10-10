---
slug: vnet-segmentation
title: "VNet 分段：子网、路由与最小暴露"
summary: "从地址空间、子网、NSG、路由表和监控理解 Azure 网络基础。"
track: network
difficulty: 入门
tags: ["VNet", "NSG", "Route", "AZ-700"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/virtual-network/", "https://learn.microsoft.com/zh-cn/azure/network-watcher/vnet-flow-logs-overview"]
reviewedAt: "2026-10-10"
order: 1
cert: "AZ-700"
---

## 概念笔记

虚拟网络（Virtual Network，VNet）是 Azure 网络隔离的基本边界。地址空间决定未来能否对等、扩展或接入本地；子网承载服务分组；网络安全组（Network Security Group，NSG）是有状态流量过滤，不负责路由、身份认证或传输层安全；路由表改变下一跳；诊断日志帮助解释“为什么不通”。AZ-700 更强调连接、安全和排错，AZ-305 会把网络放进整体架构。分段不是越碎越安全，过度分段会增加路由、域名系统（Domain Name System，DNS）、权限和排障成本。好的网络图应标明信任边界和观测点。

## 取舍与安全实验

纸面/本地安全实验：为 Web、API、数据三层画 VNet。只允许用户到 Web，Web 到 API，API 到数据库；管理入口通过 Bastion 或受控跳板，不开放任意公网远程桌面协议（Remote Desktop Protocol，RDP）或安全外壳协议（Secure Shell，SSH）。为每条允许规则写业务理由，为每条拒绝规则写风险。最后设计两个排障问题：DNS 解析是否正确，VNet 流日志与 Network Watcher 的 IP 流验证能否解释流量路径与规则决策。新方案优先采用 VNet 流日志：NSG 流日志已停止支持新建，并将于 2027-09-30 退役。

## 完成检查

- 能解释地址空间规划的重要性。
- 能区分 NSG、路由表和防火墙角色。
- 能在网络图中标注信任边界与日志来源。
