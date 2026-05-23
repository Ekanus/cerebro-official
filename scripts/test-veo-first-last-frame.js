'use strict';

/**
 * scripts/test-veo-first-last-frame.js
 *
 * One-shot test of Veo 3.1 first/last frame interpolation using @google/genai SDK.
 * Generates a single 8-second video transitioning between two input frames.
 *
 * Usage (PowerShell):
 *   $env:GOOGLE_GENERATIVE_AI_API_KEY = "your_key_here"
 *   node scripts/test-veo-first-last-frame.js
 *
 * Does NOT run automatically — must be invoked manually.
 * Does NOT touch any website UI files.
 */

const { GoogleGenAI } = require('@google/genai');
const fs   = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────────────────

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const MODEL   = 'veo-3.1-generate-preview';

const ROOT = path.resolve(__dirname, '..');

const FIRST_FRAME_REL = 'assets/reel/frame-01-chaos.png';
const LAST_FRAME_REL  = 'assets/reel/frame-04-cerebro-core.png';
const OUTPUT_REL      = 'assets/reel/output/test-first-last-frame.mp4';

const FIRST_FRAME_ABS = path.join(ROOT, FIRST_FRAME_REL);
const LAST_FRAME_ABS  = path.join(ROOT, LAST_FRAME_REL);
const OUTPUT_ABS      = path.join(ROOT, OUTPUT_REL);

const DURATION_SECONDS = 8;
const POLL_INTERVAL_MS = 15000; // 15 s between polls
const MAX_POLLS        = 90;    // 22.5 min hard timeout

const PROMPT =
  'A premium monochrome cinematic transformation from business workflow chaos into a calm ' +
  'intelligent Cerebro system core. Keep the original black and white editorial technology ' +
  'aesthetic. Slow camera push-in, subtle parallax, elegant controlled motion, no people, ' +
  'no robots, no neon colors, no readable text, no logos, no glitch effects.';

// ── Guards ────────────────────────────────────────────────────────────────────

console.log('\n  Cerebro — Veo 3.1 First/Last Frame Interpolation Test');
console.log('  ─────────────────────────────────────────────────────');
console.log('  SDK         : @google/genai');
console.log('  Model       : ' + MODEL);
console.log('  First frame : ' + FIRST_FRAME_REL);
console.log('  Last frame  : ' + LAST_FRAME_REL);
console.log('  Output      : ' + OUTPUT_REL);
console.log('');

if (!API_KEY) {
  console.error('  ERROR: GOOGLE_GENERATIVE_AI_API_KEY is not set.\n');
  console.error('  PowerShell: $env:GOOGLE_GENERATIVE_AI_API_KEY = "your_key_here"');
  console.error('  bash:       export GOOGLE_GENERATIVE_AI_API_KEY="your_key_here"\n');
  process.exit(1);
}

if (!fs.existsSync(FIRST_FRAME_ABS)) {
  console.error('  ERROR: First frame not found: ' + FIRST_FRAME_REL + '\n');
  process.exit(1);
}

if (!fs.existsSync(LAST_FRAME_ABS)) {
  console.error('  ERROR: Last frame not found: ' + LAST_FRAME_REL + '\n');
  process.exit(1);
}

console.log('  Input frames verified.');

var outputDir = path.dirname(OUTPUT_ABS);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(function (r) { setTimeout(r, ms); });
}

function handleSdkError(err, context) {
  if (err && err.status === 429) {
    console.error('\n  HTTP 429 — Quota exceeded (' + context + ').');
    console.error('  Veo quota unavailable for this project/account. Billing or quota increase is required.');
    process.exit(1);
  }
  console.error('\n  ERROR during ' + context + ': ' + err.message);
  if (err.status) console.error('  HTTP status: ' + err.status);
  process.exit(1);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  var ai = new GoogleGenAI({ apiKey: API_KEY });

  var firstB64 = fs.readFileSync(FIRST_FRAME_ABS).toString('base64');
  var lastB64  = fs.readFileSync(LAST_FRAME_ABS).toString('base64');

  // SDK payload for first/last frame interpolation:
  //   image              → GenerateVideosParameters.image      (first frame)
  //   config.lastFrame   → GenerateVideosConfig.lastFrame      (last frame)
  var operation;
  try {
    console.log('  Submitting interpolation request to Veo...');
    operation = await ai.models.generateVideos({
      model:  MODEL,
      prompt: PROMPT,
      image: {
        imageBytes: firstB64,
        mimeType:   'image/png',
      },
      config: {
        lastFrame: {
          imageBytes: lastB64,
          mimeType:   'image/png',
        },
        aspectRatio:     '16:9',
        durationSeconds: DURATION_SECONDS,
        numberOfVideos:  1,
      },
    });
  } catch (err) {
    handleSdkError(err, 'submit');
  }

  console.log('  Operation started: ' + (operation.name || '(no name)'));
  console.log('  Polling every ' + (POLL_INTERVAL_MS / 1000) + ' s (max ' + MAX_POLLS + ' polls)...');
  console.log('');

  var polls = 0;

  while (!operation.done && polls < MAX_POLLS) {
    await sleep(POLL_INTERVAL_MS);
    polls++;

    var elapsed = Math.round(polls * POLL_INTERVAL_MS / 1000);
    process.stdout.write('  Polling (' + elapsed + 's elapsed)...\r');

    try {
      operation = await ai.operations.getVideosOperation({ operation: operation });
    } catch (err) {
      handleSdkError(err, 'poll');
    }
  }

  process.stdout.write('\n');

  if (!operation.done) {
    console.error('  ERROR: Timed out after ' + MAX_POLLS + ' polls (' + Math.round(MAX_POLLS * POLL_INTERVAL_MS / 60000) + ' min).');
    process.exit(1);
  }

  if (operation.error) {
    console.error('  ERROR: Operation completed with error:');
    console.error('  ' + JSON.stringify(operation.error));
    process.exit(1);
  }

  console.log('  Operation complete. Extracting video...');

  var genVideo = operation.response && operation.response.generatedVideos && operation.response.generatedVideos[0];

  if (!genVideo) {
    console.error('  ERROR: No generated video in response.');
    console.error('  Response: ' + JSON.stringify(operation.response).slice(0, 500));
    process.exit(1);
  }

  if (genVideo.video && genVideo.video.videoBytes) {
    // Inline base64 response
    fs.writeFileSync(OUTPUT_ABS, Buffer.from(genVideo.video.videoBytes, 'base64'));
  } else {
    // URI-based response — use SDK downloader (accepts GeneratedVideo directly)
    console.log('  Downloading from URI via SDK...');
    try {
      await ai.files.downloadFile({ file: genVideo, downloadPath: OUTPUT_ABS });
    } catch (err) {
      handleSdkError(err, 'download');
    }
  }

  var stats = fs.statSync(OUTPUT_ABS);
  var kb    = Math.round(stats.size / 1024);
  console.log('  Saved (' + kb + ' KB) → ' + OUTPUT_REL);
  console.log('');
  console.log('  Test complete. First/last frame interpolation succeeded.');
  console.log('');
}

run().catch(function (err) {
  console.error('\n  Unexpected error: ' + err.message);
  process.exit(1);
});
