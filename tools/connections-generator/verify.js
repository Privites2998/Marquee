#!/usr/bin/env node
/* Independently re-validates the generated Connections puzzles in
   games/connections/puzzles.js: every puzzle must have 3 valid row + 3 valid
   col constraints, every cell >= 1 eligible actor, and >= 2 distinct full
   solutions. Also checks shared.js DIFFICULTY_INDEX.connections length matches.
   Run:  node tools/connections-generator/verify.js   (exit 1 on any failure)
*/
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
global.window = {};
require(path.join(ROOT, 'games', 'connections', 'puzzles.js'));
const { ACTORS, CONSTRAINTS, PUZZLES } = global.window.ConnectionsData;

const sat = {};
for (const k of Object.keys(CONSTRAINTS)) sat[k] = ACTORS.map((a, i) => CONSTRAINTS[k].test(a) ? i : -1).filter(i => i >= 0);
function cellActors(r, c) { const s = new Set(sat[c]); return sat[r].filter(i => s.has(i)); }
function countSolutions(cells, cap = 2) {
  const order = cells.map((_, i) => i).sort((a, b) => cells[a].length - cells[b].length);
  const used = new Set(); let n = 0;
  (function rec(k) { if (n >= cap) return; if (k === order.length) { n++; return; }
    for (const a of cells[order[k]]) { if (used.has(a)) continue; used.add(a); rec(k + 1); used.delete(a); if (n >= cap) return; } })(0);
  return n;
}

let fails = 0;
PUZZLES.forEach(p => {
  const ctx = 'Connections #' + p.id;
  if (!Array.isArray(p.rows) || p.rows.length !== 3 || !Array.isArray(p.cols) || p.cols.length !== 3) { console.error(ctx + ': bad rows/cols'); fails++; return; }
  for (const k of [...p.rows, ...p.cols]) if (!CONSTRAINTS[k]) { console.error(ctx + ': unknown constraint ' + k); fails++; }
  const cells = [];
  for (const r of p.rows) for (const c of p.cols) { const el = cellActors(r, c); if (el.length < 1) { console.error(ctx + ': empty cell ' + r + '×' + c); fails++; } cells.push(el); }
  if (countSolutions(cells, 2) < 2) { console.error(ctx + ': fewer than 2 solutions'); fails++; }
});

// difficulty index length
const sh = fs.readFileSync(path.join(ROOT, 'shared.js'), 'utf8');
const m = sh.match(/connections:\s*\[([^\]]*)\]/);
const diffLen = m ? m[1].split(',').filter(s => s.trim()).length : -1;
if (diffLen !== PUZZLES.length) { console.error('DIFFICULTY_INDEX.connections length ' + diffLen + ' != puzzles ' + PUZZLES.length); fails++; }

console.log('Puzzles checked:', PUZZLES.length, '| difficulty index:', diffLen);
console.log(fails === 0 ? 'ALL PASS ✓' : (fails + ' FAILURES ✗'));
process.exit(fails === 0 ? 0 : 1);
