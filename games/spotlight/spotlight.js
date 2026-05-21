(function () {
  'use strict';

  const dayNum = Marquee.dayIndex();
  const puzzle = Marquee.pickFromList(window.SpotlightPuzzles, dayNum);
  const TOTAL = puzzle.clues.length;

  Marquee.renderGameHeader({ title: 'Spotlight', dayNum: dayNum });
  document.querySelector('[data-category]').textContent = puzzle.category;
  document.querySelector('[data-total]').textContent = TOTAL;

  // ----- State -----
  // per-clue: { status: 'pending'|'correct'|'revealed', attempts: number }
  const saved = Marquee.loadGameState('spotlight');
  const fresh = !saved.puzzleId || saved.puzzleId !== puzzle.id;
  const state = fresh
    ? {
        puzzleId: puzzle.id,
        clues: puzzle.clues.map(() => ({ status: 'pending', attempts: 0 }))
      }
    : Object.assign({ clues: puzzle.clues.map(() => ({ status: 'pending', attempts: 0 })) }, saved);

  // Defensive: ensure clues array matches puzzle length
  if (!Array.isArray(state.clues) || state.clues.length !== TOTAL) {
    state.clues = puzzle.clues.map(() => ({ status: 'pending', attempts: 0 }));
  }

  // ----- Helpers -----
  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[‘’']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/^the\s+/, '');
  }

  function checkAnswer(input, clueIdx) {
    const n = normalize(input);
    if (!n) return false;
    const c = puzzle.clues[clueIdx];
    if (normalize(c.answer) === n) return true;
    return (c.aliases || []).some(a => normalize(a) === n);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function allResolved() {
    return state.clues.every(c => c.status !== 'pending');
  }

  function correctCount() {
    return state.clues.filter(c => c.status === 'correct').length;
  }

  // ----- Render -----
  const cluesEl = document.querySelector('[data-clues]');
  function renderClues() {
    cluesEl.innerHTML = '';
    puzzle.clues.forEach((clue, i) => {
      const s = state.clues[i];
      const li = document.createElement('li');
      li.className = 'sp-clue';
      if (s.status === 'correct') li.classList.add('sp-clue--correct');
      else if (s.status === 'revealed') li.classList.add('sp-clue--revealed');

      const body = '<div class="sp-clue__body">' + escapeHtml(clue.clue) + '</div>';

      let inputBlock = '';
      if (s.status === 'pending') {
        inputBlock =
          '<div class="sp-clue__input-row">' +
            '<input class="input" data-clue-input="' + i + '" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Your answer…">' +
            '<button class="btn btn--sm" data-clue-submit="' + i + '">Guess</button>' +
          '</div>' +
          '<div class="sp-clue__reveal-row">' +
            '<span class="sp-clue__hint" data-clue-hint="' + i + '"></span>' +
            '<button class="btn btn--ghost btn--sm" data-clue-reveal="' + i + '">Reveal</button>' +
          '</div>';
      } else {
        inputBlock =
          '<div class="sp-clue__answer">' +
            '<span class="sp-clue__answer-label">' + (s.status === 'correct' ? 'You got it' : 'Answer') + '</span>' +
            escapeHtml(clue.answer) +
          '</div>';
      }

      li.innerHTML = body + inputBlock;
      cluesEl.appendChild(li);
    });

    // Wire events for pending clues
    state.clues.forEach((s, i) => {
      if (s.status !== 'pending') return;
      const inp = document.querySelector('[data-clue-input="' + i + '"]');
      const sub = document.querySelector('[data-clue-submit="' + i + '"]');
      const rev = document.querySelector('[data-clue-reveal="' + i + '"]');
      sub.addEventListener('click', () => submitClue(i));
      rev.addEventListener('click', () => revealClue(i));
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitClue(i); });
    });
  }

  function renderProgress() {
    document.querySelector('[data-correct]').textContent = correctCount();
  }

  function submitClue(i) {
    const inp = document.querySelector('[data-clue-input="' + i + '"]');
    if (!inp) return;
    const text = (inp.value || '').trim();
    if (!text) return;

    const s = state.clues[i];
    s.attempts++;
    const correct = checkAnswer(text, i);

    if (correct) {
      s.status = 'correct';
      persist();
      renderClues();
      renderProgress();
      if (allResolved()) finish();
    } else {
      const hintEl = document.querySelector('[data-clue-hint="' + i + '"]');
      if (hintEl) {
        hintEl.classList.add('sp-clue__hint--error');
        hintEl.textContent = 'Not it — try again or reveal.';
      }
      inp.value = '';
      inp.focus();
      persist();
    }
  }

  function revealClue(i) {
    const s = state.clues[i];
    if (s.status !== 'pending') return;
    if (!confirm('Reveal this answer? You won\'t get credit for it.')) return;
    s.status = 'revealed';
    persist();
    renderClues();
    renderProgress();
    if (allResolved()) finish();
  }

  // ----- Save / finish -----
  function persist() {
    const solved = allResolved() && correctCount() === TOTAL;
    Marquee.saveGameState('spotlight', Object.assign({}, state, { solved }));
  }

  function finish() {
    const correct = correctCount();
    const solved = correct === TOTAL;
    Marquee.saveGameState('spotlight', Object.assign({}, state, { solved }));
    showResult();
  }

  function showResult() {
    const res = document.querySelector('[data-result]');
    res.classList.remove('hidden');
    const correct = correctCount();
    const streak = Marquee.getStreak('spotlight');
    const headline = correct === TOTAL ? 'Sweep.' :
                     correct >= 3      ? 'Curtain.' :
                                         'Better luck tomorrow.';
    const sub = correct + ' / ' + TOTAL +
                (streak.current ? ' · ' + streak.current + '-day streak' : '');

    // ✅ first-try, 🟨 multiple attempts, ❌ revealed
    const slots = state.clues.map(c => {
      if (c.status === 'correct') return c.attempts <= 1 ? '✅' : '🟨';
      return '❌';
    }).join('');

    res.innerHTML =
      '<div class="result" style="margin-top: 1.4rem">' +
        '<div class="bulbs" style="margin: 0 auto 1rem; max-width: 240px"></div>' +
        '<div class="result__title">' + headline + '</div>' +
        '<div class="result__sub">' + sub + '</div>' +
        '<div class="result__share-text" data-share></div>' +
        '<button class="btn btn--sm" data-share-btn>Copy result</button>' +
      '</div>';

    const shareTxt = Marquee.shareText('Spotlight', dayNum, [
      puzzle.category,
      slots
    ]);
    res.querySelector('[data-share]').textContent = shareTxt;
    res.querySelector('[data-share-btn]').addEventListener('click', async (e) => {
      const ok = await Marquee.copyToClipboard(shareTxt);
      e.target.textContent = ok ? 'Copied!' : 'Copy failed';
      setTimeout(() => { e.target.textContent = 'Copy result'; }, 1800);
    });
  }

  // ----- Boot -----
  renderClues();
  renderProgress();
  if (allResolved()) showResult();
})();
