---
title: "Container Apps: revisions, scaling, and a smaller platform surface"
summary: "Understand image delivery, revisions, ingress, KEDA scaling, and logging boundaries for managed container apps."
track: compute
difficulty: 入门
tags: ["Container Apps", "KEDA", "AZ-305"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/container-apps/", "https://learn.microsoft.com/en-us/azure/well-architected/"]
reviewedAt: "2026-10-10"
locale: en
order: 2
cert: "AZ-305"
---

## Concept notes

Container Apps sit in the space where you want to ship containers but do not want to manage the Kubernetes control plane. The core objects are not a single server; they are the environment, application, revision, ingress, secrets, identity, and scaling rules. Revisions make deployment, rollback, and traffic splitting clearer; KEDA (Kubernetes-based Event Driven Autoscaling) handles HTTP, queue, or event-based scaling; managed identity lets a container access storage and databases without hard-coded secrets. When designing the architecture, ask where the image comes from, who can deploy, where logs go, whether cold starts are acceptable, and whether internal services need a private ingress.

## Tradeoffs and safety exercise

Paper/local safety exercise: draw three lines for a README-level API: the developer pushes an image, the platform pulls and runs it, and the app accesses the database. Label the minimum permissions and audit source on each line. Then compare Container Apps, App Service, and Functions: container flexibility, platform abstraction, scaling granularity, and operational complexity are all different. Do not write a demo container as if it already has a production SLA; production still needs image scanning, environment separation, alerts, budgets, and deployment approval.

## Completion checklist

- Can explain the purpose of revisions and traffic splitting.
- Can explain the value of replacing static secrets with managed identity.
- Can judge when a container platform is a better fit than a VM.
