---
slug: edge-hybrid
title: "边缘与混合网络：Front Door、ExpressRoute 与故障域"
summary: "用全球入口、专线和多区域设计理解性能、可靠性与成本权衡。"
track: network
difficulty: 进阶
tags: ["Front Door", "ExpressRoute", "Hybrid", "AZ-700"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/frontdoor/", "https://learn.microsoft.com/zh-cn/azure/expressroute/"]
reviewedAt: "2026-10-10"
order: 3
cert: "AZ-700"
---

## 概念笔记

边缘入口和混合连接解决不同问题。Azure Front Door 面向全球 HTTP/HTTPS 入口、加速、Web 应用程序防火墙（Web Application Firewall，WAF）和源站切换；这里的 WAF 不是 Azure Well-Architected Framework。ExpressRoute 面向本地与 Azure 的专用连接和可预测网络路径。多区域架构中，入口层、应用层、数据层的故障域不同，切换速度也不同。设计时要问：用户在哪里，源站健康如何检测，证书谁管理，本地依赖是否会成为单点，专线成本是否匹配业务价值。

## 取舍与安全实验

纸面/本地安全实验：为一个公开 Web 应用写两版架构：单区域 App Service 加 Front Door，多区域主动/被动加数据库复制。比较它们的复杂度、恢复时间、数据一致性和月度成本。再写混合访问问题：如果后端必须调用本地系统，ExpressRoute 断开时用户体验如何降级？这能帮助你避免只把“全球入口”当成性能按钮。

## 完成检查

- 能区分 Front Door 与 ExpressRoute 的目标。
- 能解释健康探测和源站切换。
- 能把混合依赖纳入连续性设计。
