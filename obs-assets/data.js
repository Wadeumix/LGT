// ここを編集してリーダーボード・チーム名簿を更新してください。
// このファイルだけを差し替えれば、レイアウト(HTML/CSS)には触れずに内容更新できます。

const LEADERBOARD = [
  { rank: 1, team: 'TEAM ALPHA', sp: 22 },
  { rank: 2, team: 'TEAM BRAVO', sp: 16 },
  { rank: 3, team: 'TEAM CHARLIE', sp: 12 },
  { rank: 4, team: 'TEAM DELTA', sp: 8 },
  { rank: 5, team: 'TEAM ECHO', sp: 6 },
];

// roster は複数チーム分を配列で用意すると、自動的に順番に切り替わります。
const ROSTERS = [
  {
    team: 'TEAM ALPHA',
    members: [
      { name: '選手A-1', role: 'DRIVER' },
      { name: '選手A-2', role: 'DRIVER' },
      { name: 'メカA', role: 'CREW' },
    ],
  },
  {
    team: 'TEAM BRAVO',
    members: [
      { name: '選手B-1', role: 'DRIVER' },
      { name: '選手B-2', role: 'DRIVER' },
      { name: 'メカB', role: 'CREW' },
    ],
  },
];
