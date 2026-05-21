(function () {
  'use strict';

  const dayNum = Marquee.dayIndex();
  const { ACTORS, CONSTRAINTS, PUZZLES } = window.ConnectionsData;
  const puzzle = Marquee.pickFromList(PUZZLES, dayNum);

  Marquee.renderGameHeader({ title: 'Connections', dayNum: dayNum });

  // ----- Restore state -----
  const saved = Marquee.loadGameState('connections');
  const fresh = !saved.puzzleId || saved.puzzleId !== puzzle.id;
  const state = fresh
    ? {
        puzzleId: puzzle.id,
        cells: Array(9).fill(null),  // each: { actor: name } when filled correctly
        guesses: 0,
        gaveUp: false
      }
    : Object.assign({ guesses: 0, gaveUp: false, cells: Array(9).fill(null) }, saved);

  // ----- Lookup helpers -----
  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[‘’']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function findActor(input) {
    const n = normalize(input);
    if (!n) return null;
    return ACTORS.find(a => {
      if (normalize(a.name) === n) return true;
      return (a.aliases || []).some(al => normalize(al) === n);
    }) || null;
  }

  function constraintLabel(key) { return CONSTRAINTS[key] ? CONSTRAINTS[key].label : key; }
  function constraintTest(key)  { return CONSTRAINTS[key].test; }

  function namesUsed() {
    return new Set(state.cells.filter(Boolean).map(c => c.actor));
  }

  function allFilled() {
    return state.cells.every(c => c !== null);
  }

  // ----- Rendering -----
  const boardEl = document.querySelector('[data-board]');
  function renderBoard() {
    boardEl.innerHTML = '';

    // Top-left empty corner
    const corner = document.createElement('div');
    corner.className = 'cx-corner';
    boardEl.appendChild(corner);

    // Column headers
    puzzle.cols.forEach((col) => {
      const h = document.createElement('div');
      h.className = 'cx-header cx-header--col';
      h.textContent = constraintLabel(col);
      boardEl.appendChild(h);
    });

    // 3 rows of: row-header + 3 cells
    puzzle.rows.forEach((row, rIdx) => {
      const rowH = document.createElement('div');
      rowH.className = 'cx-header cx-header--row';
      rowH.textContent = constraintLabel(row);
      boardEl.appendChild(rowH);

      puzzle.cols.forEach((col, cIdx) => {
        const idx = rIdx * 3 + cIdx;
        const cell = document.createElement('div');
        cell.className = 'cx-cell';
        cell.dataset.idx = idx;
        const filled = state.cells[idx];
        if (filled) {
          cell.classList.add('cx-cell--filled');
          cell.innerHTML = '<div class="cx-cell__name">' + escapeHtml(filled.actor) + '</div>';
        } else if (state.gaveUp) {
          cell.innerHTML = '<div class="cx-cell__placeholder">—</div>';
          cell.style.cursor = 'default';
        } else {
          cell.innerHTML = '<div class="cx-cell__placeholder">tap to fill</div>';
          cell.addEventListener('click', () => openModal(idx));
        }
        boardEl.appendChild(cell);
      });
    });
  }

  function renderStats() {
    const filled = state.cells.filter(Boolean).length;
    document.querySelector('[data-filled]').textContent = filled;
    document.querySelector('[data-guesses]').textContent = state.guesses;
    document.querySelector('[data-guess-plural]').textContent = state.guesses === 1 ? '' : 'es';
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ----- Modal -----
  const modal = document.querySelector('[data-modal]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalInput = document.querySelector('[data-modal-input]');
  const modalMsg = document.querySelector('[data-modal-msg]');
  let activeCellIdx = -1;

  function openModal(idx) {
    activeCellIdx = idx;
    const r = puzzle.rows[Math.floor(idx / 3)];
    const c = puzzle.cols[idx % 3];
    modalTitle.textContent = constraintLabel(r) + '  ×  ' + constraintLabel(c);
    modalInput.value = '';
    modalMsg.textContent = '';
    modalMsg.className = 'cx-modal__msg';
    modal.classList.remove('hidden');
    setTimeout(() => modalInput.focus(), 30);
  }

  function closeModal() {
    modal.classList.add('hidden');
    activeCellIdx = -1;
  }

  function submitModal() {
    if (activeCellIdx < 0) return;
    const text = modalInput.value.trim();
    if (!text) return;

    state.guesses++;
    const actor = findActor(text);

    if (!actor) {
      modalMsg.className = 'cx-modal__msg cx-modal__msg--error';
      modalMsg.textContent = 'Not in our database yet. Try another name.';
      persist();
      renderStats();
      return;
    }

    if (namesUsed().has(actor.name)) {
      modalMsg.className = 'cx-modal__msg cx-modal__msg--error';
      modalMsg.textContent = 'You\'ve already used ' + actor.name + '.';
      persist();
      renderStats();
      return;
    }

    const r = puzzle.rows[Math.floor(activeCellIdx / 3)];
    const c = puzzle.cols[activeCellIdx % 3];
    const ok = constraintTest(r)(actor) && constraintTest(c)(actor);
    if (!ok) {
      modalMsg.className = 'cx-modal__msg cx-modal__msg--error';
      modalMsg.textContent = actor.name + " doesn't satisfy both constraints.";
      persist();
      renderStats();
      return;
    }

    state.cells[activeCellIdx] = { actor: actor.name };
    persist();
    closeModal();
    renderBoard();
    renderStats();
    if (allFilled()) finish(false);
  }

  // ----- Finish -----
  function finish(gaveUp) {
    state.gaveUp = !!gaveUp;
    const filled = state.cells.filter(Boolean).length;
    const solved = filled === 9 && !gaveUp;
    Marquee.saveGameState('connections', Object.assign({}, state, { solved }));
    renderBoard();
    renderStats();
    showResult();
  }

  function showResult() {
    const res = document.querySelector('[data-result]');
    res.classList.remove('hidden');
    const filled = state.cells.filter(Boolean).length;
    const streak = Marquee.getStreak('connections');
    const headline = (filled === 9 && !state.gaveUp) ? 'Full house.' : 'Curtain.';
    const subline  = filled + ' of 9 · ' + state.guesses + ' guess' + (state.guesses === 1 ? '' : 'es') +
                     (streak.current ? ' · ' + streak.current + '-day streak' : '');
    // Build emoji grid: green for filled, white for empty
    const emoji = [];
    for (let r = 0; r < 3; r++) {
      let row = '';
      for (let c = 0; c < 3; c++) {
        row += state.cells[r * 3 + c] ? '🟩' : '⬜';
      }
      emoji.push(row);
    }
    res.innerHTML =
      '<div class="result">' +
        '<div class="bulbs" style="margin: 0 auto 1rem; max-width: 240px"></div>' +
        '<div class="result__title">' + headline + '</div>' +
        '<div class="result__sub">' + subline + '</div>' +
        '<div class="result__share-text" data-share></div>' +
        '<button class="btn btn--sm" data-share-btn>Copy result</button>' +
      '</div>';

    const shareTxt = Marquee.shareText('Connections', dayNum, [
      filled + '/9 · ' + state.guesses + (state.guesses === 1 ? ' guess' : ' guesses'),
      ''
    ].concat(emoji));
    res.querySelector('[data-share]').textContent = shareTxt;
    res.querySelector('[data-share-btn]').addEventListener('click', async (e) => {
      const ok = await Marquee.copyToClipboard(shareTxt);
      e.target.textContent = ok ? 'Copied!' : 'Copy failed';
      setTimeout(() => { e.target.textContent = 'Copy result'; }, 1800);
    });
  }

  function persist() {
    Marquee.saveGameState('connections', Object.assign({}, state, {
      solved: allFilled() && !state.gaveUp
    }));
  }

  // ----- Wire events -----
  document.querySelector('[data-modal-submit]').addEventListener('click', submitModal);
  document.querySelector('[data-modal-cancel]').addEventListener('click', closeModal);
  modalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  { submitModal(); e.preventDefault(); }
    if (e.key === 'Escape') { closeModal(); }
  });
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.querySelector('[data-giveup]').addEventListener('click', () => {
    if (allFilled()) return;
    if (!confirm('Give up and reveal your result?')) return;
    finish(true);
  });

  // ----- Boot -----
  renderBoard();
  renderStats();
  if (allFilled() || state.gaveUp) showResult();
})();
