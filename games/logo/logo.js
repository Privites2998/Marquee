(function () {
  'use strict';

  const dayNum = Marquee.dayIndex();
  const puzzle = Marquee.pickFromList(window.LogoPuzzles, dayNum);

  Marquee.renderGameHeader({ title: 'Logo Reveal', dayNum: dayNum });

  // ----- State -----
  const saved = Marquee.loadGameState('logo');
  const fresh = !saved.puzzleId || saved.puzzleId !== puzzle.id;
  const state = fresh
    ? {
        puzzleId: puzzle.id,
        stage: 0,             // 0..(crops.length-1)
        guesses: [],
        solved: false,
        gaveUp: false
      }
    : Object.assign({ stage: 0, guesses: [], solved: false, gaveUp: false }, saved);

  const stageCount = puzzle.crops.length;

  // ----- Helpers -----
  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[‘’']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/^the\s+/, '');
  }

  function checkGuess(input) {
    const n = normalize(input);
    if (!n) return false;
    if (normalize(puzzle.name) === n) return true;
    return (puzzle.aliases || []).some(a => normalize(a) === n);
  }

  function gameOver() { return state.solved || state.gaveUp; }
  function fullyRevealed() { return state.stage >= stageCount - 1; }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ----- DOM refs -----
  const svgEl = document.querySelector('[data-svg]');
  const stageLabelEl = document.querySelector('[data-stage-label]');
  const hintEl = document.querySelector('[data-hint]');
  const inputEl = document.querySelector('[data-input]');
  const submitEl = document.querySelector('[data-submit]');
  const zoomEl = document.querySelector('[data-zoomout]');
  const giveupEl = document.querySelector('[data-giveup]');
  const guessesEl = document.querySelector('[data-guesses]');

  // ----- Render -----
  svgEl.innerHTML = puzzle.svg;  // inject paths/rects once

  function render() {
    const viewBox = (gameOver() ? puzzle.crops[stageCount - 1] : puzzle.crops[state.stage]);
    svgEl.setAttribute('viewBox', viewBox);

    const labelStage = gameOver() ? stageCount : state.stage + 1;
    stageLabelEl.textContent = gameOver()
      ? 'Full view'
      : 'Stage ' + (state.stage + 1) + ' of ' + stageCount +
        (state.stage === 0 ? ' — tightest crop' : '');

    // Hint shows starting at stage 2 (3rd reveal), not before
    if (gameOver()) {
      hintEl.textContent = puzzle.hint || '';
    } else if (state.stage >= 2 && puzzle.hint) {
      hintEl.textContent = puzzle.hint;
    } else {
      hintEl.textContent = '';
    }

    guessesEl.innerHTML = '';
    state.guesses.forEach(g => {
      const row = document.createElement('div');
      row.className = 'guess ' + (g.correct ? 'guess--correct' : 'guess--wrong');
      row.innerHTML =
        '<span>' + escapeHtml(g.text) + '</span>' +
        '<span class="guess__tag">' + (g.correct ? '✓' : '✗') + '</span>';
      guessesEl.appendChild(row);
    });

    inputEl.disabled = gameOver();
    submitEl.disabled = gameOver();
    zoomEl.disabled = gameOver() || fullyRevealed();
    giveupEl.disabled = gameOver();

    if (gameOver()) showResult();
  }

  // ----- Actions -----
  function submitGuess() {
    if (gameOver()) return;
    const text = inputEl.value.trim();
    if (!text) return;
    const correct = checkGuess(text);
    state.guesses.push({ text, correct });
    inputEl.value = '';

    if (correct) {
      state.solved = true;
    } else if (!fullyRevealed()) {
      state.stage++;
    }
    persist();
    render();
    if (!gameOver()) inputEl.focus();
  }

  function zoomOut() {
    if (gameOver()) return;
    if (fullyRevealed()) return;
    state.stage++;
    persist();
    render();
    inputEl.focus();
  }

  function giveUp() {
    if (gameOver()) return;
    if (!confirm('Give up and reveal the logo?')) return;
    state.gaveUp = true;
    persist();
    render();
  }

  // ----- Save / result -----
  function persist() {
    Marquee.saveGameState('logo', Object.assign({}, state, { solved: state.solved }));
  }

  function showResult() {
    const res = document.querySelector('[data-result]');
    res.classList.remove('hidden');
    const wrong = state.guesses.filter(g => !g.correct).length;
    const streak = Marquee.getStreak('logo');
    const headline = state.solved ? 'Bullseye.' : 'Curtain.';
    const sub = state.solved
      ? puzzle.name + ' · ' + wrong + ' miss' + (wrong === 1 ? '' : 'es') +
        ' · stage ' + (state.stage + 1) + '/' + stageCount +
        ' · ' + streak.current + '-day streak'
      : 'It was ' + puzzle.name + '.';

    // 🔍 per stage advanced, ✅ or ❌ at end
    const slots = [];
    for (let i = 0; i < stageCount; i++) {
      if (i < state.stage) slots.push('🔍');
      else if (i === state.stage && state.solved) slots.push('✅');
      else slots.push('⬜');
    }
    if (!state.solved && state.gaveUp) {
      // Replace trailing ⬜ with ❌ to mark give-up
      const lastIdx = slots.lastIndexOf('⬜');
      if (lastIdx >= 0) slots[lastIdx] = '❌';
    }

    res.innerHTML =
      '<div class="result">' +
        '<div class="bulbs" style="margin: 0 auto 1rem; max-width: 240px"></div>' +
        '<div class="result__title">' + headline + '</div>' +
        '<div class="result__sub">' + sub + '</div>' +
        '<div class="result__share-text" data-share></div>' +
        '<button class="btn btn--sm" data-share-btn>Copy result</button>' +
      '</div>';

    const shareTxt = Marquee.shareText('Logo Reveal', dayNum, [slots.join('')]);
    res.querySelector('[data-share]').textContent = shareTxt;
    res.querySelector('[data-share-btn]').addEventListener('click', async (e) => {
      const ok = await Marquee.copyToClipboard(shareTxt);
      e.target.textContent = ok ? 'Copied!' : 'Copy failed';
      setTimeout(() => { e.target.textContent = 'Copy result'; }, 1800);
    });
  }

  // ----- Wire events -----
  submitEl.addEventListener('click', submitGuess);
  zoomEl.addEventListener('click', zoomOut);
  giveupEl.addEventListener('click', giveUp);
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitGuess(); });

  render();
  if (!gameOver()) inputEl.focus();
})();
