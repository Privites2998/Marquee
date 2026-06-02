/* Now Playing — daily puzzles.
   Guess the show. A teasing blurb shows from the start; five clues reveal one
   at a time on wrong guesses, ordered most-vague -> most-specific (the last
   clue is a near-giveaway: a signature song or unmistakable detail).

   Fact-bound content — keep clues accurate. Extend the list to grow the
   rotation. (Replaces the old "Name the Actor" game.)
*/
window.NowPlayingPuzzles = [
  {
    id: 1, name: "Hamilton", aliases: ["hamilton"],
    blurb: "A sung-and-rapped biography of an American founding father, told largely by performers of color.",
    clues: [
      "Premiered at the Public Theater before transferring to Broadway in 2015.",
      "Music, lyrics, and book all by one person — who also originated the title role.",
      "Won the 2016 Pulitzer Prize for Drama and a record-tying 11 Tony Awards.",
      "Features King George III singing the breakup-letter number 'You'll Be Back.'",
      "Opening line: 'How does a bastard, orphan, son of a whore...' — 'My Shot' follows."
    ]
  },
  {
    id: 2, name: "Wicked", aliases: ["wicked"],
    blurb: "An untold backstory set in a familiar land of yellow bricks and emerald cities.",
    clues: [
      "Based on a Gregory Maguire novel reimagining a classic 1939 film.",
      "Centers on the friendship between two young women at Shiz University.",
      "Music and lyrics by Stephen Schwartz; opened on Broadway in 2003.",
      "One heroine is green-skinned; the other is relentlessly popular.",
      "Act One ends with Elphaba rising on a broom belting 'Defying Gravity.'"
    ]
  },
  {
    id: 3, name: "Rent", aliases: ["rent"],
    blurb: "Bohemian artists in New York's East Village face love, art, and AIDS over one year.",
    clues: [
      "Loosely based on Puccini's opera 'La Bohème.'",
      "Written by Jonathan Larson, who died the night before its first off-Broadway preview.",
      "Won the 1996 Pulitzer Prize for Drama and the Tony for Best Musical.",
      "Characters include Roger, Mimi, Mark, Angel, and Maureen.",
      "Its anthem asks how you measure a year: 'Seasons of Love' — 525,600 minutes."
    ]
  },
  {
    id: 4, name: "Les Miserables", aliases: ["les miserables", "les mis", "les miz", "les misérables"],
    blurb: "Across decades in 19th-century France, a paroled convict is hunted by a relentless policeman.",
    clues: [
      "Adapted from an 1862 Victor Hugo novel.",
      "A sung-through megamusical that opened in London in 1985.",
      "Jean Valjean is prisoner 24601; his pursuer is Inspector Javert.",
      "Climaxes at a student barricade in the June Rebellion of 1832.",
      "Its rallying cry: 'Do You Hear the People Sing?'; Fantine sings 'I Dreamed a Dream.'"
    ]
  },
  {
    id: 5, name: "The Phantom of the Opera", aliases: ["the phantom of the opera", "phantom of the opera", "phantom"],
    blurb: "A disfigured musical genius haunts a Paris opera house and obsesses over a young soprano.",
    clues: [
      "Based on a 1910 Gaston Leroux novel.",
      "Andrew Lloyd Webber score; opened in London in 1986.",
      "Was Broadway's longest-running show in history when it closed in 2023.",
      "A crashing chandelier is the production's signature coup de théâtre.",
      "The masked title character lures Christine with 'The Music of the Night.'"
    ]
  },
  {
    id: 6, name: "Cats", aliases: ["cats"],
    blurb: "A tribe of felines gathers one night to decide which of them will be reborn.",
    clues: [
      "Based on a book of poems by T.S. Eliot.",
      "Andrew Lloyd Webber musical that opened in 1981; nearly plotless and dance-heavy.",
      "The cats are called the Jellicles; the chosen one ascends to the Heaviside Layer.",
      "Notoriously adapted into a much-mocked 2019 film.",
      "Grizabella, the faded glamour cat, sings 'Memory.'"
    ]
  },
  {
    id: 7, name: "Chicago", aliases: ["chicago"],
    blurb: "In the Jazz Age, two murderesses chase fame and acquittal with a slick lawyer's help.",
    clues: [
      "A Kander & Ebb musical staged in the style of a vaudeville.",
      "Bob Fosse choreographed the 1975 original; the 1996 revival is still running.",
      "Its leads are Roxie Hart and Velma Kelly; the lawyer is Billy Flynn.",
      "Became a Best Picture-winning film in 2002.",
      "Numbers include 'All That Jazz,' 'Cell Block Tango,' and 'Razzle Dazzle.'"
    ]
  },
  {
    id: 8, name: "Hadestown", aliases: ["hadestown"],
    blurb: "A folk-and-jazz retelling of two intertwined Greek myths set in a hard-times underworld.",
    clues: [
      "Began as Anaïs Mitchell's concept album before its stage life.",
      "Won eight Tony Awards including Best Musical in 2019.",
      "Retells the myths of Orpheus & Eurydice and Hades & Persephone.",
      "Narrated by the messenger god Hermes.",
      "Orpheus must not look back as he sings 'Wait for Me' walking out of hell."
    ]
  },
  {
    id: 9, name: "Dear Evan Hansen", aliases: ["dear evan hansen", "deh"],
    blurb: "An anxious teenager's lie about a classmate spirals into something he can't control.",
    clues: [
      "Score by the team of Benj Pasek and Justin Paul.",
      "Won the 2017 Tony for Best Musical.",
      "The plot turns on a letter and a misunderstood suicide.",
      "The title character wears a cast signed by no one.",
      "Its breakout song is 'Waving Through a Window.'"
    ]
  },
  {
    id: 10, name: "The Lion King", aliases: ["the lion king", "lion king"],
    blurb: "A coming-of-age story on the African savanna, staged with towering puppets and masks.",
    clues: [
      "Adapted from a 1994 animated Disney film.",
      "Director Julie Taymor won a Tony for her groundbreaking design; opened 1997.",
      "A young prince flees after his father's death, then returns to claim his place.",
      "Characters include Simba, Mufasa, Scar, Timon, and Pumbaa.",
      "It opens with 'The Circle of Life' and the Zulu cry 'Nants ingonyama.'"
    ]
  },
  {
    id: 11, name: "Hairspray", aliases: ["hairspray"],
    blurb: "A big-hearted teen dreams of dancing on TV and ends up fighting to integrate the show.",
    clues: [
      "Based on a 1988 John Waters film, set in 1962 Baltimore.",
      "Won the 2003 Tony for Best Musical; score by Marc Shaiman.",
      "The lead role of the mother is traditionally played by a man in drag.",
      "Heroine Tracy Turnblad wants to dance on 'The Corny Collins Show.'",
      "It opens with Tracy singing 'Good Morning Baltimore.'"
    ]
  },
  {
    id: 12, name: "Annie", aliases: ["annie"],
    blurb: "A plucky orphan in the Depression is taken in by a billionaire and searches for her parents.",
    clues: [
      "Based on the comic strip 'Little Orphan Annie.'",
      "Opened on Broadway in 1977; features a dog named Sandy.",
      "The orphans live under the cruel Miss Hannigan; the benefactor is Daddy Warbucks.",
      "Set largely in 1933 New York during the Great Depression.",
      "Its optimistic anthem promises the sun'll come out 'Tomorrow.'"
    ]
  },
  {
    id: 13, name: "Into the Woods", aliases: ["into the woods"],
    blurb: "Fairy-tale characters' wishes collide — and Act Two shows what happens after 'happily ever after.'",
    clues: [
      "Music and lyrics by Stephen Sondheim, book by James Lapine.",
      "Opened on Broadway in 1987.",
      "A childless baker and his wife must undo a witch's curse.",
      "Weaves together Cinderella, Jack, Rapunzel, and Little Red Riding Hood.",
      "The witch warns 'Children Will Listen'; a giant terrorizes the second act."
    ]
  },
  {
    id: 14, name: "Sweeney Todd", aliases: ["sweeney todd", "sweeney"],
    blurb: "A wronged barber returns to London bent on revenge, with grisly help from his neighbor.",
    clues: [
      "A Stephen Sondheim musical thriller, subtitled 'The Demon Barber of Fleet Street.'",
      "Opened on Broadway in 1979 and won the Tony for Best Musical.",
      "The barber's accomplice bakes his victims into meat pies.",
      "Set in Victorian London; the accomplice is Mrs. Lovett.",
      "Numbers include 'A Little Priest' and 'Not While I'm Around.'"
    ]
  },
  {
    id: 15, name: "The Book of Mormon", aliases: ["the book of mormon", "book of mormon"],
    blurb: "Two mismatched missionaries are sent to Uganda in a very irreverent comedy.",
    clues: [
      "Written by the creators of 'South Park' with composer Robert Lopez.",
      "Won nine Tony Awards including Best Musical in 2011.",
      "Follows Elder Price and Elder Cunningham on their mission.",
      "Famous for being gleefully profane and satirical about religion.",
      "Opens with bright-eyed missionaries ringing doorbells in 'Hello!'"
    ]
  },
  {
    id: 16, name: "West Side Story", aliases: ["west side story"],
    blurb: "A Romeo-and-Juliet romance plays out between rival gangs on the streets of New York.",
    clues: [
      "Bernstein and Sondheim score; Jerome Robbins choreography; opened 1957.",
      "Reimagines Shakespeare's 'Romeo and Juliet.'",
      "The rival gangs are the Jets and the Sharks.",
      "Lovers Tony and Maria meet at a dance.",
      "Songs include 'Tonight,' 'Maria,' and 'America.'"
    ]
  },
  {
    id: 17, name: "Fiddler on the Roof", aliases: ["fiddler on the roof", "fiddler"],
    blurb: "A milkman clings to faith and tradition as the world changes around his daughters.",
    clues: [
      "Set in the shtetl of Anatevka in Tsarist Russia, 1905.",
      "Opened on Broadway in 1964; based on Sholem Aleichem's stories.",
      "The father, Tevye, has five daughters and argues with God.",
      "Bock and Harnick score.",
      "Its opening number is, fittingly, 'Tradition.'"
    ]
  },
  {
    id: 18, name: "Mamma Mia", aliases: ["mamma mia", "mamma mia!"],
    blurb: "On a Greek island, a bride-to-be secretly invites three men who might be her father.",
    clues: [
      "A jukebox musical built entirely from one pop group's catalog.",
      "Opened in London in 1999; spawned a hit 2008 film with Meryl Streep.",
      "The bride is Sophie; her mother is Donna, who runs a taverna.",
      "Every song is by the Swedish group ABBA.",
      "Numbers include 'Dancing Queen,' 'Take a Chance on Me,' and the title song."
    ]
  },
  {
    id: 19, name: "Cabaret", aliases: ["cabaret"],
    blurb: "In a seedy nightclub, decadence carries on as the Nazis rise in Weimar Berlin.",
    clues: [
      "A Kander & Ebb musical that opened in 1966.",
      "Set in 1931 Berlin at the Kit Kat Klub.",
      "Hosted by a sinister, rouged Emcee; the star performer is Sally Bowles.",
      "Inspired by Christopher Isherwood's Berlin stories.",
      "Sally insists 'life is a Cabaret, old chum' in the title number."
    ]
  },
  {
    id: 20, name: "In the Heights", aliases: ["in the heights"],
    blurb: "Over a sweltering few days, a tight-knit Latino neighborhood chases its dreams.",
    clues: [
      "Lin-Manuel Miranda's first Broadway musical, before 'Hamilton.'",
      "Won the 2008 Tony for Best Musical.",
      "Set in the largely Dominican neighborhood of Washington Heights.",
      "Centers on bodega owner Usnavi and a winning lottery ticket.",
      "It opens with Usnavi rapping the title number about his corner."
    ]
  },
  {
    id: 21, name: "The Sound of Music", aliases: ["the sound of music", "sound of music"],
    blurb: "A free-spirited young woman becomes governess to a widowed captain's seven children in pre-war Austria.",
    clues: [
      "The final stage collaboration of Rodgers and Hammerstein, from 1959.",
      "Inspired by the real-life von Trapp Family Singers.",
      "The family escapes over the mountains to flee the Nazi Anschluss.",
      "A restless novice nun named Maria is sent from the abbey to the captain's home.",
      "Maria spins on a hilltop singing the title song, then teaches the kids 'Do-Re-Mi.'"
    ]
  },
  {
    id: 22, name: "Oklahoma!", aliases: ["oklahoma", "oklahoma!"],
    blurb: "Cowboys and farmers in a soon-to-be state square off over love and land.",
    clues: [
      "The very first musical by Rodgers and Hammerstein, a 1943 landmark.",
      "Set in Indian Territory just after 1900.",
      "Agnes de Mille's groundbreaking dream ballet closes Act One.",
      "Curly and Laurey's romance is shadowed by the menacing farmhand Jud Fry.",
      "Curly opens with 'Oh, What a Beautiful Mornin'' before the cast belts the title song."
    ]
  },
  {
    id: 23, name: "Guys and Dolls", aliases: ["guys and dolls"],
    blurb: "Gamblers, showgirls, and missionaries collide in a fairy tale of old New York.",
    clues: [
      "Based on stories by Damon Runyon, with music and lyrics by Frank Loesser.",
      "Opened on Broadway in 1950 and won the Best Musical Tony.",
      "A high-stakes bet hinges on taking a mission worker to Havana.",
      "Characters include Nathan Detroit, Sky Masterson, and Miss Adelaide.",
      "Sky rolls the dice in a sewer singing 'Luck Be a Lady.'"
    ]
  },
  {
    id: 24, name: "A Chorus Line", aliases: ["a chorus line", "chorus line"],
    blurb: "Dancers bare their souls at a grueling audition for a Broadway show.",
    clues: [
      "Conceived and directed by Michael Bennett from taped dancer interviews.",
      "Won the 1976 Pulitzer Prize for Drama and the Best Musical Tony.",
      "Plays out entirely on a bare stage during a single audition.",
      "A director named Zach questions seventeen dancers about their lives.",
      "It ends with the company in gold top hats high-kicking to 'One.'"
    ]
  },
  {
    id: 25, name: "Jersey Boys", aliases: ["jersey boys"],
    blurb: "Four blue-collar kids from New Jersey become a chart-topping 1960s pop group.",
    clues: [
      "A jukebox musical told in four 'seasons,' each narrated by a different member.",
      "Won the 2006 Tony for Best Musical.",
      "Chronicles the rise of Frankie Valli and the Four Seasons.",
      "Hits include 'Sherry,' 'Walk Like a Man,' and 'Big Girls Don't Cry.'",
      "Frankie's falsetto soars on 'Can't Take My Eyes Off You.'"
    ]
  },
  {
    id: 26, name: "Come From Away", aliases: ["come from away"],
    blurb: "When 38 planes are grounded after 9/11, a small town takes in thousands of stranded strangers.",
    clues: [
      "A Canadian musical performed in one continuous act by a tight ensemble.",
      "Set in Gander, Newfoundland, in September 2001.",
      "Based on true stories from the week the passengers were stranded.",
      "Features Beverley Bass, the first female American Airlines captain.",
      "It opens with the townsfolk singing 'Welcome to the Rock.'"
    ]
  },
  {
    id: 27, name: "Six", aliases: ["six", "six the musical"],
    blurb: "The wives of an English king reclaim their stories as a pop-concert competition.",
    clues: [
      "A British musical staged as a one-act pop-star showdown.",
      "Each queen is modeled on a modern pop diva, from Beyoncé to Adele.",
      "The six wives of Henry VIII compete over who suffered most.",
      "Their fates: 'divorced, beheaded, died, divorced, beheaded, survived.'",
      "The queens introduce themselves in the opening number, 'Ex-Wives.'"
    ]
  },
  {
    id: 28, name: "Newsies", aliases: ["newsies"],
    blurb: "Newsboys in 1899 New York strike against the papers' powerful publishers.",
    clues: [
      "A Disney musical based on its 1992 film flop turned cult favorite.",
      "Songs by Alan Menken and Jack Feldman.",
      "Dramatizes the real 1899 Newsboys' Strike against Pulitzer and Hearst.",
      "Led by Jack Kelly, the boys fight a price hike on their papers.",
      "They rally with 'Seize the Day' and dream of 'Santa Fe.'"
    ]
  },
  {
    id: 29, name: "Avenue Q", aliases: ["avenue q"],
    blurb: "Puppets and people on a shabby city street muddle through adulthood.",
    clues: [
      "A raunchy puppet musical for adults, styled after 'Sesame Street.'",
      "Won the 2004 Tony for Best Musical over 'Wicked.'",
      "A recent college grad named Princeton searches for his purpose.",
      "Numbers include 'It Sucks to Be Me' and 'The Internet Is for Porn.'",
      "The cast cheerfully insists 'Everyone's a Little Bit Racist.'"
    ]
  },
  {
    id: 30, name: "Jesus Christ Superstar", aliases: ["jesus christ superstar", "superstar"],
    blurb: "The last days of Jesus are told through the eyes of a conflicted Judas.",
    clues: [
      "A sung-through rock opera by Andrew Lloyd Webber and Tim Rice.",
      "Began as a 1970 concept album before reaching the stage.",
      "Covers the final week leading to the crucifixion.",
      "Judas Iscariot narrates, opening with 'Heaven on Their Minds.'",
      "Mary Magdalene sings 'I Don't Know How to Love Him.'"
    ]
  },
  {
    id: 31, name: "Evita", aliases: ["evita"],
    blurb: "A poor Argentine girl claws her way to become her nation's beloved first lady.",
    clues: [
      "An Andrew Lloyd Webber and Tim Rice rock opera, sung through.",
      "Narrated by a sardonic everyman named Che.",
      "Traces the rise of Eva Perón from actress to political icon.",
      "Set in 1940s and 50s Argentina around Juan Perón's presidency.",
      "Eva addresses the crowd from a balcony: 'Don't Cry for Me Argentina.'"
    ]
  },
  {
    id: 32, name: "Funny Girl", aliases: ["funny girl"],
    blurb: "A gawky girl with an enormous voice becomes a Ziegfeld superstar while love falters.",
    clues: [
      "A 1964 musical that made a young Barbra Streisand a star.",
      "Loosely based on the life of comedian Fanny Brice.",
      "Set in the Ziegfeld Follies era of early-1900s New York.",
      "Fanny's marriage to the gambler Nick Arnstein slowly unravels.",
      "She defiantly belts 'Don't Rain on My Parade.'"
    ]
  }
];
