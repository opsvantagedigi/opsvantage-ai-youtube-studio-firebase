## Architecture Overview

This document explains the high level architecture and responsibilities of each service layer.

Layers

- Prompt Engine: normalize intent into deterministic JSON payloads.
- Script Generator: produce timestamped, segmented scripts for narration and visuals.
- Voiceover Engine: generate TTS segments (mocked in MVP).
- Visual Composer: map script segments to visual assets (mocked for MVP).
- Video Renderer: assemble audio + visuals into MP4 (mocked - placeholder renders).
- Uploader: publish to YouTube using OAuth2 (out of scope for MVP).
- Analytics Tracker: ingest YouTube metrics and suggest follow-ups.

Automation Orchestrator coordinates job state, retries, parallelization, and audit logs.
