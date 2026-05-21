/* Showdown — 5 head-to-head matchups per day.
   Each matchup: two Broadway "things" + a stat. Player picks which has
   the bigger value for that stat. Higher value = correct.

   For "later year" phrasings, larger year = later, so the same "pick the
   bigger" rule still applies.

   Numbers below are best-effort canonical figures. Worth double-checking
   before publishing — especially anything tied to still-running shows
   whose totals keep climbing.
*/
window.ShowdownPuzzles = [
  {
    id: 1,
    matchups: [
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "Cats",               value: 7485, label: "performances" },
        b: { name: "Les Misérables",      value: 6680, label: "performances" },
        note: "Cats: 1982–2000.  Les Misérables original run: 1987–2003."
      },
      {
        prompt: "Which won MORE Tony Awards?",
        a: { name: "The Producers",      value: 12,  label: "Tony wins" },
        b: { name: "Hamilton",           value: 11,  label: "Tony wins" },
        note: "The Producers (2001) still holds the record for most Tonys won by a single production."
      },
      {
        prompt: "Which opened on Broadway LATER?",
        a: { name: "Wicked",             value: 2003, label: "opened" },
        b: { name: "Dear Evan Hansen",   value: 2016, label: "opened" },
        note: ""
      },
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "Mamma Mia!",         value: 5773, label: "performances" },
        b: { name: "Rent",               value: 5123, label: "performances" },
        note: "Mamma Mia!: 2001–2015.  Rent: 1996–2008."
      },
      {
        prompt: "Which received MORE Tony nominations?",
        a: { name: "Hamilton",           value: 16,  label: "nominations" },
        b: { name: "The Producers",      value: 15,  label: "nominations" },
        note: "Hamilton (16) holds the record for most nominations received by a single production."
      }
    ]
  }
];
