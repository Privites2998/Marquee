/* Connections Grid — 3x3 puzzles.
   Each row and column is a CONSTRAINT. A cell is satisfied by an actor who
   meets BOTH the row and column constraint. Each actor can only be used once.

   The actor DB has been hand-curated. Players will type names that aren't
   in the DB — those are treated as "not recognized" rather than rejected.

   Verification: every cell in every puzzle below has at least one actor in
   the DB who satisfies both constraints. The preview/validate tool flags
   any cell with 0 valid actors.
*/

window.ConnectionsData = (function () {

  // ---------- Show sets (used by category constraints) ----------
  const SONDHEIM_SHOWS = new Set([
    "Sweeney Todd","Sunday in the Park with George","Into the Woods",
    "Company","Follies","A Little Night Music","Merrily We Roll Along",
    "Assassins","Passion","Pacific Overtures","Anyone Can Whistle"
  ]);

  const DISNEY_SHOWS = new Set([
    "Beauty and the Beast","The Lion King","Aida","Tarzan","Mary Poppins",
    "The Little Mermaid","Newsies","Aladdin","Frozen"
  ]);

  // Shows with 5,000+ original-run Broadway performances (closed) OR still
  // running long enough to clear that bar. Conservative list.
  const LONG_RUNNERS = new Set([
    "The Phantom of the Opera","Chicago","The Lion King","Cats","Wicked",
    "Les Misérables","A Chorus Line","Mamma Mia!","Beauty and the Beast",
    "Rent","The Book of Mormon"
  ]);

  // ---------- Actor DB ----------
  // Fields:
  //   shows:   Broadway productions the actor has appeared in (any run)
  //   obcOf:   Original Broadway Cast productions
  //   tony:    Won at least one competitive Tony Award
  //   screen:  Has a notable film or TV role
  //   grammy:  Has won a Grammy (incl. cast album wins)
  //   aliases: alternate spellings / common shortenings
  const ACTORS = [
    // -- existing 18 --
    { name: "Idina Menzel",            shows: ["Rent","Wicked","If/Then"],                                                                                   obcOf: ["Rent","Wicked","If/Then"], tony: true,  screen: true, grammy: true,  aliases: [] },
    { name: "Lin-Manuel Miranda",      shows: ["In the Heights","Hamilton"],                                                                                  obcOf: ["In the Heights","Hamilton"], tony: true, screen: true, grammy: true, aliases: ["lin manuel miranda"] },
    { name: "Leslie Odom Jr.",         shows: ["Hamilton","Rent"],                                                                                            obcOf: ["Hamilton"], tony: true, screen: true, grammy: true, aliases: ["leslie odom jr","leslie odom"] },
    { name: "Renée Elise Goldsberry",  shows: ["Hamilton","Rent","The Lion King","Good People"],                                                              obcOf: ["Hamilton"], tony: true, screen: true, grammy: true, aliases: ["renee elise goldsberry"] },
    { name: "Daveed Diggs",            shows: ["Hamilton"],                                                                                                   obcOf: ["Hamilton"], tony: true, screen: true, grammy: true, aliases: [] },
    { name: "Jonathan Groff",          shows: ["Spring Awakening","Hamilton","Hair","Merrily We Roll Along"],                                                 obcOf: ["Spring Awakening","Merrily We Roll Along"], tony: true, screen: true, grammy: false, aliases: [] },
    { name: "Phillipa Soo",            shows: ["Hamilton","The Great Comet","Amélie"],                                                                         obcOf: ["Hamilton","Amélie"], tony: false, screen: true, grammy: true, aliases: ["philippa soo"] },
    { name: "Christopher Jackson",     shows: ["In the Heights","Hamilton"],                                                                                  obcOf: ["In the Heights","Hamilton"], tony: false, screen: true, grammy: true, aliases: [] },
    { name: "Mandy Gonzalez",          shows: ["In the Heights","Hamilton","Wicked"],                                                                         obcOf: ["In the Heights"], tony: false, screen: true, grammy: false, aliases: [] },
    { name: "Kristin Chenoweth",       shows: ["Wicked","You're a Good Man, Charlie Brown","On the Twentieth Century","Promises Promises"],                  obcOf: ["Wicked"], tony: true, screen: true, grammy: false, aliases: [] },
    { name: "Norbert Leo Butz",        shows: ["Wicked","Dirty Rotten Scoundrels","Big Fish","Catch Me If You Can"],                                          obcOf: ["Dirty Rotten Scoundrels","Catch Me If You Can"], tony: true, screen: true, grammy: false, aliases: [] },
    { name: "Joel Grey",               shows: ["Cabaret","Wicked"],                                                                                            obcOf: ["Cabaret"], tony: true, screen: true, grammy: false, aliases: [] },
    { name: "Adam Pascal",             shows: ["Rent","Aida","Memphis","Chicago"],                                                                            obcOf: ["Rent","Aida"], tony: false, screen: true, grammy: false, aliases: [] },
    { name: "Anthony Rapp",            shows: ["Rent","If/Then","You're a Good Man, Charlie Brown"],                                                          obcOf: ["Rent","If/Then"], tony: false, screen: true, grammy: false, aliases: [] },
    { name: "Wilson Jermaine Heredia", shows: ["Rent"],                                                                                                       obcOf: ["Rent"], tony: true, screen: true, grammy: false, aliases: ["wilson heredia"] },
    { name: "Megan Hilty",             shows: ["Wicked","9 to 5","Noises Off"],                                                                                obcOf: ["9 to 5"], tony: false, screen: true, grammy: false, aliases: [] },
    { name: "Stephanie J. Block",      shows: ["Wicked","Falsettos","The Cher Show"],                                                                          obcOf: ["The Cher Show"], tony: true, screen: false, grammy: false, aliases: ["stephanie block"] },
    { name: "Aaron Tveit",             shows: ["Wicked","Catch Me If You Can","Next to Normal","Moulin Rouge!"],                                              obcOf: ["Catch Me If You Can","Moulin Rouge!","Next to Normal"], tony: true, screen: true, grammy: false, aliases: [] },

    // -- 20 new actors --
    { name: "Audra McDonald",          shows: ["Carousel","Ragtime","Marie Christine","Master Class","Lady Day at Emerson's Bar and Grill","The Gershwins' Porgy and Bess","Shuffle Along","A Raisin in the Sun","110 in the Shade","Frankie and Johnny in the Clair de Lune"], obcOf: ["Marie Christine","Lady Day at Emerson's Bar and Grill","Shuffle Along"], tony: true, screen: true, grammy: true, aliases: ["audra mcdonald"] },
    { name: "Patti LuPone",            shows: ["Evita","Anything Goes","Sunset Boulevard","Gypsy","Sweeney Todd","Company"],                                  obcOf: ["Evita"], tony: true, screen: true, grammy: true, aliases: ["patti lupone"] },
    { name: "Bernadette Peters",       shows: ["Sunday in the Park with George","Into the Woods","Annie Get Your Gun","Hello, Dolly!","Gypsy","A Little Night Music","Song and Dance","Mack and Mabel","Follies"], obcOf: ["Sunday in the Park with George","Into the Woods","Song and Dance","Mack and Mabel"], tony: true, screen: true, grammy: false, aliases: ["bernadette peters"] },
    { name: "Sutton Foster",           shows: ["Anything Goes","Thoroughly Modern Millie","The Music Man","Little Women","Shrek the Musical","Violet","Young Frankenstein"], obcOf: ["Thoroughly Modern Millie","Little Women","Shrek the Musical","Violet","Young Frankenstein"], tony: true, screen: true, grammy: false, aliases: ["sutton foster"] },
    { name: "Lea Salonga",             shows: ["Miss Saigon","Les Misérables","Flower Drum Song","Once on This Island","Here Lies Love","Allegiance"],         obcOf: ["Miss Saigon","Flower Drum Song","Allegiance","Here Lies Love"], tony: true, screen: true, grammy: false, aliases: ["lea salonga"] },
    { name: "Hugh Jackman",            shows: ["The Boy from Oz","The Music Man"],                                                                             obcOf: ["The Boy from Oz"], tony: true, screen: true, grammy: false, aliases: ["hugh jackman"] },
    { name: "Ben Platt",               shows: ["Dear Evan Hansen","Parade","The Book of Mormon"],                                                              obcOf: ["Dear Evan Hansen"], tony: true, screen: true, grammy: true, aliases: ["ben platt"] },
    { name: "Andrew Rannells",         shows: ["The Book of Mormon","Hairspray","Jersey Boys","Hedwig and the Angry Inch","Falsettos","The Boys in the Band"], obcOf: ["The Book of Mormon"], tony: false, screen: true, grammy: true, aliases: ["andrew rannells"] },
    { name: "Cynthia Erivo",           shows: ["The Color Purple"],                                                                                            obcOf: [], tony: true, screen: true, grammy: true, aliases: ["cynthia erivo"] },
    { name: "Sara Bareilles",          shows: ["Waitress","Into the Woods"],                                                                                    obcOf: [], tony: false, screen: true, grammy: true, aliases: ["sara bareilles"] },
    { name: "Jessie Mueller",          shows: ["Beautiful: The Carole King Musical","Waitress","Carousel","On a Clear Day You Can See Forever","The Mystery of Edwin Drood"], obcOf: ["Beautiful: The Carole King Musical","Waitress"], tony: true, screen: false, grammy: false, aliases: ["jessie mueller"] },
    { name: "Heather Headley",         shows: ["Aida","The Lion King","The Color Purple"],                                                                     obcOf: ["Aida","The Lion King"], tony: true, screen: true, grammy: true, aliases: ["heather headley"] },
    { name: "Chita Rivera",            shows: ["West Side Story","Bye Bye Birdie","Chicago","Sweet Charity","The Rink","Kiss of the Spider Woman","Nine","The Visit"], obcOf: ["West Side Story","Bye Bye Birdie","Chicago","The Rink","Kiss of the Spider Woman","The Visit"], tony: true, screen: true, grammy: false, aliases: ["chita rivera"] },
    { name: "Liza Minnelli",           shows: ["Flora the Red Menace","The Act","The Rink"],                                                                   obcOf: ["Flora the Red Menace","The Act","The Rink"], tony: true, screen: true, grammy: true, aliases: ["liza minnelli"] },
    { name: "Nathan Lane",             shows: ["Guys and Dolls","A Funny Thing Happened on the Way to the Forum","The Producers","The Frogs","The Iceman Cometh","Angels in America","The Nance"], obcOf: ["The Producers","The Frogs","The Nance"], tony: true, screen: true, grammy: false, aliases: ["nathan lane"] },
    { name: "Matthew Broderick",       shows: ["Brighton Beach Memoirs","How to Succeed in Business Without Really Trying","The Producers","The Odd Couple"], obcOf: ["Brighton Beach Memoirs","The Producers"], tony: true, screen: true, grammy: false, aliases: ["matthew broderick"] },
    { name: "Brian Stokes Mitchell",   shows: ["Ragtime","Kiss Me, Kate","Man of La Mancha","Women on the Verge of a Nervous Breakdown","Shuffle Along"],      obcOf: ["Ragtime"], tony: true, screen: true, grammy: false, aliases: ["brian stokes mitchell"] },
    { name: "Christine Ebersole",      shows: ["On the Twentieth Century","42nd Street","Grey Gardens","War Paint"],                                          obcOf: ["Grey Gardens","War Paint"], tony: true, screen: true, grammy: false, aliases: ["christine ebersole"] },
    { name: "Caissie Levy",            shows: ["Frozen","Wicked","Les Misérables","Hair","Hairspray","Ghost"],                                                obcOf: ["Frozen","Ghost"], tony: false, screen: false, grammy: false, aliases: ["caissie levy"] },
    { name: "Jeremy Jordan",           shows: ["Newsies","Bonnie & Clyde","West Side Story","Waitress","Rock of Ages"],                                       obcOf: ["Newsies","Bonnie & Clyde"], tony: false, screen: true, grammy: false, aliases: ["jeremy jordan"] }
  ];

  // ---------- Constraint catalog ----------
  const CONSTRAINTS = {
    // Specific-show constraints
    wicked:       { label: "Wicked",            test: a => a.shows.includes("Wicked") },
    hamilton:     { label: "Hamilton",          test: a => a.shows.includes("Hamilton") },
    rent:         { label: "Rent",              test: a => a.shows.includes("Rent") },
    inTheHeights: { label: "In the Heights",    test: a => a.shows.includes("In the Heights") },
    bookOfMormon: { label: "Book of Mormon",    test: a => a.shows.includes("The Book of Mormon") },

    // Category constraints
    sondheim:     { label: "Sondheim show",     test: a => a.shows.some(s => SONDHEIM_SHOWS.has(s)) },
    disney:       { label: "Disney show",       test: a => a.shows.some(s => DISNEY_SHOWS.has(s)) },
    longRunner:   { label: "5000+ perf run",    test: a => a.shows.some(s => LONG_RUNNERS.has(s)) },

    // Award / industry constraints
    tonyWinner:   { label: "Tony winner",       test: a => !!a.tony },
    originatedRole: { label: "OBC of any show", test: a => (a.obcOf || []).length > 0 },
    screenCredit: { label: "Film/TV credit",    test: a => !!a.screen },
    grammyWinner: { label: "Grammy winner",     test: a => !!a.grammy }
  };

  // ---------- Puzzles ----------
  const PUZZLES = [
    {
      id: 1,
      title: "Class of",
      rows: ["wicked", "hamilton", "rent"],
      cols: ["tonyWinner", "originatedRole", "screenCredit"]
    },
    {
      id: 2,
      title: "Across Disciplines",
      rows: ["sondheim", "disney", "longRunner"],
      cols: ["tonyWinner", "screenCredit", "grammyWinner"]
    },
    {
      id: 3,
      title: "Lifers",
      rows: ["sondheim", "longRunner", "disney"],
      cols: ["tonyWinner", "originatedRole", "grammyWinner"]
    },
    {
      id: 4,
      title: "Crossover",
      rows: ["hamilton", "wicked", "sondheim"],
      cols: ["grammyWinner", "screenCredit", "tonyWinner"]
    }
  ];

  return { ACTORS, CONSTRAINTS, PUZZLES };
})();
