---
slug: mlops-monitoring
title: "MLOps 监控：从模型文件到可维护系统"
summary: "认识模型注册、部署、数据漂移、性能回看和人工复核。"
track: ml
difficulty: 进阶
tags: ["MLOps", "Drift", "Azure ML"]
sourceUrls: ["https://learn.microsoft.com/zh-cn/azure/machine-learning/", "https://learn.microsoft.com/zh-cn/azure/azure-monitor/"]
reviewedAt: "2026-10-10"
order: 3
cert: "扩展学习"
---

## 概念笔记

模型上线后，真正的维护才开始。机器学习运维（Machine Learning Operations，MLOps）把数据版本、训练代码、模型注册、环境、部署、监控和回滚串起来。你需要观察输入分布是否变化、标签回收是否延迟、线上指标是否偏离离线评估、人工复核是否发现系统性错误。Azure Machine Learning 可作为训练和部署平台补充学习，但 AZ-104、AZ-305、AZ-700 并不等同于完整 ML 考纲。不要把一次 notebook 成功当成生产能力。

## 取舍与安全实验

纸面/本地安全实验：为一个分类模型写上线清单：训练数据版本、评估报告、审批人、部署环境、输入日志字段、漂移指标、回滚模型、用户申诉渠道。再写三种触发人工复核的情况：低置信且缺少证据、高影响决策、分布超出训练范围；不要把置信度当成唯一安全门。这个练习强调治理和可恢复性，避免只关注训练脚本。

## 完成检查

- 能解释模型注册和可复现实验的意义。
- 能说明漂移监控与业务反馈的区别。
- 能把人工复核、回滚和审计纳入 ML 系统。
