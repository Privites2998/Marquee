(function () {
  'use strict';

  const WORDS = window.WORDS_5;
  const THEATER = window.THEATER_WORDS;

  const statusEl   = document.querySelector('[data-status]');
  const resultsEl  = document.querySelector('[data-results]');
  const generateBtn = document.querySelector('[data-generate]');

  const clueSection = document.querySelector('[data-clue-section]');
  const clueGridEl  = document.querySelector('[data-clue-grid]');
  const clueWordsEl = document.querySelector('[data-clue-words]');
  const acrossEl    = document.querySelector('[data-across-clues]');
  const downEl      = document.querySelector('[data-down-clues]');
  const titleInput  = document.querySelector('[data-title-input]');
  const exportBtn   = document.querySelector('[data-export]');
  const exportOut   = document.querySelector('[data-export-output]');
  const backBtn     = document.querySelector('[data-back]');

  let lastGrids = [];

  function runGenerate() {
    const maxResults = parseInt(document.querySelector('[data-max-results]').value, 10) || 20;
    const timeoutSec = parseInt(document.querySelector('[data-timeout]').value, 10) || 6;
    const preferTheater = document.querySelector('[data-prefer-theater]').checked;

    statusEl.textContent = 'Searching… (' + WORDS.length + ' words in list)';
    resultsEl.innerHTML = '<div class="tool-empty">Working…</div>';
    generateBtn.disabled = true;

    // Defer so the UI can repaint.
    setTimeout(() => {
      try {
        const opts = {
          maxResults: preferTheater ? maxResults * 3 : maxResults,
          timeoutMs: timeoutSec * 1000
        };
        const result = window.GridGen.generate(WORDS, opts);
        let grids = result.grids;

        if (preferTheater) {
          // Score grids by # of theater words; keep top maxResults
          grids = grids
            .map(g => ({ g, s: window.GridGen.theaterScore(g, THEATER) }))
            .sort((a, b) => b.s - a.s)
            .slice(0, maxResults)
            .map(x => x.g);
        }

        lastGrids = grids;
        renderResults(grids);

        statusEl.textContent =
          grids.length + ' grid' + (grids.length === 1 ? '' : 's') +
          ' · ' + Math.round(result.elapsedMs) + 'ms' +
          (result.timedOut ? ' (hit timeout)' : '');
      } catch (e) {
        console.error(e);
        statusEl.textContent = 'Error: ' + e.message;
        resultsEl.innerHTML = '<div class="tool-empty">Generation failed. Check console.</div>';
      } finally {
        generateBtn.disabled = false;
      }
    }, 30);
  }

  function renderResults(grids) {
    if (!grids.length) {
      resultsEl.innerHTML = '<div class="tool-empty">No grids found. Try increasing the timeout or expanding the word list.</div>';
      return;
    }
    resultsEl.innerHTML = '';
    grids.forEach((g, idx) => {
      const score = window.GridGen.theaterScore(g, THEATER);
      const card = document.createElement('div');
      card.className = 'gg-result';

      const mini = document.createElement('div');
      mini.className = 'gg-mini-grid';
      for (let r = 0; r < 5; r++) {
        const rowWord = g[r];
        for (let c = 0; c < 5; c++) {
          const cell = document.createElement('div');
          cell.className = 'gg-mini-cell';
          // Highlight cells that participate in a theater word (row or column)
          let colWord = '';
          for (let rr = 0; rr < 5; rr++) colWord += g[rr][c];
          if (THEATER.has(rowWord) || THEATER.has(colWord)) {
            cell.classList.add('gg-mini-cell--theater');
          }
          cell.textContent = rowWord[c];
          mini.appendChild(cell);
        }
      }

      const sc = document.createElement('div');
      sc.className = 'gg-result__score';
      sc.textContent = score > 0 ? score + ' theater word' + (score === 1 ? '' : 's') : 'Generic grid';

      card.appendChild(mini);
      card.appendChild(sc);
      card.addEventListener('click', () => openClueEditor(g));
      resultsEl.appendChild(card);
    });
  }

  function openClueEditor(grid) {
    // Show the section
    clueSection.classList.remove('hidden');

    // Render the big grid
    clueGridEl.innerHTML = '';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const cell = document.createElement('div');
        cell.className = 'gg-mini-cell';
        cell.textContent = grid[r][c];
        clueGridEl.appendChild(cell);
      }
    }

    // List unique words
    const words = window.GridGen.gridWords(grid);
    clueWordsEl.innerHTML = 'Words: ' + words.join(' · ');

    // Build clue rows (in a 5x5 open grid, across entries = 5 rows, down = 5 cols)
    // Number scheme: cell (0,0) is #1 across + #1 down. Each cell in row 0 starts a down (#2..#5).
    // Then row 1 col 0 starts #6 across, etc.
    // Match what the engine does.
    function buildClueRows(target, dir, words5) {
      target.innerHTML = '';
      // Numbers per engine: 1, 2, 3, 4, 5 for first-row down + first-col across.
      // Across entries are numbered: 1, 6, 7, 8, 9
      // Down entries are numbered:   1, 2, 3, 4, 5
      const acrossNums = [1, 6, 7, 8, 9];
      const downNums   = [1, 2, 3, 4, 5];
      const nums = dir === 'across' ? acrossNums : downNums;
      for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.className = 'gg-clue-row';
        row.innerHTML =
          '<span class="gg-clue-row__num">' + nums[i] + '.</span>' +
          '<span class="gg-clue-row__word">' + words5[i] + '</span>' +
          '<input class="gg-clue-row__input" data-clue-' + dir + '="' + nums[i] + '" placeholder="Clue for ' + words5[i] + '…">';
        target.appendChild(row);
      }
    }

    const acrossWords = [grid[0], grid[1], grid[2], grid[3], grid[4]];
    const downWords = [];
    for (let c = 0; c < 5; c++) {
      let w = '';
      for (let r = 0; r < 5; r++) w += grid[r][c];
      downWords.push(w);
    }
    buildClueRows(acrossEl, 'across', acrossWords);
    buildClueRows(downEl, 'down', downWords);

    titleInput.value = '';
    exportOut.classList.add('hidden');
    exportOut.textContent = '';

    // Stash grid for export
    clueSection.dataset.gridJson = JSON.stringify(grid);
    clueSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function exportPuzzle() {
    const grid = JSON.parse(clueSection.dataset.gridJson || '[]');
    if (!grid.length) return;

    const acrossNums = [1, 6, 7, 8, 9];
    const downNums   = [1, 2, 3, 4, 5];

    function gather(dir, nums) {
      const out = {};
      nums.forEach(n => {
        const el = document.querySelector('[data-clue-' + dir + '="' + n + '"]');
        const val = (el && el.value.trim()) || '';
        if (val) out[n] = val;
      });
      return out;
    }

    const obj = {
      id: '__SET_ME__',
      title: titleInput.value.trim() || '__SET_ME__',
      grid: grid,
      clues: {
        across: gather('across', acrossNums),
        down: gather('down', downNums)
      }
    };

    // Pretty-print as a JS object literal, similar to what's in puzzles.js
    const lines = [];
    lines.push('{');
    lines.push('  id: ' + JSON.stringify(obj.id) + ',');
    lines.push('  title: ' + JSON.stringify(obj.title) + ',');
    lines.push('  grid: [');
    grid.forEach((row, i) => {
      lines.push("    '" + row + "'" + (i < grid.length - 1 ? ',' : ''));
    });
    lines.push('  ],');
    lines.push('  clues: {');
    function emitDir(dir, nums) {
      const entries = nums.filter(n => obj.clues[dir][n]);
      if (!entries.length) {
        lines.push('    ' + dir + ': {}');
        return;
      }
      lines.push('    ' + dir + ': {');
      entries.forEach((n, idx) => {
        const text = obj.clues[dir][n].replace(/"/g, '\\"');
        lines.push('      ' + n + ': "' + text + '"' + (idx < entries.length - 1 ? ',' : ''));
      });
      lines.push('    }' + (dir === 'across' ? ',' : ''));
    }
    emitDir('across', acrossNums);
    emitDir('down', downNums);
    lines.push('  }');
    lines.push('}');

    exportOut.textContent = lines.join('\n');
    exportOut.classList.remove('hidden');
  }

  generateBtn.addEventListener('click', runGenerate);
  exportBtn.addEventListener('click', exportPuzzle);
  backBtn.addEventListener('click', () => {
    clueSection.classList.add('hidden');
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
