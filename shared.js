/* ============================================
   MARQUEE — Shared utilities
   Date/dayIndex, storage, streak tracking,
   share-text formatter
   ============================================ */

(function (window) {
  'use strict';

  // Launch epoch: June 9, 2026 = Day One (dayIndex 0, the first puzzle of each
  // game). dayIndex = days since launch (local time), clamped to >= 0 so the
  // pre-launch placeholder period shows Day One's puzzle, never a negative day.
  const EPOCH = new Date(2026, 5, 9);

  const GAMES = [
    { id: 'marquee',     name: 'Marquee',         href: 'games/marquee/index.html',     desc: "The title's in lights — unscramble it.",   emoji: '✨' },
    { id: 'crossword',   name: 'Mini Crossword',  href: 'games/crossword/index.html',   desc: '5×5 grid. Broadway clues only.',           emoji: '⬜' },
    { id: 'connections', name: 'Connections',     href: 'games/connections/index.html', desc: '3×3 grid. Cast fits row + column.',        emoji: '🔲' },
    { id: 'showdown',    name: 'Showdown',        href: 'games/showdown/index.html',    desc: 'Five head-to-heads. Pick the bigger one.', emoji: '⚖️' },
    { id: 'nowplaying',  name: 'Now Playing',     href: 'games/nowplaying/index.html',  desc: 'Name the show as clues reveal.',           emoji: '🎭' },
    { id: 'setlist',     name: 'Setlist',         href: 'games/setlist/index.html',     desc: 'Put the songs in performance order.',      emoji: '🎵' }
  ];

  function todayLocal() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function realDayIndex() {
    // The true current day, ignoring any URL overrides. Used to detect
    // archive playback.
    const ms = todayLocal().getTime() - EPOCH.getTime();
    return Math.max(0, Math.floor(ms / 86400000));
  }

  function dayIndex(date) {
    // URL override: ?day=N forces a specific day index. Used by the preview
    // tool and the archive page.
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      try {
        const params = new URLSearchParams(window.location.search);
        const override = params.get('day');
        if (override !== null && override !== '') {
          const n = parseInt(override, 10);
          if (!Number.isNaN(n)) return Math.max(0, n);
        }
      } catch (_) { /* ignore */ }
    }
    const d = date || todayLocal();
    const ms = d.getTime() - EPOCH.getTime();
    return Math.max(0, Math.floor(ms / 86400000));
  }

  // Archive mode = the URL is forcing a different day than today's real day.
  // In this mode we don't persist progress or bump streaks — the play is
  // ephemeral so it can't corrupt the user's real saved state.
  function isArchiveView() {
    if (typeof window === 'undefined') return false;
    try {
      const params = new URLSearchParams(window.location.search);
      const override = params.get('day');
      if (override === null || override === '') return false;
      const n = parseInt(override, 10);
      if (Number.isNaN(n)) return false;
      return n !== realDayIndex();
    } catch (_) { return false; }
  }

  function isoDate(date) {
    const d = date || todayLocal();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function prettyDate(date) {
    const d = date || todayLocal();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  // ----- Storage -----
  // Bumping this version segment WIPES all saved progress, streaks, and history
  // for everyone (each browser starts clean, since the old keys are abandoned).
  // Set to 'v1:' for the June 9, 2026 launch so no pre-launch test state carries in.
  const STORAGE_PREFIX = 'marquee:v1:';

  const storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        if (raw == null) return fallback;
        return JSON.parse(raw);
      } catch (_) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value)); }
      catch (_) { /* quota or disabled — silently ignore */ }
    },
    remove(key) {
      try { localStorage.removeItem(STORAGE_PREFIX + key); } catch (_) {}
    }
  };

  // ----- Per-game state (today) -----
  // Shape: { date: 'YYYY-MM-DD', solved: bool, score?: number, guesses?: array, extras? }
  function gameKey(gameId) { return 'game:' + gameId; }

  function loadGameState(gameId) {
    // In archive mode, we never restore persisted state — every load returns
    // a fresh empty state so past-day plays don't see today's actual progress
    // and vice versa.
    if (isArchiveView()) {
      return { date: isoDate(), solved: false, archive: true };
    }
    const today = isoDate();
    const s = storage.get(gameKey(gameId));
    if (!s || s.date !== today) {
      return { date: today, solved: false };
    }
    return s;
  }

  function saveGameState(gameId, partial) {
    const today = isoDate();
    const cur = loadGameState(gameId);
    const merged = Object.assign({}, cur, partial, { date: today });

    // Archive mode: ephemeral play — never persist or bump streaks.
    if (isArchiveView()) {
      merged.archive = true;
      return merged;
    }

    storage.set(gameKey(gameId), merged);
    if (partial.solved && !cur.solved) {
      recordCompletion(gameId);
    }
    // History log — updated every save (idempotent per date). Keeps the
    // most recent state for the day so the title reflects final outcome.
    logHistory(gameId, merged);
    return merged;
  }

  // ----- Per-day history log -----
  // Each game keeps an array of { date, dayIndex, solved, title } entries —
  // one per day played. Used by /stats.html to build aggregate stats.
  function historyKey(gameId) { return 'history:' + gameId; }

  function logHistory(gameId, state) {
    const date = isoDate();
    const tier = (titleFor(gameId, state) || {}).tier || null;
    const entry = {
      date,
      dayIndex: realDayIndex(),
      solved: !!state.solved,
      title: tier
    };
    const list = storage.get(historyKey(gameId), []);
    const i = list.findIndex(h => h.date === date);
    if (i >= 0) list[i] = entry;
    else list.push(entry);
    storage.set(historyKey(gameId), list);
  }

  function getHistory(gameId) {
    return storage.get(historyKey(gameId), []);
  }

  function getStats(gameId) {
    const history = getHistory(gameId);
    const tierCounts = { ovation: 0, encore: 0, curtainCall: 0, understudy: 0, stageDoor: 0 };
    let played = history.length;
    let solved = 0;
    history.forEach(h => {
      if (h.solved) solved++;
      if (h.title && tierCounts.hasOwnProperty(h.title)) tierCounts[h.title]++;
    });
    return {
      played,
      solved,
      winRate: played > 0 ? solved / played : null,
      tierCounts,
      history
    };
  }

  // Backfill: if today's saved state for any game is solved but history
  // doesn't yet include today (e.g., the player solved before this update
  // shipped), write today's entry now.
  function backfillTodayHistory() {
    if (isArchiveView()) return;
    const today = isoDate();
    GAMES.forEach(g => {
      const state = loadGameState(g.id);
      if (!state.solved) return;
      const hist = getHistory(g.id);
      if (hist.some(h => h.date === today)) return;
      logHistory(g.id, state);
    });
  }

  // ----- Streak tracking -----
  // Per-game streak: { current, longest, lastDate }
  // Suite streak ("all 6"): { current, longest, lastDate }
  function streakKey(gameId) { return 'streak:' + (gameId || 'suite'); }

  function getStreak(gameId) {
    const s = storage.get(streakKey(gameId), { current: 0, longest: 0, lastDate: null });
    // If lastDate is more than one day before today, current streak is broken.
    if (s.lastDate) {
      const last = new Date(s.lastDate + 'T00:00:00');
      const diff = Math.round((todayLocal().getTime() - last.getTime()) / 86400000);
      if (diff > 1) s.current = 0;
    }
    return s;
  }

  function bumpStreak(gameId) {
    const today = isoDate();
    const s = storage.get(streakKey(gameId), { current: 0, longest: 0, lastDate: null });
    if (s.lastDate === today) return s;
    if (s.lastDate) {
      const last = new Date(s.lastDate + 'T00:00:00');
      const diff = Math.round((todayLocal().getTime() - last.getTime()) / 86400000);
      s.current = diff === 1 ? s.current + 1 : 1;
    } else {
      s.current = 1;
    }
    if (s.current > s.longest) s.longest = s.current;
    s.lastDate = today;
    storage.set(streakKey(gameId), s);
    return s;
  }

  function recordCompletion(gameId) {
    bumpStreak(gameId);
    // Suite streak: bumped only when all 6 games are solved today
    const allDone = GAMES.every(g => loadGameState(g.id).solved);
    if (allDone) bumpStreak('suite');
  }

  // ----- Today summary across all games -----
  function todaySummary() {
    const states = {};
    let count = 0;
    GAMES.forEach(g => {
      const s = loadGameState(g.id);
      states[g.id] = s;
      if (s.solved) count++;
    });
    return { count, total: GAMES.length, states };
  }

  // ----- Seeded RNG for deterministic daily picks -----
  // Mulberry32. Use dayIndex as seed.
  function makeRng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pickFromList(list, seed) {
    if (!list.length) return null;
    return list[seed % list.length];
  }

  function shuffleSeeded(list, seed) {
    const rng = makeRng(seed);
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ----- Share text helper -----
  function shareText(gameName, dayNum, lines) {
    // The namesake game collapses to "Marquee #N" (it IS the suite); other
    // games read "Marquee · <Game> · #N".
    const header = (!gameName || gameName === 'Marquee')
      ? 'Marquee #' + (dayNum + 1)
      : 'Marquee · ' + gameName + ' · #' + (dayNum + 1);
    const body = (lines || []).join('\n');
    const url = 'https://privites2998.github.io/Marquee/'; // GitHub Pages (no custom domain yet)
    return header + '\n' + body + '\n\n' + url;
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) { return false; }
  }

  // ----- Page chrome helpers -----
  function currentGameId() {
    // Derive from URL: /games/<id>/index.html
    const m = (window.location.pathname || '').match(/\/games\/([^/]+)\//);
    return m ? m[1] : null;
  }

  function adjacentGames(currentId) {
    const idx = GAMES.findIndex(g => g.id === currentId);
    if (idx < 0) return { prev: null, next: null };
    const prev = GAMES[(idx - 1 + GAMES.length) % GAMES.length];
    const next = GAMES[(idx + 1) % GAMES.length];
    return { prev, next };
  }

  function renderGameHeader(opts) {
    const el = document.querySelector('[data-game-header]');
    if (!el) return;
    const cur = currentGameId();
    const { prev, next } = adjacentGames(cur);

    // Preserve archive day param when navigating between games
    const archiveQuery = isArchiveView() ? '?day=' + dayIndex() : '';

    const prevLink = prev
      ? '<a class="game-nav__adj game-nav__adj--prev" href="../' + prev.id + '/index.html' + archiveQuery + '" aria-label="Previous: ' + prev.name + '">' +
          '<span class="game-nav__arrow">‹</span>' +
          '<span class="game-nav__adj-name">' + prev.name + '</span>' +
        '</a>'
      : '<span></span>';

    const nextLink = next
      ? '<a class="game-nav__adj game-nav__adj--next" href="../' + next.id + '/index.html' + archiveQuery + '" aria-label="Next: ' + next.name + '">' +
          '<span class="game-nav__adj-name">' + next.name + '</span>' +
          '<span class="game-nav__arrow">›</span>' +
        '</a>'
      : '<span></span>';

    el.innerHTML =
      '<div class="game-nav__side game-nav__side--left">' + prevLink + '</div>' +
      '<div class="game-title-wrap">' +
        '<a class="game-nav__hub" href="../../index.html">Marquee</a>' +
        '<div class="game-title">' + (opts.title || '') + '</div>' +
        '<div class="game-meta">No. ' + ((opts.dayNum != null ? opts.dayNum : dayIndex()) + 1) + ' · ' + prettyDate(archiveDate()) + '</div>' +
      '</div>' +
      '<div class="game-nav__side game-nav__side--right">' + nextLink + '</div>';

    // Archive banner — inserted into a sibling slot if present, else as a
    // sibling div before the surface.
    if (isArchiveView()) {
      let banner = document.querySelector('[data-archive-banner]');
      if (!banner) {
        banner = document.createElement('div');
        banner.setAttribute('data-archive-banner', '');
        banner.className = 'archive-banner';
        const parent = el.parentNode;
        if (parent) parent.insertBefore(banner, el.nextSibling);
      }
      banner.innerHTML =
        '<span class="archive-banner__pill">Archive</span>' +
        '<span class="archive-banner__text">Replaying day ' + dayIndex() + '. Progress won\'t affect your streaks.</span>' +
        '<a class="archive-banner__exit" href="../../archive.html">All days</a>';
    }
  }

  // The date shown in the game header. In archive mode this is the historical
  // date for the puzzle being played; otherwise it's today.
  function archiveDate() {
    if (!isArchiveView()) return undefined;
    const offset = dayIndex() - realDayIndex();
    const d = todayLocal();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset);
  }

  // ----- Difficulty lookup -----
  // Each game's data file exports an array of puzzles. Each puzzle may have
  // a `difficulty: 1-3` field. todayDifficulty(gameId) returns that for the
  // puzzle being shown today. Returns null if the data isn't loaded yet
  // (e.g., on the hub, we haven't included the per-game data files).
  function todayDifficulty(gameId) {
    // Hub doesn't load per-game puzzle data, so we read difficulty from a
    // small index that lives on this module. Games can register their data
    // shape; or we duplicate a compact difficulty list here.
    const idx = DIFFICULTY_INDEX[gameId];
    if (!idx || !idx.length) return null;
    return idx[dayIndex() % idx.length] || null;
  }

  // Compact difficulty index per game — kept in sync with each game's
  // puzzle data file. Format: array of integers 1..3 in the same order as
  // the puzzles array.
  const DIFFICULTY_INDEX = {
    crossword:   [2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 3, 2, 2, 3, 2, 3, 2, 3, 3, 3],
    marquee:     [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 1, 2, 1, 1, 3, 2, 2, 3, 3, 3, 3, 2, 2, 2, 3, 2, 2, 2, 1, 1, 1, 2, 3, 1, 3, 3, 3, 3, 2, 2, 2, 3, 2, 3, 1, 2, 3, 2, 2, 3, 3, 2, 2, 2, 2, 3, 2, 1, 1, 2, 2, 3, 3, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 3, 2, 2, 3, 2, 2, 2, 3, 2, 1, 2, 2, 1, 2, 3, 2, 2, 3, 2, 3, 3, 3, 2, 2, 2, 2, 3, 3, 2, 2, 2, 3, 2, 3, 2, 2, 2, 3, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 3, 3, 2, 1, 2, 3, 3, 3, 3, 3, 2],
    connections: [1, 3, 2, 3, 2, 2, 2, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3, 1, 3, 1, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 3, 2, 3, 3, 3, 2, 3, 2, 3, 3, 3, 1, 1, 3, 3, 3, 2, 3, 1, 2, 3, 3, 1, 2, 2, 3, 1, 3, 1, 3, 3, 3, 3, 3, 3, 2, 1, 3, 1, 3, 3, 3, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 3, 3, 2, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 2, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 2, 2, 3, 3, 1, 3, 3, 3, 1, 3, 3, 1, 2, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 2, 3, 1, 2, 2, 3, 3, 3, 3, 3, 1, 2, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 2, 2, 1, 2, 2, 3, 3, 2, 3, 3, 3, 2, 2, 3, 3, 3, 2, 2, 3, 3, 3, 1, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 2, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 1, 3, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 2, 3, 2],
    nowplaying:  [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 2, 2, 3, 1, 2, 3, 1, 2, 2, 1, 2, 2, 3, 2, 2, 3, 3, 3, 2, 2],
    showdown:    [2, 2, 2, 2, 3, 2, 2, 2, 1, 2, 3, 2, 2, 1, 3, 2, 2, 2, 1, 2, 3, 2, 2, 1, 3, 2, 2, 2, 1, 2, 3, 2, 2, 1, 3, 2, 2, 2, 1, 2, 3, 2, 2, 1, 3, 2, 2, 2, 1, 2],
    setlist:     [1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 1, 3, 2, 2, 3, 1, 2, 2, 1, 2, 2, 1, 2, 2, 3, 2, 2, 2, 3, 3, 2, 2]
  };

  // ----- Title-rank system -----
  // Each game returns one of these tier keys based on the player's saved
  // state. Lower-index = higher tier.
  const TIER_NAMES = {
    ovation:     'Standing Ovation',
    encore:      'Encore',
    curtainCall: 'Curtain Call',
    understudy:  'Understudy',
    stageDoor:   'Stage Door'
  };

  // Map of gameId → fn(state) → tier key
  const TITLE_RULES = {
    crossword: (s) => {
      if (!s.solved) return null;
      const reveals = (s.revealed && s.revealed.length) || s.revealedCount || 0;
      if (reveals === 0) return 'ovation';
      if (reveals <= 2) return 'encore';
      if (reveals <= 5) return 'curtainCall';
      return 'understudy';
    },
    connections: (s) => {
      if (!s.cells) return null;
      const filled = s.cells.filter(c => c && c.actor).length;
      if (filled === 9 && !s.gaveUp) return 'ovation';
      if (filled >= 7) return 'encore';
      if (filled >= 5) return 'curtainCall';
      if (filled >= 3) return 'understudy';
      return 'stageDoor';
    },
    showdown: (s) => {
      if (!s.picks || s.picks.length < 5) return null;
      const correct = s.picks.filter(p => p.correct).length;
      if (correct === 5) return 'ovation';
      if (correct === 4) return 'encore';
      if (correct === 3) return 'curtainCall';
      if (correct >= 1) return 'understudy';
      return 'stageDoor';
    },
    marquee: (s) => {
      if (!s.solved) return null;
      const penalty = (s.checks || 0) + (s.hints || 0);
      if (penalty === 0) return 'ovation';
      if (penalty <= 1) return 'encore';
      if (penalty <= 3) return 'curtainCall';
      if (penalty <= 5) return 'understudy';
      return 'stageDoor';
    },
    nowplaying: (s) => {
      if (s.gaveUp || !s.solved) return s.gaveUp ? 'stageDoor' : null;
      const g = (s.guesses && s.guesses.length) || 0;
      if (g === 1) return 'ovation';
      if (g === 2) return 'encore';
      if (g === 3) return 'curtainCall';
      if (g === 4) return 'understudy';
      return 'stageDoor';
    },
    setlist: (s) => {
      if (!s.solved) return null;
      const c = s.checks || 0;
      if (c <= 1) return 'ovation';
      if (c <= 2) return 'encore';
      if (c <= 4) return 'curtainCall';
      if (c <= 6) return 'understudy';
      return 'stageDoor';
    }
  };

  function titleFor(gameId, state) {
    const fn = TITLE_RULES[gameId];
    if (!fn) return null;
    const tier = fn(state || loadGameState(gameId));
    if (!tier) return null;
    return { tier, name: TIER_NAMES[tier] };
  }

  // Suite-wide title for the day: requires all 6 games solved.
  // Counts how many games earned an Ovation.
  function suiteTitle() {
    const states = todaySummary().states;
    let solvedCount = 0;
    let ovations = 0;
    let encoresOrBetter = 0;
    GAMES.forEach(g => {
      const s = states[g.id];
      if (!s || !s.solved) return;
      solvedCount++;
      const t = titleFor(g.id, s);
      if (!t) return;
      if (t.tier === 'ovation') { ovations++; encoresOrBetter++; }
      else if (t.tier === 'encore') { encoresOrBetter++; }
    });
    if (solvedCount < GAMES.length) return null;
    if (ovations === GAMES.length) return { tier: 'tony', name: 'Tony Winner' };
    if (ovations >= 4)              return { tier: 'lead', name: 'Lead Role' };
    if (encoresOrBetter >= 4)       return { tier: 'featured', name: 'Featured Player' };
    return { tier: 'ensemble', name: 'Ensemble' };
  }

  // ----- Public API -----
  // Adds a one-shot celebratory flourish to the visible in-game result panel
  // when today's puzzle was solved. Defensive no-op otherwise. Call at the end
  // of a game's showResult(): Marquee.flourishResult('<gameId>').
  function flourishResult(gameId) {
    var panel = document.querySelector('[data-result] .result');
    if (!panel) return;
    var st = loadGameState(gameId);
    if (st && st.solved) panel.classList.add('is-won');
  }

  window.Marquee = {
    GAMES,
    flourishResult,
    dayIndex,
    isoDate,
    prettyDate,
    todayLocal,
    storage,
    loadGameState,
    saveGameState,
    getStreak,
    todaySummary,
    todayDifficulty,
    titleFor,
    suiteTitle,
    realDayIndex,
    isArchiveView,
    getHistory,
    getStats,
    backfillTodayHistory,
    makeRng,
    pickFromList,
    shuffleSeeded,
    shareText,
    copyToClipboard,
    renderGameHeader
  };
})(window);
