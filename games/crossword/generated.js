/* Mini Crossword — generated grids (auto-clued from cluebank.js).
 *
 * These grids carry NO clues of their own. The engine resolves each answer
 * word against window.CrosswordClues, so a grid becomes playable the moment
 * every one of its 10 words has a bank clue (the engine console-warns about any
 * gaps). This is how Crossword scales past the 18 hand-clued puzzles: generate
 * grids from the word list, and they clue themselves from the growing bank.
 *
 * These are NOT in the daily rotation yet. Load one for testing/authoring with
 * ?gen=<id>, e.g. crossword/index.html?gen=gen-1. Once the bank covers enough
 * of the generator's vocabulary, real generated grids get merged into the
 * daily pool deliberately.
 *
 * gen-1 is a clue-less grid whose ten words are all bank-covered, used to prove
 * the auto-clue pipeline end to end.
 */
window.CrosswordGenerated = [
  {
    id: 'gen-1',
    title: 'Generated (auto-clued)',
    grid: ["SPECS", "TIARA", "RAVEL", "INEPT", "POSES"]
  }
];
