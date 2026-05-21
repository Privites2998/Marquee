/* Show Logo Reveal — daily puzzles.
   Each entry: a show name, accepted aliases, an SVG (original abstraction —
   we don't copy the actual trademarked logos), and a crops array.

   crops[i] = "x y w h" viewBox at stage i. Stage 0 is tightest (most hidden),
   stages increment on each wrong guess until the full SVG is shown.
*/
window.LogoPuzzles = [
  {
    id: 1,
    name: "Cats",
    aliases: ["cats"],
    svg: '<rect width="100" height="100" fill="#0a0a0a"/>' +
         '<ellipse cx="36" cy="50" rx="12" ry="20" fill="#f4c430"/>' +
         '<ellipse cx="36" cy="50" rx="2.5" ry="18" fill="#0a0a0a"/>' +
         '<ellipse cx="64" cy="50" rx="12" ry="20" fill="#f4c430"/>' +
         '<ellipse cx="64" cy="50" rx="2.5" ry="18" fill="#0a0a0a"/>',
    crops: ["62 44 8 14", "55 36 22 30", "40 26 45 50", "20 16 70 70", "0 0 100 100"],
    hint: "Yellow on black. Slits."
  },
  {
    id: 2,
    name: "Wicked",
    aliases: ["wicked"],
    svg: '<rect width="100" height="100" fill="#0a0a0a"/>' +
         '<path d="M 18 25 L 32 78 Q 33 80 35 78 L 50 50 L 65 78 Q 67 80 68 78 L 82 25" ' +
              'stroke="#a5e64a" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
         '<circle cx="50" cy="14" r="1.6" fill="#fff"/>' +
         '<circle cx="20" cy="18" r="0.9" fill="#fff"/>' +
         '<circle cx="80" cy="18" r="0.9" fill="#fff"/>',
    crops: ["46 52 10 12", "32 42 38 30", "18 28 65 55", "8 18 84 70", "0 0 100 100"],
    hint: "One letter. Green."
  },
  {
    id: 3,
    name: "The Phantom of the Opera",
    aliases: ["phantom of the opera", "the phantom of the opera", "phantom"],
    svg: '<rect width="100" height="100" fill="#0a0a0a"/>' +
         '<path d="M 36 22 Q 28 32 30 50 Q 31 70 44 78 L 64 78 Q 72 60 70 38 Q 66 26 56 22 Z" ' +
              'fill="#f4ecd8"/>' +
         '<ellipse cx="48" cy="42" rx="4.5" ry="2.2" fill="#0a0a0a"/>' +
         '<path d="M 52 50 Q 52.5 56 50 60" stroke="#5d4e3a" stroke-width="0.9" fill="none"/>' +
         '<path d="M 36 22 Q 50 18 56 22" stroke="#c9a04a" stroke-width="0.8" fill="none"/>',
    crops: ["45 39 10 8", "38 30 25 25", "25 20 55 60", "12 12 80 80", "0 0 100 100"],
    hint: "A mask, half a face."
  },
  {
    id: 4,
    name: "Hamilton",
    aliases: ["hamilton"],
    svg: '<rect width="100" height="100" fill="#0a0a0a"/>' +
         '<polygon points="50,38 56,56 76,56 60,67 66,86 50,75 34,86 40,67 24,56 44,56" fill="#c9a04a"/>' +
         '<circle cx="50" cy="25" r="4.5" fill="#c9a04a"/>' +
         '<path d="M 50 30 L 50 42" stroke="#c9a04a" stroke-width="3" stroke-linecap="round"/>' +
         '<path d="M 50 34 L 40 30 M 50 34 L 60 30" stroke="#c9a04a" stroke-width="2.2" stroke-linecap="round"/>',
    crops: ["46 22 10 12", "40 20 22 28", "26 16 50 56", "12 8 78 84", "0 0 100 100"],
    hint: "A figure on a star."
  },
  {
    id: 5,
    name: "The Lion King",
    aliases: ["lion king", "the lion king"],
    svg: '<rect width="100" height="100" fill="#0a0a0a"/>' +
         '<g stroke="#d97a1d" stroke-width="3" stroke-linecap="round">' +
           '<line x1="50" y1="8"  x2="50" y2="22"/>' +
           '<line x1="50" y1="78" x2="50" y2="92"/>' +
           '<line x1="8"  y1="50" x2="22" y2="50"/>' +
           '<line x1="78" y1="50" x2="92" y2="50"/>' +
           '<line x1="18" y1="18" x2="27" y2="27"/>' +
           '<line x1="73" y1="73" x2="82" y2="82"/>' +
           '<line x1="82" y1="18" x2="73" y2="27"/>' +
           '<line x1="18" y1="82" x2="27" y2="73"/>' +
         '</g>' +
         '<circle cx="50" cy="50" r="22" fill="#d97a1d"/>' +
         '<ellipse cx="42" cy="46" rx="3" ry="5.5" fill="#0a0a0a"/>' +
         '<ellipse cx="58" cy="46" rx="3" ry="5.5" fill="#0a0a0a"/>' +
         '<polygon points="50,53 46,60 54,60" fill="#0a0a0a"/>' +
         '<path d="M 42 64 Q 50 70 58 64" stroke="#0a0a0a" stroke-width="1.4" fill="none"/>',
    crops: ["46 50 8 12", "38 40 24 28", "24 28 52 50", "10 14 80 78", "0 0 100 100"],
    hint: "Animal sun."
  },
  {
    id: 6,
    name: "Six",
    aliases: ["six", "six the musical"],
    svg: '<rect width="100" height="100" fill="#0a0a0a"/>' +
         '<rect x="11" y="28" width="10" height="58" fill="#f4c430"/>' +
         '<rect x="25" y="28" width="10" height="58" fill="#7fbf2c"/>' +
         '<rect x="39" y="28" width="10" height="58" fill="#e6739f"/>' +
         '<rect x="53" y="28" width="10" height="58" fill="#9b7fbf"/>' +
         '<rect x="67" y="28" width="10" height="58" fill="#3ec8e0"/>' +
         '<rect x="81" y="28" width="10" height="58" fill="#e85a4f"/>' +
         '<g fill="#fff">' +
           '<polygon points="11,28 13,22 16,26 19,22 21,28"/>' +
           '<polygon points="25,28 27,22 30,26 33,22 35,28"/>' +
           '<polygon points="39,28 41,22 44,26 47,22 49,28"/>' +
           '<polygon points="53,28 55,22 58,26 61,22 63,28"/>' +
           '<polygon points="67,28 69,22 72,26 75,22 77,28"/>' +
           '<polygon points="81,28 83,22 86,26 89,22 91,28"/>' +
         '</g>',
    crops: ["38 50 14 18", "28 38 38 38", "16 28 60 56", "6 18 88 70", "0 0 100 100"],
    hint: "Six of them."
  },
  {
    id: 7,
    name: "The Book of Mormon",
    aliases: ["book of mormon", "the book of mormon"],
    svg: '<rect width="100" height="100" fill="#0a0a0a"/>' +
         '<circle cx="50" cy="32" r="9" fill="#c9a04a"/>' +
         '<rect x="40" y="40" width="20" height="38" fill="#c9a04a"/>' +
         '<polygon points="50,40 46,58 50,72 54,58" fill="#0a0a0a"/>' +
         '<rect x="42" y="46" width="6" height="3" fill="#f4ecd8"/>' +
         '<rect x="58" y="58" width="12" height="9" fill="#c9a04a" stroke="#0a0a0a" stroke-width="0.4"/>' +
         '<path d="M 60 58 L 60 55 Q 64 53 68 55 L 68 58" stroke="#c9a04a" stroke-width="1" fill="none"/>',
    crops: ["46 30 10 10", "38 22 28 32", "26 16 50 60", "12 8 78 84", "0 0 100 100"],
    hint: "Door-to-door, with a tie."
  }
];
