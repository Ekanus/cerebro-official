/**
 * scripts/merge-reel.js
 *
 * Merges the 4 Cerebro reel clips into one final MP4 using ffmpeg.
 * Requires ffmpeg to be installed and available on PATH.
 *
 * Usage:
 *   node scripts/merge-reel.js
 *
 * Install ffmpeg if missing:
 *   winget install Gyan.FFmpeg        (Windows, requires winget)
 *   choco install ffmpeg              (Windows, requires Chocolatey)
 *   brew install ffmpeg               (macOS)
 *   sudo apt install ffmpeg           (Ubuntu/Debian)
 */

'use strict';

const fs           = require('fs');
const path         = require('path');
const { execSync, spawnSync } = require('child_process');
const os           = require('os');

const ROOT = path.resolve(__dirname, '..');

// ── Clip order ────────────────────────────────────────────────────────────────

const CLIPS = [
  'assets/reel/output/clip-01-chaos.mp4',
  'assets/reel/output/clip-02-detection.mp4',
  'assets/reel/output/clip-03-automation.mp4',
  'assets/reel/output/clip-04-cerebro-core.mp4',
];

const OUTPUT = 'assets/video/cerebro-system-reel.mp4';

// ── ffmpeg detection ──────────────────────────────────────────────────────────

function findFfmpeg() {
  try {
    var which = process.platform === 'win32' ? 'where' : 'which';
    var result = spawnSync(which, ['ffmpeg'], { encoding: 'utf8' });
    if (result.status === 0 && result.stdout.trim()) {
      return result.stdout.trim().split('\n')[0].trim();
    }
  } catch (_) {}
  return null;
}

// ── Guards ────────────────────────────────────────────────────────────────────

console.log('\n  Cerebro — reel merge');
console.log('');

var missingClips = CLIPS.filter(c => !fs.existsSync(path.join(ROOT, c)));
if (missingClips.length > 0) {
  console.error('  ERROR: Missing clips (run generate-veo-clips.js first):');
  missingClips.forEach(c => console.error('    ' + c));
  console.error('');
  process.exit(1);
}

var ffmpegPath = findFfmpeg();

if (!ffmpegPath) {
  console.error('  ERROR: ffmpeg not found on PATH.\n');
  console.error('  Install ffmpeg, then run this script again:\n');
  console.error('    Windows (winget):      winget install Gyan.FFmpeg');
  console.error('    Windows (Chocolatey):  choco install ffmpeg');
  console.error('    macOS:                 brew install ffmpeg');
  console.error('    Ubuntu/Debian:         sudo apt install ffmpeg');
  console.error('');
  console.error('  After installing, you may need to restart your terminal.');
  console.error('');
  console.error('  Or run ffmpeg manually (from project root):');
  console.error('');

  // Print the manual command so the user can run it themselves
  var lines = CLIPS.map(c => "  file '" + c.replace(/\\/g, '/') + "'").join('\n');
  console.error('    1. Create a file called _filelist.txt with this content:');
  console.error('');
  CLIPS.forEach(c => console.error("       file '" + c.replace(/\\/g, '/') + "'"));
  console.error('');
  console.error('    2. Run:');
  console.error('       ffmpeg -f concat -safe 0 -i _filelist.txt -c copy ' + OUTPUT);
  console.error('');
  process.exit(1);
}

console.log('  ffmpeg found: ' + ffmpegPath);

// ── Write temp concat file ────────────────────────────────────────────────────

var outAbs      = path.join(ROOT, OUTPUT);
var outDir      = path.dirname(outAbs);
var filelistAbs = path.join(os.tmpdir(), 'cerebro-reel-filelist.txt');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

var filelistContent = CLIPS
  .map(c => "file '" + path.join(ROOT, c).replace(/\\/g, '/') + "'")
  .join('\n');

fs.writeFileSync(filelistAbs, filelistContent, 'utf8');

console.log('  Clips to merge (in order):');
CLIPS.forEach((c, i) => console.log('    ' + (i + 1) + '. ' + c));
console.log('  Output: ' + OUTPUT);
console.log('');

// ── Merge ─────────────────────────────────────────────────────────────────────

var ffmpegArgs = [
  '-y',                   // overwrite output without asking
  '-f', 'concat',
  '-safe', '0',
  '-i', filelistAbs,
  '-c', 'copy',           // stream copy — no re-encode, instant
  outAbs,
];

console.log('  Running: ffmpeg ' + ffmpegArgs.join(' '));
console.log('');

var result = spawnSync(ffmpegPath, ffmpegArgs, {
  encoding: 'utf8',
  stdio:    ['ignore', 'pipe', 'pipe'],
});

// Clean up temp file
try { fs.unlinkSync(filelistAbs); } catch (_) {}

if (result.status !== 0) {
  console.error('  ffmpeg FAILED:');
  console.error(result.stderr || result.stdout || '(no output)');
  process.exit(1);
}

if (!fs.existsSync(outAbs)) {
  console.error('  ERROR: output file was not created.');
  process.exit(1);
}

var sizeMb = (fs.statSync(outAbs).size / (1024 * 1024)).toFixed(2);
console.log('  Reel created successfully.');
console.log('  Path : ' + OUTPUT);
console.log('  Size : ' + sizeMb + ' MB');
console.log('');
console.log('  Next: copy ' + OUTPUT + ' into your website assets and update the video tag.');
console.log('');
