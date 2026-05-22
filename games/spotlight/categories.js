/* Spotlight — daily trivia categories.
   Each entry: a category title + 5 clues with accepted answers.
   Answers match fuzzy (case/punctuation insensitive, leading "the" stripped).
   Use aliases for common short forms.
*/
window.SpotlightPuzzles = [
  {
    id: 1,
    category: "Tony-Winning Leading Ladies",
    clues: [
      {
        clue: "She won the 2004 Tony for Best Actress in a Musical playing the green witch in 'Wicked.'",
        answer: "Idina Menzel",
        aliases: ["idina", "menzel"]
      },
      {
        clue: "Six Tonys to her name — the all-time record for any performer.",
        answer: "Audra McDonald",
        aliases: ["audra", "mcdonald", "audra mcdonald"]
      },
      {
        clue: "Her 1980 Tony for Best Actress in a Musical came playing Eva Perón.",
        answer: "Patti LuPone",
        aliases: ["lupone", "patty lupone"]
      },
      {
        clue: "Two Tonys: 'Thoroughly Modern Millie' in 2002 and 'Anything Goes' in 2011.",
        answer: "Sutton Foster",
        aliases: ["sutton", "foster"]
      },
      {
        clue: "Her 1999 Tony came for 'Annie Get Your Gun,' but she's better known for Sondheim leading roles.",
        answer: "Bernadette Peters",
        aliases: ["bernadette", "peters"]
      }
    ]
  },
  {
    id: 2,
    category: "Andrew Lloyd Webber",
    clues: [
      {
        clue: "His 1986 musical about a disfigured musician living beneath the Paris Opera became Broadway's longest-running show.",
        answer: "The Phantom of the Opera",
        aliases: ["phantom of the opera", "phantom"]
      },
      {
        clue: "His 1981 T.S. Eliot adaptation; remember the eyes on the poster.",
        answer: "Cats",
        aliases: []
      },
      {
        clue: "His rock opera with Tim Rice depicting the last week of Christ's life.",
        answer: "Jesus Christ Superstar",
        aliases: ["jcs", "superstar"]
      },
      {
        clue: "His musical about Eva Perón — launched Patti LuPone and Mandy Patinkin.",
        answer: "Evita",
        aliases: []
      },
      {
        clue: "His 1994 musical about a faded silent-film star, based on a Billy Wilder film.",
        answer: "Sunset Boulevard",
        aliases: ["sunset blvd", "sunset"]
      }
    ]
  },
  {
    id: 3,
    category: "Sondheim Shows",
    clues: [
      {
        clue: "His 1979 musical about a demon barber and the meat pies of Mrs. Lovett.",
        answer: "Sweeney Todd",
        aliases: ["sweeney"]
      },
      {
        clue: "His 1984 musical inspired by Georges Seurat's pointillist painting in the Art Institute of Chicago.",
        answer: "Sunday in the Park with George",
        aliases: ["sunday in the park"]
      },
      {
        clue: "His 1987 fairy-tale mashup featuring Cinderella, Jack, Rapunzel, and Red Riding Hood.",
        answer: "Into the Woods",
        aliases: []
      },
      {
        clue: "His 1970 musical centered on Bobby's 35th birthday and the married couples in his life.",
        answer: "Company",
        aliases: []
      },
      {
        clue: "His 1971 concept musical about a reunion of former Weismann showgirls.",
        answer: "Follies",
        aliases: []
      }
    ]
  },
  {
    id: 4,
    category: "Opened in the 21st Century",
    clues: [
      {
        clue: "Stephen Schwartz's 2003 prequel about the witches of Oz.",
        answer: "Wicked",
        aliases: []
      },
      {
        clue: "Lin-Manuel Miranda's 2015 hip-hop musical about America's first treasury secretary.",
        answer: "Hamilton",
        aliases: []
      },
      {
        clue: "Trey Parker, Matt Stone, and Robert Lopez's 2011 satirical musical about LDS missionaries in Uganda.",
        answer: "The Book of Mormon",
        aliases: ["book of mormon"]
      },
      {
        clue: "Anaïs Mitchell's 2019 folk-opera adaptation of the Orpheus and Eurydice myth, set in a New Orleans-styled underworld.",
        answer: "Hadestown",
        aliases: []
      },
      {
        clue: "Toby Marlow and Lucy Moss's pop-concert musical about the wives of Henry VIII.",
        answer: "Six",
        aliases: ["six the musical"]
      }
    ]
  },
  {
    id: 5,
    category: "Disney on Broadway",
    clues: [
      {
        clue: "Julie Taymor's 1997 stage adaptation of the 1994 animated film about a lion cub destined to rule the Pridelands.",
        answer: "The Lion King",
        aliases: ["lion king"]
      },
      {
        clue: "The 1994 stage adaptation that began Disney's Broadway era — 'a tale as old as time.'",
        answer: "Beauty and the Beast",
        aliases: ["beauty and the beast"]
      },
      {
        clue: "The 2014 musical adaptation of Disney's 1992 animated film about a street rat with a magic lamp.",
        answer: "Aladdin",
        aliases: []
      },
      {
        clue: "The 2018 musical bringing Anna, Elsa, and Arendelle to Broadway.",
        answer: "Frozen",
        aliases: []
      },
      {
        clue: "The 2012 musical about turn-of-the-century strike-leading paperboys, adapted from the 1992 Christian Bale film.",
        answer: "Newsies",
        aliases: []
      }
    ]
  },
  {
    id: 6,
    category: "One-Word Show Titles",
    clues: [
      {
        clue: "Stephen Schwartz's 2003 musical about the witches of Oz.",
        answer: "Wicked",
        aliases: []
      },
      {
        clue: "Lin-Manuel Miranda's 2015 hip-hop musical about a founding father.",
        answer: "Hamilton",
        aliases: []
      },
      {
        clue: "T.S. Eliot's poems-turned-musical, opening on Broadway in 1982.",
        answer: "Cats",
        aliases: []
      },
      {
        clue: "Bob Fosse's 1975 musical about murderesses on death row in 1920s Illinois.",
        answer: "Chicago",
        aliases: []
      },
      {
        clue: "The 1979 Andrew Lloyd Webber musical about Eva Perón.",
        answer: "Evita",
        aliases: []
      }
    ]
  },
  {
    id: 7,
    category: "Movie to Musical",
    clues: [
      {
        clue: "John Waters' 1988 film about a Baltimore teen integrating a TV dance show; 2002 musical.",
        answer: "Hairspray",
        aliases: []
      },
      {
        clue: "The 2007 musical adapted from the 2001 Reese Witherspoon college comedy about a sorority girl at Harvard Law.",
        answer: "Legally Blonde",
        aliases: ["legally blonde the musical"]
      },
      {
        clue: "The 2017 musical based on Tina Fey's 2004 high-school cliques comedy.",
        answer: "Mean Girls",
        aliases: []
      },
      {
        clue: "The 2009 Dolly Parton musical based on the 1980 office-revolt comedy.",
        answer: "9 to 5",
        aliases: ["nine to five", "9 to 5 the musical"]
      },
      {
        clue: "The 2011 musical version of the 1992 Whoopi Goldberg film about a singer hiding in a convent.",
        answer: "Sister Act",
        aliases: []
      }
    ]
  },
  {
    id: 8,
    category: "Pulitzer-Winning Musicals",
    clues: [
      {
        clue: "Marvin Hamlisch's 1975 musical about Broadway audition dancers — 1976 Pulitzer winner.",
        answer: "A Chorus Line",
        aliases: ["chorus line"]
      },
      {
        clue: "Sondheim's 1984 musical inspired by a Georges Seurat painting — 1985 Pulitzer winner.",
        answer: "Sunday in the Park with George",
        aliases: ["sunday in the park"]
      },
      {
        clue: "Jonathan Larson's 1996 musical about East Village artists — won that year's Pulitzer.",
        answer: "Rent",
        aliases: []
      },
      {
        clue: "Tom Kitt and Brian Yorkey's 2009 musical about a mother's bipolar disorder — 2010 Pulitzer winner.",
        answer: "Next to Normal",
        aliases: []
      },
      {
        clue: "Lin-Manuel Miranda's 2015 hip-hop musical — 2016 Pulitzer Prize for Drama.",
        answer: "Hamilton",
        aliases: []
      }
    ]
  }
];
