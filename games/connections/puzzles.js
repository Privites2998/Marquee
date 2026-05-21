/* Connections Grid — 3x3 puzzles.
   Each row and column is a CONSTRAINT. A cell is satisfied by an actor who
   meets BOTH the row and column constraint. Each actor can only be used once.

   The actor DB is hand-curated and intentionally small. Players will type
   names that aren't in the DB — those are treated as "not recognized" so the
   game can scale honestly. Expanding the DB is the long-term task.

   Verification: every cell in every puzzle below has at least one actor in
   the DB who satisfies both constraints. Verified by hand.
*/

window.ConnectionsData = (function () {
  // ---------- Actor DB ----------
  // Fields:
  //   shows:    Broadway productions the actor has appeared in (any run/replacement)
  //   obcOf:    Original Broadway Cast productions
  //   tony:     Won a competitive Tony Award (lifetime, any category)
  //   screen:   Has had a notable film or TV role
  //   aliases:  alternate spellings / common shortenings
  const ACTORS = [
    { name: "Idina Menzel",            shows: ["Rent","Wicked","If/Then"],                                     obcOf: ["Rent","Wicked","If/Then"], tony: true,  screen: true, aliases: [] },
    { name: "Lin-Manuel Miranda",      shows: ["In the Heights","Hamilton"],                                   obcOf: ["In the Heights","Hamilton"], tony: true,  screen: true, aliases: ["lin manuel miranda"] },
    { name: "Leslie Odom Jr.",         shows: ["Hamilton","Rent"],                                             obcOf: ["Hamilton"], tony: true,  screen: true, aliases: ["leslie odom jr","leslie odom"] },
    { name: "Renée Elise Goldsberry",  shows: ["Hamilton","Rent","The Lion King","Good People"],               obcOf: ["Hamilton"], tony: true,  screen: true, aliases: ["renee elise goldsberry","renée elise goldsberry"] },
    { name: "Daveed Diggs",            shows: ["Hamilton"],                                                    obcOf: ["Hamilton"], tony: true,  screen: true, aliases: [] },
    { name: "Jonathan Groff",          shows: ["Spring Awakening","Hamilton","Hair","Merrily We Roll Along"],  obcOf: ["Spring Awakening","Merrily We Roll Along"], tony: true,  screen: true, aliases: [] },
    { name: "Phillipa Soo",            shows: ["Hamilton","The Great Comet","Amélie"],                          obcOf: ["Hamilton","Amélie"], tony: false, screen: true, aliases: ["phillipa soo","philippa soo"] },
    { name: "Christopher Jackson",     shows: ["In the Heights","Hamilton"],                                   obcOf: ["In the Heights","Hamilton"], tony: false, screen: true, aliases: [] },
    { name: "Mandy Gonzalez",          shows: ["In the Heights","Hamilton","Wicked"],                          obcOf: ["In the Heights"], tony: false, screen: true, aliases: [] },
    { name: "Kristin Chenoweth",       shows: ["Wicked","You're a Good Man, Charlie Brown","On the Twentieth Century","Promises Promises"], obcOf: ["Wicked"], tony: true,  screen: true, aliases: [] },
    { name: "Norbert Leo Butz",        shows: ["Wicked","Dirty Rotten Scoundrels","Big Fish","Catch Me If You Can"], obcOf: ["Dirty Rotten Scoundrels","Catch Me If You Can"], tony: true,  screen: true, aliases: [] },
    { name: "Joel Grey",               shows: ["Cabaret","Wicked"],                                            obcOf: ["Cabaret"], tony: true,  screen: true, aliases: [] },
    { name: "Adam Pascal",             shows: ["Rent","Aida","Memphis","Chicago"],                             obcOf: ["Rent","Aida"], tony: false, screen: true, aliases: [] },
    { name: "Anthony Rapp",            shows: ["Rent","If/Then","You're a Good Man, Charlie Brown"],           obcOf: ["Rent","If/Then"], tony: false, screen: true, aliases: [] },
    { name: "Wilson Jermaine Heredia", shows: ["Rent"],                                                        obcOf: ["Rent"], tony: true,  screen: true, aliases: ["wilson heredia"] },
    { name: "Megan Hilty",             shows: ["Wicked","9 to 5","Noises Off"],                                obcOf: ["9 to 5"], tony: false, screen: true, aliases: [] },
    { name: "Stephanie J. Block",      shows: ["Wicked","Falsettos","The Cher Show"],                          obcOf: ["The Cher Show"], tony: true,  screen: false, aliases: ["stephanie j block","stephanie block"] },
    { name: "Aaron Tveit",             shows: ["Wicked","Catch Me If You Can","Next to Normal","Moulin Rouge!"], obcOf: ["Catch Me If You Can","Moulin Rouge!","Next to Normal"], tony: true,  screen: true, aliases: [] }
  ];

  // ---------- Constraint catalog ----------
  // Each constraint has a label (what's shown to the player) and a test fn.
  const CONSTRAINTS = {
    wicked:       { label: "Wicked",            test: a => a.shows.includes("Wicked") },
    hamilton:     { label: "Hamilton",          test: a => a.shows.includes("Hamilton") },
    rent:         { label: "Rent",              test: a => a.shows.includes("Rent") },
    inTheHeights: { label: "In the Heights",    test: a => a.shows.includes("In the Heights") },
    tonyWinner:   { label: "Tony winner",       test: a => !!a.tony },
    originatedRole: { label: "OBC of any show", test: a => (a.obcOf || []).length > 0 },
    screenCredit: { label: "Film/TV credit",    test: a => !!a.screen }
  };

  // ---------- Puzzles ----------
  const PUZZLES = [
    {
      id: 1,
      rows: ["wicked", "hamilton", "rent"],
      cols: ["tonyWinner", "originatedRole", "screenCredit"],
      title: "Class of"
    }
  ];

  return { ACTORS, CONSTRAINTS, PUZZLES };
})();
