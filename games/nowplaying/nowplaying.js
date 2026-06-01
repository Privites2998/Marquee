(function () {
  'use strict';

  const dayNum = Marquee.dayIndex();
  const puzzle = Marquee.pickFromList(window.NowPlayingPuzzles, dayNum);

  Marquee.renderGameHeader({ title: 'Now Playing', dayNum: dayNum });

  // ----- State -----
  const saved = Marquee.loadGameState('nowplaying');
  const fresh = !saved.puzzleId || saved.puzzleId !== puzzle.id;
  const state = fresh
    ? { puzzleId: puzzle.id, revealed: 0, guesses: [], solved: false, gaveUp: false }
    : Object.assign({ revealed: 0, guesses: [], solved: false, gaveUp: false }, saved);

  // ----- Helpers -----
  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[‘’']/g, '')
      .replace(/^the\s+/, '')          // forgive a leading "The"
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }
  function checkGuess(input) {
    const n = normalize(input);
    if (!n) return false;
    if (normalize(puzzle.name) === n) return true;
    return (puzzle.aliases || []).some(a => normalize(a) === n);
  }
  function gameOver() { return state.solved || state.gaveUp; }
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ----- DOM refs -----
  const redactedEl = document.querySelector('[data-redacted]');
  const bioEl = document.querySelector('[data-bio]');
  const cluesEl = document.querySelector('[data-credits]');
  const inputEl = document.querySelector('[data-input]');
  const submitEl = document.querySelector('[data-submit]');
  const revealEl = document.querySelector('[data-reveal]');
  const giveupEl = document.querySelector('[data-giveup]');
  const guessesEl = document.querySelector('[data-guesses]');
  const playbillEl = document.querySelector('.np-playbill');

  // ----- Render -----
  function render() {
    bioEl.textContent = puzzle.blurb;

    if (gameOver()) {
      redactedEl.textContent = puzzle.name;
      playbillEl.classList.add('np-playbill--solved');
    } else {
      redactedEl.textContent = '▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮';
      playbillEl.classList.remove('np-playbill--solved');
    }

    cluesEl.innerHTML = '';
    puzzle.clues.forEach((clue, i) => {
      const li = document.createElement('li');
      const revealed = i < state.revealed || gameOver();
      li.className = 'np-clue' + (revealed ? '' : ' np-clue--hidden');
      li.innerHTML =
        '<span class="np-clue__num">' + (i + 1).toString().padStart(2, '0') + '</span>' +
        '<span class="np-clue__body">' + escapeHtml(revealed ? clue : 'Locked — keep guessing.') + '</span>';
      cluesEl.appendChild(li);
    });

    guessesEl.innerHTML = '';
    state.guesses.forEach(g => {
      const row = document.createElement('div');
      row.className = 'guess ' + (g.correct ? 'guess--correct' : 'guess--wrong');
      row.innerHTML =
        '<span>' + escapeHtml(g.text) + '</span>' +
        '<span class="guess__tag">' + (g.correct ? '✓' : '✗') + '</span>';
      guessesEl.appendChild(row);
    });

    const noMore = state.revealed >= puzzle.clues.length;
    inputEl.disabled = gameOver();
    submitEl.disabled = gameOver();
    revealEl.disabled = gameOver() || noMore;
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
    if (correct) state.solved = true;
    else if (state.revealed < puzzle.clues.length) state.revealed++;
    persist();
    render();
    if (!gameOver()) inputEl.focus();
  }
  function revealNext() {
    if (gameOver() || state.revealed >= puzzle.clues.length) return;
    state.revealed++;
    persist();
    render();
    inputEl.focus();
  }
  function giveUp() {
    if (gameOver()) return;
    if (!confirm('Give up and reveal the show?')) return;
    state.gaveUp = true;
    state.revealed = puzzle.clues.length;
    persist();
    render();
  }

  // ----- Save / result -----
  function persist() {
    Marquee.saveGameState('nowplaying', Object.assign({}, state, { solved: state.solved }));
  }

  function showResult() {
    const res = document.querySelector('[data-result]');
    res.classList.remove('hidden');
    const guessCount = state.guesses.length;
    const wrongCount = state.guesses.filter(g => !g.correct).length;
    const streak = Marquee.getStreak('nowplaying');
    const headline = state.solved ? 'Take a bow.' : 'Curtain.';
    const sub = state.solved
      ? guessCount + ' guess' + (guessCount === 1 ? '' : 'es') +
        ' · ' + state.revealed + ' clue' + (state.revealed === 1 ? '' : 's') + ' revealed' +
        (streak.current ? ' · ' + streak.current + '-day streak' : '')
      : 'Tonight’s show was ' + puzzle.name + '.';

    const title = Marquee.titleFor('nowplaying', Marquee.loadGameState('nowplaying'));
    const badgeHtml = title ? '<div class="result__badge result__badge--' + title.tier + '">' + title.name + '</div>' : '';

    res.innerHTML =
      '<div class="result">' +
        '<div class="bulbs" style="margin: 0 auto 1rem; max-width: 240px"></div>' +
        '<div class="result__title">' + headline + '</div>' +
        badgeHtml +
        '<div class="result__sub">' + sub + '</div>' +
        '<div class="result__share-text" data-share></div>' +
        '<button class="btn btn--sm" data-share-btn>Copy result</button>' +
      '</div>';

    const slots = [];
    for (let i = 0; i < puzzle.clues.length; i++) slots.push(i < state.revealed ? '💡' : '⬜');
    if (state.solved) slots.push('✅'); else if (state.gaveUp) slots.push('❌');

    if (Marquee.flourishResult) Marquee.flourishResult('nowplaying');

    const shareTxt = Marquee.shareText('Now Playing', dayNum, [
      title ? '✦ ' + title.name : null,
      slots.join(''),
      wrongCount + ' wrong · ' + state.revealed + ' revealed'
    ].filter(Boolean));
    res.querySelector('[data-share]').textContent = shareTxt;
    res.querySelector('[data-share-btn]').addEventListener('click', async (e) => {
      const ok = await Marquee.copyToClipboard(shareTxt);
      e.target.textContent = ok ? 'Copied!' : 'Copy failed';
      setTimeout(() => { e.target.textContent = 'Copy result'; }, 1800);
    });
  }

  // ----- Wire -----
  submitEl.addEventListener('click', submitGuess);
  revealEl.addEventListener('click', revealNext);
  giveupEl.addEventListener('click', giveUp);
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitGuess(); });

  render();
  if (!gameOver()) inputEl.focus();
})();
