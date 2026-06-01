(function () {
  'use strict';

  const dayNum = Marquee.dayIndex();
  const puzzle = Marquee.pickFromList(window.SetlistPuzzles, dayNum);
  Marquee.renderGameHeader({ title: 'Setlist', dayNum: dayNum });
  document.querySelector('[data-show]').textContent = puzzle.show;

  const SONGS = puzzle.songs;          // correct order; identity = index here
  const N = SONGS.length;

  // ----- scrambled start order (identities), not equal to solved -----
  function scrambled() {
    let o = Marquee.shuffleSeeded(SONGS.map((_, i) => i), dayNum + 3);
    if (o.every((id, i) => id === i)) o = Marquee.shuffleSeeded(o, dayNum + 11);
    return o;
  }

  // ----- State -----
  const saved = Marquee.loadGameState('setlist');
  const fresh = !saved.puzzleId || saved.puzzleId !== puzzle.id;
  const state = fresh
    ? { puzzleId: puzzle.id, order: scrambled(), checks: 0, solved: false, checked: false }
    : Object.assign({ order: scrambled(), checks: 0, solved: false, checked: false }, saved);
  if (!Array.isArray(state.order) || state.order.length !== N) state.order = scrambled();

  // ----- Refs -----
  const listEl  = document.querySelector('[data-list]');
  const checkBtn = document.querySelector('[data-check]');
  const resultEl = document.querySelector('[data-result]');

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function persist() {
    Marquee.saveGameState('setlist', Object.assign({}, state, { solved: state.solved }));
  }

  // ----- Render -----
  function render() {
    listEl.classList.toggle('is-solved', state.solved);
    listEl.innerHTML = '';
    state.order.forEach((id, pos) => {
      const li = document.createElement('li');
      li.className = 'sl-row';
      if (state.checked && !state.solved) {
        li.classList.add(id === pos ? 'sl-row--right' : 'sl-row--wrong');
      }
      const canMove = !state.solved;
      li.innerHTML =
        '<span class="sl-row__pos"></span>' +
        '<span class="sl-row__title">' + escapeHtml(SONGS[id]) + '</span>' +
        '<span class="sl-row__moves">' +
          '<button class="sl-move" data-up ' + (pos === 0 || !canMove ? 'disabled' : '') + ' aria-label="Move up">▲</button>' +
          '<button class="sl-move" data-down ' + (pos === N - 1 || !canMove ? 'disabled' : '') + ' aria-label="Move down">▼</button>' +
        '</span>';
      if (canMove) {
        li.querySelector('[data-up]').addEventListener('click', () => move(pos, -1));
        li.querySelector('[data-down]').addEventListener('click', () => move(pos, 1));
      }
      listEl.appendChild(li);
    });
    checkBtn.disabled = state.solved;
  }

  function move(pos, dir) {
    const j = pos + dir;
    if (j < 0 || j >= N) return;
    const o = state.order;
    [o[pos], o[j]] = [o[j], o[pos]];
    state.checked = false;          // moving invalidates the last check coloring
    persist();
    render();
  }

  function check() {
    if (state.solved) return;
    state.checks++;
    state.checked = true;
    const allRight = state.order.every((id, pos) => id === pos);
    if (allRight) { state.solved = true; persist(); win(); return; }
    persist();
    render();
  }

  function win() {
    render();
    const streak = Marquee.getStreak('setlist');
    const title = Marquee.titleFor('setlist', Marquee.loadGameState('setlist'));
    const badgeHtml = title ? '<div class="result__badge result__badge--' + title.tier + '">' + title.name + '</div>' : '';
    const headline = state.checks <= 1 ? 'Encore — first try!' : 'Curtain call.';
    const sub = state.checks + ' check' + (state.checks === 1 ? '' : 's') +
                (streak.current ? ' · ' + streak.current + '-day streak' : '');

    resultEl.classList.remove('hidden');
    resultEl.innerHTML =
      '<div class="result">' +
        '<div class="bulbs" style="margin: 0 auto 1rem; max-width: 240px"></div>' +
        '<div class="result__title">' + headline + '</div>' +
        badgeHtml +
        '<div class="result__sub">' + sub + '</div>' +
        '<div class="result__share-text" data-share></div>' +
        '<button class="btn btn--sm" data-share-btn>Copy result</button>' +
      '</div>';

    if (Marquee.flourishResult) Marquee.flourishResult('setlist');

    const shareTxt = Marquee.shareText('Setlist', dayNum, [
      title ? '✦ ' + title.name : null,
      '🟩'.repeat(N),
      'in ' + state.checks + ' check' + (state.checks === 1 ? '' : 's')
    ].filter(Boolean));
    resultEl.querySelector('[data-share]').textContent = shareTxt;
    resultEl.querySelector('[data-share-btn]').addEventListener('click', async (e) => {
      const ok = await Marquee.copyToClipboard(shareTxt);
      e.target.textContent = ok ? 'Copied!' : 'Copy failed';
      setTimeout(() => { e.target.textContent = 'Copy result'; }, 1800);
    });
  }

  // ----- Wire + boot -----
  checkBtn.addEventListener('click', check);
  render();
  if (state.solved) win();
})();
