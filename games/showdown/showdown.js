(function () {
  'use strict';

  const dayNum = Marquee.dayIndex();
  const puzzle = Marquee.pickFromList(window.ShowdownPuzzles, dayNum);
  const TOTAL = puzzle.matchups.length;

  Marquee.renderGameHeader({ title: 'Showdown', dayNum: dayNum });
  document.querySelector('[data-total]').textContent = TOTAL;

  // ----- State -----
  const saved = Marquee.loadGameState('showdown');
  const fresh = !saved.puzzleId || saved.puzzleId !== puzzle.id;
  const state = fresh
    ? {
        puzzleId: puzzle.id,
        round: 0,                       // 0..TOTAL-1; TOTAL = done
        picks: [],                      // [{ pickedKey: 'a'|'b', correct }]
        revealed: false                 // is the current round mid-reveal?
      }
    : Object.assign({ round: 0, picks: [], revealed: false }, saved);

  // ----- Refs -----
  const promptEl = document.querySelector('[data-prompt]');
  const matchEl  = document.querySelector('[data-match]');
  const roundEl  = document.querySelector('[data-round]');
  const pipsEl   = document.querySelector('[data-pips]');
  const feedbackEl = document.querySelector('[data-feedback]');
  const fbResultEl = document.querySelector('[data-feedback-result]');
  const fbNoteEl   = document.querySelector('[data-feedback-note]');
  const nextBtn    = document.querySelector('[data-next]');
  const resultEl   = document.querySelector('[data-result]');

  // ----- Helpers -----
  function fmt(n) {
    return typeof n === 'number' ? n.toLocaleString('en-US') : String(n);
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ----- Render -----
  function renderPips() {
    pipsEl.innerHTML = '';
    for (let i = 0; i < TOTAL; i++) {
      const pip = document.createElement('span');
      pip.className = 'sd-pip';
      if (i < state.picks.length) {
        pip.classList.add(state.picks[i].correct ? 'sd-pip--correct' : 'sd-pip--wrong');
      } else if (i === state.round) {
        pip.classList.add('sd-pip--current');
      }
      pipsEl.appendChild(pip);
    }
  }

  function renderMatchup() {
    const m = puzzle.matchups[state.round];
    if (!m) return;

    roundEl.textContent = state.round + 1;
    promptEl.textContent = m.prompt;

    const pickEntry = state.picks[state.round]; // present only if this round was already resolved (e.g. on reload after revealing)
    const valuesShown = !!pickEntry;

    matchEl.innerHTML = '';
    ['a', 'b'].forEach((key, idx) => {
      const side = m[key];
      const card = document.createElement('div');
      card.className = 'sd-card';
      card.dataset.key = key;

      const isPicked = pickEntry && pickEntry.pickedKey === key;
      const isBigger = m.a.value !== m.b.value && side.value > m[key === 'a' ? 'b' : 'a'].value;

      if (valuesShown) {
        card.classList.add('sd-card--locked');
        if (isPicked && pickEntry.correct) card.classList.add('sd-card--correct');
        else if (isPicked && !pickEntry.correct) card.classList.add('sd-card--wrong');
        else if (!isPicked && isBigger) card.classList.add('sd-card--correct');  // show the right answer when player picked wrong
      } else {
        card.addEventListener('click', () => pick(key));
      }

      card.innerHTML =
        '<div class="sd-card__name">' + escapeHtml(side.name) + '</div>' +
        (valuesShown
          ? '<div class="sd-card__value">' + escapeHtml(fmt(side.value)) + '</div>' +
            '<div class="sd-card__label">' + escapeHtml(side.label || '') + '</div>'
          : '');
      matchEl.appendChild(card);

      // Insert "vs" between the two cards
      if (idx === 0) {
        const vs = document.createElement('div');
        vs.className = 'sd-vs';
        vs.textContent = 'vs';
        matchEl.appendChild(vs);
      }
    });

    // Feedback panel
    if (valuesShown) {
      feedbackEl.classList.remove('hidden');
      fbResultEl.textContent = pickEntry.correct ? '✓  Correct.' : '✗  Wrong.';
      fbNoteEl.textContent = m.note || '';
      nextBtn.textContent = (state.round + 1 < TOTAL) ? 'Next' : 'See results';
    } else {
      feedbackEl.classList.add('hidden');
    }
  }

  function pick(key) {
    const m = puzzle.matchups[state.round];
    const correct = m[key].value > m[key === 'a' ? 'b' : 'a'].value;
    state.picks.push({ pickedKey: key, correct });
    persist();
    renderPips();
    renderMatchup();
  }

  function next() {
    if (state.round + 1 >= TOTAL) {
      state.round = TOTAL;
      persist();
      finish();
    } else {
      state.round++;
      persist();
      renderPips();
      renderMatchup();
    }
  }

  function finish() {
    const correct = state.picks.filter(p => p.correct).length;
    const solved = correct === TOTAL;
    Marquee.saveGameState('showdown', Object.assign({}, state, { solved }));
    showResult();
  }

  function showResult() {
    matchEl.classList.add('hidden');
    promptEl.classList.add('hidden');
    feedbackEl.classList.add('hidden');
    resultEl.classList.remove('hidden');

    const correct = state.picks.filter(p => p.correct).length;
    const streak = Marquee.getStreak('showdown');
    const headline = correct === TOTAL ? 'Five out of five.' :
                     correct >= 3      ? 'Curtain.' :
                                         'Better luck tomorrow.';
    const sub = correct + ' / ' + TOTAL +
                (streak.current ? ' · ' + streak.current + '-day streak' : '');

    const slots = state.picks.map(p => p.correct ? '✅' : '❌').join('');

    resultEl.innerHTML =
      '<div class="result">' +
        '<div class="bulbs" style="margin: 0 auto 1rem; max-width: 240px"></div>' +
        '<div class="result__title">' + headline + '</div>' +
        '<div class="result__sub">' + sub + '</div>' +
        '<div class="result__share-text" data-share></div>' +
        '<button class="btn btn--sm" data-share-btn>Copy result</button>' +
      '</div>';

    const shareTxt = Marquee.shareText('Showdown', dayNum, [slots]);
    resultEl.querySelector('[data-share]').textContent = shareTxt;
    resultEl.querySelector('[data-share-btn]').addEventListener('click', async (e) => {
      const ok = await Marquee.copyToClipboard(shareTxt);
      e.target.textContent = ok ? 'Copied!' : 'Copy failed';
      setTimeout(() => { e.target.textContent = 'Copy result'; }, 1800);
    });
  }

  function persist() {
    const correct = state.picks.filter(p => p.correct).length;
    Marquee.saveGameState('showdown', Object.assign({}, state, {
      solved: correct === TOTAL && state.round >= TOTAL
    }));
  }

  // ----- Wire events -----
  nextBtn.addEventListener('click', next);

  // ----- Boot -----
  renderPips();
  if (state.round >= TOTAL) {
    showResult();
  } else {
    renderMatchup();
  }
})();
