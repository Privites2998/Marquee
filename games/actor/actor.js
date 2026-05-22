(function () {
  'use strict';

  const dayNum = Marquee.dayIndex();
  const puzzle = Marquee.pickFromList(window.ActorPuzzles, dayNum);

  Marquee.renderGameHeader({ title: 'Name the Actor', dayNum: dayNum });

  // ----- State -----
  const saved = Marquee.loadGameState('actor');
  const fresh = !saved.puzzleId || saved.puzzleId !== puzzle.id;
  const state = fresh
    ? {
        puzzleId: puzzle.id,
        revealed: 0,            // how many credits are visible
        guesses: [],            // [{ text, correct }]
        solved: false,
        gaveUp: false
      }
    : Object.assign({ revealed: 0, guesses: [], solved: false, gaveUp: false }, saved);

  // ----- Helpers -----
  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[‘’']/g, '')
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
  const creditsEl = document.querySelector('[data-credits]');
  const inputEl = document.querySelector('[data-input]');
  const submitEl = document.querySelector('[data-submit]');
  const revealEl = document.querySelector('[data-reveal]');
  const giveupEl = document.querySelector('[data-giveup]');
  const guessesEl = document.querySelector('[data-guesses]');
  const playbillEl = document.querySelector('.actor-playbill');

  // ----- Render -----
  function makeRedaction(_name) {
    // Fixed-length token — don't leak word count or letter count.
    return '▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮';
  }

  function render() {
    bioEl.textContent = puzzle.bio;

    if (gameOver()) {
      redactedEl.textContent = puzzle.name;
      playbillEl.classList.add('actor-playbill--solved');
    } else {
      redactedEl.textContent = makeRedaction(puzzle.name);
      playbillEl.classList.remove('actor-playbill--solved');
    }

    creditsEl.innerHTML = '';
    puzzle.credits.forEach((credit, i) => {
      const li = document.createElement('li');
      const revealed = i < state.revealed || gameOver();
      li.className = 'actor-credit' + (revealed ? '' : ' actor-credit--hidden');
      li.innerHTML =
        '<span class="actor-credit__num">' + (i + 1).toString().padStart(2, '0') + '</span>' +
        '<span class="actor-credit__body">' + escapeHtml(revealed ? credit : 'Locked — keep guessing.') + '</span>';
      creditsEl.appendChild(li);
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

    const noMoreCredits = state.revealed >= puzzle.credits.length;
    inputEl.disabled = gameOver();
    submitEl.disabled = gameOver();
    revealEl.disabled = gameOver() || noMoreCredits;
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
    } else if (state.revealed < puzzle.credits.length) {
      state.revealed++;
    }
    persist();
    render();
    if (!gameOver()) inputEl.focus();
  }

  function revealNext() {
    if (gameOver()) return;
    if (state.revealed >= puzzle.credits.length) return;
    state.revealed++;
    persist();
    render();
    inputEl.focus();
  }

  function giveUp() {
    if (gameOver()) return;
    if (!confirm('Give up and reveal the answer?')) return;
    state.gaveUp = true;
    state.revealed = puzzle.credits.length;
    persist();
    render();
  }

  // ----- Save / result -----
  function persist() {
    Marquee.saveGameState('actor', Object.assign({}, state, {
      solved: state.solved
    }));
  }

  function showResult() {
    const res = document.querySelector('[data-result]');
    res.classList.remove('hidden');
    const guessCount = state.guesses.length;
    const wrongCount = state.guesses.filter(g => !g.correct).length;
    const streak = Marquee.getStreak('actor');
    const headline = state.solved ? 'Took a bow.' : 'Curtain.';
    const sub = state.solved
      ? guessCount + ' guess' + (guessCount === 1 ? '' : 'es') +
        ' · ' + state.revealed + ' credit' + (state.revealed === 1 ? '' : 's') + ' revealed' +
        ' · ' + streak.current + '-day streak'
      : 'Answer was ' + puzzle.name + '.';

    const title = Marquee.titleFor('actor', Marquee.loadGameState('actor'));
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

    // share: one square per credit slot; 💡 for revealed-and-then-wrong, ✅ if solved, ❌ if gave up
    const slots = [];
    for (let i = 0; i < puzzle.credits.length; i++) {
      slots.push(i < state.revealed ? '💡' : '⬜');
    }
    if (state.solved) slots.push('✅');
    else if (state.gaveUp) slots.push('❌');

    const shareTxt = Marquee.shareText('Name the Actor', dayNum, [
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

  // ----- Wire events -----
  submitEl.addEventListener('click', submitGuess);
  revealEl.addEventListener('click', revealNext);
  giveupEl.addEventListener('click', giveUp);
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitGuess(); });

  render();
  if (!gameOver()) inputEl.focus();
})();
