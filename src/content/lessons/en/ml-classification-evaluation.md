---
title: "Classification evaluation: tradeoffs beyond accuracy"
summary: "Understand confusion matrices, precision, recall, thresholds, and business cost."
track: ml
difficulty: 入门
tags: ["Classification", "Evaluation", "Metrics"]
sourceUrls: ["https://scikit-learn.org/stable/user_guide.html", "https://pytorch.org/tutorials/"]
reviewedAt: "2026-10-10"
locale: en
order: 2
cert: "扩展学习"
---

## Concept notes

A classification model does not return business truth; it returns a score or label with uncertainty. Accuracy can be misleading when classes are imbalanced: if 95% of samples are normal, a model that always predicts normal still gets a high accuracy score. A confusion matrix separates true positives, false positives, true negatives, and false negatives; precision measures how reliable positive predictions are, and recall measures how much of the actual positive class you recover. The threshold is not a math detail; it is a business decision. Fraud, medical, recommendation, and alerting systems all have different error costs.

## Tradeoffs and safety exercise

Safety exercise: construct 100 paper samples, with 10 positives. Suppose the model finds 8 positives and raises 12 false alarms. Manually compute precision, recall, and F1 score, then write the business explanation: if this is a security alert, false alarms consume human time; if this is a severe-risk screen, misses are more dangerous. Then raise the threshold and imagine false alarms falling while misses rise. Explaining the metric changes in plain language is more important than memorizing the formulas.

## Completion checklist

- Can derive common metrics from a confusion matrix.
- Can explain the limits of accuracy under class imbalance.
- Can connect threshold selection to business cost.
