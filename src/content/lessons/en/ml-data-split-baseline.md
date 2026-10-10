---
title: "Data splits and baselines: machine learning starts with problem definition"
summary: "Separate train, validation, test, leakage, and simple baselines so you do not over-interpret experiments."
track: ml
difficulty: 入门
tags: ["Data Split", "Baseline", "ML"]
sourceUrls: ["https://scikit-learn.org/stable/user_guide.html", "https://learn.microsoft.com/en-us/azure/machine-learning/"]
reviewedAt: "2026-10-10"
locale: en
order: 1
cert: "扩展学习"
---

## Concept notes

Machine learning (ML) starts with problem definition, not with the model. You need to specify the target variable, input features, prediction time, error cost, and available data. The training set is for fitting, the validation set is for choosing between options, and the test set is for the final estimate; if the same user, the same time window, or future information leaks into training, the score will look too good. A baseline can be simple: mean, mode, a rule, or a linear model. A complex model with no baseline is hard to prove valuable. AI applications can use model services, while ML courses focus more on data and evaluation.

## Tradeoffs and safety exercise

Safety exercise: for “predict course completion risk,” work only on the table design. List the features that are known at prediction time and cross out the grades and feedback that are only known later. Design both random splitting and time-based splitting, then compare which one is closer to real use. Finally, write a baseline: always predict the majority class, or score using the historic completion rate. A complex model must beat that baseline before it deserves more work.

## Completion checklist

- Can explain the purpose of train, validation, and test sets.
- Can identify time leakage and target leakage.
- Can set a simple baseline for any ML problem.
