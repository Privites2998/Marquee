/* Marquee — canonical SHOWS DATABASE.
 *
 * One record per musical: facts, notable cast, and songs in performance order.
 * This is the single source of truth the games and clue-writing should draw
 * from (Now Playing clues, Setlist song orders, Showdown numeric match-ups, a
 * future "name the cast" game, trivia), so a fact is written once and reused.
 *
 * SCHEMA (window.MarqueeShows = [ {...} ]):
 *   id            short slug, lowercase, unique (e.g. "hamilton")
 *   title         display title
 *   aka           alternate titles / search aliases (lowercase)
 *   music         composer(s)
 *   lyrics        lyricist(s)
 *   book          book writer(s)
 *   basedOn       source material, or null if original
 *   broadwayOpen  Broadway opening date "YYYY-MM-DD" (the production described)
 *   broadwayClose Broadway closing date, or null if still running
 *   status        "running" | "closed"
 *   venue         original Broadway theatre for that production
 *   acts          number of acts (1 or 2)
 *   setting       time/place the show is set in
 *   synopsis      neutral one-line premise
 *   teaser        deliberately VAGUE one-liner (good as a Now Playing opener)
 *   cast          [{ role, actor, origin }] notable performers; origin = "original"
 *   songs         principal numbers in PERFORMANCE ORDER (not every reprise)
 *   signatureSong best-known number
 *   pulitzer      true if it won the Pulitzer Prize for Drama
 *   tonyWins      Tony wins for the production described (best-effort; null if unknown/pre-Tony)
 *   awards        notable wins (text)
 *   tags          freeform descriptors ("sung-through", "jukebox", "revival-hit", ...)
 *
 * ACCURACY NOTE: seeded from general knowledge. Core facts (creators, plots,
 * signature songs, original leads, source material) are reliable; EXACT DATES,
 * full cast lists, and tonyWins counts are best-effort and deserve a quick
 * spot-check before publishing. For long-running revivals (e.g. Chicago) the
 * record describes the famous revival, not the original. Grow this file
 * incrementally and keep ids stable, since other data may reference them.
 */
window.MarqueeShows = [
  {
    id: "hamilton",
    title: "Hamilton",
    aka: ["hamilton"],
    music: "Lin-Manuel Miranda",
    lyrics: "Lin-Manuel Miranda",
    book: "Lin-Manuel Miranda",
    basedOn: "Ron Chernow's biography 'Alexander Hamilton'",
    broadwayOpen: "2015-08-06",
    broadwayClose: null,
    status: "running",
    venue: "Richard Rodgers Theatre",
    acts: 2,
    setting: "New York and the U.S., 1776-1804",
    synopsis: "The rise and fall of founding father Alexander Hamilton, told through hip-hop.",
    teaser: "A sung-and-rapped biography of an American founding father.",
    cast: [
      { role: "Alexander Hamilton", actor: "Lin-Manuel Miranda", origin: "original" },
      { role: "Aaron Burr", actor: "Leslie Odom Jr.", origin: "original" },
      { role: "Eliza Hamilton", actor: "Phillipa Soo", origin: "original" },
      { role: "Angelica Schuyler", actor: "Renée Elise Goldsberry", origin: "original" },
      { role: "Lafayette / Jefferson", actor: "Daveed Diggs", origin: "original" },
      { role: "George Washington", actor: "Christopher Jackson", origin: "original" },
      { role: "King George III", actor: "Jonathan Groff", origin: "original" }
    ],
    songs: [
      "Alexander Hamilton", "Aaron Burr, Sir", "My Shot", "The Story of Tonight",
      "The Schuyler Sisters", "You'll Be Back", "Right Hand Man", "Helpless",
      "Satisfied", "Wait for It", "Ten Duel Commandments", "Guns and Ships",
      "Yorktown (The World Turned Upside Down)", "Non-Stop", "What'd I Miss",
      "The Room Where It Happens", "One Last Time", "Hurricane", "Burn",
      "It's Quiet Uptown", "The World Was Wide Enough",
      "Who Lives, Who Dies, Who Tells Your Story"
    ],
    signatureSong: "My Shot",
    pulitzer: true,
    tonyWins: 11,
    awards: ["2016 Pulitzer Prize for Drama", "11 Tony Awards (2016)", "Grammy"],
    tags: ["sung-through", "hip-hop", "historical", "megahit"]
  },
  {
    id: "wicked",
    title: "Wicked",
    aka: ["wicked"],
    music: "Stephen Schwartz",
    lyrics: "Stephen Schwartz",
    book: "Winnie Holzman",
    basedOn: "Gregory Maguire's novel 'Wicked'",
    broadwayOpen: "2003-10-30",
    broadwayClose: null,
    status: "running",
    venue: "Gershwin Theatre",
    acts: 2,
    setting: "The Land of Oz, before and during 'The Wizard of Oz'",
    synopsis: "The untold story of the witches of Oz and an unlikely friendship.",
    teaser: "An untold backstory set in a familiar land of yellow bricks and emerald cities.",
    cast: [
      { role: "Elphaba", actor: "Idina Menzel", origin: "original" },
      { role: "Glinda", actor: "Kristin Chenoweth", origin: "original" },
      { role: "The Wizard", actor: "Joel Grey", origin: "original" },
      { role: "Fiyero", actor: "Norbert Leo Butz", origin: "original" }
    ],
    songs: [
      "No One Mourns the Wicked", "The Wizard and I", "What Is This Feeling?",
      "Dancing Through Life", "Popular", "I'm Not That Girl", "Defying Gravity",
      "Thank Goodness", "Wonderful", "No Good Deed", "For Good"
    ],
    signatureSong: "Defying Gravity",
    pulitzer: false,
    tonyWins: 3,
    awards: ["3 Tony Awards (2004)", "Grammy"],
    tags: ["megahit", "prequel", "running"]
  },
  {
    id: "phantom",
    title: "The Phantom of the Opera",
    aka: ["phantom of the opera", "the phantom of the opera", "phantom"],
    music: "Andrew Lloyd Webber",
    lyrics: "Charles Hart and Richard Stilgoe",
    book: "Andrew Lloyd Webber and Richard Stilgoe",
    basedOn: "Gaston Leroux's novel 'The Phantom of the Opera'",
    broadwayOpen: "1988-01-26",
    broadwayClose: "2023-04-16",
    status: "closed",
    venue: "Majestic Theatre",
    acts: 2,
    setting: "The Paris Opera House, 1880s",
    synopsis: "A disfigured musical genius haunts an opera house and obsesses over a young soprano.",
    teaser: "A masked genius haunts an opera house and obsesses over a young soprano.",
    cast: [
      { role: "The Phantom", actor: "Michael Crawford", origin: "original" },
      { role: "Christine Daaé", actor: "Sarah Brightman", origin: "original" },
      { role: "Raoul", actor: "Steve Barton", origin: "original" }
    ],
    songs: [
      "Think of Me", "Angel of Music", "The Phantom of the Opera",
      "The Music of the Night", "All I Ask of You", "Masquerade",
      "The Point of No Return"
    ],
    signatureSong: "The Music of the Night",
    pulitzer: false,
    tonyWins: 7,
    awards: ["7 Tony Awards (1988)", "longest-running Broadway show"],
    tags: ["sung-through", "longest-running", "romantic"]
  },
  {
    id: "les-mis",
    title: "Les Misérables",
    aka: ["les miserables", "les mis", "les miz"],
    music: "Claude-Michel Schönberg",
    lyrics: "Alain Boublil and Herbert Kretzmer",
    book: "Alain Boublil and Claude-Michel Schönberg",
    basedOn: "Victor Hugo's novel 'Les Misérables'",
    broadwayOpen: "1987-03-12",
    broadwayClose: "2003-05-18",
    status: "closed",
    venue: "Broadway Theatre",
    acts: 2,
    setting: "France, 1815-1832",
    synopsis: "An ex-convict seeks redemption against the backdrop of a failed Paris uprising.",
    teaser: "An ex-convict seeks redemption amid a doomed nineteenth-century uprising.",
    cast: [
      { role: "Jean Valjean", actor: "Colm Wilkinson", origin: "original" },
      { role: "Javert", actor: "Terrence Mann", origin: "original" },
      { role: "Fantine", actor: "Randy Graff", origin: "original" },
      { role: "Éponine", actor: "Frances Ruffelle", origin: "original" }
    ],
    songs: [
      "I Dreamed a Dream", "Castle on a Cloud", "Master of the House",
      "Stars", "Do You Hear the People Sing?", "One Day More",
      "On My Own", "Bring Him Home", "Empty Chairs at Empty Tables"
    ],
    signatureSong: "I Dreamed a Dream",
    pulitzer: false,
    tonyWins: 8,
    awards: ["8 Tony Awards (1987)"],
    tags: ["sung-through", "epic", "revolution"]
  },
  {
    id: "rent",
    title: "Rent",
    aka: ["rent"],
    music: "Jonathan Larson",
    lyrics: "Jonathan Larson",
    book: "Jonathan Larson",
    basedOn: "Puccini's opera 'La Bohème'",
    broadwayOpen: "1996-04-29",
    broadwayClose: "2008-09-07",
    status: "closed",
    venue: "Nederlander Theatre",
    acts: 2,
    setting: "New York City's East Village, ~1989-1990",
    synopsis: "Bohemian artists face love, art, and AIDS over one year.",
    teaser: "Bohemian artists in a gritty downtown face love and loss over a year.",
    cast: [
      { role: "Mark Cohen", actor: "Anthony Rapp", origin: "original" },
      { role: "Roger Davis", actor: "Adam Pascal", origin: "original" },
      { role: "Mimi Márquez", actor: "Daphne Rubin-Vega", origin: "original" },
      { role: "Angel", actor: "Wilson Jermaine Heredia", origin: "original" },
      { role: "Tom Collins", actor: "Jesse L. Martin", origin: "original" },
      { role: "Maureen", actor: "Idina Menzel", origin: "original" }
    ],
    songs: [
      "Rent", "One Song Glory", "Light My Candle", "Today 4 U", "Tango: Maureen",
      "La Vie Bohème", "Seasons of Love", "Take Me or Leave Me", "Without You",
      "What You Own", "Finale B"
    ],
    signatureSong: "Seasons of Love",
    pulitzer: true,
    tonyWins: 4,
    awards: ["1996 Pulitzer Prize for Drama", "4 Tony Awards (1996)"],
    tags: ["rock-musical", "ensemble", "modern-classic"]
  },
  {
    id: "dear-evan-hansen",
    title: "Dear Evan Hansen",
    aka: ["dear evan hansen", "deh"],
    music: "Benj Pasek and Justin Paul",
    lyrics: "Benj Pasek and Justin Paul",
    book: "Steven Levenson",
    basedOn: null,
    broadwayOpen: "2016-12-04",
    broadwayClose: "2022-09-18",
    status: "closed",
    venue: "Music Box Theatre",
    acts: 2,
    setting: "Present-day suburban America",
    synopsis: "An anxious teen's lie about a classmate's death spirals into viral fame.",
    teaser: "An anxious teen's small lie spirals into unexpected fame.",
    cast: [
      { role: "Evan Hansen", actor: "Ben Platt", origin: "original" },
      { role: "Heidi Hansen", actor: "Rachel Bay Jones", origin: "original" },
      { role: "Connor Murphy", actor: "Mike Faist", origin: "original" }
    ],
    songs: [
      "Anybody Have a Map?", "Waving Through a Window", "For Forever",
      "Sincerely, Me", "Requiem", "You Will Be Found", "To Break in a Glove",
      "Words Fail", "So Big / So Small"
    ],
    signatureSong: "Waving Through a Window",
    pulitzer: false,
    tonyWins: 6,
    awards: ["6 Tony Awards (2017)", "Grammy"],
    tags: ["contemporary", "coming-of-age", "pop-score"]
  },
  {
    id: "book-of-mormon",
    title: "The Book of Mormon",
    aka: ["the book of mormon", "book of mormon"],
    music: "Trey Parker, Robert Lopez, Matt Stone",
    lyrics: "Trey Parker, Robert Lopez, Matt Stone",
    book: "Trey Parker, Robert Lopez, Matt Stone",
    basedOn: null,
    broadwayOpen: "2011-03-24",
    broadwayClose: null,
    status: "running",
    venue: "Eugene O'Neill Theatre",
    acts: 2,
    setting: "Salt Lake City and a Ugandan village, present day",
    synopsis: "Two mismatched Mormon missionaries are sent to a struggling village in Uganda.",
    teaser: "Two mismatched missionaries are posted to a struggling African village.",
    cast: [
      { role: "Elder Price", actor: "Andrew Rannells", origin: "original" },
      { role: "Elder Cunningham", actor: "Josh Gad", origin: "original" },
      { role: "Nabulungi", actor: "Nikki M. James", origin: "original" }
    ],
    songs: [
      "Hello!", "Two by Two", "Hasa Diga Eebowai", "Turn It Off",
      "I Am Here for You", "Man Up", "Making Things Up Again",
      "Spooky Mormon Hell Dream", "I Believe", "Tomorrow Is a Latter Day"
    ],
    signatureSong: "I Believe",
    pulitzer: false,
    tonyWins: 9,
    awards: ["9 Tony Awards (2011)", "Grammy"],
    tags: ["comedy", "satire", "running"]
  },
  {
    id: "hadestown",
    title: "Hadestown",
    aka: ["hadestown"],
    music: "Anaïs Mitchell",
    lyrics: "Anaïs Mitchell",
    book: "Anaïs Mitchell",
    basedOn: "Greek myths of Orpheus and Persephone",
    broadwayOpen: "2019-04-17",
    broadwayClose: null,
    status: "running",
    venue: "Walter Kerr Theatre",
    acts: 2,
    setting: "A mythic, Depression-era underworld",
    synopsis: "The intertwined myths of Orpheus and Eurydice and Hades and Persephone.",
    teaser: "Two intertwined myths unfold in a smoky, Depression-era underworld.",
    cast: [
      { role: "Orpheus", actor: "Reeve Carney", origin: "original" },
      { role: "Eurydice", actor: "Eva Noblezada", origin: "original" },
      { role: "Hades", actor: "Patrick Page", origin: "original" },
      { role: "Persephone", actor: "Amber Gray", origin: "original" },
      { role: "Hermes", actor: "André De Shields", origin: "original" }
    ],
    songs: [
      "Road to Hell", "Any Way the Wind Blows", "Wedding Song",
      "Way Down Hadestown", "Wait for Me", "Why We Build the Wall",
      "Epic III", "Doubt Comes In", "Road to Hell (Reprise)"
    ],
    signatureSong: "Wait for Me",
    pulitzer: false,
    tonyWins: 8,
    awards: ["8 Tony Awards (2019)", "Grammy"],
    tags: ["folk-opera", "sung-through", "mythology"]
  },
  {
    id: "into-the-woods",
    title: "Into the Woods",
    aka: ["into the woods"],
    music: "Stephen Sondheim",
    lyrics: "Stephen Sondheim",
    book: "James Lapine",
    basedOn: "Brothers Grimm fairy tales",
    broadwayOpen: "1987-11-05",
    broadwayClose: "1989-09-03",
    status: "closed",
    venue: "Martin Beck Theatre",
    acts: 2,
    setting: "A storybook fairy-tale forest",
    synopsis: "Fairy-tale characters' wishes collide, with darker consequences in Act Two.",
    teaser: "Storybook characters' wishes collide, then curdle after happily-ever-after.",
    cast: [
      { role: "The Witch", actor: "Bernadette Peters", origin: "original" },
      { role: "The Baker's Wife", actor: "Joanna Gleason", origin: "original" },
      { role: "The Baker", actor: "Chip Zien", origin: "original" }
    ],
    songs: [
      "Prologue: Into the Woods", "Hello, Little Girl", "I Know Things Now",
      "A Very Nice Prince", "Agony", "It Takes Two", "Stay with Me",
      "On the Steps of the Palace", "Last Midnight", "No More",
      "No One Is Alone", "Children Will Listen"
    ],
    signatureSong: "Children Will Listen",
    pulitzer: false,
    tonyWins: 3,
    awards: ["3 Tony Awards (1988)"],
    tags: ["sondheim", "fairy-tale", "ensemble"]
  },
  {
    id: "sweeney-todd",
    title: "Sweeney Todd",
    aka: ["sweeney todd", "sweeney todd: the demon barber of fleet street"],
    music: "Stephen Sondheim",
    lyrics: "Stephen Sondheim",
    book: "Hugh Wheeler",
    basedOn: "Christopher Bond's play 'Sweeney Todd'",
    broadwayOpen: "1979-03-01",
    broadwayClose: "1980-06-29",
    status: "closed",
    venue: "Uris Theatre",
    acts: 2,
    setting: "Victorian London",
    synopsis: "A vengeful barber and a pie-maker turn murder into a grisly enterprise.",
    teaser: "A vengeful barber and a resourceful pie-maker turn murder into enterprise.",
    cast: [
      { role: "Sweeney Todd", actor: "Len Cariou", origin: "original" },
      { role: "Mrs. Lovett", actor: "Angela Lansbury", origin: "original" }
    ],
    songs: [
      "The Ballad of Sweeney Todd", "The Worst Pies in London", "Poor Thing",
      "My Friends", "Green Finch and Linnet Bird", "Johanna", "Pretty Women",
      "Epiphany", "A Little Priest", "God, That's Good!", "Not While I'm Around",
      "Final Sequence"
    ],
    signatureSong: "Not While I'm Around",
    pulitzer: false,
    tonyWins: 8,
    awards: ["8 Tony Awards (1979)"],
    tags: ["sondheim", "thriller", "dark-comedy"]
  },
  {
    id: "chicago",
    title: "Chicago",
    aka: ["chicago"],
    music: "John Kander",
    lyrics: "Fred Ebb",
    book: "Fred Ebb and Bob Fosse",
    basedOn: "Maurine Dallas Watkins's 1926 play 'Chicago'",
    broadwayOpen: "1996-11-14",
    broadwayClose: null,
    status: "running",
    venue: "Ambassador Theatre",
    acts: 2,
    setting: "Chicago, the Roaring Twenties",
    synopsis: "Two murderesses chase fame and acquittal in jazz-age Chicago. (Long-running 1996 revival.)",
    teaser: "Two merry murderesses chase fame and acquittal in a jazz-age city.",
    cast: [
      { role: "Roxie Hart", actor: "Ann Reinking", origin: "1996 revival" },
      { role: "Velma Kelly", actor: "Bebe Neuwirth", origin: "1996 revival" },
      { role: "Billy Flynn", actor: "James Naughton", origin: "1996 revival" },
      { role: "Amos Hart", actor: "Joel Grey", origin: "1996 revival" }
    ],
    songs: [
      "All That Jazz", "Funny Honey", "Cell Block Tango", "When You're Good to Mama",
      "All I Care About", "Roxie", "Mister Cellophane", "Razzle Dazzle", "Class", "Nowadays"
    ],
    signatureSong: "All That Jazz",
    pulitzer: false,
    tonyWins: 6,
    awards: ["6 Tony Awards (1997 revival)"],
    tags: ["fosse", "vaudeville", "revival-hit", "running"]
  },
  {
    id: "cats",
    title: "Cats",
    aka: ["cats"],
    music: "Andrew Lloyd Webber",
    lyrics: "T.S. Eliot (and Trevor Nunn)",
    book: "Andrew Lloyd Webber (from T.S. Eliot)",
    basedOn: "T.S. Eliot's 'Old Possum's Book of Practical Cats'",
    broadwayOpen: "1982-10-07",
    broadwayClose: "2000-09-10",
    status: "closed",
    venue: "Winter Garden Theatre",
    acts: 2,
    setting: "A junkyard, over the night of the Jellicle Ball",
    synopsis: "A tribe of cats gathers to choose one to be reborn.",
    teaser: "A tribe of singing felines gathers for one fateful night.",
    cast: [
      { role: "Grizabella", actor: "Betty Buckley", origin: "original" }
    ],
    songs: [
      "Jellicle Songs for Jellicle Cats", "The Naming of Cats", "The Old Gumbie Cat",
      "The Rum Tum Tugger", "Grizabella the Glamour Cat", "Mr. Mistoffelees",
      "Memory", "The Journey to the Heaviside Layer"
    ],
    signatureSong: "Memory",
    pulitzer: false,
    tonyWins: 7,
    awards: ["7 Tony Awards (1983)"],
    tags: ["sung-through", "dance", "spectacle"]
  },
  {
    id: "lion-king",
    title: "The Lion King",
    aka: ["the lion king", "lion king"],
    music: "Elton John (and Lebo M, Hans Zimmer)",
    lyrics: "Tim Rice",
    book: "Roger Allers and Irene Mecchi",
    basedOn: "Disney's 1994 animated film 'The Lion King'",
    broadwayOpen: "1997-11-13",
    broadwayClose: null,
    status: "running",
    venue: "New Amsterdam Theatre",
    acts: 2,
    setting: "The African Pride Lands",
    synopsis: "A lion cub flees his kingdom and returns to reclaim his throne.",
    teaser: "A young heir flees his kingdom and must return to claim his birthright.",
    cast: [
      { role: "Simba", actor: "Jason Raize", origin: "original" },
      { role: "Nala", actor: "Heather Headley", origin: "original" },
      { role: "Mufasa", actor: "Samuel E. Wright", origin: "original" },
      { role: "Scar", actor: "John Vickery", origin: "original" },
      { role: "Rafiki", actor: "Tsidii Le Loka", origin: "original" }
    ],
    songs: [
      "Circle of Life", "I Just Can't Wait to Be King", "Be Prepared",
      "Hakuna Matata", "Shadowland", "Endless Night",
      "Can You Feel the Love Tonight", "He Lives in You"
    ],
    signatureSong: "Circle of Life",
    pulitzer: false,
    tonyWins: 6,
    awards: ["6 Tony Awards (1998)", "director Julie Taymor, first woman to win for a musical"],
    tags: ["disney", "spectacle", "puppetry", "running"]
  },
  {
    id: "cabaret",
    title: "Cabaret",
    aka: ["cabaret"],
    music: "John Kander",
    lyrics: "Fred Ebb",
    book: "Joe Masteroff",
    basedOn: "Christopher Isherwood's 'Berlin Stories' (via the play 'I Am a Camera')",
    broadwayOpen: "1966-11-20",
    broadwayClose: "1969-09-06",
    status: "closed",
    venue: "Broadhurst Theatre",
    acts: 2,
    setting: "Berlin, 1929-1930, as the Nazis rise",
    synopsis: "Decadence and denial at a seedy nightclub as Weimar Germany darkens.",
    teaser: "Decadence and denial at a seedy nightclub as a dark tide rises.",
    cast: [
      { role: "Sally Bowles", actor: "Jill Haworth", origin: "original" },
      { role: "The Emcee", actor: "Joel Grey", origin: "original" },
      { role: "Fräulein Schneider", actor: "Lotte Lenya", origin: "original" }
    ],
    songs: [
      "Willkommen", "Don't Tell Mama", "Two Ladies", "Money",
      "Tomorrow Belongs to Me", "Cabaret"
    ],
    signatureSong: "Cabaret",
    pulitzer: false,
    tonyWins: 8,
    awards: ["8 Tony Awards (1967)"],
    tags: ["kander-and-ebb", "weimar", "concept-musical"]
  },
  {
    id: "west-side-story",
    title: "West Side Story",
    aka: ["west side story"],
    music: "Leonard Bernstein",
    lyrics: "Stephen Sondheim",
    book: "Arthur Laurents",
    basedOn: "Shakespeare's 'Romeo and Juliet'",
    broadwayOpen: "1957-09-26",
    broadwayClose: "1959-06-27",
    status: "closed",
    venue: "Winter Garden Theatre",
    acts: 2,
    setting: "The Upper West Side of New York City, 1950s",
    synopsis: "Rival gangs and star-crossed lovers in 1950s Manhattan.",
    teaser: "Star-crossed lovers caught between two warring street gangs.",
    cast: [
      { role: "Maria", actor: "Carol Lawrence", origin: "original" },
      { role: "Tony", actor: "Larry Kert", origin: "original" },
      { role: "Anita", actor: "Chita Rivera", origin: "original" }
    ],
    songs: [
      "Something's Coming", "Maria", "Tonight", "America", "Cool",
      "One Hand, One Heart", "I Feel Pretty", "Somewhere", "Gee, Officer Krupke"
    ],
    signatureSong: "Tonight",
    pulitzer: false,
    tonyWins: 2,
    awards: ["2 Tony Awards (1958)", "Jerome Robbins choreography"],
    tags: ["dance", "tragedy", "bernstein"]
  },
  {
    id: "fiddler",
    title: "Fiddler on the Roof",
    aka: ["fiddler on the roof", "fiddler"],
    music: "Jerry Bock",
    lyrics: "Sheldon Harnick",
    book: "Joseph Stein",
    basedOn: "Sholem Aleichem's 'Tevye the Dairyman' stories",
    broadwayOpen: "1964-09-22",
    broadwayClose: "1972-07-02",
    status: "closed",
    venue: "Imperial Theatre",
    acts: 2,
    setting: "The Jewish village of Anatevka in Tsarist Russia, 1905",
    synopsis: "A milkman clings to tradition as his daughters and the world change.",
    teaser: "A devout milkman clings to tradition as his daughters defy it.",
    cast: [
      { role: "Tevye", actor: "Zero Mostel", origin: "original" },
      { role: "Golde", actor: "Maria Karnilova", origin: "original" },
      { role: "Yente", actor: "Beatrice Arthur", origin: "original" }
    ],
    songs: [
      "Tradition", "Matchmaker, Matchmaker", "If I Were a Rich Man", "To Life",
      "Sunrise, Sunset", "Do You Love Me?", "Anatevka"
    ],
    signatureSong: "If I Were a Rich Man",
    pulitzer: false,
    tonyWins: 9,
    awards: ["9 Tony Awards (1965)"],
    tags: ["golden-age", "ensemble", "tradition"]
  },
  {
    id: "a-chorus-line",
    title: "A Chorus Line",
    aka: ["a chorus line", "chorus line"],
    music: "Marvin Hamlisch",
    lyrics: "Edward Kleban",
    book: "James Kirkwood Jr. and Nicholas Dante",
    basedOn: "Taped interviews with real Broadway dancers",
    broadwayOpen: "1975-07-25",
    broadwayClose: "1990-04-28",
    status: "closed",
    venue: "Shubert Theatre",
    acts: 1,
    setting: "A bare Broadway stage during an audition, 1975",
    synopsis: "Dancers bare their lives competing for spots in a chorus.",
    teaser: "Dancers lay their lives bare while competing at one audition.",
    cast: [
      { role: "Cassie", actor: "Donna McKechnie", origin: "original" },
      { role: "Diana Morales", actor: "Priscilla Lopez", origin: "original" }
    ],
    songs: [
      "I Hope I Get It", "At the Ballet", "Nothing", "The Music and the Mirror",
      "What I Did for Love", "One"
    ],
    signatureSong: "One",
    pulitzer: true,
    tonyWins: 9,
    awards: ["1976 Pulitzer Prize for Drama", "9 Tony Awards (1976)"],
    tags: ["dance", "backstage", "one-act"]
  },
  {
    id: "sound-of-music",
    title: "The Sound of Music",
    aka: ["the sound of music", "sound of music"],
    music: "Richard Rodgers",
    lyrics: "Oscar Hammerstein II",
    book: "Howard Lindsay and Russel Crouse",
    basedOn: "Maria von Trapp's memoir",
    broadwayOpen: "1959-11-16",
    broadwayClose: "1963-06-15",
    status: "closed",
    venue: "Lunt-Fontanne Theatre",
    acts: 2,
    setting: "Austria, 1938, on the eve of the Anschluss",
    synopsis: "A would-be nun becomes governess to a widowed captain's seven children.",
    teaser: "A free spirit becomes governess to a stern captain's seven children.",
    cast: [
      { role: "Maria", actor: "Mary Martin", origin: "original" },
      { role: "Captain von Trapp", actor: "Theodore Bikel", origin: "original" },
      { role: "Mother Abbess", actor: "Patricia Neway", origin: "original" }
    ],
    songs: [
      "The Sound of Music", "My Favorite Things", "Do-Re-Mi",
      "Sixteen Going on Seventeen", "The Lonely Goatherd", "Climb Ev'ry Mountain",
      "Edelweiss", "So Long, Farewell"
    ],
    signatureSong: "Do-Re-Mi",
    pulitzer: false,
    tonyWins: 5,
    awards: ["5 Tony Awards (1960, shared Best Musical)"],
    tags: ["rodgers-and-hammerstein", "family", "golden-age"]
  },
  {
    id: "oklahoma",
    title: "Oklahoma!",
    aka: ["oklahoma", "oklahoma!"],
    music: "Richard Rodgers",
    lyrics: "Oscar Hammerstein II",
    book: "Oscar Hammerstein II",
    basedOn: "Lynn Riggs's play 'Green Grow the Lilacs'",
    broadwayOpen: "1943-03-31",
    broadwayClose: "1948-05-29",
    status: "closed",
    venue: "St. James Theatre",
    acts: 2,
    setting: "Indian Territory (Oklahoma), just after 1900",
    synopsis: "Cowboys and farmers and a love triangle in a territory about to become a state.",
    teaser: "Cowboys and farmers feud and fall in love in a soon-to-be state.",
    cast: [
      { role: "Curly", actor: "Alfred Drake", origin: "original" },
      { role: "Laurey", actor: "Joan Roberts", origin: "original" },
      { role: "Ado Annie", actor: "Celeste Holm", origin: "original" }
    ],
    songs: [
      "Oh, What a Beautiful Mornin'", "The Surrey with the Fringe on Top",
      "I Cain't Say No", "People Will Say We're in Love", "Oklahoma"
    ],
    signatureSong: "Oh, What a Beautiful Mornin'",
    pulitzer: false,
    tonyWins: null,
    awards: ["Special Pulitzer citation (1944)", "opened before the Tony Awards existed"],
    tags: ["rodgers-and-hammerstein", "landmark", "golden-age"]
  },
  {
    id: "guys-and-dolls",
    title: "Guys and Dolls",
    aka: ["guys and dolls"],
    music: "Frank Loesser",
    lyrics: "Frank Loesser",
    book: "Jo Swerling and Abe Burrows",
    basedOn: "Damon Runyon's short stories",
    broadwayOpen: "1950-11-24",
    broadwayClose: "1953-11-28",
    status: "closed",
    venue: "46th Street Theatre",
    acts: 2,
    setting: "Damon Runyon's mythical New York",
    synopsis: "Gamblers, showgirls, and missionaries collide in a fairy tale of old New York.",
    teaser: "Gamblers and a mission doll in a fairy tale of old Broadway.",
    cast: [
      { role: "Sky Masterson", actor: "Robert Alda", origin: "original" },
      { role: "Miss Adelaide", actor: "Vivian Blaine", origin: "original" },
      { role: "Nathan Detroit", actor: "Sam Levene", origin: "original" },
      { role: "Sarah Brown", actor: "Isabel Bigley", origin: "original" }
    ],
    songs: [
      "Fugue for Tinhorns", "A Bushel and a Peck", "I'll Know", "If I Were a Bell",
      "I've Never Been in Love Before", "Luck Be a Lady", "Sue Me",
      "Sit Down, You're Rockin' the Boat"
    ],
    signatureSong: "Luck Be a Lady",
    pulitzer: false,
    tonyWins: 5,
    awards: ["1951 Tony Award for Best Musical"],
    tags: ["golden-age", "comedy", "loesser"]
  },
  {
    id: "annie",
    title: "Annie",
    aka: ["annie"],
    music: "Charles Strouse",
    lyrics: "Martin Charnin",
    book: "Thomas Meehan",
    basedOn: "Harold Gray's comic strip 'Little Orphan Annie'",
    broadwayOpen: "1977-04-21",
    broadwayClose: "1983-01-02",
    status: "closed",
    venue: "Alvin Theatre",
    acts: 2,
    setting: "New York City, 1933, the Great Depression",
    synopsis: "An orphan's optimism wins over a billionaire during the Depression.",
    teaser: "A plucky orphan's optimism melts a billionaire's heart in hard times.",
    cast: [
      { role: "Annie", actor: "Andrea McArdle", origin: "original" },
      { role: "Miss Hannigan", actor: "Dorothy Loudon", origin: "original" },
      { role: "Oliver Warbucks", actor: "Reid Shelton", origin: "original" }
    ],
    songs: [
      "Maybe", "It's the Hard-Knock Life", "Tomorrow", "Little Girls",
      "N.Y.C.", "Easy Street", "I Don't Need Anything but You"
    ],
    signatureSong: "Tomorrow",
    pulitzer: false,
    tonyWins: 7,
    awards: ["7 Tony Awards (1977)"],
    tags: ["family", "depression-era", "comic-strip"]
  },
  {
    id: "in-the-heights",
    title: "In the Heights",
    aka: ["in the heights"],
    music: "Lin-Manuel Miranda",
    lyrics: "Lin-Manuel Miranda",
    book: "Quiara Alegría Hudes",
    basedOn: null,
    broadwayOpen: "2008-03-09",
    broadwayClose: "2011-01-09",
    status: "closed",
    venue: "Richard Rodgers Theatre",
    acts: 2,
    setting: "Washington Heights, New York City, over a hot July weekend",
    synopsis: "A tight-knit Latino neighborhood chases its dreams over a sweltering weekend.",
    teaser: "A tight-knit Latino neighborhood chases its dreams over a hot weekend.",
    cast: [
      { role: "Usnavi", actor: "Lin-Manuel Miranda", origin: "original" },
      { role: "Nina Rosario", actor: "Mandy Gonzalez", origin: "original" },
      { role: "Benny", actor: "Christopher Jackson", origin: "original" },
      { role: "Abuela Claudia", actor: "Olga Merediz", origin: "original" }
    ],
    songs: [
      "In the Heights", "Breathe", "96,000", "Paciencia y Fe",
      "Blackout", "Carnaval del Barrio", "Finale"
    ],
    signatureSong: "In the Heights",
    pulitzer: false,
    tonyWins: 4,
    awards: ["4 Tony Awards (2008)", "Best Musical and Best Score"],
    tags: ["miranda", "latin", "contemporary"]
  }
];
