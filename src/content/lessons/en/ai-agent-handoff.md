---
title: "Agent handoff: tools, memory, and boundaries"
summary: "Use a support case to understand function tools, user preferences, session state, and why handoff is not the same as a real live transfer."
track: ai
difficulty: 入门
tags: ["Agent", "Handoff", "Identity"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/foundry/", "https://learn.microsoft.com/en-us/entra/identity/", "https://learn.microsoft.com/en-us/azure/container-apps/"]
reviewedAt: "2026-10-10"
locale: en
order: 2
cert: "扩展学习"
---

## Concept notes

Agent applications orchestrate the model, tools, state, and policy together. Tools may query orders, create tickets, or retrieve knowledge base content; state may store sessions and user preferences; policy decides when to refuse, escalate, or ask for confirmation. When learning this pattern, be explicit that a demo handoff is often just ticket creation or a state change, not a real customer-service agent joining the conversation. User preferences must also be isolated by identity so one person's communication style does not affect another person's experience. The more an app behaves like automation, the more it needs auditability and rollback.

## Tradeoffs and safety exercise

Paper/local safety exercise: design a function tool contract for querying order status. The input should allow only `orderId`, the tool should check whether the current user owns that order before calling, and the output should return only the required fields and references. Then define handoff conditions: identity mismatch, a complaint request from the user, missing evidence or low self-reported model confidence, and policy risk; do not treat a confidence score as the only safety gate. Finally, write the log fields: `requestId`, `userId`, `toolName`, `decision`, `handoffTicketId`. Do not log full sensitive content.

## Completion checklist

- Can distinguish model replies, tool calls, and business-system actions.
- Can explain why user preferences must be isolated per user.
- Can describe handoff as state or a ticket, not as a fictional person going live.
