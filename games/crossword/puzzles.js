/* Mini Crossword puzzles.
   Grid: 5x5. '.' = black square. Every row AND column must be a real word.
   Clue numbers are auto-computed by the engine (left-to-right, top-to-bottom,
   numbering any cell that starts an across or down entry).

   Current list: 1 puzzle. TODO: author more days. Construction is hard —
   the easiest path is to find another symmetric word square or use a grid
   with black squares.
*/
window.CrosswordPuzzles = [
  {
    id: 1,
    title: 'Curtain Up',
    grid: [
      'HEART',
      'EMBER',
      'ABUSE',
      'RESIN',
      'TREND'
    ],
    clues: {
      across: {
        1: "Where Broadway lives, idiomatically",
        6: "Glowing bit left when the houselights dim",
        7: "What 'Next to Normal' confronts, broadly",
        8: "Bow rub for every pit fiddler",
        9: "What 'Six' became on TikTok"
      },
      down: {
        1: "It 'will go on,' per a 1997 power ballad",
        2: "Spark's faded cousin",
        3: "Backstage podcast subject, often",
        4: "Sticky pine product",
        5: "Direction a hit catches"
      }
    }
  }
];
