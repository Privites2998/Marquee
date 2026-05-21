/* ============================================
   MARQUEE — Shared utilities
   Date/dayIndex, storage, streak tracking,
   share-text formatter
   ============================================ */

(function (window) {
  'use strict';

  // Epoch: Jan 1, 2026. dayIndex = days since epoch (local time).
  const EPOCH = new Date(2026, 0, 1);

  const GAMES = [
    { id: 'crossword',   name: 'Mini Crossword',  href: 'games/crossword/index.html',   desc: '5×5 grid. Broadway clues only.',           emoji: '⬜' },
    { id: 'lyric',       name: 'Lyric',           href: 'games/lyric/index.html',       desc: 'Name the show. Then name the song.',       emoji: '🎵' },
    { id: 'connections', name: 'Connections',     href: 'games/connections/index.html', desc: '3×3 grid. Cast fits row + column.',        emoji: '🔲' },
    { id: 'actor',       name: 'Name the Actor',  href: 'games/actor/index.html',       desc: 'A bio. One credit revealed at a time.',    emoji: '🎭' },
    { id: 'showdown',    name: 'Showdown',        href: 'games/showdown/index.html',    desc: 'Five head-to-heads. Pick the bigger one.', emoji: '⚖️' },
    { id: 'spotlight',   name: 'Spotlight',       href: 'games/spotlight/index.html',   desc: 'Daily trivia category. Five clues.',       emoji: '💡' }
  ];

  function todayLocal() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function dayIndex(date) {
    // URL override: ?day=N forces a specific day index. Used by the preview
    // tool to load any puzzle. Harmless for regular users; worst case they
    // play tomorrow's puzzle a day early.
    if (typeof window !== 'undefined' && window.location && window.location.search) {
      try {
        const params = new URLSearchParams(window.location.search);
        const override = params.get('day');
        if (override !== null && override !== '') {
          const n = parseInt(override, 10);
          if (!Number.isNaN(n)) return n;
        }
      } catch (_) { /* ignore */ }
    }
    const d = date || todayLocal();
    const ms = d.getTime() - EPOCH.getTime();
    return Math.floor(ms / 86400000);
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
  const STORAGE_PREFIX = 'marquee:';

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
    storage.set(gameKey(gameId), merged);

    if (partial.solved && !cur.solved) {
      recordCompletion(gameId);
    }
    return merged;
  }

  // ----- Streak tracking -----
  // Per-game streak: { current, longest, lastDate }
  // Suite streak ("all 5"): { current, longest, lastDate }
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
    // Suite streak: bumped only when all 5 games are solved today
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
    const header = 'Marquee · ' + gameName + ' · #' + dayNum;
    const body = (lines || []).join('\n');
    const url = 'marquee.games'; // placeholder; user can swap
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

    const prevLink = prev
      ? '<a class="game-nav__adj game-nav__adj--prev" href="../' + prev.id + '/index.html" aria-label="Previous: ' + prev.name + '">' +
          '<span class="game-nav__arrow">‹</span>' +
          '<span class="game-nav__adj-name">' + prev.name + '</span>' +
        '</a>'
      : '<span></span>';

    const nextLink = next
      ? '<a class="game-nav__adj game-nav__adj--next" href="../' + next.id + '/index.html" aria-label="Next: ' + next.name + '">' +
          '<span class="game-nav__adj-name">' + next.name + '</span>' +
          '<span class="game-nav__arrow">›</span>' +
        '</a>'
      : '<span></span>';

    el.innerHTML =
      '<div class="game-nav__side game-nav__side--left">' + prevLink + '</div>' +
      '<div class="game-title-wrap">' +
        '<a class="game-nav__hub" href="../../index.html">Marquee</a>' +
        '<div class="game-title">' + (opts.title || '') + '</div>' +
        '<div class="game-meta">No. ' + (opts.dayNum || dayIndex()) + ' · ' + prettyDate() + '</div>' +
      '</div>' +
      '<div class="game-nav__side game-nav__side--right">' + nextLink + '</div>';
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
    crossword:   [2, 2, 2, 2, 2, 2, 3],
    lyric:       [1, 2, 2, 2, 1, 3, 2, 2, 1, 1],
    connections: [2],
    actor:       [1, 2, 2, 1, 1, 2, 2, 1],
    showdown:    [2],
    spotlight:   [2, 2, 3, 2]
  };

  // ----- Public API -----
  window.Marquee = {
    GAMES,
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
    makeRng,
    pickFromList,
    shuffleSeeded,
    shareText,
    copyToClipboard,
    renderGameHeader
  };
})(window);
