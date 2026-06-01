#!/usr/bin/env node
/* Showdown generator — "which opened on Broadway later?"
   The only comparison metric we can assert with high confidence across many
   shows is the Broadway OPENING YEAR. This generator pairs shows on year and
   emits puzzles. SAFETY: it only creates a matchup when the two years differ
   by >= MIN_GAP, so even a ±1 error in the table below can't flip the correct
   answer. The engine's "bigger value wins" rule maps to "opened later."

   The 7 hand-curated puzzles in matchups.js (which use Tony/performance stats)
   are left untouched; these generated puzzles are appended via generated.js.

   Run: node tools/showdown-generator/generate.js
*/
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

const MIN_GAP   = 3;    // years apart required for a generated matchup
const PUZZLES   = 60;   // generated puzzles (×5 matchups)
const PER       = 5;
const SEED      = 20260601;

// Confident Broadway opening years (original productions unless noted).
const SHOWS = [
  ["Oklahoma!", 1943], ["Carousel", 1945], ["Annie Get Your Gun", 1946],
  ["Kiss Me, Kate", 1948], ["South Pacific", 1949], ["Guys and Dolls", 1950],
  ["The King and I", 1951], ["The Pajama Game", 1954], ["Damn Yankees", 1955],
  ["My Fair Lady", 1956], ["The Music Man", 1957], ["West Side Story", 1957],
  ["Gypsy", 1959], ["The Sound of Music", 1959], ["Bye Bye Birdie", 1960],
  ["Camelot", 1960], ["A Funny Thing Happened on the Way to the Forum", 1962],
  ["Hello, Dolly!", 1964], ["Fiddler on the Roof", 1964], ["Man of La Mancha", 1965],
  ["Mame", 1966], ["Cabaret", 1966], ["Hair", 1968], ["Company", 1970],
  ["Follies", 1971], ["Grease", 1972], ["Pippin", 1972], ["A Little Night Music", 1973],
  ["The Wiz", 1975], ["Chicago", 1975], ["A Chorus Line", 1975], ["Annie", 1977],
  ["Sweeney Todd", 1979], ["Evita", 1979], ["42nd Street", 1980], ["Dreamgirls", 1981],
  ["Cats", 1982], ["La Cage aux Folles", 1983], ["Sunday in the Park with George", 1984],
  ["Les Misérables", 1987], ["Into the Woods", 1987], ["The Phantom of the Opera", 1988],
  ["Miss Saigon", 1991], ["Crazy for You", 1992], ["Beauty and the Beast", 1994],
  ["Sunset Boulevard", 1994], ["Rent", 1996], ["Titanic", 1997], ["The Lion King", 1997],
  ["Ragtime", 1998], ["Aida", 2000], ["The Producers", 2001], ["Mamma Mia!", 2001],
  ["Hairspray", 2002], ["Avenue Q", 2003], ["Wicked", 2003], ["Spamalot", 2005],
  ["Jersey Boys", 2005], ["The Color Purple", 2005], ["Spring Awakening", 2006],
  ["Legally Blonde", 2007], ["In the Heights", 2008], ["Next to Normal", 2009],
  ["Memphis", 2009], ["American Idiot", 2010], ["The Book of Mormon", 2011],
  ["Once", 2012], ["Newsies", 2012], ["Kinky Boots", 2013], ["Matilda", 2013],
  ["Aladdin", 2014], ["Beautiful", 2014], ["Hamilton", 2015], ["Fun Home", 2015],
  ["Waitress", 2016], ["Dear Evan Hansen", 2016], ["Come From Away", 2017],
  ["The Band's Visit", 2017], ["Frozen", 2018], ["Mean Girls", 2018],
  ["Hadestown", 2019], ["Beetlejuice", 2019], ["Moulin Rouge!", 2019], ["Six", 2021]
];

function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
const rng = mulberry32(SEED);
const ri = n => Math.floor(rng() * n);

const PROMPTS = [
  "Which opened on Broadway LATER?",
  "Which is the more recent Broadway opening?",
  "Which premiered on Broadway LATER?"
];

const usedPairs = new Set();
function pairKey(i, j){ return i < j ? i + '-' + j : j + '-' + i; }

function makeMatchup() {
  for (let tries = 0; tries < 200; tries++) {
    const i = ri(SHOWS.length), j = ri(SHOWS.length);
    if (i === j) continue;
    if (Math.abs(SHOWS[i][1] - SHOWS[j][1]) < MIN_GAP) continue;
    if (usedPairs.has(pairKey(i, j))) continue;
    usedPairs.add(pairKey(i, j));
    const a = SHOWS[i], b = SHOWS[j];
    return {
      prompt: PROMPTS[ri(PROMPTS.length)],
      a: { name: a[0], value: a[1], label: "opened" },
      b: { name: b[0], value: b[1], label: "opened" },
      note: a[0] + ": " + a[1] + ".  " + b[0] + ": " + b[1] + ".",
      gap: Math.abs(a[1] - b[1])
    };
  }
  return null;
}

const puzzles = [];
const diffs = [];
for (let p = 0; p < PUZZLES; p++) {
  const matchups = [];
  const seenInPuzzle = new Set();
  let guard = 0;
  while (matchups.length < PER && guard++ < 500) {
    const m = makeMatchup();
    if (!m) break;
    if (seenInPuzzle.has(m.a.name) || seenInPuzzle.has(m.b.name)) { continue; }
    seenInPuzzle.add(m.a.name); seenInPuzzle.add(m.b.name);
    matchups.push(m);
  }
  if (matchups.length < PER) break;
  const minGap = Math.min(...matchups.map(m => m.gap));
  diffs.push(minGap <= 4 ? 3 : (minGap <= 9 ? 2 : 1));
  puzzles.push({ id: 7 + p + 1, matchups: matchups.map(({ gap, ...m }) => m) });
}

// ---- serialize generated.js ----
function esc(s){ return JSON.stringify(s); }
const body = puzzles.map(p =>
  '  {\n    id: ' + p.id + ',\n    matchups: [\n' +
  p.matchups.map(m =>
    '      { prompt: ' + esc(m.prompt) +
    ', a: { name: ' + esc(m.a.name) + ', value: ' + m.a.value + ', label: "opened" }' +
    ', b: { name: ' + esc(m.b.name) + ', value: ' + m.b.value + ', label: "opened" }' +
    ', note: ' + esc(m.note) + ' }'
  ).join(',\n') +
  '\n    ]\n  }'
).join(',\n');

const out =
  '/* AUTO-GENERATED by tools/showdown-generator/generate.js — do not edit by hand.\n' +
  '   ' + puzzles.length + ' opening-year puzzles appended to the 7 curated ones in matchups.js. */\n' +
  '(function () {\n' +
  '  var GEN = [\n' + body + '\n  ];\n' +
  '  window.ShowdownPuzzles = (window.ShowdownPuzzles || []).concat(GEN);\n' +
  '})();\n';

fs.writeFileSync(path.join(ROOT, 'games', 'showdown', 'generated.js'), out);

console.log('Shows in table:', SHOWS.length);
console.log('Generated puzzles:', puzzles.length, '(+7 curated = ' + (puzzles.length + 7) + ' total, ~' + ((puzzles.length + 7) / 30).toFixed(1) + ' months)');
console.log('Curated difficulty (7): [2, 2, 2, 2, 3, 2, 2]');
console.log('Full DIFFICULTY_INDEX.showdown:');
console.log('[2, 2, 2, 2, 3, 2, 2, ' + diffs.join(', ') + ']');
