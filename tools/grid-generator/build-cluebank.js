/* build-cluebank.js — regenerate games/crossword/cluebank.js
 *
 * The clue-bank maps a 5-letter ANSWER WORD to its clue, so a clue is written
 * once per word and reused by any grid that contains it (generated grids then
 * auto-clue themselves). This script seeds the bank from the clues already
 * hand-written in games/crossword/puzzles.js, so no existing work is lost.
 *
 * Run from the repo root:  node tools/grid-generator/build-cluebank.js
 *
 * The 18 seed puzzles are all full-open 5x5 grids (no black squares), so the
 * engine's clue numbering is fixed: across entries are numbered 1,6,7,8,9 (the
 * five rows top-to-bottom) and down entries 1,2,3,4,5 (the five columns
 * left-to-right). We assert that shape and bail loudly if a future puzzle adds
 * black squares, since the mapping would no longer hold.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const PUZZLES = path.join(ROOT, 'games', 'crossword', 'puzzles.js');
const OUT = path.join(ROOT, 'games', 'crossword', 'cluebank.js');

// Load puzzles.js by running it with a stand-in `window`.
const src = fs.readFileSync(PUZZLES, 'utf8');
const win = {};
new Function('window', src)(win);
const puzzles = win.CrosswordPuzzles || [];

const ACROSS_NUMS = [1, 6, 7, 8, 9]; // row 0..4 for a full-open 5x5

const bank = {};
const collisions = [];
let pairs = 0;

function addClue(word, clue, pid) {
  if (!word || !clue) return;
  pairs++;
  if (bank[word] && bank[word].clue !== clue) {
    collisions.push({ word, kept: bank[word].clue, dropped: clue, pid });
    return; // first clue for a word wins
  }
  if (!bank[word]) bank[word] = { clue };
}

for (const p of puzzles) {
  const g = p.grid || [];
  const ok = g.length === 5 && g.every(row => row.length === 5 && !row.includes('.'));
  if (!ok) {
    console.error('SKIP puzzle ' + p.id + ': not a full-open 5x5 grid (clue numbering assumption broken).');
    continue;
  }
  // across = the five rows
  for (let r = 0; r < 5; r++) {
    addClue(g[r], p.clues && p.clues.across && p.clues.across[ACROSS_NUMS[r]], p.id);
  }
  // down = the five columns
  for (let c = 0; c < 5; c++) {
    let word = '';
    for (let r = 0; r < 5; r++) word += g[r][c];
    addClue(word, p.clues && p.clues.down && p.clues.down[c + 1], p.id);
  }
}

const words = Object.keys(bank).sort();
const lines = words.map(w => '  ' + w + ': ' + JSON.stringify(bank[w].clue) + ',');

const out =
`/* Mini Crossword — clue-bank. AUTO-SEEDED, then hand-extended.
 *
 * One clue per 5-letter answer word. Any grid that uses a word inherits its
 * clue here, so generated grids clue themselves. To scale Crossword, just add
 * more WORD: "clue" lines below (keep words UPPERCASE, alphabetical).
 *
 * A puzzle in puzzles.js may still override any clue locally for flavor — the
 * engine prefers a puzzle's own clue and falls back to this bank.
 *
 * Seeded from puzzles.js by tools/grid-generator/build-cluebank.js.
 * Re-run that script to refresh the seeded entries.
 */
window.CrosswordClues = {
${lines.join('\n')}
};
`;

fs.writeFileSync(OUT, out, 'utf8');
console.log('Wrote ' + OUT);
console.log('  distinct words: ' + words.length + ' (from ' + pairs + ' word/clue pairs across ' + puzzles.length + ' puzzles)');
console.log('  duplicate-word collisions (first clue kept): ' + collisions.length);
if (collisions.length) {
  collisions.forEach(c => console.log('    ' + c.word + ' — kept: ' + JSON.stringify(c.kept) + ' | dropped: ' + JSON.stringify(c.dropped)));
}
