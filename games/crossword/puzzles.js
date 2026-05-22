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
  },
  {
    id: 8,
    title: "Set Change",
    grid: [
      "SLUGS",
      "TITLE",
      "ALIEN",
      "GALAS",
      "SCENE"
    ],
    clues: {
      across: {
        1: "Garden pests, or punches in a stage fight",
        6: "What the marquee announces",
        7: "Sigourney Weaver foe; also a 'Strange Loop' theme",
        8: "Opening-night fundraising events",
        9: "Each blackout-bounded unit of a play"
      },
      down: {
        1: "Bachelor parties (or male deer)",
        2: "Pale-purple bloom",
        3: "Useful, archaic",
        4: "Pick up, harvest-style",
        5: "What audiences make of a Beckett play, hopefully"
      }
    }
  },
  {
    id: 9,
    title: "Aisle Seat",
    grid: [
      "SCABS",
      "CHILE",
      "RISEN",
      "IDLED",
      "PEEPS"
    ],
    clues: {
      across: {
        1: "Healing scrapes",
        6: "South American country with a famously long coast",
        7: "What the curtain has, at 8:01",
        8: "Sat with the engine running",
        9: "Marshmallow chicks; or small chick sounds"
      },
      down: {
        1: "Bit of writing; theater token",
        2: "Scold mildly",
        3: "Best seat for an easy exit",
        4: "What censors do to expletives",
        5: "Dispatches, as flowers to a dressing room"
      }
    }
  },
  {
    id: 10,
    title: "Pipe Organ",
    grid: [
      "SCABS",
      "CANOE",
      "ORGAN",
      "OVERS",
      "TERSE"
    ],
    clues: {
      across: {
        1: "Wound coverings",
        6: "Single-paddle watercraft",
        7: "Phantom's instrument of choice; also a body part",
        8: "Cricket bowling stints, broadly",
        9: "Curt; minimal Pinter dialogue"
      },
      down: {
        1: "Move quickly aside",
        2: "Turkey-day verb",
        3: "An 'Inside Out' emotion",
        4: "Tusked pigs",
        5: "Common ___; one of five"
      }
    }
  },
  {
    id: 11,
    title: "Press Night",
    grid: [
      "LAPSE",
      "ARENA",
      "SONAR",
      "EMAIL",
      "RALLY"
    ],
    clues: {
      across: {
        1: "Subscription expiry",
        6: "Stadium-style theater (e.g., Circle in the Square)",
        7: "Echolocation system",
        8: "Modern equivalent of a fan letter",
        9: "Political assembly; or a comeback"
      },
      down: {
        1: "Focused light beam",
        2: "Smell of fresh-baked bread",
        3: "Pertaining to punishment",
        4: "Slow-moving mollusk",
        5: "Punctuality, posh"
      }
    }
  },
  {
    id: 12,
    title: "Read-Through",
    grid: [
      "LAPSE",
      "ALOUD",
      "DOING",
      "ENSUE",
      "DEEPS"
    ],
    clues: {
      across: {
        1: "Brief slip",
        6: "How a script first gets voiced at rehearsal",
        7: "Currently performing (gerund)",
        8: "Follow as a result",
        9: "Ocean depths, poetically"
      },
      down: {
        1: "Loaded down (archaic)",
        2: "By oneself; the soloist's pre-curtain state",
        3: "Composed bearing on stage",
        4: "Dawn, casually",
        5: "Sharpens (a knife)"
      }
    }
  },
  {
    id: 13,
    title: "Out of Town",
    grid: [
      "TRIPS",
      "RURAL",
      "ADAGE",
      "METED",
      "PRESS"
    ],
    clues: {
      across: {
        1: "Stumbles; or vacations",
        6: "Country, not city",
        7: "Old saying",
        8: "Dispensed (justice)",
        9: "The fourth estate"
      },
      down: {
        1: "Drifter, or a heavy step",
        2: "More impolite",
        3: "Furious",
        4: "Squires-in-training; or what a script has",
        5: "Snowy hill rides"
      }
    }
  },
  {
    id: 14,
    title: "Off-Book",
    grid: [
      "SLUGS",
      "TONAL",
      "ANIME",
      "METED",
      "PREYS"
    ],
    clues: {
      across: {
        1: "Punches, slangily",
        6: "Pertaining to musical tone or key",
        7: "Japanese animation style",
        8: "Doled out, as punishment",
        9: "Hunts (homophone of 'prays')"
      },
      down: {
        1: "Postal sticker; or a foot-strike",
        2: "Solitary type; the Phantom, broadly",
        3: "Bring together, as a cast",
        4: "Wild-tasting, said of meat",
        5: "Winter rides"
      }
    }
  }
];
