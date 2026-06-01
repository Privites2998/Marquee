/* Setlist — daily puzzles.
   The show is given; put its songs in the order they're performed. Each
   `songs` array is the CORRECT running order (the game shuffles it for play).
   Five songs each, chosen with clear act/position anchors (opening number →
   Act One finale → late Act Two) so the order is unambiguous.

   Fact-bound: verify song order before expanding heavily.
*/
window.SetlistPuzzles = [
  { id: 1,  show: "Hamilton",
    songs: ["Alexander Hamilton", "My Shot", "The Schuyler Sisters", "Satisfied", "Non-Stop"] },
  { id: 2,  show: "Wicked",
    songs: ["The Wizard and I", "What Is This Feeling?", "Popular", "Defying Gravity", "For Good"] },
  { id: 3,  show: "Les Misérables",
    songs: ["I Dreamed a Dream", "Castle on a Cloud", "Do You Hear the People Sing?", "One Day More", "Bring Him Home"] },
  { id: 4,  show: "Rent",
    songs: ["Rent", "One Song Glory", "Light My Candle", "La Vie Bohème", "Seasons of Love"] },
  { id: 5,  show: "The Phantom of the Opera",
    songs: ["Think of Me", "The Phantom of the Opera", "The Music of the Night", "Masquerade", "The Point of No Return"] },
  { id: 6,  show: "Hadestown",
    songs: ["Road to Hell", "Wedding Song", "Way Down Hadestown", "Wait for Me", "Doubt Comes In"] },
  { id: 7,  show: "The Sound of Music",
    songs: ["The Sound of Music", "My Favorite Things", "Do-Re-Mi", "Sixteen Going on Seventeen", "Edelweiss"] },
  { id: 8,  show: "Annie",
    songs: ["Maybe", "It's the Hard-Knock Life", "Tomorrow", "Easy Street", "I Don't Need Anything But You"] },
  { id: 9,  show: "Dear Evan Hansen",
    songs: ["Anybody Have a Map?", "Waving Through a Window", "For Forever", "You Will Be Found", "Words Fail"] },
  { id: 10, show: "Chicago",
    songs: ["All That Jazz", "Cell Block Tango", "When You're Good to Mama", "Razzle Dazzle", "Nowadays"] },
  { id: 11, show: "Hairspray",
    songs: ["Good Morning Baltimore", "The Nicest Kids in Town", "Welcome to the 60's", "Big, Blonde and Beautiful", "You Can't Stop the Beat"] },
  { id: 12, show: "The Lion King",
    songs: ["Circle of Life", "I Just Can't Wait to Be King", "Be Prepared", "Hakuna Matata", "Can You Feel the Love Tonight"] },
  { id: 13, show: "Cabaret",
    songs: ["Willkommen", "Don't Tell Mama", "Maybe This Time", "Cabaret", "Finale"] },
  { id: 14, show: "Into the Woods",
    songs: ["Prologue: Into the Woods", "I Know Things Now", "Agony", "It Takes Two", "No One Is Alone"] }
];
