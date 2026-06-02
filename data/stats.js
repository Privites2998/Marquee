/* Marquee — show STATS layer (numeric facts for Showdown-style trivia).
 *
 * Keyed by show id (data/shows.js). Kept separate from shows.js so the
 * fact-heavy, occasionally-changing numbers live in one place.
 *
 *   broadwayPerformances : total Broadway performances of the production
 *                          described in shows.js.
 *
 * For CLOSED shows this is the FINAL count. For shows still RUNNING it is an
 * approximate snapshot as of early 2026 (these grow over time) and is marked
 * with a // running comment; treat those as "at least this many". null means
 * not yet filled (currently the long-runners still playing with no clean figure).
 *
 * Verified June 2026 against Wikipedia, IBDB, and Playbill. Re-verify running
 * snapshots periodically. Showdown can build matchups from this plus the dates
 * and tonyWins already in shows.js ("which ran longer?", "which won more Tonys?",
 * "which opened first?").
 */
window.MarqueeStats = {
  "hamilton":               { broadwayPerformances: null },   // running
  "wicked":                 { broadwayPerformances: 8771 },   // running (snapshot ~2026)
  "phantom":                { broadwayPerformances: 13981 },
  "les-mis":                { broadwayPerformances: 6680 },
  "rent":                   { broadwayPerformances: 5123 },
  "dear-evan-hansen":       { broadwayPerformances: 1678 },
  "book-of-mormon":         { broadwayPerformances: null },   // running
  "hadestown":              { broadwayPerformances: null },   // running
  "into-the-woods":         { broadwayPerformances: 765 },
  "sweeney-todd":           { broadwayPerformances: 557 },
  "chicago":                { broadwayPerformances: 11608 },  // running (snapshot ~2026)
  "cats":                   { broadwayPerformances: 7485 },
  "lion-king":              { broadwayPerformances: 11233 },  // running (snapshot ~2026)
  "cabaret":                { broadwayPerformances: 1165 },
  "west-side-story":        { broadwayPerformances: 732 },
  "fiddler":                { broadwayPerformances: 3242 },
  "a-chorus-line":          { broadwayPerformances: 6137 },
  "sound-of-music":         { broadwayPerformances: 1443 },
  "oklahoma":               { broadwayPerformances: 2212 },
  "guys-and-dolls":         { broadwayPerformances: 1200 },
  "annie":                  { broadwayPerformances: 2377 },
  "in-the-heights":         { broadwayPerformances: 1185 },
  "hairspray":              { broadwayPerformances: 2642 },
  "mamma-mia":              { broadwayPerformances: 5758 },
  "six":                    { broadwayPerformances: null },   // running
  "newsies":                { broadwayPerformances: 1004 },
  "avenue-q":               { broadwayPerformances: 2534 },
  "jesus-christ-superstar": { broadwayPerformances: 711 },
  "evita":                  { broadwayPerformances: 1567 },
  "funny-girl":             { broadwayPerformances: 1348 },
  "gypsy":                  { broadwayPerformances: 702 },
  "pippin":                 { broadwayPerformances: 1944 },
  "come-from-away":         { broadwayPerformances: 1669 },
  "jersey-boys":            { broadwayPerformances: 4642 }
};
