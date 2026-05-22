(function () {
  'use strict';

  const dayNum = Marquee.dayIndex();
  const { ACTORS, CONSTRAINTS, PUZZLES } = window.ConnectionsData;
  const puzzle = Marquee.pickFromList(PUZZLES, dayNum);

  Marquee.renderGameHeader({ title: 'Connections', dayNum: dayNum });

  // ----- Restore state -----
  // state.cells[i] is one of:
  //   null               — untouched
  //   { actor: name }    — filled (correct)
  //   { skipped: true }  — skipped by user
  const saved = Marquee.loadGameState('connections');
  const fresh = !saved.puzzleId || saved.puzzleId !== puzzle.id;
  const state = fresh
    ? {
        puzzleId: puzzle.id,
        cells: Array(9).fill(null),
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

  function isFilled(cell)  { return cell && cell.actor; }
  function isSkipped(cell) { return cell && cell.skipped; }
  function isResolved(cell){ return cell !== null; }

  function namesUsed() {
    return new Set(state.cells.filter(isFilled).map(c => c.actor));
  }

  function allResolved() {
    return state.cells.every(isResolved);
  }

  // ----- Rendering -----
  const boardEl = document.querySelector('[data-board]');
  function renderBoard() {
    boardEl.innerHTML = '';

    const corner = document.createElement('div');
    corner.className = 'cx-corner';
    boardEl.appendChild(corner);

    puzzle.cols.forEach((col) => {
      const h = document.createElement('div');
      h.className = 'cx-header cx-header--col';
      h.textContent = constraintLabel(col);
      boardEl.appendChild(h);
    });

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
        const data = state.cells[idx];
        if (isFilled(data)) {
          cell.classList.add('cx-cell--filled');
          cell.innerHTML = '<div class="cx-cell__name">' + escapeHtml(data.actor) + '</div>';
        } else if (isSkipped(data)) {
          cell.classList.add('cx-cell--skipped');
          cell.innerHTML = '<div class="cx-cell__placeholder">skipped</div>';
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
    const filled = state.cells.filter(isFilled).length;
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
  const autocompleteEl = document.querySelector('[data-autocomplete]');
  let activeCellIdx = -1;
  let acHighlight = -1; // currently-highlighted autocomplete suggestion

  function openModal(idx) {
    activeCellIdx = idx;
    const r = puzzle.rows[Math.floor(idx / 3)];
    const c = puzzle.cols[idx % 3];
    modalTitle.textContent = constraintLabel(r) + '  ×  ' + constraintLabel(c);
    modalInput.value = '';
    modalMsg.textContent = '';
    modalMsg.className = 'cx-modal__msg';
    autocompleteEl.classList.add('hidden');
    acHighlight = -1;
    modal.classList.remove('hidden');
    setTimeout(() => modalInput.focus(), 30);
  }

  function closeModal() {
    modal.classList.add('hidden');
    autocompleteEl.classList.add('hidden');
    activeCellIdx = -1;
  }

  // ----- Autocomplete -----
  function renderAutocomplete() {
    const q = normalize(modalInput.value);
    if (!q || q.length < 1) {
      autocompleteEl.classList.add('hidden');
      autocompleteEl.innerHTML = '';
      acHighlight = -1;
      return;
    }
    const used = namesUsed();
    const matches = ACTORS
      .map(a => {
        const n = normalize(a.name);
        const aliases = (a.aliases || []).map(normalize);
        const allCandidates = [n, ...aliases];
        // Best-match score: 2 = starts with, 1 = contains, 0 = no match
        let best = 0;
        for (const cand of allCandidates) {
          if (cand.startsWith(q)) { best = Math.max(best, 2); }
          else if (cand.includes(q)) { best = Math.max(best, 1); }
        }
        return { actor: a, score: best };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    if (!matches.length) {
      autocompleteEl.classList.add('hidden');
      autocompleteEl.innerHTML = '';
      acHighlight = -1;
      return;
    }

    autocompleteEl.innerHTML = matches.map((m, i) => {
      const usedClass = used.has(m.actor.name) ? ' cx-autocomplete__item--used' : '';
      return '<li class="cx-autocomplete__item' + usedClass + '" role="option" data-ac-idx="' + i + '" data-ac-name="' + escapeHtml(m.actor.name) + '">' +
                '<span class="cx-autocomplete__name">' + escapeHtml(m.actor.name) + '</span>' +
                (used.has(m.actor.name) ? '<span class="cx-autocomplete__used">used</span>' : '') +
             '</li>';
    }).join('');
    autocompleteEl.classList.remove('hidden');
    acHighlight = -1;
    autocompleteEl.querySelectorAll('.cx-autocomplete__item').forEach(li => {
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        modalInput.value = li.dataset.acName;
        autocompleteEl.classList.add('hidden');
        modalInput.focus();
      });
    });
  }

  function moveAcHighlight(delta) {
    const items = autocompleteEl.querySelectorAll('.cx-autocomplete__item');
    if (!items.length) return;
    acHighlight = (acHighlight + delta + items.length) % items.length;
    items.forEach((li, i) => li.classList.toggle('is-highlighted', i === acHighlight));
    items[acHighlight].scrollIntoView({ block: 'nearest' });
  }

  function pickHighlightedAc() {
    const items = autocompleteEl.querySelectorAll('.cx-autocomplete__item');
    if (acHighlight < 0 || acHighlight >= items.length) return false;
    modalInput.value = items[acHighlight].dataset.acName;
    autocompleteEl.classList.add('hidden');
    return true;
  }

  modalInput.addEventListener('input', renderAutocomplete);
  modalInput.addEventListener('focus', renderAutocomplete);

  // ----- Submit / skip -----
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
      modalMsg.textContent = "You've already used " + actor.name + '.';
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
    if (allResolved()) finish(false);
  }

  function skipCell() {
    if (activeCellIdx < 0) return;
    state.cells[activeCellIdx] = { skipped: true };
    persist();
    closeModal();
    renderBoard();
    renderStats();
    if (allResolved()) finish(false);
  }

  // ----- Finish -----
  function finish(gaveUp) {
    state.gaveUp = !!gaveUp;
    const filled = state.cells.filter(isFilled).length;
    const solved = filled === 9 && !gaveUp;
    Marquee.saveGameState('connections', Object.assign({}, state, { solved }));
    renderBoard();
    renderStats();
    showResult();
  }

  function showResult() {
    const res = document.querySelector('[data-result]');
    res.classList.remove('hidden');
    const filled = state.cells.filter(isFilled).length;
    const skipped = state.cells.filter(isSkipped).length;
    const streak = Marquee.getStreak('connections');
    const headline = (filled === 9 && !state.gaveUp) ? 'Full house.' :
                     filled >= 6                     ? 'Curtain.' :
                                                       'Better luck tomorrow.';
    const subline = filled + ' of 9 filled' +
      (skipped ? ' · ' + skipped + ' skipped' : '') +
      ' · ' + state.guesses + ' guess' + (state.guesses === 1 ? '' : 'es') +
      (streak.current ? ' · ' + streak.current + '-day streak' : '');

    const emoji = [];
    for (let r = 0; r < 3; r++) {
      let row = '';
      for (let c = 0; c < 3; c++) {
        const cell = state.cells[r * 3 + c];
        row += isFilled(cell) ? '🟩' : isSkipped(cell) ? '🟨' : '⬜';
      }
      emoji.push(row);
    }
    const title = Marquee.titleFor('connections', Marquee.loadGameState('connections'));
    const badgeHtml = title ? '<div class="result__badge result__badge--' + title.tier + '">' + title.name + '</div>' : '';

    res.innerHTML =
      '<div class="result">' +
        '<div class="bulbs" style="margin: 0 auto 1rem; max-width: 240px"></div>' +
        '<div class="result__title">' + headline + '</div>' +
        badgeHtml +
        '<div class="result__sub">' + subline + '</div>' +
        '<div class="result__share-text" data-share></div>' +
        '<button class="btn btn--sm" data-share-btn>Copy result</button>' +
      '</div>';

    const shareLines = [
      title ? '✦ ' + title.name : null,
      filled + '/9 · ' + state.guesses + (state.guesses === 1 ? ' guess' : ' guesses'),
      ''
    ].filter(l => l !== null).concat(emoji);
    const shareTxt = Marquee.shareText('Connections', dayNum, shareLines);
    res.querySelector('[data-share]').textContent = shareTxt;
    res.querySelector('[data-share-btn]').addEventListener('click', async (e) => {
      const ok = await Marquee.copyToClipboard(shareTxt);
      e.target.textContent = ok ? 'Copied!' : 'Copy failed';
      setTimeout(() => { e.target.textContent = 'Copy result'; }, 1800);
    });
  }

  function persist() {
    Marquee.saveGameState('connections', Object.assign({}, state, {
      solved: state.cells.filter(isFilled).length === 9 && !state.gaveUp
    }));
  }

  // ----- Wire events -----
  document.querySelector('[data-modal-submit]').addEventListener('click', submitModal);
  document.querySelector('[data-modal-cancel]').addEventListener('click', closeModal);
  document.querySelector('[data-modal-skip]').addEventListener('click', skipCell);

  modalInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { moveAcHighlight(1); e.preventDefault(); return; }
    if (e.key === 'ArrowUp')   { moveAcHighlight(-1); e.preventDefault(); return; }
    if (e.key === 'Enter') {
      if (!autocompleteEl.classList.contains('hidden')) {
        if (pickHighlightedAc()) { e.preventDefault(); return; }
      }
      submitModal(); e.preventDefault(); return;
    }
    if (e.key === 'Escape') {
      if (!autocompleteEl.classList.contains('hidden')) {
        autocompleteEl.classList.add('hidden');
      } else {
        closeModal();
      }
    }
  });

  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  document.querySelector('[data-giveup]').addEventListener('click', () => {
    if (allResolved()) return;
    if (!confirm('Give up the rest? Unresolved cells will count as empty.')) return;
    finish(true);
  });

  // ----- Boot -----
  renderBoard();
  renderStats();
  if (allResolved() || state.gaveUp) showResult();
})();
