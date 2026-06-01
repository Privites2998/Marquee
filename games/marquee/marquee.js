(function () {
  'use strict';

  const dayNum = Marquee.dayIndex();
  const puzzle = Marquee.pickFromList(window.MarqueeTitles, dayNum);
  Marquee.renderGameHeader({ title: 'Marquee', dayNum: dayNum });

  // ----- Build the answer model from the title -----
  // Words keep their letters grouped (never split mid-word). Punctuation is
  // stripped for tiles/slots; spaces define word boundaries.
  const words = [];
  const answerLetters = [];   // per-slot correct letter, in reading order
  let slotIdx = 0;
  puzzle.title.toUpperCase().split(/\s+/).forEach(w => {
    const letters = w.replace(/[^A-Z]/g, '');
    if (!letters) return;
    const slotIndices = [];
    for (const ch of letters) { answerLetters.push(ch); slotIndices.push(slotIdx++); }
    words.push({ slotIndices, letters: letters.split('') });
  });
  const N = answerLetters.length;

  // ----- Tray tiles: scrambled multiset of the answer letters -----
  function buildTray() {
    let order = answerLetters.map((_, i) => i);
    order = Marquee.shuffleSeeded(order, dayNum + 1);
    // ensure it isn't already the answer order
    const same = order.every((o, i) => answerLetters[o] === answerLetters[i]);
    if (same) order = Marquee.shuffleSeeded(order, dayNum + 7);
    return order.map((srcIdx, i) => ({ id: 't' + i, letter: answerLetters[srcIdx] }));
  }
  const TRAY = buildTray();
  const letterOf = id => (TRAY.find(t => t.id === id) || {}).letter;

  // ----- State -----
  const saved = Marquee.loadGameState('marquee');
  const fresh = !saved.puzzleId || saved.puzzleId !== puzzle.id;
  const state = fresh
    ? { puzzleId: puzzle.id, placed: Array(N).fill(null), locked: Array(N).fill(false), checks: 0, hints: 0, solved: false }
    : Object.assign({ placed: Array(N).fill(null), locked: Array(N).fill(false), checks: 0, hints: 0, solved: false }, saved);
  // guard against shape drift
  if (!Array.isArray(state.placed) || state.placed.length !== N) { state.placed = Array(N).fill(null); state.locked = Array(N).fill(false); }

  // ----- Refs -----
  const signEl   = document.querySelector('[data-sign]');
  const slotsEl  = document.querySelector('[data-slots]');
  const trayEl   = document.querySelector('[data-tray]');
  const controlsEl = document.querySelector('[data-controls]');
  const checkBtn = document.querySelector('[data-check]');
  const hintBtn  = document.querySelector('[data-hint-btn]');
  const shuffBtn = document.querySelector('[data-shuffle]');
  const resultEl = document.querySelector('[data-result]');
  document.querySelector('[data-hint]').textContent = puzzle.hint;

  let displayOrder = TRAY.map(t => t.id); // tray visual order (shuffle changes this)

  // ----- Helpers -----
  const usedIds = () => new Set(state.placed.filter(Boolean));
  const isFull  = () => state.placed.every(x => x !== null);
  const firstEmptyOpen = () => state.placed.findIndex((p, i) => p === null && !state.locked[i]);

  function persist(extra) {
    Marquee.saveGameState('marquee', Object.assign({
      puzzleId: puzzle.id, placed: state.placed, locked: state.locked,
      checks: state.checks, hints: state.hints, solved: state.solved
    }, extra || {}));
  }

  // ----- Render -----
  function renderSlots() {
    slotsEl.innerHTML = '';
    words.forEach(word => {
      const wEl = document.createElement('div');
      wEl.className = 'mq-word';
      word.slotIndices.forEach(i => {
        const slot = document.createElement('div');
        slot.className = 'mq-slot' + (state.placed[i] ? ' is-filled' : '') + (state.locked[i] ? ' is-locked' : '');
        slot.textContent = state.placed[i] ? letterOf(state.placed[i]) : '';
        if (!state.solved && !state.locked[i] && state.placed[i]) {
          slot.addEventListener('click', () => { state.placed[i] = null; persist(); render(); });
        }
        wEl.appendChild(slot);
      });
      slotsEl.appendChild(wEl);
    });
  }

  function renderTray() {
    const used = usedIds();
    trayEl.innerHTML = '';
    displayOrder.forEach(id => {
      const tile = document.createElement('div');
      tile.className = 'mq-tile' + (used.has(id) ? ' is-used' : '');
      tile.textContent = letterOf(id);
      if (!state.solved && !used.has(id)) {
        tile.addEventListener('click', () => {
          const target = firstEmptyOpen();
          if (target < 0) return;
          state.placed[target] = id;
          persist();
          render();
        });
      }
      trayEl.appendChild(tile);
    });
  }

  function render() {
    renderSlots();
    renderTray();
    checkBtn.disabled = !isFull() || state.solved;
  }

  // ----- Actions -----
  function check() {
    if (!isFull()) return;
    const correct = state.placed.every((id, i) => letterOf(id) === answerLetters[i]);
    if (correct) {
      win();
    } else {
      state.checks++;
      persist();
      signEl.classList.add('is-wrong');
      setTimeout(() => signEl.classList.remove('is-wrong'), 450);
    }
  }

  function hint() {
    if (state.solved) return;
    // leftmost open slot that is empty or wrong
    let target = -1;
    for (let i = 0; i < N; i++) {
      if (state.locked[i]) continue;
      if (state.placed[i] === null || letterOf(state.placed[i]) !== answerLetters[i]) { target = i; break; }
    }
    if (target < 0) return; // everything open is already correct
    const need = answerLetters[target];
    if (state.placed[target] !== null) state.placed[target] = null; // free wrong tile
    const used = usedIds();
    let tile = TRAY.find(t => t.letter === need && !used.has(t.id));
    if (!tile) {
      // the needed letter is sitting in some other wrong, unlocked slot — reclaim it
      for (let j = 0; j < N; j++) {
        if (j === target || state.locked[j] || state.placed[j] === null) continue;
        if (letterOf(state.placed[j]) === need && answerLetters[j] !== need) {
          tile = TRAY.find(t => t.id === state.placed[j]);
          state.placed[j] = null;
          break;
        }
      }
    }
    if (!tile) return;
    state.placed[target] = tile.id;
    state.locked[target] = true;
    state.hints++;
    persist();
    render();
    if (isFull()) check();
  }

  function shuffleTray() {
    for (let i = displayOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [displayOrder[i], displayOrder[j]] = [displayOrder[j], displayOrder[i]];
    }
    renderTray();
  }

  function win() {
    state.solved = true;
    persist({ solved: true });
    signEl.classList.add('is-solved');
    controlsEl.classList.add('hidden');
    render();
    showResult();
  }

  function showResult() {
    const streak = Marquee.getStreak('marquee');
    const title = Marquee.titleFor('marquee', Marquee.loadGameState('marquee'));
    const badgeHtml = title ? '<div class="result__badge result__badge--' + title.tier + '">' + title.name + '</div>' : '';
    const penalty = state.checks + state.hints;
    const headline = penalty === 0 ? 'Lights up — flawless!' : 'Curtain up!';
    const sub = (state.checks ? state.checks + ' wrong guess' + (state.checks === 1 ? '' : 'es') : 'Solved clean') +
                (state.hints ? ' · ' + state.hints + ' hint' + (state.hints === 1 ? '' : 's') : '') +
                (streak.current ? ' · ' + streak.current + '-day streak' : '');

    resultEl.classList.remove('hidden');
    resultEl.innerHTML =
      '<div class="result">' +
        '<div class="bulbs" style="margin: 0 auto 1rem; max-width: 260px"></div>' +
        '<div class="result__title">' + headline + '</div>' +
        badgeHtml +
        '<div class="result__sub">' + sub + '</div>' +
        '<div class="result__share-text" data-share></div>' +
        '<button class="btn btn--sm" data-share-btn>Copy result</button>' +
      '</div>';

    if (Marquee.flourishResult) Marquee.flourishResult('marquee');

    // Spoiler-free share: bulbs lit, no title revealed
    const lights = '🟡'.repeat(Math.min(N, 12));
    const shareTxt = Marquee.shareText('Marquee', dayNum, [
      title ? '✦ ' + title.name : null,
      lights,
      (state.checks ? '🔴'.repeat(state.checks) : '') + (state.hints ? '💡'.repeat(state.hints) : '') || '✓ clean'
    ].filter(Boolean));
    resultEl.querySelector('[data-share]').textContent = shareTxt;
    resultEl.querySelector('[data-share-btn]').addEventListener('click', async (e) => {
      const ok = await Marquee.copyToClipboard(shareTxt);
      e.target.textContent = ok ? 'Copied!' : 'Copy failed';
      setTimeout(() => { e.target.textContent = 'Copy result'; }, 1800);
    });
  }

  // ----- Wire -----
  checkBtn.addEventListener('click', check);
  hintBtn.addEventListener('click', hint);
  shuffBtn.addEventListener('click', shuffleTray);

  // ----- Boot -----
  render();
  if (state.solved) { signEl.classList.add('is-solved'); controlsEl.classList.add('hidden'); showResult(); }
})();
