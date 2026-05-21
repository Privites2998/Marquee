#!/usr/bin/env python3
"""Crossword grid generator — Python port. Generates many grids, dedupes by
word set, ranks by theater words + cleanliness."""

import re, time, random, sys

WORDS_FILE = '/Users/steph/Documents/GitHub/Marquee/tools/grid-generator/words.js'

THEATER = set("""
AISLE ARIAS BATON CHOIR CHORD DANCE FLUTE OPERA ORGAN PIANO SCENE SCORE
SHOWS SOLOS STAGE TANGO TENOR USHER VOICE WALTZ DIVAS HORNS HARPS DRUMS
REEDS CROWN STARS TIARA ROBES ACTOR ENCORE OPERAS PROPS SCRIM ENTER
EXITS RANGE PITCH THORN HEART EVITA RENTS NORMA MELOS
""".split())

# Words to avoid for daily-puzzle quality (crossword-ese / awkward)
DOWNSCORE = set("""
ENEMA RERAN ESSES ESSEN EWERS ETUIS OREOS OREO ELSES SSSSS NEHRU
""".split())

def load_words():
    with open(WORDS_FILE) as f:
        content = f.read()
    m = re.search(r'`([\s\S]+?)`', content)
    raw = m.group(1).upper()
    words = re.findall(r'[A-Z]{5}', raw)
    seen = set(); out = []
    for w in words:
        if w not in seen: seen.add(w); out.append(w)
    return out

def build_prefix_set(words):
    p = set()
    for w in words:
        for i in range(1, len(w) + 1): p.add(w[:i])
    return p

def solve(words, max_results=400, timeout_s=20):
    random.shuffle(words)
    wset = set(words); pset = build_prefix_set(words)
    grid = [None]*5; results = []
    start = time.time()

    def cp(col, n):
        return ''.join(grid[r][col] for r in range(n))

    def go(row):
        if time.time() - start > timeout_s: return True
        if len(results) >= max_results: return True
        if row == 5:
            for c in range(5):
                if cp(c, 5) not in wset: return False
            results.append(list(grid)); return False

        # Candidate filtering via col-0 prefix
        if row == 0:
            cands = words
        else:
            c0 = cp(0, row)
            cands = [w for w in words if (c0 + w[0]) in pset]

        for w in cands:
            if time.time() - start > timeout_s: return True
            if len(results) >= max_results: return True
            grid[row] = w
            ok = True
            for c in range(5):
                pre = cp(c, row+1)
                if row+1 == 5:
                    if pre not in wset: ok = False; break
                else:
                    if pre not in pset: ok = False; break
            if ok:
                if go(row+1): return True
        grid[row] = None
        return False

    go(0)
    return results, time.time()-start

def grid_words(g):
    s = set(g)
    for c in range(5):
        s.add(''.join(g[r][c] for r in range(5)))
    return s

def row_col_words(g):
    rows = list(g)
    cols = [''.join(g[r][c] for r in range(5)) for c in range(5)]
    return rows, cols

def is_fully_asymmetric(g):
    """HARD RULE: 10 unique answers. Every row word must differ from every
    column word. Rejects symmetric word squares and any partial overlap."""
    rows, cols = row_col_words(g)
    return len(set(rows) | set(cols)) == 10

def score(g):
    ws = grid_words(g)
    theater = sum(1 for w in ws if w in THEATER)
    downs = sum(1 for w in ws if w in DOWNSCORE)
    return theater * 2 - downs

# ---- Run multiple passes with different seeds for variety ----
all_words_master = load_words()
print(f"# {len(all_words_master)} words loaded", file=sys.stderr)

all_grids = []
seen_word_sets = set()
rejected_symmetric = 0
rejected_partial = 0

for seed in [1, 7, 23, 99, 2024, 31415, 271828, 88, 555, 1989]:
    random.seed(seed)
    words = all_words_master[:]
    grids, elapsed = solve(words, max_results=200, timeout_s=10)
    print(f"# Seed {seed}: {len(grids)} grids in {elapsed:.1f}s", file=sys.stderr)
    for g in grids:
        # HARD RULE: must be fully asymmetric (10 unique answers)
        if not is_fully_asymmetric(g):
            rows, cols = row_col_words(g)
            if rows == cols: rejected_symmetric += 1
            else: rejected_partial += 1
            continue
        key = frozenset(grid_words(g))
        if key in seen_word_sets: continue
        seen_word_sets.add(key)
        all_grids.append(g)

print(f"# Rejected: {rejected_symmetric} fully-symmetric, {rejected_partial} partial-overlap", file=sys.stderr)
print(f"# Unique 10-word grids: {len(all_grids)}", file=sys.stderr)

# Rank
scored = sorted(all_grids, key=lambda g: (-score(g), tuple(g)))

# Output: prioritize first-letter diversity in the top picks
shown = 0
seen_first_letters = set()
for g in scored:
    fl = g[0][0]
    if shown < 12 and fl in seen_first_letters:
        continue
    seen_first_letters.add(fl)
    ws = grid_words(g)
    theater_words = [w for w in ws if w in THEATER]
    print(f"--- Grid {shown+1}  score={score(g):.1f}  theater={theater_words}")
    for row in g:
        print(' '.join(row))
    cols = [''.join(g[r][c] for r in range(5)) for c in range(5)]
    print(f"  rows: {' '.join(g)}")
    print(f"  cols: {' '.join(cols)}")
    print()
    shown += 1
    if shown >= 20: break
