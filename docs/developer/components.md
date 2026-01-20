## Core Components (Developer Notes)

Prompt Engine

- Input: raw user prompt + metadata.
- Output: `PromptPayload` JSON.

Script Generator

- Uses GPT (mocked) to produce `ScriptSegment[]` with timestamps.

Voiceover Engine

- Produces segmented WAV/MP3 files per script segment.

Visual Composer

- Produces a `Storyboard` mapping timestamps to assets.

Video Renderer

- Accepts audio + storyboard, renders MP4 (FFmpeg/Remotion integration planned).

Automation Orchestrator

- Implements job lifecycle: created -> processing -> rendered -> uploaded -> completed/failed.
