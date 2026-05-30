(function () {
  'use strict';

  const ROWS = 5, COLS = 5;
  const dayNum = Marquee.dayIndex();
  const puzzle = Marquee.pickFromList(window.CrosswordPuzzles, dayNum);

  Marquee.renderGameHeader({ title: 'Mini Crossword', dayNum: dayNum });
  document.querySelector('[data-puzzle-title]').textContent = puzzle.title || '';

  // Build cell model
  const cells = [];           // 5x5 of { r, c, sol, isBlock, num?, entries: {across?, down?} }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ch = puzzle.grid[r][c];
      cells.push({
        r, c,
        sol: ch === '.' ? null : ch,
        isBlock: ch === '.',
        num: null,
        entries: {}
      });
    }
  }
  const cellAt = (r, c) => (r < 0 || r >= ROWS || c < 0 || c >= COLS) ? null : cells[r * COLS + c];

  // Assign numbers + entries
  const entries = { across: {}, down: {} };
  let nextNum = 1;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = cellAt(r, c);
      if (cell.isBlock) continue;
      const startsAcross = (c === 0 || cellAt(r, c - 1).isBlock) && (c + 1 < COLS && !cellAt(r, c + 1).isBlock);
      const startsDown   = (r === 0 || cellAt(r - 1, c).isBlock) && (r + 1 < ROWS && !cellAt(r + 1, c).isBlock);
      if (startsAcross || startsDown) {
        cell.num = nextNum;
        if (startsAcross) {
          const ent = { num: nextNum, dir: 'across', cells: [] };
          for (let cc = c; cc < COLS && !cellAt(r, cc).isBlock; cc++) ent.cells.push(cellAt(r, cc));
          entries.across[nextNum] = ent;
          ent.cells.forEach(cl => cl.entries.across = nextNum);
        }
        if (startsDown) {
          const ent = { num: nextNum, dir: 'down', cells: [] };
          for (let rr = r; rr < ROWS && !cellAt(rr, c).isBlock; rr++) ent.cells.push(cellAt(rr, c));
          entries.down[nextNum] = ent;
          ent.cells.forEach(cl => cl.entries.down = nextNum);
        }
        nextNum++;
      }
    }
  }

  // Restore in-progress entries
  const saved = Marquee.loadGameState('crossword');
  const userLetters = (saved.letters && saved.puzzleId === puzzle.id) ? saved.letters.slice() : cells.map(c => c.isBlock ? null : '');
  const revealedSet = new Set((saved.revealed && saved.puzzleId === puzzle.id) ? saved.revealed : []);

  // State: cursor
  let cursor = firstNonBlock();
  let direction = 'across'; // 'across' or 'down'

  function firstNonBlock() {
    for (const c of cells) if (!c.isBlock) return c;
    return null;
  }

  // ----- Render -----
  const gridEl = document.querySelector('[data-grid]');
  function renderGrid() {
    gridEl.innerHTML = '';
    cells.forEach((cell, idx) => {
      if (cell.isBlock) {
        const d = document.createElement('div');
        d.className = 'xword-cell xword-cell--block';
        d.setAttribute('aria-hidden', 'true');
        gridEl.appendChild(d);
        return;
      }
      const el = document.createElement('div');
      el.className = 'xword-cell';
      el.dataset.r = cell.r;
      el.dataset.c = cell.c;
      el.setAttribute('role', 'gridcell');

      if (cell.num) {
        const n = document.createElement('span');
        n.className = 'xword-cell__num';
        n.textContent = cell.num;
        el.appendChild(n);
      }
      const letter = document.createElement('span');
      letter.className = 'xword-cell__letter';
      letter.textContent = userLetters[idx] || '';
      el.appendChild(letter);

      if (revealedSet.has(idx)) el.classList.add('xword-cell--revealed');

      el.addEventListener('click', () => onCellClick(cell));
      gridEl.appendChild(el);
    });
    applyCursor();
  }

  function applyCursor() {
    gridEl.querySelectorAll('.xword-cell').forEach(el => {
      el.classList.remove('xword-cell--active', 'xword-cell--highlight');
    });
    if (!cursor) return;
    const activeEntryNum = cursor.entries[direction];
    if (activeEntryNum != null) {
      const ent = entries[direction][activeEntryNum];
      ent.cells.forEach(c => {
        const el = gridEl.children[c.r * COLS + c.c];
        if (el) el.classList.add('xword-cell--highlight');
      });
    }
    const activeEl = gridEl.children[cursor.r * COLS + cursor.c];
    if (activeEl) activeEl.classList.add('xword-cell--active');

    // Update current clue display
    const curEl = document.querySelector('[data-current-clue]');
    if (activeEntryNum != null) {
      const clueText = (puzzle.clues[direction] && puzzle.clues[direction][activeEntryNum]) || '';
      curEl.querySelector('.xword-current__dir').textContent = activeEntryNum + ' ' + direction.toUpperCase();
      curEl.querySelector('.xword-current__text').textContent = clueText;
    } else {
      curEl.querySelector('.xword-current__dir').textContent = '—';
      curEl.querySelector('.xword-current__text').textContent = '';
    }
    highlightClueList();
    focusHidden();
  }

  // ----- Clue lists -----
  function renderClues() {
    const acrossEl = document.querySelector('[data-across-list]');
    const downEl = document.querySelector('[data-down-list]');
    function buildList(list, dir, target) {
      target.innerHTML = '';
      Object.keys(list).map(Number).sort((a,b)=>a-b).forEach(num => {
        const li = document.createElement('li');
        li.dataset.num = num;
        li.dataset.dir = dir;
        const clue = (puzzle.clues[dir] && puzzle.clues[dir][num]) || '';
        li.innerHTML = '<b>' + num + '.</b>' + clue;
        li.addEventListener('click', () => {
          const ent = entries[dir][num];
          cursor = ent.cells[0];
          direction = dir;
          applyCursor();
        });
        target.appendChild(li);
      });
    }
    buildList(entries.across, 'across', acrossEl);
    buildList(entries.down, 'down', downEl);
  }

  function highlightClueList() {
    document.querySelectorAll('.xword-clues li').forEach(li => {
      li.classList.remove('is-active');
      const num = +li.dataset.num;
      const dir = li.dataset.dir;
      const ent = entries[dir][num];
      const done = ent && ent.cells.every(c => userLetters[c.r * COLS + c.c] && userLetters[c.r * COLS + c.c] === c.sol);
      li.classList.toggle('is-done', !!done);
    });
    if (!cursor) return;
    const num = cursor.entries[direction];
    if (num == null) return;
    const li = document.querySelector('.xword-clues li[data-num="' + num + '"][data-dir="' + direction + '"]');
    if (li) li.classList.add('is-active');
  }

  // ----- Input handling -----
  const hidden = document.querySelector('[data-hidden-input]');
  function focusHidden() {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      hidden.focus({ preventScroll: true });
    }
  }

  function onCellClick(cell) {
    if (cell.isBlock) return;
    if (cursor === cell) {
      // Toggle direction if both available
      const other = direction === 'across' ? 'down' : 'across';
      if (cell.entries[other] != null) direction = other;
    } else {
      cursor = cell;
      // Prefer current direction if available, else flip
      if (cell.entries[direction] == null) {
        direction = direction === 'across' ? 'down' : 'across';
      }
    }
    applyCursor();
  }

  function advance(dir) {
    if (!cursor) return;
    const ent = entries[direction][cursor.entries[direction]];
    if (!ent) return;
    const i = ent.cells.indexOf(cursor);
    const next = ent.cells[i + dir];
    if (next) cursor = next;
  }

  function typeLetter(ch) {
    if (!cursor || cursor.isBlock) return;
    const idx = cursor.r * COLS + cursor.c;
    if (revealedSet.has(idx)) { advance(1); applyCursor(); return; }
    userLetters[idx] = ch.toUpperCase();
    const letterEl = gridEl.children[idx].querySelector('.xword-cell__letter');
    if (letterEl) letterEl.textContent = userLetters[idx];
    gridEl.children[idx].classList.remove('xword-cell--wrong');
    advance(1);
    persist();
    applyCursor();
    checkComplete();
  }

  function backspace() {
    if (!cursor) return;
    const idx = cursor.r * COLS + cursor.c;
    if (userLetters[idx]) {
      userLetters[idx] = '';
      gridEl.children[idx].querySelector('.xword-cell__letter').textContent = '';
      gridEl.children[idx].classList.remove('xword-cell--wrong');
    } else {
      advance(-1);
      const i2 = cursor.r * COLS + cursor.c;
      userLetters[i2] = '';
      const lEl = gridEl.children[i2].querySelector('.xword-cell__letter');
      if (lEl) lEl.textContent = '';
      gridEl.children[i2].classList.remove('xword-cell--wrong');
    }
    persist();
    applyCursor();
  }

  function moveArrow(dr, dc) {
    if (!cursor) return;
    let r = cursor.r + dr, c = cursor.c + dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      const t = cellAt(r, c);
      if (t && !t.isBlock) { cursor = t; applyCursor(); return; }
      r += dr; c += dc;
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[a-zA-Z]$/.test(e.key)) { typeLetter(e.key); e.preventDefault(); return; }
    if (e.key === 'Backspace') { backspace(); e.preventDefault(); return; }
    if (e.key === ' ') {
      direction = direction === 'across' ? 'down' : 'across';
      if (cursor && cursor.entries[direction] == null) direction = direction === 'across' ? 'down' : 'across';
      applyCursor(); e.preventDefault(); return;
    }
    if (e.key === 'ArrowRight') { moveArrow(0, 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft')  { moveArrow(0, -1); e.preventDefault(); }
    if (e.key === 'ArrowDown')  { moveArrow(1, 0); e.preventDefault(); }
    if (e.key === 'ArrowUp')    { moveArrow(-1, 0); e.preventDefault(); }
    if (e.key === 'Tab') {
      direction = direction === 'across' ? 'down' : 'across';
      if (cursor && cursor.entries[direction] == null) direction = direction === 'across' ? 'down' : 'across';
      applyCursor(); e.preventDefault();
    }
  });

  hidden.addEventListener('input', (e) => {
    const v = e.target.value;
    if (v && /^[a-zA-Z]$/.test(v[v.length - 1])) typeLetter(v[v.length - 1]);
    e.target.value = '';
  });

  // ----- Actions -----
  document.querySelector('[data-action="check"]').addEventListener('click', () => {
    if (!cursor) return;
    const idx = cursor.r * COLS + cursor.c;
    const ch = userLetters[idx];
    if (!ch) return;
    if (ch !== cursor.sol) gridEl.children[idx].classList.add('xword-cell--wrong');
    else gridEl.children[idx].classList.remove('xword-cell--wrong');
  });

  document.querySelector('[data-action="reveal"]').addEventListener('click', () => {
    if (!cursor) return;
    const idx = cursor.r * COLS + cursor.c;
    userLetters[idx] = cursor.sol;
    revealedSet.add(idx);
    const cEl = gridEl.children[idx];
    cEl.querySelector('.xword-cell__letter').textContent = cursor.sol;
    cEl.classList.add('xword-cell--revealed');
    cEl.classList.remove('xword-cell--wrong');
    persist();
    applyCursor();
    checkComplete();
  });

  document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    if (!confirm('Clear your entries? Revealed letters stay.')) return;
    cells.forEach((c, i) => {
      if (c.isBlock || revealedSet.has(i)) return;
      userLetters[i] = '';
      const el = gridEl.children[i];
      el.querySelector('.xword-cell__letter').textContent = '';
      el.classList.remove('xword-cell--wrong');
    });
    persist();
  });

  // ----- Save / completion -----
  function persist() {
    Marquee.saveGameState('crossword', {
      puzzleId: puzzle.id,
      letters: userLetters,
      revealed: Array.from(revealedSet)
    });
  }

  function checkComplete() {
    const done = cells.every((c, i) => c.isBlock || userLetters[i] === c.sol);
    if (!done) return;
    if (saved.solved && saved.puzzleId === puzzle.id) return;
    Marquee.saveGameState('crossword', {
      puzzleId: puzzle.id,
      letters: userLetters,
      revealed: Array.from(revealedSet),
      solved: true,
      revealedCount: revealedSet.size
    });
    showResult();
  }

  function showResult() {
    const res = document.querySelector('[data-result]');
    res.classList.remove('hidden');
    const streak = Marquee.getStreak('crossword');
    const revealedCount = revealedSet.size;
    const score = revealedCount === 0 ? 'Solo solve' : revealedCount + ' revealed';
    const title = Marquee.titleFor('crossword', Marquee.loadGameState('crossword'));
    const badgeHtml = title ? '<div class="result__badge result__badge--' + title.tier + '">' + title.name + '</div>' : '';
    res.innerHTML =
      '<div class="result">' +
        '<div class="bulbs" style="margin: 0 auto 1rem; max-width: 240px"></div>' +
        '<div class="result__title">Solved!</div>' +
        badgeHtml +
        '<div class="result__sub">' + score + ' · ' + streak.current + '-day streak</div>' +
        '<div class="result__share-text" data-share></div>' +
        '<button class="btn btn--sm" data-share-btn>Copy result</button>' +
      '</div>';
    const shareLines = [
      title ? '✦ ' + title.name : null,
      '⬜ ' + (revealedCount === 0 ? 'Clean grid' : revealedCount + ' assist' + (revealedCount === 1 ? '' : 's'))
    ].filter(Boolean);
    Marquee.flourishResult('crossword');

    const shareTxt = Marquee.shareText('Mini Crossword', dayNum, shareLines);
    res.querySelector('[data-share]').textContent = shareTxt;
    res.querySelector('[data-share-btn]').addEventListener('click', async (e) => {
      const ok = await Marquee.copyToClipboard(shareTxt);
      e.target.textContent = ok ? 'Copied!' : 'Copy failed';
      setTimeout(() => { e.target.textContent = 'Copy result'; }, 1800);
    });
  }

  // ----- Boot -----
  renderGrid();
  renderClues();
  applyCursor();
  if (saved.solved && saved.puzzleId === puzzle.id) showResult();
})();
