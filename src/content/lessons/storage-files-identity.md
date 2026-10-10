---
slug: files-identity
title: "Azure Files：共享文件与身份边界"
summary: "理解 SMB/NFS 文件共享、混合访问、权限模型和迁移场景。"
track: storage
difficulty: 入门
tags: ["Azure Files", "Identity", "Hybrid", "AZ-104"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/storage/files/", "https://learn.microsoft.com/zh-cn/entra/identity/"]
reviewedAt: "2026-10-10"
order: 2
cert: "AZ-104"
---

## 概念笔记

Azure Files 提供托管文件共享，常用于传统应用迁移、用户共享目录、容器挂载或混合办公。它与 Blob 的区别在于文件协议和目录语义：SMB/NFS 客户端期待路径、锁和共享权限。设计时要同时处理网络、身份和性能层级：是否通过 VPN/ExpressRoute 私有访问，是否需要域身份，配额和吞吐是否匹配，快照如何恢复。把文件共享当成“无限硬盘”会掩盖权限继承、勒索恢复和延迟问题。

## 取舍与安全实验

安全实验：选择一个旧文件服务器迁移场景，写出五个问题：哪些应用依赖 SMB，哪些用户组有权限，哪些目录含敏感数据，停机窗口多长，回滚路径是什么。然后画出访问路径：办公室客户端、私有网络、存储账户、防火墙、身份源、审计日志。若答案不清楚，先不要迁移；文件系统迁移失败通常不是复制命令问题，而是权限和使用习惯没有盘点。

## 完成检查

- 能说明 Azure Files 与 Blob 的典型差异。
- 能把身份、网络和快照纳入设计。
- 能识别文件服务器迁移前的盘点问题。
