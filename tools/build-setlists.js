/* build-setlists.js — regenerate games/setlist/setlists.js from the shows DB.
 *
 * The Setlist game gives the show and asks the player to put its songs in the
 * order they're performed. This script derives each puzzle from the canonical
 * shows database (data/shows.js): it takes 5 songs SPREAD across the show's
 * full performance order (always the opening number and the finale, plus three
 * evenly-spaced between), so the correct order is unambiguous and the database
 * stays the single source of truth.
 *
 * Run from the repo root:  node tools/build-setlists.js
 *
 * Regenerate this whenever data/shows.js changes. Hand edits to setlists.js
 * will be overwritten; fix the data in the database instead.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DB = path.join(ROOT, 'data', 'shows.js');
const OUT = path.join(ROOT, 'games', 'setlist', 'setlists.js');

const win = {};
new Function('window', fs.readFileSync(DB, 'utf8'))(win);
const shows = win.MarqueeShows || [];

// Pick 5 songs spread across the ordered list: indices 0, 1/4, 1/2, 3/4, end.
function pickFive(songs) {
  const n = songs.length;
  if (n < 5) return null;
  const idx = [0, 1, 2, 3, 4].map(i => Math.round((i * (n - 1)) / 4));
  // guard against any rounding collision (shouldn't happen for n >= 5)
  const uniq = [...new Set(idx)];
  while (uniq.length < 5) { for (let i = 0; i < n && uniq.length < 5; i++) if (!uniq.includes(i)) uniq.push(i); }
  uniq.sort((a, b) => a - b);
  return uniq.slice(0, 5).map(i => songs[i]);
}

const puzzles = [];
const skipped = [];
shows.forEach(s => {
  const five = pickFive(s.songs);
  if (!five) { skipped.push(s.id); return; }
  puzzles.push({ id: puzzles.length + 1, show: s.title, songs: five });
});

const body = puzzles.map(p =>
  '  { id: ' + p.id + ', show: ' + JSON.stringify(p.show) + ',\n' +
  '    songs: ' + JSON.stringify(p.songs) + ' }'
).join(',\n');

const out =
`/* Setlist — daily puzzles. AUTO-GENERATED from data/shows.js.
   The show is given; put its songs in the order they're performed. Each
   \`songs\` array is the CORRECT running order (the game shuffles it for play):
   5 songs spread across the show (opening number ... finale), so the order is
   unambiguous.

   Do NOT hand-edit this file. Fix the song order in data/shows.js and re-run
   tools/build-setlists.js.
*/
window.SetlistPuzzles = [
${body}
];
`;

fs.writeFileSync(OUT, out, 'utf8');
console.log('Wrote ' + OUT);
console.log('  setlists: ' + puzzles.length + (skipped.length ? ' (skipped <5 songs: ' + skipped.join(', ') + ')' : ''));
