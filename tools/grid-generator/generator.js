/* Crossword grid generator — backtracking solver for 5x5 open grids.
   Every row and every column must be a 5-letter word from the supplied list.

   Strategy:
   - Build a Set of valid words (for fast complete-word check)
   - Build a Set of all valid PREFIXES (any 1-4 letter start of a real word)
   - Place words row by row; after each placement, verify the current column
     prefixes are still extendable
   - When 5 rows are placed, verify the 5 column words are real words
*/

window.GridGen = (function () {
  function buildPrefixSet(words) {
    const prefixes = new Set();
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      // Include the full word as a prefix too — useful when length=5
      for (let j = 1; j <= w.length; j++) prefixes.add(w.substring(0, j));
    }
    return prefixes;
  }

  function buildByFirstLetter(words) {
    const m = new Map();
    for (const w of words) {
      const first = w[0];
      if (!m.has(first)) m.set(first, []);
      m.get(first).push(w);
    }
    return m;
  }

  function colPrefix(grid, col, upToRow) {
    let s = '';
    for (let r = 0; r < upToRow; r++) s += grid[r][col];
    return s;
  }

  /**
   * Generate valid 5x5 grids.
   * @param {string[]} words - list of 5-letter uppercase words
   * @param {object} opts
   * @param {number} opts.maxResults - stop after this many grids (default 30)
   * @param {number} opts.timeoutMs - stop after this many ms (default 6000)
   * @param {boolean} opts.shuffle - shuffle the word list for variety (default true)
   * @param {(g: string[]) => boolean} opts.filter - optional grid filter
   * @returns {string[][]} array of grids; each grid is array of 5 strings
   */
  function generate(words, opts) {
    opts = opts || {};
    const maxResults = opts.maxResults || 30;
    const timeoutMs = opts.timeoutMs || 6000;

    const wordSet = new Set(words);
    const prefixSet = buildPrefixSet(words);

    let list = words.slice();
    if (opts.shuffle !== false) {
      for (let i = list.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        const t = list[i]; list[i] = list[j]; list[j] = t;
      }
    }
    const byFirst = buildByFirstLetter(list);

    const start = performance.now();
    const grid = ['', '', '', '', ''];
    const results = [];

    function timedOut() { return performance.now() - start > timeoutMs; }

    function tryRow(rowIdx) {
      if (results.length >= maxResults) return true;
      if (timedOut()) return true;

      if (rowIdx === 5) {
        // Verify columns are valid words
        for (let c = 0; c < 5; c++) {
          if (!wordSet.has(colPrefix(grid, c, 5))) return false;
        }
        if (opts.filter && !opts.filter(grid)) return false;
        results.push(grid.slice());
        return false;
      }

      // Candidates for this row: for row 0, any word. For row 1+, words whose
      // first letter extends the column prefix at col 0 (smallest cut).
      let candidates;
      if (rowIdx === 0) {
        candidates = list;
      } else {
        const c0Prefix = colPrefix(grid, 0, rowIdx);
        // We need a word w such that c0Prefix + w[0] is still a valid prefix.
        // Build candidate set from words whose first letter, when appended,
        // still hits prefixSet.
        candidates = [];
        for (const [letter, ws] of byFirst) {
          if (prefixSet.has(c0Prefix + letter)) {
            // Add all words starting with this letter
            for (const w of ws) candidates.push(w);
          }
        }
      }

      for (let i = 0; i < candidates.length; i++) {
        if (timedOut() || results.length >= maxResults) return true;

        const word = candidates[i];
        grid[rowIdx] = word;

        let ok = true;
        for (let c = 0; c < 5; c++) {
          const cp = colPrefix(grid, c, rowIdx + 1);
          // At rowIdx+1 == 5, cp is a complete 5-letter word; must be in wordSet.
          // Otherwise, cp must be a valid prefix.
          if (rowIdx + 1 === 5) {
            if (!wordSet.has(cp)) { ok = false; break; }
          } else {
            if (!prefixSet.has(cp)) { ok = false; break; }
          }
        }

        if (ok) {
          const stop = tryRow(rowIdx + 1);
          if (stop) return true;
        }
      }
      grid[rowIdx] = '';
      return false;
    }

    tryRow(0);
    return { grids: results, elapsedMs: performance.now() - start, timedOut: timedOut() };
  }

  /** Count theater-leaning words in a grid (rows + cols). */
  function theaterScore(grid, theaterSet) {
    let score = 0;
    for (let r = 0; r < 5; r++) if (theaterSet.has(grid[r])) score++;
    for (let c = 0; c < 5; c++) {
      let col = '';
      for (let r = 0; r < 5; r++) col += grid[r][c];
      if (theaterSet.has(col)) score++;
    }
    return score;
  }

  /** Detect words from a grid (rows + cols, deduped). */
  function gridWords(grid) {
    const set = new Set();
    for (let r = 0; r < 5; r++) set.add(grid[r]);
    for (let c = 0; c < 5; c++) {
      let col = '';
      for (let r = 0; r < 5; r++) col += grid[r][c];
      set.add(col);
    }
    return Array.from(set);
  }

  return { generate, theaterScore, gridWords };
})();

// A list of 5-letter words we consider "theater-leaning" for grid scoring.
window.THEATER_WORDS = new Set([
  'AISLE','ARIAS','BATON','CHOIR','CHORD','DANCE','FLUTE','OPERA','ORGAN',
  'PIANO','SCENE','SCORE','SHOWS','SOLOS','STAGE','TANGO','TENOR','USHER',
  'VOICE','WALTZ','DIVAS','ENCORE','EXITS','HORNS','HARPS','DRUMS','REEDS',
  'CROWN','STARS','TIARA','OVATE','ROBES','ACTOR','OPERA','MELODY'
].map(w => w.toUpperCase()));
