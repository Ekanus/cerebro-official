/**
 * scripts/test-google-media-api.js
 *
 * Safe connectivity test for Google Generative AI APIs.
 * Reads the key from GOOGLE_GENERATIVE_AI_API_KEY — never hardcoded.
 * Does NOT generate images or video. Only lists available models.
 *
 * Usage:
 *   node scripts/test-google-media-api.js
 *
 * Set key first (PowerShell):
 *   $env:GOOGLE_GENERATIVE_AI_API_KEY = "your_key_here"
 *
 * Set key first (bash):
 *   export GOOGLE_GENERATIVE_AI_API_KEY="your_key_here"
 */

'use strict';

const https = require('https');

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!API_KEY) {
  console.error('');
  console.error('  ERROR: GOOGLE_GENERATIVE_AI_API_KEY is not set.');
  console.error('');
  console.error('  Set it before running this script:');
  console.error('    PowerShell: $env:GOOGLE_GENERATIVE_AI_API_KEY = "your_key_here"');
  console.error('    bash:       export GOOGLE_GENERATIVE_AI_API_KEY="your_key_here"');
  console.error('');
  process.exit(1);
}

console.log('');
console.log('  Cerebro — Google Generative AI API test');
console.log('  ----------------------------------------');
console.log('  Key found: YES (length ' + API_KEY.length + ')');
console.log('');

// ── 1. List models via REST (no SDK dependency needed) ────────────────────────

function get(url) {
  return new Promise(function (resolve, reject) {
    var req = https.get(url, function (res) {
      var body = '';
      res.on('data', function (chunk) { body += chunk; });
      res.on('end', function () {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch (e) { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, function () { req.destroy(new Error('Request timed out')); });
  });
}

async function listModels() {
  var url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + API_KEY;
  console.log('  [1/2] Fetching model list from Google AI...');
  try {
    var result = await get(url);
    if (result.status !== 200) {
      console.error('  FAILED — HTTP ' + result.status);
      if (result.data && result.data.error) {
        console.error('  ' + result.data.error.message);
      }
      return null;
    }
    return result.data.models || [];
  } catch (err) {
    console.error('  FAILED — ' + err.message);
    return null;
  }
}

function classifyModel(name) {
  if (/imagen|image-gen/i.test(name)) return 'IMAGE_GENERATION';
  if (/veo|video/i.test(name))        return 'VIDEO_GENERATION';
  if (/gemini/i.test(name))           return 'TEXT/MULTIMODAL';
  if (/embedding/i.test(name))        return 'EMBEDDING';
  return 'OTHER';
}

async function run() {
  var models = await listModels();

  if (!models) {
    console.error('');
    console.error('  API test FAILED. Check the key and your network connection.');
    console.error('');
    process.exit(1);
  }

  console.log('  OK — ' + models.length + ' models returned.');
  console.log('');

  // Categorise and print models relevant to our workflow
  var imageModels = [];
  var videoModels = [];
  var geminiModels = [];

  models.forEach(function (m) {
    var type = classifyModel(m.name || '');
    if (type === 'IMAGE_GENERATION') imageModels.push(m);
    else if (type === 'VIDEO_GENERATION') videoModels.push(m);
    else if (type === 'TEXT/MULTIMODAL') geminiModels.push(m);
  });

  console.log('  [2/2] Workflow-relevant models:');
  console.log('');

  if (imageModels.length) {
    console.log('  IMAGE GENERATION (Imagen / Nano Banana):');
    imageModels.forEach(function (m) { console.log('    • ' + m.name); });
    console.log('');
  } else {
    console.log('  IMAGE GENERATION: none listed under this key');
    console.log('  (Imagen may require Vertex AI access or allowlist approval)');
    console.log('');
  }

  if (videoModels.length) {
    console.log('  VIDEO GENERATION (Veo):');
    videoModels.forEach(function (m) { console.log('    • ' + m.name); });
    console.log('');
  } else {
    console.log('  VIDEO GENERATION: none listed under this key');
    console.log('  (Veo 3.1 may require Vertex AI / preview access)');
    console.log('');
  }

  if (geminiModels.length) {
    console.log('  GEMINI (text/multimodal — available):');
    geminiModels.slice(0, 6).forEach(function (m) { console.log('    • ' + m.name); });
    if (geminiModels.length > 6) {
      console.log('    … and ' + (geminiModels.length - 6) + ' more');
    }
    console.log('');
  }

  console.log('  ----------------------------------------');
  console.log('  Result: API key is VALID and reachable.');
  console.log('  No media was generated — this was a read-only connectivity check.');
  console.log('');
}

run().catch(function (err) {
  console.error('  Unexpected error: ' + err.message);
  process.exit(1);
});
