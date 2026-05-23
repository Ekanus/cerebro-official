# Google Generative AI — Cerebro Media Workflow

## Overview

This document describes the workflow for generating the Cerebro hero video reel
using Google's generative AI media APIs (Veo image-to-video, Imagen refinement).

API access confirmed working. Veo and Imagen models available under the project key.

---

## Model Selection

| Stage | Model | Notes |
|---|---|---|
| Image-to-video (test) | `veo-3.1-fast-generate-preview` | Default — faster, lower cost |
| Image-to-video (final) | `veo-3.1-generate-preview` | Full quality, set `$env:VEO_MODEL` |
| Image generation | `imagen-3.0-generate-002` | Future refinement step |

Override the model at runtime without editing code:
```powershell
$env:VEO_MODEL = "veo-3.1-generate-preview"
node scripts/generate-veo-clips.js
```

---

## Environment Variable

**Never hardcode the key.** Read it from the environment only.

```
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

**PowerShell (session only):**
```powershell
$env:GOOGLE_GENERATIVE_AI_API_KEY = "your_key_here"
```

**Bash (session only):**
```bash
export GOOGLE_GENERATIVE_AI_API_KEY="your_key_here"
```

Or add to `.env.local` (already git-ignored):
```
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

---

## Pipeline Stages

### 1. Input Frames — assets/reel/

Four PNG frames must exist before running generation:

| File | Scene |
|---|---|
| `assets/reel/frame-01-chaos.png` | Business workflow chaos / manual overload |
| `assets/reel/frame-02-detection.png` | AI pattern detection begins |
| `assets/reel/frame-03-automation.png` | Connected intelligent automation |
| `assets/reel/frame-04-cerebro-core.png` | Cerebro neural core — calm, in control |

---

### 2. Clip Generation — scripts/generate-veo-clips.js

Generates one cinematic MP4 clip per frame using the Veo image-to-video API.

**How to run — single clip test (recommended first):**
```powershell
$env:GOOGLE_GENERATIVE_AI_API_KEY = "your_key_here"
$env:FRAME_ONLY = "4"
node scripts/generate-veo-clips.js
```
`FRAME_ONLY` accepts `1`–`4`. Maps directly to the clip order above.
Generates and saves only that one clip. All other clips are skipped.
Use this to verify API connectivity, model output, and style before committing to a full run.

**How to run — all 4 clips:**
```powershell
$env:GOOGLE_GENERATIVE_AI_API_KEY = "your_key_here"
# Remove FRAME_ONLY if previously set: Remove-Item Env:FRAME_ONLY
node scripts/generate-veo-clips.js
```

**Behaviour:**
- Validates all 4 input frames before starting
- Submits each frame to the Veo LRO (Long Running Operation) endpoint
- Polls every 12 seconds until each clip is ready (up to 18 min per clip)
- Handles both inline base64 and URI-based video responses
- Skips clips that already exist (safe to re-run after partial failure)

**Outputs:**
```
assets/reel/output/clip-01-chaos.mp4
assets/reel/output/clip-02-detection.mp4
assets/reel/output/clip-03-automation.mp4
assets/reel/output/clip-04-cerebro-core.mp4
```

**Clip directions:**

| Clip | Feeling | Motion |
|---|---|---|
| 01 — chaos | Disconnected, overloaded workflow | Slow push-in, business elements drifting apart |
| 02 — detection | System begins organizing patterns | Smooth push-in, luminous lines connecting |
| 03 — automation | Intelligent connected workflows | Subtle node pulses, clean geometric flow |
| 04 — cerebro-core | Clarity, calm intelligence | Very slow push-in, breathing pulse from center |

**Style guard (applied to all clips):**
- Monochrome, premium, clean, cinematic
- No people, robots, neon colors, readable text, logos, or glitch effects

---

### 3. Reel Merge — scripts/merge-reel.js

Concatenates the 4 clips into one final MP4 using ffmpeg.

**How to run:**
```powershell
node scripts/merge-reel.js
```

**Requires ffmpeg.** If ffmpeg is missing, the script reports clearly and prints
the exact manual command to run.

**Install ffmpeg (if missing):**
```powershell
winget install Gyan.FFmpeg   # Windows — restart terminal after
```

**Output:**
```
assets/video/cerebro-system-reel.mp4
```

---

### 4. Poster Frame

```
assets/video/cerebro-system-poster.png
```

Source: copy of `assets/reel/frame-04-cerebro-core.png`.
Used as the HTML `<video poster="...">` attribute.

---

## Cost & Limitations

- Veo video generation is **billed per second of video** generated.
  At 6 seconds × 4 clips = 24 seconds of video per full run.
- `veo-3.1-fast-generate-preview` is cheaper and faster for testing.
  Use `veo-3.1-generate-preview` for final production output.
- Each clip takes approximately 1–3 minutes to generate.
  Total generation time: ~5–12 minutes for all 4 clips.
- If a clip fails partway through, re-running skips already-saved clips.
- Veo preview models may have daily quota limits. Check Google AI Studio for usage.
- Do not run generation in CI or automated pipelines — it is a manual, billed step.

---

## Full File Map

```
assets/
  reel/
    frame-01-chaos.png              ← input frame
    frame-02-detection.png          ← input frame
    frame-03-automation.png         ← input frame
    frame-04-cerebro-core.png       ← input frame
    output/
      clip-01-chaos.mp4             ← generated by generate-veo-clips.js
      clip-02-detection.mp4
      clip-03-automation.mp4
      clip-04-cerebro-core.mp4
  video/
    cerebro-system-poster.png       ← copy of frame-04 (manual step)
    cerebro-system-reel.mp4         ← final reel, output of merge-reel.js

scripts/
  test-google-media-api.js          ← safe connectivity check (no generation)
  generate-veo-clips.js             ← Veo image-to-video generation
  merge-reel.js                     ← ffmpeg concat merge

_docs/
  google-generative-ai-media-workflow.md   ← this file
```

---

## First/Last Frame Interpolation Test

Tests Veo 3.1's ability to generate a single video that smoothly transitions
between a first frame and a last frame (interpolation between two keyframes).

Uses the official **`@google/genai` JavaScript SDK** (not raw REST).

- **Script:** `scripts/test-veo-first-last-frame.js`
- **SDK:** `@google/genai`
- **Model:** `veo-3.1-generate-preview`
- **First frame:** `assets/reel/frame-01-chaos.png`
- **Last frame:** `assets/reel/frame-04-cerebro-core.png`
- **Output:** `assets/reel/output/test-first-last-frame.mp4`
- **Duration:** 8 seconds
- **Aspect ratio:** 16:9

SDK payload structure:
```js
ai.models.generateVideos({
  model:  'veo-3.1-generate-preview',
  prompt: '...',
  image:  { imageBytes: FIRST_BASE64, mimeType: 'image/png' },   // first frame
  config: {
    lastFrame:       { imageBytes: LAST_BASE64, mimeType: 'image/png' }, // last frame
    aspectRatio:     '16:9',
    durationSeconds: 8,
    numberOfVideos:  1,
  },
})
```

Operation is polled via `ai.operations.getVideosOperation({ operation })` until `operation.done`.
If HTTP 429 is returned, the script prints a clear quota message and exits.

**How to run:**
```powershell
$env:GOOGLE_GENERATIVE_AI_API_KEY = "your_key_here"
node scripts/test-veo-first-last-frame.js
```

---

## Quick Reference

```powershell
# 1. Set key (once per terminal session)
$env:GOOGLE_GENERATIVE_AI_API_KEY = "your_key_here"

# 2. Test API access (no generation, no cost)
node scripts/test-google-media-api.js

# 3a. Generate one clip for testing (billed — use frame 4 as first test)
$env:FRAME_ONLY = "4"
node scripts/generate-veo-clips.js

# 3b. Generate all 4 clips (billed — only after single-clip test passes)
Remove-Item Env:FRAME_ONLY
node scripts/generate-veo-clips.js

# 4. Merge into final reel (requires ffmpeg)
node scripts/merge-reel.js
```
