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
  },
  {
    id: 2,
    matchups: [
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "A Chorus Line",      value: 6137, label: "performances" },
        b: { name: "Oh! Calcutta! (revival)", value: 5959, label: "performances" },
        note: "A Chorus Line: 1975–1990.  Oh! Calcutta! revival: 1976–1989."
      },
      {
        prompt: "Which won MORE Tony Awards?",
        a: { name: "Billy Elliot",       value: 10,  label: "Tony wins" },
        b: { name: "A Chorus Line",      value: 9,   label: "Tony wins" },
        note: "Billy Elliot (2009) was Best Musical with 10 wins from 15 nominations."
      },
      {
        prompt: "Which opened on Broadway LATER?",
        a: { name: "Cats",               value: 1982, label: "opened" },
        b: { name: "Les Misérables",     value: 1987, label: "opened" },
        note: ""
      },
      {
        prompt: "Which received MORE Tony nominations?",
        a: { name: "Hairspray",          value: 13,  label: "nominations" },
        b: { name: "Wicked",             value: 10,  label: "nominations" },
        note: "Hairspray (2003): 13 noms, 8 wins.  Wicked (2004): 10 noms, 3 wins."
      },
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "Beauty and the Beast", value: 5461, label: "performances" },
        b: { name: "Rent",               value: 5123, label: "performances" },
        note: "Beauty and the Beast: 1994–2007.  Rent: 1996–2008."
      }
    ]
  },
  {
    id: 3,
    matchups: [
      {
        prompt: "Which opened on Broadway LATER?",
        a: { name: "Annie",              value: 1977, label: "opened" },
        b: { name: "Chicago",            value: 1975, label: "opened" },
        note: "Both still feel '70s, but Annie just edges in later by two years."
      },
      {
        prompt: "Which won MORE Tony Awards?",
        a: { name: "The Producers",      value: 12,  label: "Tony wins" },
        b: { name: "Hello, Dolly! (original)", value: 10, label: "Tony wins" },
        note: "Hello, Dolly! (1964) held the wins record until The Producers broke it in 2001."
      },
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "Jersey Boys",        value: 4642, label: "performances" },
        b: { name: "Miss Saigon",        value: 4092, label: "performances" },
        note: "Jersey Boys: 2005–2017.  Miss Saigon original: 1991–2001."
      },
      {
        prompt: "Which received MORE Tony nominations?",
        a: { name: "Hamilton",           value: 16,  label: "nominations" },
        b: { name: "Billy Elliot",       value: 15,  label: "nominations" },
        note: "Hamilton's 16 set the all-time nominations record in 2016."
      },
      {
        prompt: "Which opened on Broadway LATER?",
        a: { name: "Wicked",             value: 2003, label: "opened" },
        b: { name: "The Lion King",      value: 1997, label: "opened" },
        note: ""
      }
    ]
  },
  {
    id: 4,
    matchups: [
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "Grease (original)",  value: 3388, label: "performances" },
        b: { name: "Fiddler on the Roof (original)", value: 3242, label: "performances" },
        note: "Grease: 1972–1980.  Fiddler original: 1964–1972 (held the longest-run record briefly)."
      },
      {
        prompt: "Which won MORE Tony Awards?",
        a: { name: "Hamilton",           value: 11,  label: "Tony wins" },
        b: { name: "Hello, Dolly! (original)", value: 10, label: "Tony wins" },
        note: "Hamilton (2016): 11 wins from 16 nominations."
      },
      {
        prompt: "Which opened on Broadway LATER?",
        a: { name: "Hairspray",          value: 2002, label: "opened" },
        b: { name: "Wicked",             value: 2003, label: "opened" },
        note: ""
      },
      {
        prompt: "Which received MORE Tony nominations?",
        a: { name: "The Book of Mormon", value: 14,  label: "nominations" },
        b: { name: "Wicked",             value: 10,  label: "nominations" },
        note: "TBoM (2011): 14 noms, 9 wins.  Both are still running long."
      },
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "The Producers",      value: 2502, label: "performances" },
        b: { name: "Annie (original)",   value: 2377, label: "performances" },
        note: "The Producers: 2001–2007.  Annie original: 1977–1983."
      }
    ]
  },
  {
    id: 5,
    matchups: [
      {
        prompt: "Which opened on Broadway LATER?",
        a: { name: "My Fair Lady",       value: 1956, label: "opened" },
        b: { name: "The Music Man",      value: 1957, label: "opened" },
        note: "By one year — and both became defining mid-century book musicals."
      },
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "Hello, Dolly! (original)", value: 2844, label: "performances" },
        b: { name: "My Fair Lady (original)",  value: 2717, label: "performances" },
        note: "Hello, Dolly!: 1964–1970.  My Fair Lady original: 1956–1962."
      },
      {
        prompt: "Which won MORE Tony Awards?",
        a: { name: "Hamilton",           value: 11,  label: "Tony wins" },
        b: { name: "The Lion King",      value: 6,   label: "Tony wins" },
        note: "Both Best Musical winners; the gap is wide."
      },
      {
        prompt: "Which received MORE Tony nominations?",
        a: { name: "Dreamgirls",         value: 13,  label: "nominations" },
        b: { name: "A Chorus Line",      value: 12,  label: "nominations" },
        note: "Dreamgirls (1982): 13 noms, 6 wins.  A Chorus Line (1976): 12 noms, 9 wins."
      },
      {
        prompt: "Which opened on Broadway LATER?",
        a: { name: "West Side Story",    value: 1957, label: "opened" },
        b: { name: "Gypsy",              value: 1959, label: "opened" },
        note: "Two Sondheim-lyric'd shows two years apart."
      }
    ]
  },
  {
    id: 6,
    matchups: [
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "Les Misérables",     value: 6680, label: "performances" },
        b: { name: "A Chorus Line",      value: 6137, label: "performances" },
        note: "Les Mis original: 1987–2003.  A Chorus Line: 1975–1990."
      },
      {
        prompt: "Which won MORE Tony Awards?",
        a: { name: "Spring Awakening",   value: 8,   label: "Tony wins" },
        b: { name: "The Lion King",      value: 6,   label: "Tony wins" },
        note: "Spring Awakening (2007): 8 wins from 11 noms."
      },
      {
        prompt: "Which opened on Broadway LATER?",
        a: { name: "South Pacific",      value: 1949, label: "opened" },
        b: { name: "The King and I",     value: 1951, label: "opened" },
        note: "Two Rodgers & Hammerstein classics, two years apart."
      },
      {
        prompt: "Which received MORE Tony nominations?",
        a: { name: "Hairspray",          value: 13,  label: "nominations" },
        b: { name: "Spring Awakening",   value: 11,  label: "nominations" },
        note: "Both eight-Tony winners; Hairspray edged it on noms."
      },
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "42nd Street (original)", value: 3486, label: "performances" },
        b: { name: "Grease (original)",      value: 3388, label: "performances" },
        note: "42nd Street: 1980–1989.  Grease: 1972–1980."
      }
    ]
  },
  {
    id: 7,
    matchups: [
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "A Chorus Line",      value: 6137, label: "performances" },
        b: { name: "Mamma Mia!",         value: 5773, label: "performances" },
        note: "Closer than you'd think — about a year's worth of shows apart."
      },
      {
        prompt: "Which won MORE Tony Awards?",
        a: { name: "The Producers",      value: 12,  label: "Tony wins" },
        b: { name: "Spring Awakening",   value: 8,   label: "Tony wins" },
        note: "The Producers (2001) still tops the all-time wins list."
      },
      {
        prompt: "Which opened on Broadway LATER?",
        a: { name: "Rent",               value: 1996, label: "opened" },
        b: { name: "Wicked",             value: 2003, label: "opened" },
        note: ""
      },
      {
        prompt: "Which received MORE Tony nominations?",
        a: { name: "The Book of Mormon", value: 14,  label: "nominations" },
        b: { name: "Hairspray",          value: 13,  label: "nominations" },
        note: "Both Best Musical winners; TBoM edged it by one nom."
      },
      {
        prompt: "Which had MORE original-run Broadway performances?",
        a: { name: "Fiddler on the Roof (original)", value: 3242, label: "performances" },
        b: { name: "The Producers",      value: 2502, label: "performances" },
        note: "Fiddler held the longest-run record (briefly) at close in 1972."
      }
    ]
  }
];
