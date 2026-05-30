(function () {
  'use strict';

  const dayNum = Marquee.dayIndex();
  const puzzle = Marquee.pickFromList(window.LyricPuzzles, dayNum);

  Marquee.renderGameHeader({ title: 'Lyric', dayNum: dayNum });
  document.querySelector('[data-lyric]').textContent = puzzle.lyric;

  // ----- State -----
  const saved = Marquee.loadGameState('lyric');
  const fresh = !saved.puzzleId || saved.puzzleId !== puzzle.id;
  const state = fresh
    ? {
        puzzleId: puzzle.id,
        stage: 'show',                          // 'show' | 'song' | 'done'
        show: { guesses: [], revealed: [], solved: false },
        song: { guesses: [], revealed: [], solved: false }
      }
    : saved;
  if (!state.show) state.show = { guesses: [], revealed: [], solved: false };
  if (!state.song) state.song = { guesses: [], revealed: [], solved: false };

  // ----- Helpers -----
  function normalize(s) {
    return (s || '')
      .toLowerCase()
      .replace(/[‘’']/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/^the\s+/, '');
  }

  function isLetter(ch) { return /[a-zA-Z]/.test(ch); }

  function currentField() { return state.stage === 'show' ? puzzle.show : puzzle.song; }
  function currentState() { return state.stage === 'show' ? state.show : state.song; }

  function checkGuess(input) {
    const n = normalize(input);
    if (!n) return false;
    const field = currentField();
    if (normalize(field.answer) === n) return true;
    return (field.aliases || []).some(a => normalize(a) === n);
  }

  // ----- Rendering -----
  const maskEl = document.querySelector('[data-mask]');
  const stepLabelEl = document.querySelector('[data-step-label]');
  const guessesEl = document.querySelector('[data-guesses]');
  const inputEl = document.querySelector('[data-input]');
  const submitEl = document.querySelector('[data-submit]');
  const revealEl = document.querySelector('[data-reveal]');
  const attemptsEl = document.querySelector('[data-attempts]');
  const stageEl = document.querySelector('.lyric-stage');

  function renderMask() {
    const field = currentField();
    const st = currentState();
    const answer = field.answer;
    const revealed = new Set(st.revealed);

    maskEl.innerHTML = '';
    // Split on whitespace but preserve words; punctuation stays as inline tokens.
    const words = answer.split(/(\s+)/);
    let letterIdx = 0;

    words.forEach(token => {
      if (/^\s+$/.test(token)) {
        // gap between words
        const sp = document.createElement('span');
        sp.style.width = '0.6rem';
        maskEl.appendChild(sp);
        return;
      }
      const wordEl = document.createElement('span');
      wordEl.className = 'lyric-mask__word';
      for (let i = 0; i < token.length; i++) {
        const ch = token[i];
        const slot = document.createElement('span');
        if (!isLetter(ch)) {
          slot.className = 'lyric-mask__slot lyric-mask__slot--punct';
          slot.textContent = ch;
        } else {
          slot.className = 'lyric-mask__slot';
          if (st.solved) {
            slot.classList.add('lyric-mask__slot--solved');
            slot.textContent = ch.toUpperCase();
          } else if (revealed.has(letterIdx)) {
            slot.classList.add('lyric-mask__slot--revealed');
            slot.textContent = ch.toUpperCase();
          }
          letterIdx++;
        }
        wordEl.appendChild(slot);
      }
      maskEl.appendChild(wordEl);
    });
  }

  function renderStage() {
    if (state.stage === 'done') {
      stageEl.classList.add('lyric-stage--done');
      stepLabelEl.textContent = 'Solved';
    } else if (state.stage === 'song') {
      stageEl.classList.remove('lyric-stage--done');
      stepLabelEl.textContent = 'Step 2 of 2 — name the song';
      inputEl.placeholder = 'Song title…';
    } else {
      stageEl.classList.remove('lyric-stage--done');
      stepLabelEl.textContent = 'Step 1 of 2 — name the show';
      inputEl.placeholder = 'Show title…';
    }
  }

  function renderGuesses() {
    guessesEl.innerHTML = '';
    const st = currentState();
    st.guesses.forEach(g => {
      const row = document.createElement('div');
      row.className = 'guess ' + (g.correct ? 'guess--correct' : 'guess--wrong');
      row.innerHTML =
        '<span>' + escapeHtml(g.text) + '</span>' +
        '<span class="guess__tag">' + (g.correct ? '✓' : '✗') + '</span>';
      guessesEl.appendChild(row);
    });
  }

  function renderAttempts() {
    const totalGuesses = state.show.guesses.length + state.song.guesses.length;
    const totalReveals = state.show.revealed.length + state.song.revealed.length;
    attemptsEl.textContent = totalGuesses + ' guess' + (totalGuesses === 1 ? '' : 'es') +
      ' · ' + totalReveals + ' reveal' + (totalReveals === 1 ? '' : 's');
  }

  function render() {
    renderStage();
    renderMask();
    renderGuesses();
    renderAttempts();
    inputEl.disabled = state.stage === 'done';
    submitEl.disabled = state.stage === 'done';
    revealEl.disabled = state.stage === 'done' || allLettersRevealed();
    if (state.stage === 'done') showResult();
  }

  function allLettersRevealed() {
    const field = currentField();
    const st = currentState();
    const letterCount = (field.answer.match(/[a-zA-Z]/g) || []).length;
    return st.revealed.length >= letterCount;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ----- Actions -----
  function submitGuess() {
    if (state.stage === 'done') return;
    const text = inputEl.value.trim();
    if (!text) return;
    const correct = checkGuess(text);
    const st = currentState();
    st.guesses.push({ text, correct });
    inputEl.value = '';
    if (correct) {
      st.solved = true;
      if (state.stage === 'show') state.stage = 'song';
      else if (state.stage === 'song') state.stage = 'done';
    }
    persist();
    render();
    if (state.stage !== 'done') inputEl.focus();
  }

  function revealLetter() {
    if (state.stage === 'done') return;
    const field = currentField();
    const st = currentState();
    // Find indices of letter positions in the answer (skipping non-letters)
    const letterIndices = [];
    for (let i = 0; i < field.answer.length; i++) {
      if (isLetter(field.answer[i])) letterIndices.push(i);
    }
    // Map letter index → array slot
    const revealed = new Set(st.revealed);
    const candidates = [];
    for (let i = 0; i < letterIndices.length; i++) {
      if (!revealed.has(i)) candidates.push(i);
    }
    if (!candidates.length) return;
    // Pick deterministically based on puzzle + stage + reveal count
    const seed = puzzle.id * 1000 + (state.stage === 'show' ? 1 : 2) * 100 + st.revealed.length;
    const pick = candidates[seed % candidates.length];
    st.revealed.push(pick);
    persist();
    render();
  }

  // ----- Save / completion -----
  function persist() {
    const allDone = state.show.solved && state.song.solved;
    Marquee.saveGameState('lyric', Object.assign({}, state, {
      solved: allDone
    }));
  }

  function showResult() {
    const res = document.querySelector('[data-result]');
    res.classList.remove('hidden');
    const streak = Marquee.getStreak('lyric');
    const showGuesses = state.show.guesses.length;
    const songGuesses = state.song.guesses.length;
    const totalReveals = state.show.revealed.length + state.song.revealed.length;

    const title = Marquee.titleFor('lyric', Marquee.loadGameState('lyric'));
    const badgeHtml = title ? '<div class="result__badge result__badge--' + title.tier + '">' + title.name + '</div>' : '';

    res.innerHTML =
      '<div class="result">' +
        '<div class="bulbs" style="margin: 0 auto 1rem; max-width: 240px"></div>' +
        '<div class="result__title">Curtain call.</div>' +
        badgeHtml +
        '<div class="result__sub">' + (puzzle.note || '') + '</div>' +
        '<div class="result__sub" style="margin-top:0.5rem">' +
          showGuesses + ' guess' + (showGuesses === 1 ? '' : 'es') + ' on the show · ' +
          songGuesses + ' on the song · ' +
          totalReveals + ' reveal' + (totalReveals === 1 ? '' : 's') +
          ' · ' + streak.current + '-day streak' +
        '</div>' +
        '<div class="result__share-text" data-share></div>' +
        '<button class="btn btn--sm" data-share-btn>Copy result</button>' +
      '</div>';

    const shareLines = [
      title ? '✦ ' + title.name : null,
      '🎭 Show: ' + dots(showGuesses) + (totalRevealsForStage('show') ? ' (+' + totalRevealsForStage('show') + ' 💡)' : ''),
      '🎵 Song: ' + dots(songGuesses) + (totalRevealsForStage('song') ? ' (+' + totalRevealsForStage('song') + ' 💡)' : '')
    ].filter(Boolean);
    Marquee.flourishResult('lyric');

    const shareTxt = Marquee.shareText('Lyric', dayNum, shareLines);
    res.querySelector('[data-share]').textContent = shareTxt;
    res.querySelector('[data-share-btn]').addEventListener('click', async (e) => {
      const ok = await Marquee.copyToClipboard(shareTxt);
      e.target.textContent = ok ? 'Copied!' : 'Copy failed';
      setTimeout(() => { e.target.textContent = 'Copy result'; }, 1800);
    });
  }

  function dots(n) {
    // (n-1) wrong guesses (yellow) + 1 correct (green)
    if (n <= 0) return '⬜';
    if (n <= 6) return '🟨'.repeat(n - 1) + '🟩';
    return '🟨🟨🟨🟨🟨+' + (n - 6) + ' 🟩';
  }

  function totalRevealsForStage(stage) {
    return state[stage].revealed.length;
  }

  // ----- Wire events -----
  submitEl.addEventListener('click', submitGuess);
  revealEl.addEventListener('click', revealLetter);
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitGuess(); });

  render();
  if (state.stage !== 'done') inputEl.focus();
})();
