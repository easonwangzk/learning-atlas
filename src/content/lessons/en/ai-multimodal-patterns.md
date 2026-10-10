---
title: "Multimodal apps: text, images, audio, and async workflows"
summary: "Understand input governance, asynchronous state, and cost controls for vision, speech, image generation, and video tasks."
track: ai
difficulty: 入门
tags: ["Multimodal", "STT", "TTS", "Async"]
sourceUrls: ["https://learn.microsoft.com/en-us/azure/foundry/", "https://developers.openai.com/api/docs", "https://huggingface.co/learn"]
reviewedAt: "2026-10-10"
locale: en
order: 3
cert: "扩展学习"
---

## Concept notes

Multimodal is not about stuffing images, audio, and text into a single interface at random. Every input type has governance concerns: images may contain faces, locations, or copyrighted material; Speech to Text (STT) and Text to Speech (TTS) can expose identity clues or create misleading audio; and generated images or video are usually asynchronous tasks that need status polling, failure handling, and cost notices. A learning repository can show API call shapes, but a production system must still handle consent, retention, auditing, content safety, and model availability changes. A static site should not embed secrets or pretend to offer live generation.

## Tradeoffs and safety exercise

Paper/local safety exercise: write a process card for “upload a product image and generate a description.” Include the pre-upload notice, file-size limit, malware scanning, vision analysis, human review, result retention, and delete request handling. Then write a state machine for an async video task: `queued`, `running`, `succeeded`, `failed`, `expired`. This exercise helps you treat multimodal systems as product workflows instead of one magical call.

## Completion checklist

- Can list the privacy and copyright risks of multimodal inputs.
- Can explain why async task state must be shown explicitly.
- Can state that this site does not run model calls or generation demos.
