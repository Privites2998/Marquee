/* build-nowplaying.js — regenerate games/nowplaying/shows.js from the database.
 *
 * Now Playing gives a teasing blurb, then reveals 5 clues one at a time on wrong
 * guesses (most-vague to near-giveaway). This script merges two database files:
 *   data/shows.js  -> the show's title (name) and aka (search aliases)
 *   data/clues.js  -> that show's { blurb, clues } authoring layer
 * so the database stays the single source of truth. A show appears in the game
 * only once it has a clue set in data/clues.js.
 *
 * Run from the repo root:  node tools/build-nowplaying.js
 * Re-run whenever data/shows.js or data/clues.js changes. Do not hand-edit the
 * generated games/nowplaying/shows.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

function load(file, prop) {
  const win = {};
  new Function('window', fs.readFileSync(path.join(ROOT, file), 'utf8'))(win);
  return win[prop];
}

const shows = load('data/shows.js', 'MarqueeShows');
const clues = load('data/clues.js', 'MarqueeClues') || {};

const puzzles = [];
const skipped = [];
shows.forEach(s => {
  const c = clues[s.id];
  if (!c || !Array.isArray(c.clues) || c.clues.length !== 5 || !c.blurb) { skipped.push(s.id); return; }
  puzzles.push({
    id: puzzles.length + 1,
    name: s.title,
    aliases: s.aka || [s.title.toLowerCase()],
    blurb: c.blurb,
    clues: c.clues
  });
});

const body = puzzles.map(p =>
  '  {\n' +
  '    id: ' + p.id + ', name: ' + JSON.stringify(p.name) + ', aliases: ' + JSON.stringify(p.aliases) + ',\n' +
  '    blurb: ' + JSON.stringify(p.blurb) + ',\n' +
  '    clues: [\n' + p.clues.map(c => '      ' + JSON.stringify(c)).join(',\n') + '\n    ]\n' +
  '  }'
).join(',\n');

const out =
`/* Now Playing — daily puzzles. AUTO-GENERATED from data/shows.js + data/clues.js.
   Guess the show. A teasing blurb shows from the start; five clues reveal one
   at a time on wrong guesses, ordered most-vague to near-giveaway.

   Do NOT hand-edit this file. Edit the clue layer in data/clues.js (or the show
   facts in data/shows.js) and re-run tools/build-nowplaying.js.
*/
window.NowPlayingPuzzles = [
${body}
];
`;

fs.writeFileSync(path.join(ROOT, 'games', 'nowplaying', 'shows.js'), out, 'utf8');
console.log('Wrote games/nowplaying/shows.js with ' + puzzles.length + ' shows.');
console.log('Skipped (no clue set in data/clues.js): ' + (skipped.length ? skipped.join(', ') : 'none'));
