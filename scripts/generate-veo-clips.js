/**
 * scripts/generate-veo-clips.js
 *
 * Generates one cinematic video clip per Cerebro reel frame using Google Veo.
 * Uses a Long Running Operation (LRO) pattern — polls until each clip is ready.
 *
 * Prerequisites:
 *   - GOOGLE_GENERATIVE_AI_API_KEY set in environment
 *   - 4 input frames present in assets/reel/
 *   - assets/reel/output/ folder exists (created by this script if missing)
 *
 * Usage — all 4 clips:
 *   node scripts/generate-veo-clips.js
 *
 * Usage — single clip test (1–4):
 *   $env:FRAME_ONLY = "4"
 *   node scripts/generate-veo-clips.js
 *
 * Override model (optional):
 *   $env:VEO_MODEL = "veo-3.1-lite-generate-preview"
 *   node scripts/generate-veo-clips.js
 *
 * Set key (PowerShell, session only):
 *   $env:GOOGLE_GENERATIVE_AI_API_KEY = "your_key_here"
 */

'use strict';

const https  = require('https');
const fs     = require('fs');
const path   = require('path');

// ── Config ────────────────────────────────────────────────────────────────────

const API_KEY    = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
// Fast/low-cost variant preferred for first test run.
// Switch to veo-3.1-generate-preview for full-quality production output.
const MODEL      = process.env.VEO_MODEL || 'veo-3.1-fast-generate-preview';
const BASE_URL   = 'generativelanguage.googleapis.com';

// Set FRAME_ONLY=1..4 to generate a single clip for testing.
// Omit to generate all 4 clips.
const FRAME_ONLY_RAW = process.env.FRAME_ONLY ? parseInt(process.env.FRAME_ONLY, 10) : null;

const DURATION_SECONDS = 6;     // target clip length — API may cap this
const POLL_INTERVAL_MS = 12000; // 12 s between polls (Veo takes 1–3 min per clip)
const MAX_POLLS        = 90;    // 18 min hard timeout per clip

const ROOT = path.resolve(__dirname, '..');

// ── Clip definitions ──────────────────────────────────────────────────────────

const CLIPS = [
  {
    id:     'clip-01',
    frame:  'assets/reel/frame-01-chaos.png',
    output: 'assets/reel/output/clip-01-chaos.mp4',
    prompt: [
      'Monochrome cinematic shot. Slow push-in camera movement over a premium business',
      'workflow visualization. Disconnected documents, tasks and icons drift apart',
      'subtly, suggesting overload and manual chaos. Soft dark background.',
      'Controlled, elegant motion. No people, no readable text, no logos,',
      'no neon colors, no glitch effects. Premium, clean, cinematic.',
    ].join(' '),
  },
  {
    id:     'clip-02',
    frame:  'assets/reel/frame-02-detection.png',
    output: 'assets/reel/output/clip-02-detection.mp4',
    prompt: [
      'Monochrome cinematic shot. Smooth push-in through a structured data',
      'visualization. Subtle luminous lines extend and connect softly from left',
      'to right, conveying intelligent pattern detection. Elegant, minimal motion.',
      'No people, no readable text, no logos, no neon, no glitch.',
      'Premium, clean, cinematic.',
    ].join(' '),
  },
  {
    id:     'clip-03',
    frame:  'assets/reel/frame-03-automation.png',
    output: 'assets/reel/output/clip-03-automation.mp4',
    prompt: [
      'Monochrome cinematic shot. Gentle pulses and smooth data flow through an',
      'interconnected node network. Clean geometric paths light up in sequence,',
      'suggesting structured intelligent automation. Soft, controlled motion.',
      'No people, no readable text, no logos, no neon, no glitch.',
      'Premium, clean, cinematic.',
    ].join(' '),
  },
  {
    id:     'clip-04',
    frame:  'assets/reel/frame-04-cerebro-core.png',
    output: 'assets/reel/output/clip-04-cerebro-core.mp4',
    prompt: [
      'Monochrome cinematic shot. Very slow push-in toward a neural network core.',
      'A subtle breathing pulse radiates gently outward from the center,',
      'suggesting calm intelligence and clarity. Minimal, elegant motion.',
      'No people, no readable text, no logos, no neon, no glitch.',
      'Premium, clean, cinematic ending shot.',
    ].join(' '),
  },
];

// ── Guards ────────────────────────────────────────────────────────────────────

if (!API_KEY) {
  console.error('\n  ERROR: GOOGLE_GENERATIVE_AI_API_KEY is not set.\n');
  console.error('  PowerShell: $env:GOOGLE_GENERATIVE_AI_API_KEY = "your_key_here"');
  console.error('  bash:       export GOOGLE_GENERATIVE_AI_API_KEY="your_key_here"\n');
  process.exit(1);
}

if (FRAME_ONLY_RAW !== null && (isNaN(FRAME_ONLY_RAW) || FRAME_ONLY_RAW < 1 || FRAME_ONLY_RAW > CLIPS.length)) {
  console.error('\n  ERROR: FRAME_ONLY must be a number between 1 and ' + CLIPS.length + '.\n');
  console.error('  Example: $env:FRAME_ONLY = "4"\n');
  process.exit(1);
}

// Build the queue — single clip or all clips
var queue = FRAME_ONLY_RAW !== null ? [CLIPS[FRAME_ONLY_RAW - 1]] : CLIPS;
var mode  = FRAME_ONLY_RAW !== null ? 'single-clip test (frame ' + FRAME_ONLY_RAW + ')' : 'all clips';

console.log('\n  Cerebro — Veo clip generation');
console.log('  Model : ' + MODEL);
console.log('  Mode  : ' + mode);
console.log('  Queue : ' + queue.length + ' clip(s)');
console.log('');

// Validate only the queued frames before starting any generation
var missing = queue.filter(c => !fs.existsSync(path.join(ROOT, c.frame)));
if (missing.length > 0) {
  console.error('  ERROR: Missing input frame(s):');
  missing.forEach(c => console.error('    ' + c.frame));
  console.error('\n  Copy the PNG frame(s) into assets/reel/ before running this script.\n');
  process.exit(1);
}

// Ensure output folder exists
var outputDir = path.join(ROOT, 'assets', 'reel', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function post(pathname, body) {
  return new Promise(function (resolve, reject) {
    var payload = JSON.stringify(body);
    var options = {
      hostname: BASE_URL,
      path:     pathname + '?key=' + API_KEY,
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    var req = https.request(options, function (res) {
      var data = '';
      res.on('data', function (chunk) { data += chunk; });
      res.on('end', function () {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, function () { req.destroy(new Error('POST timed out')); });
    req.write(payload);
    req.end();
  });
}

function poll(pathname) {
  return new Promise(function (resolve, reject) {
    var options = {
      hostname: BASE_URL,
      path:     pathname + '?key=' + API_KEY,
      method:   'GET',
    };
    var req = https.request(options, function (res) {
      var data = '';
      res.on('data', function (chunk) { data += chunk; });
      res.on('end', function () {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(20000, function () { req.destroy(new Error('Poll timed out')); });
    req.end();
  });
}

function downloadBinary(url) {
  return new Promise(function (resolve, reject) {
    var parsed = new URL(url);
    var options = {
      hostname: parsed.hostname,
      path:     parsed.pathname + parsed.search,
      method:   'GET',
    };
    var chunks = [];
    var req = https.request(options, function (res) {
      res.on('data', function (chunk) { chunks.push(chunk); });
      res.on('end', function () { resolve(Buffer.concat(chunks)); });
    });
    req.on('error', reject);
    req.setTimeout(120000, function () { req.destroy(new Error('Download timed out')); });
    req.end();
  });
}

function sleep(ms) {
  return new Promise(function (r) { setTimeout(r, ms); });
}

// ── Core generation ───────────────────────────────────────────────────────────

async function generateClip(clip, index, total) {
  var label  = '[' + (index + 1) + '/' + total + '] ' + clip.id;
  var outAbs = path.join(ROOT, clip.output);

  if (fs.existsSync(outAbs)) {
    console.log('  ' + label + ' — already exists, skipping.');
    return;
  }

  var frameAbs  = path.join(ROOT, clip.frame);
  var frameB64  = fs.readFileSync(frameAbs).toString('base64');
  var mimeType  = 'image/png';

  console.log('  ' + label + ' — submitting to Veo...');

  // Request body — image-to-video via predictLongRunning
  var requestBody = {
    instances: [{
      prompt: clip.prompt,
      image: {
        bytesBase64Encoded: frameB64,
        mimeType: mimeType,
      },
    }],
    parameters: {
      aspectRatio:     '16:9',
      durationSeconds: DURATION_SECONDS,
      sampleCount:     1,
    },
  };

  var submitPath = '/v1beta/models/' + MODEL + ':predictLongRunning';
  var submitRes  = await post(submitPath, requestBody);

  if (submitRes.status !== 200) {
    console.error('  ' + label + ' — submit FAILED (HTTP ' + submitRes.status + ')');
    if (submitRes.body && submitRes.body.error) {
      console.error('  ' + submitRes.body.error.message);
    } else {
      console.error('  ' + JSON.stringify(submitRes.body).slice(0, 300));
    }
    throw new Error('Submit failed for ' + clip.id);
  }

  var operationName = submitRes.body.name;
  if (!operationName) {
    console.error('  ' + label + ' — no operation name in response:');
    console.error('  ' + JSON.stringify(submitRes.body).slice(0, 400));
    throw new Error('No operation name for ' + clip.id);
  }

  console.log('  ' + label + ' — operation started, polling...');
  console.log('           ' + operationName);

  // ── Poll until done ───────────────────────────────────────────────────────
  var pollPath = '/v1beta/' + operationName;
  var polls    = 0;

  while (polls < MAX_POLLS) {
    await sleep(POLL_INTERVAL_MS);
    polls++;

    var elapsed = Math.round(polls * POLL_INTERVAL_MS / 1000);
    process.stdout.write('  ' + label + ' — polling (' + elapsed + 's elapsed)...\r');

    var pollRes = await poll(pollPath);

    if (pollRes.status !== 200) {
      console.error('\n  ' + label + ' — poll FAILED (HTTP ' + pollRes.status + ')');
      throw new Error('Poll failed for ' + clip.id);
    }

    var op = pollRes.body;

    if (op.error) {
      console.error('\n  ' + label + ' — API returned error:');
      console.error('  ' + JSON.stringify(op.error));
      throw new Error('API error for ' + clip.id);
    }

    if (!op.done) continue;

    // ── Extract video data ─────────────────────────────────────────────────
    process.stdout.write('\n');
    var videoBuffer = null;

    // Format A: inline base64
    var samples =
      (op.response && op.response.generateVideoResponse && op.response.generateVideoResponse.generatedSamples) ||
      (op.response && op.response.generatedSamples) ||
      null;

    if (samples && samples[0]) {
      var sample = samples[0];
      if (sample.video && sample.video.bytesBase64Encoded) {
        videoBuffer = Buffer.from(sample.video.bytesBase64Encoded, 'base64');
      } else if (sample.video && sample.video.uri) {
        console.log('  ' + label + ' — downloading from URI...');
        videoBuffer = await downloadBinary(sample.video.uri);
      }
    }

    // Format B: top-level videos array (older Veo 2 format)
    if (!videoBuffer && op.response && op.response.videos && op.response.videos[0]) {
      var v = op.response.videos[0];
      if (v.bytesBase64Encoded) {
        videoBuffer = Buffer.from(v.bytesBase64Encoded, 'base64');
      } else if (v.uri) {
        console.log('  ' + label + ' — downloading from URI...');
        videoBuffer = await downloadBinary(v.uri);
      }
    }

    if (!videoBuffer || videoBuffer.length === 0) {
      console.error('  ' + label + ' — done but no video data found in response:');
      console.error('  ' + JSON.stringify(op.response).slice(0, 500));
      throw new Error('No video data for ' + clip.id);
    }

    fs.writeFileSync(outAbs, videoBuffer);
    var kb = Math.round(videoBuffer.length / 1024);
    console.log('  ' + label + ' — saved (' + kb + ' KB) → ' + clip.output);
    return;
  }

  throw new Error(clip.id + ' timed out after ' + MAX_POLLS + ' polls');
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function run() {
  var errors = [];

  for (var i = 0; i < queue.length; i++) {
    try {
      await generateClip(queue[i], i, queue.length);
    } catch (err) {
      console.error('  ERROR: ' + err.message);
      errors.push(queue[i].id);
    }
    console.log('');
  }

  if (errors.length > 0) {
    console.error('  ' + errors.length + ' clip(s) failed: ' + errors.join(', '));
    console.error('  Fix the errors above and re-run. Already-saved clips are skipped.\n');
    process.exit(1);
  }

  if (FRAME_ONLY_RAW !== null) {
    console.log('  Single-clip test complete: ' + queue[0].output);
    console.log('  To generate all 4 clips: remove FRAME_ONLY and run again.\n');
  } else {
    console.log('  All clips generated successfully.');
    console.log('  Next: node scripts/merge-reel.js\n');
  }
}

run().catch(function (err) {
  console.error('  Unexpected error: ' + err.message);
  process.exit(1);
});
