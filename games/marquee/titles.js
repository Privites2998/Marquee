/* Marquee — the namesake headliner.
   Daily puzzle = a Broadway title up in lights, letters scrambled. The player
   rearranges the bulbs to spell the title.

   This is a GENERATABLE game: the daily scramble is derived from dayIndex, so
   the only content is this title list. Add titles to extend the rotation —
   the game auto-handles word structure, scrambling, and slots.

   Guidelines for entries:
   - `title`: the real, display-cased title. Letters + spaces solve cleanly;
     punctuation (! , ' -) is stripped for the letter tiles but kept in display.
   - Keep solvable: <= ~16 letters and <= 4 words works best.
   - `hint`: short, spoiler-light category/vibe (no need for hard facts).
   - `difficulty`: 1 easy · 2 medium · 3 hard (length/obscurity).
*/
window.MarqueeTitles = [
  { id: 1,  title: "Wicked",              hint: "Two witches of Oz",                 difficulty: 1 },
  { id: 2,  title: "Hamilton",            hint: "Founding father, hip-hop",          difficulty: 1 },
  { id: 3,  title: "Cats",                hint: "Jellicle felines",                  difficulty: 1 },
  { id: 4,  title: "Rent",                hint: "525,600 minutes",                   difficulty: 1 },
  { id: 5,  title: "Chicago",             hint: "Razzle dazzle, merry murderesses",  difficulty: 1 },
  { id: 6,  title: "Hadestown",           hint: "Way down under the ground",         difficulty: 2 },
  { id: 7,  title: "Annie",               hint: "Tomorrow, tomorrow",                difficulty: 1 },
  { id: 8,  title: "Oklahoma",            hint: "Where the wind comes sweeping",     difficulty: 2 },
  { id: 9,  title: "Carousel",            hint: "Rodgers & Hammerstein carnival",    difficulty: 2 },
  { id: 10, title: "Pippin",             hint: "Magic to do, a Fosse classic",      difficulty: 2 },
  { id: 11, title: "Gypsy",               hint: "Everything's coming up roses",      difficulty: 1 },
  { id: 12, title: "Company",             hint: "Bobby, being alive",                difficulty: 2 },
  { id: 13, title: "Follies",             hint: "Sondheim, faded showgirls",         difficulty: 2 },
  { id: 14, title: "Cabaret",             hint: "Life is a... at the Kit Kat Klub",  difficulty: 2 },
  { id: 15, title: "Hair",                hint: "The tribal love-rock musical",      difficulty: 1 },
  { id: 16, title: "Grease",              hint: "Rydell High, summer nights",        difficulty: 1 },
  { id: 17, title: "Newsies",             hint: "Seize the day, paper boys",         difficulty: 2 },
  { id: 18, title: "Aida",                hint: "Elton John, Egypt",                 difficulty: 1 },
  { id: 19, title: "Waitress",            hint: "Sara Bareilles, sugar & butter",    difficulty: 2 },
  { id: 20, title: "Six",                 hint: "Henry VIII's queens, pop concert",  difficulty: 1 },
  { id: 21, title: "Once",                hint: "Guy, Girl, and a guitar",           difficulty: 1 },
  { id: 22, title: "Falsettos",           hint: "A tight-knit family, William Finn", difficulty: 3 },
  { id: 23, title: "Ragtime",             hint: "Turn-of-the-century America",       difficulty: 2 },
  { id: 24, title: "Parade",              hint: "Jason Robert Brown, a trial",       difficulty: 2 },
  { id: 25, title: "Sweeney Todd",        hint: "The demon barber of Fleet Street",  difficulty: 3 },
  { id: 26, title: "Into the Woods",      hint: "Sondheim's tangled fairy tales",    difficulty: 3 },
  { id: 27, title: "Les Miserables",      hint: "Do you hear the people sing?",      difficulty: 3 },
  { id: 28, title: "Miss Saigon",         hint: "A helicopter, a love story",        difficulty: 3 },
  { id: 29, title: "Mamma Mia",           hint: "ABBA jukebox on a Greek isle",      difficulty: 2 },
  { id: 30, title: "Jersey Boys",         hint: "The Four Seasons' story",           difficulty: 2 },
  { id: 31, title: "Kinky Boots",         hint: "Cyndi Lauper, a shoe factory",      difficulty: 2 },
  { id: 32, title: "Beetlejuice",         hint: "The ghost with the most",           difficulty: 3 },
  { id: 33, title: "Spamalot",            hint: "Monty Python on Broadway",          difficulty: 2 },
  { id: 34, title: "Avenue Q",            hint: "Puppets, but very adult",           difficulty: 2 },
  { id: 35, title: "Matilda",             hint: "Roald Dahl, a gifted girl",         difficulty: 2 },
  { id: 36, title: "Frozen",              hint: "Let it go",                         difficulty: 1 },
  { id: 37, title: "Aladdin",             hint: "A whole new world",                 difficulty: 1 },
  { id: 38, title: "Tarzan",              hint: "Phil Collins, the jungle",          difficulty: 1 },
  { id: 39, title: "The Lion King",       hint: "Hakuna matata",                     difficulty: 2 },
  { id: 40, title: "The Producers",       hint: "Springtime for a flop-turned-hit",  difficulty: 3 },
  { id: 41, title: "The Wiz",             hint: "Ease on down the road",             difficulty: 1 },
  { id: 42, title: "Dear Evan Hansen",    hint: "Waving through a window",           difficulty: 3 },
  { id: 43, title: "Spring Awakening",    hint: "Teen angst, Duncan Sheik",          difficulty: 3 },
  { id: 44, title: "Next to Normal",      hint: "A family and mental illness",       difficulty: 3 },
  { id: 45, title: "In the Heights",      hint: "Washington Heights, Miranda",       difficulty: 3 },
  { id: 46, title: "Bring It On",         hint: "Cheerleading musical",              difficulty: 2 },
  { id: 47, title: "Cinderella",          hint: "A glass slipper, R&H",              difficulty: 2 },
  { id: 48, title: "Pajama Game",         hint: "A factory romance, Adler & Ross",   difficulty: 2 },
  { id: 49, title: "Damn Yankees",        hint: "A deal with the devil for baseball",difficulty: 3 },
  { id: 50, title: "Funny Girl",          hint: "Fanny Brice, don't rain on...",     difficulty: 2 },
  { id: 51, title: "Sunset Boulevard",    hint: "Norma Desmond's close-up",          difficulty: 3 },
  { id: 52, title: "Evita",               hint: "Don't cry for me...",               difficulty: 1 },
  { id: 53, title: "Camelot",             hint: "Lerner & Loewe, King Arthur",       difficulty: 2 },
  { id: 54, title: "Brigadoon",           hint: "A village that wakes once a century",difficulty: 3 },
  { id: 55, title: "Hairspray",           hint: "Good morning, Baltimore",           difficulty: 2 },
  { id: 56, title: "Memphis",             hint: "Early rock and roll radio",         difficulty: 2 },
  { id: 57, title: "Come From Away",      hint: "Gander welcomes the world",         difficulty: 3 },
  { id: 58, title: "The Color Purple",    hint: "Alice Walker, Celie's journey",     difficulty: 3 },
  { id: 59, title: "Bandstand",           hint: "Post-WWII swing band",              difficulty: 2 },
  { id: 60, title: "Tootsie",             hint: "An actor in disguise",              difficulty: 2 },
  { id: 61, title: "Anastasia",           hint: "A lost Russian princess",           difficulty: 2 },
  { id: 62, title: "Amelie",              hint: "A whimsical Parisian",              difficulty: 2 },
  { id: 63, title: "Bonnie and Clyde",    hint: "Depression-era outlaws",            difficulty: 3 },
  { id: 64, title: "Big Fish",            hint: "A father's tall tales",             difficulty: 2 },
  { id: 65, title: "Shrek",               hint: "An ogre's swamp",                   difficulty: 1 },
  { id: 66, title: "Tina",                hint: "Simply the best",                   difficulty: 1 },
  { id: 67, title: "Beautiful",           hint: "The Carole King musical",           difficulty: 2 },
  { id: 68, title: "On the Town",         hint: "Three sailors, 24 hours in NYC",    difficulty: 2 },
  { id: 69, title: "Kiss Me Kate",        hint: "Cole Porter meets Shakespeare",     difficulty: 3 },
  { id: 70, title: "Guys and Dolls",      hint: "Gamblers and a mission doll",       difficulty: 3 }
];
