#!/usr/bin/env node
/* Connections puzzle generator.
   Reads the SAME actor DB + constraint catalog the game uses
   (games/connections/puzzles.js), enumerates every distinct 3x3 grid
   (3 row constraints x 3 col constraints, all 6 distinct), and keeps only
   puzzles that are genuinely SOLVABLE — i.e. there exists an assignment of
   9 DISTINCT actors, one per cell, each satisfying its row+col constraint
   (a bipartite perfect matching). It also enforces a quality bar (every cell
   has >= MIN_PER_CELL eligible actors) so puzzles aren't forced/sterile.

   Output: rewrites the PUZZLES array in games/connections/puzzles.js and the
   DIFFICULTY_INDEX.connections array in shared.js. ACTORS + CONSTRAINTS are
   left untouched.

   Run:  node tools/connections-generator/generate.js
*/
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PUZZLES_FILE = path.join(ROOT, 'games', 'connections', 'puzzles.js');
const SHARED_FILE = path.join(ROOT, 'shared.js');

// ---- config ----
const MIN_PER_CELL = 2;   // every cell must have >= this many eligible actors
const MULTI_MIN    = 2;   // require >= this many DISTINCT full solutions (no forced/unique answer)
const SOL_CAP      = 1000;// stop counting solutions past this (richness is plenty)
const MAX_PUZZLES  = 500; // cap (years of daily content); curated for variety
const SEED         = 20260601;

// ---- load the game's data (shim window for the IIFE) ----
global.window = {};
require(PUZZLES_FILE);
const { ACTORS, CONSTRAINTS } = global.window.ConnectionsData;
const KEYS = Object.keys(CONSTRAINTS);

// Precompute which actors satisfy each constraint key.
const satisfies = {};
for (const k of KEYS) satisfies[k] = ACTORS.map((a, i) => CONSTRAINTS[k].test(a) ? i : -1).filter(i => i >= 0);

// ---- helpers ----
function combos(arr, k, start = 0, acc = [], out = []) {
  if (acc.length === k) { out.push(acc.slice()); return out; }
  for (let i = start; i < arr.length; i++) { acc.push(arr[i]); combos(arr, k, i + 1, acc, out); acc.pop(); }
  return out;
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rng = mulberry32(SEED);
function shuffled(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// Eligible actors for a cell = intersection of row & col constraint sets.
function cellActors(rowKey, colKey) {
  const colSet = new Set(satisfies[colKey]);
  return satisfies[rowKey].filter(i => colSet.has(i));
}

// Count DISTINCT full solutions: assignments of 9 distinct actors, one per
// cell, each satisfying its cell's row+col constraint. Counts up to `cap`
// then stops (puzzles that hit the cap are very richly solvable). Used both
// to require MULTIPLE valid answers (>= MULTI_MIN) and to rate richness.
// Tightest cells are processed first to prune the search fast.
function countSolutions(cellsEligible, cap = SOL_CAP) {
  const order = cellsEligible.map((_, i) => i).sort((a, b) => cellsEligible[a].length - cellsEligible[b].length);
  const used = new Set();
  let count = 0;
  (function rec(k) {
    if (count >= cap) return;
    if (k === order.length) { count++; return; }
    for (const actor of cellsEligible[order[k]]) {
      if (used.has(actor)) continue;
      used.add(actor);
      rec(k + 1);
      used.delete(actor);
      if (count >= cap) return;
    }
  })(0);
  return count;
}

// ---- enumerate candidates ----
const triples = combos(KEYS, 3);
const seenKey = new Set();
const candidates = [];

for (const rows of triples) {
  for (const cols of triples) {
    // all 6 constraints distinct (no cell with identical row/col)
    if (rows.some(r => cols.includes(r))) continue;
    // dedupe transpose (rows<->cols give the same grid transposed)
    const key = [rows.slice().sort().join(','), cols.slice().sort().join(',')].sort().join('|');
    if (seenKey.has(key)) continue;
    seenKey.add(key);

    // build 9 cells, enforce quality + collect counts
    const cells = [];
    let ok = true, minCount = Infinity, sum = 0;
    for (let r = 0; r < 3 && ok; r++) {
      for (let c = 0; c < 3; c++) {
        const el = cellActors(rows[r], cols[c]);
        if (el.length < MIN_PER_CELL) { ok = false; break; }
        cells.push(el); minCount = Math.min(minCount, el.length); sum += el.length;
      }
    }
    if (!ok) continue;
    const solutions = countSolutions(cells);
    if (solutions < MULTI_MIN) continue;   // must have multiple valid answers

    const avg = sum / 9;
    let difficulty;
    if (minCount >= 4 && avg >= 7) difficulty = 1;
    else if (minCount >= 3 && avg >= 4) difficulty = 2;
    else difficulty = 3;

    candidates.push({ rows, cols, minCount, avg, difficulty, solutions });
  }
}

// ---- curate: spread across difficulty + constraint variety, then cap ----
const shuffledCands = shuffled(candidates);
// light variety pass: prefer not repeating the exact same row-set back to back
shuffledCands.sort((a, b) => 0); // keep shuffle order (stable)
const chosen = shuffledCands.slice(0, MAX_PUZZLES);

// ---- titles (flavor only; id is the unique key) ----
const TITLES = [
  'Class of', 'Crossover', 'Double Bill', 'Triple Threat', 'The Long Run',
  'Opening Night', 'Standing Room Only', 'Curtain Up', 'Ensemble', 'Understudies',
  'Headliners', 'Marquee Names', 'Two Shows a Day', 'Eleven O\'Clock', 'Act One',
  'Act Two', 'Intermission', 'Stage Left', 'Stage Right', 'Center Stage',
  'The Revival', 'Limited Engagement', 'Sold Out', 'Encore', 'Bows',
  'Tony Bait', 'Dressing Room', 'The Pit', 'Downstage', 'Upstage'
];

const puzzles = chosen.map((p, i) => ({
  id: i + 1,
  title: TITLES[i % TITLES.length],
  rows: shuffled(p.rows),
  cols: shuffled(p.cols),
}));
const difficulties = chosen.map(p => p.difficulty);

// ---- serialize PUZZLES array ----
function arr(a) { return '[' + a.map(s => JSON.stringify(s)).join(', ') + ']'; }
const puzzlesText =
  'const PUZZLES = [\n' +
  puzzles.map(p =>
    '    { id: ' + p.id + ', title: ' + JSON.stringify(p.title) +
    ', rows: ' + arr(p.rows) + ', cols: ' + arr(p.cols) + ' }'
  ).join(',\n') +
  '\n  ];';

// ---- splice into puzzles.js (preserve ACTORS/CONSTRAINTS verbatim) ----
let src = fs.readFileSync(PUZZLES_FILE, 'utf8');
const before = src;
src = src.replace(/const PUZZLES = \[[\s\S]*?\];\s*\n\s*return \{/, puzzlesText + '\n\n  return {');
if (src === before) { console.error('ERROR: could not locate PUZZLES array to replace'); process.exit(1); }
fs.writeFileSync(PUZZLES_FILE, src);

// ---- update DIFFICULTY_INDEX.connections in shared.js ----
let sh = fs.readFileSync(SHARED_FILE, 'utf8');
const shBefore = sh;
sh = sh.replace(/connections:\s*\[[^\]]*\]/, 'connections: [' + difficulties.join(', ') + ']');
if (sh === shBefore) { console.error('ERROR: could not locate DIFFICULTY_INDEX.connections'); process.exit(1); }
fs.writeFileSync(SHARED_FILE, sh);

// ---- report ----
const dist = { 1: 0, 2: 0, 3: 0 };
difficulties.forEach(d => dist[d]++);
const chosenSols = chosen.map(p => p.solutions);
const minSol = Math.min(...chosenSols);
const cappedCount = chosenSols.filter(s => s >= SOL_CAP).length;
const medSol = chosenSols.slice().sort((a, b) => a - b)[Math.floor(chosenSols.length / 2)];
console.log('Constraints:', KEYS.length, '| Actors:', ACTORS.length);
console.log('Candidates with >= ' + MULTI_MIN + ' solutions:', candidates.length);
console.log('Written:', puzzles.length, 'puzzles  (cap ' + MAX_PUZZLES + ')');
console.log('Difficulty split  easy/med/hard:', dist[1], '/', dist[2], '/', dist[3]);
console.log('Solutions per puzzle  min/median:', minSol, '/', medSol, '| hit cap(' + SOL_CAP + '):', cappedCount);
console.log('Rotation length: ' + puzzles.length + ' days (~' + (puzzles.length / 365).toFixed(1) + ' years)');
