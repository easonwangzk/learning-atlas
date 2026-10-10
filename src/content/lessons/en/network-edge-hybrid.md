---
title: "Edge and hybrid networking: Front Door, ExpressRoute, and failure domains"
summary: "Use global ingress, private circuits, and multi-region design to understand performance, reliability, and cost tradeoffs."
track: network
difficulty: 进阶
tags: ["Front Door", "ExpressRoute", "Hybrid", "AZ-700"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/frontdoor/", "https://learn.microsoft.com/en-us/azure/expressroute/"]
reviewedAt: "2026-10-10"
locale: en
order: 3
cert: "AZ-700"
---

## Concept notes

Edge ingress and hybrid connectivity solve different problems. Azure Front Door is for global HTTP/HTTPS ingress, acceleration, WAF, and origin failover; ExpressRoute is for dedicated connectivity between on-premises and Azure with more predictable network paths. In a multi-region architecture, the failure domains for the ingress layer, application layer, and data layer are different, and so are the failover speeds. When you design it, ask where the users are, how origin health is detected, who manages certificates, whether an on-prem dependency becomes a single point of failure, and whether the private circuit cost matches the business value.

## Tradeoffs and safety exercise

Safety exercise: write two architecture versions for a public web app: single-region App Service with Front Door, and active/passive multi-region with database replication. Compare complexity, recovery time, data consistency, and monthly cost. Then write a hybrid-access question: if the backend must call an on-premises system, how should the user experience degrade when ExpressRoute is disconnected? This helps you avoid treating a global entry point as a simple performance button.

## Completion checklist

- Can distinguish the purpose of Front Door and ExpressRoute.
- Can explain health probes and origin failover.
- Can include hybrid dependencies in continuity design.
