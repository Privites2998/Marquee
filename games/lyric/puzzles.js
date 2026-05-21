/* Lyric — two-stage puzzles.
   Each entry: a lyric snippet, the show, the song, and accepted aliases.
   Aliases are matched case-/punctuation-/whitespace-insensitive.
   Keep lyric snippets short (1–3 lines) and famous enough that the song is
   identifiable on its own, with the show as a lead-in.
*/
window.LyricPuzzles = [
  {
    id: 1,
    lyric: "I am not throwing away my shot,\nI am not throwing away my shot.\nHey yo, I'm just like my country —\nI'm young, scrappy and hungry…",
    show: { answer: "Hamilton", aliases: ["hamilton"] },
    song: { answer: "My Shot", aliases: ["my shot"] },
    note: "Act One. Hamilton, Laurens, Mulligan, Lafayette."
  },
  {
    id: 2,
    lyric: "Something has changed within me,\nsomething is not the same.\nI'm through with playing by the rules\nof someone else's game.",
    show: { answer: "Wicked", aliases: ["wicked"] },
    song: { answer: "Defying Gravity", aliases: ["defying gravity"] },
    note: "Act One finale. Elphaba, just before the broom."
  },
  {
    id: 3,
    lyric: "Five hundred twenty-five thousand\nsix hundred minutes —\nhow do you measure a year in the life?",
    show: { answer: "Rent", aliases: ["rent"] },
    song: { answer: "Seasons of Love", aliases: ["seasons of love"] },
    note: "Act Two opener. The full company, downstage."
  },
  {
    id: 4,
    lyric: "There was a time when men were kind,\nwhen their voices were soft\nand their words inviting.",
    show: { answer: "Les Misérables", aliases: ["les miserables", "les mis", "les miz", "les misérables"] },
    song: { answer: "I Dreamed a Dream", aliases: ["i dreamed a dream"] },
    note: "Fantine, after the factory."
  },
  {
    id: 5,
    lyric: "Midnight, not a sound from the pavement.\nHas the moon lost her memory?\nShe is smiling alone.",
    show: { answer: "Cats", aliases: ["cats"] },
    song: { answer: "Memory", aliases: ["memory"] },
    note: "Grizabella, beneath the moon."
  },
  {
    id: 6,
    lyric: "On the outside, always looking in.\nWill I ever be more than I've always been?",
    show: { answer: "Dear Evan Hansen", aliases: ["dear evan hansen", "deh"] },
    song: { answer: "Waving Through a Window", aliases: ["waving through a window"] },
    note: "Evan, alone with a cast on his arm."
  },
  {
    id: 7,
    lyric: "Wait for me, I'm coming.\nWait, I'm coming with you.\nWait for me, I'm coming too —\nI'm coming too.",
    show: { answer: "Hadestown", aliases: ["hadestown"] },
    song: { answer: "Wait for Me", aliases: ["wait for me"] },
    note: "Orpheus, descending."
  },
  {
    id: 8,
    lyric: "Night-time sharpens, heightens each sensation.\nDarkness stirs and wakes imagination.",
    show: { answer: "The Phantom of the Opera", aliases: ["phantom of the opera", "the phantom of the opera", "phantom"] },
    song: { answer: "The Music of the Night", aliases: ["the music of the night", "music of the night"] },
    note: "The Phantom, leading Christine down."
  },
  {
    id: 9,
    lyric: "Good morning, Baltimore!\nEvery day's like an open door.\nEvery night is a fantasy —\nevery sound's like a symphony.",
    show: { answer: "Hairspray", aliases: ["hairspray"] },
    song: { answer: "Good Morning Baltimore", aliases: ["good morning baltimore", "good morning, baltimore"] },
    note: "Tracy Turnblad, before the school bell."
  },
  {
    id: 10,
    lyric: "The sun'll come out tomorrow,\nbet your bottom dollar that tomorrow\nthere'll be sun.",
    show: { answer: "Annie", aliases: ["annie"] },
    song: { answer: "Tomorrow", aliases: ["tomorrow"] },
    note: "The orphan, looking up."
  }
];
