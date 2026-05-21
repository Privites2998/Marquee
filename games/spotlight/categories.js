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
  }
];
