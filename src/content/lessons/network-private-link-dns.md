---
slug: private-link-dns
title: "Private Link 与 DNS：私有访问不只是一个端点"
summary: "理解私有终结点、专用 DNS 区域、解析路径和 PaaS 数据面保护。"
track: network
difficulty: 进阶
tags: ["Private Link", "DNS", "PaaS", "AZ-700"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/private-link/", "https://learn.microsoft.com/zh-cn/azure/dns/"]
reviewedAt: "2026-10-10"
order: 2
cert: "AZ-700"
---

## 概念笔记

Private Link 让客户端通过 VNet 内的私有 IP 访问支持的 PaaS 服务，减少公网数据面暴露。但很多故障来自 DNS：同一个服务 FQDN 必须解析到私有终结点地址，否则流量仍可能走公网路径或直接失败。设计时要同时关注私有终结点、网络策略、专用 DNS 区域、区域链接、本地解析转发和防火墙规则。它不是“自动安全”，还需要身份、RBAC、服务防火墙和日志共同生效。

## 取舍与安全实验

安全实验：画出应用访问存储账户的两条解析路径：未配置 Private Link 时解析到公共地址，配置后解析到私有地址。写下验证命令的期望输出，但不要执行真实资源。再列出风险：多个 VNet 是否都链接 DNS 区域，本地网络是否能解析，删除端点后是否留下错误记录。这个练习能避免把连通性问题误判为应用代码问题。

## 完成检查

- 能解释私有终结点与服务防火墙的配合。
- 能说明 DNS 是 Private Link 成败关键。
- 能设计跨 VNet 或本地访问的解析路径。
