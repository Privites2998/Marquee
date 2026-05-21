(function () {
  'use strict';

  // ----- Gather puzzle data -----
  const GAME_DATA = [
    {
      id: 'crossword', label: 'Mini Crossword',
      list: window.CrosswordPuzzles || [],
      titleFor: p => p.title || ('Puzzle ' + p.id),
      validator: validateCrossword
    },
    {
      id: 'lyric', label: 'Lyric',
      list: window.LyricPuzzles || [],
      titleFor: p => (p.show && p.show.answer) + ' · ' + (p.song && p.song.answer),
      validator: validateLyric
    },
    {
      id: 'connections', label: 'Connections',
      list: (window.ConnectionsData && window.ConnectionsData.PUZZLES) || [],
      titleFor: p => p.title || ('Puzzle ' + p.id),
      validator: validateConnections
    },
    {
      id: 'actor', label: 'Name the Actor',
      list: window.ActorPuzzles || [],
      titleFor: p => p.name,
      validator: validateActor
    },
    {
      id: 'showdown', label: 'Showdown',
      list: window.ShowdownPuzzles || [],
      titleFor: p => 'Puzzle ' + p.id + ' (' + ((p.matchups || []).length) + ' matchups)',
      validator: validateShowdown
    },
    {
      id: 'spotlight', label: 'Spotlight',
      list: window.SpotlightPuzzles || [],
      titleFor: p => p.category,
      validator: validateSpotlight
    }
  ];

  // ----- Today block -----
  const today = Marquee.dayIndex();
  const todayBlock = document.querySelector('[data-today-block]');
  todayBlock.innerHTML =
    '<div class="pv-day-meta">Day index <strong>' + today + '</strong> · ' + Marquee.prettyDate() + '</div>' +
    '<div class="pv-today"></div>';
  const todayGrid = todayBlock.querySelector('.pv-today');
  GAME_DATA.forEach(g => {
    if (!g.list.length) return;
    const idx = today % g.list.length;
    const p = g.list[idx];
    const card = document.createElement('div');
    card.className = 'pv-today__card';
    card.innerHTML =
      '<div class="pv-today__game">' + g.label + '</div>' +
      '<div class="pv-today__title">' + escapeHtml(g.titleFor(p)) + '</div>' +
      '<div class="pv-today__id">id ' + p.id + ' · ' + (idx + 1) + '/' + g.list.length + '</div>';
    todayGrid.appendChild(card);
  });

  // ----- Validators -----
  const validatorsEl = document.querySelector('[data-validators]');
  let anyIssues = false;
  GAME_DATA.forEach(g => {
    const issues = [];
    if (!g.list.length) issues.push({ level: 'warn', msg: 'No puzzles loaded.' });
    g.list.forEach((p, idx) => {
      try {
        g.validator(p, idx, issues);
      } catch (e) {
        issues.push({ level: 'error', msg: 'Validator threw on puzzle ' + p.id + ': ' + e.message });
      }
    });
    if (issues.length) anyIssues = true;
    const wrap = document.createElement('div');
    wrap.className = 'pv-validator';
    wrap.innerHTML = '<div class="pv-validator__game">' + g.label + '</div>';
    if (!issues.length) {
      wrap.innerHTML += '<div class="pv-clear">✓ All clear (' + g.list.length + ' puzzles)</div>';
    } else {
      issues.forEach(iss => {
        const d = document.createElement('div');
        d.className = 'pv-issue' + (iss.level === 'warn' ? ' pv-issue--warn' : '');
        d.textContent = iss.msg;
        wrap.appendChild(d);
      });
    }
    validatorsEl.appendChild(wrap);
  });

  // ----- Game lists -----
  const gamesEl = document.querySelector('[data-games]');
  GAME_DATA.forEach(g => {
    const sec = document.createElement('div');
    sec.className = 'pv-game';
    sec.innerHTML =
      '<div class="pv-game__head">' +
        '<div class="pv-game__title">' + g.label + '</div>' +
        '<div class="pv-game__count">' + g.list.length + ' puzzle' + (g.list.length === 1 ? '' : 's') + '</div>' +
      '</div>';
    const table = document.createElement('table');
    table.className = 'pv-table';
    table.innerHTML =
      '<thead><tr>' +
        '<th>Slot</th>' +
        '<th>ID</th>' +
        '<th>Title / Subject</th>' +
        '<th></th>' +
      '</tr></thead>';
    const tbody = document.createElement('tbody');
    g.list.forEach((p, idx) => {
      const isToday = (today % g.list.length) === idx;
      const tr = document.createElement('tr');
      if (isToday) tr.classList.add('is-today');
      tr.innerHTML =
        '<td class="pv-table__meta">' + (idx + 1) + ' / ' + g.list.length + '</td>' +
        '<td class="pv-table__meta">' + escapeHtml(String(p.id)) + '</td>' +
        '<td class="pv-table__title">' + escapeHtml(g.titleFor(p)) + '</td>' +
        '<td></td>';
      const btnCell = tr.lastElementChild;
      const btn = document.createElement('button');
      btn.className = 'pv-btn-tiny';
      btn.textContent = 'Preview';
      btn.addEventListener('click', () => openPreview(g, idx, p));
      btnCell.appendChild(btn);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    sec.appendChild(table);
    gamesEl.appendChild(sec);
  });

  // ----- Preview iframe modal -----
  const modal      = document.querySelector('[data-modal]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalFrame = document.querySelector('[data-modal-frame]');
  const modalNewTab = document.querySelector('[data-modal-newtab]');

  function openPreview(g, idx, puzzle) {
    // The game's puzzle list cycles via dayIndex % list.length. To force puzzle
    // at index N, use day=N (so N % list.length === N for N < length).
    const url = '../../games/' + g.id + '/index.html?day=' + idx;
    modalFrame.src = url;
    modalTitle.textContent = g.label + ' · ' + g.titleFor(puzzle);
    modalNewTab.href = url;
    modal.classList.remove('hidden');
  }

  function closeModal() {
    modal.classList.add('hidden');
    modalFrame.src = 'about:blank';
  }

  document.querySelector('[data-modal-close]').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  // ===========================================================================
  // VALIDATORS — push { level, msg } into the issues array
  // ===========================================================================

  function require(obj, field, ctx, issues) {
    if (obj[field] == null || obj[field] === '') {
      issues.push({ level: 'error', msg: ctx + ': missing required field "' + field + '"' });
      return false;
    }
    return true;
  }

  function validateCrossword(p, idx, issues) {
    const ctx = 'Crossword #' + p.id;
    if (!Array.isArray(p.grid) || p.grid.length !== 5) {
      issues.push({ level: 'error', msg: ctx + ': grid must be array of 5 strings' });
      return;
    }
    p.grid.forEach((row, r) => {
      if (typeof row !== 'string' || row.length !== 5) {
        issues.push({ level: 'error', msg: ctx + ': row ' + r + ' must be a 5-char string (got "' + row + '")' });
      }
      if (!/^[A-Z.]+$/.test(row)) {
        issues.push({ level: 'error', msg: ctx + ': row ' + r + ' has non-A-Z chars (got "' + row + '")' });
      }
    });
    if (!p.clues || !p.clues.across || !p.clues.down) {
      issues.push({ level: 'error', msg: ctx + ': missing clues.across or clues.down' });
      return;
    }

    // Compute clue numbers via the same logic the engine uses
    const ROWS = 5, COLS = 5;
    const cells = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        cells.push({ ch: p.grid[r][c], isBlock: p.grid[r][c] === '.', r, c });
      }
    }
    const at = (r, c) => (r < 0 || r >= ROWS || c < 0 || c >= COLS) ? null : cells[r * COLS + c];
    const expectAcross = new Set();
    const expectDown = new Set();
    let n = 1;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = at(r, c);
        if (cell.isBlock) continue;
        const sa = (c === 0 || at(r, c - 1).isBlock) && (c + 1 < COLS && !at(r, c + 1).isBlock);
        const sd = (r === 0 || at(r - 1, c).isBlock) && (r + 1 < ROWS && !at(r + 1, c).isBlock);
        if (sa || sd) {
          if (sa) expectAcross.add(n);
          if (sd) expectDown.add(n);
          n++;
        }
      }
    }
    const gotAcross = new Set(Object.keys(p.clues.across || {}).map(Number));
    const gotDown   = new Set(Object.keys(p.clues.down || {}).map(Number));
    [...expectAcross].forEach(num => {
      if (!gotAcross.has(num)) issues.push({ level: 'error', msg: ctx + ': missing ACROSS clue #' + num });
    });
    [...gotAcross].forEach(num => {
      if (!expectAcross.has(num)) issues.push({ level: 'warn', msg: ctx + ': extra ACROSS clue #' + num + ' (no entry starts at this number)' });
    });
    [...expectDown].forEach(num => {
      if (!gotDown.has(num)) issues.push({ level: 'error', msg: ctx + ': missing DOWN clue #' + num });
    });
    [...gotDown].forEach(num => {
      if (!expectDown.has(num)) issues.push({ level: 'warn', msg: ctx + ': extra DOWN clue #' + num + ' (no entry starts at this number)' });
    });
  }

  function validateLyric(p, idx, issues) {
    const ctx = 'Lyric #' + p.id;
    require(p, 'lyric', ctx, issues);
    if (!p.show || !p.show.answer) issues.push({ level: 'error', msg: ctx + ': missing show.answer' });
    if (!p.song || !p.song.answer) issues.push({ level: 'error', msg: ctx + ': missing song.answer' });
  }

  function validateConnections(p, idx, issues) {
    const ctx = 'Connections #' + p.id;
    const constraints = (window.ConnectionsData && window.ConnectionsData.CONSTRAINTS) || {};
    const actors = (window.ConnectionsData && window.ConnectionsData.ACTORS) || [];
    if (!Array.isArray(p.rows) || p.rows.length !== 3) issues.push({ level: 'error', msg: ctx + ': rows must be array of 3 keys' });
    if (!Array.isArray(p.cols) || p.cols.length !== 3) issues.push({ level: 'error', msg: ctx + ': cols must be array of 3 keys' });
    (p.rows || []).forEach(k => { if (!constraints[k]) issues.push({ level: 'error', msg: ctx + ': unknown row constraint "' + k + '"' }); });
    (p.cols || []).forEach(k => { if (!constraints[k]) issues.push({ level: 'error', msg: ctx + ': unknown col constraint "' + k + '"' }); });

    // For each cell, count actors who satisfy both
    if (Array.isArray(p.rows) && Array.isArray(p.cols)) {
      p.rows.forEach((r, ri) => {
        p.cols.forEach((c, ci) => {
          if (!constraints[r] || !constraints[c]) return;
          const matches = actors.filter(a => constraints[r].test(a) && constraints[c].test(a));
          if (matches.length === 0) {
            issues.push({ level: 'error', msg: ctx + ': cell (' + r + ' × ' + c + ') has NO valid actor in DB' });
          } else if (matches.length < 2) {
            issues.push({ level: 'warn', msg: ctx + ': cell (' + r + ' × ' + c + ') has only 1 valid actor (' + matches[0].name + ')' });
          }
        });
      });
    }
  }

  function validateActor(p, idx, issues) {
    const ctx = 'Actor #' + p.id + ' (' + (p.name || '?') + ')';
    require(p, 'name', ctx, issues);
    require(p, 'bio', ctx, issues);
    if (!Array.isArray(p.credits) || p.credits.length !== 5) {
      issues.push({ level: 'error', msg: ctx + ': must have exactly 5 credits (got ' + (p.credits ? p.credits.length : 'none') + ')' });
    }
    if (!Array.isArray(p.aliases)) {
      issues.push({ level: 'warn', msg: ctx + ': missing aliases array (matching may be strict)' });
    }
  }

  function validateShowdown(p, idx, issues) {
    const ctx = 'Showdown #' + p.id;
    if (!Array.isArray(p.matchups) || p.matchups.length !== 5) {
      issues.push({ level: 'error', msg: ctx + ': must have exactly 5 matchups' });
      return;
    }
    p.matchups.forEach((m, i) => {
      const mctx = ctx + ' matchup ' + (i + 1);
      if (!m.prompt) issues.push({ level: 'error', msg: mctx + ': missing prompt' });
      if (!m.a || !m.b) { issues.push({ level: 'error', msg: mctx + ': missing a or b' }); return; }
      if (typeof m.a.value !== 'number' || typeof m.b.value !== 'number') {
        issues.push({ level: 'error', msg: mctx + ': a.value and b.value must be numbers' });
      }
      if (m.a.value === m.b.value) {
        issues.push({ level: 'warn', msg: mctx + ': a and b have identical values (tie — no correct answer)' });
      }
      if (!m.a.name || !m.b.name) issues.push({ level: 'error', msg: mctx + ': a.name or b.name missing' });
    });
  }

  function validateSpotlight(p, idx, issues) {
    const ctx = 'Spotlight #' + p.id;
    require(p, 'category', ctx, issues);
    if (!Array.isArray(p.clues) || p.clues.length !== 5) {
      issues.push({ level: 'error', msg: ctx + ': must have exactly 5 clues (got ' + (p.clues ? p.clues.length : 'none') + ')' });
      return;
    }
    const seenAnswers = new Set();
    p.clues.forEach((c, i) => {
      const cctx = ctx + ' clue ' + (i + 1);
      if (!c.clue) issues.push({ level: 'error', msg: cctx + ': missing clue text' });
      if (!c.answer) issues.push({ level: 'error', msg: cctx + ': missing answer' });
      if (c.answer) {
        const norm = c.answer.toLowerCase().trim();
        if (seenAnswers.has(norm)) {
          issues.push({ level: 'warn', msg: cctx + ': duplicate answer "' + c.answer + '" within this category' });
        }
        seenAnswers.add(norm);
      }
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
})();
