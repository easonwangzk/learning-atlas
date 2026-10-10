---
title: "MLOps monitoring: from a model file to a maintainable system"
summary: "Understand model registration, deployment, drift, post-deployment review, and human review."
track: ml
difficulty: 进阶
tags: ["MLOps", "Drift", "Azure ML"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/machine-learning/", "https://learn.microsoft.com/en-us/azure/azure-monitor/"]
reviewedAt: "2026-10-10"
locale: en
order: 3
cert: "扩展学习"
---

## Concept notes

Once a model goes live, the real maintenance work begins. MLOps connects data versions, training code, model registration, environment, deployment, monitoring, and rollback. You need to watch whether the input distribution changes, whether label collection is delayed, whether online metrics drift away from the offline evaluation, and whether human review finds systematic errors. Azure Machine Learning can supplement training and deployment learning, but AZ-104, AZ-305, and AZ-700 are not the same as a complete ML curriculum. Do not treat one notebook success as production capability.

## Tradeoffs and safety exercise

Safety exercise: write a launch checklist for a classification model: training-data version, evaluation report, approver, deployment environment, input log fields, drift metrics, rollback model, and user appeal channel. Then write three situations that should trigger human review: low confidence, a high-impact decision, and data that falls outside the training distribution. This exercise emphasizes governance and recoverability so you do not focus only on the training script.

## Completion checklist

- Can explain why model registration and reproducibility matter.
- Can explain the difference between drift monitoring and business feedback.
- Can include human review, rollback, and audit in an ML system.
