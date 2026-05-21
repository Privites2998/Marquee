/* Mini Crossword — daily 5×5 puzzles.
   '.' = black square. Every row AND every column must be a real word.
   Clue numbers are auto-computed by the engine (left-to-right, top-to-bottom).

   RULE: Every puzzle must be FULLY ASYMMETRIC — 10 unique answers per puzzle
   (5 rows + 5 columns all distinct). No symmetric word squares. No partial
   row/column overlaps. This is enforced by the solver in
   /tools/grid-generator/solver.py and re-checked by the validator in
   /tools/preview/.
*/
window.CrosswordPuzzles = [
  {
    id: 1,
    title: "Curtain Up",
    grid: [
      "SPECS",
      "TIARA",
      "RAVEL",
      "INEPT",
      "POSES"
    ],
    clues: {
      across: {
        1: "Eyeglasses, slangily",
        6: "Princess-bride headpiece",
        7: "Composer of 'Boléro'",
        8: "Clumsy beyond belief",
        9: "Stances for a magazine shoot"
      },
      down: {
        1: "Sunset ___, the Strip on Broadway? No — a Boulevard",
        2: "The pit orchestra's anchor",
        3: "Roof overhangs",
        4: "Thin French pancake",
        5: "Epsom ___, for bath soaking"
      }
    }
  },
  {
    id: 2,
    title: "Opening Night",
    grid: [
      "PROFS",
      "LAPEL",
      "ARENA",
      "NERDS",
      "TRASH"
    ],
    clues: {
      across: {
        1: "Tenured types, informally",
        6: "Where the corsage goes",
        7: "Madison Square Garden, broadly",
        8: "Mathlete archetypes",
        9: "What stagehands sweep after curtain"
      },
      down: {
        1: "Bury (an idea); also a vegetable starter",
        2: "Less common, comparatively",
        3: "The Phantom's haunt",
        4: "Wards off",
        5: "Forward-leaning punctuation: /"
      }
    }
  },
  {
    id: 3,
    title: "Make Your Entrance",
    grid: [
      "THETA",
      "RAVEL",
      "AVERT",
      "DENSE",
      "ENTER"
    ],
    clues: {
      across: {
        1: "Greek letter often used in physics formulas",
        6: "'Boléro' composer (he's back)",
        7: "Turn aside, as one's gaze",
        8: "Slow on the uptake; also, packed",
        9: "Stage direction at the top of a script"
      },
      down: {
        1: "Swap; also Broadway's industry",
        2: "Safe place; a theater, for many",
        3: "Premiere or gala",
        4: "Curt; minimalist Beckett dialogue",
        5: "Modify, as a costume"
      }
    }
  },
  {
    id: 4,
    title: "Adagio",
    grid: [
      "FATES",
      "IDEAL",
      "LARGO",
      "EGRET",
      "DEARS"
    ],
    clues: {
      across: {
        1: "Greek life-thread trio; 'Hadestown' chorus",
        6: "'An ___ Husband,' Wilde play",
        7: "Tempo marking: very slow, broadly",
        8: "White wading bird in 'The Boy Friend'? No, just a wading bird",
        9: "Address from a sympathetic monologue: 'my ___'"
      },
      down: {
        1: "Submitted, as paperwork",
        2: "Old saying",
        3: "___ firma, solid ground",
        4: "Keen, like a stage-door fan",
        5: "Casino fixtures; also schedule openings"
      }
    }
  },
  {
    id: 5,
    title: "Long Run",
    grid: [
      "HERDS",
      "AVAIL",
      "LANCE",
      "EDGED",
      "SEEDS"
    ],
    clues: {
      across: {
        1: "Cattle groupings",
        6: "Use; 'to no ___'",
        7: "Knight's jousting weapon",
        8: "Bordered, as with trim",
        9: "Tournament rankings, or what gardeners plant"
      },
      down: {
        1: "Drags forcibly (archaic verb)",
        2: "Slip past, as a question",
        3: "Singer's vocal span",
        4: "Cut into small cubes",
        5: "Winter rides on a hill"
      }
    }
  },
  {
    id: 6,
    title: "Ghost Light",
    grid: [
      "GLUED",
      "HILLY",
      "OFTEN",
      "SERGE",
      "TRAYS"
    ],
    clues: {
      across: {
        1: "Fixated, as on a screen",
        6: "Like San Francisco terrain",
        7: "Frequently",
        8: "Wool fabric for a sharp suit",
        9: "Dinner-service holders"
      },
      down: {
        1: "What the lit ___ light wards off in a dark theater",
        2: "Career stage professional (or, in prison, a long-termer)",
        3: "Beyond, as a prefix",
        4: "Mournful poem",
        5: "Units of force, in physics class"
      }
    }
  },
  {
    id: 7,
    title: "The Knot",
    grid: [
      "UNDID",
      "NOOSE",
      "TRUST",
      "IMBUE",
      "ESTER"
    ],
    clues: {
      across: {
        1: "Reversed; cancelled out",
        6: "Hangman's loop",
        7: "Belief; also, an estate-planning vehicle",
        8: "Saturate (with color, with feeling)",
        9: "Banana-scented organic compound (acid + alcohol)"
      },
      down: {
        1: "Reverse a knot",
        2: "Social conventions",
        3: "Uncertainty; Shanley's 2004 Best Play",
        4: "Magazine edition; or a problem",
        5: "Discourage; turn away"
      }
    }
  }
];
