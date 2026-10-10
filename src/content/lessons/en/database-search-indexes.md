---
title: "Azure AI Search: indexes, vectors, and citations"
summary: "Design full-text search, vector search, and RAG citations as a sidecar data plane to your database."
track: database
difficulty: 入门
tags: ["Azure AI Search", "RAG", "Index"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/foundry/", "https://learn.microsoft.com/en-us/azure/search/", "https://learn.microsoft.com/en-us/azure/azure-monitor/"]
reviewedAt: "2026-10-10"
locale: en
order: 3
cert: "扩展学习"
---

## Concept notes

Search indexes are not a replacement for the primary database. They organize documents, fields, filters, sort order, full-text analyzers, and vector embeddings into a structure that is fit for retrieval, and Retrieval-Augmented Generation (RAG) apps often use them as the data plane for “find evidence first, then generate an answer.” When you design one, decide on the source data, refresh frequency, filterable fields, vector dimension, permission trimming, and citation format. If the index contains sensitive data, the generation layer must inherit the same access boundary; otherwise retrieval can send fragments the user should not see into the model context.

## Tradeoffs and safety exercise

Paper/local safety exercise: design index fields for an internal FAQ: `title`, `body`, `department`, `updatedAt`, `sourceUrl`, `allowedGroups`, and `embedding`. Then write three queries: keyword, department filter, and vector similarity. Finally, write one answer template: every conclusion must include a `sourceUrl` and fragment number; if there is no evidence, answer “I do not know.” This exercise helps keep RAG from turning into a chatbot with no provenance.

## Completion checklist

- Can distinguish the responsibility of the primary database from the retrieval index.
- Can explain why permission trimming matters to RAG.
- Can design a search result structure that includes citations.
